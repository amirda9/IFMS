import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik, SelectFormik, TextareaFormik} from '~/container';
import {setNetworkoptical} from './../../../store/slices/opticalroutslice';
import {useDispatch, useSelector} from 'react-redux';
import {$Get, $Post} from '~/util/requestapi';
import {deepcopy} from '~/util';

const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  type: Yup.string().required('Please enter type'),
});
const OpticalRouteCreatePage: FC = () => {
  const params = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const {networkselectedlist, networkoptical} = useSelector(
    (state: any) => state.opticalroute,
  );

  const formik = useFormik({
    validationSchema: rtuSchema,
    initialValues: {
      name: '',
      comment: '',
      test_ready: false,
      type: '',
      avg_hellix_factor: 0,
      network_id: '',
    },
    onSubmit: async values => {
      try {
        setLoading(true)
        const createoptical = await $Post(`otdr/optical-route/`, {
          name: values.name,
          comment: values.comment,
          test_ready: values.test_ready,
          type: values.type,
          avg_hellix_factor: values.avg_hellix_factor,
          network_id: params.id || '',
        });
        const createopticaldata = await createoptical?.json();
        if (createoptical?.status == 201) {
          const findopt = networkoptical.findIndex(
            (data: any) => data.networkid == params.id,
          );
          const opticals = await $Get(
            `otdr/optical-route/?network_id=${params.id}`,
          );
          const opticaldata = await opticals?.json();
          if (opticals?.status == 200) {
            let networkopticalCopy = deepcopy(networkoptical);
            if (findopt > -1) {
              let newdata = networkopticalCopy.filter(
                (data: any) => data.networkid != params.id,
              );
              newdata.push({networkid: params.id, opticalrouts: opticaldata});
              dispatch(setNetworkoptical(newdata));
            } else {
              networkopticalCopy.push({
                networkid: params.id,
                opticalrouts: opticaldata,
              });
              dispatch(setNetworkoptical(networkopticalCopy));
            }
            setLoading(false)
            navigate(
              `/config/optical-routes/${createopticaldata.id}/${params.id}`,
            );
            //  navigate(`../${createopticaldata.id}`)
          }
        }
      } catch (error) {
        console.log();
        
      } 
    },
  });

  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <span className="text-md mb-6 font-bold text-black">
              Create opticalroute
            </span>
            <Description label="Name" items="start">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-full" />
            </Description>

            <Description label="Test Ready">
              <ControlledSelect
                options={[{label: 'No'}, {label: 'Yes'}]}
                onChange={e =>
                  formik.setFieldValue('test_ready', e == 1 ? true : false)
                }
                className="min-w-[13rem]"
              />
            </Description>

            <Description label="Type">
              <SelectFormik
                placeholder="select"
                name="type"
                className="w-[400px]">
                <option value="select" label="" className="hidden" />
                <option value={undefined} label="select" className="hidden" />

                <option
                  key={0}
                  label={'dark'}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  dark
                </option>
                <option
                  key={2}
                  label={'light'}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  light
                </option>
              </SelectFormik>
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
            <SimpleBtn loading={loading} type="submit">Save</SimpleBtn>
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
