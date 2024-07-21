import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {createdefaultStation} from './../../store/slices/networktreeslice';
import {useDispatch} from 'react-redux';
import {$Post} from '~/util/requestapi';
import { useState } from 'react';
import { toast } from 'react-toastify';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});
const defaultStationDetailPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false)
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        region: '',
      }}
      onSubmit={async values => {
        try {
          setLoading(true)
          const response = await $Post(`otdr/station`, {
            name: values.name,
            description: values.description,
            longitude: values.longitude,
            latitude: values.latitude,
            model: 'cables',
            network_id: params.networkid,
          });
          const responsedata = await response?.json();
          if (response?.status == 200) {
            // we should update the network tree
            toast('It was done successfully', {
              type: 'success',
              autoClose: 1000,
            });
            dispatch(
              createdefaultStation({
                networkid: params.networkid!,
                stationid: responsedata.station_id,
                stationname: values.name,
              }),
            );

            navigate(
              `/stations/${
                responsedata.station_id
              }/${params.networkid!}/defaultstationDetailPage`,
            );
          }
        } catch (error) {
          console.log(`create defaultstation error is:${error}`);
          
        } finally {
          setLoading(false)
        }
      }}
      validationSchema={stationSchema}>
      <Form className="w-full">
        <div className="text-md  mt-4 font-bold text-black">Create station</div>
        <div className="relative flex min-h-[calc(100vh-200px)] flex-grow flex-col justify-between ">
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
          </div>
          <div className="absolute bottom-[0px]  right-0 flex flex-row gap-x-4 self-end">
            <SimpleBtn loading={loading} type="submit">Save</SimpleBtn>

            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default defaultStationDetailPage;
