import React from 'react';
import {useField} from 'formik';

type InputType = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type PropsType = Omit<InputType, 'value'> & {name: string};
const InputFormik = ({name, className, ...props}: PropsType) => {
  const [fields, meta] = useField(name);
  return (
    <div
      className={`flex flex-col ${
        meta.touched && meta.error ? 'pb-1' : 'pb-5'
      }`}
    >
      <input
        name={name}
        className={`${className} border-2 border-solid ${
          meta.error && meta.touched ? 'border-red-500' : 'border-transparent'
        }`}
        value={fields.value}
        onChange={fields.onChange}
        onBlur={fields.onBlur}
        {...props}
      />
      {meta.touched && meta.error ? (
        <label htmlFor={props.id} className={'text-red-500 text-xs'}>
          {meta.error}
        </label>
      ) : null}
    </div>
  );
};

export default InputFormik;
