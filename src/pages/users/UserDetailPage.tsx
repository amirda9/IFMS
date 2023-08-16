import {FC} from 'react';
import {useParams} from 'react-router-dom';

const UsersDetailPage: FC = () => {
  const {username} = useParams();

  return <div>USER: {username}</div>;
};

export default UsersDetailPage;
