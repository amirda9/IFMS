import logo from '~/assets/images/logo.png';
import {Form, Formik} from 'formik';
import {InputFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {useEffect, useState} from 'react';
import { toast } from 'react-toastify';

type LoginFormType = {
  username: string;
  password: string;
};

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Please enter username or email'),
  password: Yup.string().required('Please Enter password'),
  remember: Yup.boolean(),
});

const LoginPage = () => {
  const {state, request} = useHttpRequest({
    selector: state => state.http.login,
  });
  const [mount,setMount]=useState(false)

  const [errormessage, setErrormessage] = useState('');

  const handleLoginSubmit = (values: LoginFormType) => {
    request('login', {data: values});
  };

  
  useEffect(()=>{
    if(mount){
      if (state?.httpRequestStatus && state?.httpRequestStatus == 'error') {
        if (state.error?.status == 404) {
          setErrormessage('invalid username or password');
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
        console.log('state.error', state.error?.status);
      } else {
        setErrormessage('');
      }
    }else{
setMount(true)
    }
   
  },[state])
  console.log('state?.httpRequestStatus', state?.httpRequestStatus);

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      validationSchema={loginSchema}
      onSubmit={handleLoginSubmit}>
      <div className="flex h-screen flex-col justify-between bg-[url('~/assets/images/loginBackground.png')] pl-10 pt-10">
        <div className="flex flex-row items-center">
          <img src={logo} className="h-24 w-24" />
          <h1 className="ml-4 font-s text-4xl font-bold text-white">
            Ariotech
          </h1>
        </div>

        <div className="self-end md:w-2/3">
          <h2 className="mb-4 ml-4 text-3xl font-bold text-white ">
            Intelligent Fiber Monitoring System
          </h2>
          <div className="mb-32 bg-[#D9D9D933]">
            <Form className="flex w-fit max-w-full flex-col gap-y-4 pb-2.5 pl-7 pt-16">
              <div className="flex flex-row flex-wrap items-center justify-between xl:flex-nowrap">
                <span className="w-72 text-xl font-normal text-white">
                  Username or email
                </span>
                <InputFormik
                  name="username"
                  wrapperClassName="w-full"
                  className="!h-11 w-80 rounded-lg bg-[#D9D9D9] px-4 text-sm"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center justify-between xl:flex-nowrap">
                <span className="w-72 text-xl font-normal text-white">
                  Password
                </span>
                <InputFormik
                  name="password"
                  className="!h-11 w-80 rounded-lg bg-[#D9D9D9] px-4"
                  type="password"
                />
              </div>
              {errormessage.length >0?
              <span className='text-[red] text-[20px] font-bold'>{errormessage}</span>
            :null
            }
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
