import {Description, SimpleBtn} from '~/components';
import {useAppSelector} from '~/hooks';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';

import {
  changeNetworkname,
  changegetdatadetailStatus,
  setNetworkidadmin,
} from './../../store/slices/networktreeslice';
import {getPrettyDateTime} from '~/util/time';
import {useEffect, useState} from 'react';
import {$Get, $Put} from '~/util/requestapi';
import {UserRole} from '~/constant/users';
import {toast} from 'react-toastify';
const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
});

type networkdetailtype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
  current_version: {
    id: string;
    network_id: string;
    time_created: string;
    description: string;
    owner: {
      id: string;
      username: string;
    };
  };
  versions: [
    {
      id: string;
      network_id: string;
      time_created: string;
      description: string;
      owner: {
        id: string;
        username: string;
      };
    },
  ];
  access: {
    role: string;
    access: string;
  };
  admin: {
    id: string;
    username: string;
  };
};
const NetworkDetailPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoaading] = useState<boolean>(false);
  // const {networkDetail} = useSelector((state: any) => state.http);
  const params = useParams<{networkId: string}>();
  const [updateloading,setUpdateloading]=useState(false)
  const [networkdetail, setNetworkdetail] = useState<networkdetailtype>();
  const navigate = useNavigate();

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  useEffect(() => {
    const getnetworkdetail = async () => {
      try {
        setLoaading(true);
        const networkresponse = await $Get(`otdr/network/${params.networkId!}`);
        if (networkresponse?.status == 200) {
          dispatch(changegetdatadetailStatus(true))
          const networkresponseData = await networkresponse.json();
          console.log('networkresponseData', networkresponseData);
          setNetworkdetail(networkresponseData);
        }
      } catch (error) {
        console.log(`error is :${error}`);
      } finally {
        setLoaading(false);
      }
    };
    getnetworkdetail();

  }, []);


  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex  flex-grow flex-col gap-4">
      <Formik
        enableReinitialize
        initialValues={{
          name: networkdetail?.name!,
          description:
            networkdetail?.versions.find(
              version => version.id === networkdetail?.current_version.id,
            )?.description || '',
        }}
        onSubmit={async values => {
          try {
            setUpdateloading(true)
            const response = await $Put(
              `otdr/network/${params.networkId!}`,
              values,
            );
            //we should update the networktree
            if (response?.status == 200) {
              toast('It was done successfully', {
                type: 'success',
                autoClose: 1000,
              });
              dispatch(
                changeNetworkname({id: params.networkId!, name: values.name}),
              );
            } else {
              toast('Encountered an error', {type: 'error', autoClose: 1000});
            }
          } catch (error) {
            toast('Encountered an error', {type: 'error', autoClose: 1000});
          } finally {
            setUpdateloading(false)
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
              {getPrettyDateTime(networkdetail?.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(networkdetail?.time_updated)}
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn onClick={() => navigate('history')}>History</SimpleBtn>
            {loggedInUser.role === UserRole.SUPER_USER ||
            networkdetail?.access?.access == 'ADMIN' ? (
              <SimpleBtn loading={updateloading} type="submit">Save</SimpleBtn>
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
