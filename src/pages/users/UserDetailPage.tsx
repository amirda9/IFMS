import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Description, ControlledSelect, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import dayjs from 'dayjs';
import {RegionListType, StationListType, UserDetailFormType} from '~/types';
import {toast} from 'react-toastify';

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

const UsersDetailPage: FC = () => {
  const {userId} = useParams();

  // List of the region items shown in the regions dropdown
  const [regionOptions, setRegionOptions] = useState<RegionOptionType[]>([]);
  // List of the station items shown in the stations dropdown
  const [stationOptions, setStationOptions] = useState<StationOptionType[]>([]);

  // Used to fetch user data and populate the form
  const userDetailQuery = useHttpRequest({
    selector: state => state.http.userDetail,
    initialRequests: request => {
      request('userDetail', {params: {user_id: userId!}});
    },
    onUpdate: (lastState, state) => {
      if (
        lastState?.httpRequestStatus === 'loading' &&
        state?.httpRequestStatus === 'success' &&
        state.data
      ) {
        formik.setValues({
          name: state.data.name || '',
          username: state.data.username,
          telephone: state.data.telephone || '',
          mobile: state.data.mobile || '',
          email: state.data.email,
          address: state.data.address || '',
          comment: state.data.comment || '',
          region_id: state.data.region?.id || '',
          station_id: state.data.station?.id || '',
        });
      }
    },
  });

  // Used to update user data when save button is clicked
  const userDetailMutation = useHttpRequest({
    selector: state => state.http.userDetailUpdate,
  });

  // Used to fetch the regions needed to show on the regions dropdown
  const allRegionsQuery = useHttpRequest({
    selector: state => state.http.allRegions,
    initialRequests: request => {
      request('allRegions', undefined);
    },
  });

  // Used to fetch the stations available inside a selected region; will fetch the data in a useEffect
  const allStationsQuery = useHttpRequest({
    selector: state => state.http.regionStationList,
  });

  useEffect(() => {
    userDetailQuery.request('userDetail', {params: {user_id: userId!}});
    setStationOptions([]);
  }, [userId]);

  useEffect(() => {
    if (userDetailMutation.state?.httpRequestStatus === 'success') {
      toast('User updated successfully.', {type: 'success'});
    } else if (userDetailMutation.state?.httpRequestStatus === 'error') {
      if (userDetailMutation.state.error!.status === 422)
        toast('Validation Error', {type: 'error'});
      else
        toast(userDetailMutation.state.error!.data?.detail as string, {
          type: 'error',
        });
    }
  }, [userDetailMutation.state]);

  // Setting the region list from the fetched data
  useEffect(() => {
    if (allRegionsQuery.state?.httpRequestStatus === 'success') {
      const regionsToSet: RegionOptionType[] = allRegionsQuery.state.data!.map(
        item => ({
          label: item.name,
          payload: item,
        }),
      );
      regionsToSet.unshift({label: 'None', payload: null});
      setRegionOptions(regionsToSet);
    }
  }, [allRegionsQuery.state]);

  // Setting the station list from the fetched data
  useEffect(() => {
    if (allStationsQuery.state?.httpRequestStatus === 'success') {
      const stationsToSet: StationOptionType[] =
        allStationsQuery.state.data!.map(item => ({
          label: item.name,
          payload: item,
        }));
      stationsToSet.unshift({label: 'None', payload: null});
      setStationOptions(stationsToSet);
    }
  }, [allStationsQuery.state]);

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

    userDetailMutation.request('userDetailUpdate', {
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
      allRegionsQuery.request('regionStationList', {
        params: {region_id: formik.values.region_id},
      });
    }
  }, [formik.values.region_id]);

  return (
    <div className="flex flex-grow flex-col gap-4">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="ID" items="start">
              <span className="mb-4">{userId}</span>
            </Description>

            <Description label="Username" items="start">
              <InputFormik
                name="username"
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

            <div className="flex">
              <Description label="Region">
                <ControlledSelect
                  options={regionOptions}
                  onChange={regionId => {
                    formik.setFieldValue('region_id', regionId);
                  }}
                  setValueProp={option => option.payload?.id || ''}
                  value={formik.values.region_id || ''}
                />
              </Description>

              {stationOptions.length > 0 && (
                <Description label="Station">
                  <ControlledSelect
                    options={stationOptions}
                    onChange={stationId => {
                      formik.setFieldValue('station_id', stationId);
                    }}
                    setValueProp={option => option.payload?.id || ''}
                    value={formik.values.station_id || ''}
                  />
                </Description>
              )}
            </div>

            <div className="mt-4 flex">
              {userDetailQuery.state?.data?.time_created && (
                <Description label="Created">
                  {dayjs(userDetailQuery.state.data.time_created).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
                </Description>
              )}

              {userDetailQuery.state?.data?.time_updated && (
                <Description label="Last Modified">
                  {dayjs(userDetailQuery.state?.data?.time_updated).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
                </Description>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-x-2 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default UsersDetailPage;
