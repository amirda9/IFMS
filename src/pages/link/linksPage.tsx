import React from 'react';
import { SidebarLayout } from "~/layout";
import { SidebarItem } from "~/components";

const LinksPage = () => {
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Links" canAdd={true}>
      {[...new Array(4)].map((_, value) => (
        <SidebarItem
          name={`Link ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default LinksPage;
