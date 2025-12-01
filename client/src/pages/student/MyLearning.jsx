import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
 
  const myLearningCourses = [];
   const { data, isLoading, refetch } = useLoadUserQuery();

   let item = data && data.user


  return (
    <div className="max-w-6xl mx-auto my-20 px-4">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
        My Learning
      </h1>

      <div>
        {isLoading ? (
          <MyLearningSkeleton />
        ) : item?.enrolledCourses?.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {item?.enrolledCourses?.map((course, index) => (
              <Course key={index} course={course}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {item?.enrolledCourses?.map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
