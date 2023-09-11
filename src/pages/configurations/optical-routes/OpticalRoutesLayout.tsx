import {FC} from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';

const OpticalRouteLayout: FC = () => {
  return (
    <SidebarLayout createTitle="Optical Routes" canAdd>
      <SidebarItem name="Optical Route 1" to="optical-route-id-goes-here" />
    </SidebarLayout>
  );
};

export default OpticalRouteLayout;
