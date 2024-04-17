import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {Field, Form, Formik} from 'formik';
import {InputFormik, SelectFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import Selectbox from '~/components/selectbox/selectbox';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {Request} from '~/hooks/useHttpRequest';
import {useEffect, useMemo, useState} from 'react';
import {updatedefaultStationName} from './../../store/slices/networktreeslice';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL} from './../../constant';
import {$Get, $Put} from '~/util/requestapi';
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
  id: string,
  name: string,
  network_id: string,
  time_created: string,
  time_updated: string
};
const StationDetailPage = () => {
  const params = useParams<{stationId: string}>();
  const dispatch = useDispatch();
  const [networklist, setNetworklist] = useState<networklisttype[]>([]);
  const [regionlist, setRegionlist] = useState<regionlisttype[]>([]);
  const [selectedregion,setSelectedregion]=useState("")
  const [defaultnetworkname,setDefaultnetworkname]=useState("")
  const [defaultregionkname,setDefaultregionname]=useState("")
  const [rtuPlacement,setRtuPlacement]=useState("yes")
  const [selectenetwork,setSelectednetwork]=useState(params.stationId!.split("_")[1])
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const {stationDetail} = useSelector((state: any) => state.http);
  
const navigate=useNavigate()
  const initialRequests = (request: Request) => {
    request('stationDetail', {params: {station_id: params.stationId!.split("_")[0]}});
  };
  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.stationDetail,
    }),
    initialRequests,
  });
  useEffect(() => {
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
    getrole();

    // const getstationdetail=async()=>{
    //   const getstationdetailresponse=await $Get(`otdr/station/${params.stationId!}`)
    //   if(getstationdetailresponse.status == 200){

    //   }
    // }
    const getnetworks = async () => {
      const getstationdetail=await $Get(`otdr/station/${params.stationId!.split("_")[0]}`)
      if(getstationdetail.status == 200){
        const getstationdetaildata=await getstationdetail.json()
        const response = await $Get(`otdr/network`);
        if (response.status == 200) {
          const responsedata = await response.json();
          const Defaultnetworkname=responsedata.find((data:any) => data.id == getstationdetaildata.network_id)?.name;
          setDefaultnetworkname(Defaultnetworkname || "select")
          setNetworklist(responsedata);
          const networkregionresponse=await $Get(`otdr/region/network/${responsedata.find((data:any) => data.id == getstationdetaildata.network_id)?.id}`)
        if(networkregionresponse.status == 200){
          const networkregionresponsedata=await networkregionresponse.json()
          const Defaultegionname=networkregionresponsedata.find((data:any) => data.id == getstationdetaildata.region_id)?.name || "select"
          setDefaultregionname(Defaultegionname)
          setRegionlist(networkregionresponsedata)
        }
        }
      }
      
    };
    getnetworks();

  }, []);


 


 
 const onclicknetwork=async(id:string)=>{
  setSelectednetwork(id)
  const networkregionresponse=await $Get(`otdr/region/network/${id}`)
  if(networkregionresponse.status == 200){
    const networkregionresponsedata=await networkregionresponse.json()
    setRegionlist(networkregionresponsedata)
  }
  }

  const detaildata=useMemo(
   () =>  state?.detail?.data?.versions?.find(
    version => version.id === state?.detail?.data?.current_version?.id,
  ),
   [state?.detail]
 );
 console.log("😆",detaildata);
 
  return (
    <Formik
      enableReinitialize
      initialValues={{
        setselectednetworkid:"",
        name: `${state?.detail?.data?.name}`,
        description:detaildata?.description || '',
        latitude:detaildata?.latitude || '',
        longitude:detaildata?.longitude || '',
        region: state?.detail?.data?.region?.name,
        owner: state?.detail?.data?.current_version.owner?.username || '',
        created:detaildata?.time_created || '',
      }}
      onSubmit={async values => {
        console.log(values,'values');
    
        try {
          const response = await $Put(`otdr/station/${params.stationId!.split("_")[0]}`, {
            network_id:selectenetwork,
            region_id:null,
            name: values.name,
            longitude: Number(values.longitude),
            latitude: Number(values.latitude),
            description: values.description,
            model: 'cables',
          });
          console.log("response.status",response.status);
          
          if (response.status == 200) {
            dispatch(
             updatedefaultStationName({
                networkid:params.stationId!.split("_")[1],
                regionid: params.stationId!.split("_")[1],
                stationid: params.stationId!.split("_")[0],
                stationname: values.name,
              }),
            );
          
            navigate(`/stations/${params.stationId!.split("_")[0]}_${params.stationId!.split("_")[1]}`)
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
                onclickItem={(e: { value: string; label: string; }) => setSelectedregion(e.value)} 
                options={regionlist.map(data => ({ value: data.id, label: data.name }))}
                borderColor={'black'}
                classname="w-[21%] h-[32px] rounded-[5px]"
                   />
            </Description>



            <Description label="RTU Placement" items="start">
            <Selectbox
                defaultvalue={"yes"}
                onclickItem={(e: { value: string; label: string; }) => setRtuPlacement(e.value)} 
                options={[{value:"yes",label:"yes"},{value:"no",label:"no"}]}
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
          <div className="flex flex-row pb-4 gap-x-4 self-end">
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