import { ChangeEvent } from 'react';
import { Input } from '../../pages/dogs/register';

type Props = {
  currentLevel: 0 | 1 | 2;
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDogsAmount: (type: 'increment' | 'decrement') => void;
  input: Input;
};

export default function DogForm({
  currentLevel,
  handleInput,
  input,
  handleDogsAmount,
}: Props): JSX.Element {
  switch (currentLevel) {
    case 0:
      return (
        <>
          <label className='font-bold text-indigo-500 text-2xl'>¿Cuál es tú cédula?</label>
          <input
            onChange={handleInput}
            name='cc'
            value={input.cc}
            type='text'
            className='px-2 py-1  rounded-lg font-medium text-indigo-600 border-2 border-indigo-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-400'
            placeholder='00000000000'
          />
        </>
      );
    case 1:
      return (
        <>
          <label className='font-bold text-indigo-500 text-2xl text-center'>
            ¿Cuántas mascotas?
          </label>
          <div className='flex items-center shadow-md text-3xl text-center'>
            <button
              onClick={() => handleDogsAmount('decrement')}
              className='px-4 py-2 bg-neutral-800 text-white rounded-l-lg'>
              ↓
            </button>
            <p className='bg-indigo-700 text-white px-3 py-2'>{input.amountOfDogs}</p>
            <button
              onClick={() => handleDogsAmount('increment')}
              className='px-4 py-2 bg-neutral-800 text-white rounded-r-lg'>
              ↑
            </button>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <label className='font-bold text-indigo-500 text-2xl text-center'>
            ¿Cómo se llaman tus mascotas?
          </label>
          <div className='flex items-center flex-col gap-4'>
            {input.dogs.map((dog, index) => (
              <input
                key={index}
                onChange={handleInput}
                name={`dogs[${index}]`}
                value={dog}
                type='text'
                className='px-2 py-1  rounded-lg font-medium text-indigo-600 border-2 border-indigo-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-400'
                placeholder={`Mascota ${index + 1}`}
              />
            ))}
          </div>
        </>
      );
    default:
      return <></>;
  }
}
