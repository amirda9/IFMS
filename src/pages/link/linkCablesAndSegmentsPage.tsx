import React, {Fragment, useState} from 'react';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import {BsPlusLg} from 'react-icons/bs';
type Iprops = {
  classname: string;
  onclick: Function;
};
const Addbox = ({classname, onclick}: Iprops) => {
  return (
    <div
      className={`flex flex-row items-center justify-between opacity-0 hover:opacity-100 ${classname}`}>
      <button
        onClick={() => onclick()}
        className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
        <BsPlusLg color="white" size={35} className="ml-[-2.5px] mt-[-2.5px]" />
      </button>
      <div className="w-full  border-t-[2px] border-dashed  border-[#32C65D]"></div>
    </div>
  );
};
const LinkCablesAndSegmentsPage = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = React.useState({x: null, y: null});
  const [parentcabl, setParentcable] = useState<
    {id: number; slicecabl: number[]}[]
  >([{id: 1, slicecabl: [1]}]);
  console.log(parentcabl, 'parentcablparentcabl');

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const addcable = (index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    beforadddata.push({
      id: Math.floor(Math.random() * 10004141000 + 1),
      slicecabl: [1],
      Fibres: [1],
    });
    setParentcable(beforadddata);
  };

  const addcabledata = (id: number) => {
    const beforadddata = [...parentcabl];
    const findcable = beforadddata.findIndex(data => data.id == id);
    console.log(findcable, 'findcable');

    beforadddata[findcable].slicecabl.push(
      Math.floor(Math.random() * 10004141000 + 1),
    );

    setParentcable(beforadddata);
  };

  const deletecable = (id: number) => {
    const beforadddata = [...parentcabl];
    const findcable = beforadddata.findIndex(data => data.id == id);
    beforadddata.splice(findcable, 1);
    setParentcable(beforadddata);
  };

  const deletecabledata = (cableid: number, cabledataid: number) => {
    const beforadddata = [...parentcabl];
    const findcable = beforadddata.findIndex(data => data.id == cableid);
    const find = beforadddata[findcable].slicecabl.findIndex(
      data => data == cabledataid,
    );
    beforadddata[findcable].slicecabl.splice(find, 1);
    setParentcable(beforadddata);
  };
  const buttons = (
    <>
      <SimpleBtn type="submit">Save</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  return (
    <FormLayout buttons={buttons}>
      <div className="relative w-full">
        {mousePosition.y && mousePosition.y > 180 ? (
          <div
            style={{
              top: `${parentcabl.length == 0 ?mousePosition.y - 180: mousePosition.y - 210}px`,
            }}
            className={`absolute z-10 ml-[-30px] flex h-[30px] w-[calc(75%+20px)] flex-row items-center  justify-between`}>
            <button
              onClick={() => addcable(parentcabl.length - 1)}
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

        <div className="relative z-50 w-full bg-b">
          {parentcabl.map((data: any, index: number) => (
            <div className="relative z-50 w-full bg-b">
            <div
              style={{zIndex: 20}}
              className="relative z-40 my-8 w-9/12  rounded-md bg-gis p-4"
              key={index}>
              <div
                className={`absolute left-[-30px] top-0 z-40 ${
                  index == parentcabl.length - 1
                    ? 'h-full'
                    : 'h-[calc(100%+32px)]'
                }  w-[30px] bg-b`}></div>

              <div className="z-40 flex flex-row items-center justify-between">
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
                    onClick={() => deletecable(data.id)}
                    size={24}
                    className="cursor-pointer  text-red-500 active:text-red-300"
                  />
                  {open[index] ? (
                    <IoChevronUp
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
                  ) : (
                    <IoChevronDown
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
                  )}
                </div>
              </div>
              {open[index] ? (
                <Fragment>
                  {/* <div
                  className={`flex  h-[30px] flex-row items-center justify-between opacity-0 hover:opacity-100`}>
                  <button
                    onClick={() => addcabledata(data.id)}
                    className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
                    <BsPlusLg
                      color="white"
                      size={35}
                      className="ml-[-2.5px] mt-[-2.5px]"
                    />
                  </button>
                  <div className="w-full  border-t-[2px] border-dashed  border-[#32C65D]"></div>
                </div> */}
                  <div className="flex-grow-1 mt-8 flex flex-row justify-between ">
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
                  {data.slicecabl.map((dataa: any, index: number) => (
                    <>
                      <div
                        className="flex-grow-1 flex flex-row justify-between "
                        key={index}>
                        <div className="flex w-full flex-row">
                          <div className="flex w-1/5 justify-center">
                            <TextInput className="w-28" type="number" />
                          </div>
                          <div className="flex w-1/5 justify-center">
                            <TextInput className="w-28" type="number" />
                          </div>
                          <div className="flex w-1/5 justify-center">
                            <TextInput className="w-28" type="number" />
                          </div>
                          <div className="flex w-1/5 justify-center">
                            <TextInput className="w-28" type="number" />
                          </div>
                          <div className="flex w-1/5 justify-center">
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
                            onClick={() => deletecabledata(data.id, dataa.id)}
                            size={24}
                            // text-red-500
                            className="cursor-pointer  text-red-500   active:text-red-300"
                          />
                          <span className="w-12" />
                        </div>
                      </div>

                      <Addbox
                        classname={
                          'ml-[calc(5%-56px)]  h-[30px] xl:ml-[calc(6%-56px)]'
                        }
                        onclick={() => addcabledata(data.id)}
                      />
                    </>
                  ))}
                </Fragment>
              ) : null}
            </div>
       
          <Addbox
          classname={
            'left-[-30px] top-[-5px] absolute z-50 w-[calc(75%+30px)] mt-[-19px]  h-[20px] '
          }
          onclick={() => addcable(index)}
        />
       
          
           </div>
          ))}
            
        </div>
     
      </div>
    </FormLayout>
  );
};

export default LinkCablesAndSegmentsPage;
