import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BASE_URL} from '~/constant';
import {BsChevronDown} from 'react-icons/bs';
import {string} from 'yup';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[30%]', sort: true},
  source: {label: 'Source', size: 'w-[30%]'},
  destination: {label: 'Destination', size: 'w-[30%]'},
};

const RegionLinksPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {newregionlinklist} = useSelector((state: any) => state.network);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const [itemssorted, setItemssorted] = useState<
    {
      name: string;
      source: string;
      destination: string;
    }[]
  >([]);
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
    state: {list},request
  } = useHttpRequest({
    selector: state => ({list: state.http.regionLinkList}),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!}});
    },
  });

  let items =
    list?.data?.map(link => ({
      name: link?.name,
      source: link?.source,
      destination: link?.destination,
    })) || [];
  


  useEffect(() => {
    setItemssorted(items.sort((a, b) => a.name.localeCompare(b.name, 'en-US')));
  }, []);

  const sortddata = (tabname: string, sortalfabet: boolean) => {
    if (sortalfabet) {
      items.sort(
        (a: any, b: any) =>
          -a[tabname.toLowerCase()].localeCompare(
            b[tabname.toLowerCase()],
            'en-US',
          ),
      );
    } else {
      items.sort((a: any, b: any) =>
        a[tabname.toLowerCase()].localeCompare(
          b[tabname.toLowerCase()],
          'en-US',
        ),
      );
    }
    setItemssorted(items);
  };

  const save=()=>{
    let first =list?.data || [];
    if (first.length == 0 && newregionlinklist?.length == 0) {
    } else {
      request('updateregionLinkList', {
        params: {region_id: params.regionId!},
        data: {links_id: newregionlinklist || []},
      });
    }
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          onclicktitle={(tabname: string, sortalfabet: boolean) =>
            sortddata(tabname, sortalfabet)
          }
          tabicon={'Name'}
          cols={columns}
          items={itemssorted}
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
          <SimpleBtn link to="../edit-linklist">
            Edit Links List
          </SimpleBtn>
        ) : null}
        {userrole == 'superuser' ||
        networkDetail?.data?.access?.access == 'ADMIN' ||
        regionDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn onClick={save}>Save</SimpleBtn>
        ) : null}
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionLinksPage;
