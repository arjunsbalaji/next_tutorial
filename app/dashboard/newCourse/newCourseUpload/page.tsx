'use client'

import React, { FC, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MyPDFViewer from '@/app/ui/my-pdf-viewer';
import { Card } from '@/app/ui/dashboard/cards';
import { eventNames } from 'process';


function NewCourseUpload() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')

  //const {data:userID} = await supabase.auth.getUser();

  //console.log(userID)

  const [document, setDocument] = useState('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [docText, setdocText] = useState<string | null>(null);


  const fetchDocument = async (docID: string) => {
    const { data } = await supabase.storage.from("documents").getPublicUrl(docID);
    
    const docURL = data.publicUrl
    setDocument(docURL);

    console.log("DOCURL", docURL)
    const response = await fetch('https://api.mathpix.com/v3/pdf', {
      method: 'POST',
      headers: {
        "app_id": process.env.NEXT_PUBLIC_MATHPIX_APP_ID as string,
        "app_key": process.env.NEXT_PUBLIC_MATHPIX_APP_KEY as string,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        page_ranges: "1-2", //this should be programatic but limit to 5 for now
        url: docURL,
        conversion_formats: {
          md: true,
        }
      })
    }).then((response) => response.json()).then((data) => console.log(data))

    //const pdfID = await response.json();
    //setPdfID(pdfID.pdf_id);
    //console.log(pdfID)

  }


  /*  useEffect(() => {
    const fetchdocText = async () => {
      const response: Response = await fetch(`https://api.mathpix.com/v3/pdf/${pdfID}`, {
        method: 'GET',
        headers: {
          "app_id": process.env.NEXT_PUBLIC_MATHPIX_APP_ID as string,
          "app_key": process.env.NEXT_PUBLIC_MATHPIX_APP_KEY as string,
        }
      }
      ).then(data => response.json()).then(json => console.log(json))
      //const data = await response.json();
      //console.log(data, pdfID)
      //setdocText(data);
      
    }
  
    fetchdocText();
  }, [pdfID]);*/

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
        <div>
          {document && <p className={`${lusitana.className} truncate rounded-xl bg-gray-50 px-4 py-8 text-center text-2xl`}>
            {`Document Text: ${docText}`}
          </p>}
        </div>
        </div>}
    </div>
  )
}

export default NewCourseUpload;
