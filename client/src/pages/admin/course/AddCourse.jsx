import { Label } from "@radix-ui/react-dropdown-menu";
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
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");

  const [createCourse, { data, error, isSuccess, isLoading }] =
    useCreateCourseMutation();

  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  useEffect(()=>{

    if(isSuccess)
    {
        toast.success(data?.message || "Course Created")
        navigate("/admin/course")
    }

  },[isSuccess,error])

  return (
    <div className="w-[1200px] px-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add a course, add some basic course details for your new course
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
          name="courseTitle"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Select a category"
        />
      </div>
      <div>
        <Label>Category</Label>
        <Select onValueChange={getSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>

              <SelectItem value="NextJs">Next Js</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Frontend Developer">
                Frontend Developer{" "}
              </SelectItem>
              <SelectItem value="Backend Developer">
                Backend Developer{" "}
              </SelectItem>
              <SelectItem value="Full stack developer">
                Full stack developer{" "}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 mt-5">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back
        </Button>
        <Button
          className="bg-black text-white"
          disabled={isLoading}
          onClick={createCourseHandler}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </>
          ) : (
            "Create "
          )}
          Create
        </Button>
      </div>
    </div>
  );
};

export default AddCourse;
