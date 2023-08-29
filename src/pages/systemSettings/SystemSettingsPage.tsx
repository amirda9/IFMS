import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';

const SystemSettingsPage = () => {
  return (
    <SidebarLayout createTitle="System Settings">
      <SidebarItem name="Optical Route" to="optical-route" className="mr-6" />
      <SidebarItem name="System" to="system-settings" className="mr-6" />
      <SidebarItem
        name="Threshold Setting"
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
