import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {useNavigate} from 'react-router-dom';
import {networkExplored} from '~/constant';
import Selectbox from './../../components/selectbox/selectbox';
import Cookies from 'js-cookie';
import {FormLayout} from '~/layout';
import {Form, Formik, useField} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch, useSelector} from 'react-redux';
import {settypestate} from './../../store/slices/networkslice';
import * as Yup from 'yup';
import SelectFormik from '~/container/formik/SelectFormik';
import {getPrettyDateTime} from '~/util/time';
import {useHttpRequest} from '~/hooks';
import {useEffect, useState} from 'react';

const linkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter link name'),
  description: Yup.string().required('Please enter link comment'),
  // source: Yup.string().required('Please select source'),
  // destination: Yup.string().required('Please select destination'),
  type: Yup.string().required('Please select type'),
});
const LinkCreatePage = () => {
  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const {
    state: {create, allLinks, stations},
    request,
  } = useHttpRequest({
    selector: state => ({
      create: state.http.linkCreate,
      allLinks: state.http.allLinks,
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
    onUpdate: lastState => {
      if (
        lastState.create?.httpRequestStatus === 'loading' &&
        create?.httpRequestStatus === 'success'
      ) {
        request('allLinks', undefined);
        // navigate('../' + create?.data?.link_id);
      }
    },
  });

  const [selectedstations, setSelectedstations] = useState([]);
  const [allsource, setAllsource] = useState<{value: string; label: string}[]>(
    [],
  );
  const [soueceerror, setSourcerror] = useState('');
  const [destenationerror, setDestinationerror] = useState('');
  const [alldestinaton, setAlldestination] = useState([]);
  const [source, setSource] = useState<string>('');
  const [destinationid, setDestinationid] = useState<string>('');
  const {linkDetail} = useSelector((state: any) => state.http);

  const {type} = useSelector((state: any) => state.network);
  const dispatch = useDispatch();
  const params = useParams<{linkId: string}>();

  useEffect(() => {
    let data: any = [];
    if (stations) {
      const all = JSON.parse(JSON.stringify(stations?.data));
      for (let i = 0; i < all.length; i++) {
        data.push({value: all[i].id, label: all[i].name});
      }
      setAllsource(data);
      setAlldestination(data);
      setSelectedstations(data);
    }
  }, []);

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


  // console.log(allLinks, 'allLinks');

  // const buttons = (
  //   <>
  //     {/* {linkDetail?.data?.access == 'ADMIN' ? ( */}
  //       <SimpleBtn type="submit" >
  //         Save
  //       </SimpleBtn>
  //     {/* ) : null} */}
  //     <SimpleBtn>Cancel</SimpleBtn>
  //   </>
  // );
  const buttons = (
    <>
      <SimpleBtn
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}
        disabled={create?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  console.log(destenationerror, 'ddddddddddddddd');

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: `Link name`,
        description:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the',
        latitude: 0,
        longitude: 0,
        destination: destinationid,
        source: source,
        type: 'cable',
      }}

      onSubmit={values => {
        if (values.source.length == 0) {
          setSourcerror('Please select source');
        }else if(values.destination.length == 0) {
          setDestinationerror('Please select destination');
        } else {

          request('linkCreate', {
            data: {
              name: values.name,
              network_id: networkId!,
              source_id: source,
              destination_id: destinationid,
              link_points: [
                {
                  latitude: 1,
                  longitude: 1,
                },
                {
                  latitude: 0,
                  longitude: 0,
                },
              ],
              // region_id:"",
              description: values.description,
              type: values.type,
            },
          });
        }
      }}

      
      validationSchema={linkSchema}>
      <Form className="relative flex h-full min-h-[calc(100%-80px)] w-full flex-col justify-between">
        <div className="flex flex-col gap-y-4">
          <Description label="Name" labelClassName="mt-2" items="start">
            <InputFormik
              name="name"
              wrapperClassName="w-2/3 text-sm"
              className="disabled:bg-white"
              // disabled
            />
          </Description>

          <Description label="Comment" items="start">
            <TextareaFormik name="description" className="w-2/3 text-sm" />
          </Description>

          <Description label="Source" items="center">
            <div className="flex  w-1/5 flex-col">
              <Selectbox
                defaultvalue="select"
                onclickItem={(e: {value: string; lable: string}) =>
                  changesource(e.value)
                }
                options={allsource}
                borderColor={'black'}
                classname={
                  'w-[82.5%] text-sm text-black bg-[#B3BDF2] h-[32px] md:rounded-[5px]'
                }
              />
              {soueceerror.length > 0 ? (
                <div className="text-xs text-red-500">{soueceerror}</div>
              ) : null}
            </div>

            {/* <SelectFormik
                name="source"
                onChange={e => setSource(e.target.id)}
                className="w-1/5 text-sm disabled:bg-white">
                {allstations?.data?.map((data:any) => (
                  <option key={data?.id}>{data?.id}</option>
                ))}

              </SelectFormik> */}
          </Description>

          <Description label="Destination" items="center">
            <div className="flex  w-1/5 flex-col">
              <Selectbox
                defaultvalue="select"
                onclickItem={(e: {value: string; lable: string}) =>
                  changedestination(e.value)
                }
                options={alldestinaton}
                borderColor={'black'}
                classname={
                  'w-[82.5%] text-sm text-black bg-[#B3BDF2] h-[32px] md:rounded-[5px]'
                }
              />
              {destenationerror.length > 0 ? (
                <div className="text-xs text-red-500">{destenationerror}</div>
              ) : null}
            </div>

            {/* <SelectFormik
                name="destination"
                className="w-1/5 text-sm disabled:bg-white">
                <option>gg</option>
              </SelectFormik> */}
          </Description>

          <Description label="Type" items="center">
            <SelectFormik
              defaultValue={type}
              onChange={e => dispatch(settypestate(e.target.value))}
              name="type"
              className="w-1/5 text-sm disabled:bg-white">
              <option>Cable</option>
              <option>duct</option>
            </SelectFormik>
          </Description>
        </div>
        <div className="absolute bottom-0 right-0 mr-4 flex flex-row gap-x-4 self-end">
          <SimpleBtn type="submit">Save</SimpleBtn>

          <SimpleBtn>Cancel</SimpleBtn>
        </div>
      </Form>
    </Formik>
  );
};

export default LinkCreatePage;
