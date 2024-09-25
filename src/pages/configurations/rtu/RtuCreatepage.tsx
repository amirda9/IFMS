import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {setdefaultStationsrtu, setStationsrtu} from './../../../store/slices/rtu';
import {FC, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Description, SimpleBtn, Select} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import {InputFormik, SelectFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import {$Post} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
// ----- type ----------- type --------------- type ------------
type Rowtext = {
  name: string;
  value: string;
};
type Iprops = {
  stationId: string;
  regionId: string;
  networkId: string;
};

let modallist = [
  'ArioRTU-D-L-8P',
  'ArioRTU-D-M-8P',
  'ArioRTU-D-H-8P',
  'ArioRTU-A-L-12P',
  'ArioRTU-A-M-12P',
  'ArioRTU-A-H-12P',
  'ArioRTU-B-L-12P',
  'ArioRTU-B-M-12P',
  'ArioRTU-B-H-12P',
  'ArioRTU-C-L-12P',
  'ArioRTU-C-M-12P',
  'ArioRTU-C-H-12P',
  'ArioRTU-D-L-12P',
  'ArioRTU-D-M-12P',
  'ArioRTU-D-H-12P',
  'ArioRTU-A-L-16P',
  'ArioRTU-A-M-16P',
  'ArioRTU-A-H-16P',
  'ArioRTU-B-L-16P',
  'ArioRTU-B-M-16P',
  'ArioRTU-B-H-16P',
  'ArioRTU-C-L-16P',
  'ArioRTU-C-M-16P',
  'ArioRTU-C-H-16P',
  'ArioRTU-D-L-16P',
  'ArioRTU-D-M-16P',
  'ArioRTU-D-H-16P',
  'ArioRTU-A-L-24P',
  'ArioRTU-A-M-24P',
  'ArioRTU-A-H-24P',
  'ArioRTU-B-L-24P',
  'ArioRTU-B-M-24P',
  'ArioRTU-B-H-24P',
  'ArioRTU-C-L-24P',
  'ArioRTU-C-M-24P',
  'ArioRTU-C-H-24P',
  'ArioRTU-D-L-24P',
  'ArioRTU-A-M-32P',
  'ArioRTU-A-H-32P',
  'ArioRTU-B-L-32P',
  'ArioRTU-B-M-32P',
  'ArioRTU-B-H-32P',
  'ArioRTU-C-L-32P',
  'ArioRTU-C-M-32P',
  'ArioRTU-C-H-32P',
  'ArioRTU-D-L-32P',
  'ArioRTU-D-M-32P',
  'ArioRTU-D-H-32P',
  'ArioRTU-A-L-48P',
  'ArioRTU-A-M-48P',
  'ArioRTU-A-H-48P',
  'ArioRTU-B-L-48P',
  'ArioRTU-B-M-48P',
  'ArioRTU-B-H-48P',
  'ArioRTU-C-L-48P',
  'ArioRTU-C-M-48P',
  'ArioRTU-C-H-48P',
  'ArioRTU-D-L-48P',
  'ArioRTU-D-M-48P',
  'ArioRTU-D-H-48P',
  'ArioRTU-A-L-64P',
  'ArioRTU-A-M-64P',
  'ArioRTU-A-H-64P',
  'ArioRTU-B-L-64P',
  'ArioRTU-B-M-64P',
  'ArioRTU-B-H-64P',
  'ArioRTU-C-L-64P',
  'ArioRTU-C-M-64P',
  'ArioRTU-C-H-64P',
  'ArioRTU-D-L-64P',
  'ArioRTU-D-M-64P',
  'ArioRTU-D-H-64P',
  'ArioRTU-A-L-16P',
];
// --------------- component ---------------- component ------------- component -------
const Rowtext = ({name, value}: Rowtext) => {
  return (
    <div className="mb-[4px] flex flex-row">
      <span className="w-[162px] text-[18px] font-light leading-[24.2px]">
        {name}
      </span>
      <span className="text-[18px] font-light leading-[24.2px]">{value}</span>
    </div>
  );
};

const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  OTDRSECEND: Yup.string().required('Please enter Port'),
  OTDRFIRST: Yup.string().required('Please enter OTDR IP'),
  SWITCHSECEND: Yup.string().required('Please enter port'),
  SWITCHFIRST: Yup.string().required('Please enter ip'),
  ContactPerson: Yup.string().required('Please enter Contact Person'),
  DefaultGateway: Yup.string().required('Please enter Default Gateway'),
  model: Yup.string().required('Please enter model'),
  SubnetMask: Yup.string().required('Please enter Subnet Mask'),
});
// ------ main -------------------- main --------main -------------- main -----
const RtuCreatePage: FC = () => {
  const params = useParams<Iprops>();
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const {stationsrtu,defaultstationsrtu} = useSelector((state: RootState) => state.rtu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    state: {users},
    request,
  } = useHttpRequest({
    selector: state => ({
      users: state.http.userList,
    }),
    initialRequests: request => {
      request('userList', undefined);
    },
  });
  const formik = useFormik({
    validationSchema: rtuSchema,
    initialValues: {
      name: '',
      OTDRSECEND: '',
      OTDRFIRST: '',
      SWITCHSECEND: '',
      SWITCHFIRST: '',
      SubnetMask: '',
      model: '',
      ContactPerson: '',
      DefaultGateway: '',
    },

    onSubmit: async values => {
      //create an rtu for station
      try {
        setLoading(true);
        const creatertu = await $Post(`otdr/rtu/`, {
          name: values.name,
          model: values.model,
          station_id: params!.stationId! || '',
          contact_person_id: values.ContactPerson,
          otdr_ip: values.OTDRFIRST,
          otdr_port: Number(values.OTDRSECEND),
          switch_ip: values.SWITCHFIRST,
          switch_port: Number(values.SWITCHSECEND),
          subnet_mask: values.SubnetMask,
          default_gateway: values.DefaultGateway,
        });
        const getdata = await creatertu?.json();

        if (creatertu?.status == 201) {
          const stationsrtuCopy = deepcopy(stationsrtu);
          const defaultstationsrtuCopy = deepcopy(defaultstationsrtu);

         
          //Then we update the list of rtus of the station so that we can see the updated list of rtus in the left bar.
 if(params!.regionId != "1111"){
  const findrtu = stationsrtu.findIndex(
    (data: any) => data.stationid == params.stationId!,
  );
  if (findrtu > -1) {
    stationsrtuCopy[findrtu].rtues.push({
      name: getdata.name,
      id: getdata.id,
    });
  } else {
    stationsrtuCopy.push({
      stationid: params!.stationId!,
      networkid: params!.networkId!,
      regionid: params!.regionId!,
      rtues: [{name: getdata.name, id: getdata.id}],
      deletertues: [],
    });
  }
  setLoading(false);
  dispatch(setStationsrtu(stationsrtuCopy));
  navigate(
    `../../remote-test-units/${getdata.id}/${params!.stationId!}/${
      params!.regionId
    }/${params!.networkId!}`,
  );
 } else{
  const finddefaultstationrtu = defaultstationsrtu.findIndex(
    (data: any) => data.stationid == params.stationId!,
  );
  if (finddefaultstationrtu > -1) {
    defaultstationsrtuCopy[finddefaultstationrtu].rtues.push({
      name: getdata.name,
      id: getdata.id,
    });
  } else{
    defaultstationsrtuCopy.push({
      stationid: params!.stationId!,
      networkid: params!.networkId!,
      rtues: [{name: getdata.name, id: getdata.id}],
      deletertues: [],
    });
 
  }
  setLoading(false);
  dispatch(setdefaultStationsrtu(defaultstationsrtuCopy));
  navigate(
   `/config/remote-test-units/${getdata.id}/${params!.stationId}/${params!.networkId}/${params!.networkId}`
  );
 }
       
        } else {
          setErrortext(getdata.detail[0].msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });


  console.log("params!.regionId",params!.regionId);
  
  return (
    <div className="relative flex w-full flex-col">
      <span className="mb-6 mt-2 font-bold">Create rtu</span>
      <FormikProvider value={formik}>
        <Form className="flex w-[calc(100%-10px)] flex-grow flex-col gap-y-8">
          <div className="flex flex-grow flex-col gap-y-4">
            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Name">
              <InputFormik
                name="name"
                className="text-[18px] font-light leading-[24.2px]"
                wrapperClassName="w-3/5"
              />
            </Description>
            <Description
              labelClassName=" text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Model">
              <SelectFormik
                placeholder="select"
                name="model"
                className="w-[400px]">
                <option value="select" label="" className="hidden" />
                <option value={undefined} label="select" className="hidden" />
                {modallist.map((data: string, index: number) => (
                  <option
                    key={index}
                    label={data}
                    className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    {data}
                  </option>
                ))}
              </SelectFormik>
            </Description>

            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Contact Person">
              <SelectFormik
                placeholder="select"
                name="ContactPerson"
                className="w-[400px]">
                <option value="select" label="" className="hidden" />
                <option value={undefined} label="select" className="hidden" />
                {users &&
                  users.data?.map((data, index) => (
                    <option
                      key={index}
                      value={data.id}
                      label={data.username}
                      className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                      {data.username}
                    </option>
                  ))}
              </SelectFormik>
            </Description>

            <div className="mb-[4px] flex w-full flex-row">
              <div className="flex w-[50%] flex-row items-center xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] mt-[-10px] font-light leading-[24.2px]"
                  label="OTDR IP & Port">
                  <InputFormik
                    name="OTDRFIRST"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  type="number"
                  name="OTDRSECEND"
                  wrapperClassName="w-[70px] ml-[15px] text-[18px] font-light leading-[24.2px]"
                />
              </div>

              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="w-[70%]"
                  labelClassName="text-[18px] font-light mt-[-10px]  leading-[24.2px]"
                  label="Switch IP & Port">
                  <InputFormik
                    name="SWITCHFIRST"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  type="number"
                  name="SWITCHSECEND"
                  wrapperClassName="w-[70px] ml-[15px] text-[18px] font-light leading-[24.2px]"
                />
              </div>
            </div>

            <div className="mb-[4px] flex w-full flex-row">
              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Subnet Mask">
                  <InputFormik
                    name="SubnetMask"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                    onChange={value => {
                      formik.setFieldValue('SubnetMask', value);
                    }}
                  />
                </Description>
              </div>

              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="w-[70%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Default Gateway">
                  <InputFormik
                    name="DefaultGateway"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
              </div>
            </div>
            <div className="mb-[4px] flex w-full flex-row">
              <span className="text-[18px] font-light leading-[24.2px]">
                Connection
              </span>
              <span className="ml-[65px] text-[18px] font-light leading-[24.2px] text-[#0E9836]">
                Online
              </span>
              <Checkbox
                onclick={() => {}}
                classname={'w-[24px] h-[24px] ml-[100px]'}
              />
              <span className="ml-[10px] text-[18px] font-light leading-[24.2px]">
                Manual Offline
              </span>
            </div>
            <div className="mb-[4px] flex w-full flex-row">
              <span className="text-[18px] font-light leading-[24.2px]">
                Status
              </span>
              <span className="ml-[110px] text-[18px] font-light  leading-[24.2px]">
                Idle
              </span>
              <Checkbox
                onclick={() => {}}
                classname={'w-[24px] h-[24px] ml-[122px]'}
              />
              <span className="ml-[10px] text-[18px] font-light leading-[24.2px]">
                Manual Stop
              </span>
            </div>

            {/* --------------------------------------------------- */}
          </div>
          <div className="flex flex-col">
            {errortext.length > 0 ? (
              <span className="text-[20px] text-[red]">{errortext}</span>
            ) : null}

            <div className="flex w-[calc(100%-10px)] flex-row justify-end">
              <SimpleBtn loading={loading} className="mr-2" type="submit">
                Save
              </SimpleBtn>
              <SimpleBtn>Cancel</SimpleBtn>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RtuCreatePage;
