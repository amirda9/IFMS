import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import dayjs from 'dayjs';
import {UserDetailFormType} from '~/types';
import {toast} from 'react-toastify';

const UsersDetailPage: FC = () => {
  const {userId} = useParams();

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
        formik.setFieldValue('id', state.data.id);
        formik.setFieldValue('name', state.data.name || '');
        formik.setFieldValue('username', state.data.username);
        formik.setFieldValue('email', state.data.email);
        formik.setFieldValue('station', state.data.station?.name || '');
        formik.setFieldValue('region', state.data.region?.name || '');
        formik.setFieldValue('telephone', state.data.telephone || '');
        formik.setFieldValue('mobile', state.data.mobile || '');
        formik.setFieldValue('address', state.data.address || '');
        formik.setFieldValue('comment', state.data.comment || '');
      }
    },
  });

  const userDetailMutation = useHttpRequest({
    selector: state => state.http.userDetailUpdate,
  });

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
    region: '',
    station: '',
  };

  const handleSaveUserDetailClick = (values: UserDetailFormType) => {
    console.log('values:', values);

    userDetailMutation.request('userDetailUpdate', {
      params: {user_id: userId!},
      data: values,
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
            <Description label="ID" labelClassName="mt-2" items="start">
              <span className="mb-4">{userId}</span>
            </Description>

            <Description label="Username" labelClassName="mt-2" items="start">
              <InputFormik
                name="username"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Telephone" labelClassName="mt-2" items="start">
              <InputFormik
                name="telephone"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Mobile" labelClassName="mt-2" items="start">
              <InputFormik
                name="mobile"
                wrapperClassName="w-2/3"
                className="disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Email" labelClassName="mt-2" items="start">
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
              {userDetailQuery.state?.data?.time_created && (
                <Description label="Created" className="mb-4">
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
