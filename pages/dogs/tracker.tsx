import { useState } from 'react';
import Card from '../../common/components/Card';
import MainLayout from '../../common/layouts/MainLayout';
import Error from '../../common/components/popups/Error';
import LoadingIcon from '../../common/components/icons/LoadingIcon';
import Head from 'next/head';

export default function Tracker(): JSX.Element {
  const [input, setInput] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [status, setStatus] = useState<'standby' | 'success' | 'failed' | 'loading'>('standby');
  const [data, setData] = useState<{ startDate: Date; cc: string; dogs: string[] } | null>(null);

  const calculateDuration = (): string => {
    if (!data) return '';
    const now = new Date();
    const diff = now.getTime() - data.startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} horas (${days} días)`;
  };

  const calculatePrice = (): string => {
    if (!data) return '';
    const now = new Date();
    const diff = now.getTime() - data.startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${(hours * 2e3).toLocaleString('co')} COP`;
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setInput(e.target.value);
    if (input.match(/^[0-9]{9,20}$/)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!input.match(/^[0-9]{8,20}$/)) return setDisabled(true);
    setStatus('loading');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}?id=${input}`);

    if (response.status === 200) {
      const data = await response.json();
      const { startDate, cc, dogs } = data;
      setData({ cc, startDate: new Date(startDate), dogs });
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }

  return (
    <MainLayout>
      <Head>
        <title>Tracker</title>
      </Head>
      {!data && (
        <Card>
          <h1 className='text-6xl mb-4'>🌎</h1>
          <p className='text-2xl text-indigo-500 text-center font-bold'>¿Cuál es tú cédula?</p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <input
              value={input}
              onChange={handleChange}
              name='cc'
              type='text'
              className='px-2 py-1  rounded-lg font-medium text-indigo-600 border-2 border-indigo-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-400'
              placeholder='00000000000'
            />
            <button
              disabled={disabled || status === 'loading' || status === 'failed'}
              className='px-2 py-1 flex gap-4 items-center bg-indigo-500 text-white font-bold rounded shadow-md disabled:bg-indigo-300 justify-center'>
              Buscar
              {status === 'loading' && <LoadingIcon />}
            </button>
          </form>
        </Card>
      )}
      {status === 'failed' && <Error />}
      {data && (
        <div className='flex flex-col shadow rounded-lg items-center justify-center text-center px-4 py-4 gap-4'>
          <div>
            <h1 className='text-6xl mb-4'>🐶</h1>
            <h2 className='text-xl text-indigo-500 font-medium'>{data.cc}</h2>
            <p className='text-md'>
              <span className='text-indigo-500 font-medium'>Fecha de inicio:</span>{' '}
              {data.startDate.toLocaleDateString()}
            </p>
            <p className='text-md'>
              <span className='text-indigo-500 font-medium'>Tiempo desde inicio:</span>{' '}
              {calculateDuration()}
            </p>
            <p className='text-md'>
              <span className='text-indigo-500 font-medium'>Total (2.000/h):</span>{' '}
              {calculatePrice()}
            </p>
          </div>

          <div className='flex flex-col'>
            <p className='text-xl text-indigo-500 font-medium'>Mascotas</p>
            <ul>
              {data.dogs.map((dog, i) => (
                <li className='text-md font-medium' key={dog}>
                  {i % 2 === 0 ? '🐕' : '🐩'} {dog}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
