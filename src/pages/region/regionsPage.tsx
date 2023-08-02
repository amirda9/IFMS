import React from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';

const RegionsPage = () => {
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Regions">
      {[...new Array(4)].map((_, value) => (
        <SidebarItem
          name={`Region ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default RegionsPage;
