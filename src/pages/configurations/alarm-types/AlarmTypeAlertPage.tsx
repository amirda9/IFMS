import {FC} from 'react';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import AlarmCheckboxList from './AlarmCheckboxList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
import {setalarmsdetail} from '~/store/slices/alarmstypeslice';
import {$Put} from '~/util/requestapi';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const item = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Admin',
      },
      {
        label: 'Network Admin',
      },
      {
        label: 'Network Viewer',
      },
      {
        label: 'Region Admin',
      },
      {
        label: 'Region Viewer',
      },
      {
        label: 'Station Admin',
      },
      {
        label: 'Station Viewer',
      },
    ],
  },
];

const aboutoptions = [
  {label: 'Pending'},
  {label: 'Acknowledged'},
  {label: 'In progress'},
  {label: 'Resolved'},
];

const AlarmTypeAlertPage: FC = () => {
  const params = useParams();
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  const dispatch = useDispatch();
  const updatedefinition = async () => {
    const response = await $Put(`otdr/alarm/${params.alarmId}`, {
      alert_sending: alarmtypedetail.alert_sending,
    });
    if (response.status == 201) {
      toast('با موفقیت انجام شد', {type: 'success', autoClose: 1000});
    } else {
      toast('با خطا مواجه شد', {type: 'error', autoClose: 1000});
    }
  };
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex flex-grow flex-col gap-y-8">
        <Select
          onChange={e => {
            const alarmtypedetailCopy = deepcopy(alarmtypedetail);
            alarmtypedetailCopy.alert_sending.about = e.target.value;
            dispatch(setalarmsdetail(alarmtypedetailCopy));
          }}
          // value={cond.parameter}
          className="w-1/4 disabled:text-gray-400 disabled:opacity-100">
          {aboutoptions.map(data => (
            <option>{data.label}</option>
          ))}
        </Select>

        <div className="w-1/4">
          <AlarmCheckboxList type="sending" items={item} />
        </div>
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={updatedefinition} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeAlertPage;
