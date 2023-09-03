import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import {RegionListType, StationListType, UserDetailFormType} from '~/types';

type RegionOptionType = {label: string; payload: RegionListType | null};
type StationOptionType = {label: string; payload: StationListType | null};

type FormType = UserDetailFormType & {
  password: string;
  passwordConfirmation: string;
};

const initialValues: FormType = {
  username: '',
  password: '',
  passwordConfirmation: '',
  name: '',
  telephone: '',
  mobile: '',
  email: '',
  address: '',
  comment: '',
  region_id: '',
  station_id: '',
};

const UserRegisterPage: FC = () => {
  // List of the region items shown in the regions dropdown
  const [regionOptions, setRegionOptions] = useState<RegionOptionType[]>([]);
  // List of the station items shown in the stations dropdown
  const [stationOptions, setStationOptions] = useState<StationOptionType[]>([]);

  const {
    request,
    state: {userRegister, allRegions, allStations},
  } = useHttpRequest({
    selector: state => ({
      userRegister: state.http.userRegister,
      allRegions: state.http.allRegions,
      allStations: state.http.allStations,
    }),
    initialRequests: request => {
      request('allRegions', undefined);
    },
    onUpdate: (lastState, state) => {
      if (lastState.userRegister?.httpRequestStatus === 'loading') {
        if (state.userRegister?.httpRequestStatus === 'success') {
          toast('User was registered successfully', {type: 'success'});
        } else if (state.userRegister?.httpRequestStatus === 'error') {
          if (state.userRegister.error?.status === 422) {
          } else {
            toast(
              (state.userRegister.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {type: 'error'},
            );
          }
        }
      }

      // Setting the region list from the fetched data
      if (state.allRegions?.httpRequestStatus === 'success') {
        const regionsToSet: RegionOptionType[] = state.allRegions.data!.map(
          item => ({
            label: item.name,
            payload: item,
          }),
        );
        regionsToSet.unshift({label: 'None', payload: null});
        setRegionOptions(regionsToSet);
      }

      // Setting the station list from the fetched and filtered data
      if (state.allStations?.httpRequestStatus === 'success') {
        const stationsToSet: StationOptionType[] = state.allStations.data!.map(
          item => ({
            label: item.name,
            payload: item,
          }),
        );
        stationsToSet.unshift({label: 'None', payload: null});
        setStationOptions(stationsToSet);
      }
    },
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required.')
      .min(3, 'Username must be longer than 3 characters.'),
    name: Yup.string(),
    password: Yup.string().required('Password is required.'),
    passwordConfirmation: Yup.string()
      .required('Please repeat your password.')
      .oneOf([Yup.ref('password')], 'Passwords must match.'),
    email: Yup.string().email('Please provide a valid email.'),
    telephone: Yup.string(),
    mobile: Yup.string(),
    address: Yup.string(),
    comment: Yup.string(),
    region_id: Yup.string(),
    station_id: Yup.string(),
  });

  const handleSaveUserDetailClick = (values: FormType) => {
    request('userRegister', {
      data: {
        username: values.username,
        password: values.password,
        confirm_password: values.passwordConfirmation,
        name: values.name,
        email: values.email,
        telephone: values.telephone,
        mobile: values.mobile,
        address: values.address,
        comment: values.comment,
        region_id: values.region_id,
        station_id: values.station_id,
      },
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSaveUserDetailClick,
  });

  useEffect(() => {
    if (formik.values.region_id) {
      request('allStations', undefined);
    }
  }, [formik.values.region_id]);

  return (
    <div className="flex flex-grow flex-col gap-4">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="Username" items="start">
              <InputFormik
                name="username"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Password" items="start">
              <InputFormik
                name="password"
                type="password"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Confirm Password" items="start">
              <InputFormik
                name="passwordConfirmation"
                type="password"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Telephone" items="start">
              <InputFormik
                name="telephone"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Mobile" items="start">
              <InputFormik
                name="mobile"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Email" items="start">
              <InputFormik
                name="email"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Address" items="start">
              <TextareaFormik name="address" className="w-2/3" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-2/3" />
            </Description>

            <Description label="Region" className="mb-5">
              <ControlledSelect
                options={regionOptions}
                onChange={regionId => {
                  formik.setFieldValue('region_id', regionId);
                }}
                setValueProp={option => option.payload?.id || ''}
                value={formik.values.region_id || ''}
                className="min-w-[19rem]"
              />
            </Description>

            {stationOptions.length > 0 && (
              <Description label="Station" className="mb-5">
                <ControlledSelect
                  options={stationOptions}
                  onChange={stationId => {
                    formik.setFieldValue('station_id', stationId);
                  }}
                  setValueProp={option => option.payload?.id || ''}
                  value={formik.values.station_id || ''}
                  className="min-w-[19rem]"
                />
              </Description>
            )}
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn
              loading={userRegister?.httpRequestStatus === 'loading'}
              type="submit">
              Save
            </SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default UserRegisterPage;
