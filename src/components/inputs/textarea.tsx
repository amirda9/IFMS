import React, {FC} from 'react';

type PropsType = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;
const Textarea: FC<PropsType> = ({className, ...props}) => {
  return (
    <textarea
      className={'h-16 rounded-md border border-black px-2 ' + className}
      {...props}
    />
  );
};

export default Textarea;
