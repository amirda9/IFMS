import {Description, SimpleBtn} from '~/components';
import {useHttpRequest} from '~/hooks';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Request} from '~/hooks/useHttpRequest';
import {changeNetworkname} from './../../store/slices/networktreeslice'
import Cookies from 'js-cookie';
import {getPrettyDateTime} from '~/util/time';
import {useEffect, useState} from 'react';
import {BASE_URL} from './../../constant';
import { $Put } from '~/util/requestapi';
const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
});
const NetworkDetailPage = () => {
  const dispatch=useDispatch()
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  console.log("login",login);
  console.log("accesstoken",accesstoken);
  const [userrole, setuserrole] = useState<any>('');
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
  useEffect(() => {
    getrole();
  }, []);
  const {networkDetail} = useSelector((state: any) => state.http);

  const params = useParams<{networkId: string}>();
  const navigate = useNavigate();
  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };

  const {
    state: {detail},
    request,
  } = useHttpRequest({
    selector: state => ({
      detail: state.http.networkDetail,
    }),
    initialRequests,
  });

  if (detail?.httpRequestStatus !== 'success' && !detail?.data)
    return <>loading</>;
  return (
    <div className="flex  flex-grow flex-col gap-4">
      <Formik
        enableReinitialize
        initialValues={{
          name: detail!.data!.name,
          description:
            detail!.data!.versions.find(
              version => version.id === detail!.data!.current_version.id,
            )?.description || '',
        }}
        onSubmit={async(values) => {
          try {
            const response=await $Put(`otdr/network/${params.networkId!}`,values)
            //we should update the networktree
            if(response.status == 200){
              dispatch(changeNetworkname({id:params.networkId!,name:values.name}))
            }
          } catch (error) {
            
          }
        }}
        validationSchema={networkSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3 text-sm"
                className=""
                // disabled
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3 text-sm" />
            </Description>

            <Description label="Created">
              {getPrettyDateTime(detail.data!.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(detail.data!.time_updated)}
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            {/* <SimpleBtn
              onClick={() => Cookies.set('networkExplored', params.networkId!)}>
              Explore
            </SimpleBtn> */}
            <SimpleBtn onClick={() => navigate('history')}>History</SimpleBtn>
            {userrole == 'superuser' ||
            networkDetail?.data?.access?.access == 'ADMIN' ? (
              <SimpleBtn
                type="submit"
               
                >
                Save
              </SimpleBtn>
            ) : null}

            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </Formik>
      <Outlet />
    </div>
  );
};

export default NetworkDetailPage;
