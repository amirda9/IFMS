import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import Selectbox from './../../components/selectbox/selectbox';
import {Request} from '~/hooks/useHttpRequest';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch, useSelector} from 'react-redux';
import {settypestate} from './../../store/slices/networkslice';
import * as Yup from 'yup';
import SelectFormik from '~/container/formik/SelectFormik';
import {getPrettyDateTime} from '~/util/time';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useEffect, useState} from 'react';
const typeoptions = [
  {value: 'cable', label: 'Cable'},
  {value: 'duct', label: 'duct'},
];
const linkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter link name'),
  description: Yup.string().required('Please enter link comment'),
  source: Yup.string().required('Please select source'),
  destination: Yup.string().required('Please select destination'),
  type: Yup.string().required('Please select type'),
});
const LinkDetailPage = () => {
  const networkId = Cookies.get(networkExplored);

  const {type} = useSelector((state: any) => state.network);
  const dispatch = useDispatch();
  const params = useParams<{linkId: string}>();
  console.log(params.linkId, 'params');
  // const initialRequests = (request) => {
  //   request('linkDetail', {params: {link_Id:params.linkId!}});
  //   // request('networkDetail', {params: {networkId:'hkjhjk'}});
  // };

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

    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.update?.httpRequestStatus === 'loading' &&
    //     state.update!.httpRequestStatus === 'success'
    //   ) {
    //     initialRequests(request);
    //   }
    // },
  });

  const {linkDetail, allStations} = useSelector((state: any) => state.http);
  // console.log(update, 'lklklk')
  console.log(linkDetail?.data?.access, 'fffrrtttt');
  console.log(state?.detail?.data, 'pgggpp');
  console.log(allStations, 'allStationsallStations');
  // **************************************************************************
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
    setdefaulttype(
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      )?.type || '',
    );

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

  console.log(defaultdestinationname, 'v');

  // useEffect(() => {

  //   let data: any = [];
  //   if (state.stations) {
  //     const all = state.stations?.data || [];
  //     for (let i = 0; i < all.length; i++) {
  //       data.push({value: all[i].id, label: all[i].name});
  //     }
  //     setAllsource(data);
  //     setAlldestination(data);
  //     setSelectedstations(data);
  //   }
  // }, [state.detail]);

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
  // ******************************************************************************
  const buttons = (
    <>
      {linkDetail?.data?.access == 'ADMIN' ? (
        <SimpleBtn type="submit" disabled={true}>
          Save
        </SimpleBtn>
      ) : null}
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <div className="relative flex min-h-[calc(100%-80px)] w-full flex-col">
      <div className="relative flex w-[70%] flex-row items-center justify-between">
        <div className="w-[130px] text-sm text-black">Name</div>
        <input
          placeholder={state?.detail?.data?.name || ''}
          // value={name}
          onChange={(e: any) => {
            setName(e.target.value), setNameerror('');
          }}
          className="h-[40px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 placeholder-[#000000]"
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
          placeholder={
            state?.detail?.data?.versions?.find(
              version =>
                version.id === state?.detail?.data?.current_version?.id,
            )?.description || ''
          }
          // value={comment}
          onChange={(e: any) => {
            setComment(e.target.value), setCommmenerror('');
          }}
          className="h-[100px] w-[calc(100%-160px)] rounded-[6px] border-[1px] border-[#000000] px-2 placeholder-[#000000]"
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
            placeholder={defauttype}
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

      <div className="absolute bottom-0 right-0 mr-4 flex flex-row gap-x-4 self-end ">
        <SimpleBtn onClick={() => {}} type="button">
          Save
        </SimpleBtn>

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
    // <FormLayout
    //  buttons={buttons}>
    //   <Formik
    //   enableReinitialize
    //     initialValues={{
    //       name: `${state?.detail?.data?.name}`,
    //       description: state?.detail!.data!.versions.find(
    //         version => version.id === state?.detail!.data!.current_version.id,
    //       )?.description || '',
    //       latitude: state?.detail!.data!.versions.find(
    //         version => version.id === state?.detail!.data!.current_version.id,
    //       )?.source?.id || '',
    //       longitude: 0,
    //     }}
    //     onSubmit={values => {}}
    //     validationSchema={linkSchema}>
    //     <Form className="flex h-full flex-col justify-between">
    //       <div className="flex flex-col gap-y-4">
    //         <Description label="Name" labelClassName="mt-2" items="start">
    //           <InputFormik
    //             name="name"
    //             wrapperClassName="w-2/3 text-sm"
    //             className="disabled:bg-white"
    //             disabled
    //           />
    //         </Description>

    //         <Description label="Comment" items="start">
    //           <TextareaFormik name="description" className="w-2/3 text-sm" />
    //         </Description>

    //         <Description label="Source" items="center">
    //           <SelectFormik
    //             name="source"
    //             className="w-1/5 text-sm disabled:bg-white">
    //             <option>Station2</option>
    //           </SelectFormik>
    //         </Description>

    //         <Description label="Destination" items="center">
    //           <SelectFormik
    //             name="destination"
    //             className="w-1/5 text-sm disabled:bg-white">
    //             <option>Station1</option>
    //           </SelectFormik>
    //         </Description>

    //         <Description label="Type" items="center">
    //           <SelectFormik
    //             defaultValue={type}
    //             onChange={e => dispatch(settypestate(e.target.value))}
    //             name="type"
    //             className="w-1/5 text-sm disabled:bg-white">
    //             <option>Cable</option>
    //             <option>duct</option>
    //           </SelectFormik>
    //         </Description>

    //         <Description label="Region" items="start">
    //           Region 2
    //         </Description>

    //         <Description label="Owner" items="start">
    //           Admin
    //         </Description>

    //         <Description label="Created">{getPrettyDateTime()}</Description>

    //         <Description label="Last Modified">
    //           {getPrettyDateTime()}
    //         </Description>
    //       </div>
    //     </Form>
    //   </Formik>
    // </FormLayout>
  );
};

export default LinkDetailPage;
