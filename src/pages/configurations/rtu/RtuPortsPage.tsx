import {FC} from 'react';
import {SimpleBtn} from '~/components';

const RtuPortsPage: FC = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-grow flex-col gap-y-4"></div>
      <div className="flex gap-x-4 self-end">
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RtuPortsPage;
