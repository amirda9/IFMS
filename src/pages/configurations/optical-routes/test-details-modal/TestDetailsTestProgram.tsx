import {FC, useEffect, useRef, useState} from 'react';
import {Description, TextInput} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import {setopticalroutUpdateTestsetupDetail} from '~/store/slices/opticalroutslice';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';

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
  const {opticalroutUpdateTestsetupDetail} = useSelector(
    (state: any) => state.opticalroute,
  );
  const [selectedradio, setSelectedradio] = useState<string[]>(["Indefinite"]);
  const [selectedradio2, setSelectedradio2] = useState('');
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);

  useEffect(() => {
    if (
      opticalrouteTestSetupDetail?.data?.test_program?.starting_date
        ?.immediately
    ) {
      setSelectedradio(prev => [...prev, 'As Soon As Possible']);
    }
    if (opticalrouteTestSetupDetail?.data?.test_program?.end_date?.indefinite) {
      setSelectedradio(prev => [...prev, 'Indefinite']);
    }
    //The information that comes from the backend is lowercase while we need the first letters of them to be uppercase
    let a = opticalrouteTestSetupDetail?.data?.test_program?.period_time || '';
    var firstLetter = a.charAt(0);
    var firstLetterUpper = firstLetter.toUpperCase();
    var restOfStr = a.slice(1);
    var result = firstLetterUpper + restOfStr;
    setSelectedradio2(result);

  }, []);

  const formik = useFormik({
    initialValues: {
      startingdateStart: seperatedate(
        opticalroutUpdateTestsetupDetail?.test_program?.starting_date.start,
      ).datePart,
      startingdateStarttime: seperatedate(
        opticalroutUpdateTestsetupDetail?.test_program?.starting_date.start,
      ).timePart,
      immediately:
        opticalroutUpdateTestsetupDetail?.test_program?.starting_date
          ?.immediately,
      enddateEnd: seperatedate(
        opticalroutUpdateTestsetupDetail?.test_program?.end_date?.end,
      ).datePart,
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
      let dataa: any = JSON.parse(
        JSON.stringify(opticalroutUpdateTestsetupDetail),
      );
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
            let dataa: any = JSON.parse(
              JSON.stringify(opticalroutUpdateTestsetupDetail),
            );
            setSelectedradio2(name),
              formik.setFieldValue(
                'periodtimePeriodtime',
                name.toLocaleLowerCase(),
              );
              let Name=name.toLowerCase()
              console.log(Name,'Name');
              let newName;
              if(Name == "every"){
                newName ="every"
              }else if(Name == "daily"){
                newName ="day"
              }else {
                newName=Name.slice(0,-2)
              }
              console.log(newName,'newName');
              
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

  return (
    <div className="flex flex-col gap-y-8">
      <Description label="Starting Date">
        <div className="flex items-center">
          <input
            onChange={e => {
              let dataa = JSON.parse(
                JSON.stringify(opticalroutUpdateTestsetupDetail),
              );
              formik.setFieldValue('startingdateStart', e.target.value);
              dataa.startdatePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.startdatePart}
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
              let dataa = JSON.parse(
                JSON.stringify(opticalroutUpdateTestsetupDetail),
              );
              dataa.starttimePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.starttimePart}
            className="mr-[30px]"
            type="time"
          />
          <RadioButton name="As Soon As Possible" />
        </div>
      </Description>
      <Description label="End Date">
        <div className="flex items-center">
          <input
            onChange={e => {
              formik.setFieldValue('enddateEnd', e.target.value);
              let dataa = JSON.parse(
                JSON.stringify(opticalroutUpdateTestsetupDetail),
              );
              dataa.enddatePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.enddatePart}
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
              let dataa = JSON.parse(
                JSON.stringify(opticalroutUpdateTestsetupDetail),
              );
              dataa.endtimePart = e.target.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.endtimePart}
            className="mr-[30px]"
            type="time"
          />
          <RadioButton name="Indefinite" />
        </div>
      </Description>
      <Description label="Periodicity">
        <div className="flex flex-col gap-y-4">
          <RadioButton2 name={'Hourly'} />
          <RadioButton2 name={'Daily'} />
          <RadioButton2 name={'Monthly'} />
          <RadioButton2 name={'Yearly'} />
          <RadioButton2 name={'Every'} />
        </div>
        <div className="ml-16">
          <span>Every</span>
          <TextInput
            onChange={e => {
              let dataa = JSON.parse(
                JSON.stringify(opticalroutUpdateTestsetupDetail),
              );
              formik.setFieldValue('periodtimevalue', e.target.value);
              dataa.test_program.period_time.value =Number(e.target.value) ;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            value={opticalroutUpdateTestsetupDetail.test_program.period_time.value}
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
