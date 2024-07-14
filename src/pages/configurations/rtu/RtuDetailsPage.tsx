import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
  Description,
  Select,
  SimpleBtn,
} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import {InputFormik} from '~/container';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {RootState} from '~/store';
import {useDispatch, useSelector} from 'react-redux';
import {UserRole} from '~/constant/users';
import {deepcopy} from '~/util';
import {setStationsrtu, setrtugetdetailStatus} from '~/store/slices/rtu';
import {$Get, $Put} from '~/util/requestapi';
import { toast } from 'react-toastify';

const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  OTDRFIRST: Yup.string().required('Please enter OTDR IP'),
  SWITCHFIRST: Yup.string().required('Please enter Switch IP'),
  SubnetMask: Yup.string().required('Please enter Subnet Mask'),
  DefaultGateway: Yup.string().required('Please enter Default Gateway'),
});

type Rowtext = {
  name: string;
  value: string;
};

type Iprops = {
  rtuId: string;
  stationId: string;
  regionId: string;
  networkId: string;
};
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

const RtuDetailsPage: FC = () => {
  const dispatch = useDispatch();
  const params = useParams<Iprops>();
  const [loading, setLoading] = useState(false);
  const [rtuDetail, setRtuDetail] = useState<any>([]);
  const {
    stationsrtu,
    rtunetworkidadmin,
    rturegionidadmin,
    rtustationidadmin,
  } = useSelector((state: RootState) => state.rtu);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {
    state: {users},
    request,
  } = useHttpRequest({
    selector: state => ({
      rtuDetail: state.http.rtuDetail,
      users: state.http.userList,
    }),
    initialRequests: request => {
      request('userList', undefined);
    },
  });

  console.log('rtuDetail?.httpRequestStatus', rtuDetail?.httpRequestStatus);

  const getrtudetail = async () => {
    try {
   
      setLoading(true);
      const getrturesponse = await $Get(`otdr/rtu/${params?.rtuId!}`);
      if (getrturesponse?.status == 200) {
        dispatch(setrtugetdetailStatus(true));
        setLoading(false);
        const responsedata = await getrturesponse.json();
        setRtuDetail(responsedata);
      }
    } catch (error) {
      console.log(`error is :${error}`);
    }
  };
  useEffect(() => {
    getrtudetail();
  }, []);
  const formik = useFormik({
    validationSchema: rtuSchema,
    enableReinitialize: true,
    initialValues: {
      name: rtuDetail?.name || '',
      OTDRSECEND: rtuDetail?.otdr_port || 0,
      OTDRFIRST: rtuDetail?.otdr_ip || '',
      SWITCHSECEND: rtuDetail?.switch_port || 0,
      SWITCHFIRST: rtuDetail?.switch_ip || '',
      SubnetMask: rtuDetail?.subnet_mask || '',
      model: rtuDetail?.model || '',
      ContactPerson: rtuDetail?.contact_person || '',
      DefaultGateway: rtuDetail?.default_gateway || '',
      time_created: rtuDetail?.time_created || '',
      time_updated: rtuDetail?.time_updated || '',
      owner: {
        id: rtuDetail?.owner?.id,
        username: rtuDetail?.owner?.username,
      } || {id: '', username: ''},
    },
    onSubmit: async() => {
      try {
        setLoading(true)
        const updatertuportsresponse=await $Put(`otdr/rtu/${params?.rtuId!}`,{
          name: formik.values.name,
          model: formik.values.model,
          station_id: rtuDetail?.station_id || '',
          contact_person_id: rtuDetail?.contact_person_id || '',
          otdr_ip: formik.values.OTDRFIRST,
          otdr_port: formik.values.OTDRSECEND,
          switch_ip: formik.values.SWITCHFIRST,
          switch_port: formik.values.SWITCHSECEND,
          subnet_mask: formik.values.SubnetMask,
          default_gateway: formik.values.DefaultGateway,
        }
        )
        if(updatertuportsresponse?.status == 201){
          toast('It was done successfully', {
            type: 'success',
            autoClose: 1000,
          });
          getrtudetail()
        }else{
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
   
      request('rtuUpdate', {
        params: {rtu_id: params?.rtuId! || ''},
        data: {
          name: formik.values.name,
          model: formik.values.model,
          station_id: rtuDetail?.station_id || '',
          contact_person_id: rtuDetail?.contact_person_id || '',
          otdr_ip: formik.values.OTDRFIRST,
          otdr_port: formik.values.OTDRSECEND,
          switch_ip: formik.values.SWITCHFIRST,
          switch_port: formik.values.SWITCHSECEND,
          subnet_mask: formik.values.SubnetMask,
          default_gateway: formik.values.DefaultGateway,
        },
      });
      const stationsrtuCopy = deepcopy(stationsrtu);
      const findstationrtuindex = stationsrtu.findIndex(
        data => data.stationid == rtuDetail?.station_id || '',
      );
      const findrtuid = stationsrtu[findstationrtuindex]?.rtues?.findIndex(
        data => data.id == params?.rtuId!,
      );
      stationsrtuCopy[findstationrtuindex].rtues[findrtuid].name =
        formik.values.name;
      dispatch(setStationsrtu(stationsrtuCopy));
    },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="flex w-[calc(100%-10px)] flex-grow overflow-x-hidden">
      <FormikProvider value={formik}>
        <Form className="flex flex-grow flex-col gap-y-8">
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
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Model">
              <Select
                onChange={e => formik.setFieldValue('model', e.target.value)}
                className="w-[400px]">
                <option value="" className="hidden">
                  {rtuDetail?.model || ''}
                </option>
                <option value={undefined} className="hidden">
                  {rtuDetail?.model || ''}
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  model1
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  model2
                </option>
              </Select>
            </Description>
            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Contact Person">
              <Select
                onChange={e =>
                  formik.setFieldValue('ContactPerson', e.target.value)
                }
                className="w-[400px]">
                <option value="" className="hidden">
                  {rtuDetail?.contact_person?.username || ''}
                </option>
                <option value={undefined} className="hidden">
                  {rtuDetail?.contact_person?.username || ''}
                </option>
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
              </Select>
            </Description>
            <div className="mb-[4px] flex w-full flex-row">
              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="OTDR IP & Port">
                  <InputFormik
                    defaultValue={formik.values.OTDRFIRST}
                    name="OTDRFIRST"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  defaultValue={formik.values.OTDRSECEND}
                  type="number"
                  name="OTDRSECEND"
                  wrapperClassName="w-[70px] ml-[15px] text-[18px] font-light leading-[24.2px]"
                />
              </div>

              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="w-[70%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Switch IP & Port">
                  <InputFormik
                    defaultValue={formik.values.SWITCHFIRST}
                    name="SWITCHFIRST"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  defaultValue={formik.values.SWITCHSECEND}
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
                    defaultValue={formik.values.SubnetMask}
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
                    defaultValue={formik.values.DefaultGateway}
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

            <Rowtext name="Last Comm." value="2023-12-30 14:29:45" />
            <Rowtext name="Last  Sync" value="2023-12-30 14:29:45" />
            <Rowtext
              name="Created"
              value={getPrettyDateTime(formik.values.time_created)}
            />
            <Rowtext
              name="Last Modified"
              value={getPrettyDateTime(formik.values.time_updated)}
            />
            <Rowtext name="Owner" value={formik.values.owner.username || ''} />
            {/* --------------------------------------------------- */}
          </div>
          <div className="flex w-[calc(100%-60px)] justify-end gap-x-4">
            {loggedInUser.role === UserRole.SUPER_USER ||
            rtunetworkidadmin.includes(params?.networkId!) ||
            rturegionidadmin.includes(params?.regionId!) ||
            rtustationidadmin.includes(params?.rtuId!) ? (
              <SimpleBtn type="submit">Save</SimpleBtn>
            ) : null}
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RtuDetailsPage;
