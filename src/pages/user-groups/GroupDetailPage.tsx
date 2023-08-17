import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {Description, TextInput} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {useHttpRequest} from '~/hooks';

const GroupDetailPage: FC = () => {
  const {groupId} = useParams();

  const groupDetailQuery = useHttpRequest({
    selector: state => state.http.groupDetail,
    initialRequests: request => {
      request('groupDetail', {params: {group_id: groupId!}});
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {groupDetailQuery.state?.data ? (
        <>
          <Description label="Name">
            <TextInput
              className="disabled:cursor-not-allowed disabled:bg-slate-200"
              name="groupName"
              disabled
              value={groupDetailQuery.state.data.name}
            />
          </Description>
          <Description label="Owner">
            <span>{groupDetailQuery.state.data.owner || 'N/A'}</span>
          </Description>
          <Description label="Created">
            <span>{groupDetailQuery.state.data.time_created || 'N/A'}</span>
          </Description>
          <Description label="Last Modified">
            <span>{groupDetailQuery.state.data.time_updated || 'N/A'}</span>
          </Description>
        </>
      ) : (
        <GeneralLoadingSpinner />
      )}
    </div>
  );
};

export default GroupDetailPage;
