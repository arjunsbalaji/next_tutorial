import React from "react";
import { lusitana } from '@/app/ui/fonts';
import { useState, useEffect } from "react";



export default function DocInfo({ docInfo }: { docInfo: { title: string, description: string, level: string, subject: string, author: string } }) {
  //const [docInfo, setDocInfo] = useState({ title: '', description: '', authorship: '' });


  return (
    <div className="rounded-xl bg-gray-50 p-3 shadow-md h-50">
      <h2 className={`${lusitana.className} text-center text-xl`}>
        Information from your document
      </h2>
      <p
        className={`truncate rounded-xl bg-gray-50 px-4 py-2 text-left text-m overflow-wrap`}
      >
        {`Title: ${docInfo.title}`}
      </p>
      <p
        className={`truncate rounded-xl bg-gray-50 px-4 py-1 text-left text-sm overflow-wrap`}
      >
        {`Author: ${docInfo.author}`}
      </p>
      <p
        className={`rounded-xl bg-gray-50 px-4 text-left text-sm overflow-wrap`}
      >
        {`Subject: ${docInfo.subject}`}
      </p>
      <p
        className={`rounded-xl bg-gray-50 px-4 text-left text-sm overflow-wrap`}
      >
        {`Level: ${docInfo.level}`}
      </p>
      <p
        className={`rounded-xl bg-gray-50 px-4 text-left text-sm overflow-wrap`}
      >
        {`Description: ${docInfo.description}`}
      </p>
    </div>
  )
}