import React from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[30%]', sort: true},
  source: {label: 'Source', size: 'w-[30%]'},
  destination: {label: 'Destination', size: 'w-[30%]'},
};

const RegionLinksPage = () => {
  const params = useParams<{regionId: string}>();
  const {
    state: {list},
  } = useHttpRequest({
    selector: state => ({list: state.http.regionLinkList}),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!}});
    },
  });
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Table
          cols={columns}
          items={
            list?.data?.map(link => ({
              name: link.name,
              source: '-',
              destination: '-',
            })) || []
          }
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index}
          width="w-3/5"
          loading={list?.httpRequestStatus === 'loading'}
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="/links">
          Edit Links List
        </SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionLinksPage;
