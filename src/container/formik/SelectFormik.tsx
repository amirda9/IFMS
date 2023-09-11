import React from 'react';
import {useField} from 'formik';
import {Select} from '~/components';
import classNames from '~/util/classNames';

type SelectType = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;
type PropsType = Omit<SelectType, 'value'> & {name: string};
const SelectFormik = ({name, className, ...props}: PropsType) => {
  const [fields, meta] = useField(name);
  return (
    <div
      className={classNames(
        'flex flex-grow flex-col',
        meta.touched && meta.error && 'pb-1',
      )}>
      <Select
        name={name}
        className={classNames(
          'border border-solid',
          meta.error && meta.touched && 'border-red-500',
          className,
        )}
        value={fields.value}
        onChange={fields.onChange}
        onBlur={fields.onBlur}
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

export default SelectFormik;
