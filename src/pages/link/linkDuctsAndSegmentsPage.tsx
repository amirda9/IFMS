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
  const [parentduct, setParentduct] = useState<
    {id: number; slicecabl: number[]; Fibres: number[]}[]
  >([{id: 1, slicecabl: [1], Fibres: [1]}]);

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.page, y: ev.pageY});
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  console.log(mousePosition, 'mousePosition');

  const addcable = (index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentduct));
    beforadddata.push({
      id: Math.floor(Math.random() * 10004141000 + 1),
      slicecabl: [1],
      Fibres: [1],
    });
    setParentduct(beforadddata);
  };

  const addductsegment = (id: number, index: number) => {
    // let beforadddata = JSON.parse(JSON.stringify(parentduct));
    // let beforadddata2 = JSON.parse(JSON.stringify(parentduct));
    // let findcable = beforadddata.findIndex((data: any) => data.id == id);
    // const newParentduct = parentduct.map(data => {
    //   // ساخت یک کپی عمیق از آرایه parentduct
    //   if (data.id === id) {
    //     // اگر شناسه عنصر با شناسه مورد نظر برابر بود
    //     return {
    //       ...data,
    //       slicecabl: [
    //         ...data.slicecabl.slice(0, index + 1),
    //         Math.floor(Math.random() * 10004141000 + 1),
    //         ...data.slicecabl.slice(index + 1),
    //       ],
    //     }; // بازگشت یک شیء جدید با slicecabl جدید
    //   } else {
    //     return {...data}; // در غیر این صورت بازگشت همان شیء قبلی
    //   }
    // });

    let beforadddata = JSON.parse(JSON.stringify(parentduct));
    let findcable = beforadddata.findIndex((data: any) => data.id == id);

    beforadddata[findcable].slicecabl.splice(
      index + 1,
      0,
      Math.floor(Math.random() * 10004141000 + 1),
    );

    setParentduct(beforadddata);
  };
  console.log(parentduct, 'parentductparentduct');

  const addductFibre = (cableid: number, index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentduct));
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    beforadddata[findcable].Fibres.splice(
      index + 1,
      0,
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

  const deleteductsegment = (cableid: number, cabledataid: number) => {
    const beforadddata = [...parentduct];
    const findcable = beforadddata.findIndex(data => data.id == cableid);
    const find = beforadddata[findcable].slicecabl.findIndex(
      data => data == cabledataid,
    );
    beforadddata[findcable].slicecabl.splice(find, 1);
    setParentduct(beforadddata);
  };

  const deleteductfibre = (cableid: number, cabledataid: number) => {
    const beforadddata = [...parentduct];
    const findcable = beforadddata.findIndex(data => data.id == cableid);
    const find = beforadddata[findcable].Fibres.findIndex(
      data => data == cabledataid,
    );
    beforadddata[findcable].Fibres.splice(find, 1);
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
      <div className="relative   w-full pb-14">
        {mousePosition.y && mousePosition.y > 180 ? (
          <div
            style={{
              top: `${mousePosition.y - 180}px`,
            }}
            className={`absolute z-10 ml-[-30px] flex h-[30px] w-[calc(75%+20px)] flex-row items-center  justify-between`}>
            <button
              onClick={() => addcable(parentduct.length - 1)}
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
          {parentduct.map((data, index) => {
            const Chevron = open[index] ? IoChevronUp : IoChevronDown;
            return (
              <div className="relative z-50 w-full bg-b">
                <div
                  className={`absolute left-[-30px] top-0 z-40 ${
                    index == parentduct.length - 1
                      ? 'h-full'
                      : 'h-[calc(100%+30px)]'
                  }  w-[30px] bg-b`}></div>
                <div
                  className="relative z-40 mb-6 mt-0 w-9/12 rounded-md bg-gis p-4"
                  key={index}>
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
                        onClick={() => deletecable(data.id)}
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
                          <span className="w-3/5 text-center">
                            Mini Duct ID
                          </span>
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
                      {data.Fibres.map((dataa: any, index: number) => (
                        <div className="flex w-full flex-col" key={index}>
                          <div className="flex flex-row justify-between">
                            <div className="mt-4 flex w-3/5 flex-row">
                              <div className=" flex w-3/5 justify-center">
                                <TextInput className="w-56" type="text" />
                              </div>
                              <div className=" flex w-2/5 justify-center">
                                <TextInput className="w-28" type="number" />
                              </div>
                            </div>
                            <div className="mt-4 flex flex-row gap-x-12">
                              <IoTrashOutline
                                onClick={() => deleteductfibre(data.id, dataa)}
                                size={24}
                                className="cursor-pointer  text-red-500  active:text-red-300"
                              />
                              <span className="w-12" />
                            </div>
                          </div>
                          <Addbox
                            classname={
                              'ml-[calc(5%-56px)]  h-[30px] w-9/12  xl:ml-[calc(6%-56px)]'
                            }
                            onclick={() => addductFibre(data.id, index)}
                          />
                        </div>
                      ))}

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

                      {data.slicecabl.map(
                        (dataa: any, slicecablindex: number) => (
                          <>
                            <div
                              className="flex-grow-1 relative z-40 flex flex-row justify-between  pt-[2px]"
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
                                    <option
                                      value={undefined}
                                      className="hidden">
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
                                  onClick={() =>
                                    deleteductsegment(data.id, dataa.id)
                                  }
                                  size={24}
                                  className="cursor-pointer  text-red-500  active:text-red-300"
                                />
                                <span className="w-12" />
                              </div>
                            </div>
                            <Addbox
                              classname={
                                'ml-[calc(5%-56px)] w-[90%] h-[30px] xl:ml-[calc(6%-56px)]'
                              }
                              onclick={() =>
                                addductsegment(data.id, slicecablindex)
                              }
                            />
                          </>
                        ),
                      )}
                    </Fragment>
                  ) : null}
                </div>
                <Addbox
                  classname={
                    'left-[-30px] top-[-3px] absolute z-50 w-[calc(75%+30px)] mt-[-19px]  h-[20px] '
                  }
                  onclick={() => addcable(index)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </FormLayout>
  );
};

export default LinkCablesAndSegmentsPage;
