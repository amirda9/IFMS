import React, {FC} from 'react';

type PropsType = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;
const Select: FC<PropsType> = ({className, ...props}) => {
  return (
    <select
      className={
        'h-8 rounded-md border border-black bg-white px-2 ' + className
      }
      {...props}
    />
  );
};

export default Select;
