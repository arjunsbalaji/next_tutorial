'use client'

import React, { FC, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MyPDFViewer from '@/app/ui/my-pdf-viewer';
import { Card } from '@/app/ui/dashboard/cards';


function NewCourseUpload() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')
  //console.log(userID)

  const [document, setDocument] = useState('');
  const [numPages, setNumPages] = useState<number>(0);


  const fetchDocument = async (docID: string) => {
    const { data } = await supabase.storage.from("documents").getPublicUrl(docID);
    //console.log("DOCURL", docID, data)
    const docURL = data.publicUrl
    setDocument(docURL);
  }

  const checkNumPages = (numPages:number) => {
    //console.log(numPages);
    setNumPages(numPages);
  }

  return (
    <div>
      <div>
        <h1 className={`${lusitana.className} mb-4 text-xxl md:text-2xl p-5`}>
          New Course
        </h1>
      </div>
      <div>
        <FileUploader userID={userID} onUploadSuccess={fetchDocument} />
      </div>
      <div>
        {document && <MyPDFViewer docURL={document} onDisplaySuccess={checkNumPages}/>}
      </div>
      {document && <div>
        <div className="rounded-xl bg-gray-50 p-2 shadow-lg">
            <div className="flex p-4">
            </div>
            <p
              className={`${lusitana.className}
                truncate rounded-xl bg-gray-50  px-4 py-8 text-center text-2xl overflow-wrap`}
            >
              {`Title: ${document}`}

            </p>
            <p
              className={`${lusitana.className}
                truncate rounded-xl bg-gray-50  px-4 py-8 text-center text-2xl overflow-wrap`}
            >
              {`Author: ${document}`}
            </p>
            <p
              className={`${lusitana.className}
                truncate rounded-xl bg-gray-50 px-4 py-8 text-center text-2xl`}
            >
              {`Subject: ${document}`}
            </p>
            <p
              className={`${lusitana.className}
                truncate rounded-xl bg-gray-50 px-4 py-8 text-center text-2xl`}
            >
              {`Pages: ${numPages}`}
            </p>
          </div>
          <div>
            {numPages > 5 ? (
              <p className="text-sm text-gray-500">Anything over 5 pages will be cut off. Upgrade to get more!</p>
            ) : (
              <p className="text-sm text-gray-500">{`Pages: ${numPages} - Let's get started!`}</p>
            )}
          </div>
        </div>}
    </div>
  )
}

export default NewCourseUpload;
