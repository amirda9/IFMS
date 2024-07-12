import {FC} from 'react';
import classNames from '~/util/classNames';

type Props = {
  color?: 'primary' | 'secondary';
  size?: string;
  className?: string;
  spinnerClassName?: string;
};

const GeneralLoadingSpinner: FC<Props> = ({
  color = 'primary',
  size="h-8 w-8",
  className,
  spinnerClassName,
}) => {
  return (
    <span
      className={classNames(
        'inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        color === 'primary' ? 'border-p' : 'border-blue-200',
        size,
        className,
      )}
      role="status">
      <span
        className={classNames(
          '!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]',
          spinnerClassName,
        )}>
        Loading...
      </span>
    </span>
  );
};

export default GeneralLoadingSpinner;
