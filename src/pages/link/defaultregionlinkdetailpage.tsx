import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import Selectbox from './../../components/selectbox/selectbox';
import {getPrettyDateTime} from '~/util/time';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {useEffect, useState} from 'react';
import {setLinkdetail, settypestate} from './../../store/slices/networkslice';
import {useDispatch, useSelector} from 'react-redux';
import {
  changegetdatadetailStatus,
  updatedefaltlinkname,
} from './../../store/slices/networktreeslice';
import {$Get,$Put} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {LinksType} from '~/types';
import {UserRole} from '~/constant/users';
const typeoptions = [
  {value: 'cable', label: 'Cable'},
  {value: 'duct', label: 'duct'},
];


type regionlisttype = {
  id: string;
  name: string;
  network_id: string;
  time_created: string;
  time_updated: string;
};
type mainprops={
networkId:string,linkId:string
  }
// *********************************************************************
const LinkDetailPage = () => {
  const [defaultregionkname, setDefaultregionname] = useState('');
  const {networkidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {type} = useSelector((state: any) => state.network);
  const dispatch = useDispatch();
  const params = useParams<mainprops>();
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      request('linkDetail', {params: {link_id: params.linkId!}});
    },
  });

  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [selectedregion, setSelectedregion] = useState('');
  const [name, setName] = useState(state!.detail?.data?.name || '');
  const [comment, setComment] = useState('');
  const [types, setType] = useState('');
  const [typeerror, setTypeerror] = useState('');
  const [nameerror, setNameerror] = useState('');
  const [commenerror, setCommmenerror] = useState('');
  const [defaultdestinationname, setDefaultdestinationname] = useState('');
  const [defaultsource, setdefaultsource] = useState('');
  const [selectedstations, setSelectedstations] = useState([]);
  const [allsource, setAllsource] = useState<{value: string; label: string}[]>(
    [],
  );

  const [soueceerror, setSourcerror] = useState('');
  const [destenationerror, setDestinationerror] = useState('');
  const [alldestinaton, setAlldestination] = useState([]);
  const [source, setSource] = useState<string>('');
  const [destinationid, setDestinationid] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getlinkdetail = async () => {
    try {
      setLoading(true);
      let linkdetailurl = `otdr/link/${params?.linkId!}`;
      let regionstationurl = `otdr/station`;

      const [linkdetailresponse, networkstation] = await Promise.all([
        $Get(linkdetailurl),
        $Get(regionstationurl),
      ]);
      if (linkdetailresponse?.status == 200 && networkstation?.status == 200) {
        dispatch(changegetdatadetailStatus(true))
        const linkdata: LinksType = await linkdetailresponse?.json();
        const findInlinkdata = linkdata?.versions?.find(
          version => version.id === linkdata?.current_version?.id,
        );
        const networkstationdata = await networkstation?.json();
        dispatch(setLinkdetail(linkdata));
        setName(linkdata.name);
        setComment(findInlinkdata?.description || '');
        setDestinationid(findInlinkdata?.destination.id || '');
        setDefaultdestinationname(findInlinkdata?.destination.name || '');
        setSource(findInlinkdata?.source.id || '');
        setdefaultsource(findInlinkdata?.source.name || '');
        let findtaype = type.findIndex((data: any) => data.id == linkdata?.id);

        if (findtaype > -1) {
          setType(type[findtaype].type);
        } else {
          setType(findInlinkdata?.type || '');
          dispatch(
            settypestate({
              type: findInlinkdata?.type,
              id: linkdata?.id,
            }),
          );
        }

        let data: any = [];
        const all = networkstationdata || [];
        for (let i = 0; i < all.length; i++) {
          data.push({value: all[i].id, label: all[i].name});
        }
        setAllsource(data);
        setAlldestination(data);
        setSelectedstations(data);

        const response = await $Get(`otdr/network`);
        if (response?.status == 200) {
          const responsedata = await response?.json();
          const Defaultnetworkname = responsedata.find(
            (data: any) => data.id == linkdata.network_id,
          )?.name;
          const networkregionresponse = await $Get(
            `otdr/region/network/${responsedata.find(
              (data: any) => data.id == linkdata.network_id,
            )?.id}`,
          );
          if (networkregionresponse?.status == 200) {
            const networkregionresponsedata =
              await networkregionresponse?.json();
            const Defaultegionname =
              networkregionresponsedata.find(
                (data: any) => data.id == linkdata.region_id,
              )?.name || 'select';
            setDefaultregionname(Defaultegionname);
            setRegionlist(networkregionresponsedata);
          }
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getlinkdetail();
  }, []);

  const changesource = (id: string) => {
    setSourcerror('');
    setSource(id);
    const data = deepcopy(selectedstations);
    const destinationedata = data?.filter((data: any) => data.value != id);
    setAlldestination(destinationedata);
  };

  const changedestination = (id: string) => {
    setDestinationid(id);
    const data = deepcopy(selectedstations);
    const destinationedata = data?.filter((data: any) => data.value != id);
    setAllsource(destinationedata);
    setDestinationerror('');
  };

  const updatelink = async () => {
    if (name.length < 1) {
      setNameerror('Please enter link name');
    } else if (source.length == 0) {
      setNameerror('');
      setTypeerror('');
      setSourcerror('Please select source');
    } else if (destinationid.length == 0) {
      setNameerror('');
      setTypeerror('');
      setSourcerror('');
      setDestinationerror('Please select destination');
    } else if (types.length < 1) {
      setNameerror('');
      setTypeerror('Please select type');
    } else {
      setNameerror('');
      setTypeerror('');
      setSourcerror('');
      setDestinationerror('');
      try {
        const response = await $Put(
          `otdr/link/${params?.linkId!}`,
          {
            description: comment,
            network_id: params?.networkId!,
            region_id: selectedregion.length > 0 ? selectedregion : null,
            name: name,
            link_points: [],
            source_id: source,
            destination_id: destinationid,
            type: types,
          },
        );
        if (response?.status == 200) {
          dispatch(
            updatedefaltlinkname({
              regionid: selectedregion.length > 0 ? selectedregion : null,
              networkid: params?.networkId!,
              linkid: params?.linkId!,
              linkname: name,
              source_id: source,
              destination_id: destinationid,
            }),
          );
        }
        getlinkdetail();
      } catch (error) {}
    }
  };


  if (loading) {
    return <h1>Loading...</h1>;
  }
  // ---------------------------------------------------------------
  return (
    <div className="relative flex  w-full flex-col">
      <div className="relative flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Name</div>
        <input
          defaultValue={name}
          placeholder={name}
          value={name}
          onChange={(e: any) => {
            setName(e.target.value), setNameerror('');
          }}
          className="h-[40px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 text-sm placeholder-[#000000]"
        />
        {nameerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[20] text-xs text-red-500">
            {nameerror}
          </div>
        ) : null}
      </div>

      <div className="relative mt-[20px] flex w-[70%] flex-row  justify-between">
        <div className="w-[130px] text-sm text-black">Comment</div>
        <textarea
          value={comment}
          onChange={(e: any) => {
            setComment(e.target.value), setCommmenerror('');
          }}
          className="h-[100px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 text-sm placeholder-[#000000]"
        />
        {commenerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[20] text-xs text-red-500">
            {commenerror}
          </div>
        ) : null}
      </div>

      <Description className="mt-[21px]" label="Region" items="center">
        <Selectbox
          defaultvalue={defaultregionkname}
          placeholder={defaultregionkname}
          onclickItem={(e: {value: string; label: string}) =>
            setSelectedregion(e.value)
          }
          options={regionlist.map(data => ({value: data.id, label: data.name}))}
          borderColor={'black'}
          classname="w-[28%]  h-[32px] rounded-[5px]"
        />
      </Description>

      <div className="relative mt-[20px] flex w-[430px] flex-row items-center justify-between ">
        <div className="w-[130px] text-sm text-black">Source</div>
        <div className="flex w-[268px]  flex-col">
          <Selectbox
            placeholder={defaultsource}
            defaultvalue={defaultsource}
            onclickItem={(e: {value: string; lable: string}) =>
              changesource(e.value)
            }
            options={allsource}
            borderColor={'black'}
            classname={
              'w-full text-sm text-black bg-[#B3BDF2] h-[32px] md:rounded-[5px]'
            }
          />
        </div>
        {soueceerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[10] text-xs text-red-500">
            {soueceerror}
          </div>
        ) : null}
      </div>

      <div className="relative mt-[20px] flex w-[430px] flex-row items-center justify-between ">
        <div className="w-[130px] text-sm text-black">Destination</div>
        <div className="rlative flex w-[268px]  flex-col">
          <Selectbox
            placeholder={defaultdestinationname}
            defaultvalue={defaultdestinationname}
            onclickItem={(e: {value: string; lable: string}) =>
              changedestination(e.value)
            }
            options={alldestinaton}
            borderColor={'black'}
            classname={
              'w-full text-sm text-black bg-[#B3BDF2] h-[32px] md:rounded-[5px]'
            }
          />
        </div>
        {destenationerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[10] text-xs text-red-500">
            {destenationerror}
          </div>
        ) : null}
      </div>

      <div className="relative mt-[20px] flex w-[430px] flex-row items-center justify-between ">
        <div className="w-[130px] text-sm text-black">Type</div>
        <div className="rlative flex w-[268px]  flex-col">
          <Selectbox
            placeholder={types}
            onclickItem={(e: {value: string; label: string}) => {
              setType(e.value);
              setTypeerror('');
              dispatch(
                settypestate({
                  type: e.label.toLowerCase(),
                  id: state?.detail?.data?.id,
                }),
              );
            }}
            options={typeoptions}
            borderColor={'black'}
            classname={
              'w-full text-sm text-black bg-[#B3BDF2] h-[32px] md:rounded-[5px]'
            }
          />
        </div>
        {typeerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[50] text-xs text-red-500">
            {typeerror}
          </div>
        ) : null}
      </div>

      <Description label="Owner" items="start" className="mt-6">
        {state?.detail?.data?.versions?.find(
          version => version.id === state?.detail?.data?.current_version?.id,
        )?.owner.username || ''}
      </Description>

      <Description label="Created" className="mt-6">
        {getPrettyDateTime(state?.detail?.data?.time_created)}
      </Description>

      <Description label="Last Modified" className="mt-6">
        {getPrettyDateTime(state?.detail?.data?.time_updated)}
      </Description>

      <div className="mr-4 flex flex-row gap-x-4 self-end pb-4 ">
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.networkId!) ? (
          <SimpleBtn onClick={updatelink} type="button">
            Save
          </SimpleBtn>
        ) : null}

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkDetailPage;
