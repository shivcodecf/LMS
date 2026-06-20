import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [currentLecture, setCurrentLecture] = useState(null);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [
    completeCourse,
    { data: completeData, isSuccess: completeSuccess },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    { data: inCompleteData, isSuccess: inCompleteSuccess },
  ] = useInCompleteCourseMutation();

  // Get course details safely before any return
  const courseDetails = data?.data?.courseDetails;

  // Set first lecture after data loads
  useEffect(() => {
    if (courseDetails?.lectures?.length && !currentLecture) {
      setCurrentLecture(courseDetails.lectures[0]);
    }
  }, [courseDetails, currentLecture]);

  // Handle course complete/incomplete
  useEffect(() => {
    if (completeSuccess && completeData) {
      toast.success(completeData.message);
      refetch();
    }

    if (inCompleteSuccess && inCompleteData) {
      toast.success(inCompleteData.message);
      refetch();
    }
  }, [
    completeSuccess,
    completeData,
    inCompleteSuccess,
    inCompleteData,
    refetch,
  ]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data?.data) {
    return <p>Failed to load course details</p>;
  }

  const { progress, completed } = data.data;

  const isLectureCompleted = (lectureId) => {
    return progress.some(
      (item) => item.lectureId === lectureId && item.viewed
    );
  };

  const handleLectureProgress = async (lectureId) => {
    try {
      await updateLectureProgress({
        courseId,
        lectureId,
      }).unwrap();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update lecture progress");
    }
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
    } catch (error) {
      toast.error("Failed to complete course");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
    } catch (error) {
      toast.error("Failed to mark course incomplete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-[100px]">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {courseDetails.courseTitle}
        </h1>

        <Button
          onClick={
            completed
              ? handleInCompleteCourse
              : handleCompleteCourse
          }
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Video Section */}
        <div className="flex-1 md:w-3/5 rounded-lg shadow-lg p-4">

          {currentLecture ? (
            <>
              <video
                src={currentLecture.videoUrl}
                controls
                preload="metadata"
                className="w-full md:rounded-lg"
                onPlay={() =>
                  handleLectureProgress(currentLecture._id)
                }
              >
                Your browser does not support the video tag.
              </video>

              <h3 className="font-medium text-lg mt-2">
                Lecture {
                  courseDetails.lectures.findIndex(
                    (lec) =>
                      lec._id === currentLecture._id
                  ) + 1
                }
                : {currentLecture.lectureTitle}
              </h3>
            </>
          ) : (
            <p>No lectures available</p>
          )}

        </div>

        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">

          <h2 className="font-semibold text-xl mb-4">
            Course Lectures
          </h2>

          <div className="flex-1 overflow-y-auto">

            {courseDetails.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                onClick={() => handleSelectLecture(lecture)}
                className={`mb-3 cursor-pointer transition ${
                  currentLecture?._id === lecture._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
              >
                <CardContent className="flex items-center justify-between p-4">

                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2
                        size={24}
                        className="text-green-500 mr-2"
                      />
                    ) : (
                      <CirclePlay
                        size={24}
                        className="text-gray-500 mr-2"
                      />
                    )}

                    <CardTitle className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>

                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseProgress;