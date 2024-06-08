import {Description, SimpleBtn} from '~/components';
import {useNavigate, useParams} from 'react-router-dom';
import {Form, FormikProvider, useFormik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {getPrettyDateTime} from '~/util/time';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {
  changegetdatadetailStatus,
  setRegionidadmin,
  updateregionname,
} from './../../store/slices/networktreeslice';
import {$Get, $Put} from '~/util/requestapi';
import Selectbox from '~/components/selectbox/selectbox';
import {useAppSelector} from '~/hooks';
import {UserRole} from '~/constant/users';
import { toast } from 'react-toastify';
const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
});

type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};

type regionId={
regionId:string,networkId:string
}
const RegionDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {networkidadmin} = useSelector((state: any) => state.networktree);
  const params = useParams<regionId>();

  const [regiondata, setregiondata] = useState<any>();
  const login = localStorage.getItem('login');
  const [selectenetwork, setSelectednetwork] = useState('');
  const [networklist, setNetworklist] = useState<networklisttype[]>([]);
  const [defaultnetworkname, setDefaultnetworkname] = useState('');
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  const onclicknetwork = async (id: string) => {
    setSelectednetwork(id);
  };

  const buttons = (
    <>
      <SimpleBtn
        type="submit"
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}>
        Save
      </SimpleBtn>

      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: async values => {
      try {
        const response = await $Put(
          `otdr/region/${params?.regionId}`,
          {...values, network_id: params?.networkId},
        );
        console.log('response', response);

        if (response?.status == 200) {
          toast('It was done successfully', {type: 'success', autoClose: 1000});
          dispatch(
            updateregionname({
              newnetworkid:params!.networkId!,
              networkid: regiondata!.network_id,
              regionid: params?.regionId!,
              regionname: values.name!,
            }),
          );
          navigate(
            `/regions/${params?.regionId}/${params.networkId}`,
          );
        } else{
          toast('Encountered an e77777rror', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        console.log( `erorr is :${error}`);
        
       
        toast('Encountered an er66ror', {type: 'error', autoClose: 1000});
      }
    },
    validationSchema: regionSchema,
  });

  useEffect(() => {

    const getnetworks = async () => {
      try {
        setLoading(true);
        const [getstationdetail] = await Promise.all([
          $Get(`otdr/region/${params?.regionId}`),
          // $Get(`otdr/network`),
        ]);

        if (getstationdetail?.status == 200) {
          dispatch(changegetdatadetailStatus(true))
          const getstationdetaildata = await getstationdetail?.json();
          if (getstationdetaildata?.access?.access == 'ADMIN') {
            dispatch(setRegionidadmin(getstationdetaildata?.id!));
          }

          setregiondata(getstationdetaildata);
          // const response = await $Get(`otdr/network`);

          formik.setValues({
            ...formik.values,
            name: getstationdetaildata?.name,
            description: getstationdetaildata?.current_version?.description,
          });
        }

        // if (response?.status == 200) {
        //   const responsedata = await response?.json();
        //   const Defaultnetworkname = responsedata.find(
        //     (data: any) => data.id == params.regionId!.split('_')[1],
        //   );
        //   setSelectednetwork(Defaultnetworkname?.id);
        //   setDefaultnetworkname(Defaultnetworkname?.name || 'select');
        //   setNetworklist(responsedata);
        // }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getnetworks();
  }, []);
  if (loading) return <>loading...</>;
  return (
    <FormLayout buttons={buttons}>
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                disabled={
                  loggedInUser.role !== UserRole.SUPER_USER &&
                  !networkidadmin.includes(regiondata!.network_id)
                }
                name="name"
                wrapperClassName="w-2/3 text-sm"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik
                disabled={
                  loggedInUser.role !== UserRole.SUPER_USER &&
                  !networkidadmin.includes(regiondata!.network_id)
                }
                name="description"
                className="w-2/3 text-sm"
              />
            </Description>
            {/* <Description label="Network" items="start">
              <Selectbox
                defaultvalue={defaultnetworkname}
                placeholder={defaultnetworkname}
                disabled={loggedInUser.role !== UserRole.SUPER_USER}
                onclickItem={(e: {value: string; label: string}) =>
                  onclicknetwork(e.value)
                }
                options={networklist.map(data => ({
                  value: data.id,
                  label: data.name,
                }))}
                borderColor={'black'}
                classname="w-[21%] h-[32px] rounded-[5px]"
              />
            </Description> */}
            <Description label="Owner" items="start">
              {regiondata?.current_version?.owner?.username}
            </Description>

            <Description label="Created">
              {getPrettyDateTime(regiondata?.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(regiondata?.time_updated)}
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </FormikProvider>
    </FormLayout>
  );
};

export default RegionDetailPage;
