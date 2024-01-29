import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {SimpleBtn, Table} from '~/components';
import {useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {useNavigate, useParams} from 'react-router-dom';
import {setnewregionlinklist,setnewregionlinkliststatus} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
import { deepcopy } from '~/util';
import { $Get } from '~/util/requestapi';
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
// *************************************************************************************
const RegionlinklisteditPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state} = useHttpRequest({
    selector: state => ({
      regionLinkList: state.http.regionLinkList,
    }),
    initialRequests: request => {
      request('regionLinkList', {params: {region_id: params.regionId!.split("_")[0]}});
    },
  });



  const [change, setCange] = useState(false);
  const [lefttableselecttab, setLefttableselecttab] = useState('Name');
  const [reighttableselecttab, setReighttableselecttab] = useState('Name');
  const [lefttablesorte, setLefttablesort] = useState(false);
  const [reighttablesorte, setreighttablesort] = useState(false);
  const [loading,setloading]=useState(false)
  const params = useParams<{regionId: string}>();
  const [mount, setmount] = useState(false);
  const [leftlinksorted, setLeftlinksorted] = useState<UserTableType[]>([]);
  const [reightlinksorted, setReightlinksorted] = useState<UserTableType[]>([]);

  useEffect(() => {
    dispatch(setnewregionlinklist([]));
    setReightlinksorted(
      state.regionLinkList?.data
        ?.map((data: any) => ({
          id: data?.id,
          name: data?.name,
          source: data?.source,
          destination: data?.destination,
        }))
        ?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name, 'en-US')) ||
        [],
    );
    const networklinklist=async()=>{
      try {
        setloading(true)
        const responst=await $Get(`otdr/link/network/${params.regionId!.split("_")[1]}`)
        const responstdata=await responst.json()
        setLeftlinksorted(
          removeCommon(
            responstdata.map((data:any) => ({
              id: data?.id,
              name: data?.name,
              source: data?.source?.name,
              destination: data?.destination?.name,
            })),
            state?.regionLinkList?.data,
          )
            ?.map((data: any) => ({
              id: data?.id,
              name: data?.name,
              source: data?.source,
              destination: data?.destination,
            }))
            ?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name, 'en-US')) ||
            [],
        );
      } catch (error) {
        console.log(error)
      } finally {
        setloading(false)
      }
      
    }
    networklinklist()
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
    let dataa = reightlinksorted.map((data: any) => ({
      name: data?.name,
      id:data.id,
      source: data?.source,
      destination: data?.destination,
    })).sort((a, b) => a.name.localeCompare(b.name, 'en-US'));

    dispatch(setnewregionlinklist(dataa));
    dispatch(setnewregionlinkliststatus(true))
    navigate(-1);
  };

  const sortleft = (tabname: string, sortalfabet: boolean) => {
    const old = deepcopy(leftlinksorted);
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
        loading={loading}
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
              setnewregionlinkliststatus(false)
              // setnewregionlinklist(
              //   state?.regionLinkList?.data?.map((data: any) => data?.id) || [],
              // ),
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
