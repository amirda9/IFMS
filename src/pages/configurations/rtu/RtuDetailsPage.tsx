import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {
  ControlledSelect,
  Description,
  Select,
  SimpleBtn,
  TextInput,
} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import {InputFormik} from '~/container';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {RootState} from '~/store';
import {useDispatch, useSelector} from 'react-redux';
import {UserRole} from '~/constant/users';
import { deepcopy } from '~/util';
import { setStationsrtu } from '~/store/slices/rtu';

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
  const dispatch=useDispatch()
  const params = useParams();
  const {
    stationsrtu,
    regionstations,
    networkregions,
    rtunetworkidadmin,
    rturegionidadmin,
    rtustationidadmin,
  } = useSelector((state: RootState) => state.rtu);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {
    state: {rtuDetail, users},
    request,
  } = useHttpRequest({
    selector: state => ({
      rtuDetail: state.http.rtuDetail,
      users: state.http.userList,
      update: state.http.rtuUpdate,
    }),
    initialRequests: request => {
      request('rtuDetail', {
        params: {rtu_Id: params?.rtuId?.split('_')[0] || ''},
      });

      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update?.httpRequestStatus === 'success'
      ) {
        request('rtuDetail', {
          params: {rtu_Id: params?.rtuId?.split('_')[0] || ''},
        });
      }
    },
  });

  const formik = useFormik({
    validationSchema: rtuSchema,
    enableReinitialize: true,
    initialValues: {
      name: rtuDetail?.data?.name || '',
      OTDRSECEND: rtuDetail?.data?.otdr_port || 0,
      OTDRFIRST: rtuDetail?.data?.otdr_ip || '',
      SWITCHSECEND: rtuDetail?.data?.switch_port || 0,
      SWITCHFIRST: rtuDetail?.data?.switch_ip || '',
      SubnetMask: rtuDetail?.data?.subnet_mask || '',
      model: rtuDetail?.data?.model || '',
      ContactPerson: rtuDetail?.data?.contact_person || '',
      DefaultGateway: rtuDetail?.data?.default_gateway || '',
      time_created: rtuDetail?.data?.time_created || '',
      time_updated: rtuDetail?.data?.time_updated || '',
      owner: {
        id: rtuDetail?.data?.owner.id,
        username: rtuDetail?.data?.owner.username,
      } || {id: '', username: ''},
    },
    onSubmit: () => {
    
      request('rtuUpdate', {
        params: {rtu_id: params?.rtuId?.split('_')[0] || ''},
        data: {
          name: formik.values.name,
          model: formik.values.model,
          station_id: rtuDetail?.data?.station_id || '',
          contact_person_id: rtuDetail?.data?.contact_person_id || '',
          otdr_ip: formik.values.OTDRFIRST,
          otdr_port: formik.values.OTDRSECEND,
          switch_ip: formik.values.SWITCHFIRST,
          switch_port: formik.values.SWITCHSECEND,
          subnet_mask: formik.values.SubnetMask,
          default_gateway: formik.values.DefaultGateway,
        },
      });
      const stationsrtuCopy=deepcopy(stationsrtu)
      const findstationrtuindex=stationsrtu.findIndex(data => data.stationid == rtuDetail?.data?.station_id || "")
       const findrtuid=stationsrtu[findstationrtuindex].rtues.findIndex(data => data.id == params?.rtuId?.split('_')[0]!)
       stationsrtuCopy[findstationrtuindex].rtues[findrtuid].name=formik.values.name
       dispatch(setStationsrtu(stationsrtuCopy))
      },
  });

  if(rtuDetail?.httpRequestStatus == "loading"){
    return <h1>Loading...</h1>
  }
  return (
    <div className="flex flex-grow w-[calc(100%-10px)] overflow-x-hidden">
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
                  {rtuDetail?.data?.model || ''}
                </option>
                <option value={undefined} className="hidden">
                  {rtuDetail?.data?.model || ''}
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
                  {rtuDetail?.data?.contact_person?.username || ''}
                </option>
                <option value={undefined} className="hidden">
                  {rtuDetail?.data?.contact_person?.username || ''}
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
          <div className="flex gap-x-4 justify-end w-[calc(100%-60px)]">
            {loggedInUser.role === UserRole.SUPER_USER ||
            rtunetworkidadmin.includes(params?.rtuId?.split('_')[2]!) ||
            rturegionidadmin.includes(params?.rtuId?.split('_')[3]!) ||
            rtustationidadmin.includes(params?.rtuId?.split('_')[0]!) ? (
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
