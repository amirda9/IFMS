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
import Checkbox from '~/components/checkbox/checkbox';
import {deepcopy} from '~/util';
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

const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[20%]', sort: true},
  latitude: {label: 'latitude', size: 'w-[20%]', sort: true},
  longitude: {label: 'longitude', size: 'w-[20%]', sort: true},
};
// *****************************************************************************
const RegionstationlisteditPage = () => {
  const params = useParams<{regionId: string}>();
  const [leftloading, setLeftloading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [leftstationsorted, setLeftstationssorted] = useState<UserTableType[]>(
    [],
  );

  const [selectleft, setSelectleft] = useState<UserTableType[]>([]);

  useEffect(() => {
    const getnetworkstations = async () => {
      setLeftloading(true);
      try {
        let networlstationurl = `otdr/station/network/${
          params.regionId!.split('_')[1]
        }`;
        let regionstationresurl = `otdr/region/${
          params.regionId!.split('_')[0]
        }/stations`;

        const [networkstations, regionstations] = await Promise.all([
          $Get(networlstationurl),
          $Get(regionstationresurl),
        ]);
        const networkstationresponsedata = await networkstations.json();
        const regionstationresponsedata = await regionstations.json();

        setSelectleft(
          regionstationresponsedata.map((data: any) => ({
            id: data?.id,
            name: data?.name,
            latitude: '-',
            longitude: '-',
          })),
        );

        setLeftstationssorted(
          networkstationresponsedata?.map((data: any) => ({
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
      let selectleftCopy = deepcopy(selectleft);
      const findataindex = selectleft.findIndex(data => data.id == value.id);
      if (findataindex > -1) {
        selectleftCopy.splice(findataindex, 1);
      } else {
        selectleftCopy.push(value);
      }
      setSelectleft(selectleftCopy);
    };

  const renderDynamicColumn = (side: 'left' | 'right') => {
    return ({value, key, index}: RenderDynamicColumnType) => {
      if (key === 'index') return index + 1;
      else
        return (
          <Checkbox
            checkstatus={
              selectleft.findIndex(data => data.id == value.id) > -1
                ? true
                : false
            }
            onclick={changeSelect(side, value)}
            iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
            classname={
              ' border-[1px] ml-[10px] text-[#18C047] border-[#000000]'
            }
          />
        );
    };
  };

  const savestations = () => {
    let dataa = selectleft;
    dispatch(setnewregionstationlist(dataa));
    dispatch(setnewregionstationliststatus(true));
    navigate(-1);
  };
  // ------------------------------------------------------------------------
  return (
    <div className="mb-2 flex h-[calc(100vh-180px)]  w-full flex-row items-center justify-between p-6 pb-2">
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
        containerClassName="w-full h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('left')}
      />

      <div className="absolute bottom-[35px] right-0 mr-4 flex flex-row gap-x-4 self-end ">
        <SimpleBtn onClick={savestations} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn
          onClick={() => {
            // .map(data => data.id)
            dispatch(setnewregionstationlist(selectleft));
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
