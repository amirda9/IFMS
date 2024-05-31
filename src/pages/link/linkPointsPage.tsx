import React, {useEffect, useMemo, useState} from 'react';
import {SimpleBtn, TextInput} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {BsPlusLg} from 'react-icons/bs';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {deepcopy} from '~/util';
import {useSelector} from 'react-redux';
import {UserRole} from '~/constant/users';
import {$Get, $Put} from '~/util/requestapi';
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
  const networkId = params.linkId!.split('_')[2];
  const [linkdata, setLinkdata] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
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

  const {state} = useHttpRequest({
    selector: state => ({}),
  });

  const getlinkDetail = async () => {
    setLoading(true);
    try {
      const response = await $Get(`otdr/link/${params.linkId!.split('_')[0]}`);
      const responsedata = await response?.json();
      setLinkdata(responsedata);
      const all =
        responsedata?.versions?.find(
          (version: any) => version.id === responsedata?.current_version?.id,
        )?.link_points || [];
      const points = deepcopy(all);
      let neadata = [];
      for (let i = 0; i < all.length; i++) {
        neadata.push({...points[i], id: i, fix: true});
      }
      setlinkpoints(neadata);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getlinkDetail();
  }, []);

  const changelatitude = (id: number, x: string, name: string) => {
    let beforadddata = deepcopy(linkpoints);
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
    let beforadddata = deepcopy(linkpoints);
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

  const savepoints = async () => {
    const newpoints = linkpoints.map(data => ({
      latitude: data.latitude,
      longitude: data.longitude,
    }));
    newpoints.splice(0, 1);
    newpoints.splice(newpoints.length - 1, 1);

    const respnse = await $Put(
      `otdr/link/${params.linkId!.split('_')[0] || ''}/link_points`,
      newpoints,
    );

    if (respnse?.status == 201) {
      getlinkDetail();
    }
  };

  if (loading) {
    return <h1>Loading ...</h1>;
  }
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
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.linkId!.split('_')[2]) ||
        regionidadmin.includes(params.linkId!.split('_')[1]) ||
        linkdata?.access?.access == 'ADMIN' ? (
          <SimpleBtn onClick={() => savepoints()} type="submit">
            Save
          </SimpleBtn>
        ) : null}
        <SimpleBtn className="ml-[20px]">Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkPointsPage;
