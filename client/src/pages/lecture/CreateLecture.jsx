import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  useCreateCourseMutation,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");

  const navigate = useNavigate();

  const { courseId } = useParams();

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="w-[1200px] px-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add a lecture, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div>
        <Label>Title</Label>
        <Input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          placeholder="your title name"
        />
      </div>

      <div className="flex items-center gap-2 mt-5">
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/course/${courseId}`)}
        >
          Back to course
        </Button>
        <Button
          className="bg-black text-white"
          disabled={isLoading}
          onClick={createLectureHandler}
        >
          Create a lecture
        </Button>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <h1>loading lecture...</h1>
        ) : lectureError ? (
          <p>Failed to load lectures</p>
        ) :  lectureData?.lectures.length === 0 ? (
          <p>No lecture available</p>
        ) : (
           lectureData?.lectures.map((lecture,index)=>(
            <Lecture key = {lecture._id} lecture={lecture} courseId={courseId} lectureTitle={lectureTitle} setLectureTitle={setLectureTitle} index={index}/>
          ))
          
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
