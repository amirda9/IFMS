import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';
import {BASE_URL} from '~/constant';
import {BsPlusLg} from 'react-icons/bs';
import useHttpRequest, {Request} from '~/hooks/useHttpRequest';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {deepcopy} from '~/util';
import {useAppSelector} from '~/hooks';
import {UserRole} from '~/constant/users';

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
// *******************************
const LinkCablesAndSegmentsPage = () => {
  const params = useParams<{linkId: string}>();
  const login = localStorage.getItem('login');
  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const networkId = params.linkId!.split('_')[2];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});

  const [parentcabl, setParentcable] = useState<{
    cables: {
      id: number;
      cableId: string;
      number_of_cores: number;
      helix_factor: number;
      segments: [
        {
          connection_type: string;
          connection_loss: number;
          id: number;
          start: number;
          length: number;
          offset: number;
          loss: number;
          fiber_type: string;
          fixID?: Boolean;
        },
      ];
    }[];
    ducts:
      | {
          id: string;
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

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      stations: state.http.allStations,
      update: state.http.linkupdatecables,
    }),
    initialRequests: request => {
      request('linkDetail', {params: {link_id: params.linkId!.split('_')[0]}});
      if (networkId) {
        request('allStations', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('linkDetail', {
          params: {link_id: params.linkId!.split('_')[0]},
        });
      }
    },
  });


  // const findlinkdetail=state.detail?.data?.versions?.find(
  //   (version: any) =>
  //     version.id === state.detail?.data?.current_version?.id,
  // )

  const findlinkdetail = useMemo(
    () =>
      state.detail?.data?.versions?.find(
        (version: any) =>
          version.id === state.detail?.data?.current_version?.id,
      ),
    [state?.detail],
  );

  useEffect(() => {
    const Cables = state?.detail?.data?.data?.cables || [];
    const Ducts = state?.detail?.data?.data?.ducts || [];
    let allcables = deepcopy(Cables);

    for (let i = 0; i < Cables?.length; i++) {
      allcables[i].cableId = allcables[i]?.id;
      allcables[i].id = Number(i) + 1;
      allcables[i].number_of_cores = allcables[i]?.number_of_cores;
      allcables[i].helix_factor = allcables[i]?.helix_factor;

      for (let j = 0; j < allcables[i]?.segments?.length; j++) {
        allcables[i].segments[j] = {
          ...allcables[i]?.segments[j],
          id: Number(j) + 1,
          fixId: true,
        };
      }
    }
    setParentcable({cables: allcables, ducts: Ducts});
  }, [state?.detail]);

  const savecables = () => {
    let newcable: any = [];
    let beforadddata = deepcopy(parentcabl);
    for (let i = 0; i < beforadddata?.cables?.length!; i++) {
      newcable.push({
        id: beforadddata.cables[i].cableId,
        number_of_cores: beforadddata.cables[i].number_of_cores,
        helix_factor: beforadddata.cables[i].helix_factor,
        segments: beforadddata?.cables[i]?.segments,
      });
      for (let j = 0; j < beforadddata?.ducts[i]?.segments?.length; j++) {
        delete beforadddata?.ducts[i].segments[j].id;
        if (beforadddata?.ducts[i].segments[j].fixId) {
          delete beforadddata?.ducts[i].segments[j].fixId;
        }
      }
    }

    request('linkupdatecables', {
      params: {link_id: params.linkId!.split('_')[0]},
      data: {cables: newcable, ducts: beforadddata.ducts},
    });
  };

  const finddataindex = (x: string) => {
    let alldatabasecabel = state?.detail?.data?.data?.cables?.findIndex(
      data => data.id == x,
    );

    if (alldatabasecabel && alldatabasecabel > -1) {
      return true;
    } else {
      return false;
    }
  };

  // **********************************************************
  let timer: string | number | NodeJS.Timeout | undefined;

  const setcores = (id: number, x: string) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].number_of_cores = Number(x);
    setParentcable({cables: beforadddata, ducts: []});
  };

  const sethelixfactor = (id: number, x: string) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].helix_factor = Number(x);
    setParentcable({cables: beforadddata, ducts: []});
  };

  const setcableId = (id: number, x: string) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].cableId = x;
    setParentcable({cables: beforadddata, ducts: []});
  };

  const setcableslicecabsegment = (
    id: number,
    slicecablId: number,
    x: string,
    name: string,
    index: number,
  ) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    let beforadddata2 = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findcable].segments[index][name] =
      name == 'fiber_type' || name == 'connection_type' ? x : Number(x);
    if (name == 'start') {
      beforadddata[findcable].segments[index - 1].length =
        beforadddata[findcable].segments[index].start -
        beforadddata[findcable].segments[index - 1].start;
      if (index == beforadddata[findcable].segments.length - 1) {
        beforadddata[findcable].segments[index].length =
          findlinkdetail?.length! -
            beforadddata[findcable].segments[index].start || 0;
      } else {
        beforadddata[findcable].segments[index].length =
          beforadddata[findcable].segments[index + 1].start -
            beforadddata[findcable].segments[index].start || 0;
      }
    }
    setParentcable({cables: beforadddata, ducts: []});
  };

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
    let beforadddata;
    if (!parentcabl?.cables) {
      beforadddata = [];
    } else {
      beforadddata = deepcopy(parentcabl?.cables);
    }

    let newArray = beforadddata.map(function (item: any) {
      if (index != parentcabl?.cables.length && item.id >= index + 1) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });

    newArray.push({
      id: index + 1,
      cableId: '',
      helix_factor: 1,
      segments: [
        {
          connection_type: 'connector',
          connection_loss: 1,
          id: 1,
          start: 0,
          length: findlinkdetail?.length,
          offset: 0,
          loss: 0,
          fiber_type: '',
        },
      ],
      number_of_cores: 0,
    });

    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });

    setParentcable({cables: sortarray, ducts: parentcabl?.ducts || []});
  };

  const addcabledata = (id: number, index: number) => {
    const Length = parentcabl?.cables?.length || 0;
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);
    if (
      index == beforadddata[findcable].segments.length - 1 &&
      beforadddata[findcable].segments[
        beforadddata[findcable].segments.length - 1
      ].start == findlinkdetail?.length
    ) {
    } else {
      let beforslicecabl = deepcopy(beforadddata[findcable].segments);
      let newArray = beforslicecabl.map(function (item: any) {
        if (item.id > index + 1) {
          item.id = item.id + 1;
          return item;
        } else {
          return item;
        }
      });

      newArray.push({
        connection_type: 'connector',
        connection_loss: 1,
        id: index + 2,
        start:
          index < newArray.length - 1
            ? (newArray[index].start + newArray[index + 1].start) / 2
            : findlinkdetail?.length,
        length:
          index < newArray.length - 1
            ? newArray[index].start +
              (newArray[index].start + newArray[index + 1].start) / 2
            : 0,
        offset: 0,
        loss: 0,
        fiber_type: '',
      });

      const sortarray = newArray.sort((a: any, b: any) => {
        return a.id - b.id;
      });

      beforadddata[findcable].segments = sortarray;
      if (index != beforadddata[findcable].segments.length - 1) {
        beforadddata[findcable].segments[index].length =
          beforadddata[findcable].segments[index + 1].start -
          beforadddata[findcable].segments[index].start;
      }
      setParentcable({cables: beforadddata, ducts: parentcabl?.ducts || []});
    }
  };

  const deletecable = (id: number) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == id);

    beforadddata.splice(findcable, 1);
    const data: {
      id: number;
      cableId: string;
      number_of_cores: number;
      helix_factor: number;
      segments: [
        {
          connection_type: string;
          connection_loss: number;
          id: number;
          start: number;
          length: number;
          offset: number;
          loss: number;
          fiber_type: string;
        },
      ];
    }[] = [];
    for (let i = 0; i < beforadddata.length; i++) {
      data.push({
        id: i + 1,
        segments: beforadddata[i].segments,
        number_of_cores: beforadddata[i].number_of_cores,
        cableId: beforadddata[i].cableId,
        helix_factor: beforadddata[i].helix_factor,
      });
    }
    setParentcable({cables: data, ducts: parentcabl?.ducts || []});
  };

  const deletecabledata = (
    cableid: number,
    cabledataid: number,
    index: number,
  ) => {
    let beforadddata = deepcopy(parentcabl?.cables);
    const findcable = beforadddata.findIndex((data: any) => data.id == cableid);
    let beforslicecabl = deepcopy(beforadddata[findcable].segments);
    if (index == 0) {
      if (beforslicecabl.length > 0) {
        beforslicecabl[index + 1].start = 0;
        beforslicecabl[index + 1].length =
          beforslicecabl[index + 1].length + beforslicecabl[index].length;
      }
    } else {
      if (index == beforslicecabl.length - 1) {
        beforslicecabl[index - 1].length =
          beforadddata[findcable].segments[index].length +
          beforadddata[findcable].segments[index].start -
          beforadddata[findcable].segments[index - 1].start;
      } else {
        beforslicecabl[index - 1].length =
          beforadddata[findcable].segments[index + 1].start -
          beforadddata[findcable].segments[index - 1].start;
      }
    }

    beforslicecabl.splice(cabledataid - 1, 1);
    let data: {
      id: number;
      start: number;
      length: number;
      offset: number;
      loss: number;
      fiber_type: string;
      fixId: boolean;
      connection_type: string;
      connection_loss: number;
    }[] = [];

    for (let i = 0; i < beforslicecabl.length; i++) {
      data.push({
        connection_type: beforslicecabl[i]?.connection_type,
        connection_loss: beforslicecabl[i]?.connection_loss,
        id: i + 1,
        start: beforslicecabl[i]?.start,
        length: beforslicecabl[i]?.length,
        offset: beforslicecabl[i]?.offset,
        loss: beforslicecabl[i]?.loss,
        fiber_type: beforslicecabl[i]?.fiber_type,
        fixId: beforslicecabl[i]?.fixId || false,
      });
    }

    beforadddata[findcable].segments = data;

    setParentcable({cables: beforadddata, ducts: parentcabl?.ducts || []});
  };

  const allpoints: any =
    state?.detail?.data?.current_version?.link_points || [];
  let lengthlatitude = Math.pow(
    allpoints[0]?.latitude + allpoints[allpoints.length - 1]?.latitude,
    2,
  );
  let lengthlongitude = Math.pow(
    allpoints[0]?.longitude + allpoints[allpoints.length - 1]?.longitude,
    2,
  );
  let mainlength = Math.sqrt(lengthlatitude + lengthlongitude);
  if(state?.update?.httpRequestStatus === 'loading' || state?.detail?.httpRequestStatus == "loading"){
    return <h1 className='text-left'>Loading</h1>
  }
  

  console.log("😃",parentcabl);
  console.log("state?.detail",state?.detail);
  
  
  return (
    <div className="relative  min-h-[calc(100vh-220px)] w-full">
      {(parentcabl?.cables && parentcabl?.cables?.length > 0) ||
      mousePosition.y < 160 ? null : (
        <div
          style={{
            top: `${
              parentcabl?.cables?.length == 0
                ? mousePosition.y - 180
                : mousePosition.y - 180
            }px`,
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
        {parentcabl?.cables?.map((data: any, idd: number) => {
          return (
            <div key={data.id} className="relative z-50 w-full bg-b">
              <div
                style={{zIndex: 20}}
                className="relative z-40 my-8 w-full  rounded-md bg-gis p-4">
                <div
                  className={`absolute left-[-30px] top-0 z-40 ${
                    idd == parentcabl.cables.length - 1
                      ? 'h-full'
                      : 'h-[calc(100%+32px)]'
                  }  w-[30px] bg-b`}></div>

                <div className="z-40 flex w-full flex-row items-center justify-between">
                  <div className="flex w-full flex-row justify-between">
                    <span className="w-14"> {idd + 1}</span>
                    <Description
                      label="ID:"
                      labelClassName="w-fit pr-2"
                      className="ml-[-20px] pr-14">
                      <TextInput
                        type="text"
                        value={data.cableId}
                        onChange={e => setcableId(data.id, e.target.value)}
                        className="w-full"
                      />
                    </Description>

                    <Description
                      label="Number of Cores:"
                      labelClassName="pr-0"
                      className="ml-[-20px] w-[270px] pr-4">
                      <TextInput
                        value={data.number_of_cores}
                        onChange={e => setcores(data.id, e.target.value)}
                        type="number"
                        className="w-28 "
                      />
                    </Description>
                    <Description
                      label="Helix Factor:"
                      labelClassName="pr-2"
                      className="w-[235px] pr-4">
                      <TextInput
                        value={data.helix_factor}
                        onChange={e => sethelixfactor(data.id, e.target.value)}
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
                    {open[idd] ? (
                      <IoChevronUp
                        size={48}
                        className="cursor-pointer active:opacity-50"
                        onClick={() => {
                          if (open[idd]) {
                            setOpen({...open, [idd]: false});
                          } else {
                            setOpen({...open, [idd]: true});
                          }
                        }}
                      />
                    ) : (
                      <IoChevronDown
                        size={48}
                        className="cursor-pointer active:opacity-50"
                        onClick={() => {
                          if (open[idd]) {
                            setOpen({...open, [idd]: false});
                          } else {
                            setOpen({...open, [idd]: true});
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
                {open[idd] ? (
                  <Fragment>
                    <div className="flex-grow-1 mt-8 flex flex-row justify-between ">
                      <div className="flex flex-row gap-x-12">
                        <IoTrashOutline
                          size={24}
                          className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                        />
                        <span className="w-12" />
                      </div>
                    </div>
                    {data?.segments?.map((dataa: any, index: number) => {
                      let finddata = finddataindex(data.cableId);

                      return (
                        <div
                          className="relative mb-[15px] w-full rounded-[10px] bg-[#ACD3DE] p-4"
                          key={index}>
                          <div
                            className="relative flex flex-col justify-between pr-[40px]"
                            key={index}>
                            <div className="absolute right-[10px] top-[5px] flex flex-row gap-x-12">
                              <IoTrashOutline
                                onClick={() =>
                                  deletecabledata(data.id, dataa.id, index)
                                }
                                size={24}
                                className="cursor-pointer  text-red-500   active:text-red-300"
                              />
                            </div>
                            <div className="flex w-full flex-row justify-between">
                              <div className="flex w-[65%] flex-row justify-between ">
                                <span className="mr-[5px] text-left">
                                  Connection Type
                                </span>
                                <Select
                                  value={dataa.connection_type}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'connection_type',
                                      index,
                                    )
                                  }
                                  className="w-[80%]"
                                  // placeholder={dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
                                >
                                  <option value="" className="hidden">
                                    {dataa.connection_type}
                                  </option>
                                  <option value={undefined} className="hidden">
                                    {dataa.connection_type}
                                  </option>
                                  <option value="connector">connector</option>
                                  <option value="fusion_splice">
                                    fusion_splice
                                  </option>
                                </Select>
                                {/* <TextInput
                              
                                  value={dataa.connection_type}

                                  onChange={
                                    e =>
                                          setcableslicecabsegment(
                                            data.id,
                                            dataa.id,
                                            e.target.value,
                                            'connection_type',
                                            index
                                          )
                                  }

                                  className="w-[80%]"
                                  type="number"
                                /> */}
                              </div>
                              <div className="box-border flex   w-[30%] flex-row justify-between ">
                                <span className="mr-[5px] w-[100px]  text-left">
                                  Connection Loss (dB)
                                </span>
                                <TextInput
                                  value={dataa.connection_loss}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'connection_loss',
                                      index,
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
                                  // defaultValue={10}
                                  value={
                                    index == 0
                                      ? 0
                                      : dataa.start == 0
                                      ? data.segments[index - 1].length
                                      : dataa.start
                                  }
                                  max={
                                    index == data?.segments.length - 1
                                      ? findlinkdetail?.length
                                      : data?.segments[index + 1].start - 0.1
                                  }
                                  min={
                                    index == 0
                                      ? 0
                                      : data?.segments[index - 1].start + 0.1
                                  }
                                  step={0.1}
                                  onChange={
                                    index == 0
                                      ? () => {}
                                      : e =>
                                          setcableslicecabsegment(
                                            data.id,
                                            dataa.id,
                                            e.target.value,
                                            'start',
                                            index,
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
                                  onChange={() => {}}
                                  // onChange={
                                  //   data?.segments?.length > 1
                                  //     ? () => {}
                                  //     : e =>
                                  //         setcableslicecabsegment(
                                  //           data.id,
                                  //           dataa.id,
                                  //           e.target.value,
                                  //           'length',
                                  //           index,

                                  //         )
                                  // }
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
                                      index,
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
                                  value={dataa.fiber_type}
                                  onChange={e =>
                                    setcableslicecabsegment(
                                      data.id,
                                      dataa.id,
                                      e.target.value,
                                      'fiber_type',
                                      index,
                                    )
                                  }
                                  className="w-[60%]"
                                  // placeholder={dataa?.fiber_type?.length>0?dataa.fiber_type:"select"}
                                >
                                  <option value="" className="hidden">
                                    {dataa?.fiber_type?.length > 0
                                      ? dataa.fiber_type
                                      : 'select'}
                                  </option>
                                  <option value={undefined} className="hidden">
                                    {dataa?.fiber_type?.length > 0
                                      ? dataa.fiber_type
                                      : 'select'}
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
                                      index,
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
                              'ml-[calc(5%-56px)] absolute z-50 bottom-[-23px] left-[-10px] w-[calc(100%-20px)]  h-[30px] xl:ml-[calc(6%-56px)]'
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
                onclick={() => addcable(idd)}
              />
              {parentcabl.cables.length - 1 == idd ? (
                <Addbox
                  classname={
                    'left-[-30px] bottom-[-25px] absolute z-50 w-[calc(75%+30px)] mt-[-19px]  h-[20px] '
                  }
                  onclick={() => addcable(idd + 1)}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 right-0 mr-4 flex flex-row gap-x-4 self-end">
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.linkId!.split('_')[2]) ||
        regionidadmin.includes(params.linkId!.split('_')[1]) || state?.detail?.data?.access?.access == "ADMIN" ? (
          <SimpleBtn onClick={() => savecables()}>Save</SimpleBtn>
        ) : null}

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkCablesAndSegmentsPage;
