import React, {ReactNode, useEffect, useRef, useState} from 'react';
import * as Yup from 'yup';
import {reporttype} from './../../../store/slices/reportslice';
import {
  Form,
  FormikProvider,
  prepareDataForValidation,
  useFormik,
  validateYupSchema,
} from 'formik';
import {
  createReport,
  setcreateReportdetail,
} from './../../../store/slices/reportslice';
import {InputFormik, SelectFormik} from '~/container';
import {Select, SimpleBtn, TabItem, TextInput} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import Checkbox from '~/components/checkbox/checkbox';
import dateicon from '~/assets/images/dateicon.png';
import RadioButton from '~/components/radipbutton/radiobutton';
import {useNavigate, useParams} from 'react-router-dom';
import {getPrettyDateTime} from '~/util/time';
import {deepcopy} from '~/util/deepcopy';
import {$POST, $Post} from '~/util/requestapi';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
type Iprops = {
  children: ReactNode;
  name: string;
  classname?: string;
  ReportType?: string;
};

const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  Everyvalue: Yup.string().required('Please enter Everyvalue'),
});


const availebellist = [
  {name: "network",list:["Regions", "Stations", "Optical Routes", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Affected Regions", "Affected Stations", "Occupied Ports", "Free Ports", "Avg. Region Stations", "Max. Region Stations", "Min. Region Stations", "Avg. Region Links", "Max. Region Links", "Min. Region Links", "Avg. Region RTUs", "Max. Region RTUs", "Min. Region RTUs", "Avg. Region Online RTUs", "Max. Region Online RTUs", "Min. Region Online RTUs", "Avg. Region Offline RTUs", "Max. Region Offline RTUs", "Min. Region Offline RTUs"] },
  {name: "region",list: ["Stations", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. Station RTUs", "Max. Station RTUs", "Min. Station RTUs", "Avg. Station RTU Ports", "Max. Station RTU Ports", "Min. Station RTU Ports", "Avg. Station RTU Occupied Ports", "Max. Station RTU Occupied Ports", "Min. Station RTU Occupied Ports", "Avg. Station RTU Free Ports", "Max. Station RTU Free Ports", "Min. Station RTU Free Ports", "Avg. Station Tests", "Max. Station Tests", "Min. Station Tests", "Avg. Station Successful Tests", "Max. Station Successful Tests", "Min. Station Successful Tests", "Avg. Station Failed Tests", "Max. Station Failed Tests", "Min. Station Failed Tests"] },
  { name:"station",list: ["RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. RTU Ports", "Max. RTU Ports", "Min. RTU Ports", "Avg. RTU Occupied Ports", "Max. RTU Occupied Ports", "Min. RTU Occupied Ports", "Avg. RTU Free Ports", "Max. RTU Free Ports", "Min. RTU Free Ports", "Avg. RTU Tests", "Max. RTU Tests", "Min. RTU Tests", "Avg. RTU Successful Tests", "Max. RTU Successful Tests", "Min. RTU Successful Tests", "Avg. RTU Failed Tests", "Max. RTU Failed Tests", "Min. RTU Failed Tests"] },
  {name: "rtu",list:["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. RTU Down Time", "Max. RTU Down Time", "Min. RTU Down Time", "Avg. RTU Alarms", "Max. RTU Alarms", "Min. RTU Alarms", "Avg. Test Alarms", "Max. Test Alarms", "Min. Test Alarms"] },
  { name:"link",list:["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Link Down Time", "Max. Link Down Time", "Min. Link Down Time", "Avg. Link Alarms", "Max. Link Alarms", "Min. Link Alarms", "Avg. Link Tests", "Max. Link Tests", "Min. Link Tests", "Avg. Link Successful Tests", "Max. Link Successful Tests", "Min. Link Successful Tests", "Avg. Link Failed Tests", "Max. Link Failed Tests", "Min. Link Failed Tests"] },
  { name:"opticalRoute",list: ["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Optical Route Down Time", "Max. Optical Route Down Time", "Min. Optical Route Down Time", "Avg. Optical Route Tests", "Max. Optical Route Tests", "Min. Optical Route Tests", "Avg. Optical Route Successful Tests", "Max. Optical Route Successful Tests", "Min. Optical Route Successful Tests", "Avg. Optical Route Failed Tests", "Max. Optical Route Failed Tests", "Min. Optical Route Failed Tests"] },
  { name:"test",list: ["Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Test Length", "Max. Test Length", "Min. Test Length", "Avg. Test Wavelength", "Max. Test Wavelength", "Min. Test Wavelength", "Avg. Test Pulsewidth", "Max. Test Pulsewidth", "Min. Test Pulsewidth"] }
];



// const findValue=(x:string)=>{
//   if(x == "Network"){
//     return  list[0].Network
//   } else if( x == "Region"){
//     return list[1].Region
//   }else if( x == "Station"){
//     return list[2].Station
//   } else if( x == "RTU"){
//     return list[3].RTU
//   }else if( x == "Link"){
//     return list[4].Link
//   }else if( x == "OpticalRoute"){
//     return list[5].OpticalRoute
//   } else{
//     return list[6].Test
//   }
// }


const findValue = (name:string) => {
  const item = availebellist.find(data => data.name == name)
  return item!.list
  };
// const findValue = (key:string) => {
//   const item:any = list.find((obj:any) => obj[key]);
//   return item ? item[key] : null;
//   };

const Row = ({children, name, classname}: Iprops) => {
  return (
    <div
      className={`mb-[20px] flex w-[900px] flex-row  items-center justify-between ${classname}`}>
      <span className="text-[20px] font-normal leading-[24.2px]">{name}</span>
      <div className="w-[720px]">{children}</div>
    </div>
  );
};

const reporttypeList = [
  'network',
  'region',
  'station',
  'link',
  'optical_route',
  'rtu',
  'test',
  'alarm',
];

const operatorsvalues = (name: string) => {
  if (name == 'AlarmNum') {
    return ['=', '!=', '<', '>', '>=', '<='];
  } else if (name == 'State') {
    return ['=', '!=', '>', '<'];
  } else {
    return ['=', '!='];
  }
};

const parameterslist = [
  'NetworkName',
  'RegionName',
  'StationName',
  'LinkName',
  'OpticalRouteName',
  'RtuModel',
  'Severity',
  'AlarmNum',
  'State',
];

const Detail = ({onclose, setselectedquery}: any) => {
  const navigate = useNavigate();
  const [parametervalue, setParametervalue] = useState('');
  const [operatorname, setOperatorname] = useState('');
  const [value, setValue] = useState('ddddff');
  const [quertext, setQuerytext] = useState('');

  const append = () => {
    if (
      parametervalue.length != 0 ||
      operatorname.length != 0 ||
      value.length != 0
    ) {
      let valueCopy = deepcopy(value);
      // valueCopy
      setQuerytext(
        prevText => prevText + ` ` + `${parametervalue}${operatorname}${value}`,
      );
    }
  };

  const clearlast = (text: string) => {
    let words = text.split(' ');
    words.pop();
    let newText = words.join(' ');
    setQuerytext(newText);
  };
  return (
    <AppDialog
      closefunc={() => onclose()}
      footerClassName="flex justify-end"
      // footer={
      //   <div className="flex flex-col">
      //     <div className="flex gap-x-4">
      //       <SimpleBtn onClick={() => formik} type="button">
      //         Save
      //       </SimpleBtn>
      //       <SimpleBtn onClick={()=>navigate(-1)} className="cursor-pointer " >
      //         Cancel
      //       </SimpleBtn>
      //     </div>
      //   </div>
      // }
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row">
            <span className="ml-4 text-[18px] font-normal">Parameters</span>
            <Select
              className="ml-[10px] mr-[15px] w-[180px]"
              value={parametervalue}
              onChange={(e: any) => setParametervalue(e.target.value)}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {parameterslist.map(data => (
                <option>{data}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-row">
            <span className="text-[18px] font-normal">Operator</span>
            <Select
              className="ml-[10px] mr-[15px] w-[180px]"
              value={operatorname}
              onChange={e => setOperatorname(e.target.value)}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {operatorsvalues(parametervalue).map(data => (
                <option>{data}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-row">
            <span className="text-[18px] font-normal">Value</span>
            <TextInput
              type="text"
              value={value}
              onChange={e => {
                setValue(e.target.value);
              }}
              className="ml-[10px] mr-[15px] w-[180px]"
            />
          </div>

          <SimpleBtn onClick={() => append()} className="mr-4">
            Append
          </SimpleBtn>
        </div>

        <div className="fex-row mt-[40px] flex w-full">
          <span className="mt-[60px] text-[18px] font-normal">
            Select Query
          </span>
          <div className="ml-[15px]  flex w-[calc(100%-135px)] flex-col">
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex w-[270px] flex-row items-center justify-between">
                <button
                  onClick={() => setQuerytext(prevText => prevText + ` ` + `(`)}
                  className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  (
                </button>
                <button
                  onClick={() => setQuerytext(prevText => prevText + ` ` + `)`)}
                  className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  )
                </button>
                <button
                  onClick={() =>
                    setQuerytext(prevText => prevText + ` ` + `OR`)
                  }
                  className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  OR
                </button>
                <button
                  onClick={() =>
                    setQuerytext(prevText => prevText + ` ` + `AND`)
                  }
                  className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  AND
                </button>
              </div>
              <SimpleBtn
                onClick={() => clearlast(quertext)}
                className="h-[40px]">
                Clear Last
              </SimpleBtn>
            </div>

            <div
              className="mt-[15px] flex h-[270px] w-full flex-row rounded-[10px] border-[1px] border-black bg-white pl-4
          pt-2">
              {quertext}
            </div>
          </div>
        </div>
        <div className="my-[20px] flex w-full flex-row justify-end pr-[10px]">
          <SimpleBtn onClick={() => setQuerytext('')} className="">
            Clear All
          </SimpleBtn>
          <SimpleBtn
            onClick={() => {
              setselectedquery(quertext, onclose());
            }}
            className="mx-[10px]">
            Set
          </SimpleBtn>
          {/* setShowfilter(false) */}
          <SimpleBtn
            onClick={() => {
              onclose(), setQuerytext('');
            }}
            className="">
            Cancel
          </SimpleBtn>
        </div>
      </div>
    </AppDialog>
  );
};

// -----------------------------------------------------------------------
function CreateReport() {
  const {reportsetId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showfilter, setShowfilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);
  const [select_query, setSelect_query] = useState('');
  const [querytext, setQuerytext] = useState('');
  const [Time, setTime] = useState('');
  const [timefilter, setTimefilter] = useState(true);
  const [time_filter_type, setTime_filter_type] = useState('exact');
  const [from_time, setFrom_time] = useState('2024-07-09');
  const [to_time, setTo_time] = useState('2024-08-08');
  const {createreportdetail} = useSelector((state: RootState) => state.reportslice);

  // useEffect(() => {
  
  // }, []);

  const createreport = async () => {
    const { id, ...dataWithoutId } = createreportdetail;
    try {
      setLoading(true);
      const createreportresponse = await $Post(
        `otdr/report-set/${reportsetId}/report`,
        dataWithoutId
        // {
        //   name: createreportdetail.name,
        //   comment: createreportdetail.comment,
        //   report_type: createreportdetail.report_type,
        //   time_filter: {
        //     enable: createreportdetail.time_filter.enable,
        //     time_filter_type: createreportdetail.time_filter.time_filter_type,
        //     time_exact: {
        //       from_time: createreportdetail.time_filter.time_exact.from_time,
        //       to_time: createreportdetail.time_filter.time_exact.to_time,
        //     },
        //     time_relative: {
        //       value: createreportdetail.time_filter.time_relative.value,
        //       period: createreportdetail.time_filter.time_relative.period,
        //     },
        //   },
        //   select_query: createreportdetail.select_query,
        //   parameters: {
        //     selected_columns: [],
        //     order_by_columns: {},
        //   },
        // },
      );
      if (createreportresponse?.status == 201) {
        const createreportresponseData = await createreportresponse?.json();
        dispatch(
          createReport({
            ReportSetId: reportsetId!,
            id: createreportresponseData,
            name: createreportdetail.name,
          }),
        );
        dispatch(
          setcreateReportdetail({
            name: '',
            comment: '',
            report_type: 'network',
            time_filter: {
              enable: false,
              time_filter_type: 'exact',
              time_exact: {
                from_time: '2024-07-13',
                to_time: '2024-08-12',
              },
              time_relative: {
                value: 1,
                period: 'month',
              },
            },
            select_query: '',
            parameters: {
              selected_columns: [],
              order_by_columns: {},
            },
            availebelColumns:findValue("network"),
            id: '',
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

  return (
    <>
      {showfilter ? (
        <Detail
          setselectedquery={(value: string) => {
            let reportdetailCopy = JSON.parse(JSON.stringify(createreportdetail));
            console.log(
              'createreportdetail.time_filter.enable',
              createreportdetail.time_filter.enable,
            );

            reportdetailCopy.select_query = value;
            dispatch(setcreateReportdetail(reportdetailCopy));
          }}
          onclose={() => setShowfilter(!showfilter)}
        />
      ) : null}

      <div className="relative flex w-full flex-col p-[20px]">
        <h1 className="mb-6 font-bold">create report</h1>

        <div className="flex h-full flex-col">
          <Row name="name">
            <TextInput
              type="text"
              value={createreportdetail.name}
              onChange={e => {
                let reportdetailCopy = {...createreportdetail};
                reportdetailCopy.name = e.target.value;
                dispatch(setcreateReportdetail(reportdetailCopy));
              }}
              className="h-[40px] w-[720px]"
            />
          </Row>

          <Row name="Comment">
            <TextInput
              type="text"
              value={createreportdetail.comment}
              onChange={e => {
                let reportdetailCopy: reporttype = {...createreportdetail};
                reportdetailCopy.comment = e.target.value;
                dispatch(setcreateReportdetail(reportdetailCopy));
              }}
              className="h-[40px] w-[720px]"
            />
          </Row>

          <Row classname="mt-[28px]" name="Report Type">
            <div className="flex w-[550px] flex-row">
              <Select
                className={'h-[40px] w-[400px] border border-solid'}
                value={createreportdetail.report_type}
                onChange={e => {
                  let reportdetailCopy: reporttype = {...createreportdetail};
                  reportdetailCopy.report_type = e.target.value;                  
                  let finlistdata:any=findValue(e.target.value)
                  reportdetailCopy.availebelColumns = finlistdata           
                  dispatch(setcreateReportdetail(reportdetailCopy));
                }}>
                {reporttypeList.map(data => (
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    {data}
                  </option>
                ))}
              </Select>

              <SimpleBtn onClick={() => setShowfilter(!showfilter)}>
                Filter
              </SimpleBtn>
            </div>
          </Row>

          <div className="mb-[17px] flex w-[940px]  flex-row  items-center justify-between pr-[18px]">
            <div className="flex flex-row">
              <Checkbox
                checkstatus={createreportdetail?.time_filter?.enable || false}
                onclick={e => {
                  let reportdetailCopy = JSON.parse(
                    JSON.stringify(createreportdetail),
                  );
                  console.log(
                    'createreportdetail.time_filter.enable',
                    createreportdetail.time_filter.enable,
                  );

                  reportdetailCopy.time_filter.enable =
                    !createreportdetail.time_filter.enable;
                  dispatch(setcreateReportdetail(reportdetailCopy));
                }}
                iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px] text-[#18C047]"
                classname={
                  'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] text-[#18C047] border-[#000000]'
                }
              />
              <span className="ml-[10px] text-[20px] font-normal">
                Time Filter
              </span>
            </div>
            <div className="flex   w-[740px] flex-col">
              <div className="flex w-full flex-row items-center">
                <RadioButton
                  check={
                    createreportdetail?.time_filter?.time_filter_type == 'exact'
                      ? true
                      : false
                  }
                  onclick={
                    createreportdetail?.time_filter?.enable
                      ? () => {
                          let reportdetailCopy = JSON.parse(
                            JSON.stringify(createreportdetail),
                          );
                          reportdetailCopy.time_filter.time_filter_type =
                            'exact';
                          dispatch(setcreateReportdetail(reportdetailCopy));
                        }
                      : () => {}
                  }
                />
                <span className="ml-[10px] mr-[37px] text-[20px] font-normal leading-6">
                  Exact Time
                </span>
                <span className="text-[20px] font-normal leading-6">From</span>
                <input
                  ref={firstdateref}
                  onChange={e => {
                    let reportdetailCopy = JSON.parse(
                      JSON.stringify(createreportdetail),
                    );
                    reportdetailCopy.time_filter.time_exact.from_time =
                      e.target.value;
                    dispatch(setcreateReportdetail(reportdetailCopy));
                  }}
                  value={createreportdetail?.time_filter?.time_exact?.from_time}
                  type="date"
                  className="ml-4 h-[40px] w-[170px] cursor-pointer rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => firstdateref.current.showPicker()}
                  className="ml-[9px] h-[35px] w-[35px] cursor-pointer"
                />

                <span className="ml-10 text-[20px] font-normal leading-6">
                  to
                </span>
                <input
                  ref={secenddateref}
                  onChange={e => {
                    let reportdetailCopy: reporttype = deepcopy(createreportdetail);
                    reportdetailCopy.time_filter.time_exact.to_time =
                      e.target.value;
                    dispatch(setcreateReportdetail(reportdetailCopy));
                  }}
                  value={createreportdetail?.time_filter?.time_exact?.to_time}
                  type="date"
                  className="ml-4 h-[40px] w-[170px] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => secenddateref.current.showPicker()}
                  className="ml-[9px] h-[35px] w-[35px] cursor-pointer"
                />
              </div>

              <div className="mt-[10px] flex w-[424px] flex-row items-center">
                <RadioButton
                  check={
                    createreportdetail?.time_filter?.time_filter_type == 'relative'
                      ? true
                      : false
                  }
                  onclick={
                    createreportdetail?.time_filter?.enable
                      ? () => {
                          let reportdetailCopy = JSON.parse(
                            JSON.stringify(createreportdetail),
                          );
                          reportdetailCopy.time_filter.time_filter_type =
                            'relative';
                          dispatch(setcreateReportdetail(reportdetailCopy));
                        }
                      : () => {}
                  }
                />
                <span className="ml-[10px] mr-[15px] text-[20px] font-normal leading-6">
                  Relative Time
                </span>
                <span className="text-[20px] font-normal leading-6">Every</span>
                <TextInput
                  type="number"
                  value={createreportdetail?.time_filter?.time_relative?.value}
                  onChange={e => {
                    let reportdetailCopy = JSON.parse(
                      JSON.stringify(createreportdetail),
                    );
                    reportdetailCopy.time_filter.time_relative.value = Number(
                      e.target.value,
                    );
                    dispatch(setcreateReportdetail(reportdetailCopy));
                  }}
                  className="ml-[8px] h-[40px] w-[70px]"
                />

                <Select
                  className={'ml-[5px] h-[40px] w-[90px]'}
                  value={createreportdetail?.time_filter?.time_relative?.period}
                  onChange={e => {
                    let reportdetailCopy = JSON.parse(
                      JSON.stringify(createreportdetail),
                    );
                    reportdetailCopy.time_filter.time_relative.period =
                      e.target.value;
                    dispatch(setcreateReportdetail(reportdetailCopy));
                  }}>
                  <option value="" className="hidden">
                    {createreportdetail?.time_filter?.time_relative?.period}
                  </option>
                  <option value={undefined} className="hidden">
                    {createreportdetail?.time_filter?.time_relative?.period}
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    month
                  </option>
                  {/* <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    days
                  </option> */}
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    year
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    hour
                  </option>
                </Select>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 flex flex-row items-center">
            {/* <SimpleBtn>Open Report</SimpleBtn> */}

            <SimpleBtn
              type="button"
              onClick={() => createreport()}
              className="mx-[5px]">
              Save
            </SimpleBtn>
            <SimpleBtn onClick={() => {}}>Cancel</SimpleBtn>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateReport;
