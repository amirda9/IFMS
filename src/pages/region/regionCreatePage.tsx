import React, {useRef} from 'react';
import {Description, SimpleBtn} from '~/components';
import {useNavigate} from 'react-router-dom';
import {Form, Formik, FormikProps} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';

const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
  // description: Yup.string().required('Please enter region comments'),
});
const RegionDetailPage = () => {
  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const {
    state: {create},
    request,
  } = useHttpRequest({
    selector: state => ({create: state.http.regionCreate}),
    onUpdate: (lastState, state) => {
      if (
        lastState.create?.httpRequestStatus === 'loading' &&
        state.create?.httpRequestStatus === 'success'
      ) {
        request('regionList', {params: {network_id: networkId!}});
        navigate('../' + create?.data?.region_id);
      }
    },
  });

  const buttons = (
    <>
      <SimpleBtn
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}
        disabled={create?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <h1 className="mb-4 font-bold">Create Region</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        onSubmit={values => {
          request('regionCreate', {
            params: {network_id : networkId!},
            data: {name: values.name, description: values.description},
          });
        }}
        validationSchema={regionSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik name="name" wrapperClassName='w-2/3' className="disabled:bg-white" />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default RegionDetailPage;
