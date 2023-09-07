import {FC} from 'react';
import { SidebarItem } from '~/components';
import { SidebarLayout } from '~/layout';

const RtuLayout: FC = () => {
  return (
    <SidebarLayout createTitle="Remove Test Units" canAdd>
      <SidebarItem name="RTU1" to="rtu-id-goes-here" />
    </SidebarLayout>
  );
};

export default RtuLayout;
