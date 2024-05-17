import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import Selectbox from './../../components/selectbox/selectbox';
import {getPrettyDateTime} from '~/util/time';
import {useEffect, useState} from 'react';
import {setLinkdetail, settypestate} from './../../store/slices/networkslice';
import {useDispatch, useSelector} from 'react-redux';
import {updatelinkname} from './../../store/slices/networktreeslice';
import {$Get, $Put} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {LinksType} from '~/types/RegionType';
import {useAppSelector} from '~/hooks';
import {UserRole} from '~/constant/users';

const typeoptions = [
  {value: 'cable', label: 'Cable'},
  {value: 'duct', label: 'duct'},
];
type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};

type regionlisttype = {
  id: string;
  name: string;
  network_id: string;
  time_created: string;
  time_updated: string;
};
// *********************************************************************
const LinkDetailPage = () => {
  const [defaultnetworkname, setDefaultnetworkname] = useState('');
  const [defaultregionkname, setDefaultregionname] = useState('');
  const {type} = useSelector((state: any) => state.network);
  const [loading, setLoading] = useState(false);
  const login = localStorage.getItem('login');
  const dispatch = useDispatch();
  const params = useParams<{linkId: string}>();
  const [networklist, setNetworklist] = useState<networklisttype[]>([]);
  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [selectedregion, setSelectedregion] = useState('');
  const [name, setName] = useState('');
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
  const [linkDetails, setLinkDetails] = useState<LinksType>();

  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  useEffect(() => {
    setSelectedregion(params.linkId!.split('_')[1]);
    const getregionstations = async () => {
      try {
        let linkdetailurl = `otdr/link/${params.linkId!.split('_')[0]}`;
        let regionstationurl = `otdr/region/${
          params.linkId!.split('_')[1]
        }/stations`;

        const [linkdetail, regionstation] = await Promise.all([
          $Get(linkdetailurl),
          $Get(regionstationurl),
        ]);

        const linkdetaildata = await linkdetail.json();
        const all=linkdetaildata?.versions?.find(
          (version: any) => version.id === linkdetaildata?.current_version?.id,
        )?.link_points || [];
     console.log("🦒yy⛴️",all);
        dispatch(setLinkdetail(linkdetaildata));

        setLinkDetails(linkdetaildata);
        setName(linkdetaildata?.name || '');

        const findlinkdetail = linkdetaildata.versions?.find(
          (version: any) => version.id === linkdetaildata?.current_version?.id,
        );

        setComment(findlinkdetail?.description || '');
        setDestinationid(findlinkdetail?.destination.id || '');
        setDefaultdestinationname(findlinkdetail?.destination.name || '');
        setSource(findlinkdetail?.source.id || '');
        setdefaultsource(findlinkdetail?.source.name || '');
        let findtaype = type.findIndex(
          (data: any) => data.id == linkdetaildata?.id,
        );

        if (findtaype > -1) {
          setType(type[findtaype].type);
        } else {
          setType(findlinkdetail?.type || '');
          dispatch(
            settypestate({
              type: findlinkdetail?.type,
              id: linkdetaildata?.id,
            }),
          );
        }
        // ----------------------------------------------------------
        if (regionstation.status == 200) {
          const responsdata = await regionstation.json();
          let data: any = [];
          if (responsdata) {
            let all = responsdata || [];
            for (let i = 0; i < all.length; i++) {
              data.push({value: all[i].id, label: all[i].name});
            }
            setAllsource(data);
            setAlldestination(data);
            setSelectedstations(data);
          }
        }
      } catch (error) {}
    };

    getregionstations();
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
          `otdr/link/${params.linkId!.split('_')[0]}`,
          {
            network_id: params.linkId!.split('_')[2],
            region_id: selectedregion,
            description: comment,
            name: name,
            link_points: [],
            source_id: source,
            destination_id: destinationid,
            type: types,
          },
        );
        if (response.status == 200) {
          dispatch(
            updatelinkname({
              // state!.detail!.data!.region_id!
              networkid: params.linkId!.split('_')[2],
              newregionid: selectedregion,
              regionid: params.linkId!.split('_')[1],
              linkid: params.linkId!.split('_')[0],
              linkname: name,
              source_id: source,
              destination_id: destinationid,
            }),
          );
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    setLoading(true);
    const getnetworks = async () => {
      try {
        const getstationdetail = await $Get(
          `otdr/link/${params.linkId!.split('_')[0]}`,
        );
        if (getstationdetail.status == 200) {
          const getstationdetaildata = await getstationdetail.json();
          const response = await $Get(`otdr/network`);
          if (response.status == 200) {
            const responsedata = await response.json();
            const Defaultnetworkname = responsedata.find(
              (data: any) => data.id == getstationdetaildata.network_id,
            )?.name;
            setDefaultnetworkname(Defaultnetworkname || 'select');
            setNetworklist(responsedata);
            const networkregionresponse = await $Get(
              `otdr/region/network/${responsedata.find(
                (data: any) => data.id == getstationdetaildata.network_id,
              )?.id}`,
            );
            if (networkregionresponse.status == 200) {
              const networkregionresponsedata =
                await networkregionresponse.json();
              const Defaultegionname =
                networkregionresponsedata.find(
                  (data: any) => data.id == getstationdetaildata.region_id,
                )?.name || 'select';
              setDefaultregionname(Defaultegionname);
              setRegionlist(networkregionresponsedata);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getnetworks();
  }, []);

  // ---------------------------------------------------------------
  if (loading) {
    return <h1 className="text-left"> loading...</h1>;
  }
  return (
    <div className="relative flex  w-full flex-col">
      <div className="relative flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Name</div>
        <input
          // defaultValue={state?.detail?.data?.name || ''}
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
                  id: linkDetails?.id,
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
        {linkDetails?.versions?.find(
          version => version.id === linkDetails?.current_version?.id,
        )?.owner.username || ''}
      </Description>

      <Description label="Created" className="mt-6">
        {getPrettyDateTime(linkDetails?.time_created)}
      </Description>

      <Description label="Last Modified" className="mt-6">
        {getPrettyDateTime(linkDetails?.time_updated)}
      </Description>

      <div className="mr-4 flex flex-row gap-x-4 self-end pb-4 ">
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.linkId!.split('_')[2]) ||
        regionidadmin.includes(params.linkId!.split('_')[1]) ? (
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
