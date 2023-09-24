import React, { useRef } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, SelectFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import { useSelector } from 'react-redux';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
  // region: Yup.string().required('Please select region'),
});
const StationDetailPage = () => {
  const {stationDetail} = useSelector((state: any) => state.http);
console.log(stationDetail,'stationDetail');
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
        request('allStations', undefined);
        navigate('../' + state.create?.data?.station_id);
      }
    },
    initialRequests: () => {
      request('regionList', {params: {network_id: networkId!}});
    },
  });
  console.log(state.create,'create');
  
  // const buttons = (
  //   <>
  //     <SimpleBtn
  //       onClick={() => {
  //         reff.current.click();
  //       }}
  //       disabled={state.create?.httpRequestStatus === 'loading'}>
  //       Save
  //     </SimpleBtn>
  //     <SimpleBtn link to="../">
  //       Cancel
  //     </SimpleBtn>
  //   </>
  // );
  const buttons = (
    <>
      <SimpleBtn
        type="submit"
        disabled={state?.create?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return (

      <Formik
        initialValues={{
          name: '',
          description: '',
          latitude: 0,
          longitude: 0,
          region: '',
        }}
        onSubmit={values => {
    
          request('stationCreate', {
            data: {
              name: values.name,
              description: values.description,
              longitude: values.longitude,
              latitude: values.latitude,
              // region_id:"",
              model: 'cables',
              network_id: networkId!,
            },
          });
        }}
        validationSchema={stationSchema}>
        <Form className="flex h-full flex-grow relative min-h-[calc(100%-80px)] flex-col justify-between ">
          <div className="flex flex-col gap-y-4">
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

            {/* <Description label="Region" items="start" className="mb-4">
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
                  <option key={region.id} label={region.name} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </SelectFormik>
            </Description> */}
          </div>
          <div className="flex flex-row  gap-x-4 self-end absolute bottom-[70px] right-0">
            {/* <SimpleBtn
              onClick={() => {}}>
              Explore
            </SimpleBtn>
            <SimpleBtn onClick={() => {}}>History</SimpleBtn> */}
            {/* {stationDetail?.data?.access == 'ADMIN' ? */}
            <SimpleBtn
              type="submit"
              disabled={state?.create?.httpRequestStatus === 'loading'}
              >
              Save
            </SimpleBtn>
            {/* :null} */}
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
          {/* <button ref={reff} type="submit" id="formSubmit" hidden /> */}
        </Form>
      </Formik>

  );
};

export default StationDetailPage;
