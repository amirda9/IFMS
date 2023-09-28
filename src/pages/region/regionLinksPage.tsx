import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BASE_URL} from '~/constant';
import { BsChevronDown } from 'react-icons/bs';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[30%]', sort: true},
  source: {label: 'Source', size: 'w-[30%]'},
  destination: {label: 'Destination', size: 'w-[30%]'},
};

const RegionLinksPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
  };
  useEffect(() => {
    getrole();
  }, []);
  const params = useParams<{regionId: string}>();
  const {
    state: {list},
  } = useHttpRequest({
    selector: state => ({list: state.http.regionLinkList}),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!}});
    },
  });

  console.log(list?.data, 'list');

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
      <BsChevronDown className='absolute  left-[22%] z-20  top-[8px]' />
        <Table
          cols={columns}
          items={
            list?.data?.map(link => ({
              name: link?.name,
              source: link?.source,
              destination: link?.destination,
            })) || []
          }
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index}
          containerClassName="w-3/5"
          loading={list?.httpRequestStatus === 'loading'}
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        {userrole == 'superuser' ||
        networkDetail?.data?.access?.access == 'ADMIN' ||
        regionDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn link to="/links">
            Edit Links List
          </SimpleBtn>
        ) : null}
        {userrole == 'superuser' ||
        networkDetail?.data?.access?.access == 'ADMIN' ||
        regionDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn>Save</SimpleBtn>
        ) : null}
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionLinksPage;
