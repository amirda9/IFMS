import {FC} from 'react';
import {IoAddOutline} from 'react-icons/io5';
import {Select} from '~/components';

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
    <div className="flex flex-col gap-y-6 bg-arioCyan px-6 py-4 rounded-lg">
      <div className="flex">
        <span className="flex-grow font-semibold">{title}</span>
        <span className="flex flex-row">
          <IoAddOutline className="text-2xl text-green-500 active:text-green-300" />
          <span>Add</span>
        </span>
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        <span className="col-span-2">Parameter</span>
        <span className="col-span-1">Operator</span>
        <span className="col-span-2">Value</span>
        <span className="col-span-1">AND/OR</span>
        <span className="col-span-1">Delete</span>

        {conditions &&
          conditions.map(cond => (
            <>
              <div className="col-span-2">
                <Select>
                  <option>{cond.parameter}</option>
                </Select>
              </div>
              <div className="col-span-1">
                <Select>
                  <option>{cond.operator}</option>
                </Select>
              </div>
              <div className="col-span-2">
                <Select>
                  <option>{cond.value}</option>
                </Select>
              </div>
              <div className="col-span-1">
                <Select>
                  <option>{cond.andOr}</option>
                </Select>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default ConditionGroup;
