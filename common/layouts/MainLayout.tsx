import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
  const { pathname } = useRouter();
  const path = pathname === '/' ? 'home' : pathname.slice(1);
  return (
    <div className='flex flex-col justify-between h-screen select-none'>
      <nav className='flex justify-center items-center py-4 w-screen shadow-md'>
        <Link href='/'>
          <a className='text-indigo-600 font-bold text-xl text-center'>
            Doggo<span className='text-indigo-700 text-lg font-medium'>.{path}</span>
          </a>
        </Link>
      </nav>
      <section className='flex flex-col gap-6 justify-center items-center'>{children}</section>
      <footer className='py-4 bg-indigo-600 w-screen text-white font-medium flex justify-center'>
        <h1>© 2022. All Rights Reserved.</h1>
      </footer>
    </div>
  );
}
