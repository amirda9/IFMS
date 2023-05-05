import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../store/auth/authActions";
import { useEffect } from "react";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import styled from "styled-components";



const Wrapper = styled.section`
background-image: url("/images/login-bg.jpg");
background-size: cover;
background-repeat: no-repeat;
position: relative;
color: white;
`;


const LoginScreen = () => {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const history = useHistory();

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (Object.keys(userInfo).length) {
      history.push("/user-profile");
    }
  }, [history, userInfo]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  // styled section



  return (
    <Wrapper className="h-screen">
      <div className="absolute w-full md:w-3/5 top-44 md:top-auto md:bottom-16 md:right-0">
        <p className="text-[34px] mb-7 font-bold ml-4">Intelligent Fiber Monitoring System</p>
        <div className=" bg-[#d9d9d933]">
          <form
            className="w-full md:w-1/2 pt-7 pl-4 pb-2 pr-3 pr-md-0"
            onSubmit={handleSubmit(submitForm)}
          >
            {error && <Error>{error}</Error>}
            <div className="form-group flex justify-between mb-4 items-center">
              <label className="text-[18px]" htmlFor="email">Username or email</label>
              <input
                type="text"
                className="p-2 w-1/2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                {...register("email")}
                required
              />
            </div>
            <div className="form-group flex justify-between  items-center">
              <label className="text-[18px]" htmlFor="password">Password</label>
              <input
                type="password"
                className="p-2 w-1/2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                {...register("password")}
                required
              />
            </div>
            <div className="flex mt-4 justify-end">
              <button
                type="submit"
                className="text-white text-[18px] bg-[#18C047] focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5   mb-2"
                disabled={loading}
              >
                Login
              </button>
              {loading && <Spinner />  }

            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default LoginScreen;
