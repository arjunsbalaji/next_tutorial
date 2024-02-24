'use client'

import React, { FC, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MyPDFViewer from '@/app/ui/my-pdf-viewer';
import DocInfo from '@/app/ui/doc-info';
import { fetchDocInfo, makeDocNotes } from "@/app/lib/openai-client";
import { Course } from '@/app/lib/definitions';


function NewCourseUpload() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')
  const [document, setDocument] = useState('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [docText, setdocText] = useState<string>('');
  const [editDocText, setEditDocText] = useState(docText);
  const [docInfo, setDocInfo] = useState<{ title: string; description: string; level:string; subject:string; author: string }>({ title: '', description: '', level:'', subject:'', author: '' });
  const POLL_INTERVAL = 5000;

  const course: Course = {
    title: '',
    author: '',
    description: '',
    sourceDocumentID: '',
    text: '',
    level: '',
    subject: '',
    pages: 0,
    notes: []
  };

  const fetchDocument = async (docID: string) => {
    const { data } = await supabase.storage.from("documents").getPublicUrl(docID);

    const docURL = data.publicUrl
    setDocument(docURL);

    console.log("DOCURL", docURL)

    /*const response = await fetch('https://api.mathpix.com/v3/pdf', {
      method: 'POST',
      headers: {
        "app_id": process.env.NEXT_PUBLIC_MATHPIX_APP_ID as string,
        "app_key": process.env.NEXT_PUBLIC_MATHPIX_APP_KEY as string,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        remove_section_numbering: true,
        page_ranges: "1-2", 
        url: docURL,
        conversion_formats: {
          md: true,
        }
      })
    }).then((response) => response.json()).then((data) =>{
      setPdfID(data.pdf_id);
    })*/
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
            .then((data) => {
              setdocText(data);
            });

        } else {
          console.log('Processing not yet completed, status:', data.status);
        }
      };

      const pollInterval = setInterval(checkCompletion, POLL_INTERVAL);
    } catch (error) {
      console.error('Error polling Mathpix:', error);

      if (pollInterval) clearInterval(pollInterval);
    }
  }

  useEffect(() => {
    async function fetchDocNotesOAI() {
      if (docText) {
        try {
          const oaiDocSummary = await makeDocNotes(docText);
          course.text = oaiDocSummary.text;
          setEditDocText(course.text);
          console.log(course, course.text)
        } catch (error) {
          console.error('Failed to fetch document notes :(', error);
        }
      }
    }
    fetchDocNotesOAI();
  }, [docText]);

  useEffect(() => {
    async function getDocInfo() {
      if (docText) {
        try {
          const docInfoData = await fetchDocInfo(docText);
          course.title = docInfoData.title;
          course.author = docInfoData.author;
          course.description = docInfoData.description;
          course.subject = docInfoData.subject;
          course.level = docInfoData.level;
          setDocInfo(docInfoData);

        } catch (error) {
          console.error('Failed to fetch document information:', error);
        }
      }
    }
    getDocInfo();
  }, [docText]);

  const checkNumPages = (numPages: number) => {
    course.pages = numPages
    setNumPages(course.pages);
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
        {document && <DocInfo docInfo={docInfo} />}
      </div>
      <div className="flex py-6">
        <div className="w-1/2">
          {docText && <h1 className='py-2 px-2 font-bold'>Notes</h1>}
          <div>
            {document && docText && (
              <textarea
                value={editDocText}
                onChange={(e) => setEditDocText(e.target.value)}
                className={`${lusitana.className} rounded-xl bg-gray-50 p-3 shadow-md px-4 py-4 text-left w-full h-128`}
              />
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewCourseUpload;
