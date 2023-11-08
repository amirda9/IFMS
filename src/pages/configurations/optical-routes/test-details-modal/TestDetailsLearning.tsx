import {FC, useEffect, useRef, useState} from 'react';
import {Description, Select, TextInput} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import './index.css';
import {useDispatch, useSelector} from 'react-redux';
import {InputFormik} from '~/container';
import {Form, FormikProvider, useFormik} from 'formik';
import {setopticalroutUpdateTestsetupDetail} from '~/store/slices/opticalroutslice';
const TestDetailsLearning: FC = () => {
 const convertperiod=(str:string)=>{
  let firstLetter = str.charAt(0);
  let firstLetterUpper = firstLetter.toUpperCase();
  let restOfStr = str.slice(1);
  let result = firstLetterUpper + restOfStr+"s";
  return result
  }
  const dispatch = useDispatch();
  const {opticalrouteTestSetupDetail} = useSelector((state: any) => state.http);
  const {opticalroutUpdateTestsetupDetail} = useSelector(
    (state: any) => state.opticalroute,
  );

  const [selectedradio, setSelectedradio] = useState('On');
  const [selectedradio2, setSelectedradio2] = useState('On');
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);

  const formik = useFormik({
    initialValues: {
      countpercycle:
      opticalroutUpdateTestsetupDetail?.learning_data
          ?.targeted_count_per_cycle,
      startcycletype:
      opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time
          ?.type,
      startcycletime:
      opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time
          ?.time,
      periodicoptionsvalue:
      opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time
          ?.periodic_options?.value,
      periodicoptionsperiodtime:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.timing?.time,
      increasecountoptionscount:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.count,
      increasecountoptionstype:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.timing?.type,
      increaseperiodicoptionsvalue:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.timing?.periodic_options?.value,
      increaseperiodicoptionsperiodtime:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.timing?.periodic_options?.period_time,
      increasecountoptionstiming:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.timing?.time,
      increasecountoptionsmaximumcount:
      opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options
          ?.maximum_count,
    },

    onSubmit: () => {},
  });

  function RadioButton({name}: any) {
    let data = name == 'On' ? 'fixed' : 'periodic';
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => {
            setSelectedradio(name),
              formik.setFieldValue('startcycletype', data);
            let dataa: any = JSON.parse(
              JSON.stringify(opticalroutUpdateTestsetupDetail),
            );
            dataa.learning_data.start_cycle_time.type = data;
            dispatch(setopticalroutUpdateTestsetupDetail(dataa));
          }}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              selectedradio == name ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
        <span className="ml-[8px] text-[20px] font-light text-[#000000]">
          {name}
        </span>
      </div>
    );
  }

  function RadioButton2({name}: any) {
    let data = name == 'On' ? 'fixed' : 'periodic';
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => {
            setSelectedradio2(name),
              formik.setFieldValue('increasecountoptionstype', data);
            let dataa: any = JSON.parse(
              JSON.stringify(opticalroutUpdateTestsetupDetail),
            );
            dataa.learning_data.increase_count_options.timing.type = data;
            dispatch(setopticalroutUpdateTestsetupDetail(dataa));
          }}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              selectedradio2 == name ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
        <span className="ml-[8px] text-[20px] font-light text-[#000000]">
          {name}
        </span>
      </div>
    );
  }

// console.log(opticalroutUpdateTestsetupDetail.learning_data.increase_count_options.maximum_coun,'yyytt');


  return (
    <FormikProvider value={formik}>
      <Form className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <Description
            labelClassName="basis-64"
            label="Targeted Count Per Cycle">
            <TextInput
              onChange={e => {
                formik.setFieldValue('countpercycle', e.target.value);
                let dataa: any = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.learning_data.targeted_count_per_cycle = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.learning_data?.targeted_count_per_cycle}
              name="count-per-cycle"
              type="number"
            />
          </Description>

          <Description labelClassName="basis-64" label="Start a New Cycle">
            <div className="flex flex-col gap-y-4">
              <div
                className="it ems-center flex
          flex-row">
                <RadioButton name="On" />

                <input
                  ref={firstdateref}
                  onChange={e => {
                    formik.setFieldValue('startcycletime', e.target.value);
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.start_cycle_time.time = e.target.value;
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time?.time}
                  type="date"
                  className="ml-6 h-8 w-48 rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => firstdateref.current.showPicker()}
                  className="ml-[5px] h-[35px] w-[35px]"
                />
              </div>
              <div className="flex flex-row items-center gap-x-4">
                <RadioButton name="Every" />
                <TextInput
                type='number'
                  onChange={e => {
                    formik.setFieldValue(
                      'periodicoptionsvalue',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.start_cycle_time.periodic_options.value =
                     Number(e.target.value) ;
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
               value={opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time?.periodic_options.value}
                  className="w-16"
                />
                <Select
                  onChange={e => {
                    formik.setFieldValue(
                      'periodicoptionsperiodtime',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.start_cycle_time.periodic_options.period_time =
                      e.target.value.toLowerCase().slice(0,-1);
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={convertperiod(opticalroutUpdateTestsetupDetail?.learning_data?.start_cycle_time?.periodic_options?.period_time || "")}
                  className="w-26">
                  <option>Months</option>
                  <option>Days</option>
                  <option>Years</option>
                  <option>Hours</option>
                </Select>
              </div>
            </div>
          </Description>

          <Description
            labelClassName="basis-64"
            label={
              <span className="flex items-center gap-x-2">
                <span>Increase Target by</span>
                <TextInput
                type='number'
                  onChange={e => {
                    formik.setFieldValue(
                      'increasecountoptionscount',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.increase_count_options.count =
                      Number(e.target.value);
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options?.count}
                  className="w-16"
                />
              </span>
            }>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-row items-center">
                <RadioButton2 name="On" />

                <input
                  onChange={e => {
                    formik.setFieldValue(
                      'increaseperiodicoptionsperiodtime',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.increase_count_options.timing.time =
                      e.target.value;
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  ref={secenddateref}
                  value={opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options?.timing.time}
                  type="date"
                  className="ml-6 h-8 w-48 rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => secenddateref.current.showPicker()}
                  className="ml-[5px] h-[35px] w-[35px]"
                />
              </div>
              <div className="flex flex-row items-center gap-x-4">
                <RadioButton2 name="Every" />

                <TextInput
                type='number'
                  onChange={e => {
                    formik.setFieldValue(
                      'increaseperiodicoptionsvalue',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.increase_count_options.timing.periodic_options.value =
                      Number(e.target.value);
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options?.timing?.periodic_options?.value}
                  className="w-16"
                />
                <Select
                  onChange={e => {
                    formik.setFieldValue(
                      'increasecountoptionstiming',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.increase_count_options.timing.periodic_options.period_time =
                    e.target.value.toLowerCase().slice(0,-1);;
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={convertperiod(opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options?.timing?.periodic_options?.period_time || "")}
                  className="w-26">
                  <option>Months</option>
                  <option>Days</option>
                  <option>Years</option>
                  <option>Hours</option>
                </Select>
                <span>Up to Max.</span>
                <TextInput
                type='number'
                  onChange={e => {
                    formik.setFieldValue(
                      'increasecountoptionsmaximumcount',
                      e.target.value,
                    );
                    let dataa: any = JSON.parse(
                      JSON.stringify(opticalroutUpdateTestsetupDetail),
                    );
                    dataa.learning_data.increase_count_options.maximum_count =
                      Number(e.target.value);
                    dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                  }}
                  value={opticalroutUpdateTestsetupDetail?.learning_data?.increase_count_options?.maximum_count}
                  className="w-16"
                />
                <span>traces</span>
              </div>
            </div>
          </Description>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default TestDetailsLearning;
