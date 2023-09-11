import {FC} from 'react';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {ControlledSelect} from '~/components';
import {empty} from '~/util';
import classNames from '~/util/classNames';

export type RtuItemProps = {
  index: number;
  opticalRouteOptions: {label: string}[]; // Might need modification on the type
  opticalRoute: string;
  endStation: string;
  length: number;
  isActive?: boolean;
  isEmpty?: boolean;
};

const RtuPortItem: FC<RtuItemProps> = ({
  index,
  opticalRouteOptions,
  opticalRoute,
  endStation,
  length,
  isActive,
  isEmpty,
}) => {
  return (
    <div
      className={classNames(
        'flex items-center rounded-lg p-4',
        isEmpty ? 'bg-red-300' : isActive ? 'bg-success' : 'bg-neutral-400',
      )}>
      <span className="basis-20">{index}</span>
      <div className="flex-1">
        <ControlledSelect
          className="h-10 w-9/12"
          options={opticalRouteOptions}
          onChange={() => {}}
        />
      </div>
      <span className="flex-1">{!isEmpty && endStation}</span>
      <span className="basis-52">{!isEmpty && length}</span>
      <div className="basis-52">
        {!isEmpty && (
          <ControlledSelect
            className="h-10 w-[80%]"
            value={opticalRoute}
            options={[
              {label: 'Activated', payload: {active: true}},
              {label: 'Deactivated', payload: {active: true}},
            ]}
            onChange={() => {}}
            setValueProp={option => option.label}
          />
        )}
      </div>
      <div className="flex basis-40 flex-row justify-around gap-x-4">
        {!isEmpty && (
          <>
            <IoOpenOutline size={30} />
            <IoTrashOutline className="text-red-500" size={30} />
          </>
        )}
      </div>
    </div>
  );
};

export default RtuPortItem;
