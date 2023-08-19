import React from 'react';
import {Description, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';

const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
  description: Yup.string().required('Please enter region comment'),
});
const RegionDetailPage = () => {
  const params = useParams<{regionId: string}>();
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.regionDetail,
      update: state.http.regionUpdate,
    }),
    initialRequests: request => {
      request('regionDetail', {params: {region_id: params.regionId!}});
    },
    onUpdate: lastState => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update?.httpRequestStatus === 'success'
      ) {
        request('regionDetail', {params: {region_id: params.regionId!}});
      }
    },
  });
  const buttons = (
    <>
      <SimpleBtn
        type="submit"
        disabled={state.update?.httpRequestStatus === 'loading'}
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}>
        Save
      </SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  if (state.detail?.httpRequestStatus !== 'success') return <>loading</>;
  return (
    <FormLayout buttons={buttons}>
      <Formik
        initialValues={{
          name: state.detail?.data?.name,
          description:
            state.detail?.data?.versions.find(
              version => version.id === state.detail?.data?.version_id,
            )?.description || '',
        }}
        onSubmit={values => {
          request('regionUpdate', {
            data: {description: values.description},
            params: {region_id: params.regionId!},
          });
        }}
        validationSchema={regionSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                className="w-2/3 disabled:bg-white"
                disabled
              />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Owner" items="start" className="mb-4">
              {state.detail?.data?.owner_id}
            </Description>

            <Description label="Created" className="mb-4">
              {dayjs(state.detail?.data?.time_created).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            </Description>

            <Description label="Last Modified">
              {dayjs(state.detail?.data?.time_updated).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default RegionDetailPage;
