import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SingleGroupLayout: FC = () => {
  const params = useParams();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="members" name="Members" />
      </div>
      <Outlet key={params.groupId} />
    </div>
  );
};

export default SingleGroupLayout;
