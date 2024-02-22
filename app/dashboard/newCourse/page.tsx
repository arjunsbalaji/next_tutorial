'use client'
import React from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";

export default function NewCourse() {
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')

  return (
    <div className="flex justify-center items-center h-screen">
      <Link 
      href="/dashboard/newCourse/newCourseScratch" 
      className="shadow-lg rounded-lg p-8 text-center bg-blue-500 hover:bg-blue-400 transition-colors duration-300 ease-in-out">
          <h1 className="text-white text-lg font-semibold">Start from Scratch</h1>
      </Link>
      <div className="mx-4"></div> {/* This div acts as a spacer */}
      <Link 
      href={{pathname: "/dashboard/newCourse/newCourseUpload", query: { userID }}}
      className="shadow-lg rounded-lg p-8 text-center bg-blue-500 hover:bg-blue-400 transition-colors duration-300 ease-in-out">
          <h1 className="text-white text-lg font-semibold">I have a document to start with</h1>
      </Link>
    </div>
  );

}
