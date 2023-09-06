import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Description, ControlledSelect, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useAppSelector, useHttpRequest} from '~/hooks';
import dayjs from 'dayjs';
import {RegionListType, StationListType, UserDetailFormType} from '~/types';
import {toast} from 'react-toastify';
import {UserRole} from '~/constant/users';

type RegionOptionType = {label: string; payload: RegionListType | null};
type StationOptionType = {label: string; payload: StationListType | null};

const initialValues: UserDetailFormType = {
  username: '',
  name: '',
  telephone: '',
  mobile: '',
  email: '',
  address: '',
  comment: '',
  region_id: '',
  station_id: '',
};

const UsersDetailsPage: FC = () => {
  const {userId} = useParams();

  const userRole = useAppSelector(state => state.http.verifyToken?.data?.role);

  // List of the region items shown in the regions dropdown
  const [regionOptions, setRegionOptions] = useState<RegionOptionType[]>([]);
  // List of the station items shown in the stations dropdown
  const [stationOptions, setStationOptions] = useState<StationOptionType[]>([]);

  // Used to fetch the regions needed to show on the regions dropdown
  const {
    request,
    state: {userDetail},
  } = useHttpRequest({
    selector: state => ({
      userDetail: state.http.userDetail,
      userDetailUpdate: state.http.userDetailUpdate,
      allRegions: state.http.allRegions,
      allStations: state.http.allStations,
    }),
    initialRequests: request => {
      request('allRegions', undefined);
      request('userDetail', {params: {user_id: userId!}});
    },
    onUpdate: (lastState, state) => {
      // Setting fetched user detail values
      if (
        lastState.userDetail?.httpRequestStatus === 'loading' &&
        state.userDetail?.httpRequestStatus === 'success' &&
        state.userDetail.data
      ) {
        formik.setValues({
          name: state.userDetail.data.name || '',
          username: state.userDetail.data.username,
          telephone: state.userDetail.data.telephone || '',
          mobile: state.userDetail.data.mobile || '',
          email: state.userDetail.data.email,
          address: state.userDetail.data.address || '',
          comment: state.userDetail.data.comment || '',
          region_id: state.userDetail.data.region?.id || '',
          station_id: state.userDetail.data.station?.id || '',
        });
      }

      // Showing API response to the user
      if (lastState.userDetailUpdate?.httpRequestStatus === 'loading') {
        if (state.userDetailUpdate?.httpRequestStatus === 'success') {
          toast('User updated successfully.', {type: 'success'});
        } else if (state.userDetailUpdate?.httpRequestStatus === 'error') {
          if (state.userDetailUpdate.error!.status === 422)
            toast('Validation Error', {type: 'error'});
          else
            toast(
              (state.userDetailUpdate.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {
                type: 'error',
              },
            );
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

      // Setting the station list from the fetched and then filtered data
      if (state.allStations?.httpRequestStatus === 'success') {
        const stationsToSet: StationOptionType[] = state.allStations
          .data!.filter(item => item.region_id === formik.values.region_id)
          .map(item => ({
            label: item.name,
            payload: item,
          }));
        stationsToSet.unshift({label: 'None', payload: null});
        setStationOptions(stationsToSet);
      }
    },
  });

  useEffect(() => {
    request('userDetail', {params: {user_id: userId!}});
    setStationOptions([]);
  }, [userId]);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required.')
      .min(3, 'Username must be longer than 3 characters.'),
    name: Yup.string(),
    email: Yup.string().email('Please provide a valid email.'),
    telephone: Yup.string(),
    mobile: Yup.string(),
    address: Yup.string(),
    comment: Yup.string(),
    region: Yup.string(),
    station: Yup.string(),
  });

  const handleSaveUserDetailClick = (values: UserDetailFormType) => {
    const valuesToSend = {
      username: values.username,
      name: values.name,
      telephone: values.telephone,
      mobile: values.mobile,
      email: values.email,
      address: values.address,
      comment: values.comment,
      region_id: values.region_id || null,
      station_id: values.station_id || null,
    };

    request('userDetailUpdate', {
      params: {user_id: userId!},
      data: valuesToSend,
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
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col">
            <Description label="ID" items="start">
              <span className="mb-4">{userId}</span>
            </Description>

            <Description label="Username" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <InputFormik
                  name="username"
                  wrapperClassName="w-full"
                  className="disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              ) : (
                <span>{userDetail?.data?.username}</span>
              )}
            </Description>

            <Description label="Name" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <InputFormik
                  name="name"
                  wrapperClassName="w-full"
                  className="disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              ) : (
                <span>{userDetail?.data?.name}</span>
              )}
            </Description>

            <Description label="Telephone" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <InputFormik
                  name="telephone"
                  wrapperClassName="w-full"
                  className="disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              ) : (
                <span>{userDetail?.data?.telephone}</span>
              )}
            </Description>

            <Description label="Mobile" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <InputFormik
                  name="mobile"
                  wrapperClassName="w-full"
                  className="disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              ) : (
                <span>{userDetail?.data?.mobile}</span>
              )}
            </Description>

            <Description label="Email" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <InputFormik
                  name="email"
                  wrapperClassName="w-full"
                  className="disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              ) : (
                <span>{userDetail?.data?.email}</span>
              )}
            </Description>

            <Description label="Address" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <TextareaFormik name="address" className="w-full" />
              ) : (
                <span>{userDetail?.data?.address}</span>
              )}
            </Description>

            <Description label="Comment" items="start">
              {userRole === UserRole.SUPER_USER ? (
                <TextareaFormik name="comment" className="w-full" />
              ) : (
                <span>{userDetail?.data?.comment}</span>
              )}
            </Description>

            <Description label="Region" className="mb-5">
              {userRole === UserRole.SUPER_USER ? (
                <ControlledSelect
                  options={regionOptions}
                  onChange={regionId => {
                    formik.setFieldValue('region_id', regionId);
                  }}
                  setValueProp={option => option.payload?.id || ''}
                  value={formik.values.region_id || ''}
                  className="min-w-[19rem]"
                />
              ) : (
                <span>{userDetail?.data?.region?.name}</span>
              )}
            </Description>

            <Description label="Station" className="mb-5">
              {userRole === UserRole.SUPER_USER ? (
                <ControlledSelect
                  options={stationOptions}
                  onChange={stationId => {
                    formik.setFieldValue('station_id', stationId);
                  }}
                  setValueProp={option => option.payload?.id || ''}
                  value={formik.values.station_id || ''}
                  className="min-w-[19rem]"
                />
              ) : (
                <span>{userDetail?.data?.station?.name}</span>
              )}
            </Description>

            <div className="flex w-full justify-between">
              {userDetail?.data?.time_created && (
                <Description label="Created">
                  {dayjs(userDetail.data.time_created).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
                </Description>
              )}

              {userDetail?.data?.time_updated && (
                <Description label="Last Modified" className="self-end">
                  {dayjs(userDetail?.data?.time_updated).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
                </Description>
              )}
            </div>
          </div>
          {userRole === UserRole.SUPER_USER && (
            <div className="flex flex-row gap-x-4 self-end">
              <SimpleBtn type="submit">Save</SimpleBtn>
              <SimpleBtn link to="../">
                Cancel
              </SimpleBtn>
            </div>
          )}
        </Form>
      </FormikProvider>
    </div>
  );
};

export default UsersDetailsPage;
