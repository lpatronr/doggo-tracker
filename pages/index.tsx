import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../common/layouts/MainLayout';

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Doggo Tracker</title>
      </Head>

      <Link href='/dogs/register'>
        <div className='flex flex-col justify-center items-center cursor-pointer shadow-md rounded p-4 gap-2 w-60 transform transition duration-500 hover:scale-110'>
          <h1 className='text-7xl'>🏡</h1>
          <h2 className='font-medium text-lg text-indigo-600'>Registra tu mascota</h2>
        </div>
      </Link>

      <Link href='/dogs/tracker'>
        <div className='flex flex-col justify-center items-center cursor-pointer shadow-md rounded p-4 gap-2 w-60 transform transition duration-500 hover:scale-110'>
          <h1 className='text-7xl'>🐶</h1>
          <h2 className='font-medium text-lg text-indigo-600'>Rastrea tu mascota</h2>
        </div>
      </Link>
    </MainLayout>
  );
};

export default Home;
