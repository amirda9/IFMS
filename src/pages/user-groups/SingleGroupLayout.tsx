import {FC} from 'react';
import {Outlet, useLocation, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SingleGroupLayout: FC = () => {
  const params = useParams();
  const location = useLocation();

  return (
    <div className="flex h-full w-full flex-col">
      {!location.state?.fullLayout && (
        <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
          <TabItem to="." name="Details" />
          <TabItem to="members" name="Members" />
        </div>
      )}

      <Outlet key={params.groupId} />
    </div>
  );
};

export default SingleGroupLayout;
