import React, { useState, useEffect, Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import CardGrid from '@/app/ui/docs/card-grid';
import { getDocList } from '@/app/lib/supabase-client';
import { cookies } from 'next/headers';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default async function DocsPage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const {data:user} = await supabase.auth.getUser();

    return (
        <div>
            <h1 className={`${lusitana.className} text-4xl p-4`}>Your Documents</h1>
            <Suspense fallback={<div className="flex justify-center"><ExclamationCircleIcon className="h-5 w-5" /></div>}>
              <div>
                <CardGrid userID={user.user?.id || "N/A"} />
              </div>
            </ Suspense>
        </div>
    );
}
