import { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../../common/components/Button';
import DogForm from '../../common/components/DogForm';
import Success from '../../common/components/popups/Success';
import Error from '../../common/components/popups/Error';
import MainLayout from '../../common/layouts/MainLayout';
import Card from '../../common/components/Card';

export type Input = {
  cc: string;
  amountOfDogs: number;
  dogs: string[];
};

const Register: NextPage = () => {
  const [currentLevel, setCurrentLevel] = useState<0 | 1 | 2>(0);
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    cc: '',
    amountOfDogs: 0,
    dogs: [],
  });
  const [apiState, setApiState] = useState<'success' | 'failed' | 'standby' | 'loading'>('standby');

  useEffect(() => {
    switch (currentLevel) {
      case 0:
        setInvalidInput(input.cc.match(/^[0-9]{7,15}\b$/) ? false : true);
        break;
      case 1:
        setInvalidInput(input.amountOfDogs <= 0);
        break;
      case 2:
        setInvalidInput(
          input.dogs.length !== input.amountOfDogs || input.dogs.some((dog) => dog.length === 0),
        );
        break;
      default:
        setInvalidInput(false);
    }
  }, [input, currentLevel]);

  function handleLevelClick(type: 'prev' | 'next'): void {
    switch (currentLevel) {
      case 0:
        setCurrentLevel(type === 'next' ? 1 : 0);
        return;
      case 1:
        setCurrentLevel(type === 'next' ? 2 : 0);
        return;
      case 2:
        setCurrentLevel(type === 'prev' ? 1 : 2);
      default:
        return;
    }
  }

  function handleDogsAmount(type: 'increment' | 'decrement') {
    const newAmount = type === 'increment' ? input.amountOfDogs + 1 : input.amountOfDogs - 1;
    if (newAmount <= 0 || newAmount >= 4) return;

    // retain the old dogs and append new elements
    if (input.dogs.length > 0 && newAmount > input.dogs.length) {
      return setInput({
        ...input,
        amountOfDogs: newAmount,
        dogs: [...input.dogs, ...Array(newAmount - input.dogs.length).fill('')],
      });
    }

    // retain the old dogs by removing the extra elements from newAmount
    if (input.dogs.length > 0 && newAmount < input.dogs.length) {
      return setInput({
        ...input,
        amountOfDogs: newAmount,
        dogs: input.dogs.slice(0, newAmount),
      });
    }

    setInput({ ...input, amountOfDogs: newAmount, dogs: new Array(newAmount).fill('') });
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.name.startsWith('dogs')) {
      const index = parseInt(e.target.name.split('[')[1].split(']')[0]);
      const newDogs = [...input.dogs];
      newDogs[index] = e.target.value;
      return setInput({ ...input, dogs: newDogs });
    }

    setInput({ ...input, [e.target.name]: e.target.value });
  }

  async function handleSubmit(): Promise<void> {
    if (
      input.dogs.length !== input.amountOfDogs ||
      input.dogs.some((dog) => dog.length === 0) ||
      input.cc.length < 7 ||
      !input.cc.match(/^[0-9]{7,15}\b$/)
    )
      return setApiState('failed');
    if (apiState === 'success') return;
    setApiState('loading');

    const createUser = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cc: input.cc,
        dogs: input.dogs,
      }),
    });

    if (createUser.status === 200) {
      setApiState('success');
    } else {
      setApiState('failed');
    }

    return;
  }

  return (
    <MainLayout>
      <Card>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex flex-col items-center gap-2 px-4'>
          <p className='text-6xl mb-4'>
            {currentLevel === 0 ? '📄' : currentLevel === 1 ? '🐶' : '🐕'}
          </p>
          <div className='flex items-center flex-col gap-2'>
            {
              <DogForm
                handleDogsAmount={handleDogsAmount}
                currentLevel={currentLevel}
                handleInput={handleInput}
                input={input}
              />
            }
          </div>
          <div className='flex justify-between w-full mt-8'>
            <Button
              onClick={() => handleLevelClick('prev')}
              action={'Backward'}
              state={currentLevel}
            />
            <Button
              onClick={() => handleLevelClick('next')}
              action={'Forward'}
              state={currentLevel}
              invalidInput={invalidInput}
              handleSubmit={handleSubmit}
              loading={apiState === 'loading'}
              failed={apiState === 'failed'}
            />
          </div>
        </form>
      </Card>

      {apiState === 'success' ? <Success /> : apiState === 'failed' ? <Error /> : null}
    </MainLayout>
  );
};

export default Register;
