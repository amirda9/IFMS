import {SimpleBtn, TextInput} from '~/components';
import {useDispatch} from 'react-redux';
import redicon from '~/assets/icons/noRed.png';
import orangeicon from '~/assets/icons/noOrange.png';
import yellowicon from '~/assets/icons/noYellow.png';
import {getPrettyDateTime} from '~/util/time';
import {
  changealarmstatus,
  changestate,
  setAlarmmodaldata,
  setShowParameters,
} from '~/store/slices/alarm/alarmsslice';
import Selectbox from '~/components/selectbox/selectbox';
import {useNavigate} from 'react-router-dom';
type modalvalue = {
  id: string,
  alarm_type: string,
  measurement_id: string,
  optical_route_id: string,
  test_setup_id: string,
  latitude: number,
  longitude: number,
  secondary_source: string,
  severity: string,
  status: string,
  region_name: string,
  region_admin: string,
  station_name: string,
  to_escalation: {
    days: number,
    hours: number,
    minutes: number
  },
  to_timeout: {
    days: number,
    hours: number,
    minutes: number
  },
  time_modified: string,
  time_created: string,
    contributing_conditions: [
      {
        parameter: string;
        operator: string;
        fault: string;
        coef: number;
        value: string;
        reference_value: number;
        measured_value: number;
      },
    ];
  }


// *************** types *************** types ******************** types ******
const AlarmRow = ({
  title,
  data,
  onchange = () => {},
}: {
  title: string;
  data: string | number;
  onchange?: () => void;
}) => {
  return (
    <div className="mt-6 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
        type={'text' || 'number'}
        onChange={onchange}
        value={data}
        className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
      />
    </div>
  );
};
const options = [
  {value: 'Pending', label: 'Pending'},
  {value: 'Acknowledged', label: 'Acknowledged'},
  {value: 'In progress', label: 'In progress'},
  {value: 'Resolved', label: 'Resolved'},
];

export type alldataType = {
  details: {
    source_name: string,
    severity: string,
    status: string,
    measurement_fk: string,
    rtu_fk: string,
    link_fk: string,
    route_fk: string,
    network_id: string,
    region_id: string,
    alarm_type: string,
    id_list: [],
    acting_user: string,
    network_name: string,
    alarm_number: 1,
    time_created: string,
    time_modified:string,
    to_escalation: {
      days: number,
      hours: number,
      minutes: number
    },
    to_timeout: {
      days: number,
      hours: number,
      minutes: number
    },
    region_name: string,
    link_name: string,
    station_name: string,
    cable: string,
    rtu_name: string,
    core: number,
    port: number
  };
  alarms: [
    {
      id: string,
      alarm_type: string,
      measurement_id: string,
      optical_route_id: string,
      test_setup_id: string,
      latitude: number,
      longitude: number,
      secondary_source: string,
      severity: string,
      status: string,
      region_name: string,
      region_admin: string,
      station_name: string,
      to_escalation: {
        days: number,
        hours: number,
        minutes: number
      },
      to_timeout: {
        days: number,
        hours: number,
        minutes: number
      },
      time_modified: string,
      time_created: string,
      contributing_conditions: [  {
        parameter: string;
        operator: string;
        fault: string;
        coef: number;
        value: string;
        reference_value: number;
        measured_value: number;
      },]
    }
  ];
  total_pages: number,
  total_count: number
};

type Iprops = {
  updateallarms?: (alarm_id: string, new_status: string) => void;
  allalarmdata: alldataType;
  onclickmap?: () => void;
  onclicktrace?:()=>void
};
function Index({updateallarms, allalarmdata, onclickmap = () => {},onclicktrace=()=>{}}: Iprops) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      {allalarmdata?.alarms &&
        allalarmdata?.alarms.map((data: modalvalue, index) => {
          let checkescalation =
            data?.to_escalation?.days == 0 &&
            data?.to_escalation?.minutes == 0 &&
            data?.to_escalation?.hours == 0
              ? false
              : true;
          let checketimeout =
            data?.to_timeout?.days == 0 &&
            data?.to_timeout?.minutes == 0 &&
            data?.to_timeout?.hours == 0
              ? false
              : true;

          return (
            <div
              key={index}
              className={`mt-4   rounded-[10px] ${
                !checketimeout
                  ? 'bg-[#F48F8F]'
                  : !checkescalation
                  ? 'bg-[#FCC483]'
                  : 'bg-[#C0E7F2]'
              }  p-8 pb-4 pt-[0px]`}>
              <div className="mt-4 flex w-full flex-row  items-center justify-between">
                <div className="flex h-10 w-[100px] flex-row">
                  <span className="text-[20px]">{index + 1}</span>
                  <img
                    src={
                      data.severity == 'Medium'
                        ? orangeicon
                        : data.severity == 'High'
                        ? redicon
                        : yellowicon
                    }
                    className="ml-10 h-[35px] w-[35px]"
                  />
                </div>
                <div className="flex flex-row-reverse">
                  <SimpleBtn
                    onClick={() => {
                      dispatch(setAlarmmodaldata(data));
                      dispatch(setShowParameters(true));
                    }}
                    className="">
                    Parameters
                  </SimpleBtn>
                  <SimpleBtn
                    onClick={() => {
                      onclicktrace()
                      navigate(
                        `/config/chart?opticalrout_id=${data.optical_route_id}&measurement_id=${data.measurement_id}&test_setup_fk=${data.test_setup_id}`,
                      );
                    }}
                    className="mx-2">
                    OTDR Trace
                  </SimpleBtn>
                  <SimpleBtn
                    onClick={() => {
                      onclickmap();
                      navigate(
                        `/monitoring/alarms/map?optical_route_id=${data.optical_route_id}&latitude=${data.latitude}&longitude=${data.longitude}&severity=${data.severity}`,
                      ),
                        dispatch(setShowParameters(false));
                    }}
                    // to={`/map?alarm_Id=${data!.id}&severity=${data!.severity}`}
                    className="">
                    Map View
                  </SimpleBtn>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="w-[46%]">
                  <AlarmRow title="Alarm Type" data={data.alarm_type} />
                  <AlarmRow
                    title="Network"
                    data={allalarmdata?.details?.network_name}
                  />
                  <AlarmRow title="Station" data={data.station_name} />
                  <AlarmRow
                    title="Last Modified"
                    data={getPrettyDateTime(data?.time_modified) || ''}
                  />
                  <AlarmRow
                    title="To Escalation"
                    data={`${data?.to_escalation?.days || 0} Day - ${
                      data?.to_escalation?.hours || 0
                    } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
                  />
                </div>

                <div className="flex w-[46%]  flex-col">
                  <div className="mt-8 flex flex-row items-center justify-between">
                    <span className="text-[20px]  font-normal leading-[24.2px]">
                      State
                    </span>
                    <Selectbox
                      defaultvalue={data.status}
                      onclickItem={(e: {value: string; label: string}) => {
                        updateallarms && updateallarms(data.id, e.value);

                        //   setAllupdateallarms(prev => [
                        //     ...prev,
                        //     {alarm_id: data.id, new_status: e.value},
                        //   ]);
                        dispatch(changestate({id: data.id, value: e.value}));
                        dispatch(changealarmstatus(false));
                      }}
                      options={options}
                      classname={
                        'h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white'
                      }
                    />
                  </div>
                  <AlarmRow title="Region" data={data?.region_name} />
                  <AlarmRow title="Region Admin" data={data.region_admin} />
                  <AlarmRow
                    title="Alarm Time"
                    data={getPrettyDateTime(data?.time_created) || ''}
                  />
                  <AlarmRow
                    title="To Time Out"
                    data={`${data?.to_escalation?.days || 0} Day - ${
                      data?.to_escalation?.hours || 0
                    } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default Index;
