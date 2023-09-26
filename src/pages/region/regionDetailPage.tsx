import {Description, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';

const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
  description: Yup.string().required('Please enter region comment'),
});
const RegionDetailPage = () => {
  const {regionDetail} = useSelector((state: any) => state.http);
  console.log(regionDetail?.data?.access?.access, 'regionDetailregionDetail');
  const login = localStorage.getItem('login');
  const accesstoken=JSON.parse(login || "")?.data.access_token
  const [userrole,setuserrole]=useState<any>("")
  const getrole=async()=>{
    const role=await fetch('http://37.32.27.143:8080/api/auth/users/token/verify_token',{
      headers: {
        Authorization:`Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json'},
    }).then(res =>res.json())
    setuserrole(role.role)
  console.log(role,'getrole');
  }
useEffect(()=>{
  getrole()
},[])
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
  console.log(state.detail, 'detaildetaildetail');

  const buttons = (
    <>
      {userrole == 'superuser' || regionDetail?.data?.access?.access == 'ADMIN' ? (
        <SimpleBtn
          type="submit"
          disabled={state.update?.httpRequestStatus === 'loading'}
          onClick={() => {
            document.getElementById('formSubmit')?.click();
          }}>
          Save
        </SimpleBtn>
      ) : null}

      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  if (state.detail?.httpRequestStatus !== 'success') return <>loading</>;
  return (
    <FormLayout buttons={buttons}>
      <Formik
        initialValues={{
          name: state.detail?.data?.name,
          description: state.detail?.data?.current_version.description!,
        }}
        onSubmit={values => {
          request('regionUpdate', {
            data: {description: values.description},
            params: {region_id: params.regionId!},
          });
        }}
        validationSchema={regionSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3 text-sm"
                className="disabled:bg-white"
                disabled
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3 text-sm" />
            </Description>

            <Description label="Owner" items="start">
              {state.detail?.data?.current_version.owner.username}
            </Description>

            <Description label="Created">
              {getPrettyDateTime(state.detail?.data?.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(state.detail?.data?.time_updated)}
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default RegionDetailPage;
