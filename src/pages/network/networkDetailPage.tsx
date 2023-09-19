import {Description, SimpleBtn} from '~/components';
import {useHttpRequest} from '~/hooks';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Request} from '~/hooks/useHttpRequest';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {getPrettyDateTime} from '~/util/time';
import {useEffect, useState} from 'react';

const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
  description: Yup.string().required('Please enter network description'),
});
const NetworkDetailPage = () => {
 
  const params = useParams<{networkId: string}>();
  const [dataa, setdataa] = useState(0);
  const navigate = useNavigate();
  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };
  // useEffect(()=>{
  //   setdataa(dataa+1)
  // },[])
  const {
    state: {detail, update},
    request,
  } = useHttpRequest({

    
    selector: state => ({
      detail: state.http.networkDetail,
      update: state.http.networkUpdate,
    }),
    initialRequests,
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        initialRequests(request);
      }
    },
  });

    // console.log(update, 'lklklk')
    console.log(detail, 'ppp');
  // update?.data.id

  if (detail?.httpRequestStatus !== 'success' && !detail?.data)
    return <>loading</>;

  // name:detail?.data?.current_version.id == update?.data?.id ?update?.request?.data.name:
  // name:detail!.data!.versions.find(
  //   version => version.id === update?.data?.id
  // )?.id ?update?.request?.data.name:
  return (
    <div className="flex flex-grow flex-col gap-4">
      <Formik
        enableReinitialize
        initialValues={{
          name:detail!.data!.name,
       
          description:
            detail!.data!.versions.find(
              version => version.id === detail!.data!.current_version.id,
            )?.description || '',
        }}
        onSubmit={values => {
          console.log(values, 'valuesvalues');

          request('networkUpdate', {
            data:values,
            params: {networkId: params.networkId!},
          });
        }}
        validationSchema={networkSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className=""
                // disabled
              />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Created">
              {getPrettyDateTime(detail.data!.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(detail.data!.time_updated)}
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn
              onClick={() => {
                Cookies.set(networkExplored, params.networkId!);
              }}>
              Explore
            </SimpleBtn>
            <SimpleBtn onClick={() => navigate('history')}>History</SimpleBtn>
            <SimpleBtn
              type="submit"
              disabled={update?.httpRequestStatus === 'loading'}>
              Save
            </SimpleBtn>
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
