import {Description, SimpleBtn} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Request} from '~/hooks/useHttpRequest';
import {
  changeNetworkname,
  setNetworkidadmin,
} from './../../store/slices/networktreeslice';
import {getPrettyDateTime} from '~/util/time';
import {useEffect} from 'react';
import {$Put} from '~/util/requestapi';
import {UserRole} from '~/constant/users';
import { toast } from 'react-toastify';
const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
});
const NetworkDetailPage = () => {
  const dispatch = useDispatch();
  const login = localStorage.getItem('login');
  const {networkDetail} = useSelector((state: any) => state.http);
  const params = useParams<{networkId: string}>();
  const navigate = useNavigate();
  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };

  const {
    state: {detail, viewers},
    request,
  } = useHttpRequest({
    selector: state => ({
      detail: state.http.networkDetail,
      viewers: state.http.networkAccessList,
    }),
    initialRequests,
  });

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  useEffect(() => {
    if (detail?.data?.access?.access == 'ADMIN') {
      dispatch(setNetworkidadmin(detail?.data?.id!));
    }
  }, []);

  console.log('detail', detail);

  if (detail?.httpRequestStatus !== 'success') {
    return <>loading</>;
  }

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
        onSubmit={async values => {
          try {
            const response = await $Put(
              `otdr/network/${params.networkId!}`,
              values,
            );
            //we should update the networktree
            if (response?.status == 200) {
              toast('It was done successfully', {type: 'success', autoClose: 1000});
              dispatch(
                changeNetworkname({id: params.networkId!, name: values.name}),
              );
            }else{
              toast('Encountered an error', {type: 'error', autoClose: 1000});
            }
          } catch (error) {
            toast('Encountered an error', {type: 'error', autoClose: 1000});
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
            <SimpleBtn onClick={() => navigate('history')}>History</SimpleBtn>
            {loggedInUser.role === UserRole.SUPER_USER ||
            networkDetail?.data?.access?.access == 'ADMIN' ? (
              <SimpleBtn type="submit">Save</SimpleBtn>
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
