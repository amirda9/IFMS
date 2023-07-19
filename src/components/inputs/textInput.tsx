import React, {FC} from 'react';

type PropsType = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
const TextInput: FC<PropsType> = ({className, ...props}) => {
  return (
    <input
      className={'h-8 rounded-md border border-black px-2 '+className}
      {...props}
    />
  );
};

export default TextInput;
