import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {changegetdatadetailStatus, createStation} from './../../store/slices/networktreeslice';
import {useDispatch} from 'react-redux';
import {$Post} from '~/util/requestapi';
import { useEffect, useState } from 'react';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});

type Iprops={
  regionId:string,networkId:string
  }
const StationDetailPage = () => {
  const dispatch = useDispatch();
  const params = useParams<Iprops>();
  const [loading,setLoading]=useState(false)
  console.log(params, 'params');

  const navigate = useNavigate();
  const {state, request} = useHttpRequest({
    selector: state => ({
      regions: state.http.regionList,
    }),
    initialRequests: () => {
      request('regionList', {
        params: {network_id: params.networkId!},
      });
    },
  });

  useEffect(()=>{
    dispatch(changegetdatadetailStatus(false))
  },[])
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
            region_id: params.regionId!,
            model: 'cables',
            network_id: params.networkId!,
          });
          const responsedata = await response?.json();
          if (response?.status == 200) {
            // we should update the network tree
            dispatch(
              createStation({
                networkid: params.networkId!,
                regionid: params.regionId!,
                stationid: responsedata.station_id,
                stationname: values.name,
              }),
            );


            navigate(
              `/stations/${responsedata.station_id}/${params.regionId!}/${params.networkId!}`,
            );
          }
        } catch (error) {
         console.log(`create station error is:${error}`);
         
        } finally{
          setLoading(false)
        }
      }}
      validationSchema={stationSchema}>
      <Form className="w-full">
        <div className="relative flex min-h-[calc(100vh-160px)] flex-grow flex-col justify-between ">
          <div className="flex flex-col gap-y-4">
            <span className="text-md mb-4 mt-4 font-bold text-black">
              Create station
            </span>
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

export default StationDetailPage;
