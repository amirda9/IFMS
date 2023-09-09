import React from 'react';
import {useField} from 'formik';
import {Textarea} from '~/components';
import classNames from '~/util/classNames';

type InputType = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;
type PropsType = Omit<InputType, 'value'> & {name: string};
const TextareaFormik = ({name, className, ...props}: PropsType) => {
  const [fields, meta] = useField(name);
  return (
    <div
      className={classNames(
        'flex flex-grow flex-col',
        meta.touched && meta.error && 'pb-1',
      )}>
      <Textarea
        name={name}
        className={classNames(
          'border border-solid',
          meta.error && meta.touched && 'border-red-500',
          className,
        )}
        onBlur={fields.onBlur}
        onChange={fields.onChange}
        value={fields.value}
        {...props}
      />
      {meta.touched && meta.error ? (
        <label htmlFor={props.id} className="text-xs text-red-500">
          {meta.error}
        </label>
      ) : null}
    </div>
  );
};

export default TextareaFormik;
