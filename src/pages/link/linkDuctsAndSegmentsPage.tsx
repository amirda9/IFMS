import React, {Fragment, useEffect, useState} from 'react';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';
import {BASE_URL} from '~/constant';
import {BsPlusLg} from 'react-icons/bs';
import useHttpRequest from '~/hooks/useHttpRequest';
import {useParams} from 'react-router-dom';

import { useSelector } from 'react-redux';
import { deepcopy } from '~/util';
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
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');

  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
  };

  useEffect(() => {
    getrole();
  }, []);
  const params = useParams<{linkId: string}>();
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const networkId =params.linkId!.split("_")[2];

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});

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
          mini_ducts: [
            {
              miniductid: number;
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
              fixId:boolean
            },
          ];
        }[]
      | [];
  }>();

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

  const setcableId = (id: number, x: string) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].cableId = x;
    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };

  const setcableslicecabsegment = (
    id: number,
    slicecablId: number,
    x: string,
    name: string,
  ) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].segments.findIndex(
      (data: any) => data.id == slicecablId,
    );
    beforadddata[findcable].segments[findcableslicecabl][name] =
      name == 'fiber_type' ? x : Number(x);
      if (name == 'start') {

        beforadddata[findcable].segments[(findcableslicecabl - 1)].length=beforadddata[findcable].segments[(findcableslicecabl - 1)].length-Number(x);
  
      }
    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };

  const setcableminiduct = (
    id: number,
    miniductid: string,
    x: string,
    name: string,
  ) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    const findcableslicecabl = beforadddata[findcable].mini_ducts.findIndex(
      (data: any) => data.id == miniductid,
    );
    beforadddata[findcable].mini_ducts[findcableslicecabl][name] =
      name == 'miniductid' ? x : Number(x);
    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };

  const addcable = (index: number) => {
    let beforadddata;
    if (parentcabl?.ducts) {
      beforadddata = deepcopy(parentcabl?.ducts);
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
        {id: 1, start: 0, length: 0, offset: 0, loss: 0, fiber_type: ''},
      ],
      mini_ducts: [{miniductid:0,id:0,number_of_fibers:0}]
      // number_of_cores: 0,
    });
    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    setParentcable({cables:parentcabl?.cables || [], ducts: sortarray});
  };

  const addcabledata = (id: number, index: number) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    let beforslicecabl =deepcopy(beforadddata[findcable].segments);
    
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
      offset: 0,
      loss: 0,
      fiber_type: '',
    });

    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
;
    beforadddata[findcable].segments = sortarray;
    setParentcable({cables: [], ducts: beforadddata});
  };

  const deletecable = (id: number) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);

    beforadddata.splice(findcable, 1);
    const data: any = [];
    for (let i = 0; i < beforadddata.length; i++) {
      data.push({
        id: i + 1,
        segments: beforadddata[i].segments,
        // number_of_cores: beforadddata[i].number_of_cores,
        cableId: beforadddata[i].cableId,
        miniduct: beforadddata[i].miniduct,
      });
    }
    setParentcable({cables:parentcabl?.cables || [], ducts: data});
  };

  const deletecabledata = (cableid: number, cabledataid: number) => {
    let beforadddata = deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = deepcopy(beforadddata[findcable].segments);

    beforslicecabl.splice(cabledataid - 1, 1);
    let data: {
      id: number;
      start: number;
      length: number;
      offset: number;
      loss: number;
      fiber_type: string;
      fixId:boolean
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        start: beforslicecabl[i]?.start,
        length: beforslicecabl[i]?.length,
        offset: beforslicecabl[i]?.offset,
        loss: beforslicecabl[i]?.loss,
        fiber_type: beforslicecabl[i]?.fiber_type,
        fixId:beforslicecabl[i]?.fixId || false
      });
    }

    beforadddata[findcable].segments = data;

    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };

  const deletefibredata = (cableid: number, fibreid: number) => {
    let beforadddata =deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = beforadddata[findcable].mini_ducts;
    let filterbeforslicecabl=beforadddata[findcable].mini_ducts.filter((data:any)=> data.id != fibreid)
    let data: {
      id: number;
      miniductid: number;
      number_of_fibers: number;
    }[] = [];

    for (let i = 0; i < filterbeforslicecabl.length; i++) {
      data.push({
        id: i + 1,
        miniductid: filterbeforslicecabl[i]?.miniductid,
        number_of_fibers: filterbeforslicecabl[i]?.number_of_fibers,
      });
    }

    beforadddata[findcable].mini_ducts = data;

    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };
  // -----------------------------------------------------

  const addductFibre = (id: number, index: number) => {
    let beforadddata =deepcopy(parentcabl?.ducts);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    let beforslicecabl =deepcopy(beforadddata[findcable].mini_ducts)
    
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

    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });

    beforadddata[findcable].mini_ducts = sortarray;
    setParentcable({cables:parentcabl?.cables || [], ducts: beforadddata});
  };

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      stations: state.http.allStations,
       update: state.http.linkupdatecables,
    }),
    initialRequests: request => {
      request('linkDetail', {params: {link_id: params.linkId!.split("_")[0]}});
      if (networkId) {
        request('allStations', undefined);
      }
    },

    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('linkDetail', {params: {link_id: params.linkId!.split("_")[0]}});
      }
    },
  });

  const savecables = () => {
    let dataa: any = [];
    let newcable: any = [];
    let beforadddata = deepcopy(parentcabl);
    for (let i = 0; i < beforadddata?.ducts?.length!; i++) {
      newcable.push({
        id: beforadddata.ducts[i].cableId,
        segments: beforadddata?.ducts[i].segments,
        mini_ducts: beforadddata?.ducts[i].mini_ducts,
      });
    }

    for (let k = 0; k < newcable.length; k++) {
      for (let j = 0; j < newcable[k].mini_ducts.length; j++) {
        newcable[k].mini_ducts[j].id = newcable[k].mini_ducts[j].miniductid;
        delete newcable[k].mini_ducts[j].miniductid;
      }
      for (let t = 0; t < newcable[k].segments.length; t++) {
        delete newcable[k].segments[t].id;
      }
    }
    request('linkupdatecables', {
      params: {link_id: params.linkId!.split("_")[0]},
      data: {cables: beforadddata.cables, ducts: newcable},
    });
  };

  useEffect(() => {
    const Cables = state?.detail?.data?.data?.cables || [];
    const Ducts = state?.detail?.data?.data?.ducts || [];

    let allcables = deepcopy(Cables);

    for (let r = 0; r < Cables?.length; r++) {
      allcables[r].cableId = allcables[r]?.id;
      allcables[r].id = Number(r) + 1;
      allcables[r].number_of_cores = allcables[r]?.number_of_cores;
      for (let s = 0; s < allcables[r]?.segments?.length; s++) {
        allcables[r].segments[s] = {
          ...allcables[r]?.segments[s],
          id: Number(s),
        };
      }
    }

    let allducts =deepcopy(Ducts);
    for (let i = 0; i < Ducts?.length; i++) {
      allducts[i].cableId = allducts[i]?.id;
      allducts[i].id = Number(i) + 1;
      for (let j = 0; j < allducts[i]?.mini_ducts?.length; j++) {
        allducts[i].mini_ducts[j] = {
          ...allducts[i]?.mini_ducts[j],
   
          miniductid:allducts[i]?.mini_ducts[j].id,
          id: Number(j),
        };
      }
      for (let j = 0; j < allducts[i]?.segments?.length; j++) {
        allducts[i].segments[j] = {...allducts[i]?.segments[j], id: Number(j),fixId:true};
      }
    }
    setParentcable({cables: allcables, ducts: allducts});
  }, [state?.detail]);

  return (

    <div className="relative  min-h-[calc(100vh-220px)]  w-full pb-14">
      {(parentcabl?.ducts && parentcabl?.ducts?.length > 0 ) ||
      mousePosition.y < 160 ? null : (
        <div
          style={{
            top: `${mousePosition?.y - 180}px`,
          }}
          className={`absolute z-10 ml-[-30px] flex h-[30px] w-full flex-row items-center  justify-between`}>
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
                className="relative z-40 mb-6 mt-0 w-full rounded-md bg-gis p-4"
                key={index}>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row">
                    <span className="w-14"> {index + 1}</span>
                    <Description
                      label="ID:"
                      labelClassName="w-fit pr-2"
                      className="ml-[-30px] flex-grow-0 pr-14">
                      <TextInput
                        type="text"
                        value={data.cableId}
                        onChange={e => setcableId(data.id, e.target.value)}
                        className="w-full "
                      />
                    </Description>
                    <Description
                      label="Helix Factor:"
                      labelClassName="w-fit pr-2"
                      className="flex-grow-0 pr-14">
                      <TextInput
                        value={data.number_of_cores}
                        onChange={e =>{}}
                        type="number"
                        className="w-28 "
                      />
                    </Description>
                    <div className="flex flex-row items-center">
                    <IoTrashOutline
                      onClick={() => deletecable(data.id)}
                      size={24}
                      className="cursor-pointer  text-red-500 active:text-red-300"
                    />
                   
                  </div>
                  </div>
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

                {open[index] ? (
                  <Fragment>
                    <div className="mt-8 flex flex-grow flex-row justify-between">
                      <div className="flex w-3/6 flex-row">
                        <span className="w-3/5 text-center">Mini Duct ID</span>
                        <span className="w-2/5 mr-[20px] text-center">
                        Fibers
                        </span>
                      </div>
                      <div className="flex flex-row">
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
                          <div className="mt-4 flex w-3/6 flex-row">
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
                            <IoTrashOutline
                              onClick={() => deletefibredata(data.id, dataa.id)}
                              size={26}
                              className="cursor-pointer  text-red-500  active:text-red-300"
                            />
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

                    {/* <div className="flex-grow-1 mt-8 flex flex-row justify-between">
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
                                  value={index == 0?0:dataa.start == 0?data.segments[index-1].length+0.001:dataa.start}
                                onChange={ index== 0?()=>{}:e =>
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
                                onChange={dataa.fixId?()=>{}:(e) =>
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
                                value={dataa.offset}
                                onChange={e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'offset',
                                  )
                                }
                                className="w-28"
                                type="number"
                              />
                            </div>
                            <div className=" flex w-1/5 justify-center">
                              <TextInput
                                value={dataa.loss}
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
                                {dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
                                </option>
                                <option value={undefined} className="hidden">
                                {dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
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
                    ))} */}
                       {data?.segments?.map((dataa: any, index: number) => {
            

                      return (
                        <div className="w-full bg-[#ACD3DE] p-4 mb-[15px] rounded-[10px]" key={index}>
                          <div
                            className="flex relative flex-col justify-between pr-[40px]"
                            key={index}>
                                <div className="flex flex-row gap-x-12 absolute top-[5px] right-[10px]">
                              <IoTrashOutline
                                onClick={() =>
                                  deletecabledata(data.id, dataa.id)
                                }
                                size={24}
                                className="cursor-pointer  text-red-500   active:text-red-300"
                              />
                           
                            </div>
                            <div className="flex w-full flex-row justify-between">
                            <div className="flex w-[65%] flex-row justify-between ">
                            <span className="mr-[5px] text-left">Connection Type</span>
                                <TextInput
                                  defaultValue={10}
                                  value={
                                    index == 0
                                      ? 0
                                      : dataa.start == 0
                                      ? data.segments[index - 1].length
                                      : dataa.start
                                  }
                                  onChange={
                                    index == 0
                                      ? () => {}
                                      : e =>
                                          setcableslicecabsegment(
                                            data.id,
                                            dataa.id,
                                            e.target.value,
                                            'start',
                                          )
                                  }
                                  className="w-[80%]"
                                  type="number"
                                />
                            </div>
                              <div className="flex w-[30%]   box-border flex-row justify-between ">
                                <span className="mr-[5px] w-[100px]  text-left">
                                  Connection Loss (dB)
                                </span>
                                <TextInput
                                  defaultValue={10}
                                  value={
                                    index == 0
                                      ? 0
                                      : dataa.start == 0
                                      ? data.segments[index - 1].length
                                      : dataa.start
                                  }
                                  onChange={
                                    index == 0
                                      ? () => {}
                                      : e =>
                                          setcableslicecabsegment(
                                            data.id,
                                            dataa.id,
                                            e.target.value,
                                            'start',
                                          )
                                  }
                                  className="w-[60%]"
                                  type="number"
                                />
                              </div>
                            </div>
                            <div className="flex w-full flex-row justify-between">
                              <div className="flex w-[30%] flex-row justify-between ">
                                <span className="mr-[5px]  text-left">
                                  Start (km)
                                </span>
                                <TextInput
                                  value={index == 0?0:dataa.start == 0?data.segments[index-1].length+0.001:dataa.start}
                                onChange={ index== 0?()=>{}:e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'start',
                                  )
                                }
                                className="w-[60%]"
                                type="number"
                              />
                              </div>
                              <div className="flex w-[30%] flex-row justify-between">
                                <span className="mr-[5px] text-left ">
                                  Length (km)
                                </span>
                                <TextInput
                                value={dataa.length}
                                onChange={dataa.fixId?()=>{}:(e) =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'length',
                                  )
                                }
                                className="w-[60%]"
                                type="number"
                              />
                              </div>
                              <div className="flex w-[30%] justify-between">
                                <span className="mr-[5px]  text-left">
                                  Offset (km)
                                </span>
                                <TextInput
                                value={dataa.offset}
                                onChange={e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'offset',
                                  )
                                }
                                className="w-[60%]"
                                type="number"
                              />
                              </div>
                            </div>
                            <div className="mt-2 flex w-full flex-row justify-between">
                              <div className="flex w-[30%] justify-between">
                                <span className="mr-[5px]  text-left">
                                  Fiber Type
                                </span>
                                <Select
                               className="w-[60%]"
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
                                {dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
                                </option>
                                <option value={undefined} className="hidden">
                                {dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
                                </option>
                                <option value="NZ-DSF">NZ-DSF</option>
                                <option value="DSF">DSF</option>
                                <option value="SMF">SMF</option>
                              </Select>
                              </div>

                              <div className="flex w-[30%] justify-between">
                                <span className="mr-[5px]  text-left">
                                  Loss
                                </span>
                                <TextInput
                                value={dataa.loss}
                                onChange={e =>
                                  setcableslicecabsegment(
                                    data.id,
                                    dataa.id,
                                    e.target.value,
                                    'loss',
                                  )
                                }
                                className="w-[60%]"
                                type="number"
                              />
                              </div>
                              <div className="flex w-[30%] justify-between"></div>
                            </div>
                          
                          </div>

                          <Addbox
                            classname={
                              'ml-[calc(5%-56px)] absolute bottom-[0px] left-0 w-[calc(100%-20px)]  h-[30px] xl:ml-[calc(6%-56px)]'
                            }
                            onclick={() => addcabledata(data.id, index)}
                          />
                        </div>
                      );
                    })}
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
       {userrole == 'superuser' || state?.detail?.data?.access?.access == 'ADMIN' || networkDetail?.data?.access?.access == 'ADMIN' ?
        <SimpleBtn className='z-50' onClick={() => savecables()}>Save</SimpleBtn>
      
      :
      null
      }
      

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>

  );
};

export default LinkCablesAndSegmentsPage;
