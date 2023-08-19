import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {FC, useEffect} from 'react';
import {Description, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

const UserAuthenticationPage: FC = () => {
  const {userId} = useParams();

  const passwordRestMutation = useHttpRequest({
    selector: state => state.http.passwordReset,
  });

  const handleFormSubmit = (values: {
    password: string;
    passwordConfirmation: string;
  }) => {
    passwordRestMutation.request('passwordReset', {
      params: {user_id: userId!},
      data: {
        new_password: values.password,
        confirm_new_password: values.passwordConfirmation,
      },
    });
  };

  useEffect(() => {
    if (passwordRestMutation.state?.httpRequestStatus === 'success') {
      toast('Password changed successfully.', {type: 'success'});
    } else if (passwordRestMutation.state?.httpRequestStatus === 'error') {
      const error = passwordRestMutation.state.error;
      
    }
  }, [passwordRestMutation.state]);

  console.log('passwordRestMutation:', passwordRestMutation);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required.'),
    passwordConfirmation: Yup.string()
      .required('Please repeat your password.')
      .oneOf([Yup.ref('password')], 'Passwords must match.'),
  });

  return (
    <div className="flex flex-grow flex-col gap-4">
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="New Password" items="start">
              <InputFormik className="w-2/3" type="password" name="password" />
            </Description>
            <Description label="Confirm New Password" items="start">
              <InputFormik
                className="w-2/3"
                type="password"
                name="passwordConfirmation"
              />
            </Description>
          </div>
          <div className="flex flex-row gap-x-2 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default UserAuthenticationPage;
