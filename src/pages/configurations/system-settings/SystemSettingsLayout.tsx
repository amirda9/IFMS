import {SidebarItem} from '~/components';
import { UserRole } from '~/constant/users';
import { useAppSelector } from '~/hooks';
import {SidebarLayout} from '~/layout';

const SystemSettingsPage = () => {
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  if(loggedInUser.role !== UserRole.SUPER_USER){
    return <></>
  }
  return (
    <SidebarLayout createTitle="System Settings">
      <SidebarItem selected={true} name="Optical Route" to="optical-route" className="mr-6" />
      <SidebarItem selected={true} name="System" to="system" className="mr-6" />
      <SidebarItem
      selected={true}
        name="Threshold Settings"
        to="threshold-settings"
        className="mr-6"
      />
      <SidebarItem
      selected={true}
        name="Monitoring Test"
        to="monitoring-test"
        className="mr-6"
      />
      <SidebarItem
      selected={true}
        name="Proactive Maintenance Test"
        to="proactive-maintenance-test"
        className="mr-6"
      />
    </SidebarLayout>
  );
};

export default SystemSettingsPage;
