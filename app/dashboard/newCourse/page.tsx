'use client'

import React, { FC, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import FileUploader from '@/app/ui/dashboard/file-uploader';
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MyPDFViewer from '@/app/ui/my-pdf-viewer';

function NewCoursePage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams()
  const userID = searchParams.get('userID')
  console.log(userID)

  const [document, setDocument] = useState('');

  const fetchDocument = async (docID: string) => {
    // Use the Supabase client to fetch the document using the docID
    /*const { data, error } = await supabase
      .from('documents')
      .select("/" + docID)
    */
    const { data } = await supabase.storage.from("documents").getPublicUrl(docID);
    console.log("DOCURL", docID, data)
    const docURL = data.publicUrl
    setDocument(docURL);
    
    
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
          {document && <MyPDFViewer docURL={document} />}
        </div>
      </div>
  </div>
  )
}

export default NewCoursePage;
