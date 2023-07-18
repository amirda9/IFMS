import React, {FC, ReactNode} from 'react';

type PropsType = {
  label: string;
  children: ReactNode;
  items?: 'center' | 'start' | 'end';
};
const Description: FC<PropsType> = ({label, children, items = 'center'}) => {
  return (
    <div className={`items-${items} flex flex-row`}>
      <label className="w-40 text-sm">{label}</label>
      {typeof children === 'string' ? (
        <span children={children} className="text-sm" />
      ) : (
        children
      )}
    </div>
  );
};

export default Description;
