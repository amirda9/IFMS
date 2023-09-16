import React, {Fragment, useState} from 'react';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import { BsPlusLg } from 'react-icons/bs';

const LinkCablesAndSegmentsPage = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = React.useState({x: null, y: null});
  const [parentduct, setParentduct] = useState<
  {id: number; slicecabl: number[]}[]
>([
  {id: 1, slicecabl: []},
  {id: 2, slicecabl: []},
]);

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.clientY});
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const addcable = () => {
    const beforadddata = [...parentduct];
    beforadddata.push({
      id: Math.floor(Math.random() * 10004141000 + 1),
      slicecabl: [],
    });
    setParentduct(beforadddata);
  };

  const addcabledata = (id: number) => {
    const beforadddata = [...parentduct];
    const findcable = beforadddata.findIndex(data => data.id == id);
    console.log(findcable, 'findcable');

    beforadddata[findcable].slicecabl.push(
      Math.floor(Math.random() * 10004141000 + 1),
    );

    setParentduct(beforadddata);
  };

  const deletecable = (id: number) => {
    const beforadddata = [...parentduct];
    const findcable = beforadddata.findIndex(data => data.id == id);
    beforadddata.splice(findcable, 1);
    setParentduct(beforadddata);
  };

  const deletecabledata = (cableid: number, cabledataid: number) => {
    const beforadddata = [...parentduct];
    const findcable = beforadddata.findIndex(data => data.id == cableid);
    const find = beforadddata[findcable].slicecabl.findIndex(
      data => data == cabledataid,
    );
    beforadddata[findcable].slicecabl.splice(find, 1);
    setParentduct(beforadddata);
  };

  const buttons = (
    <>
      <SimpleBtn type="submit">Save</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
  <div className="relative min-h-full  w-full">

             {mousePosition.y && mousePosition.y > 180 ? (
          <div
            style={{
              top: `${
                parentduct.length > 0
                  ? mousePosition.y && mousePosition.y - 205
                  : mousePosition.y && mousePosition.y - 187
              }px`,
              zIndex: 0,
            }}
            className={`absolute z-10 ml-[-30px] flex h-[30px] w-[calc(75%+20px)] flex-row items-center  justify-between`}>
            <button
              onClick={() => addcable()}
              className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
              <BsPlusLg
                color="white"
                size={35}
                className="ml-[-2.5px] mt-[-2.5px]"
              />
            </button>
            <div className="w-full  border-t-[2px] border-dashed  border-[#32C65D]"></div>
          </div>
        ) : null}


      {parentduct.map((data, index) => {
        const Chevron = open[index] ? IoChevronUp : IoChevronDown;
        return (
          <div className="my-6 w-9/12 relative z-40 rounded-md bg-gis p-4" key={index}>
            <div className='w-[30px] h-full absolute z-40 bg-b left-[-30px] top-0'></div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row">
                <span className="w-14"> {index + 1}</span>
                <Description
                  label="ID:"
                  labelClassName="w-fit pr-2"
                  className="flex-grow-0 pr-14">
                  <TextInput className="w-full" />
                </Description>
                <Description
                  label="Number of Cores:"
                  labelClassName="w-fit pr-2"
                  className="flex-grow-0 pr-14">
                  <TextInput type="number" className="w-28 " />
                </Description>
              </div>
              <div className="flex flex-row items-center gap-x-12">
                <IoTrashOutline
                  size={24}
                  className="cursor-pointer  text-red-500 active:text-red-300"
                />
                <Chevron
                  size={48}
                  className="cursor-pointer active:opacity-50"
                  onClick={() => {
                    if (open[index]) {
                      setOpen({...open, [index]: false});
                    } else {
                      setOpen({...open, [index]: true});
                    }
                  }}
                />
              </div>
            </div>
            {open[index] ? (
              <Fragment>
                <div className="mt-8 flex flex-grow flex-row justify-between">
                  <div className="flex w-3/5 flex-row">
                    <span className="w-3/5 text-center">Mini Duct ID</span>
                    <span className="w-2/5 text-center">Fibres</span>
                  </div>
                  <div className="flex flex-row gap-x-12">
                    <IoTrashOutline
                      size={24}
                      className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                    />
                    <span className="w-12" />
                  </div>
                </div>
                {data.slicecabl.map((dataa: any, index: number) => (
                  <div className="flex flex-row justify-between" key={index}>
                    <div className="mt-4 flex w-3/5 flex-row">
                      <div className=" flex w-3/5 justify-center">
                        <TextInput className="w-56" type="text" />
                      </div>
                      <div className=" flex w-2/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-12">
                      <IoTrashOutline
                        size={24}
                        className="cursor-pointer  text-red-500  active:text-red-300"
                      />
                      <span className="w-12" />
                    </div>
                  </div>
                ))}

                {/*duct section */}
                <div className="flex-grow-1 mt-8 flex flex-row justify-between">
                  <div className="flex w-full flex-row">
                    <span className="w-1/5 text-center">Start (km)</span>
                    <span className="w-1/5 text-center">Length (km)</span>
                    <span className="w-1/5 text-center">Offset (km)</span>
                    <span className="w-1/5 text-center">Loss</span>
                    <span className="w-1/5 text-center">Fiber Type</span>
                  </div>
                  <div className="flex flex-row gap-x-12">
                    <IoTrashOutline
                      size={24}
                      className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                    />
                    <span className="w-12" />
                  </div>
                </div>

                {[...new Array(index ? 1 : 4)].map((_, index) => (
                  <div
                    className="flex-grow-1 relative z-40 flex flex-row justify-between  pt-4"
                    key={index}>
                    <div className="flex w-full flex-row">
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <Select className="w-28" placeholder="select">
                          <option value="" className="hidden">
                            Select
                          </option>
                          <option value={undefined} className="hidden">
                            Select
                          </option>
                          <option value="NZ-DSF">NZ-DSF</option>
                          <option value="DSF">DSF</option>
                          <option value="SMF">SMF</option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-12">
                      <IoTrashOutline
                        size={24}
                        className="cursor-pointer  text-red-500  active:text-red-300"
                      />
                      <span className="w-12" />
                    </div>
                  </div>
                ))}
              </Fragment>
            ) : null}
          </div>
        );
      })}
       </div>
    </FormLayout>
  );
};

export default LinkCablesAndSegmentsPage;
