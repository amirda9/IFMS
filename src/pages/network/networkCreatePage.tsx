import React from 'react';
import {Description, SimpleBtn} from '~/components';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {InputFormik, TextareaFormik} from '~/container';
import {useNavigate} from 'react-router-dom';
import {createnetwork} from './../../store/slices/networktreeslice'
import { useDispatch } from 'react-redux';
import { $Post } from '~/util/requestapi';
const networkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter network name'),
});
const NetworkCreatePage = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const {state, request} = useHttpRequest({
    selector: state => state.http.networkCreate,
    onUpdate: (lastState, state) => {
      if (
        lastState?.httpRequestStatus === 'loading' &&
        state?.httpRequestStatus === 'success'
      ) {
        request('networkList', undefined);
        navigate('/networks/' + state.data!.network_id, {replace: true});
      }
    },
  });
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-4 text-md font-bold">Create Network</h1>
      <Formik
        validationSchema={networkSchema}
        initialValues={{name: '', description: ''}}
        onSubmit={async(values) => {
          try {
            const response=await $Post(`otdr/network`,values)
            const responsedata=await response.json()
            if(response.status == 200){
              dispatch(createnetwork({id:responsedata.network_id,name:values.name}))
              navigate(`/networks/${responsedata.network_id}`)
            }
          } catch (error) {
            
          }
          
        }}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start" labelClassName="mt-2">
              <InputFormik name="name" wrapperClassName="w-2/3" />
            </Description>
            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>
          </div>
          <div className="self-end">
            <SimpleBtn
              className="mr-4"
              type="submit"
              disabled={state?.httpRequestStatus === 'loading'}>
              Save
            </SimpleBtn>
            <SimpleBtn
              onClick={() => navigate('../')}
              type="button"
              disabled={state?.httpRequestStatus === 'loading'}>
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default NetworkCreatePage;
