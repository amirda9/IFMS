import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SingleRtuLayout: FC = () => {
  const params = useParams();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        <TabItem to="ports" name="Ports" />
      </div>

      <Outlet key={params.rtuId} />
    </div>
  );
};

export default SingleRtuLayout;
