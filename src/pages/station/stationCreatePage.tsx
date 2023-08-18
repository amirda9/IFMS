import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import SelectFormik from '~/container/formik/selectFormik';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
  region: Yup.string().required('Please select region'),
});
const StationDetailPage = () => {
  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const {state, request} = useHttpRequest({
    selector: state => ({
      create: state.http.stationCreate,
      regions: state.http.regionList,
    }),
    onUpdate: lastState => {
      if (
        lastState.create?.httpRequestStatus === 'loading' &&
        state.create?.httpRequestStatus === 'success'
      ) {
        request('networkStationList', {params: {network_id: networkId!}});
        navigate('../' + state.create?.data?.station_id);
      }
    },
    initialRequests: () => {
      request('regionList', {params: {network_id: networkId!}});
    },
  });
  const buttons = (
    <>
      <SimpleBtn
        onClick={() => {
          document.getElementById('submit')?.click();
        }}
        disabled={state.create?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <Formik
        initialValues={{
          name: '',
          description: '',
          latitude: 0,
          longitude: 0,
          region: '',
        }}
        onSubmit={values => {
          console.log('submit');
          request('stationCreate', {
            data: {
              name: values.name,
              description: values.description,
              longitude: values.longitude,
              latitude: values.latitude,
              region_id: values.region,
              model: 'idk',
              network_id: networkId!,
            },
          });
        }}
        validationSchema={stationSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik name="name" className="w-2/3 disabled:bg-white" />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Latitude" labelClassName="mt-2" items="start">
              <InputFormik
                type="number"
                name="latitude"
                className="w-1/4 disabled:bg-white"
              />
            </Description>

            <Description label="Longitude" labelClassName="mt-2" items="start">
              <InputFormik
                type="number"
                name="longitude"
                className="w-1/4 disabled:bg-white"
              />
            </Description>

            <Description label="Region" items="start" className="mb-4">
              <SelectFormik
                placeholder="select region"
                name="region"
                className="w-1/4 disabled:bg-white">
                <option value="select region" label="" className="hidden" />
                <option
                  value={undefined}
                  label="select region"
                  className="hidden"
                />
                {state.regions?.data?.map(region => (
                  <option key={region.id} label={region.name}>
                    {region.name}
                  </option>
                ))}
              </SelectFormik>
            </Description>
          </div>
          <button className="hidden" id="submit" />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default StationDetailPage;
