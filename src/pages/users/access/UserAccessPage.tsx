import {FC} from 'react';
import {Description, Select} from '~/components';
import {Role} from '~/constant/users';
import AccessTable from './AccessTable';
import {useParams} from 'react-router-dom';

const roles = Object.values(Role).filter(val => val !== Role.SUPER_ADMIN);

const UserAccessPage: FC = () => {
  const {userId} = useParams();
  return (
    <>
      <Description label="Role" items="start" className="mb-4">
        <Select className="w-80">
          {roles.map(role => (
            <option selected value={role}>
              {role}
            </option>
          ))}
        </Select>
      </Description>
      <Description label="" items="start" className="h-full">
        <AccessTable userId={userId!} role={Role.NETWORK_ADMIN} />
      </Description>
    </>
  );
};

export default UserAccessPage;
