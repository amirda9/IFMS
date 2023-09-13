
import React, { useState, useRef, useEffect } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { GrDown, GrUp } from "react-icons/gr";
import { GoChevronDown } from "react-icons/go";
import { BsChevronDown } from "react-icons/bs";

type IProps = {
  onclickItem: Function;
  options: { value: string; label: string }[];
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
  bgcolor = "#ffffff",
  borderColor,
  textColor = "#000000",
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
    defaultvalue || placeholder
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
      (data) =>
        data.label.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
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
      className={`relative  flex flex-col bg-[${bgcolor}] rounded-[5px]  md:rounded-[8px] ${classname}`}
    >
      <div
        className={`flex flex-row border-[1px] bg-[${bgcolor}] ${
          borderColor ? `border-[${borderColor}]` : "border-[#3a86ff]"
        }  border-solid justify-between items-center h-10 md:h-[40px] px-2 relative w-full rounded-[5px] md:rounded-[10px] focus:border-blue-light  focus:outline-none`}
      >
        {search ? (
          <input
            onChange={search ? searchitems : () => {}}
            value={selectedlable}
            placeholder={placeholder ? placeholder : ""}
            ref={wrapperRef}
            onFocus={onfocusinputt}
            onClick={() => setOpenitems(!openitems)}
            className={`Content  text-[#777777] w-[95%] h-[38px] md:h-[38px] bg-[${bgcolor}]  border-none  focus:outline-none`}
          />
        ) : (
          <>
            <input
              className="w-[0px] h-[0px] opacity-0"
              ref={wrapperRef}
              onFocus={onfocusinputt}
            />
            <button
              ref={wrapperRef}
              onClick={onfocusinputtt}
              className={`Content w-[95%] h-[38px] md:h-[48px] text-[#777777] bg-[${bgcolor}]  border-none  focus:outline-none`}
            >
              {selectedlable}
            </button>
          </>
        )}

        {openitems ? (
        
            <BsChevronDown
              color={"black"}
              onClick={() => setOpenitems(!openitems)}
              className={`text-[17px] mt-[-1px] md:text-6 md:mt-[-1px] cursor-pointer text-[black] rotate-180`}
            />
         
        ) : (
       
            <BsChevronDown
              color={"black"}
              onClick={() => UPfunc()}
              className={`text-[17px] mb-[-1px] md:text-6 cursor-pointer text-[black]`}
            />
       
        )}
      </div>
      <div
        className={`min-w-full w-fit absolute right-0 transition-all duration-200 bg-[${bgcolor}] text-[black]  rounded-[5px] md:rounded-[8px]  top-[41px] md:top-[51px] z-50 flex flex-col  border-[1px] shadow-md border-solid border-black  ${
          openitems ? "max-h-[210px]" : "max-h-0"
        } ${openitems ? "overflow-auto" : "overflow-hidden"} ${
          openitems ? "border-[1px]" : "border-0"
        }`}
      >
        {Array.isArray(optionsitem) &&
          optionsitem.map((data, index) => (
            <div
              onClick={() => onclickitem(data)}
              key={index}
              className={`cursor-pointer z-50 w-full px-2 md:px-5 flex flex-row items-center h-auto py-2  bg-[#ffffff]  text-[black] border-b-[1px] ${
                index == options.length - 1
                  ? "border-b-[#ffffff]"
                  : "border-[black]"
              } `}
            >
              {data.label}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Selectbox;
