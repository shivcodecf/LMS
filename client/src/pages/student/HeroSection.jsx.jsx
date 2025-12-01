import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const[searchQuery,setSearchQuery] = useState("");
     
  const navigate = useNavigate();


  const searchHandler = (e) =>{

   e.preventDefault();

   if(searchQuery.trim()!=="")
   {
     navigate(`/course/search?query=${searchQuery}`)

   }

   setSearchQuery("")




  }


  return (
    <div className="relative  bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-28 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-5xl font-extrabold leading-tight mb-5">
          Discover the Best Courses for Your Future
        </h1>
        <p className="text-gray-200 dark:text-gray-400 text-lg mb-12">
          Upskill, Learn, and Grow with top-rated online courses tailored for you.
        </p>
      </div>
      <form
        action=""
        onSubmit = {searchHandler}
        className="flex items-center bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg overflow-hidden max-w-2xl mx-auto mb-8 p-1"
      >
        <Input
          type="text"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange = {(e)=>setSearchQuery(e.target.value)}
          className="flex-grow border-none bg-transparent focus-visible:ring-0 px-6 py-3 text-white placeholder-white/70 dark:placeholder-gray-300 rounded-full"
        />
        <Button className="bg-blue-600 text-white dark:bg-blue-700 px-8 py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
          Search
        </Button>
      </form>
      <Button type="submit" onClick={()=>navigate(`course/search?query`) } className="bg-white dark:bg-gray-800 text-blue-700 dark:text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
        Explore Courses
      </Button>
    </div>
  );
};

export default HeroSection;
