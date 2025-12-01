import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course, selectedCategories, sending }) => {
 

  const exists = sending.some((course) =>
    selectedCategories.some(
      (cat) => course.category.toLowerCase() === cat.toLowerCase()
    )
  );

  console.log("course-details",course._id);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-400 py-3 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={
            course?.courseThumbnail ||
            "https://codewithmosh.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2F8MbtJ4hTAaOk3KPcptqZ&w=3840&q=75"
          }
          alt="course Thumbnail"
          className="h-15 w-15 md:w-56 object-cover rounded"
        />

        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-lg md:text-xl">
            {course?.courseTitle}
          </h1>
          <p className="text-sm text-gray-600">{course?.category}</p>
          <p className="text-sm text-gray-700">
            Instructor:
            <span className="font-bold">{course?.creator?.name}</span>{" "}
          </p>
          <Badge className="w-fit mt-2 md:mt-0 bg-black text-white">
            Medium
          </Badge>
          <div>
            <h1>{course?.coursePrice}</h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
