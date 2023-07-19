import React from 'react';
import {Description, SimpleBtn} from '~/components';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {InputFormik, TextareaFormik} from '~/container';
import {useNavigate} from 'react-router-dom';

const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
  description: Yup.string().required('Please enter network description'),
});
const NetworkCreatePage = () => {
  const navigate = useNavigate();
  const {state, request} = useHttpRequest({
    selector: state => state.http.networkCreate,
    onUpdate: (lastState, state) => {
      if (
        lastState?.httpRequestStatus === 'loading' &&
        state?.httpRequestStatus === 'success'
      ) {
        request('networkList', undefined);
        navigate('/networks/' + state.data!.id, {replace: true});
      }
    },
  });
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-4 font-bold">Create Network</h1>
      <Formik
        validationSchema={networkSchema}
        initialValues={{name: '', description: ''}}
        onSubmit={values => {
          request('networkCreate', {data: values});
        }}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik name="name" className="w-2/3" />
            </Description>
            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>
          </div>

          <SimpleBtn
            className="self-end"
            type="submit"
            disabled={state?.httpRequestStatus === 'loading'}>
            Save
          </SimpleBtn>
        </Form>
      </Formik>
    </div>
  );
};

export default NetworkCreatePage;
