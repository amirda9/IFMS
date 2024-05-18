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
import {updatedefaultStationName} from './../../store/slices/networktreeslice';
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
const StationDetailPage = () => {
  const params = useParams<{stationId: string}>();
  const dispatch = useDispatch();
  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [selectedregion, setSelectedregion] = useState('');
  const [defaultregionkname, setDefaultregionname] = useState('');
  const [rtuPlacement, setRtuPlacement] = useState(false);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const navigate = useNavigate();
  const initialRequests = (request: Request) => {
    request('stationDetail', {
      params: {station_id: params.stationId!.split('_')[0]},
    });
  };
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.stationDetail,
    }),
    initialRequests,
  });
  useEffect(() => {
    const getnetworks = async () => {
      const getstationdetail = await $Get(
        `otdr/station/${params.stationId!.split('_')[0]}`,
      );
      if (getstationdetail.status == 200) {
        const getstationdetaildata = await getstationdetail.json();
        setRtuPlacement(getstationdetaildata.rtu_placement);
        const networkregionresponse = await $Get(
          `otdr/region/network/${params.stationId!.split('_')[1]}`,
        );
        if (networkregionresponse.status == 200) {
          const networkregionresponsedata = await networkregionresponse.json();
          const Defaultegionname =
            networkregionresponsedata.find(
              (data: any) => data.id == getstationdetaildata.region_id,
            )?.name || 'select';
          setDefaultregionname(Defaultegionname);
          setRegionlist(networkregionresponsedata);
        }
      }
    };
    getnetworks();
  }, []);

  const detaildata = useMemo(
    () =>
      state?.detail?.data?.versions?.find(
        version => version.id === state?.detail?.data?.current_version?.id,
      ),
    [state?.detail],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: `${state?.detail?.data?.name}`,
        description: detaildata?.description || '',
        latitude: detaildata?.latitude || '',
        longitude: detaildata?.longitude || '',
        region: state?.detail?.data?.region?.name,
        owner: state?.detail?.data?.current_version.owner?.username || '',
        created: detaildata?.time_created || '',
      }}
      onSubmit={async values => {
        console.log(values, 'values');

        try {
          const response = await $Put(
            `otdr/station/${params.stationId!.split('_')[0]}`,
            {
              region_id: selectedregion.length > 0 ? selectedregion : null,
              name: values.name,
              longitude: Number(values.longitude),
              latitude: Number(values.latitude),
              description: values.description,
              rtu_placement: rtuPlacement,
            },
          );

          if (response.status == 200) {
            dispatch(
              updatedefaultStationName({
                networkid: params.stationId!.split('_')[1],
                regionid: selectedregion,
                stationid: params.stationId!.split('_')[0],
                stationname: values.name,
              }),
            );

            navigate(
              `/stations/${params.stationId!.split('_')[0]}_${
                params.stationId!.split('_')[1]
              }/defaultstationDetailPage`,

              // `/stations/${params.stationId!.split('_')[0]}_${
              //   params.stationId!.split('_')[1]
              // }`,
            );
          }
        } catch (error) {}
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

            <Description label="RTU Placement" items="start">
              <Selectbox
                defaultvalue={rtuPlacement ? 'yes' : 'no'}
                onclickItem={(e: {value: string; label: string}) => {
                  let Value = e.value == 'yes' ? true : false;
                  setRtuPlacement(Value);
                }}
                options={[
                  {value: 'yes', label: 'yes'},
                  {value: 'no', label: 'no'},
                ]}
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
          <div className="flex flex-row gap-x-4 self-end pb-4">
            {loggedInUser.role === UserRole.SUPER_USER ||
            networkidadmin.includes(params.stationId!.split('_')[1]) ? (
              <SimpleBtn
                type="submit"
                // disabled={state?.detail?.httpRequestStatus === 'loading'}
              >
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
