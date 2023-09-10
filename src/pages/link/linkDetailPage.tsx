import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';;
import * as Yup from 'yup';
import SelectFormik from '~/container/formik/selectFormik';
import { getPrettyDateTime } from '~/util/time';

const linkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter link name'),
  description: Yup.string().required('Please enter link comment'),
  source: Yup.string().required('Please select source'),
  destination: Yup.string().required('Please select destination'),
  type: Yup.string().required('Please select type'),
});
const LinkDetailPage = () => {
  const params = useParams<{linkId: string}>();
  const buttons = (
    <>
      <SimpleBtn type="submit" disabled={true}>
        Save
      </SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <Formik
        initialValues={{
          name: `Link ${params.linkId}`,
          description:
            'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the',
          latitude: 0,
          longitude: 0,
        }}
        onSubmit={values => {}}
        validationSchema={linkSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="disabled:bg-white"
                disabled
              />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Source" labelClassName="mt-2" items="start">
              <SelectFormik name="source" className="w-1/5 disabled:bg-white">
                <option>Station2</option>
              </SelectFormik>
            </Description>

            <Description
              label="Destination"
              labelClassName="mt-2"
              items="start">
              <SelectFormik
                name="destination"
                className="w-1/5 disabled:bg-white">
                <option>Station1</option>
              </SelectFormik>
            </Description>

            <Description label="Type" labelClassName="mt-2" items="start">
              <SelectFormik name="type" className="w-1/5 disabled:bg-white">
                <option>Cable</option>
              </SelectFormik>
            </Description>

            <Description label="Region" items="start" className="mb-4">
              Region 2
            </Description>

            <Description label="Owner" items="start" className="mb-4">
              Admin
            </Description>

            <Description label="Created" className="mb-4">
              {getPrettyDateTime()}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime()}
            </Description>
          </div>
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default LinkDetailPage;
