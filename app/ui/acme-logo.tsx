import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AcademicCapIcon className="h-12 w-12 rotate-[-8deg]" />
      <p className="text-[44px]">Nãchi</p>
    </div>
  );
}
