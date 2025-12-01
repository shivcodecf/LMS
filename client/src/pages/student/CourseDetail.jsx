import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithstatusQuery } from "@/features/api/purchaseApi";
import {
  BadgeInfo,
  PlayCircleIcon,
  Lock,
  Users,
  CalendarDays,
} from "lucide-react";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";

// course-progress/:courseId

const CourseDetail = () => {
  const { courseId } = useParams();

  const navigate = useNavigate();

  const { data, isError, isSuccess, isLoading } =
    useGetCourseDetailWithstatusQuery(courseId);

  if (isLoading) return <h1>Loading..</h1>;

  if (isError) return <h1>Failed to Load Course Data..</h1>;

  const { course, purchased } = data;

  return (
    <div className="bg-[#1E1F23] text-white min-h-screen pt-[100px] dark:bg-black">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-r from-[#2D2F31] to-[#3A3B3E] rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            {course?.courseTitle}
          </h1>
          <p className="text-gray-300 text-lg mb-6">{course?.category}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users size={16} />{" "}
              <span>Students enrolled: {course?.enrolledStudents.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeInfo size={16} />{" "}
              <span>{`Created by ${course?.creator?.name} `}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />{" "}
              <span>Last updated {course?.createdAt.split("T")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto mt-10 px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-2">Course Description</h2>
            <p
              className="text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            ></p>
          </section>

          <Card className="bg-[#2D2F31] border-none">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 hover:bg-[#3A3B3E] p-2 rounded transition-all cursor-pointer"
                >
                  <span className="text-green-400">
                    {purchased ? (
                      <PlayCircleIcon size={18} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </span>
                  <span className="text-gray-200">
                    Lecture {idx + 1}: {lecture.lectureTitle}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          <Card className="bg-[#2D2F31] border-none">
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4 rounded overflow-hidden bg-[#3A3B3E] flex items-center justify-center text-gray-400">
                {/* Video Placeholder */}
                {course?.lectures?.[0]?.videoUrl && (
                  <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height={"100%"}
                  src={course.lectures[0].videoUrl}
                  controls={true}
                />
              </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                Full Course Access
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                Get lifetime access to the complete course content, including
                all future updates.
              </p>

              <Separator className="my-2 bg-gray-600" />

              <div className="flex items-center justify-between mt-2 mb-4">
                <h3 className="text-2xl font-bold text-green-400">$29.99</h3>
                <span className="text-gray-400 text-sm line-through">
                  $59.99
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={()=>navigate(`/course-progress/${courseId}`)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
