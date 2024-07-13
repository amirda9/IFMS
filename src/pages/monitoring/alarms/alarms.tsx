import {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {BiChevronRight, BiChevronsLeft, BiChevronsRight} from 'react-icons/bi';
import {BiChevronLeft} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Select} from '~/components';
import Rectangle from '~/assets/icons/Rectangle 112.png';
import Checkbox from '~/components/checkbox/checkbox';
import {$Delete, $Get} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';
import {deepcopy} from '~/util';
import {Link} from 'react-router-dom';
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


function truncateString(str:string) {
  if (str.length <= 20) {
  return str;
  }
  return str.slice(0, 20) + '...';
  }


type alarmtype = {
  id: string;
  alarm_type: string;
  source_name: string;
  severity: severityamount;
  status: statusamounts;
  time_created: string;
  time_modified: string;
  acting_user: string;
  tabrowbg?: string;
  tabbodybg?: {name: string; bg: string}[];
};
type allalarmsdatatype = alarmtype[];
type alarmlist={
  source_name: string,
  severity: severityamount,
  status: statusamounts,
  measurement_fk: string,
  rtu_fk: string,
  link_fk: string,
  network_id: string,
  region_id: string,
  alarm_type_list: [],
  id_list: [],
  acting_user: string,
  network_name: string,
  alarm_number: number,
  time_created:string,
  time_modified:string
}
// -------------------------------------------------------------
const userList = [
  {
    id: 'mkjkj27',
    username: 'ahmad',
    name: 'ahmad',
    email: 'ahmad',
    role: 'ahmad',
    station: {
      name: 'ahmad',
    },
    region: {
      name: 'ahmad',
    },
  },
  {
    id: 'mkjkjuu27',
    username: 'hasan',
    name: 'hasan',
    email: 'hasan',
    role: 'hasan',
    station: {
      name: 'hasan',
    },
    region: {
      name: 'hasan',
    },
  },
];

const usertabelcolumn = {
  user: {label: 'User', size: 'w-[60%]'},
  status: {label: 'Status', size: 'w-[40%]', sort: true},
};

const usertabelitems = [
  {
    user: (
      <Select
        className="w-[242px] bg-[#636363]"
        value={''}
        onChange={event => {
          console.log('hghjg');
        }}>
        <option value="" className="hidden" />
        <option value={undefined} className="hidden" />
        {userList.map(user => (
          <option value={user.id} key={user.id}>
            {user.username}
          </option>
        ))}
      </Select>
    ),
    status: 'RTU230P10',
  },
];

const bottomcolumns = {
  secondarysource: {label: 'Secondary Source', size: 'w-[22.5%]'},
  alarmsime: {label: 'Alarm Time', size: 'w-[22.5%]'},
  linksource: {label: 'Link Source', size: 'w-[22.5%]'},
  linksestination: {label: 'Link Destination', size: 'w-[22.5%]'},
  cablesuct: {label: 'Cable / Duct', size: 'w-[10%]'},
};
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
};
// const topcolumns = {
//   source_name: {label: 'Primary Source', size: 'w-[16%]'},
//   alarm_type: {label: 'Alarm Type', size: 'w-[16%]'},
//   time_created: {label: 'Alarm Time', size: 'w-[16%]'},
//   severity: {label: 'Severity', size: 'w-[5%]'},
//   status: {label: 'State', size: 'w-[10%]'},
//   time_modified: {label: 'Last Modified', size: 'w-[16%]'},
//   acting_user: {label: 'Acting User', size: 'w-[16%]'},
//   chekbox: {label: '', size: 'w-[5%]'},
// };

const bottomItems = [
  {
    secondarysource: 'Connector Reflection',
    alarmsime: '2023-05-10 19:41:36',
    linksource: 'Station 1',
    linksestination: 'Station 2',
    cablesuct: '1',
  },
  {
    secondarysource: 'Connector Reflection',
    alarmsime: '2023-05-10 19:41:36',
    linksource: 'Station 1',
    linksestination: 'Station 2',
    cablesuct: '1',
  },
];

function Alarms() {
  const [loading, setLoading] = useState(false);
  const [allalarmsdata, setAllalarmdata] = useState<topcolumnsType[]>([]);
  const [selectedrow, setSelectedrow] = useState<alarmtype>();
  const [selectedid, setSelectedid] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sortkey, setSortkey] = useState('time_created');
  const [allpagecount, setAllpagecount] = useState<number>(1);

  const SetSourcKey = (name: string) => {
    if (name == 'Primary Source') {
      setSortkey('source_name');
    } else if (name == 'Alarm Type') {
      setSortkey('alarm_type');
    } else if (name == 'Alarm Time') {
      setSortkey('time_created');
    } else if (name == 'Severity') {
      setSortkey('severity');
    } else if (name == 'Last Modified') {
      setSortkey('time_modified');
    } else if (name == 'State') {
      setSortkey('status');
    } else {
      setSortkey('acting_user');
    }
  };

  const onclickcheckbox = (id: string) => {
    const allalarmsdataCopy = deepcopy(selectedid);
    const findidindex = selectedid.findIndex(data => data == id);
    if (findidindex > -1) {
      allalarmsdataCopy.splice(findidindex, 1);
    } else {
      allalarmsdataCopy.push(id);
    }
    setSelectedid(allalarmsdataCopy);
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
        alarm_events: [
          alarmlist
        ],
        page_number: number,
        total_count: number
      } = await allalarmresponse?.json();
      console.log('allalarmresponsedata', allalarmresponsedata);
      setAllpagecount(allalarmresponsedata.page_number);
      let newallalarmre = allalarmresponsedata.alarm_events.map(data => ({
        AlarmType:truncateString(data.alarm_type_list.join(",")),
        SourceType: data.source_name,
        Network: 'network1',
        Alarms: 2,
        Severity: data.severity,
        State: data.status,
        AlarmTime:getPrettyDateTime(data.time_created),
        LastModified:getPrettyDateTime(data.time_modified),
        Detail: '',
        delete: '',
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
      }));
      setAllalarmdata(newallalarmre);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
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

  const onclicktabelrow = (id: string) => {
    let allalarmsdataCopy: allalarmsdatatype = deepcopy(allalarmsdata);
    for (let i = 0; i < allalarmsdataCopy.length; i++) {
      if (allalarmsdataCopy[i].id != id) {
        if (allalarmsdataCopy[i].tabrowbg) {
          delete allalarmsdataCopy[i].tabrowbg;
        }
      }
    }
    const findalarmindex = allalarmsdataCopy.findIndex(data => data.id == id);
    if (allalarmsdataCopy[findalarmindex].tabrowbg) {
      delete allalarmsdataCopy[findalarmindex].tabrowbg;
      setSelectedrow(undefined);
    } else {
      allalarmsdataCopy[findalarmindex] = {
        ...allalarmsdataCopy[findalarmindex],
        tabrowbg: '#C0E7F2',
      };
      setSelectedrow(allalarmsdataCopy[findalarmindex]);
    }
    // setAllalarmdata(allalarmsdataCopy);
  };

  const deletealarms = async () => {
    try {
      setLoading(true);
      const response = await $Delete('otdr/alarm/events', selectedid);
      if (response?.status == 200) {
        getallalarms();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  const topitems = [
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'Network',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'region',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'Network',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'region',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'Network',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
    {
      AlarmType: 'Fiber Fault',
      SourceType: 'region',
      Network: 'Network 1',
      Alarms: 2,
      Severity: 'High',
      State: 'Resolved',
      AlarmTime: '2023-05-10 19:41:36',
      LastModified: '2023-05-10 19:41:36',
      Detail: '',
      delete: '',
    },
  
  ];
  return (
    <div className="flex w-full h-[calc(100vh-45px)] flex-col items-center p-[10px] pr-[20px] pt-[60px] pb-[30px]">
      <Table
      loading={loading}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={allalarmsdata}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left min-h-[72px] max-h-[calc(100vh-200px)]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
        dynamicColumns={['Detail', 'delete']}
        renderDynamicColumn={({key, value}) => {
          if (key === 'Detail')
            return (
              <Link to={value.Detail}>
                <IoOpenOutline size={22} className="mx-auto" />
              </Link>
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
            type="number"
            className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
          <SimpleBtn className="ml-10 py-[6px]" type="button">
          View New/Updated Alarm(s)
          </SimpleBtn>
          <input
            type="number"
            className="ml-2  h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />

          <SimpleBtn  onClick={
                page == 1
                  ? () => {}
                  : () => {
                      getallalarms(limit, page == 2?page-1:page - 2),
                        setPage(page == 2?page-1:page - 2),
                        setSelectedrow(undefined);
                    }
              } className="ml-10 px-[2px] py-[5px]" type="button">
            <BiChevronsLeft color={'red'} size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronLeft
              onClick={
                page == 1
                  ? () => {}
                  : () => {
                      getallalarms(limit, page - 1),
                        setPage(page - 1),
                        setSelectedrow(undefined);
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
                page == 6
                  ? () => {}
                  : () => {
                      getallalarms(limit, page + 1),
                        setPage(page + 1),
                        setSelectedrow(undefined);
                    }
              }
              size={20}
            />
          </SimpleBtn>
          <SimpleBtn  onClick={
                page == 6
                  ? () => {}
                  : () => {
                      getallalarms(limit, page + 2),
                        setPage(page + 2),
                        setSelectedrow(undefined);
                    }
              } className="ml-2 px-[2px] py-[5px]" type="button">
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
