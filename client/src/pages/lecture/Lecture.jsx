import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {

   const navigate = useNavigate();
   
    const goToUpdateLecture = () =>{
     
        navigate(`${lecture._id}`)
    

    }

  return (
    <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
       {`lecture ${index}`}.    <span className="ml-10"> {lecture.lectureTitle} </span>
      </h1>

      <Edit
       onClick = {goToUpdateLecture}
      />
    </div>
  );
};

export default Lecture;
