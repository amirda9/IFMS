import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {GroupItem, SimpleBtn, Table, TallArrow} from '~/components';
import {useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {networkExplored} from '~/constant';

import Cookies from 'js-cookie';
import {useNavigate, useParams} from 'react-router-dom';
import {setnewregionlinklist} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
import { array } from 'yup';
type UserTableType = {
  id: string;
  name: string;
  source: string;
  destination: string;
};

type RenderDynamicColumnType = {
  index: number;
  value: UserTableType;
  key: 'index' | 'select';
};
function isEqual(obj1: any, obj2: any) {
  return obj1.id === obj2.id;
}
function removeCommon(arr1: any, arr2: any) {
  return arr1?.filter(function (item: any) {
    return !arr2.some(function (other: any) {
      return isEqual(item, other);
    });
  });
}
const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[28%]', sort: true},
  source: {label: 'Source', size: 'w-[28%]'},
  destination: {label: 'Destination', size: 'w-[28%]'},
};
// *****************************************************************************
const RegionlinklisteditPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state} = useHttpRequest({
    selector: state => ({
      regionLinkList: state.http.regionLinkList,
      links: state.http.allLinks,
    }),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!}});
      if (networkId) {
        request('allLinks', undefined);
      }
    },
  });

  
  const [change, setCange] = useState(false);
  const [lefttableselecttab, setLefttableselecttab] = useState('Name');
  const [reighttableselecttab, setReighttableselecttab] = useState('Name');
  const [lefttablesorte, setLefttablesort] = useState(false);
  const [reighttablesorte, setreighttablesort] = useState(false);
  const networkId = Cookies.get(networkExplored);
  const params = useParams<{regionId: string}>();
  const [mount, setmount] = useState(false);
  const [leftlinksorted, setLeftlinksorted] = useState<UserTableType[]>([]);
  const [tabnameleft, setTabnameleft] = useState('Name');
  const [reightlinksorted, setReightlinksorted] = useState<UserTableType[]>([]);
const regionlinklist=state.regionLinkList?.data || []
  useEffect(() => {
    dispatch(setnewregionlinklist([]));
    setReightlinksorted(
      state.regionLinkList?.data?.map((data: any) => ({
        id: data?.id,
        name: data?.name,
        source: data?.source,
        destination: data?.destination,
      }))?.sort((a:any, b:any) =>
        a?.name?.localeCompare(b?.name, 'en-US'),
      ) || [],
    );
    setLeftlinksorted(
      removeCommon(
        state?.links?.data?.map(data => ({
          id: data?.id,
          name: data?.name,
          source:data?.source?.name,
          destination:data?.destination?.name,
        })),
        state?.regionLinkList?.data,
      )
        ?.map((data: any) => ({
          id: data?.id,
          name: data?.name,
          source: data?.source,
          destination: data?.destination,
        }))
        ?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name, 'en-US')) || [],
    );
  }, []);

  const [selectreight, setSelectreight] = useState<UserTableType[]>([]);
  const [selectleft, setSelectleft] = useState<UserTableType[]>([]);

  const changeSelect =
    (side: 'left' | 'right', value: UserTableType) => (key?: any) => {
      if (side == 'right') {
        const findremoveselect = selectreight.filter(
          (data: UserTableType) => data.id == value.id,
        );
        const findreightselect = reightlinksorted.filter(
          (data: UserTableType) => data.id == value.id,
        );
        if (findremoveselect.length > 0) {
          const removeselect = selectreight.filter(
            (data: UserTableType) => data.id != value.id,
          );
          setSelectreight(removeselect);
        } else {
          setSelectreight(prev => [...prev, findreightselect[0]]);
        }
      } else {
        const findremoveselect = selectleft.filter(
          (data: UserTableType) => data.id == value.id,
        );
        const findleftselect = leftlinksorted.filter(
          (data: UserTableType) => data.id == value.id,
        );

        if (findremoveselect.length > 0) {
          const removeselectleft = selectleft.filter(
            (data: UserTableType) => data.id != value.id,
          );
          setSelectleft(removeselectleft);
        } else {
          setSelectleft(prev => [...prev, findleftselect[0]]);
        }
      }
    };

  const renderDynamicColumn = (side: 'left' | 'right') => {
    return ({value, key, index}: RenderDynamicColumnType) => {
      if (key === 'index') return index + 1;
      else
        return (
          <input
            type="checkbox"
            checked={(side === 'left' ? selectleft : selectreight).includes(
              value,
            )}
            onChange={changeSelect(side, value)}
          />
        );
    };
  };

  const savestations = () => {
    let dataa = reightlinksorted.map((data: UserTableType) => data.id);
    dispatch(setnewregionlinklist(dataa));
    navigate(-1);
  };

  const sortleft = (tabname: string, sortalfabet: boolean) => {
    console.log(sortalfabet,'sortalfabet');
    
    const old =JSON.parse(JSON.stringify(leftlinksorted))
    if (tabname != 'Index') {
      if (sortalfabet) {
          old.sort(
            (a: any, b: any) =>
              -a[tabname.toLocaleLowerCase()].localeCompare(
                b[tabname.toLocaleLowerCase()],
                'en-US',
              ),
          );
      } else {
          old.sort((a: any, b: any) =>
            a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
          );
      }
      setLeftlinksorted(old);
    }
  };

  const sortdright = (tabname: string, sortalfabet: boolean) => {
    const old = [...reightlinksorted];
    if (tabname != 'Index') {
      if (sortalfabet) {

          old.sort(
            (a: any, b: any) =>
              -a[tabname.toLocaleLowerCase()].localeCompare(
                b[tabname.toLocaleLowerCase()],
                'en-US',
              ),
          );
 
      } else {

          old.sort((a: any, b: any) =>
            a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
          );
     
      }
      setReightlinksorted(old);
    }
  };

  useEffect(() => {
    if (mount) {
      if (reighttableselecttab != 'Index') {
        sortdright(reighttableselecttab, reighttablesorte);
      }
    }
    setmount(true);
  }, [reighttableselecttab, reighttablesorte, change]);

  useEffect(() => {
    if (mount) {
      if (lefttableselecttab != 'Index') {
        sortleft(lefttableselecttab, lefttablesorte);
      }
    }
    setmount(true);
  }, [lefttableselecttab, lefttablesorte, change]);
  // ------------------------------------------------------------------------
  return (
    <div className="mb-2 flex h-[calc(100vh-150px)]  w-full flex-row items-center justify-between p-6 pb-2">
      <Table
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          setLefttableselecttab(tabname), setLefttablesort(sortalfabet);
        }}
        loading={state.links?.httpRequestStatus !== 'success'}
        tabicon={lefttableselecttab}
        cols={columns}
        items={leftlinksorted}
        containerClassName="w-[44%] h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('left')}
      />

      <DoubleSideButtonGroup
        onClickRightButton={() => {
          if (selectleft.length > 0) {
            setReightlinksorted(prev => [...prev, ...selectleft]);
            const oldd = [...leftlinksorted];
            setLeftlinksorted(removeCommon(oldd, selectleft));
            setSelectleft([]);
          }
          setCange(!change);
        }}
        onClickLeftButton={() => {
          if (selectreight.length > 0) {
            setLeftlinksorted(prev => [...prev, ...selectreight]);
            const old = [...reightlinksorted];
            setReightlinksorted(removeCommon(old, selectreight));
            setSelectreight([]);
          }
          setCange(!change);
        }}
      />

      <Table
        loading={state.regionLinkList?.httpRequestStatus !== 'success'}
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          setReighttableselecttab(tabname), setreighttablesort(sortalfabet);
        }}
        cols={columns}
        tabicon={reighttableselecttab}
        items={reightlinksorted}
        containerClassName="w-[44%] h-[calc(100vh-260px)] ml-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('right')}
      />
      <div className="absolute bottom-[35px] right-0 mr-4 flex flex-row gap-x-4 self-end ">
        <SimpleBtn onClick={savestations} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn
          onClick={() => {
            dispatch(
              setnewregionlinklist(
                state?.regionLinkList?.data?.map((data: any) => data?.id) || [],
              ),
            );
            navigate(-1);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default RegionlinklisteditPage;
