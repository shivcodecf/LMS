import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const { lectureId, courseId } = useParams();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setMediaProgress(true);
      setBtnDisable(true);
      setUploadProgress(0);

      // Step 1: Get signed URL
      const signedRes = await axios.post(
        "http://52.63.40.222/api/v1/course/generate-upload-url",
        {
          fileName: file.name,
          fileType: file.type,
          folder: "lectures",
        },
        {
          withCredentials: true,
        }
      );

      const { signedUrl, fileUrl } = signedRes.data;

      // Step 2: Upload directly to S3
      const uploadRes = await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: ({ loaded, total }) => {
          if (total) {
            const progress = Math.round((loaded * 100) / total);
            setUploadProgress(progress);
          }
        },
      });

      console.log("Upload status:", uploadRes.status);

      // Step 3: Save URL in state
      setUploadVideoInfo({
        videoUrl: fileUrl,
      });

      setBtnDisable(false);
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const [
    removeLecture,
    {
      data: removeData,
      isLoading: removeisLoading,
      isSuccess: removeisSuccess,
      error: removeisError,
    },
  ] = useRemoveLectureMutation();

  const [editLecture, { data, isSuccess, error, isLoading }] =
    useEditLectureMutation();

  const { data: getLectureByIdData } = useGetLectureByIdQuery(lectureId);

  const editLectureHandler = async () => {
    console.log({
      lectureTitle,
      uploadVideoInfo,
      isFree,
      courseId,
      lectureId,
    });

    await editLecture({
      courseId,
      lectureId,
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    setLectureTitle(getLectureByIdData?.lecture?.lectureTitle || "");
    setIsFree(getLectureByIdData?.lecture?.isPreviewFree || false);
  }, [getLectureByIdData?.lecture]);

  useEffect(() => {
    if (isSuccess) toast.success(data?.message);
    if (error) toast.error(error?.message?.message);
  }, [error, isSuccess]);

  useEffect(() => {
    if (removeisSuccess) toast.success(removeData?.message);
    if (removeisError) toast.error(removeisError?.message?.message);
  }, [removeisSuccess, removeisError]);

  return (
    <Card className="border-none">
      <CardHeader>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            className="bg-red-500"
            disabled={removeisLoading}
            onClick={removeLectureHandler}
          >
            {removeisLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="border-none"
          />
        </div>

        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="border-none w-fit"
          />
        </div>

        <div className="flex items-center space-x-2 my-5">
          <input
  type="checkbox"
  checked={isFree}
  onChange={(e) => setIsFree(e.target.checked)}
/>
          <Label>Is this video free</Label>
        </div>

        {mediaProgress && (
          <div className="my-4 space-y-2">
            <Progress value={uploadProgress} className="h-4 rounded" />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-2">
          <Button
            className="bg-black text-white"
            onClick={editLectureHandler}
            disabled={btnDisable || mediaProgress || isLoading}
          >
            {mediaProgress ? "Uploading..." : "Update Lecture"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;