import React, {useState} from 'react';
import {FormikProps, useField} from 'formik';
import {TextInput} from '~/components';
import {IoEyeOffOutline, IoEyeOutline} from 'react-icons/io5';

type InputType = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type PropsType = Omit<InputType, 'value'> & {
  name: string;
  hideEye?: boolean;
};
const InputFormik = ({
  name,
  hideEye = false,
  className,
  ...props
}: PropsType) => {
  const [fields, meta] = useField(name);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const inputType =
    props.type === 'password'
      ? passwordVisible
        ? 'text'
        : 'password'
      : props.type;

  return (
    <div
      className={`flex flex-grow flex-col items-start ${
        meta.touched && meta.error ? 'pb-1' : 'pb-5'
      }`}>
      <div className={`relative ${className}`}>
        <TextInput
          {...props}
          name={name}
          className={`border border-solid ${
            meta.error && meta.touched ? 'border-red-500' : ''
          } ${className} w-full`}
          value={fields.value}
          onChange={fields.onChange}
          onBlur={fields.onBlur}
          type={inputType}
        />
        {!hideEye &&
          props.type === 'password' &&
          (passwordVisible ? (
            <IoEyeOutline
              className="absolute right-2 top-2"
              onClick={() => setPasswordVisible(false)}
            />
          ) : (
            <IoEyeOffOutline
              className="absolute right-2 top-2"
              onClick={() => setPasswordVisible(true)}
            />
          ))}
      </div>

      {meta.touched && meta.error ? (
        <label htmlFor={props.id} className="text-xs text-red-500">
          {meta.error}
        </label>
      ) : null}
    </div>
  );
};

export default InputFormik;
