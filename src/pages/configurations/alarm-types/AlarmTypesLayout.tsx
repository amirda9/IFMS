import {FC} from 'react';
import { SidebarItem } from '~/components';
import {SidebarLayout} from '~/layout';

const AlarmTypesLayout: FC = () => {
  return (
    <SidebarLayout createTitle="Alarm Types Definition" canAdd>
      <SidebarItem name="Fiber Fault" to="alarm-fiber-fault-id-goes-here" />
    </SidebarLayout>
  );
};

export default AlarmTypesLayout;
