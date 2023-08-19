import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Description, Select, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import dayjs from 'dayjs';
import {RegionListType, UserDetailFormType} from '~/types';
import {toast} from 'react-toastify';

type RegionOptionType = {label: string; payload: RegionListType | null};

const UsersDetailPage: FC = () => {
  const {userId} = useParams();

  const [regionList, setRegionList] = useState<RegionOptionType[]>([]);

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

  const userDetailMutation = useHttpRequest({
    selector: state => state.http.userDetailUpdate,
  });

  const allRegionsQuery = useHttpRequest({
    selector: state => state.http.allRegions,
    initialRequests: request => {
      request('allRegions', undefined);
    },
  });

  useEffect(() => {
    if (allRegionsQuery.state?.httpRequestStatus === 'success') {
      const regionsToSet: RegionOptionType[] = allRegionsQuery.state.data!.map(
        item => ({
          label: item.name,
          payload: item,
        }),
      );
      regionsToSet.unshift({label: 'None', payload: null});
      setRegionList(regionsToSet);
    }
  }, [allRegionsQuery.state]);

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
    userDetailQuery.request('userDetail', {params: {user_id: userId!}});
  }, [userId]);

  useEffect(() => {
    console.log('userDetailMutation.state:', userDetailMutation.state);
    if (userDetailMutation.state?.httpRequestStatus === 'success') {
      toast('User updated successfully.', {type: 'success'});
    } else if (userDetailMutation.state?.httpRequestStatus === 'error') {
      if (userDetailMutation.state.error!.status === 422)
        toast('Validation Error', {type: 'error'});
      else
        toast(userDetailMutation.state.error!.data.detail as string, {
          type: 'error',
        });
    }
  }, [userDetailMutation.state]);

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

            <Description label="Region">
              <Select
                options={regionList}
                onChange={regionId =>
                  formik.setFieldValue('region_id', regionId)
                }
                setValueProp={option => option.payload?.id || ""}
                value={formik.values.region_id || ''}
              />
            </Description>

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
