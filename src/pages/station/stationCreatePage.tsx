
import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {createStation} from './../../store/slices/networktreeslice';
import {networkExplored} from '~/constant';
import {useDispatch} from 'react-redux';
import {$Post} from '~/util/requestapi';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  // description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
  // region: Yup.string().required('Please select region'),
});
const StationDetailPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  console.log(params, 'params');

  const navigate = useNavigate();
  const {state, request} = useHttpRequest({
    selector: state => ({
      regions: state.http.regionList,
    }),
    initialRequests: () => {
      request('regionList', {params: {network_id:  params.regionid?.split("_")[1]!}});
    },
  });

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
          const response = await $Post(`otdr/station`, {
            name: values.name,
            description: values.description,
            longitude: values.longitude,
            latitude: values.latitude,
            region_id: params.regionid?.split("_")[0],
            model: 'cables',
            network_id: params.regionid?.split("_")[1],
          });
          const responsedata = await response.json();
          if (response.status == 200) {
            // we should update the network tree
            dispatch(
              createStation({
                networkid: params.regionid?.split("_")[1]!,
                regionid:params.regionid?.split("_")[0]!,
                stationid: responsedata.station_id,
                stationname: values.name,
              }),
            );
            navigate(`/stations/${responsedata.station_id}`);
          }
        } catch (error) {}
      }}
      validationSchema={stationSchema}>
      <Form className="w-full">
        <div className="relative flex min-h-[calc(100vh-160px)] flex-grow flex-col justify-between ">
          <div className="flex flex-col gap-y-4">
            <span  className='text-sm text-black mb-4 mt-4'>Create station</span>
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
            {/* <SimpleBtn
              onClick={() => {}}>
              Explore
            </SimpleBtn>
            <SimpleBtn onClick={() => {}}>History</SimpleBtn> */}
            {/* {stationDetail?.data?.access == 'ADMIN' ? */}
            <SimpleBtn
              type="submit"
              >
              Save
            </SimpleBtn>
            {/* :null} */}
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
