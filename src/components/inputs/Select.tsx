import React, {FC} from 'react';

type OptionType = {
  label: string;
  payload?: any;
};

type PropsType = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {options: OptionType[]; onChange: (value: string | number) => void, setValueProp?: (option: OptionType) => string | number};
const Select: FC<PropsType> = ({className, options, onChange, setValueProp, ...props}) => {
  return (
    <select
      className={
        'h-8 rounded-md border border-black bg-white px-2 ' + className
      }
      {...props}
      onChange={e => onChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={option.label + '__' + index} value={setValueProp ? setValueProp(option) : index}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
