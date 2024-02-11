'use client'

import React, { FC, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Document } from '@react-pdf/renderer';

function NewCoursePage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')
  console.log(userID)

  const [document, setDocument] = useState(null);

  const fetchDocument = async (docID: string) => {
    // Use the Supabase client to fetch the document using the docID
    const { data, error } = await supabase
      .from('documents')
      .select("/" + docID)
  
    if (error) {
      console.error('Error fetching document:', error);
    } else {
      setDocument(data);
      console.log("INSIDE FETCH:", data)
    }
  }


  
  return (
    <div>
    
      <div>
        <div>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl p-5`}> 
              New Course
            </h1>
        </div>
        <div>
          <FileUploader userID={userID} onUploadSuccess={fetchDocument}/>
        </div>
        <div>
          <Document />
        </div>
      </div>
  </div>
  )
}

export default NewCoursePage;
