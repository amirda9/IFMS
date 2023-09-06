import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import {useAppSelector} from '~/hooks';

const SingleGroupLayout: FC = () => {
  const params = useParams();

  const isEditingGroupMembers = useAppSelector(
    state => state.userGroups.isEditingGroupMembers,
  );

  return (
    <div className="flex h-full w-full flex-col">
      {!isEditingGroupMembers && (
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
