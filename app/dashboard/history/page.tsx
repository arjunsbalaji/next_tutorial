import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function page() {
    const supabase_client =  createClientComponentClient()

    
    return (
    <div>
      <h1>hello</h1>
    </div>
  )
}
