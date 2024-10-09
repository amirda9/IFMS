import {FC, useEffect, useRef, useState} from 'react';
import {Description, TextInput} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import {setopticalroutUpdateTestsetupDetail} from '~/store/slices/opticalroutslice';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import { deepcopy } from '~/util';
import Checkbox from '~/components/checkbox/checkbox';

const seperatedate = (time: string) => {
  //The function below takes a date and separates its time and date
  let date = new Date(time);
  let year = date?.getFullYear();
  let month = date?.getMonth() + 1;
  let day = date?.getDate();
  let hour = date?.getHours();
  let minute = date?.getMinutes();
  let Minute = Number(minute) < 10 ? `0${minute}` : minute;
  let second = date.getSeconds();
  let datePart = year + '-' + month + '-' + day;
  let timePart = hour + ':' + Minute;
  return {datePart: datePart, timePart: timePart};
};

type RadioButton = {
  name: string;
};
const TestDetailsTestProgram: FC = () => {
  const dispatch = useDispatch();

  const {opticalrouteTestSetupDetail} = useSelector((state: any) => state.http);
  const {opticalroutUpdateTestsetupDetail,modalloading} = useSelector(
    (state: any) => state.opticalroute,
  );
  const [selectedradio, setSelectedradio] = useState<string[]>(["Indefinite"]);
  const [selectedradio2, setSelectedradio2] = useState('');
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);

  useEffect(() => {
    if (
      opticalroutUpdateTestsetupDetail?.test_program?.starting_date?.immediately
    ) {
      setSelectedradio(prev => [...prev, 'As Soon As Possible']);
    }
    if (opticalrouteTestSetupDetail?.data?.test_program?.end_date?.indefinite) {
      setSelectedradio(prev => [...prev, 'Indefinite']);
    }
    //The information that comes from the backend is lowercase while we need the first letters of them to be uppercase
    let a = opticalroutUpdateTestsetupDetail?.test_program?.period_time?.period_time.toString() || 'hourly';
    setSelectedradio2(a);

  }, []);


  const formik = useFormik({
    enableReinitialize:true,
    initialValues: {
      startingdateStart:opticalroutUpdateTestsetupDetail?.startdatePart,
      startingdateStarttime:opticalroutUpdateTestsetupDetail?.starttimePart,
      immediately:
        opticalroutUpdateTestsetupDetail?.test_program?.starting_date
          ?.immediately,
      enddateEnd: opticalroutUpdateTestsetupDetail?.enddatePart,
      enddateEndtime: seperatedate(
        opticalroutUpdateTestsetupDetail?.test_program?.end_date?.end,
      ).timePart,
      periodtimevalue:
        opticalroutUpdateTestsetupDetail?.period_time?.value.toString(),
      periodtimePeriodtime:
        opticalroutUpdateTestsetupDetail?.period_time?.period_time,
    },

    onSubmit: () => {},
  });

  function RadioButton({name}: RadioButton) {
    const onclickbtn = () => {
      let dataa: any =deepcopy(opticalroutUpdateTestsetupDetail)

      if (selectedradio.indexOf(name) > -1) {
      } else {
        setSelectedradio(prev => [...prev, name]);
      }

      if (name == 'As Soon As Possible') {
        formik.setFieldValue('immediately', true);

        dataa.test_program.starting_date.immediately = true;
        dispatch(setopticalroutUpdateTestsetupDetail(dataa));
      } else {
        formik.setFieldValue('enddateEnd', true);
        dataa.test_program.end_date.indefinite = true;
        dispatch(setopticalroutUpdateTestsetupDetail(dataa));
      }
    };
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={onclickbtn}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              selectedradio.indexOf(name) > -1 ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
        <span className="ml-[8px] text-[20px] font-light text-[#000000]">
          {name}
        </span>
      </div>
    );
  }

  function RadioButton2({name}: RadioButton) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => {
            let dataa: any =deepcopy(opticalroutUpdateTestsetupDetail);
            setSelectedradio2(name),
              formik.setFieldValue(
                'periodtimePeriodtime',
                name,
              );
              let newName=name
           
            dataa.test_program.period_time.period_time = newName;

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



  if (modalloading) {
    return <h1>Loading...</h1>;
  }
  return (
    
    <div className="flex flex-col gap-y-8">
      <Description label="Starting Date">
        <div className="flex items-center">
          <input
            onChange={e => {
              let dataa =deepcopy(opticalroutUpdateTestsetupDetail);
              formik.setFieldValue('startingdateStart', e.target.value);
              dataa.startdatePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
          //  defaultValue={""}
         value={opticalroutUpdateTestsetupDetail?.startdatePart}
            ref={firstdateref}
            type="date"
            className="ml-6 h-8 w-48 rounded-md border border-black px-2"
          />
          <img
            src={dateicon}
            onClick={() => firstdateref.current.showPicker()}
            className="ml-[5px] mr-[25px] h-[35px] w-[35px]"
          />
          <TextInput
            onChange={e => {
              formik.setFieldValue('startingdateStarttime', e.target.value);
              let dataa = deepcopy(opticalroutUpdateTestsetupDetail);
              dataa.starttimePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.starttimePart}
            className="mr-[30px]"
            type="time"
          />

<Checkbox
          checkstatus={ selectedradio.indexOf("As Soon As Possible") > -1}
          onclick={()=>{
            let dataa: any =deepcopy(opticalroutUpdateTestsetupDetail)
             const finddataindex=selectedradio.findIndex((data)=> data == "As Soon As Possible")
            if (finddataindex> -1) {
              const selectedradioCopy=deepcopy(selectedradio)
              selectedradioCopy.splice(finddataindex,1)
              setSelectedradio(selectedradioCopy);
            } else {
              setSelectedradio(prev => [...prev, "As Soon As Possible"]);
            }
            formik.setFieldValue('immediately', !formik.values.immediately);

            dataa.test_program.starting_date.immediately = !opticalroutUpdateTestsetupDetail.test_program.starting_date.immediately;
            dispatch(setopticalroutUpdateTestsetupDetail(dataa));
          }}
          iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
          classname={' border-[1px] text-[#18C047] border-[#000000] mr-[7px]'}
        />

          {/* <RadioButton name="As Soon As Possible" /> */}
        </div>
      </Description>
      <Description label="End Date">
        <div className="flex items-center">
          <input
            onChange={e => {
              formik.setFieldValue('enddateEnd', e.target.value);
              let dataa = deepcopy(opticalroutUpdateTestsetupDetail);
              
              dataa.enddatePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail?.enddatePart}
            ref={secenddateref}
            type="date"
            className="ml-6 h-8 w-48 rounded-md border border-black px-2"
          />
          <img
            src={dateicon}
            onClick={() => secenddateref.current.showPicker()}
            className="ml-[5px] mr-[25px] h-[35px] w-[35px]"
          />
          <TextInput
            onChange={e => {
              formik.setFieldValue('enddateEndtime', e.target.value);
              let dataa =deepcopy(opticalroutUpdateTestsetupDetail);
              
              dataa.endtimePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.endtimePart}
            className="mr-[30px]"
            type="time"
          />

<Checkbox
          checkstatus={ selectedradio.indexOf("Indefinite") > -1}
          onclick={()=>{
            let dataa: any =deepcopy(opticalroutUpdateTestsetupDetail)
             const finddataindex=selectedradio.findIndex((data)=> data == "Indefinite")
            if (finddataindex> -1) {
              const selectedradioCopy=deepcopy(selectedradio)
              selectedradioCopy.splice(finddataindex,1)
              setSelectedradio(selectedradioCopy);
            } else {
              setSelectedradio(prev => [...prev, "Indefinite"]);
            }
            formik.setFieldValue('enddateEnd', !formik.values.enddateEnd);
        dataa.test_program.end_date.indefinite = !opticalroutUpdateTestsetupDetail.test_program.end_date.indefinite;
        dispatch(setopticalroutUpdateTestsetupDetail(dataa));
          }}
          iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
          classname={' border-[1px] text-[#18C047] border-[#000000] mr-[7px]'}
        />

          {/* <RadioButton name="Indefinite" /> */}
        </div>
      </Description>
      <Description label="Periodicity">
        <div className="flex flex-col gap-y-4">
          <RadioButton2 name={'hourly'} />
          <RadioButton2 name={'daily'} />
          <RadioButton2 name={'monthly'} />
          <RadioButton2 name={'yearly'} />
          
        </div>
        <div className="ml-16">
          <span>Every</span>
          <TextInput
            onChange={e => {
              let dataa =deepcopy(opticalroutUpdateTestsetupDetail);
              
              formik.setFieldValue('periodtimevalue', e.target.value);
              dataa.test_program.period_time.value =Number(e.target.value) ;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail?.test_program?.period_time?.value}
            type="number"
            className="mx-4 w-16"
          />
          <span>Hour(s)</span>
        </div>
      </Description>
    </div>
  );
};

export default TestDetailsTestProgram;
