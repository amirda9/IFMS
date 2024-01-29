import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {BASE_URL} from '~/constant';
import {setnewregionlinklist,setnewregionlinkliststatus} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
import { $Get } from '~/util/requestapi';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[30%]', sort: true},
  source: {label: 'Source', size: 'w-[30%]'},
  destination: {label: 'Destination', size: 'w-[30%]'},
};

const RegionLinksPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const dispatch=useDispatch()
  const {newregionlinklist,newregionlinkliststatus} = useSelector((state: any) => state.network);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const [tabname, setTabname] = useState('Name');
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
    state: {list},
    request,
  } = useHttpRequest({
    selector: state => ({
      list: state.http.regionLinkList,
      remove: state.http.removeregionLinkList,
      add: state.http.addregionLinkList,
    }),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!.split("_")[0]}});
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.add?.httpRequestStatus === 'loading' &&
        state.add!.httpRequestStatus === 'success'
      ) {
        request('regionLinkList', {params: {region_id: params.regionId!.split("_")[0]}});
      }
    },
  });

  let items =
    list?.data?.map(link => ({
      name: link?.name,
      source: link?.source,
      destination: link?.destination,
    })) || [];


    

  useEffect(() => {
    if(newregionlinkliststatus){
      setItemssorted(newregionlinklist);
    }else{
      const getregionlinklist=async()=>{
        try {
          const response=await $Get(`otdr/region/${params.regionId!.split("_")[0]}/links`)
          const responsedata=await response.json()
          setItemssorted(responsedata.sort((a:any, b:any) => a.name.localeCompare(b.name, 'en-US')));
        } catch (error) {
          console.log(error);
        }       
      }
      getregionlinklist()
    }
  }, [newregionlinkliststatus]);

  const sortddata = (tabname: string, sortalfabet: boolean) => {
    const newitem=newregionlinkliststatus?[...newregionlinklist]:[...items]
    if (sortalfabet) {
      newitem.sort(
        (a: any, b: any) =>
          -a[tabname.toLowerCase()].localeCompare(
            b[tabname.toLowerCase()],
            'en-US',
          ),
      );
    } else {
      newitem.sort((a: any, b: any) =>
        a[tabname.toLowerCase()].localeCompare(
          b[tabname.toLowerCase()],
          'en-US',
        ),
      );
    }
    setItemssorted(newitem);
  };

  const save = () => {
    const appenddata = [];
    const removedata = [];
    const alllist = list?.data || [];
    const newregionlinklist2=newregionlinklist.map((data:any) => data.id)
    for (let i = 0; i < alllist.length; i++) {
      const find = newregionlinklist2.findIndex(
        (data: any) => data == alllist[i].id,
      );
      if (find < 0) {
        removedata.push(alllist[i].id);
      }
    }

    for (let j = 0; j < newregionlinklist2.length; j++) {
      const find = alllist.findIndex(
        (data: any) => data.id == newregionlinklist2[j],
      );
      if (find < 0) {
        appenddata.push(newregionlinklist2[j]);
      }
    }

    let first = list?.data || [];
    if (first.length == 0 && newregionlinklist?.length == 0) {
    } else {
      request('addregionLinkList', {
        params: {region_id: params.regionId!.split("_")[0]},
        data: {links_id: appenddata || []},
      });
      request('removeregionLinkList', {
        params: {region_id: params.regionId!.split("_")[0]},
        data: {links_id: removedata || []},
      });
    }

    dispatch(setnewregionlinkliststatus(false))
    dispatch(setnewregionlinklist([]))
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          tabicon={tabname}
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            setTabname(tabname);
            sortddata(tabname, sortalfabet);
          }}
          cols={columns}
          items={itemssorted}
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index + 1}
          containerClassName="w-full"
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
          <SimpleBtn onClick={newregionlinkliststatus?save:()=>{}}>Save</SimpleBtn>
        ) : null}
        <SimpleBtn onClick={()=>{
          dispatch(setnewregionlinkliststatus(false))
          dispatch(setnewregionlinklist([]))
        }}>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionLinksPage;
