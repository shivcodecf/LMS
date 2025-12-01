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

const MEDIA_API = "http://localhost:8080/api/v1/media";

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
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false);
      }
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

  const [editLecture, { data, isSuccess, error, isLoading, fetch }] =
    useEditLectureMutation();

  const { data: getLectureByIdData } = useGetLectureByIdQuery(lectureId);

  const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideoInfo, isFree, courseId, lectureId });

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
    console.log(getLectureByIdData);
      setLectureTitle(getLectureByIdData?.lecture?.lectureTitle)
      setIsFree(getLectureByIdData?.lecture?.isPreviewFree)
  }, [getLectureByIdData?.lecture]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
    }

    if (error) {
      toast.error(error?.message?.message);
    }
  }, [error, isSuccess]);

  useEffect(() => {
    if (removeisSuccess) {
      toast.success(removeData?.message);
    }

    if (removeisError) {
      toast.error(removeisError?.message?.message);
    }
  }, [error, removeisSuccess, removeisError]);

  return (
    <Card className="border-none">
      <CardHeader clasName="flex justify-between">
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
        <div className="">
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Intro. to javascript"
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
            placeholder="Intro. to javascript"
            className="border-none w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="airplane-mode"
            checked={isFree}
            onCheckedChange={setIsFree}
            className={`
          relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200
          ${isFree ? "bg-green-600" : "bg-zinc-600"}
          before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5
          before:rounded-full before:bg-white before:shadow
          before:transform before:transition-transform before:duration-200
          ${isFree ? "before:translate-x-5" : "before:translate-x-0"}
        `}
          />
          <Label
            htmlFor="airplane-mode"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            Is this video free
          </Label>
        </div>

        {mediaProgress && (
          <div className="my-4 space-y-2">
            <Progress
              value={uploadProgress}
              className="h-4 bg-zinc-200 rounded"
              indicatorClassName="bg-red-600 rounded"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}
        <div className="mt-2">
          <Button className="bg-black text-white" onClick={editLectureHandler}>
            Update lecture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
