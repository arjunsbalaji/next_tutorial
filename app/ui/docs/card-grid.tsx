'use client'

import { RawSupabaseDocType } from '@/app/lib/definitions';
import { getDocList } from '@/app/lib/supabase-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import React from 'react'


export default async function CardGrid({ userID }: { userID: string }) {
  let doc_list: RawSupabaseDocType[]

  if (userID) {
    //console.log("docs", doc_list)
    //doc_list = []
    doc_list = await getDocList(userID)
  } else {
    console.log('error getting user ID in Card Grid.')
    doc_list = []
  }

  return (
    <div className="p-5 grid grid-cols-3 s:grid-cols-1 gap-4 border border-gray-200 rounded w-full">
      
      {doc_list.map((doc, index) => (
        <div 
          key={index} 
          className="card rounded-lg shadow-md p-4 bg-white w-full overflow-hidden" 
        >
          <h2 className="mb-2 text-lg font-semibold text-gray-700 overflow-ellipsis whitespace-nowrap">{doc.name}</h2>
          <p className="text-sm text-gray-500 overflow-ellipsis whitespace-nowrap">{doc.id}</p>
        </div>
      ))}
    </div>
  )
}
