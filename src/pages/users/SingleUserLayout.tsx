import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import {useAppSelector} from '~/hooks';

const SingleUserLayout: FC = () => {
  const params = useParams();

  const isEditingUserAccess = useAppSelector(
    state => state.userAccess.isEditingUserAccess,
  );

  return (
    <div className="flex h-full w-full flex-col">
      {!isEditingUserAccess && (
        <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
          <TabItem to="." name="Details" />
          <TabItem to="access" name="Access" />
          <TabItem to="groups" name="Groups" />
          <TabItem to="sessions" name="Sessions" />
          <TabItem to="authentication" name="Authentication" />
        </div>
      )}
      <Outlet key={params.username} />
    </div>
  );
};

export default SingleUserLayout;
