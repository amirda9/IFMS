import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {SimpleBtn, Table} from '~/components';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
  setnewregionstationlist,
  setnewregionstationliststatus,
} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
import {$Get} from '~/util/requestapi';
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
  const params = useParams<{regionId: string}>();
  const [leftloading, setLeftloading] = useState(false);
  const [regionstation,setRegionStation]=useState<
  {
    id: string,
    name: string,
    longitude: string,
    latitude: string
  }[]
>([])
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [leftstationsorted, setLeftstationssorted] = useState<UserTableType[]>(
    [],
  );
  const [reightstationsorted, setReightstationssorted] =
    useState<UserTableType[]>([]);
  const [selectreight, setSelectreight] = useState<UserTableType[]>([]);
  const [selectleft, setSelectleft] = useState<UserTableType[]>([]);

  useEffect(() => {
    const getnetworkstations = async () => {
      setLeftloading(true);
      try {
        let networlstationurl=`otdr/station/network/${params.regionId!.split('_')[1]}`
        let regionstationresurl=`otdr/region/${params.regionId!.split('_')[0]}/stations`
    
        const [networkstations, regionstations] = await Promise.all([
          $Get(networlstationurl),
          $Get(regionstationresurl),
        ]);
        const networkstationresponsedata = await networkstations.json();
        const regionstationresponsedata = await regionstations.json();
        setRegionStation(regionstationresponsedata)
        setReightstationssorted(regionstationresponsedata.map((data: any) => ({
          id: data?.id,
          name: data?.name,
          latitude: '-',
          longitude: '-',
        })) || [])

        setLeftstationssorted(
          removeCommon(
            networkstationresponsedata,
            regionstationresponsedata,
          )?.map((data: any) => ({
            id: data?.id,
            name: data?.name,
            latitude: '-',
            longitude: '-',
          })) || [],
        );
      } catch (error) {
      } finally {
        setLeftloading(false);
      }
    };
    getnetworkstations();
    dispatch(setnewregionstationlist([]));
  }, []);


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
        loading={leftloading}
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
        loading={leftloading} 
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
             // .map(data => data.id)
            dispatch(
              setnewregionstationlist(regionstation),
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
