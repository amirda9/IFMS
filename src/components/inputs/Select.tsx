import React, {FC} from 'react';

type OptionType = {
  label: string;
  payload?: any;
};

type PropsType = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {options: OptionType[]; onChange: (index: number) => void};
const Select: FC<PropsType> = ({className, options, onChange, ...props}) => {
  return (
    <select
      className={
        'h-8 rounded-md border border-black bg-white px-2 ' + className
      }
      {...props}
      onChange={e => onChange(+e.target.value)}>
      {options.map((option, index) => (
        <option key={option.label + '__' + index} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
