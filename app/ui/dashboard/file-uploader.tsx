'use client'
import uploadFileToSupabase from '@/app/lib/supabase-client';
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const FileUploader = ({userID} : {userID:any}) => {
    const onDrop = (acceptedFiles: any) => {
      acceptedFiles.forEach((file: any) => {
        // Here you would call the function to upload the file to Supabase
        uploadFileToSupabase(userID,file).then(() => {
          // Handle the successful upload, like showing a message or updating the state
        }).catch((error: any) => {
          console.error('Error uploading file:', error);
        });
      });
    };
  
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
    return (
      <div {...getRootProps()} className="border-dashed border-4 border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
        <input {...getInputProps()} />
        <p className="text-gray-700">Drag 'n' drop some files here, or click to select files</p>
      </div>
    );
  };

export default FileUploader;
  