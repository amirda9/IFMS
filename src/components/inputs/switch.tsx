import React, {FC, useState} from 'react';

type PropsType = {
  checked?: boolean;
  wrapperClassName?: string;
  onChange?: (state: boolean) => void;
};
const Switch: FC<PropsType> = ({checked, wrapperClassName, onChange}) => {
  const [state, setState] = useState(checked);

  const isChecked = state ;
  return (
    <div
      className={`flex w-12 flex-row rounded-lg bg-white [&_.switch-btn]:active:opacity-50 ${
        isChecked ? 'justify-end' : 'justify-start'
      } ${wrapperClassName}`}
      onClick={() => {
        onChange?.(!isChecked);
        setState(!isChecked);
      }}>
      <span className="switch-btn h-4 w-7 rounded-lg bg-buttonColor" />
    </div>
  );
};

export default Switch;
