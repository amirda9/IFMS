import React from 'react';
import {Description, SimpleBtn, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';

const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
  description: Yup.string().required('Please enter network description'),
});
const NetworkDetailPage = () => {
  const params = useParams<{networkId: string}>();
  const {
    state: {detail},
  } = useHttpRequest({
    selector: state => ({detail: state.http.networkDetail}),
    initialRequests: request => {
      request('networkDetail', {params: {networkId: params.networkId!}});
    },
  });
  if (detail?.httpRequestStatus !== 'success') return 'loading';
  return (
    <div className="flex flex-grow flex-col gap-4">
      <Formik
        initialValues={{
          name: detail!.data!.name,
          description: detail!.data!.name,
        }}
        onSubmit={() => {}}
        validationSchema={networkSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name">
              <InputFormik name="name" className="w-2/3" />
            </Description>
            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>
            {/*<Description label="Owner">Admin</Description>*/}
            {/*<Description label="Created">*/}
            {/*  {detail?.data?.version_id}*/}
            {/*</Description>*/}
            {/*<Description label="Last Modified">*/}
            {/*  <TextInput />*/}
            {/*</Description>*/}
          </div>
          <div className="flex flex-row gap-x-2 self-end">
            <SimpleBtn>Explore</SimpleBtn>
            <SimpleBtn>History</SimpleBtn>
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default NetworkDetailPage;
