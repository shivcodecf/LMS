import RichTextEditor from "../../../components/RichTextEditor.jsx";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi.js";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CourseTab = () => {
  const navigate = useNavigate();

  const { courseId } = useParams(); // ✅ correct

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [editCourse, { data, isSuccess, error, message, isLoading }] =
    useEditCourseMutation();

  const {
    data: GetCourseByIdData,
    isSuccess: GetCourseByIdIsSuccess,
    error: GetCourseByIdError,
    isLoading: getCourseByIdIsLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [
    publishCourse,
    { data: publishData, error: publishError, isSuccess: publishSuccess },
  ] = usePublishCourseMutation();

  useEffect(() => {
    if (GetCourseByIdData?.course) {
      const course = GetCourseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [GetCourseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  //get file

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);

      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();

    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });

    console.log(input);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course update.");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  const coursePublisheHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });

      if (response?.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("failed to publish status");
    }
  };

  if (getCourseByIdIsLoading)
    return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <div className="mt-[20px]">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Basic course Information </CardTitle>
            <CardDescription>
              Make Changes to your Courses Here. Click Save when you are done
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              disabled={GetCourseByIdData?.course?.lectures?.length === 0}
              onClick={() =>
                coursePublisheHandler(
                  GetCourseByIdData?.course?.isPublished ? "false" : "true"
                )
              }
            >
              {GetCourseByIdData?.course?.isPublished
                ? "Unpublished"
                : "Published"}
            </Button>
            <Button className="bg-black text-white">Remove Course</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-5">
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Full Stack developer"
            />
          </div>

          <div className="space-y-4 mt-5">
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a full stack develoepr from zero to hero in a month"
            />
          </div>

          <div className="space-y-4 mt-5">
            <Label>Description</Label>

            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup className="bg-white z-[20]">
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Level</Label>
              <Select className="bg-white" onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium </SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="1999"
                className="w-fit"
              />
            </div>
          </div>
          <div className="mt-5">
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />

            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-30 h-30 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="mt-3">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button
              onClick={updateCourseHandler}
              disabled={isLoading}
              className="bg-black text-white "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
