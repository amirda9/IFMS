import {useParams} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {useNavigate} from 'react-router-dom';
import {networkExplored} from '~/constant';
import Selectbox from './../../components/selectbox/selectbox';
import Cookies from 'js-cookie';
import {useDispatch, useSelector} from 'react-redux';
import {createdefaultRegionLinks} from './../../store/slices/networktreeslice';
import {useHttpRequest} from '~/hooks';
import {useEffect, useState} from 'react';
import {$Post} from '~/util/requestapi';
import {deepcopy} from '~/util';

const typeoptions = [
  {value: 'cable', label: 'Cable'},
  {value: 'duct', label: 'duct'},
];

const LinkCreatePage = () => {
  const params = useParams();
  console.log(params, 'params');

  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const {
    state: {stations},
    request,
  } = useHttpRequest({
    selector: state => ({
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
  });

  const {allStations} = useSelector((state: any) => state.http);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [types, setType] = useState('');
  const [typeerror, setTypeerror] = useState('');
  const [nameerror, setNameerror] = useState('');
  const [commenerror, setCommmenerror] = useState('');
  const [selectedstations, setSelectedstations] = useState([]);
  const [allsource, setAllsource] = useState<{value: string; label: string}[]>(
    [],
  );
  const [soueceerror, setSourcerror] = useState('');
  const [destenationerror, setDestinationerror] = useState('');
  const [alldestinaton, setAlldestination] = useState([]);
  const [source, setSource] = useState<string>('');
  const [destinationid, setDestinationid] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    let data: any = [];
    if (allStations) {
      let all = allStations?.data || [];
      for (let i = 0; i < all.length; i++) {
        data.push({value: all[i].id, label: all[i].name});
      }
      setAllsource(data);
      setAlldestination(data);
      setSelectedstations(data);
    }
  }, [stations]);

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

  const createlink = async () => {
    if (name.length < 1) {
      setNameerror('Please enter link name');
    } else if (source.length == 0) {
      setNameerror('');
      alert(1);
      setTypeerror('');
      setSourcerror('Please select source');
    } else if (destinationid.length == 0) {
      alert(2);
      setNameerror('');
      setTypeerror('');
      setSourcerror('');
      setDestinationerror('Please select destination');
    } else if (types.length < 1) {
      alert(3);
      setNameerror('');
      setTypeerror('Please select type');
    } else {
      setNameerror('');
      setTypeerror('');
      setSourcerror('');
      setDestinationerror('');
      try {
        const response = await $Post(`otdr/link/`, {
          name: name,
          network_id: params.networkid,
          source_id: source,
          destination_id: destinationid,
          link_points: [],
          description: comment,
          type: types,
        });
        const responsedata = await response?.json();
        //we should update the networktree
        if (response?.status == 200) {
          dispatch(
            createdefaultRegionLinks({
              networkid: params.networkid!,
              links: {
                id: responsedata.link_id,
                name: name,
                source_id: source,
                destination_id: destinationid,
              },
            }),
          );
        }

        navigate(
          `../../links/${responsedata.link_id}/defaultregionlinkdetailpage`,
        );
      } catch (error) {}
    }
  };

  return (
    <div className="relative flex min-h-[calc(100%-80px)] w-full flex-col">
      <span className="text-md mb-6 mt-4 font-bold text-black">
        Create link
      </span>
      <div className="relative flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Name</div>
        <input
          onChange={(e: any) => {
            setName(e.target.value), setNameerror('');
          }}
          className="h-[40px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2"
        />
        {nameerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[20] text-xs text-red-500">
            {nameerror}
          </div>
        ) : null}
      </div>

      <div className="relative mt-[20px] flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Comment</div>
        <textarea
          onChange={(e: any) => {
            setComment(e.target.value), setCommmenerror('');
          }}
          className="h-[100px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2"
        />
        {commenerror.length > 0 ? (
          <div className="absolute bottom-[-15px] left-[160px] z-[20] text-xs text-red-500">
            {commenerror}
          </div>
        ) : null}
      </div>

      <div className="relative mt-[20px] flex w-[430px] flex-row items-center justify-between ">
        <div className="w-[130px] text-sm text-black">Source</div>
        <div className="flex w-[268px]  flex-col">
          <Selectbox
            defaultvalue="select"
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
            defaultvalue="select"
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
            defaultvalue="select"
            onclickItem={(e: {value: string; lable: string}) => {
              setType(e.value);
              setTypeerror('');
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
      <div className="absolute bottom-0 right-0 mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={createlink} type="button">
          Save
        </SimpleBtn>

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkCreatePage;
