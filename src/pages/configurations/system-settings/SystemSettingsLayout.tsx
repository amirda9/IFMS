import {SidebarItem} from '~/components';
import { UserRole } from '~/constant/users';
import { useAppSelector } from '~/hooks';
import {SidebarLayout} from '~/layout';
import ErrorPage403 from '~/pages/errors/403';

const SystemSettingsPage = () => {
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  if(loggedInUser.role !== UserRole.SUPER_USER){
    return <ErrorPage403 />
  }
  return (
    <SidebarLayout createTitle="System Settings">
      <SidebarItem name="Optical Route" to="optical-route" className="mr-6" />
      <SidebarItem name="System" to="system" className="mr-6" />
      <SidebarItem
        name="Threshold Settings"
        to="threshold-settings"
        className="mr-6"
      />
      <SidebarItem
        name="Monitoring Test"
        to="monitoring-test"
        className="mr-6"
      />
      <SidebarItem
        name="Proactive Maintenance Test"
        to="proactive-maintenance-test"
        className="mr-6"
      />
    </SidebarLayout>
  );
};

export default SystemSettingsPage;
