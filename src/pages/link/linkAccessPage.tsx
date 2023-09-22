import React from 'react';
import {useSelector} from 'react-redux';
import {Description, Select, SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
const dummy = [
  {index: 1, user: 'USER1', region: 'Region', station: 'Station'},
  {index: 2, user: 'USER2', region: 'Region', station: 'Station'},
  {index: 3, user: 'USER3', region: 'Region', station: 'Station'},
  {index: 4, user: 'USER4', region: 'Region', station: 'Station'},
  {index: 5, user: 'USER5', region: 'Region', station: 'Station'},
  {index: 6, user: 'USER6', region: 'Region', station: 'Station'},
];
const LinkAccessPage = () => {
  const {linkDetail} = useSelector((state: any) => state.http);
  console.log(linkDetail?.data?.access, 'fffrrtttt');
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Link Admin" className="mb-4">
          <Select className="w-80 text-sm">
            <option>ahmad kazemi</option>
          </Select>
        </Description>
        <Description
          label="Link Viewer(s)"
          items="start"
          className="h-full text-sm">
          <Table
            cols={columns}
            items={dummy}
            containerClassName="w-3/5 mt-[-5px]"
          />
        </Description>
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        {linkDetail?.data?.access == 'ADMIN' ? (
          <SimpleBtn link to="../edit-access">
            Edit Link Viewer(s)
          </SimpleBtn>
        ) : null}
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkAccessPage;
