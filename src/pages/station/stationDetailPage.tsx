import {useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Field, Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import Selectbox from '~/components/selectbox/selectbox';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {Request} from '~/hooks/useHttpRequest';
import {useEffect, useMemo, useState} from 'react';
import {updateStationName} from './../../store/slices/networktreeslice';
import {useDispatch, useSelector} from 'react-redux';
import {$Get, $Put} from '~/util/requestapi';
import {UserRole} from '~/constant/users';
const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});

type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};

type regionlisttype = {
  id: string;
  name: string;
  network_id: string;
  time_created: string;
  time_updated: string;
};
const StationDetailPage = () => {
  const params = useParams<{stationId: string}>();
  const dispatch = useDispatch();
  const [networklist, setNetworklist] = useState<networklisttype[]>([]);
  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [loading, setLoading] = useState(false);
  const [detaildata, setDetaildata] = useState<any>([]);
  const [stationdetail, setStationdetail] = useState<any>([]);
  const [selectedregion, setSelectedregion] = useState(
    params.stationId!.split('_')[1],
  );
  const [defaultnetworkname, setDefaultnetworkname] = useState('');
  const [defaultregionkname, setDefaultregionname] = useState('');
  const [selectenetwork, setSelectednetwork] = useState(
    params.stationId!.split('_')[2],
  );

  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const navigate = useNavigate();

  useEffect(() => {
    const getnetworks = async () => {
      try {
        setLoading(true);
        try {
          const [getstationdetail, networkregionresponse] = await Promise.all([
            $Get(`otdr/station/${params.stationId!.split('_')[0]}`),
            $Get(`otdr/region/network/${params.stationId!.split('_')[2]}`),
          ]);

          if (getstationdetail.status == 200) {
            const getstationdetaildata = await getstationdetail.json();
            setStationdetail(getstationdetaildata);
            setDetaildata(
              getstationdetaildata?.versions?.find(
                (version: any) =>
                  version.id === getstationdetaildata.current_version?.id,
              ),
            );
          }
          if (networkregionresponse.status == 200) {
            const networkregionresponsedata =
              await networkregionresponse.json();
            const Defaultegionname =
              networkregionresponsedata.find(
                (data: {
                  id: string;
                  name: string;
                  network_id: string;
                  time_created: string;
                  time_updated: string;
                }) => data.id == params.stationId!.split('_')[1],
              )?.name || 'select';
            setDefaultregionname(Defaultegionname);
            setRegionlist(networkregionresponsedata);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } catch (error) {}
    };
    getnetworks();
  }, []);

  if (loading) {
    return <h1> loading...</h1>;
  }
  return (
    <Formik
      enableReinitialize
      initialValues={{
        setselectednetworkid: '',
        name: `${stationdetail?.name}`,
        description: detaildata?.description || '',
        latitude: detaildata?.latitude || '',
        longitude: detaildata?.longitude || '',
        region: stationdetail?.region?.name,
        owner: stationdetail?.current_version?.owner?.username || '',
        created: detaildata?.time_created || '',
      }}
      onSubmit={async values => {
        try {
          const response = await $Put(
            `otdr/station/${params.stationId!.split('_')[0]}`,
            {
              network_id: selectenetwork,
              region_id: selectedregion,
              name: values.name,
              longitude: Number(values.longitude),
              latitude: Number(values.latitude),
              description: values.description,
              model: 'cables',
            },
          );

          if (response.status == 200) {
            dispatch(
              updateStationName({
                newregionid: selectedregion,
                networkid: params.stationId!.split('_')[2],
                regionid: params.stationId!.split('_')[1],
                stationid: params.stationId!.split('_')[0],
                stationname: values.name,
              }),
            );

            navigate(
              `/stations/${params.stationId!.split('_')[0]}_${selectedregion}_${
                params.stationId!.split('_')[2]
              }`,
            );
          }
        } catch (error) {}
      }}
      validationSchema={stationSchema}>
      <Form>
        <div className="relative  flex flex-col justify-between">
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
                defaultvalue={defaultregionkname}
                placeholder={defaultregionkname}
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

            {/* <Description label="RTU Placement" items="start">
              <Selectbox
                defaultvalue={'yes'}
                onclickItem={(e: {value: string; label: string}) =>
                  setRtuPlacement(e.value)
                }
                options={[
                  {value: 'yes', label: 'yes'},
                  {value: 'no', label: 'no'},
                ]}
                borderColor={'black'}
                classname="w-[21%] h-[32px] rounded-[5px]"
              />
            </Description> */}

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
          <div className="flex flex-row gap-x-4 self-end">
            {loggedInUser.role === UserRole.SUPER_USER ||
            networkidadmin.includes(params.stationId!.split('_')[2]) ||
            regionidadmin.includes(params.stationId!.split('_')[1]) ? (
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
