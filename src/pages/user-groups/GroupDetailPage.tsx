import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';

const GroupDetailPage: FC = () => {
  const {groupId} = useParams();

  const groupDetailQuery = useHttpRequest({
    selector: state => state.http.groupDetail,
    initialRequests: request => {
      request('groupDetail', {params: {group_id: groupId!}});
    },
  });

  console.log(groupDetailQuery);

  return <></>;
};

export default GroupDetailPage;
