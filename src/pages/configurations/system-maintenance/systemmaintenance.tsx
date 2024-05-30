import React, {useState} from 'react';
import {TextInput, SimpleBtn} from '~/components';
type Rowtexttype = {
  name: string;
  value: string;
  classname: string;
};
type Tabtype = {
  onClick?: () => void;
  name: string;
};
const Rowtext = ({name, value, classname}: Rowtexttype) => {
  return (
    <div className="mb-[15px] flex flex-row">
      <span className="text-[20px] font-light text-[#000000]">{name}</span>
      <span className={`text-[20px] font-light text-[#000000] ${classname}`}>
        {value}
      </span>
    </div>
  );
};

// ------------- main ----------------- main ---------------------- main --------------------- main -----
const Systemmaintenance = () => {
  const [selectedtab, setSelectedtab] = useState('');
  const [selectedradio, setSelectedradio] = useState('');
  const Tab = ({name, ...props}: Tabtype) => {
    return (
      <button
        {...props}
        className={`${
          selectedtab == name ? 'bg-[#C0E7F2]' : '#ffffff'
        } h-[40px] w-full pl-[25px] text-left`}>
        {name}
      </button>
    );
  };
  function RadioButton({name}: any) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => setSelectedradio(name)}
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
  return (
    <div className="relative box-border w-full px-[15px] py-[25px]">
            <h1 className='text-[red] font-bold my-6 mt-14 text-[20px]'>This page requires a Full-Access license to view the content</h1>

      <Rowtext name="Database Size" value="3678 MB" classname={'ml-[175px]'} />
      <Rowtext
        name="Number of Open Sessions"
        value="50"
        classname="ml-[63px]"
      />
      <Rowtext
        name="Number of Users Logged In"
        value="50"
        classname="ml-[50px]"
      />
      <div className="flex w-full flex-row">
        <div className="flex-start flex h-[360px] w-[450px] flex-col rounded-[10px] bg-[#ffffff] pb-[15px] pt-[5px]">
          <Tab onClick={() => setSelectedtab('Networks')} name="Networks" />
          <Tab onClick={() => setSelectedtab('Regions')} name="Regions" />
          <Tab onClick={() => setSelectedtab('Stations')} name="Stations" />
          <Tab onClick={() => setSelectedtab('Links')} name="Links" />
          <Tab onClick={() => setSelectedtab('RTUs')} name="RTUs" />
          <Tab
            onClick={() => setSelectedtab('Optical Routes')}
            name="Optical Routes"
          />
          <Tab
            onClick={() => setSelectedtab('Alarm Types')}
            name="Alarm Types"
          />
          <Tab onClick={() => setSelectedtab('Alarms')} name="Alarms" />
          <Tab onClick={() => setSelectedtab('Result')} name="Result" />
          <Tab
            onClick={() => setSelectedtab('Test Setups')}
            name="Test Setups"
          />
        </div>

        <div className="flex flex-col pl-[20px] pt-[10px]">
          <Rowtext
            name="Current Row Number"
            value="123"
            classname={'ml-[115px]'}
          />
          <Rowtext
            name="Oldest Record Creation Time"
            value="2023-05-10 23:41:36"
            classname={'ml-[45px]'}
          />
          <div className="mb-[20px] flex flex-row">
            <RadioButton name="No Limit" />
            <span className="ml-[215px] text-[20px] font-light text-[#000000]">
              60
            </span>
          </div>
          <div className="mb-[20px] flex flex-row">
            <RadioButton name="Row Limit" />
            <TextInput value={100} className="ml-[200px] h-[40px] w-[183px] rounded-[10px] border-[1px] border-[#000000] text-[20px]  font-light" />
          </div>
          <div className="flex flex-row">
            <RadioButton name="Time Limit" />
            <TextInput value={100} className="ml-[195px] h-[40px] w-[115px] rounded-[10px] border-[1px] border-[#000000] text-[20px]  font-light" />
            <span className="ml-[14px] text-[20px] font-light text-[#000000] mt-[2px]">
              Days
            </span>
            <TextInput value={"00:00"} className="ml-[45px] h-[40px] w-[115px] rounded-[10px] border-[1px] border-[#000000] text-[20px]  font-light" />
            <span className="ml-[14px] text-[20px] font-light text-[#000000] mt-[3px]">
            (HH : MM)
            </span>
          </div>
        </div>
      </div>
      <SimpleBtn className='absolute bottom-[20px] right-[15px] ' type="button">Ok</SimpleBtn>
    </div>
  );
};

export default Systemmaintenance;
