import React, {Fragment, useState} from 'react';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';
import {networkExplored} from '~/constant';
import Cookies from 'js-cookie';
import {FormLayout} from '~/layout';
import {BsPlusLg} from 'react-icons/bs';
import useHttpRequest from '~/hooks/useHttpRequest';
import {useParams} from 'react-router-dom';
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
  const networkId = Cookies.get(networkExplored);
  const params = useParams<{linkId: string}>();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  // const [parentcabl.ducts, setParentcable] = useState<
  //   {
  //     id: number;
  //     cableId: '';
  //     slicecabl: [
  //       {
  //         id: number;
  //         start: number;
  //         length: number;
  //         Offse: number;
  //         loss: number;
  //         Fibertype: string;
  //       },
  //     ];
  //     miniduct: {id: number; miniductid: number; number_of_fibers: string}[];
  //     number_of_cores: number;
  //   }[]
  // >([]);

  const [parentcabl, setParentcable] = useState<{
    cables:
      | {
          id: number;
          cableId: string;
          number_of_cores: number;
          segments: [
            {
              id: number;
              start: number;
              length: number;
              offset: number;
              loss: number;
              fiber_type: string;
            },
          ];
        }[]
      | [];
    ducts:
      | {
          id: number;
          cableId: string;
          number_of_cores: number;
          mini_ducts: [
            {
              id: string;
              number_of_fibers: number;
            },
          ];
          segments: [
            {
              start: number;
              length: number;
              offset: number;
              loss: number;
              fiber_type: string;
            },
          ];
        }[]
      | [];
  }>();

  console.log(parentcabl, 'parentcabloo');

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
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].number_of_cores = Number(x);
    setParentcable({cables: [], ducts: beforadddata});
  };

  const setcableId = (id: number, x: string) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].cableId = x;
    setParentcable({cables: [], ducts: beforadddata});
  };

  const setcableslicecabsegment = (
    id: number,
    slicecablId: number,
    x: string,
    name: string,
  ) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].segments.findIndex(
      (data: any) => data.id == slicecablId,
    );
    beforadddata[findcable].segments[findcableslicecabl][name] =
      name == 'fiber_type' ? x : Number(x);
    setParentcable({cables: [], ducts: beforadddata});
  };

  const setcableminiduct = (
    id: number,
    miniductid: string,
    x: string,
    name: string,
  ) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].mini_ducts.findIndex(
      (data: any) => data.id == miniductid,
    );
    beforadddata[findcable].mini_ducts[findcableslicecabl][name] =
      name == 'miniductid' ? x : Number(x);
    setParentcable({cables: [], ducts: beforadddata});
  };

  const addcable = (index: number) => {
    let beforadddata;
    if (parentcabl?.ducts) {
      beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    } else {
      beforadddata = [];
    }

    let newArray = beforadddata.map(function (item: any) {
      if (index != parentcabl?.ducts.length && item.id >= index + 1) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });
    newArray.push({
      id: index + 1,
      cableId: '',
      segments: [
        {id: 1, start: 0, length: 0, Offse: 0, loss: 0, fiber_type: ''},
      ],
      mini_ducts: [{id: 1, miniductid: 0, number_of_fibers: ''}],
      number_of_cores: 0,
    });
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    setParentcable({cables: [], ducts: sortarray});
  };

  const addcabledata = (id: number, index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].segments),
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
      offse: 0,
      loss: 0,
      fiber_type: '',
    });
    console.log(newArray, 'newArray2');
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    console.log(sortarray, 'sortarray');
    beforadddata[findcable].segments = sortarray;
    setParentcable({cables: [], ducts: beforadddata});
  };

  const deletecable = (id: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == id);

    beforadddata.splice(findcable, 1);
    const data: any = [];
    for (let i = 0; i < beforadddata.length; i++) {
      data.push({
        id: i + 1,
        segments: beforadddata[i].segments,
        number_of_cores: beforadddata[i].number_of_cores,
        cableId: beforadddata[i].cableId,
        miniduct: beforadddata[i].miniduct,
      });
    }
    setParentcable({cables: [], ducts: data});
  };

  const deletecabledata = (cableid: number, cabledataid: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].segments),
    );
    beforslicecabl.splice(cabledataid - 1, 1);
    let data: {
      id: number;
      start: number;
      length: number;
      offse: number;
      loss: number;
      fiber_type: string;
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        start: beforslicecabl[i]?.start,
        length: beforslicecabl[i]?.length,
        offse: beforslicecabl[i]?.Offse,
        loss: beforslicecabl[i]?.loss,
        fiber_type: beforslicecabl[i]?.fiber_type,
      });
    }

    beforadddata[findcable].segments = data;

    setParentcable({cables: [], ducts: beforadddata});
  };

  const deletefibredata = (cableid: number, fibreid: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = JSON.parse(
      JSON.stringify(beforadddata[findcable].miniduct),
    );
    beforslicecabl.splice(fibreid - 1, 1);
    let data: {
      id: number;
      miniductid: number;
      number_of_fibers: number;
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        miniductid: beforslicecabl[i]?.miniductid,
        number_of_fibers: beforslicecabl[i]?.number_of_fibers,
      });
    }

    beforadddata[findcable].miniduct = data;

    setParentcable(beforadddata);
  };
  // -----------------------------------------------------

  const addductFibre = (id: number, index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(parentcabl?.ducts));
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
      number_of_fibers: 'string',
    });
    console.log(newArray, 'newArray2');
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    console.log(sortarray, 'sortarray');
    beforadddata[findcable].miniduct = sortarray;
    setParentcable({cables: [], ducts: beforadddata});
  };

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      stations: state.http.allStations,
      // update: state.http.linkUpdate,
    }),
    initialRequests: request => {
      request('linkDetail', {params: {link_id: params.linkId!}});
      if (networkId) {
        request('allStations', undefined);
      }
    },

    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.update?.httpRequestStatus === 'loading' &&
    //     state.update!.httpRequestStatus === 'success'
    //   ) {
    //     initialRequests(request);
    //   }
    // },
  });

  const savecables = () => {
    let dataa: any = [];
    let newcable: any = [];
    let beforadddata = JSON.parse(JSON.stringify(parentcabl));
    for (let i = 0; i < beforadddata?.ducts?.length!; i++) {
      newcable.push({
        id: beforadddata.ducts[i].cableId,
        number_of_cores: beforadddata.ducts[i].number_of_cores,
        segments: beforadddata?.ducts[i].segments,
        mini_ducts: beforadddata?.ducts[i].mini_ducts,
      });

      for (let j = 0; j < beforadddata?.cables[i].segments.length; j++) {
        delete beforadddata?.cables[i].segments[j].id;
      }
    }
    for (let k = 0; k < newcable.length; k++) {
      for (let j = 0; j < newcable[k].mini_ducts.length; j++) {
        newcable[k].mini_ducts[j].id = newcable[k].mini_ducts[j].miniductid;
        delete newcable[k].mini_ducts[j].miniductid;
      }
    }
    console.log(newcable, 'newcable');

    request('linkupdatecables', {
      params: {link_id: params.linkId!},
      data: {cables: beforadddata.cables, ducts: newcable},
    });
  };

  console.log(state.stations, 'stationsstationsstations');
  const buttons = (
    <>
      <SimpleBtn type="submit">Save</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    // <FormLayout buttons={buttons}>
    <div className="relative  min-h-[calc(100%-80px)]  w-full pb-14">
      {parentcabl?.ducts || mousePosition.y < 16 ? null : (
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
      )}

      <div className="relative z-50 w-full bg-b">
        {parentcabl?.ducts?.map((data: any, index: number) => {
          const Chevron = open[index] ? IoChevronUp : IoChevronDown;
          return (
            <div className="relative z-50 w-full bg-b">
              <div
                className={`absolute left-[-30px] top-0 z-40 ${
                  index == parentcabl?.ducts.length - 1
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
                        type="text"
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
                        value={data.number_of_cores}
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
                        <span className="w-3/5 text-center">Mini Duct ID</span>
                        <span className="w-2/5 text-center">
                          number_of_fibers
                        </span>
                      </div>
                      <div className="flex flex-row gap-x-12">
                        <IoTrashOutline
                          size={24}
                          className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                        />
                        <span className="w-12" />
                      </div>
                    </div>
                    {data?.mini_ducts?.map((dataa: any, index: number) => (
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
                                value={dataa.number_of_fibers}
                                onChange={e =>
                                  setcableminiduct(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'number_of_fibers',
                                  )
                                }
                                className="w-28"
                                type="number"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex flex-row gap-x-12">
                            <IoTrashOutline
                              onClick={() => deletefibredata(data.id, dataa.id)}
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
                        <span className="w-1/5 text-center">loss</span>
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

                    {data.segments.map((dataa: any, index: number) => (
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
                                value={data.loss}
                                onChange={e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'loss',
                                  )
                                }
                                className="w-28"
                                type="number"
                              />
                            </div>
                            <div className=" flex w-1/5 justify-center">
                              <Select
                                className="w-28"
                                value={data.loss}
                                onChange={e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'fiber_type',
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
                              onClick={() => deletecabledata(data.id, dataa.id)}
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

              {parentcabl.ducts.length - 1 == index ? (
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
      <div className="absolute bottom-0 right-0 mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={() => savecables()}>Save</SimpleBtn>

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
    // </FormLayout>
  );
};

export default LinkCablesAndSegmentsPage;
