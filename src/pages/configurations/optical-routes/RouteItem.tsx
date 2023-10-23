import {FC} from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import {ControlledSelect} from '~/components';

type Props = {
  index: number;
  sourceOptions: {label: string}[];
  destinationOptions: {label: string}[];
  ductOptions: {label: string}[];
  fiberOptions: {label: string}[];
  selectedSource: string;
  selectedDestination: string;
  selectedDuct: string;
  selectedFiber: string;
};

const RouteItem: FC<Props> = ({
  index,
  sourceOptions,
  destinationOptions,
  ductOptions,
  fiberOptions,
  selectedSource,
  selectedDestination,
  selectedDuct,
  selectedFiber,
}) => {
  return (
    <div className="rounded-lg bg-arioCyan p-4 flex items-center gap-x-4">
      <span className='basis-10'>{index}</span>
      <div className='flex-1'>
        <ControlledSelect
          options={sourceOptions}
          value={selectedSource}
          onChange={() => {}}
          className='w-full text-[20px] leading-[24.2px]'
        />
      </div>
      <div className='flex-1'>
        <ControlledSelect
          options={destinationOptions}
          value={selectedDestination}
          onChange={() => {}}
          className='w-full text-[20px] leading-[24.2px]'
        />
      </div>
      <div className='flex-1'>
        <ControlledSelect
          options={ductOptions}
          value={selectedDuct}
          onChange={() => {}}
          className='w-full text-[20px] leading-[24.2px]'
        />
      </div>
      <div className='basis-30'>
        <ControlledSelect
          options={fiberOptions}
          value={selectedFiber}
          onChange={() => {}}
          className='w-full text-[20px] leading-[24.2px]'
        />
      </div>
      <div className='basis-10'>
        <IoTrashOutline className='text-red-500' size={24} />
      </div>
    </div>
  );
};

export default RouteItem;
