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
const LoginPage = () => {
  const {state, request} = useHttpRequest({
    selector: state => state.http.login,
  });

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      validationSchema={loginSchema}
      onSubmit={data => {
        request('login', {data});
      }}>
      <div className="flex h-screen flex-col justify-between bg-[url('~/assets/images/loginBackground.png')] pl-10 pt-10">
        <div className="flex flex-row items-center">
          <img src={logo} className="h-24 w-24" />
          <h1 className="ml-4 text-4xl font-bold text-white">Ariotech</h1>
        </div>

        <div className="self-end md:w-2/3">
          <h2 className="mb-4 ml-4 text-3xl text-white">
            Intelligent Fiber Monitoring System
          </h2>
          <div className="mb-32 bg-[#D9D9D933]">
            <Form className="flex w-fit max-w-full flex-col pb-2.5 pl-7 pt-16">
              <div className="flex flex-row flex-wrap justify-between xl:flex-nowrap">
                <span className="mt-1.5 w-48 text-xl font-normal text-white">
                  Username or email
                </span>
                <InputFormik
                  name="username"
                  className="!h-12 w-96 rounded-lg bg-[#D9D9D9] px-4 text-sm"
                />
              </div>
              <div className="flex flex-row flex-wrap items-start justify-between xl:flex-nowrap">
                <span className="mt-1.5 w-48 text-xl font-normal text-white">
                  Password
                </span>
                <InputFormik
                  name="password"
                  className="!h-12 w-96  rounded-lg bg-[#D9D9D9] px-4"
                  type="password"
                />
              </div>
              <button
                disabled={state?.httpRequestStatus === 'loading'}
                type="submit"
                className="my-2.5 h-8 self-end rounded-md bg-green-500 px-6 text-lg font-bold text-white active:bg-green-300">
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>
    </Formik>
  );
};

export default LoginPage;
