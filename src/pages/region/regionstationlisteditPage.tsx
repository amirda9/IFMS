import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {GroupItem, SimpleBtn, Table, TallArrow} from '~/components';
import {useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {networkExplored} from '~/constant';

import Cookies from 'js-cookie';
import {useNavigate, useParams} from 'react-router-dom';
import {
  setnewregionstationlist,
  setnewregionstationliststatus,
} from './../../store/slices/networkslice';
import {useDispatch, useSelector} from 'react-redux';
type UserTableType = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
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
};
// *****************************************************************************
const RegionstationlisteditPage = () => {
  const {network} = useSelector((state: any) => state);
  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {state} = useHttpRequest({
    selector: state => ({
      regionstationlist: state.http.regionStationList,
      stations: state.http.networkstations,
    }),
    initialRequests: request => {
      request('regionStationList', {params: {region_id: params.regionId!}});
      if (networkId) {
        request('networkstations', {params: {network_id: networkId}});
      }
    },
  });

  console.log(state.stations,'🤩');
  
  const allstations =
    removeCommon(state?.stations?.data, state?.regionstationlist?.data)?.map(
      (data: any) => ({
        id: data?.id,
        name: data?.name,
        latitude: '-',
        longitude: '-',
      }),
    ) || [];
  const allsregiontations =
    state?.regionstationlist?.data?.map((data: any) => ({
      id: data?.id,
      name: data?.name,
      latitude: '-',
      longitude: '-',
    })) || [];

console.log("👽",allstations);

  const params = useParams<{regionId: string}>();
  const [leftstationsorted, setLeftstationssorted] =
    useState<UserTableType[]>(allstations);

  useEffect(() => {
    dispatch(setnewregionstationlist([]));
    setLeftstationssorted(allstations);
  }, []);

  const [reightstationsorted, setReightstationssorted] =
    useState<UserTableType[]>(allsregiontations);
  const [selectreight, setSelectreight] = useState<UserTableType[]>([]);
  const [selectleft, setSelectleft] = useState<UserTableType[]>([]);

  const changeSelect =
    (side: 'left' | 'right', value: UserTableType) => (key?: any) => {
      if (side == 'right') {
        const findremoveselect = selectreight.filter(
          (data: UserTableType) => data.id == value.id,
        );
        if (findremoveselect.length > 0) {
          const removeselect = selectreight.filter(
            (data: UserTableType) => data.id != value.id,
          );
          setSelectreight(removeselect);
        } else {
          setSelectreight(prev => [...prev, value]);
        }
      } else {
        const findremoveselect = selectleft.filter(
          (data: UserTableType) => data.id == value.id,
        );

        if (findremoveselect.length > 0) {
          const removeselectleft = selectleft.filter(
            (data: UserTableType) => data.id != value.id,
          );
          setSelectleft(removeselectleft);
        } else {
          setSelectleft(prev => [...prev, value]);
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
    let dataa = reightstationsorted;
    dispatch(setnewregionstationlist(dataa));
    dispatch(setnewregionstationliststatus(true));
    navigate(-1);
  };
  // ------------------------------------------------------------------------
  return (
    <div className="mb-2 flex h-[calc(100vh-150px)]  w-full flex-row items-center justify-between p-6 pb-2">
      <Table
        loading={state.stations?.httpRequestStatus !== 'success'}
        tabicon={'Name'}
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          const dataa = [...leftstationsorted];
          if (sortalfabet) {
            dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
          } else {
            dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
          }
          setLeftstationssorted(dataa);
        }}
        cols={columns}
        items={leftstationsorted}
        containerClassName="w-[44%] h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('left')}
      />

      <DoubleSideButtonGroup
        onClickRightButton={() => {
          if (selectleft.length > 0) {
            setReightstationssorted(prev => [...prev, ...selectleft]);
            const oldd = [...leftstationsorted];
            setLeftstationssorted(removeCommon(oldd, selectleft));
            setSelectleft([]);
          }
        }}
        onClickLeftButton={() => {
          if (selectreight.length > 0) {
            setLeftstationssorted(prev => [...prev, ...selectreight]);
            const old = [...reightstationsorted];
            setReightstationssorted(removeCommon(old, selectreight));
            setSelectreight([]);
          }
        }}
      />

      <Table
        loading={state.regionstationlist?.httpRequestStatus !== 'success'}
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          const dataa = [...reightstationsorted];
          if (sortalfabet) {
            dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
          } else {
            dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
          }
          setReightstationssorted(dataa);
        }}
        cols={columns}
        tabicon={'Name'}
        items={reightstationsorted}
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
              setnewregionstationlist(allsregiontations.map(data => data.id)),
            );
            dispatch(setnewregionstationliststatus(false));
            navigate(-1);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default RegionstationlisteditPage;
