import {FC} from 'react';

type Props = {
  color?: 'primary' | 'secondary';
};

const GeneralLoadingSpinner: FC<Props> = ({color = 'primary'}) => {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        color === 'primary' ? 'border-p' : 'border-blue-200'
      }`}
      role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default GeneralLoadingSpinner;
