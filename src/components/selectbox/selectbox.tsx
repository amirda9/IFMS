import React, {useState, useRef, useEffect} from 'react';
import {useDetectClickOutside} from 'react-detect-click-outside';
import {GrDown, GrUp} from 'react-icons/gr';
import {GoChevronDown} from 'react-icons/go';
import {BsChevronDown} from 'react-icons/bs';

type IProps = {
  onclickItem: Function;
  options: {value: string; label: string}[];
  classname: string;
  placeholder?: string;
  defaultvalue?: string;
  inputclassname?: string;
  onFocusinput?: Function;
  search?: boolean;
  bgcolor?: string;
  textColor?: string;
  borderColor?: string;
};

type OnclickItem = {
  value: string;
  label: string;
};

function Selectbox({
  onclickItem,
  options,
  classname,
  placeholder,
  defaultvalue,
  onFocusinput,
  search = true,
  bgcolor = '#ffffff',
  borderColor,
  textColor = '#000000',
}: IProps) {
  const [optionsitem, setOptionsitem] = useState<
    {
      value: string;
      label: string;
    }[]
  >(options);
  const wrapperRef: any = useRef(null);
  const boxRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenitems(false), wrapperRef?.current?.blur();
    },
  });
  const [openitems, setOpenitems] = useState(false);
  const [selectedlable, setSelectedlable] = useState(
    defaultvalue || placeholder,
  );

  const onclickitem = (data: OnclickItem) => {
    setOpenitems(false);
    // setSelecteditem(data.value);
    setSelectedlable(data.label);
    onclickItem(data);
  };

  const onFocusInput = (data: OnclickItem) => {
    //  setOptionsitem(options)
    onclickitem(data);
  };
  const searchitems = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedlable(e.target.value);
    const options2 = [...options];
    const findeoptions = options2.filter(
      data =>
        data.label.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    );
    setOptionsitem(findeoptions);
  };

  const onfocusinputt = () => {
    // setOpenitems(!openitems);
    setOptionsitem(options);

    if (onFocusinput) {
      onFocusinput();
    }
  };
  const onfocusinputtt = () => {
    setOpenitems(!openitems);
    setOptionsitem(options);

    if (onFocusinput) {
      onFocusinput();
    }
  };
  const UPfunc = () => {
    setOpenitems(!openitems);
    setOptionsitem(options);
  };

  return (
    <div
    ref={boxRef}
      className={`flex flex-col border-[1px] bg-[${bgcolor}] ${
        borderColor ? `border-[${borderColor}]` : 'border-[#3a86ff]'
      }  focus:border-blue-light relative  border-solid    focus:outline-none ${classname}`}>
     <div className='w-full h-full flex flex-row px-2 items-center box-border justify-between'>
      {search ? (
        <input
          onChange={search ? searchitems : () => {}}
          value={selectedlable}
          placeholder={placeholder ? placeholder : ''}
          ref={wrapperRef}
          onFocus={onfocusinputt}
          onClick={() => setOpenitems(!openitems)}
          className={`Content placeholder-[#000000] h-full w-[95%] bg-[${bgcolor}] text-[#000000] border-none  focus:outline-none`}
        />
      ) : (
        <>
          <input
            className="h-[0px] w-[0px] opacity-0"
            ref={wrapperRef}
            onFocus={onfocusinputt}
          />
          <button
            ref={wrapperRef}
            onClick={onfocusinputtt}
            className={`Content h-full w-[95%] text-[#040101] bg-[${bgcolor}]  border-none  focus:outline-none`}>
            {selectedlable}
          </button>
        </>
      )}
        {openitems ? (
        <BsChevronDown
          color={'black'}
          onClick={() => setOpenitems(!openitems)}
          className={`md:text-6 mt-[-1px] rotate-180 cursor-pointer text-[17px] text-[black] md:mt-[-1px]`}
        />
      ) : (
        <BsChevronDown
          color={'black'}
          onClick={() => UPfunc()}
          className={`md:text-6 mb-[-1px] cursor-pointer text-[17px] text-[black]`}
        />
      )}

</div>
    
      <div className="relative h-0 w-full block">
        <div
          className={`absolute right-0 w-fit min-w-full transition-all duration-200 bg-[${bgcolor}] top-[3px]  z-50 flex  flex-col rounded-[5px] border-[1px] border-solid  border-none text-[black] shadow-md md:rounded-[8px]  ${
            openitems ? 'max-h-[210px]' : 'max-h-0'
          } ${openitems ? 'overflow-auto' : 'overflow-hidden'} ${
            openitems ? 'border-[1px]' : 'border-0'
          }`}>
          {Array.isArray(optionsitem) &&
            optionsitem.map((data, index) => (
              <div
                onClick={() => onclickitem(data)}
                key={index}
                className={`z-50 flex h-auto w-full cursor-pointer flex-row items-center border-b-[1px] bg-[#ffffff] px-2  py-2  text-[black] md:px-5 ${
                  index == options.length - 1
                    ? 'border-b-[#ffffff]'
                    : 'border-[black]'
                } `}>
                {data.label}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Selectbox;
