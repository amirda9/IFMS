import {FC, Fragment} from 'react';
import {IoAddOutline, IoTrashOutline} from 'react-icons/io5';
import {ControlledSelect, Select} from '~/components';
import classNames from '~/util/classNames';

type Props = {
  title?: string;
  conditions?: {
    parameter: string;
    operator: '=' | '!=';
    value: string;
    andOr: 'AND' | 'OR';
    disabled?: boolean;
  }[];
};

const ConditionGroup: FC<Props> = ({title, conditions}) => {
  return (
    <div className="flex flex-col gap-y-6 rounded-lg bg-arioCyan px-6 py-4">
      <div className="flex">
        <span className="flex-grow font-semibold">{title}</span>
        <span className="flex flex-row">
          <IoAddOutline className="text-2xl text-green-500 active:text-green-300" />
          <span>Add</span>
        </span>
      </div>
      <div className="grid grid-cols-11 gap-y-2">
        <span className="col-span-3">Parameter</span>
        <span className="col-span-2">Operator</span>
        <span className="col-span-3">Value</span>
        <span className="col-span-2">AND/OR</span>
        <span className="col-span-1 flex justify-center">Delete</span>

        {conditions &&
          conditions.map(cond => (
            <Fragment
              key={cond.parameter + '_' + cond.operator + '_' + cond.value}>
              {/* Parameter */}
              <div className="col-span-3">
                <ControlledSelect
                  options={[{label: cond.parameter}]}
                  onChange={() => {}}
                  className="w-3/5 disabled:opacity-100 disabled:text-gray-400"
                  disabled={cond.disabled}
                  aria-disabled={cond.disabled}
                />
              </div>
              {/* Operator */}
              <div className="col-span-2">
                <ControlledSelect
                  options={[{label: cond.operator}]}
                  onChange={() => {}}
                  className="w-3/5 disabled:opacity-100 disabled:text-gray-400"
                  disabled={cond.disabled}
                  aria-disabled={cond.disabled}
                />
              </div>
              {/* Value */}
              <div className="col-span-3">
                <ControlledSelect
                  options={[{label: cond.value}]}
                  onChange={() => {}}
                  className="w-3/5 disabled:opacity-100 disabled:text-gray-400"
                  disabled={cond.disabled}
                  aria-disabled={cond.disabled}
                />
              </div>
              {/* AND / OR */}
              <div className="col-span-2">
                <ControlledSelect
                  options={[{label: cond.andOr}]}
                  onChange={() => {}}
                  className="w-3/5 disabled:opacity-100 disabled:text-gray-400"
                  disabled={cond.disabled}
                  aria-disabled={cond.disabled}
                />
              </div>
              {/* Delete */}
              <div className="col-span-1 flex justify-center">
                <IoTrashOutline
                  size={24}
                  aria-disabled={cond.disabled}
                  className="text-red-500 active:text-red-300"
                />
              </div>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default ConditionGroup;
