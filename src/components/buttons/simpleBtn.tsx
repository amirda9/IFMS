import React, {FC} from 'react';

type PropsType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const SimpleBtn: FC<PropsType> = ({className, ...props}) => {
  return (
    <button
      className={
        'w-fit rounded-md bg-gradient-to-b from-[#BAC2EDB0] to-[#B3BDF2] px-7 py-1 text-sm active:opacity-50 disabled:pointer-events-none disabled:bg-gray-700 ' +
        className
      }
      {...props}
    />
  );
};

export default SimpleBtn;
