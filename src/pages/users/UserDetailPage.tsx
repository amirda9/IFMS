import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';

const UsersDetailPage: FC = () => {
  const {userId} = useParams();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Username must be longer than 3 characters.'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Please provide a valid email.'),
    telephone: Yup.string(),
    mobile: Yup.string(),
    address: Yup.string(),
    comment: Yup.string(),
    region: Yup.string(),
    station: Yup.string(),
  });

  const initialValues = {
    id: userId,
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      console.log('SUBMITTED VALUES:', values);
    },
  });

  const userDataQuery = useHttpRequest({
    selector: state => state.http.userData,
    initialRequests: request => {
      request('userData', {params: {user_id: userId!}});
    },
    onUpdate: (lastState, state) => {
      if (
        lastState?.httpRequestStatus === 'loading' &&
        state?.httpRequestStatus === 'success' &&
        state.data
      ) {
        formik.setFieldValue('id', state.data.id);
        formik.setFieldValue('username', state.data.username);
        formik.setFieldValue('email', state.data.email);
        formik.setFieldValue('station', state.data.station?.name || '');
        formik.setFieldValue('region', state.data.region?.name || '');
        formik.setFieldValue('telephone', state.data.telephone || '');
        formik.setFieldValue('mobile', state.data.mobile || '');
        formik.setFieldValue('address', state.data.address || '');
        formik.setFieldValue('comment', state.data.comment || '');
        console.log('yoyoyoy', state);
      }
    },
  });

  useEffect(() => {
    userDataQuery.request('userData', {params: {user_id: userId!}});
  }, [userId]);

  return (
    <div className="flex flex-grow flex-col gap-4">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="ID" labelClassName="mt-2" items="start">
              <InputFormik
                name="id"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
                disabled
              />
            </Description>

            <Description label="Username" labelClassName="mt-2" items="start">
              <InputFormik
                name="username"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Telephone" labelClassName="mt-2" items="start">
              <InputFormik
                name="telephone"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Mobile" labelClassName="mt-2" items="start">
              <InputFormik
                name="mobile"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Email" labelClassName="mt-2" items="start">
              <InputFormik
                name="email"
                className="w-2/3 disabled:cursor-not-allowed disabled:bg-slate-200"
              />
            </Description>

            <Description label="Address" items="start">
              <TextareaFormik name="address" className="w-2/3" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-2/3" />
            </Description>

            <div className="flex">
              <Description label="Created" className="mb-4">
                {/* {dayjs(detail.data!.time_created).format('YYYY-MM-DD HH:mm:ss')} */}
              </Description>

              <Description label="Last Modified">
                {/* {dayjs(detail.data!.time_updated).format('YYYY-MM-DD HH:mm:ss')} */}
              </Description>
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
