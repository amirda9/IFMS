import {Outlet, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Field, Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {Request} from '~/hooks/useHttpRequest';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});
const StationDetailPage = () => {
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
  const {stationDetail} = useSelector((state: any) => state.http);
  console.log(stationDetail, 'stationDetail');
  const params = useParams<{stationId: string}>();
  const initialRequests = (request: Request) => {
    request('stationDetail', {params: {station_id: params.stationId!}});
  };
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.stationDetail,
      update: state.http.stationUpdate,
    }),
    // initialRequests: request => {
    //   request('stationDetail', {params: {station_id:params.stationId!}});
    // },
    initialRequests,
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        initialRequests(request);
      }
    },
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        // name: `Station ${params.stationId}`,
        name: `${state?.detail?.data?.name}`,
        description:
          state?.detail?.data?.versions?.find(
            version => version.id === state?.detail?.data?.current_version?.id,
          )?.description || '',
        latitude:
          state?.detail?.data?.versions?.find(
            version => version.id === state?.detail?.data?.current_version?.id,
          )?.latitude || '',
        longitude:
          state?.detail?.data?.versions?.find(
            version => version.id === state?.detail?.data?.current_version?.id,
          )?.longitude || '',
        region: state?.detail?.data?.region?.name,
        owner: state?.detail?.data?.current_version.owner?.username || '',
        created:
          state?.detail?.data?.versions?.find(
            version => version.id === state?.detail?.data?.current_version?.id,
          )?.time_created || '',
      }}
      onSubmit={values => {
        console.log(values, 'valuesvalues');

        request('stationUpdate', {
          data: {
            longitude: Number(values.longitude),
            latitude: Number(values.latitude),
            description: values.description,
            model: 'cables',
          },
          params: {station_id: params.stationId!},
        });
      }}
      validationSchema={stationSchema}>
      <Form className="w-full">
        <div className="relative flex min-h-[calc(100vh-200px)] flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="text-sm disabled:bg-white"
                disabled
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3 text-sm" />
            </Description>

            <Description label="Latitude" items="start">
              <InputFormik
                type="number"
                name="latitude"
                wrapperClassName="w-1/4"
                className="text-sm disabled:bg-white"
              />
            </Description>

            <Description label="Longitude" items="start">
              <InputFormik
                type="number"
                name="longitude"
                wrapperClassName="w-1/4"
                className="text-sm disabled:bg-white"
              />
            </Description>

            <Description label="Region" items="start">
              <Field name="region">
                {({field}: any) => (
                  <div className="w-1/4 text-sm">{field.value}</div>
                )}
              </Field>
            </Description>

            <Description label="Owner" items="start">
              <Field name="owner">
                {({field}: any) => (
                  <div className="w-1/4 text-sm">{field.value}</div>
                )}
              </Field>
            </Description>

            <Description label="Created">
              <Field name="created">
                {({field}: any) => (
                  <div className="w-1/4 text-sm">
                    {' '}
                    {getPrettyDateTime(field.value)}
                  </div>
                )}
              </Field>
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime()}
            </Description>
          </div>
          <div className="absolute bottom-0 right-0 flex flex-row  gap-x-4 self-end">
            {/* <SimpleBtn
              onClick={() => {}}>
              Explore
            </SimpleBtn>
            <SimpleBtn onClick={() => {}}>History</SimpleBtn> */}
            {userrole == 'superuser' || stationDetail?.data?.access.access == 'ADMIN' ? (
              <SimpleBtn
                type="submit"
                disabled={state?.detail?.httpRequestStatus === 'loading'}>
                Save
              </SimpleBtn>
            ) : null}
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default StationDetailPage;
