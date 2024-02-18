import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fromJSON, list } from 'postcss';
import {MetadataType, RawSupabaseDocType} from "@/app/lib/definitions"
import { FileObject } from 'openai/resources/files.mjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClientComponentClient();

export async function uploadFileToSupabase(userID: string, file: File): Promise<string> {
  //const fileExt = file.name.split('.').pop();
  //const fileName = `${fileExt}`;
  const filePath = userID + "/" + uuidv4();
  const { data, error } = await supabase.storage.from('documents').upload(filePath, file);
  if (data) {
    //console.log('need to present media', data)
  } else throw new Error(error.message);
  return filePath; // Or, return the URL or database record as needed
};


export async function checkHowManyCourses(userID: string): Promise<string> {
  //console.log(userID)
  const { data, error } = await supabase.storage.from('documents').list(userID+"/");
  if (data) {
    //console.log('inside check how many courses:', data)
  } else throw new Error(error.message);
  return `${data.length}`; // Or, return the URL or database record as needed
};

export async function getDoc(userID: string, docID: string): Promise<Blob> {
  //console.log(userID)
  const { data, error } = await supabase.storage.from('documents').download(userID+"/"+docID);
  if (data) {
    //console.log('inside check how many courses:', data)
  } else throw new Error(error.message);
  return data; // Or, return the URL or database record as needed
};



export async function getDocList(userID: string): Promise<RawSupabaseDocType[]> {

  let final_data: RawSupabaseDocType[]

  const { data, error } = await supabase.storage.from('documents').list(userID+"/");

  if (data) {
    //console.log('GET DOC LIST', data)
    //console.log(data.at(3)?.id)
    //const parsed_data = data.map((doc: any) => JSON.parse(doc));
    final_data = data.map((doc: any) => {
      const metadata = { 
        eTag: doc.metadata.eTag,
        size: doc.metadata.size,
        mimetype: doc.metadata.mimetype,
        cacheControl: doc.metadata.cacheControl,
        lastModified: doc.metadata.lastModified,
        contentLength: doc.metadata.contentLength,
        httpStatusCode: doc.metadata.httpStatusCode,
      } as MetadataType
      return {
        name: doc.name,
        id: doc.id,
        updated_at: doc.updated_at,
        created_at: doc.created_at,
        last_accessed_at: doc.last_accessed_at,
        metadata: metadata,
      } as RawSupabaseDocType;
    });
    
  } else throw new Error(error.message);

  return final_data; // Or, return the URL or database record as needed
};

export default uploadFileToSupabase;