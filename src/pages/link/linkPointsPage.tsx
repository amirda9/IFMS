import React, {useEffect, useState} from 'react';
import {SimpleBtn, TextInput} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {BsPlusLg} from 'react-icons/bs';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
type Iprops = {
  classname: string;
  onclick: Function;
};

type linkpointstype = {
  latitude: number;
  longitude: number;
  id: number;
  fix?: boolean;
};
const Addbox = ({classname, onclick}: Iprops) => {
  return (
    <div
      className={`flex flex-row items-center justify-between opacity-0  hover:opacity-100  ${classname}`}>
      <button
        onClick={() => onclick()}
        className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
        <BsPlusLg color="white" size={35} className="ml-[-2.5px] mt-[-2.5px]" />
      </button>
      <div className="w-[calc(100%-40px)]  border-t-[2px] border-dashed  border-[#32C65D]"></div>
    </div>
  );
};
const LinkPointsPage = () => {
  const params = useParams<{linkId: string}>();
  const networkId = params.linkId!.split("_")[2];

  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [linkpoints, setlinkpoints] = useState<linkpointstype[]>([
    {latitude: 0, longitude: 0, id: 0},
  ]);

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      update: state.http.linkUpdate,
    }),
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('linkDetail', {params: {link_id: params.linkId!.split("_")[0]}});
      }
    },
  });

  let linkDetail = state.detail;

  useEffect(() => {
    const all =
      linkDetail?.data?.versions?.find(
        (version: any) => version.id === linkDetail?.data?.current_version?.id,
      )?.link_points || [];
    const points = JSON.parse(JSON.stringify(all));
    for (let i = 0; i < points.length; i++) {
      points[i] = {...points[i], id: i, fix: true};
    }
    setlinkpoints(points);
  }, []);

  const changelatitude = (id: number, x: string, name: string) => {
    let beforadddata = JSON.parse(JSON.stringify(linkpoints));
    const findpoint = beforadddata.findIndex((data: any) => data.id == id);
    beforadddata[findpoint][name] = Number(x);
    setlinkpoints(beforadddata);
  };

  const deletpoints = (id: number) => {
    const findcable = linkpoints.findIndex((data: any) => data.id == id);
    const data = linkpoints
      .filter((dataa: any, index: number) => index != findcable)
      .map((dat: any, index: number) => ({
        id: index,
        latitude: dat.latitude,
        longitude: dat.longitude,
        fix: dat.fix || false,
      }));
    setlinkpoints(data);
  };

  const Addlinkpoints = (index: number) => {
    let beforadddata = JSON.parse(JSON.stringify(linkpoints));
    let newArray = beforadddata.map(function (item: any) {
      if (item.id > index) {
        item.id = item.id + 1;
        return item;
      } else {
        return item;
      }
    });
    newArray.push({
      id: index + 1,
      latitude: 0,
      longitude: 0,
    });

    const sortarray = newArray.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    setlinkpoints(sortarray);
  };

  const savepoints = () => {
    const newpoints = linkpoints.map(data => ({
      latitude: data.latitude,
      longitude: data.longitude,
    }));

    const newlink = {
      name: linkDetail?.data?.name || '',
      network_id: networkId || '',
      source_id:
        linkDetail?.data?.versions?.find(
          (version: any) =>
            version.id === linkDetail?.data?.current_version?.id,
        )?.source.id || '',
      destination_id:
        linkDetail?.data?.versions?.find(
          (version: any) =>
            version.id === linkDetail?.data?.current_version?.id,
        )?.destination.id || '',
      link_points: newpoints || '',
      region_id: linkDetail?.data?.region_id || '',
      description:
        linkDetail?.data?.versions?.find(
          (version: any) =>
            version.id === linkDetail?.data?.current_version?.id,
        )?.description || '',
      type: 'cable',
    };
    request('linkUpdate', {
      params: {link_id: params.linkId!.split("_")[0] || ''},
      data: newlink,
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-240px)] w-full">
      {(linkpoints && linkpoints.length > 0) || mousePosition.y < 160 ? null : (
        <div
          style={{
            top: `${mousePosition.y - 180}px`,
          }}
          className={`absolute z-10 ml-[-30px] flex h-[30px] w-[calc(75%+20px)] flex-row items-center  justify-between`}>
          <button
            onClick={() => Addlinkpoints(0)}
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
      <div className="relative my-4 flex w-[677px] flex-row  items-center justify-between rounded-md p-4">
        <span>index</span>
        <div className="mr-[90px] w-[246px] text-center">Latitude</div>
        <div className="mr-[90px] w-[246px] text-center">Longitude</div>
      </div>
      {linkpoints.map((data, index) => (
        <div
          key={index}
          className="relative my-4 flex w-[677px] flex-row  items-center justify-between rounded-md bg-gis p-4">
          <span>{index + 1}</span>
          <TextInput
            value={data.latitude}
            type="number"
            onChange={
              data.fix == true && (index == linkpoints.length - 1 || index == 0)
                ? () => {}
                : e => changelatitude(data.id, e.target.value, 'latitude')
            }
            className="w-[246px]"
          />
          <TextInput
            value={data.longitude}
            type="number"
            onChange={
              data.fix == true && (index == linkpoints.length - 1 || index == 0)
                ? () => {}
                : e => changelatitude(data.id, e.target.value, 'longitude')
            }
            className="w-[246px]"
          />
          <IoTrashOutline
            onClick={
              data.fix == true && (index == linkpoints.length - 1 || index == 0)
                ? () => {}
                : () => deletpoints(data.id)
            }
            size={24}
            className="cursor-pointer  text-red-500  active:text-red-300"
          />
          {data.fix == true && index == linkpoints.length - 1 ? null : (
            <Addbox
              classname={
                'absolute z-50 left-[-25px] w-full bottom-[-22.5px] h-[30px]'
              }
              onclick={() => Addlinkpoints(index)}
            />
          )}
        </div>
      ))}
      <div className="absolute bottom-[-35px] right-0 flex flex-row">
        <SimpleBtn onClick={() => savepoints()} type="submit">
          Save
        </SimpleBtn>
        <SimpleBtn className="ml-[20px]">Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkPointsPage;
