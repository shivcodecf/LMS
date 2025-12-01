import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Outlet, useNavigate } from "react-router-dom";



export function CourseTable() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCreatorCourseQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  

  return (
    <div>
      <Button
        className="bg-black text-white ml-[120px]"
        onClick={() => navigate(`create`)}
      >
        Create new course
      </Button>

      <table className="w-full border-separate border-spacing-x-4 border-spacing-y-2 ml-[100px]">
        <TableCaption className=" p-4 text-base font-semibold text-gray-800">
          A list of your recent invoices.
        </TableCaption>

        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[100px] px-4 py-2 font-medium text-gray-600 uppercase ">
              Price
            </TableHead>
            <TableHead className="px-4 py-2 font-medium text-gray-600 uppercase ">
              status
            </TableHead>
            <TableHead className="px-4 py-2 font-medium text-gray-600 uppercase">
              Title
            </TableHead>
            <TableHead className="px-4 py-2 text-right font-medium text-gray-600 uppercase">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2 border">
                {course?.coursePrice || "NA"}
              </TableCell>
              <TableCell className="px-4 py-2 border">
                <Badge className="bg-black text-white">{course.isPublished ? "Published" : "unPublished"}</Badge>
              </TableCell>
              <TableCell className="px-4 py-2 border">
                {course.courseTitle}
              </TableCell>
              <TableCell className="px-4 py-2 text-right border">
                <Edit onClick ={()=>navigate(`${course._id}`)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="bg-gray-100">
          <TableRow>
           
          </TableRow>
        </TableFooter>
      </table>
    </div>
  );
}

export default CourseTable;
