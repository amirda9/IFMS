import {Form, Formik} from 'formik';
import {FC} from 'react';
import {Description, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

const UserAuthenticationPage: FC = () => {
  const handleFormSubmit = () => {};

  return (
    <div className="flex flex-grow flex-col gap-4">
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
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
