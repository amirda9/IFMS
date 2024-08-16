import React, {ReactNode, useEffect, useRef, useState} from 'react';
import * as Yup from 'yup';
import {Form, FormikProvider, useFormik, validateYupSchema} from 'formik';
import {InputFormik, SelectFormik} from '~/container';
import {Select, SimpleBtn, TabItem, TextInput} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import Checkbox from '~/components/checkbox/checkbox';
import {
  setReportdetail,
  updaterportname,
} from './../../../store/slices/reportslice';
import dateicon from '~/assets/images/dateicon.png';
import RadioButton from '~/components/radipbutton/radiobutton';
import {useNavigate, useParams} from 'react-router-dom';
import {$Get, $Put} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {deepcopy} from '~/util/deepcopy';
import {toast} from 'react-toastify';
import {RootState} from '~/store';

// import {setReportdetail} from './../../../store/slices/'
type Iprops = {
  children: ReactNode;
  name: string;
  classname?: string;
  ReportType?: string;
};

type updatereport = {
  name: string;
  comment: string;
  report_type: string;
  time_filter: {
    enable: false;
    time_filter_type: string;
    time_exact: {
      from_time: string;
      to_time: string;
    };
    time_relative: {
      value: 1;
      period: string;
    };
  };
  select_query: string;
  parameters: {
    selected_columns: [];
    order_by_columns: {};
  };
};

type reporttype = {
  id: string;
} & updatereport;

const operatorsvalues = (name: string) => {
  if (name == 'AlarmNum') {
    return ['=', '!=', '<', '>', '>=', '<='];
  } else if (name == 'State') {
    return ['=', '!=', '>', '<'];
  } else {
    return ['=', '!='];
  }
};
const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  Everyvalue: Yup.string().required('Please enter Everyvalue'),
});

const Row = ({children, name, classname}: Iprops) => {
  return (
    <div
      className={`mb-[20px] flex w-[900px] flex-row  items-center justify-between ${classname}`}>
      <span className="text-[20px] font-normal leading-[24.2px]">{name}</span>
      <div className="w-[720px]">{children}</div>
    </div>
  );
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
type detailprops = {
  onclose: () => void;
  setselectedquery: Function;
  quertextdata: string;
};
const Detail = ({onclose, setselectedquery, quertextdata}: detailprops) => {
  const navigate = useNavigate();
  const [parametervalue, setParametervalue] = useState('');
  const [operatorname, setOperatorname] = useState('');
  const [value, setValue] = useState('');
  const [quertext, setQuerytext] = useState(quertextdata || '');

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
function ReportsDetailpage() {
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
  const {reportid, reportsetid} = useParams();
  const [updateloading, setUpdateloading] = useState(false);
  const {reportdetail} = useSelector((state: RootState) => state.reportslice);

  useEffect(() => {
    const getreportdetail = async () => {
      try {
        setLoading(true);
        const detailresponse = await $Get(
          `otdr/report-set/${reportsetid}/report/${reportid}`,
        );
        console.log('detailresponse', detailresponse);

        if (detailresponse?.status == 200) {
          const detailresponsedata: reporttype = await detailresponse.json();
          console.log('detailresponsedata', detailresponsedata);

          dispatch(setReportdetail(detailresponsedata));
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        console.log(`get detail error is:${error}`);
      } finally {
        setLoading(false);
      }
    };
    getreportdetail();
  }, [reportid]);

  const updatereport = async () => {
    const {id, ...dataWithoutId} = reportdetail;
    console.log('dataWithoutId', dataWithoutId);

    try {
      const getdetaildata=await $Put(`otdr/report-set/${reportsetid}/report/${reportid}`,reportdetail)
      if(getdetaildata?.status == 201){
        toast('It was done successfully', {type: 'success', autoClose: 1000});
        dispatch(updaterportname({reportsetId: reportsetid!, reportid: reportid!, name: reportdetail?.name}))
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    }
  };

  console.log("reportdetail",reportdetail);
  
  if (loading) {
    return <h1 className="mt-2">loading...</h1>;
  }
  return (
    <>
      {showfilter ? (
        <Detail
          quertextdata={reportdetail.select_query}
          setselectedquery={(value: string) => {
            let reportdetailCopy = JSON.parse(JSON.stringify(reportdetail));
            console.log(
              'reportdetail.time_filter.enable',
              reportdetail.time_filter.enable,
            );

            reportdetailCopy.select_query = value;
            dispatch(setReportdetail(reportdetailCopy));
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
              value={reportdetail.name}
              onChange={e => {
                let reportdetailCopy = {...reportdetail};
                reportdetailCopy.name = e.target.value;
                dispatch(setReportdetail(reportdetailCopy));
              }}
              className="h-[40px] w-[720px]"
            />
          </Row>

          <Row name="Comment">
            <TextInput
              type="text"
              value={reportdetail.comment}
              onChange={e => {
                let reportdetailCopy = JSON.parse(JSON.stringify(reportdetail));
                reportdetailCopy.comment = e.target.value;
                dispatch(setReportdetail(reportdetailCopy));
              }}
              className="h-[40px] w-[720px]"
            />
          </Row>

          <Row classname="mt-[28px]" name="Report Type">
            <div className="flex w-[550px] flex-row">
              <Select
                className={'h-[40px] w-[400px] border border-solid'}
                value={reportdetail.report_type}
                onChange={e => {
                  let reportdetailCopy = JSON.parse(
                    JSON.stringify(reportdetail),
                  );
                  reportdetailCopy.report_type = e.target.value;
                  dispatch(setReportdetail(reportdetailCopy));
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
                checkstatus={reportdetail?.time_filter?.enable || false}
                onclick={e => {
                  let reportdetailCopy = JSON.parse(
                    JSON.stringify(reportdetail),
                  );
                  console.log(
                    'reportdetail.time_filter.enable',
                    reportdetail.time_filter.enable,
                  );

                  reportdetailCopy.time_filter.enable =
                    !reportdetail.time_filter.enable;
                  dispatch(setReportdetail(reportdetailCopy));
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
                    reportdetail?.time_filter?.time_filter_type == 'exact'
                      ? true
                      : false
                  }
                  onclick={
                    reportdetail?.time_filter?.enable
                      ? () => {
                          let reportdetailCopy = JSON.parse(
                            JSON.stringify(reportdetail),
                          );
                          reportdetailCopy.time_filter.time_filter_type =
                            'exact';
                          dispatch(setReportdetail(reportdetailCopy));
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
                      JSON.stringify(reportdetail),
                    );
                    reportdetailCopy.time_filter.time_exact.from_time =
                      e.target.value;
                    dispatch(setReportdetail(reportdetailCopy));
                  }}
                  value={reportdetail?.time_filter?.time_exact?.from_time}
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
                    let reportdetailCopy: reporttype = deepcopy(reportdetail);
                    reportdetailCopy.time_filter.time_exact.to_time =
                      e.target.value;
                    dispatch(setReportdetail(reportdetailCopy));
                  }}
                  value={reportdetail?.time_filter?.time_exact?.to_time}
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
                    reportdetail?.time_filter?.time_filter_type == 'relative'
                      ? true
                      : false
                  }
                  onclick={
                    reportdetail?.time_filter?.enable
                      ? () => {
                          let reportdetailCopy = JSON.parse(
                            JSON.stringify(reportdetail),
                          );
                          reportdetailCopy.time_filter.time_filter_type =
                            'relative';
                          dispatch(setReportdetail(reportdetailCopy));
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
                  value={reportdetail?.time_filter?.time_relative?.value}
                  onChange={e => {
                    let reportdetailCopy = JSON.parse(
                      JSON.stringify(reportdetail),
                    );
                    reportdetailCopy.time_filter.time_relative.value = Number(
                      e.target.value,
                    );
                    dispatch(setReportdetail(reportdetailCopy));
                  }}
                  className="ml-[8px] h-[40px] w-[70px]"
                />

                <Select
                  className={'ml-[5px] h-[40px] w-[90px]'}
                  value={reportdetail?.time_filter?.time_relative?.period}
                  onChange={e => {
                    let reportdetailCopy = JSON.parse(
                      JSON.stringify(reportdetail),
                    );
                    reportdetailCopy.time_filter.time_relative.period =
                      e.target.value;
                    dispatch(setReportdetail(reportdetailCopy));
                  }}>
                  <option value="" className="hidden">
                    {reportdetail?.time_filter?.time_relative?.period}
                  </option>
                  <option value={undefined} className="hidden">
                    {reportdetail?.time_filter?.time_relative?.period}
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    month
                  </option>
                  {/* <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    day
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

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Owner
            </span>
            <span className="w-[720px]">Admin</span>
          </div>

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Created
            </span>
            <span className="w-[720px]">2023-12-30 20:18:43</span>
          </div>

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Last Modified
            </span>
            <span className="w-[720px]">2023-12-30 20:18:43</span>
          </div>
          <div className="absolute bottom-0 right-0 flex flex-row items-center">
            <SimpleBtn>Open Report</SimpleBtn>

            <SimpleBtn
              onClick={() => updatereport()}
              type="submit"
              className="mx-[5px]">
              Save
            </SimpleBtn>
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportsDetailpage;
