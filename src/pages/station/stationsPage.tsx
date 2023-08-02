import React from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';

const StationsPage = () => {
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Stations">
      {[...new Array(4)].map((_, value) => (
        <SidebarItem
          name={`Station ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
