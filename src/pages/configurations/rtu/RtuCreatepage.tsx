import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {setStationsrtu} from './../../../store/slices/rtu';
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
  const params = useParams();
  const [errortext, setErrortext] = useState('');
  const {stationsrtu} = useSelector((state: RootState) => state.rtu);
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
        const creatertu = await $Post(`otdr/rtu/`, {
          name: values.name,
          model: values.model,
          station_id: params!.id!.split('_')[0] || '',
          contact_person_id: values.ContactPerson,
          otdr_ip: values.OTDRFIRST,
          otdr_port: Number(values.OTDRSECEND),
          switch_ip: values.SWITCHFIRST,
          switch_port: Number(values.SWITCHSECEND),
          subnet_mask: values.SubnetMask,
          default_gateway: values.DefaultGateway,
        });
        const getdata = await creatertu.json();

        if (creatertu.status == 201) {
          const stationsrtuCopy = deepcopy(stationsrtu);

          const findrtu = stationsrtu.findIndex(
            (data: any) => data.stationid == params!.id!.split('_')[0],
          );
          //Then we update the list of rtus of the station so that we can see the updated list of rtus in the left bar.

          if (findrtu > -1) {
            stationsrtuCopy[findrtu].rtues.push({
              name: getdata.name,
              id: getdata.id,
            });
          } else {
            stationsrtuCopy.push({
              stationid: params!.id!.split('_')[0],
              networkid: params!.id!.split('_')[2],
              regionid: params!.id!.split('_')[1],
              rtues: [{name: getdata.name, id: getdata.id}],
              deletertues: [],
            });
          }
          dispatch(setStationsrtu(stationsrtuCopy));
          navigate(
            `../../remote-test-units/${getdata.id}_${
              params!.id!.split('_')[0]
            }`,
          );
        } else {
          setErrortext(getdata.detail[0].msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="relative flex flex-col">
      <span className="mb-6 mt-2 font-bold">Create rtu</span>
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
              labelClassName=" text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Model">
              <SelectFormik
                placeholder="select"
                name="model"
                className="w-[400px]">
                <option value="select" label="" className="hidden" />
                <option value={undefined} label="select" className="hidden" />

                <option
                  key={0}
                  label={'model1'}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  model1
                </option>
                <option
                  key={2}
                  label={'model2'}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  model2
                </option>
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
              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
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
                  labelClassName="text-[18px] font-light leading-[24.2px]"
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

            <div className="flex gap-x-4 self-end">
              <SimpleBtn type="submit">Save</SimpleBtn>
              <SimpleBtn>Cancel</SimpleBtn>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RtuCreatePage;
