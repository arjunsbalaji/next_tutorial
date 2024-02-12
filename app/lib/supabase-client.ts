import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  //const fileExt = file.name.split('.').pop();
  //const fileName = `${fileExt}`;
  //const filePath = userID + "/" + uuidv4();
  console.log(userID)
  const { data, error } = await supabase.storage.from('documents').list(userID+"/");

  if (data) {
    console.log('inside check how many courses:', data.length)
  } else throw new Error(error.message);

  return `${data.length}`; // Or, return the URL or database record as needed
};

export default uploadFileToSupabase;