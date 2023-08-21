import {FC, useState} from 'react';
import {ControlledSelect, Description, Select} from '~/components';
import {Role} from '~/constant/users';
import AccessTable from './AccessTable';
import {useParams} from 'react-router-dom';

const roleOptions = Object.values(Role)
  .filter(val => val !== Role.SUPER_ADMIN)
  .map(role => ({label: role}));

const UserAccessPage: FC = () => {
  const {userId} = useParams();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.NETWORK_ADMIN);
  return (
    <>
      <Description label="Role" items="start" className="mb-4">
        <ControlledSelect
          options={roleOptions}
          onChange={value => setSelectedRole(value as Role)}
          value={selectedRole}
          setValueProp={option => option.label}
        />
      </Description>
      <Description label="" items="start" className="h-full">
        <AccessTable userId={userId!} role={selectedRole} />
      </Description>
    </>
  );
};

export default UserAccessPage;
