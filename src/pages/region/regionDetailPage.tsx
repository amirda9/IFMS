import {Description, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {Form,FormikProvider, useFormik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {getPrettyDateTime} from '~/util/time';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {updateregionname} from './../../store/slices/networktreeslice'
import {BASE_URL} from './../../constant';
import { $Get, $Put } from '~/util/requestapi';
import Selectbox from '~/components/selectbox/selectbox';
const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
});

type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};


const RegionDetailPage = () => {
  const dispatch=useDispatch()
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const params = useParams<{regionId: string}>();
  const [regiondata,setregiondata]=useState<any>([])
  const login = localStorage.getItem('login');
  const [selectenetwork,setSelectednetwork]=useState("")
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [networklist, setNetworklist] = useState<networklisttype[]>([]);
  const [userrole, setuserrole] = useState<any>('');
  const [defaultnetworkname,setDefaultnetworkname]=useState("")
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


  const onclicknetwork=async(id:string)=>{
    setSelectednetwork(id)
    }


  useEffect(() => {
    getrole();
    const getnetworks = async () => {
      const getstationdetail=await $Get(`otdr/region/${params.regionId!.split("_")[0]}`)
      if(getstationdetail.status == 200){
        const getstationdetaildata=await getstationdetail.json()
        setregiondata(getstationdetaildata)
        const response = await $Get(`otdr/network`);
        if (response.status == 200) {
          const responsedata = await response.json();
          const Defaultnetworkname=responsedata.find((data:any) => data.id == getstationdetaildata.network_id)?.name;
          setDefaultnetworkname(Defaultnetworkname || "select")
          setNetworklist(responsedata);
        }
        formik.setValues({
          ...formik.values,
          name:getstationdetaildata?.name,
          description:getstationdetaildata?.current_version?.description
        })
      }
      
    };
    getnetworks();

  }, []);


  const buttons = (
    <>
      {userrole == 'superuser' ||
      networkDetail?.data?.access?.access == 'ADMIN' ||
      regionDetail?.data?.access?.access == 'ADMIN' ? (
        <SimpleBtn
          type="submit"
          onClick={() => {
            document.getElementById('formSubmit')?.click();
          }}>
          Save
        </SimpleBtn>
      ) : null}

      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  const formik = useFormik({
    initialValues:{
      name:"",
      description:"",
    },
    onSubmit:async(values) => {
      try {
        const response=await $Put(`otdr/region/${params.regionId!.split("_")[0]}`,values)
        if(response.status == 200){
          dispatch(updateregionname({networkid:regiondata!.network_id,regionid:params.regionId!.split("_")[0],regionname:values.name!}))
        }
      } catch (error) {
        
      }
      
    },
    validationSchema:{regionSchema}
  })
  // if (state.detail?.httpRequestStatus !== 'success') return <>loading</>;
  return (
    <FormLayout buttons={buttons}>
      <FormikProvider value={formik}>
      <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3 text-sm"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3 text-sm" />
            </Description>
            <Description label="Network" items="start">
            <Selectbox
                defaultvalue={defaultnetworkname}
                placeholder={defaultnetworkname}
                onclickItem={(e: { value: string; label: string; }) => onclicknetwork(e.value)} 
                options={networklist.map(data => ({ value: data.id, label: data.name }))}
                borderColor={'black'}
                classname="w-[21%] h-[32px] rounded-[5px]"
                   />
            </Description>
            <Description label="Owner" items="start">
              {regiondata?.current_version?.owner?.username}
            </Description>

            <Description label="Created">
              {getPrettyDateTime(regiondata.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(regiondata.time_updated)}
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </FormikProvider>
    </FormLayout>
  );
};

export default RegionDetailPage;
