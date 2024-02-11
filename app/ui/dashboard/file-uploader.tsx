'use client'
import uploadFileToSupabase from '@/app/lib/supabase-client';
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

const FileUploader = ({userID, onUploadSuccess} : {userID:any, onUploadSuccess: (docID: string) => void}) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
    const onDrop = (acceptedFiles: any) => {
      setIsUploading(true);
      acceptedFiles.forEach((file: any) => {
        // Here you would call the function to upload the file to Supabase
        uploadFileToSupabase(userID, file).then((response) => {
          // Extract the docID from the response
          const docURL =  response;
          console.log('RESPONSE',response);
          // Handle the successful upload, like showing a message or updating the state
          setUploadSuccess(true);
          onUploadSuccess(docURL);
          setIsUploading(false);
        }).catch((error: any) => {
          console.error('Error uploading file:', error);
          setIsUploading(false);
        });
      });
    };
  
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
    return (
      <div {...getRootProps()} className={uploadSuccess ? "border-solid border-4 border-green-500 rounded-lg p-4 text-center cursor-pointer hover:border-green-700" : "border-dashed border-4 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"}>
        <input {...getInputProps()} disabled={uploadSuccess || isUploading} />
        {isUploading ? 
          <p className={"text-gray-700"}>Loading...</p> 
          : !uploadSuccess ? 
          <p className={"text-gray-700"}>Drag &apos; n &apos; drop some files here, or click to select files</p> 
          : 
          <p className={"text-green-500"}>File uploaded successfully!</p>}
      </div>
    );
  };

export default FileUploader;
  