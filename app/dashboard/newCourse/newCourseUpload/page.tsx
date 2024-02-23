'use client'

import React, { FC, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MyPDFViewer from '@/app/ui/my-pdf-viewer';
import { Card } from '@/app/ui/dashboard/cards';
import { eventNames } from 'process';
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import DocInfo from '@/app/ui/doc-info';
import { fetchDocInfo } from "@/app/lib/openai-client";


function NewCourseUpload() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')

  const [document, setDocument] = useState('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [docText, setdocText] = useState<string | null>(null);
  const [docInfo, setDocInfo] = useState<{ title: string; description: string; author: string }>({ title: '', description: '', author: '' });
  const POLL_INTERVAL = 5000;

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
        remove_section_numbering: true,
        page_ranges: "1-2", //this should be programatic but limit to 5 for now
        url: docURL,
        conversion_formats: {
          md: true,
        }
      })
    }).then((response) => response.json()).then((data) =>{
      setPdfID(data.pdf_id);
      //pollMathpixForCompletion(data.pdf_id);
    })
  }



  async function pollMathpixForCompletion(pdfID: string) {
    const url = `https://api.mathpix.com/v3/pdf/${pdfID}`;
    const headers = {
      "app_id": process.env.NEXT_PUBLIC_MATHPIX_APP_ID as string,
      "app_key": process.env.NEXT_PUBLIC_MATHPIX_APP_KEY as string,
    };

    let pollInterval: NodeJS.Timeout | null = null; // Declare pollInterval outside to clear it later

    try {
      const checkCompletion = async () => {
        const response = await fetch(url, { method: 'GET', headers: headers });
        const data = await response.json();
  
        if (data.status === 'completed') {
          console.log('Processing completed:', data);
          clearInterval(pollInterval);
          
          const markdownUrl = `${url}.md`;
          const markdownResponse = await fetch(markdownUrl, { headers: headers })
            .then((res) => res.text())
            .then((data) => setdocText(data));
          
        } else {
          console.log('Processing not yet completed, status:', data.status);
        }
      };
  
      
      const pollInterval = setInterval(checkCompletion, POLL_INTERVAL);
    } catch (error) {
      console.error('Error polling Mathpix:', error);
      
      if (pollInterval) clearInterval(pollInterval); // Ensure we clear the interval if there's an error
    }
  }

  useEffect(() => {
    async function getDocInfo() {
      if (docText) {
        try {
          const docInfoData = await fetchDocInfo(docText);
          setDocInfo(docInfoData);
        } catch (error) {
          console.error('Failed to fetch document information:', error);
        }
      }
    }

    getDocInfo();
  }, [docText]);
  

  const checkNumPages = (numPages:number) => {
    //console.log(numPages);
    setNumPages(numPages);
  }

  function handleTextExtraction(extractedText: string) {
    setdocText(extractedText);
  }


  return (
    <div>
      <div>
        <h1 className={`${lusitana.className} mb-4 text-xxl md:text-2xl p-5`}>
          New Course
        </h1>
      </div>
      <div style={{ paddingBottom: '1rem' }}>
        <FileUploader
          userID={userID} 
          onUploadSuccess={fetchDocument} />
      </div>
      <div>
        { document && <DocInfo docInfo={docInfo} />}
      </div>
      <div className="flex py-6">
          <div className="w-1/2">
            <div>
              {document && docText && (
                <div className={`${lusitana.className} rounded-xl bg-gray-50 p-3 shadow-md px-2 py-2 text-left`}>
                  <Markdown>{docText}</Markdown>
                </div>
              )}
            </div>
          </div>
          <div className="w-3/4">
            {document && <MyPDFViewer 
                docURL={document}
                onDisplaySuccess={checkNumPages} 
                onTextExtracted={handleTextExtraction} />}
            <div>
              {numPages > 5 && (
                <p className="text-center text-sm text-gray-500">
                  Anything over 5 pages will be cut off. Upgrade to get more!
                </p>
              )}
              {/* : (
                <p className="text-center text-sm text-gray-500">
                  {`Pages: ${numPages} - Let's get started!`}
                </p>
              )}*/}
            </div>
          </div>
          
      </div>
    </div>
  )
}

export default NewCourseUpload;
