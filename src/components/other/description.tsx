import React, {FC, ReactNode} from 'react';

type PropsType = {
  label: string;
  children: ReactNode;
  items?: 'center' | 'start' | 'end';
};
const Description: FC<PropsType> = ({label, children, items = 'center'}) => {
  return (
    <div className={`items-${items} flex flex-grow flex-row`}>
      <label className="w-40 text-sm">{label}</label>
      {typeof children === 'string' ? (
        <span className="text-sm">{children}</span>
      ) : (
        children
      )}
    </div>
  );
};

export default Description;
