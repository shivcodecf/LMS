import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
          Add details information regarding course
        </h1>

        <Link to="lecture" className="self-start sm:self-auto">
          <Button
            variant="link"
            className="p-0 text-blue-600 hover:text-blue-700"
          >
            Go to Lectures page →
          </Button>
        </Link>
      </div>

      {/* Tabs / Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <CourseTab />
      </div>

    </div>
  );
};

export default EditCourse;