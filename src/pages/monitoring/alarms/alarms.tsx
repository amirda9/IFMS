import {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {BiChevronRight, BiChevronsLeft, BiChevronsRight} from 'react-icons/bi';
import {BiChevronLeft} from 'react-icons/bi';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {$Get} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {changealarmstatus} from '~/store/slices/alarmsslice';
// *********************** type ***************************
enum severityamount {
  HIGHT = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}
enum statusamounts {
  PENDING = 'Pending',
  ACKNoWLEDGED = 'Acknowledged',
  INPROGRESS = 'In progress',
  RESOLVED = 'Resolved',
}

type alarmlist = {
  source_name: string;
  severity: severityamount;
  status: statusamounts;
  measurement_fk: string;
  rtu_fk: string;
  link_fk: string;
  network_id: string;
  region_id: string;
  alarm_type: string;
  id_list: [];
  acting_user: string;
  network_name: string;
  alarm_number: number;
  time_created: string;
  time_modified: string;
  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
};
// -------------------------------------------------------------

type topcolumnsType = {
  AlarmType: string;
  SourceType: string;
  Network: string;
  Alarms: number;
  Severity: severityamount;
  State: statusamounts;
  AlarmTime: string;
  LastModified: string;
  Detail: string;
  delete: string;
  id_list: string[];
};

function Alarms() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allalarmsdata, setAllalarmdata] = useState<topcolumnsType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sortkey, setSortkey] = useState('time_created');
  const dispatch = useDispatch();
  const [allpagecount, setAllpagecount] = useState<number>(1);
  const [totalalarms, setTotalalarms] = useState(0);
  const SetSourcKey = (name: string) => {
    if (name == 'Source Type') {
      setSortkey('source_name');
    } else if (name == 'Network') {
      setSortkey('Network');
    } else if (name == '# Alarms') {
      setSortkey('Alarms');
    } else if (name == 'Alarm Type') {
      setSortkey('alarm_type');
    } else if (name == 'Severity') {
      setSortkey('severity');
    } else if (name == 'Last Modified') {
      setSortkey('time_modified');
    } else if (name == 'State') {
      setSortkey('status');
    } else {
      setSortkey('time_created');
    }
  };

  const getallalarms = async (
    limitvalue: number = limit,
    pagevalue: number = page,
  ) => {
    try {
      setLoading(true);
      let allalarmresponse = await $Get(
        `otdr/alarm/events/?page=${pagevalue}&limit=${limitvalue}&sort_key=${sortkey}&sort_order=desc`,
      );
      let allalarmresponsedata: {
        alarm_events: [alarmlist];
        page_number: number;
        total_count: number;
      } = await allalarmresponse?.json(); 
      setTotalalarms(allalarmresponsedata.total_count);
      setAllpagecount(allalarmresponsedata.page_number);

      let newallalarmre = allalarmresponsedata.alarm_events.map(data => ({
        AlarmType: data.alarm_type,
        SourceType: data.source_name,
        Network: data?.network_name,
        Alarms: data.alarm_number,
        Severity: data.severity,
        State: data.status,
        AlarmTime: getPrettyDateTime(data.time_created),
        LastModified: getPrettyDateTime(data.time_modified),
        Detail: '',
        delete: '',
        id_list: data.id_list,
        tabbodybg: [
          {
            name: 'Severity',
            bg:
              data.severity == severityamount.LOW
                ? '#FFE600'
                : data.severity == severityamount.MEDIUM
                ? '#FF8A00'
                : '#FF0000',
          },
          ...(data?.status === statusamounts.RESOLVED
            ? [{name: 'State', bg: '#18C047'}]
            : []),
        ],
        tabrowbg:
          data?.to_timeout?.days == 0 &&
          data?.to_timeout?.hours == 0 &&
          data?.to_timeout?.minutes == 0
            ? '#F48F8F'
            : data?.to_escalation?.days == 0 &&
              data?.to_escalation?.hours == 0 &&
              data?.to_escalation?.minutes == 0
            ? '#FCC483'
            : '#ffffff',
      }));

      setAllalarmdata(newallalarmre);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changealarmstatus(false));
    getallalarms();
  }, [sortkey]);

  let timer: string | number | NodeJS.Timeout | undefined;
  const changelimit = (value: number) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setPage(1);
      getallalarms(value, 1);
    }, 1000);
  };

  // ********************************************************************************
  const topcolumns = {
    AlarmType: {label: 'Alarm Type', size: 'w-[18%]'},
    SourceType: {label: 'Source Type', size: 'w-[10%]'},
    Network: {label: 'Network', size: 'w-[18%]'},
    Alarms: {label: '# Alarms', size: 'w-[6%]'},
    Severity: {label: 'Severity', size: 'w-[10%]'},
    State: {label: 'State', size: 'w-[10%]'},
    AlarmTime: {label: 'Alarm Time', size: 'w-[14%]'},
    LastModified: {label: 'Last Modified', size: 'w-[14%]'},
    Detail: {label: 'Detail', size: 'w-[2%]'},
    delete: {label: 'Delete', size: 'w-[2%]'},
  };

  const handleNavigate = (value: string[]) => {
    navigate('alarmdetail', {state: {id_list: value}});
  };

  return (
    <div className="flex h-[calc(100vh-45px)] w-full flex-col items-center p-[10px] pb-[30px] pr-[20px] pt-[60px]">
      <Table
        loading={loading}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={allalarmsdata}
        onclicktitle={(e: string) => SetSourcKey(e)}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left min-h-[72px] max-h-[calc(100vh-200px)]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
        dynamicColumns={['Detail', 'delete']}
        renderDynamicColumn={({key, value}) => {
          if (key === 'Detail')
            return (
              <IoOpenOutline
                onClick={() => handleNavigate(value.id_list)}
                size={22}
                className="mx-auto cursor-pointer"
              />
            );
          else if (key === 'delete')
            return (
              <IoTrashOutline
                onClick={() => {}}
                className="mx-auto cursor-pointer text-red-500"
                size={22}
              />
            );
          else return <></>;
        }}
      />

      <div className=" absolute bottom-10 left-[30px] mt-6 pr-[10px] pt-[7px]">
        <div className="flex w-full flex-row items-center">
          <span className="text-[18px] font-normal leading-6">
            Total Alarm(s)
          </span>
          <input
            value={totalalarms}
            type="number"
            className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />

          <SimpleBtn
            onClick={
              page == 1
                ? () => {}
                : () => {
                    getallalarms(limit, page == 2 ? page - 1 : page - 2);
                    setPage(page == 2 ? page - 1 : page - 2);
                  }
            }
            className="ml-10 px-[2px] py-[5px]"
            type="button">
            <BiChevronsLeft size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronLeft
              onClick={
                page == 1
                  ? () => {}
                  : () => {
                      getallalarms(limit, page - 1);
                      setPage(page - 1);
                    }
              }
              size={20}
            />
          </SimpleBtn>
          <span className="text-18px] ml-[8px] font-normal leading-6">
            page
          </span>
          <input
            value={page}
            type="text"
            className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
          <span className="ml-2 mr-2">/{allpagecount}</span>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronRight
              onClick={
                page == allpagecount
                  ? () => {}
                  : () => {
                      getallalarms(limit, page + 1);
                      setPage(page + 1);
                    }
              }
              size={20}
            />
          </SimpleBtn>
          <SimpleBtn
            onClick={
              page == allpagecount
                ? () => {}
                : () => {
                    getallalarms(limit, page + 2);
                    setPage(page + 2);
                  }
            }
            className="ml-2 px-[2px] py-[5px]"
            type="button">
            <BiChevronsRight size={20} />
          </SimpleBtn>

          <span className="ml-8 text-[18px] font-normal leading-6">
            Rows Per Page
          </span>
          <input
            value={limit}
            onChange={e => {
              setLimit(Number(e.target.value)),
                changelimit(Number(e.target.value));
            }}
            type="text"
            className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Alarms;
