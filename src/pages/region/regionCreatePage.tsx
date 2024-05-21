
import {Description, SimpleBtn} from '~/components';
import {useNavigate, useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';
import {
  createRegion
} from './../../store/slices/networktreeslice';
import { useDispatch } from 'react-redux';
import { $Post } from '~/util/requestapi';
const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
});
const RegionDetailPage = () => {
  const dispatch=useDispatch()
  const params=useParams()
  const navigate = useNavigate();
  const buttons = (
    <>
      <SimpleBtn
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}
        >
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <h1 className="mb-4 text-md font-bold">Create Region</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        onSubmit={async(values) => {
          try {
            const createregion=await $Post(`otdr/region/network/${params.networkid}`,{name: values.name, description: values.description})
            const responsedata=await createregion.json()
            if(createregion.status == 200){
            dispatch(createRegion({networkid:params.networkid!,regionid:responsedata.region_id,regionname:values.name}))
            navigate(`/regions/${responsedata.region_id}_${params.networkid}`)

            }
          } catch (error) {
            
          }

        }}
        validationSchema={regionSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik name="name" wrapperClassName='w-2/3' className="disabled:bg-white" />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default RegionDetailPage;
