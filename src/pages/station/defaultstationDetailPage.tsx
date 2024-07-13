import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Field, Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import Selectbox from '~/components/selectbox/selectbox';
import {useAppSelector} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {useEffect, useState} from 'react';
import {changegetdatadetailStatus, updatedefaultStationName} from './../../store/slices/networktreeslice';
import {useDispatch, useSelector} from 'react-redux';
import {$Get, $Put} from '~/util/requestapi';
import {UserRole} from '~/constant/users';
const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});

type regionlisttype = {
  id: string;
  name: string;
  network_id: string;
  time_created: string;
  time_updated: string;
};
type Iprops={
  stationId:string,networkId:string
  }
const StationDetailPage = () => {
  const params = useParams<Iprops>();
  const dispatch = useDispatch();
  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [selectedregion, setSelectedregion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detaildata, setDetaildata] = useState<any>([]);
  const [stationdetail, setStationdetail] = useState<any>([]);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {networkidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const navigate = useNavigate();

  const getnetworks = async () => {
    setLoading(true);
    try {
      const [getstationdetail, networkregionresponse] = await Promise.all([
        $Get(`otdr/station/${params.stationId!}`),
        $Get(`otdr/region/network/${params.networkId!}`),
      ]);

      if (getstationdetail?.status == 200) {
        const getstationdetaildata = await getstationdetail?.json();
        setStationdetail(getstationdetaildata);
        setDetaildata(
          getstationdetaildata?.versions?.find(
            (version: any) =>
              version.id === getstationdetaildata.current_version?.id,
          ),
        );
      }
      if (networkregionresponse?.status == 200) {
        const networkregionresponsedata = await networkregionresponse?.json();
        setRegionlist(networkregionresponsedata);
      }
      if(getstationdetail?.status == 200 && networkregionresponse?.status == 200){
        dispatch(changegetdatadetailStatus(true))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getnetworks();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: `${stationdetail?.name}`,
        description: detaildata?.description || '',
        latitude: detaildata?.latitude || '',
        longitude: detaildata?.longitude || '',
        owner: stationdetail?.current_version?.owner?.username || '',
        created: detaildata?.time_created || '',
      }}
      onSubmit={async values => {
        try {
          const response = await $Put(
            `otdr/station/${params.stationId!}`,
            {
              region_id: selectedregion,
              name: values.name,
              longitude: Number(values.longitude),
              latitude: Number(values.latitude),
              description: values.description,
            },
          );

          if (response?.status == 200) {
            dispatch(
              updatedefaultStationName({
                networkid: params.networkId!,
                regionid: selectedregion,
                stationid: params.stationId!,
                stationname: values.name,
              }),
            );

            navigate(
              `/stations/${params.stationId!}/${
                params.networkId!
              }/defaultstationDetailPage`,
            );
          }
        } catch (error) {
          console.log(`error is :${error}`);
          
        }
      }}
      validationSchema={stationSchema}>
      <Form>
        <div className="relative flex flex-col justify-between">
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

            <Description label="Region" items="start">
              <Selectbox
                placeholder={'select'}
                onclickItem={(e: {value: string; label: string}) =>
                  setSelectedregion(e.value)
                }
                options={regionlist.map(data => ({
                  value: data.id,
                  label: data.name,
                }))}
                borderColor={'black'}
                classname="w-[21%] h-[32px] rounded-[5px]"
              />
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

            <Description label="Owner" items="start">
              <Field name="owner">
                {({field}: any) => {
                  return <div className="w-1/4 text-sm">{field.value}</div>;
                }}
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
          <div className="mt-6 flex flex-row gap-x-4 self-end">
            {loggedInUser.role === UserRole.SUPER_USER ||
            networkidadmin.includes(params.networkId!) ? (
              <SimpleBtn type="submit">Save</SimpleBtn>
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
