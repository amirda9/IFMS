import {FC, ReactNode} from 'react';

type PropsType = {
  children: ReactNode;
  buttons: ReactNode;
  wrapperClassName?: string;
};
const FormLayout: FC<PropsType> = ({buttons, children, wrapperClassName}) => {
  return (
    <div
      className={`flex h-full  flex-grow flex-col justify-between ${wrapperClassName}`}>
      <div className="h-5/6">{children}</div>

      <div className="flex flex-row gap-x-4 self-end">{buttons}</div>
    </div>
  );
};

export default FormLayout;
