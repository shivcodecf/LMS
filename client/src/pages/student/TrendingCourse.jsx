import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const TrendingCourse = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingCourse = async () => {
      const response = await axios.get(
        "http://52.63.40.222/api/v1/course/getTopCourse",
        {
          withCredentials: true,
        },
      );

      if (response.data.courses) {
        setItems(response.data.courses);
        console.log(response.data.courses);
      }
    };

    fetchTrendingCourse();
  }, []);

  return (
    <>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          🔥 Trending Courses
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Discover the most popular courses loved by thousands of learners.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items?.map((course) => (
          <div
            onClick={() => navigate(`/course-detail/${course._id}`)}
            key={course._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {/* Course Image */}
            <img
              src={course.courseThumbnail}
              alt={course.courseTitle}
              className="w-full h-48 object-cover"
            />

            {/* Course Details */}
            <div className="p-5 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {course.courseTitle}
              </h2>

              {course?.description && course.description !== "undefined" && (
                <div
                  className="text-gray-600 text-sm leading-relaxed line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <span>📚</span>
                  <span className="text-sm">Course Level</span>
                </div>

                <span className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                  {course.courseLevel}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                  {course.category}
                </span>

                <span className="text-2xl font-bold text-green-600">
                  ₹{course.coursePrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
