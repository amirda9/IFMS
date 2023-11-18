import dayjs from 'dayjs';
import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect} from 'react';
import {networkExplored} from '~/constant';
import { useParams,useNavigate } from 'react-router-dom';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import {setNetworkselectedlist,setNetworkoptical} from './../../../store/slices/opticalroutslice'
import { useDispatch, useSelector } from 'react-redux';
import { $GET } from '~/util/requestapi';
import Cookies from 'js-cookie';


const OpticalRouteCreatePage: FC = () => {
  const params = useParams();
  let navigate=useNavigate()
  const dispatch = useDispatch();
  const {networkselectedlist,networkoptical} = useSelector(
    (state: any) => state.opticalroute,
  );
  const {state, request} = useHttpRequest({
    selector: state => ({
    }),
  });


  useEffect(()=>{

  },[])
  const formik = useFormik({
    initialValues: {
      name: '',
      comment: '',
      test_ready: false,
      type: '',
      avg_hellix_factor: 0,
      network_id: '',
    },
    onSubmit: async(values) => {
      request('opticalrouteCreate', {
        data: {
          name: values.name,
          comment: values.comment,
          test_ready: values.test_ready,
          type: values.type,
          avg_hellix_factor:values.avg_hellix_factor,
          network_id:params.id || "",
        },
      });
setTimeout(async()=>{
  const findopt = networkoptical.findIndex((data:any) => data.networkid == params.id);
  const opticals = await $GET(`otdr/optical-route/?network_id=${params.id}`);
 
  if (findopt > -1) {
    let old = [...networkoptical];
    let newdata=old.filter(data => data.networkid != params.id)
    newdata.push({networkid: params.id, opticalrouts:opticals})
   dispatch(setNetworkoptical(newdata));
  } else {
    let old = [...networkoptical];
    const opticals = await $GET(`otdr/optical-route/?network_id=${params.id}`);
    old.push({networkid: params.id, opticalrouts:opticals})
   dispatch(setNetworkoptical(old)) ;
  }
  // navigate(opticals[opticals.length-1].id)
},200)
  



    },
  });


  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form

          className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik  name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-full" />
            </Description>

            <Description label="Test Ready">
              <ControlledSelect
                options={[{label: 'No'}, {label: 'Yes'}]}
                onChange={(e) => formik.setFieldValue("test_ready",e == 1?true:false)}
                className="min-w-[13rem]"
              />
            </Description>

            <Description label="Type">
            <Select
                onChange={e => formik.setFieldValue('type', e.target.value)}
                className="min-w-[13rem]">
                <option value="" className="hidden">
                  select
                </option>
                <option value={undefined} className="hidden">
                select
                </option>

                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                dark
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  light
                </option>
              </Select>
       
            </Description>

            <Description label="Average Helix (%)">
              <InputFormik
                name="avg_hellix_factor"
                className="w-[13rem]"
                type="number"
              />
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default OpticalRouteCreatePage;
