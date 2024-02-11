import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchRevenue } from '../lib/data';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import FileUploader from '../ui/dashboard/file-uploader';
import { Button } from '../ui/button';
import { checkHowManyCourses } from '../lib/supabase-client';
import styles from './Dashboard.module.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default async function Page() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const {data:user} = await supabase.auth.getUser();
    const router = useRouter();
    const totalPaidInvoices = await fetchLatestInvoices();

    useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [user]);
  


  return (
    <main>
      <h1>Welcome {user.user?.email}</h1>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl p-5`}>
        Dashboard
      </h1>
      <div className=''>
        {/*<FileUploader userID={user.user?.id}/>*/}
        <Link 
        href={{ 
          pathname: '/dashboard/newCourse', 
          query: { userID: user.user?.id }}}
        >
          <Button className={styles.center}> 
            Create New Course
          </Button>
        </Link>
      </div>
      <div className="p-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Number of Courses" value={'10'} type="pdf" />
        <Card title="Lesson Streak" value={'3 days'} type="pic" />
        <Card title="Finished Courses" value={'10'} type="doc" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/*<RevenueChart revenue={revenue}  />
        
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>

    </main>
  );
}
