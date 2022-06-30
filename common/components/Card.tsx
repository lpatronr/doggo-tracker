import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  width?: string;
  paddingX?: number;
};

export default function Card({ children, width, paddingX }: Props): JSX.Element {
  return (
    <div
      className={`shadow-md text-center ${width ? `w-[${width}]` : `w-72`} ${
        paddingX ? `px-${paddingX}` : 'px-2'
      } flex flex-col items-center gap-2 py-4 rounded-lg`}>
      {children}
    </div>
  );
}
