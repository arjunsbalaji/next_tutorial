import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchRevenue } from '../lib/data';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import FileUploader from '../ui/dashboard/file-uploader';

export default async function Page() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const {data:user} = await supabase.auth.getUser();
    const revenue = await fetchRevenue();
    const totalPaidInvoices = await fetchLatestInvoices();


  return (
    <main>
      <h1>Welcome {user.user?.email}</h1>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/*<RevenueChart revenue={revenue}  />
        
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
      <div>
        <FileUploader userID={user.user?.id}/>
      </div>
    </main>
  );
}