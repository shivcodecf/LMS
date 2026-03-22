import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-indigo-900">

      {/* 🔥 Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500 opacity-30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-30 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* 💎 Content */}
      <div className="relative z-10 max-w-4xl w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          Learn Smarter, <span className="text-blue-400">Grow Faster 🚀</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl mb-10">
          Find top-rated courses and upgrade your skills with the best learning experience.
        </p>

        {/* 🔍 Search Box */}
        <form
          onSubmit={searchHandler}
          className="flex flex-col md:flex-row items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-3 shadow-xl"
        >
          <Input
            type="text"
            placeholder="Search courses like 'React', 'Backend'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0 px-4 py-3"
          />

          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
            Search
          </Button>
        </form>

        {/* 🎯 Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Button
            onClick={() => navigate(`/course/search?query=${searchQuery}`)}
            className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Explore Courses
          </Button>

          <Button
            variant="outline"
            className="border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
          >
            View Trending 🔥
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;