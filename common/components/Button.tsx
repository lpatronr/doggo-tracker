import LoadingIcon from './icons/LoadingIcon';

type Props = {
  state: number;
  action: 'Forward' | 'Backward';
  onClick(): void;
  handleSubmit?: () => void;
  invalidInput?: boolean;
  loading?: boolean;
  failed?: boolean;
};

export default function Button({
  state,
  action,
  onClick,
  invalidInput,
  handleSubmit,
  loading,
  failed,
}: Props): JSX.Element {
  const text =
    state === 2 && action === 'Forward'
      ? 'Terminar'
      : action === 'Forward'
      ? 'Siguiente'
      : 'Anterior';
  return (
    <button
      onClick={() => {
        if (state === 2 && action === 'Forward' && handleSubmit) {
          handleSubmit();
        } else {
          onClick();
        }
      }}
      type='button'
      disabled={
        (state === 0 && action === 'Backward') ||
        (invalidInput === undefined ? false : invalidInput) ||
        loading ||
        failed
      }
      className={`px-2 py-1 transition ease-in-out delay-50 flex items-center gap-2 ${
        text === 'Terminar'
          ? 'bg-green-600 hover:bg-green-500 disabled:bg-green-300'
          : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300'
      } rounded-lg shadow-md text-white font-medium disabled:cursor-not-allowed`}>
      {text}
      {loading && action === 'Forward' && <LoadingIcon />}
    </button>
  );
}
