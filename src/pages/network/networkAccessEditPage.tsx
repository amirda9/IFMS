import React, {useState} from 'react';
import {GroupItem, SimpleBtn, Switch, Table, TallArrow} from '~/components';
import {FormLayout} from '~/layout';

const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[28%]', sort: true},
  region: {label: 'Region', size: 'w-[28%]'},
  station: {label: 'Station', size: 'w-[28%]'},
};
const dummy = [
  {id: 10, index: 1, user: 'USER1', region: 'Region', station: 'Station'},
  {id: 20, index: 2, user: 'USER2', region: 'Region', station: 'Station'},
  {id: 30, index: 3, user: 'USER3', region: 'Region', station: 'Station'},
  {id: 40, index: 4, user: 'USER4', region: 'Region', station: 'Station'},
  {id: 50, index: 5, user: 'USER5', region: 'Region', station: 'Station'},
  {id: 60, index: 6, user: 'USER6', region: 'Region', station: 'Station'},
];

const dummyGroupItems = [
  {label: 'USER1-Station1', value: 1},
  {label: 'USER1-Station1', value: 2},
  {label: 'USER1-Station1', value: 3},
  {label: 'USER1-Station1', value: 4},
  {label: 'USER1-Station1', value: 5},
  {label: 'USER1-Station1', value: 6},
];
const groups = [
  {label: 'Group1', items: dummyGroupItems},
  {label: 'Group2', items: dummyGroupItems},
  {label: 'Group3', items: dummyGroupItems},
  {label: 'Group4', items: dummyGroupItems},
];
const NetworkAccessPage = () => {
  const [state, setState] = useState(false);
  const buttons = (
    <>
      <SimpleBtn>OK</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  return (
    <FormLayout buttons={buttons} wrapperClassName="p-8">
      <div className="mb-4 flex flex-row items-center">
        <span>Users</span>
        <Switch wrapperClassName="mx-5" onChange={setState} checked={state} />
        <span>Groups</span>
      </div>
      <div className="flex h-full w-full flex-row items-center justify-between">
        {state ? (
          <Table
            width="w-[44%]"
            cols={{groups: {label: 'Groups'}}}
            items={groups}
            dynamicColumns={['groups']}
            renderDynamicColumn={({value}) => (
              <div className="px-4">
                <GroupItem items={value.items} label={value.label} />
              </div>
            )}
          />
        ) : (
          <Table
            cols={columns}
            items={dummy}
            width="w-[44%]"
            dynamicColumns={['select']}
            renderDynamicColumn={() => <input type="checkbox" />}
          />
        )}
        <div className="flex flex-col items-center">
          <SimpleBtn className="!w-28">Add</SimpleBtn>
          <TallArrow className="mt-7" />
          <TallArrow className="mb-7 mt-14 rotate-180" />
          <SimpleBtn className="!w-28">Remove</SimpleBtn>
        </div>
        <Table
          cols={columns}
          items={dummy}
          width="w-[44%]"
          dynamicColumns={['select']}
          renderDynamicColumn={() => <input type="checkbox" />}
        />
      </div>
    </FormLayout>
  );
};

export default NetworkAccessPage;
