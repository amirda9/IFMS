import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import Selectbox from './../../components/selectbox/selectbox';
import {getPrettyDateTime} from '~/util/time';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useEffect, useState} from 'react';
import {settypestate} from './../../store/slices/networkslice';
import {BASE_URL} from './../../constant';
import {useDispatch, useSelector} from 'react-redux';
const typeoptions = [
  {value: 'cable', label: 'Cable'},
  {value: 'duct', label: 'duct'},
];

// *********************************************************************
const LinkDetailPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {type} = useSelector((state: any) => state.network);
  console.log(type,'typetype');
  
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
  const dispatch = useDispatch();
  const networkId = Cookies.get(networkExplored);
  const params = useParams<{linkId: string}>();
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.linkDetail,
      stations: state.http.allStations,
      update: state.http.linkUpdate,
    }),
    initialRequests: request => {
      request('linkDetail', {params: {link_id: params.linkId!}});
      if (networkId) {
        request('allStations', undefined);
      }
    },
  });
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [types, setType] = useState('');
  const [typeerror, setTypeerror] = useState('');
  const [nameerror, setNameerror] = useState('');
  const [commenerror, setCommmenerror] = useState('');
  const [defaultdestinationname, setDefaultdestinationname] = useState('');
  const [defaultsource, setdefaultsource] = useState('');
  const [defauttype, setdefaulttype] = useState('');
  const [selectedstations, setSelectedstations] = useState([]);
  const [allsource, setAllsource] = useState<{value: string; label: string}[]>(
    [],
  );
  const [soueceerror, setSourcerror] = useState('');
  const [destenationerror, setDestinationerror] = useState('');
  const [alldestinaton, setAlldestination] = useState([]);
  const [source, setSource] = useState<string>('');
  const [destinationid, setDestinationid] = useState<string>('');

  useEffect(() => {
    setName(state?.detail?.data?.name || '');
    setComment(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.description || '',
    );
    setDestinationid(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.destination.id || '',
    );
    setDefaultdestinationname(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.destination.name || '',
    );
    setSource(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.source.id || '',
    );
    setdefaultsource(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.source.name || '',
    );
    setType(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.type || '',
    );
    console.log(state?.detail?.data?.versions?.find(
      version => version.id === state?.detail?.data?.current_version?.id,
    )?.type ,'ttttttttttttttttttt');
    
    // setdefaulttype(
    //   state?.detail?.data?.versions?.find(
    //     version => version.id === state?.detail?.data?.current_version?.id,
    //   )?.type || '',
    // );

    let data: any = [];
    if (state.stations) {
      const all = state.stations?.data || [];
      for (let i = 0; i < all.length; i++) {
        data.push({value: all[i].id, label: all[i].name});
      }
      setAllsource(data);
      setAlldestination(data);
      setSelectedstations(data);
    }
  }, [state.detail]);

  const changesource = (id: string) => {
    setSourcerror('');
    setSource(id);
    const data = JSON.parse(JSON.stringify(selectedstations));
    const destinationedata = data?.filter((data: any) => data.value != id);
    setAlldestination(destinationedata);
  };

  const changedestination = (id: string) => {
    setDestinationid(id);
    const data = JSON.parse(JSON.stringify(selectedstations));
    const destinationedata = data?.filter((data: any) => data.value != id);
    setAllsource(destinationedata);
    setDestinationerror('');
  };

  const updatelink = () => {
    if (name.length < 1) {
      setNameerror('Please enter link name');
    }  else if (source.length == 0) {
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
      request('linkUpdate', {
        params: {link_id: params.linkId || ''},
        data: {
          description: comment,
          name:name,
          link_points: [
            {
              latitude: 1,
              longitude: 1,
            },
            {
              latitude: 1,
              longitude: 1,
            },
          ],
          source_id: source,
          destination_id: destinationid,
          type: types,
        },
      });
    }
  };

  // ---------------------------------------------------------------
  return (
    <div className="relative flex h-[calc(100vh-220px)]  w-full flex-col">
      <div className="relative flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Name</div>
        <input
          // defaultValue={state?.detail?.data?.name || ''}
          value={name}
          onChange={(e: any) => {
            setName(e.target.value), setNameerror('');
          }}
          className="h-[40px] text-sm w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 placeholder-[#000000]"
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
          // defaultValue={
          //   state?.detail?.data?.versions?.find(
          //     version =>
          //       version.id === state?.detail?.data?.current_version?.id,
          //   )?.description || ''
          // }
          value={comment}
          onChange={(e: any) => {
            setComment(e.target.value), setCommmenerror('');
          }}
          className="h-[100px] text-sm w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 placeholder-[#000000]"
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
            placeholder={type}
            onclickItem={(e: {value: string; label: string}) => {
              setType(e.value);
              setTypeerror('');
              dispatch(settypestate(e.label));
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

      <div className="absolute bottom-[-10px] right-0 mr-4 flex flex-row gap-x-4 self-end ">
        {userrole == 'superuser' ||
        state?.detail?.data?.access?.access == 'ADMIN' ||
        networkDetail?.data?.access?.access == 'ADMIN' ? (
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
