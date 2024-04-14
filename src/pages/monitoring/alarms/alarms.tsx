import {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {BiChevronRight, BiChevronsLeft, BiChevronsRight} from 'react-icons/bi';
import {BiChevronLeft} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {IoTrashOutline} from 'react-icons/io5';
import {Select} from '~/components';
import Rectangle from '~/assets/icons/Rectangle 112.png';
import Checkbox from '~/components/checkbox/checkbox';
import {$Delete, $Get} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';
import {deepcopy} from '~/util';
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

const topcolumns = {
  source_name: {label: 'Primary Source', size: 'w-[16%]'},
  alarm_type: {label: 'Alarm Type', size: 'w-[16%]'},
  time_created: {label: 'Alarm Time', size: 'w-[16%]'},
  severity: {label: 'Severity', size: 'w-[5%]'},
  status: {label: 'State', size: 'w-[10%]'},
  time_modified: {label: 'Last Modified', size: 'w-[16%]'},
  acting_user: {label: 'Acting User', size: 'w-[16%]'},
  chekbox: {label: '', size: 'w-[5%]'},
};

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
  const [allalarmsdata, setAllalarmdata] = useState<allalarmsdatatype>([]);
  const [selectedrow, setSelectedrow] = useState<alarmtype>();
  const [selectedid, setSelectedid] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [allpagecount, setAllpagecount] = useState<number>(1);
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
        `otdr/alarm/events/?page=${pagevalue}&limit=${limitvalue}`,
      );
      let allalarmresponsedata: {
        alarm_events: allalarmsdatatype;
        page_number: number;
      } = await allalarmresponse.json();
      console.log('allalarmresponsedata', allalarmresponsedata);
      setAllpagecount(allalarmresponsedata.page_number);
      let newallalarmre = allalarmresponsedata.alarm_events.map(data => ({
        ...data,
        time_created: getPrettyDateTime(data.time_created),
        time_modified: getPrettyDateTime(data.time_modified),
        tabbodybg: [
          {
            name: 'severity',
            bg:
              data.severity == severityamount.LOW
                ? '#FFE600'
                : data.severity == severityamount.MEDIUM
                ? '#FF8A00'
                : '#FF0000',
          },
          ...(data.status === statusamounts.RESOLVED
            ? [{name: 'status', bg: '#18C047'}]
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
  }, []);

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
    setAllalarmdata(allalarmsdataCopy);
  };

  const deletealarms = async () => {
    try {
      setLoading(true);
      const response = await $Delete('otdr/alarm/events', selectedid);
      if (response.status == 200) {
        getallalarms();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex w-full flex-col p-[10px] pt-[80px]">
      <div className="flex w-full flex-row justify-between border-b-[1px] border-[#D9D9D9]">
        {/* ***************** top ********************* top *****************************top *************** */}
        <div className="w-[calc(100%-400px)]  pr-[10px] pt-[7px]">
          <div className="flex w-full flex-row items-center">
            <span className="text-[18px] font-normal leading-6">
              Total Alarm(s)
            </span>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <SimpleBtn className="ml-2 py-[6px]" type="button">
              New/Updated Alarm(s)
            </SimpleBtn>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />

            <SimpleBtn className="ml-4 px-[2px] py-[5px]" type="button">
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
            <span className="text-18px] ml-[2px] font-normal leading-6">
              page
            </span>
            <input
              value={page}
              type="text"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <span className="ml-2">/{allpagecount}</span>
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
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronsRight size={20} />
            </SimpleBtn>

            <span className="ml-[2px] text-[18px] font-normal leading-6">
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
          {/* ***************** top tabel ********************* top tabel *****************************top tabel *************** */}
          <Table
            loading={loading}
            // onclicktitle={(tabname: string, sortalfabet: boolean) => {
            //   const dataa = [...reightstationsorted];
            //   if (sortalfabet) {
            //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
            //   } else {
            //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
            //   }
            //   setReightstationssorted(dataa);
            // }}

            bordered={true}
            cols={topcolumns}
            tabicon={'Name'}
            items={allalarmsdata}
            onclickrow={(e: any) => onclicktabelrow(e.id)}
            thclassname="pl-[4px] bg-[red]"
            tdclassname="pl-[4px] text-left"
            containerClassName="w-full min-h-[72px] max-h-[700px] text-left ml-[5px]  overflow-y-auto mt-[20px]"
            dynamicColumns={['chekbox']}
            renderDynamicColumn={({key, value}) => {
              if (key === 'chekbox') {
                return (
                  <Checkbox
                    checkstatus={selectedid.includes(value.id)}
                    onclick={e => onclickcheckbox(value.id)}
                    iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
                    classname={' border-[1px] text-[#18C047] border-[#000000]'}
                  />
                );
              } else return <></>;
            }}
            // dynamicColumns={'index'}
            // renderDynamicColumn={renderDynamicColumn('right')}
          />
        </div>
        {/* ***************** right ********************* right *****************************right *************** */}
        <div className="box-border flex h-[765px] w-[400px] flex-col border-l-[1px] border-[#D9D9D9] pb-[10px] pl-[20px]">
          <div className="flex flex-row pt-[13px]">
            <AiOutlinePlus color="#18C047" size={25} />
            <IoTrashOutline size={24} className={'ml-2 text-red-500'} />
          </div>
          <Table
            // loading={state.regionstationlist?.httpRequestStatus !== 'success'}
            // onclicktitle={(tabname: string, sortalfabet: boolean) => {
            //   const dataa = [...reightstationsorted];
            //   if (sortalfabet) {
            //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
            //   } else {
            //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
            //   }
            //   setReightstationssorted(dataa);
            // }}
            cols={usertabelcolumn}
            tabicon={'Name'}
            items={usertabelitems}
            thclassname="pl-2"
            containerClassName="w-full min-h-[72px] text-left ml-[5px]  overflow-y-auto mt-[30px]"
            // dynamicColumns={['index']}
            // renderDynamicColumn={renderDynamicColumn('right')}
          />
          <div className="mt-[20px] flex flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-6">User</span>

            <Select
              // disabled={
              //   userrole == 'superuser' ||
              //   networkDetail?.data?.access?.role == 'superuser'
              //     ? false
              //     : true
              // }
              className="w-[242px] bg-[#636363]"
              value={''}
              onChange={event => {
                console.log('hghjg');

                // setUserAdmin(event.target.value);
              }}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {userList.map(user => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-6">State</span>

            <Select
              // disabled={
              //   userrole == 'superuser' ||
              //   networkDetail?.data?.access?.role == 'superuser'
              //     ? false
              //     : true
              // }
              className="w-[242px]"
              value={''}
              onChange={event => {
                console.log('hghjg');

                // setUserAdmin(event.target.value);
              }}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {userList.map(user => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </div>

          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Assignment Time
          </span>
          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Assigned By
          </span>
          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Last Modified
          </span>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="mt-[0px] text-[20px] font-normal leading-6">
                Escalate after
              </span>
              <span className="mt-[5px] text-[20px] font-normal leading-6">
                (Day:Hr:Min)
              </span>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
            </div>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="mt-[0px] text-[20px] font-normal leading-6">
                Timeout after
              </span>
              <span className="mt-[5px] text-[20px] font-normal leading-6">
                (Day:Hr:Min)
              </span>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
            </div>
          </div>

          <span className="mt-[20px] text-[20px] font-normal leading-6">
            Description
          </span>
          <textarea className="mt-[3px] h-[76px] w-full rounded-[10px] bg-white" />

          <div className="mt-[10px] flex flex-row">
            <img src={Rectangle} className="mt-[0px] h-[25px] w-[25px]" />
            <img
              src={Rectangle}
              className="ml-[10px] mt-[0px] h-[25px] w-[25px]"
            />
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <button className="w-[180px] rounded-md  bg-[#636363] py-[6px] text-sm">
              Acknowledge
            </button>

            <button className="w-[180px] rounded-md  bg-[#636363] py-[6px] text-sm">
              ignore
            </button>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <button className="w-[180px] rounded-md  bg-[#BAC2EDB0] py-[6px] text-sm">
              Select All
            </button>

            <button className="w-[180px] rounded-md  bg-[#BAC2EDB0] py-[6px] text-sm">
              Delete Selected
            </button>
          </div>
        </div>
      </div>
      {/* *********** bottom tabel   ********** bottom tabel ************* bottom tabel *********************** */}
      {selectedrow ? (
        <Table
          // loading={state.regionstationlist?.httpRequestStatus !== 'success'}
          // onclicktitle={(tabname: string, sortalfabet: boolean) => {
          //   const dataa = [...reightstationsorted];
          //   if (sortalfabet) {
          //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
          //   } else {
          //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
          //   }
          //   setReightstationssorted(dataa);
          // }}
          bordered={true}
          cols={bottomcolumns}
          tabicon={'Name'}
          items={bottomItems}
          thclassname="pl-2"
          containerClassName="w-[calc(100%-500px)] min-h-[72px] text-left ml-[5px]  overflow-y-auto mt-[20px]"
          // dynamicColumns={'index'}
          // renderDynamicColumn={renderDynamicColumn('right')}
        />
      ) : null}
    </div>
  );
}

export default Alarms;
