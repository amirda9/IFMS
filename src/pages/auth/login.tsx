import React from 'react';
import logo from '~/assets/images/logo.png';
import {Form, Formik} from 'formik';
import {InputFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Please enter username or email'),
  password: Yup.string().required('Please Enter password'),
  remember: Yup.boolean(),
});
const Login = () => {
  const {state, request} = useHttpRequest({
    selector: state => state.http.login,
  });

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      validationSchema={loginSchema}
      onSubmit={data => {
        request('login', {data});
      }}
    >
      <div className="h-screen bg-[url('~/assets/images/loginBackground.png')] pt-10 pl-10 flex flex-col justify-between">
        <div className={'flex flex-row items-center'}>
          <img src={logo} className={'w-24 h-24'} />
          <h1 className={'text-white text-4xl font-bold ml-4'}>Ariotech</h1>
        </div>

        <div className="self-end w-2/3">
          <h2 className={'text-white text-3xl ml-4 mb-4'}>
            Intelligent Fiber Monitoring System
          </h2>
          <div className={'bg-[#D9D9D933] mb-32'}>
            <Form className={'w-3/5 pl-7 pt-16 pb-2.5 flex flex-col'}>
              <div className="flex flex-row justify-between">
                <span className={'text-white font-normal text-xl'}>
                  Username or email
                </span>
                <InputFormik
                  name="username"
                  className={'h-10 w-80   bg-[#D9D9D9] rounded-lg px-4 text-sm'}
                />
              </div>
              <div className={'flex flex-row justify-between items-center'}>
                <span className={'text-white font-normal text-xl'}>
                  Password
                </span>
                <InputFormik
                  name={'password'}
                  className={'h-10 w-80  bg-[#D9D9D9] rounded-lg px-4'}
                  type={'password'}
                />
              </div>
              <button
                disabled={state?.httpRequestStatus === 'loading'}
                type={'submit'}
                className={
                  'h-8 bg-green-500 text-white font-bold text-lg rounded-md px-6 self-end my-2.5 active:bg-green-300'
                }
              >
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>
    </Formik>
  );
};

export default Login;
