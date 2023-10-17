import {Outlet, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Field, Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {Request} from '~/hooks/useHttpRequest';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {BASE_URL} from './../../constant';
const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});
const StationDetailPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
  };
  useEffect(() => {
    getrole();
  }, []);

  const {stationDetail} = useSelector((state: any) => state.http);
  const params = useParams<{stationId: string}>();

  const initialRequests = (request: Request) => {
    request('stationDetail', {params: {station_id: params.stationId!}});
  };

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.stationDetail,
      update: state.http.stationUpdate,
    }),
    initialRequests,
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        initialRequests(request);
        request('allStations', undefined);
      }
    },
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
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
        request('stationUpdate', {
          data: {
            name: values.name,
            longitude: Number(values.longitude),
            latitude: Number(values.latitude),
            description: values.description,
            model: 'cables',
          },
          params: {station_id: params.stationId!},
        });
      }}
      validationSchema={stationSchema}>
      <Form >
        <div className="relative flex h-[calc(100vh-220px)] flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="text-sm disabled:bg-white"
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
            {userrole == 'superuser' ||
            stationDetail?.data?.access.access == 'ADMIN' ||
            networkDetail?.data?.access?.access == 'ADMIN' ? (
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
