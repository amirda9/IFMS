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
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [parentcabl, setParentcable] = useState<
    {
      id: number;
      cableId: '';
      slicecabl: [
        {
          id: number;
          start: number;
          length: number;
          Offse: number;
          Loss: number;
          Fibertype: string;
        },
      ];
      miniduct: {id: number; miniductid: number; fibres: string}[];
      Cores: number;
    }[]
  >([]);


  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.page, y: ev.pageY});
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // -------------------------------------------------

  const setcores = (id: number, x: string) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].Cores = Number(x);
    setParentcable(beforadddata);
  };

  const setcableId = (id: number, x: string) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].cableId = x;
    setParentcable(beforadddata);
  };

  const setcableslicecabsegment = (
    id: number,
    slicecablId: number,
    x: string,
    name: string,
  ) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].slicecabl.findIndex(
      (data: any) => data.id == slicecablId,
    );
    beforadddata[findcable].slicecabl[findcableslicecabl][name] =
      name == 'Fibertype' ? x : Number(x);
    setParentcable(beforadddata);
  };

  const setcableminiduct = (
    id: number,
    miniductid: number,
    x: string,
    name: string,
  ) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].miniduct.findIndex(
      (data: any) => data.id == miniductid,
    );
    beforadddata[findcable].miniduct[findcableslicecabl][name] = Number(x);
    setParentcable(beforadddata);
  };
  const addcable = (index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    let newArray = beforadddata.map(function (item: any) {
      if (index != parentcabl.length && item.id >= index + 1) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });
    newArray.push({
      id: index + 1,
      cableId: '',
      slicecabl: [
        {id: 1, start: 0, length: 0, Offse: 0, Loss: 0, Fibertype: ''},
      ],
      miniduct: [{id: 1, miniductid: 0, fibres: ''}],
      Cores: 0,
    });
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    setParentcable(sortarray);
  };

  const addcabledata = (id: number, index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].slicecabl),
    );
    let newArray = beforslicecabl.map(function (item: any) {
      if (item.id > index + 1) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });
    newArray.push({
      id: index + 2,
      start: 0,
      length: 0,
      Offse: 0,
      Loss: 0,
      Fibertype: '',
    });
    console.log(newArray, 'newArray2');
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    console.log(sortarray, 'sortarray');
    beforadddata[findcable].slicecabl = sortarray;
    setParentcable(beforadddata);
  };

  const deletecable = (id: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);

    beforadddata.splice(findcable, 1);
    const data = [];
    for (let i = 0; i < beforadddata.length; i++) {
      data.push({
        id: i + 1,
        slicecabl: beforadddata[i].slicecabl,
        Cores: beforadddata[i].Cores,
        cableId: beforadddata[i].cableId,
        miniduct: beforadddata[i].miniduct,
      });
    }
    setParentcable(data);
  };

  const deletecabledata = (cableid: number, cabledataid: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].slicecabl),
    );
    beforslicecabl.splice(cabledataid - 1, 1);
    let data: {
      id: number;
      start: number;
      length: number;
      Offse: number;
      Loss: number;
      Fibertype: string;
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        start: beforslicecabl[i]?.start,
        length: beforslicecabl[i]?.length,
        Offse: beforslicecabl[i]?.Offse,
        Loss: beforslicecabl[i]?.Loss,
        Fibertype: beforslicecabl[i]?.Fibertype,
      });
    }

    beforadddata[findcable].slicecabl = data;

    setParentcable(beforadddata);
  };

  const deletefibredata = (cableid: number, fibreid: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].miniduct),
    );
    beforslicecabl.splice(fibreid - 1, 1);
    let data: {
      id: number;
      miniductid: number;
      fibres: number;
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        miniductid: beforslicecabl[i]?.miniductid,
        fibres: beforslicecabl[i]?.fibres,
      });
    }

    beforadddata[findcable].miniduct = data;

    setParentcable(beforadddata);
  };
  // -----------------------------------------------------

  const addductFibre = (id: number, index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].miniduct),
    );
    let newArray = beforslicecabl.map(function (item: any) {
      if (item.id > index + 1) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });
    newArray.push({
      id: index + 2,
      miniductid: 0,
      fibres: 'string',
    });
    console.log(newArray, 'newArray2');
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    console.log(sortarray, 'sortarray');
    beforadddata[findcable].miniduct = sortarray;
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
      <div className="relative   w-full pb-14">
        {parentcabl.length == 0 && mousePosition.y > 180 ? (
          <div
            style={{
              top: `${mousePosition?.y - 180}px`,
            }}
            className={`absolute z-10 ml-[-30px] flex h-[30px] w-[calc(75%+20px)] flex-row items-center  justify-between`}>
            <button
              onClick={() => addcable(0)}
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
          {parentcabl.map((data: any, index: number) => {
            const Chevron = open[index] ? IoChevronUp : IoChevronDown;
            return (
              <div className="relative z-50 w-full bg-b">
                <div
                  className={`absolute left-[-30px] top-0 z-40 ${
                    index == parentcabl.length - 1
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
                        <TextInput
                        type='text'
                          value={data.cableId}
                          onChange={e => setcableId(data.id, e.target.value)}
                          className="w-full"
                        />
                      </Description>
                      <Description
                        label="Number of Cores:"
                        labelClassName="w-fit pr-2"
                        className="flex-grow-0 pr-14">
                        <TextInput
                          value={data.Cores}
                          onChange={e => setcores(data.id, e.target.value)}
                          type="number"
                          className="w-28 "
                        />
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
                      {data.miniduct.map((dataa: any, index: number) => (
                        <div className="flex w-full flex-col" key={index}>
                          <div className="flex flex-row justify-between">
                            <div className="mt-4 flex w-3/5 flex-row">
                              <div className=" flex w-3/5 justify-center">
                                <TextInput
                                  value={dataa.miniductid}
                                  onChange={e =>
                                    setcableminiduct(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'miniductid',
                                    )
                                  }
                                  className="w-56"
                                  type="text"
                                />
                              </div>
                              <div className=" flex w-2/5 justify-center">
                                <TextInput
                                  value={dataa.fibres}
                                  onChange={e =>
                                    setcableminiduct(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'fibres',
                                    )
                                  }
                                  className="w-28"
                                  type="number"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex flex-row gap-x-12">
                              <IoTrashOutline
                                onClick={() =>
                                  deletefibredata(data.id, dataa.id)
                                }
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

                      {data.slicecabl.map((dataa: any, index: number) => (
                        <>
                          <div
                            className="flex-grow-1 relative z-40 flex flex-row justify-between  pt-[2px]"
                            key={index}>
                            <div className="flex w-full flex-row">
                              <div className=" flex w-1/5 justify-center">
                                <TextInput
                                  value={dataa.start}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'start',
                                    )
                                  }
                                  className="w-28"
                                  type="number"
                                />
                              </div>
                              <div className=" flex w-1/5 justify-center">
                                <TextInput
                                  value={dataa.length}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'length',
                                    )
                                  }
                                  className="w-28"
                                  type="number"
                                />
                              </div>
                              <div className=" flex w-1/5 justify-center">
                                <TextInput
                                  value={dataa.Offse}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'Offse',
                                    )
                                  }
                                  className="w-28"
                                  type="number"
                                />
                              </div>
                              <div className=" flex w-1/5 justify-center">
                                <TextInput
                                  value={data.Loss}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'Loss',
                                    )
                                  }
                                  className="w-28"
                                  type="number"
                                />
                              </div>
                              <div className=" flex w-1/5 justify-center">
                                <Select
                                  className="w-28"
                                  value={data.Loss}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'Fibertype',
                                    )
                                  }
                                  placeholder="select">
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
                                onClick={() =>
                                  deletecabledata(data.id, dataa.id)
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
                            onclick={() => addcabledata(data.id, index)}
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

                {parentcabl.length - 1 == index ? (
                  <Addbox
                    classname={
                      'left-[-30px] bottom-[-25px] absolute z-50 w-[calc(75%+30px)] mt-[-19px]  h-[20px] '
                    }
                    onclick={() => addcable(index + 1)}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </FormLayout>
  );
};

export default LinkCablesAndSegmentsPage;
