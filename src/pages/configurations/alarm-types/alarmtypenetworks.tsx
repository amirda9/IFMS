import {SimpleBtn, Table} from '~/components';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {$Get, $Put} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {setalarmsdetail} from '~/store/slices/alarmstypeslice';
import {toast} from 'react-toastify';
import {useState} from 'react';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Network', size: 'w-[90%]', sort: true},
};

const Alarmtypenetworks = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  const [loading, setLoading] = useState(false);
  const cancel = async () => {
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
    }
  };

  const updatealarmtypenetworks = async () => {
    setLoading(true);
    const response = await $Put(`otdr/alarm/${params.alarmId}`, {
      alarm_networks: {
        network_id_list: alarmtypedetail.alarm_networks.network_id_list.map(
          data => data.id,
        ),
      },
    });
    if (response.status == 201) {
      const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);
      if (alarmdetailresponse.status == 200) {
        const alarmdetailresponsedata = await alarmdetailresponse.json();
        dispatch(setalarmsdetail(alarmdetailresponsedata));
        toast('با موفقیت انجام شد', {type: 'success', autoClose: 1000});
      } else {
        toast('با خطا مواجه شد', {type: 'error', autoClose: 1000});
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          onclicktitle={(tabname: string, sortalfabet: boolean) => {}}
          cols={columns}
          items={alarmtypedetail.alarm_networks.network_id_list}
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index + 1}
          containerClassName="w-1/2"
          loading={loading}
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../edit-alert-networks">
          Edit Networks
        </SimpleBtn>

        <SimpleBtn onClick={() => updatealarmtypenetworks()}>Save</SimpleBtn>

        <SimpleBtn type="button" onClick={() => cancel()}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default Alarmtypenetworks;
