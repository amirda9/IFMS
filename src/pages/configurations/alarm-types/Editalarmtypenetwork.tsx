import {SimpleBtn, Table} from '~/components';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {deepcopy} from '~/util';
import {$Get} from '~/util/requestapi';
import Checkbox from '~/components/checkbox/checkbox';
import {
  setAlarmNetworks,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {RootState} from '~/store';
type UserTableType = {
  id: string;
  name: string;
};

type RenderDynamicColumnType = {
  index: number;
  value: UserTableType;
  key: 'index' | 'select';
};


const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[84%]', sort: true},
};
// *************************************************************************************
const Editalarmtypenetwork = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const params = useParams();
  const {alarmtypedetail, alarmtypelist} = useSelector(
    (state: RootState) => state.alarmtypes,
  );
  const [allnetwork, setAllnetwork] = useState<{id: string; name: string}[]>(
    [],
  );

  const renderDynamicColumn = (side: 'left' | 'right') => {
    return ({value, key, index}: RenderDynamicColumnType) => {
      if (key === 'index') return index + 1;
      else
        return (
          <Checkbox
            checkstatus={
              alarmtypedetail.alarm_networks.network_id_list.findIndex(
                data => data.id == value.id,
              ) > -1?true:false
            }
            onclick={() =>
              dispatch(setAlarmNetworks({id: value.id, name: value.name}))
            }
            iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
            classname={
              ' border-[1px] ml-[10px] text-[#18C047] border-[#000000]'
            }
          />
        );
    };
  };

  useEffect(() => {
    const getallnetworks = async () => {
      setLoading(true)
      const response = await $Get(`otdr/network/`);
      if (response.status == 200) {
        const responsedata = await response.json();
        setAllnetwork(
          responsedata.map((data: any) => ({id: data.id, name: data.name})),
        );
      }
      setLoading(false)
    };
    getallnetworks();
  }, []);

  const canceledit = async () => {
    const alarmtypedetailCopy = deepcopy(alarmtypedetail);
    const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);
    if (alarmdetailresponse.status == 200) {
      const alarmdetailresponsedata = await alarmdetailresponse.json();
      if (alarmdetailresponsedata.alarm_networks == null) {
        alarmtypedetailCopy.alarm_networks = {network_id_list: []};
      } else {
        alarmtypedetailCopy.alarm_networks.network_id_list =
          alarmdetailresponsedata.alarm_networks.network_id_list;
      }
      dispatch(setalarmsdetail(alarmtypedetailCopy));
      navigate(-1);
    }
  };
  // ------------------------------------------------------------------------
  return (
    <div className="mb-2 flex h-[calc(100vh-150px)]  w-full flex-row   px-6   pb-2  pt-0">
      <Table
        onclicktitle={(tabname: string, sortalfabet: boolean) => {}}
        loading={loading}
        cols={columns}
        items={allnetwork}
        containerClassName="w-3/4 h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('left')}
      />

      <div className="absolute bottom-[35px] right-0 mr-4 flex flex-row gap-x-4 self-end ">
        <SimpleBtn onClick={() => navigate(-1)} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn type="button" onClick={canceledit}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default Editalarmtypenetwork;

