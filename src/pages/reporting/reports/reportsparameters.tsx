import {useEffect, useState} from 'react';
import {FaArrowUp} from 'react-icons/fa6';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import GreaterThan from '~/assets/icons/Greater Than.png';
import {SimpleBtn} from '~/components';
import {RootState} from '~/store';
import {
  createReport,
  createreporttype,
  reporttype,
  setReportdetail,
  setgetdetailstatus,
  updaterportname,
} from '~/store/slices/reportslice';
import {deepcopy} from '~/util';
import {$Get, $Post, $Put} from '~/util/requestapi';
type itemprops = {
  selected: boolean;
  name: string;
  onclick: () => void;
};

const Tabitem = ({selected, name, onclick}: itemprops) => {
  return (
    <button
      onClick={onclick}
      className={`mt-[2px] h-[40px] w-full pl-[20px] text-left ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      {name}
    </button>
  );
};
const Tabitemorder = ({selected, name, onclick}: itemprops) => {
  return (
    <button
      onClick={onclick}
      className={`mt-[2px] flex h-[40px] w-full flex-row items-center justify-between px-[20px] text-[18px] font-normal ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      <span>{name}</span>
      <FaArrowUp color={selected ? 'black' : '#006BBC'} />
    </button>
  );
};

function Createreportsparameters() {
  const [loading, setLoading] = useState(false);
  const {reportsetId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedavailebel, setSelectedavalebel] = useState<string[]>([]);
  const [selectedordercolumn, setSelectedordercolumn] = useState<string[]>([]);
  const {reportid, reportsetid} = useParams();
  const {reportdetail,getdetailstatus} = useSelector((state: RootState) => state.reportslice);

  const [selectedselectedavailebel, setSelectedselectedavailebel] = useState<
    string[]
  >([]);

  const availebellist = [
    {name: "network",list:["Regions", "Stations", "Optical Routes", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Affected Regions", "Affected Stations", "Occupied Ports", "Free Ports", "Avg. Region Stations", "Max. Region Stations", "Min. Region Stations", "Avg. Region Links", "Max. Region Links", "Min. Region Links", "Avg. Region RTUs", "Max. Region RTUs", "Min. Region RTUs", "Avg. Region Online RTUs", "Max. Region Online RTUs", "Min. Region Online RTUs", "Avg. Region Offline RTUs", "Max. Region Offline RTUs", "Min. Region Offline RTUs"] },
    {name: "region",list: ["Stations", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. Station RTUs", "Max. Station RTUs", "Min. Station RTUs", "Avg. Station RTU Ports", "Max. Station RTU Ports", "Min. Station RTU Ports", "Avg. Station RTU Occupied Ports", "Max. Station RTU Occupied Ports", "Min. Station RTU Occupied Ports", "Avg. Station RTU Free Ports", "Max. Station RTU Free Ports", "Min. Station RTU Free Ports", "Avg. Station Tests", "Max. Station Tests", "Min. Station Tests", "Avg. Station Successful Tests", "Max. Station Successful Tests", "Min. Station Successful Tests", "Avg. Station Failed Tests", "Max. Station Failed Tests", "Min. Station Failed Tests"] },
    { name:"station",list: ["RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. RTU Ports", "Max. RTU Ports", "Min. RTU Ports", "Avg. RTU Occupied Ports", "Max. RTU Occupied Ports", "Min. RTU Occupied Ports", "Avg. RTU Free Ports", "Max. RTU Free Ports", "Min. RTU Free Ports", "Avg. RTU Tests", "Max. RTU Tests", "Min. RTU Tests", "Avg. RTU Successful Tests", "Max. RTU Successful Tests", "Min. RTU Successful Tests", "Avg. RTU Failed Tests", "Max. RTU Failed Tests", "Min. RTU Failed Tests"] },
    {name: "rtu",list:["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. RTU Down Time", "Max. RTU Down Time", "Min. RTU Down Time", "Avg. RTU Alarms", "Max. RTU Alarms", "Min. RTU Alarms", "Avg. Test Alarms", "Max. Test Alarms", "Min. Test Alarms"] },
    { name:"link",list:["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Link Down Time", "Max. Link Down Time", "Min. Link Down Time", "Avg. Link Alarms", "Max. Link Alarms", "Min. Link Alarms", "Avg. Link Tests", "Max. Link Tests", "Min. Link Tests", "Avg. Link Successful Tests", "Max. Link Successful Tests", "Min. Link Successful Tests", "Avg. Link Failed Tests", "Max. Link Failed Tests", "Min. Link Failed Tests"] },
    { name:"opticalRoute",list: ["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Optical Route Down Time", "Max. Optical Route Down Time", "Min. Optical Route Down Time", "Avg. Optical Route Tests", "Max. Optical Route Tests", "Min. Optical Route Tests", "Avg. Optical Route Successful Tests", "Max. Optical Route Successful Tests", "Min. Optical Route Successful Tests", "Avg. Optical Route Failed Tests", "Max. Optical Route Failed Tests", "Min. Optical Route Failed Tests"] },
    { name:"test",list: ["Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Test Length", "Max. Test Length", "Min. Test Length", "Avg. Test Wavelength", "Max. Test Wavelength", "Min. Test Wavelength", "Avg. Test Pulsewidth", "Max. Test Pulsewidth", "Min. Test Pulsewidth"] }
  ];

  // console.log('🧓', reportdetail.availebelColumns.length);

  const findValue = (name:string) => {
    const item = availebellist.find(data => data.name == name)
    return item!.list
    };


  useEffect(() => {
    const getreportdetail = async () => {
      try {
        setLoading(true);
        const detailresponse = await $Get(
          `otdr/report-set/${reportsetid}/report/${reportid}`,
        );

        if (detailresponse?.status == 200) {
          const detailresponsedata: reporttype = await detailresponse.json();
          dispatch(setgetdetailstatus(true))
          dispatch(setReportdetail({...detailresponsedata,availebelColumns:findValue(detailresponsedata.report_type)}));
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        console.log(`get detail error is:${error}`);
      } finally {
        setLoading(false);
      }
    };
    if(!getdetailstatus){
      getreportdetail();
    }
  
  }, [reportid]);

  const updatereport = async () => {
    const {id,availebelColumns,...dataWithoutId} = reportdetail;
    try {
      const getdetaildata=await $Put(`otdr/report-set/${reportsetid}/report/${reportid}`,dataWithoutId)
      if(getdetaildata?.status == 201){
        dispatch(setgetdetailstatus(false))
        toast('It was done successfully', {type: 'success', autoClose: 1000});
        dispatch(updaterportname({reportsetId: reportsetid!, reportid: reportid!, name: reportdetail?.name}))
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    }
  };


  const onclictab = (name: string) => {
    const selectedavailebelCopy = deepcopy(selectedavailebel);
    const findIndextab = selectedavailebel.findIndex(data => data == name);
    if (findIndextab > -1) {
      selectedavailebelCopy.splice(findIndextab, 1);
    } else {
      selectedavailebelCopy.push(name);
    }
    setSelectedavalebel(selectedavailebelCopy);
  };

  const onclicselectedtab = (name: string) => {
    const selectedselectedavailebelCopy = deepcopy(selectedselectedavailebel);
    const findIndextab = selectedselectedavailebel.findIndex(
      data => data == name,
    );
    if (findIndextab > -1) {
      selectedselectedavailebelCopy.splice(findIndextab, 1);
    } else {
      selectedselectedavailebelCopy.push(name);
    }
    setSelectedselectedavailebel(selectedselectedavailebelCopy);
  };

  const createreport = async () => {
    setLoading(true);
    try {
      const createreportresponse = await $Post(
        `otdr/report-set/${reportsetId}/report`,
        {
          name: reportdetail.name,
          comment: reportdetail.comment,
          report_type: reportdetail.report_type,
          time_filter: {
            enable: reportdetail.time_filter.enable,
            time_filter_type: reportdetail.time_filter.time_filter_type,
            time_exact: {
              from_time: reportdetail.time_filter.time_exact.from_time,
              to_time: reportdetail.time_filter.time_exact.to_time,
            },
            time_relative: {
              value: reportdetail.time_filter.time_relative.value,
              period: reportdetail.time_filter.time_relative.period,
            },
          },
          select_query: reportdetail.select_query,
          parameters: {
            selected_columns: [],
            order_by_columns: {},
          },
        },
      );
      if (createreportresponse?.status == 201) {
        const createreportresponseData = await createreportresponse?.json();
        dispatch(
          createReport({
            ReportSetId: reportsetId!,
            id: createreportresponseData,
            name: reportdetail.name,
          }),
        );
        toast('It was done successfully', {type: 'success', autoClose: 1000});
        navigate(
          `/reporting/reports/${reportsetId}/reportset/report/${createreportresponseData}`,
        );
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`create error is:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const onclicordercolumn = (name: string) => {
    const selectedordercolumnCopy = deepcopy(selectedordercolumn);
    const findIndextab = selectedordercolumn.findIndex(data => data == name);
    if (findIndextab > -1) {
      selectedordercolumnCopy.splice(findIndextab, 1);
    } else {
      selectedordercolumnCopy.push(name);
    }
    setSelectedordercolumn(selectedordercolumnCopy);
  };



  const availebelalltosellect = () => {
    if(reportdetail.availebelColumns.length != 0){
      const createreportdetailCopy = deepcopy(reportdetail);
      createreportdetailCopy.availebelColumns = [];
      createreportdetailCopy.parameters.selected_columns =
        reportdetail.availebelColumns;
      setSelectedavalebel([]);
      dispatch(setReportdetail(createreportdetailCopy));
    }

  };

  const sellectalltoavailebel = () => {
    if(reportdetail.parameters.selected_columns.length != 0){
      const createreportdetailCopy = deepcopy(reportdetail);
      createreportdetailCopy.parameters.selected_columns =[]
      createreportdetailCopy.availebelColumns =reportdetail.parameters.selected_columns;
      setSelectedselectedavailebel([]);
      dispatch(setReportdetail(createreportdetailCopy));
    }

  };

  const selectedtoorder=()=>{
    if(reportdetail.parameters.selected_columns.length !=0){
      const createreportdetailCopy = deepcopy(reportdetail);
      createreportdetailCopy.parameters.selected_columns =[]
      createreportdetailCopy.parameters.order_by_columns =reportdetail.parameters.selected_columns.map((data:string)=> ({[data]:"asc"}));
     console.log("🐓",createreportdetailCopy.parameters.order_by_columns);
     createreportdetailCopy.parameters.order_by_columns = {
      ...reportdetail.parameters.selected_columns.reduce((acc, name) => {
        // @ts-ignore
        acc[name] = 'ascending';
        return acc;
      }, {})
    }
      setSelectedselectedavailebel([]);
      dispatch(setReportdetail(createreportdetailCopy));
    }
 
  }
  const orseralltoselected=()=>{
    if(Object.keys(reportdetail.parameters.order_by_columns).length !== 0 ){
      const createreportdetailCopy: createreporttype =
      deepcopy(reportdetail);
    createreportdetailCopy.parameters.selected_columns =Object.keys(reportdetail.parameters.order_by_columns)
    createreportdetailCopy.parameters.order_by_columns = {};
    dispatch(setReportdetail(createreportdetailCopy));
    setSelectedordercolumn([]);
    }

  }


  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row justify-between">
        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Available Columns
          </span>
          <div className="h-[540px] w-full overflow-auto border-[1px] border-black bg-white px-[5px] py-[10px]">
            {reportdetail.availebelColumns.map((data: string) => (
              <Tabitem
                onclick={() => onclictab(data)}
                name={data}
                selected={selectedavailebel.includes(data)}
              />
            ))}
          </div>
        </div>

        <div className="mt-[44px] flex h-[540px] w-[7%] flex-col items-center  pt-[100px]">
          <button
            onClick={() => {
              const createreportdetailCopy: createreporttype =
                deepcopy(reportdetail);
              createreportdetailCopy.parameters.selected_columns = [
                ...reportdetail.parameters.selected_columns,
                ...selectedavailebel,
              ];
              const result = createreportdetailCopy.availebelColumns.filter(
                item => !selectedavailebel.includes(item),
              );
              createreportdetailCopy.availebelColumns = result;
              setSelectedavalebel([]);
              dispatch(setReportdetail(createreportdetailCopy));
            }}
            className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </button>

          <button
            onClick={() => {
              const createreportdetailCopy: createreporttype =
                deepcopy(reportdetail);
              createreportdetailCopy.availebelColumns = [
                ...createreportdetailCopy.availebelColumns,
                ...selectedselectedavailebel,
              ];
              const result = reportdetail.parameters.selected_columns.filter(
                item => !selectedselectedavailebel.includes(item),
              );
              createreportdetailCopy.parameters.selected_columns = result;

              dispatch(setReportdetail(createreportdetailCopy));
              setSelectedselectedavailebel([]);
            }}
            className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </button>

          <button
            onClick={availebelalltosellect}
            className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </button>

          <button onClick={sellectalltoavailebel} className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </button>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>

        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Selected Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white px-[5px] py-[10px]">
            {reportdetail.parameters.selected_columns.map((data: string) => (
              <Tabitem
                onclick={() => onclicselectedtab(data)}
                name={data}
                selected={selectedselectedavailebel.includes(data)}
              />
            ))}
          </div>
        </div>

        <div className="mt-[44px] flex h-[540px] w-[7%] flex-col items-center  pt-[100px]">
          <button
            onClick={() => {
              const createreportdetailCopy: createreporttype =
                deepcopy(reportdetail);
              createreportdetailCopy.parameters.order_by_columns = {
                ...createreportdetailCopy.parameters.order_by_columns,
                ...selectedselectedavailebel.reduce((acc, name) => {
                  // @ts-ignore
                  acc[name] = 'desc';
                  return acc;
                }, {}),
              };

              const result = reportdetail.parameters.selected_columns.filter(
                item => !selectedselectedavailebel.includes(item),
              );

              createreportdetailCopy.parameters.selected_columns = result;

              dispatch(setReportdetail(createreportdetailCopy));
              setSelectedselectedavailebel([]);
            }}
            className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </button>
          <button
            onClick={() => {
              const createreportdetailCopy: createreporttype =
                deepcopy(reportdetail);
              createreportdetailCopy.parameters.selected_columns = [
                ...createreportdetailCopy.parameters.selected_columns,
                ...selectedordercolumn,
              ];

              const result = Object.keys(
                createreportdetailCopy.parameters.order_by_columns,
              ).reduce((acc: any, key: string) => {
                // اگر کلید در آرایه وجود نداشت، آن را در آبجکت جدید قرار می‌دهیم
                if (
                  !createreportdetailCopy.parameters.selected_columns.includes(
                    key,
                  )
                ) {

                  // @ts-ignore
                  acc[key] =createreportdetailCopy.parameters.order_by_columns[key];
                }
                return acc;
              }, {});

              createreportdetailCopy.parameters.order_by_columns = result;

              dispatch(setReportdetail(createreportdetailCopy));
              setSelectedselectedavailebel([]);
            }}
            className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </button>
          <button onClick={selectedtoorder} className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </button>
          <button onClick={orseralltoselected} className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </button>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>

        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Order By Columns
          </span>

          <div className="h-[540px] w-full border-[1px] border-black bg-white">
            {Object.keys(reportdetail.parameters.order_by_columns).map(
              (name: any) => (
                <Tabitemorder
                  onclick={() => onclicordercolumn(name)}
                  name={name}
                  selected={selectedordercolumn.includes(name)}
                />
              ),
            )}
          </div>
          <div className="mt-[10px] flex flex-row items-center justify-between">
            <SimpleBtn>Ascending</SimpleBtn>
            <SimpleBtn>Descending</SimpleBtn>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end">
        <SimpleBtn>Open Report</SimpleBtn>
        <SimpleBtn onClick={updatereport} className="mx-[9px]">
          Save
        </SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default Createreportsparameters;
