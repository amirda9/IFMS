import React from 'react';
import {Description, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import {FormLayout} from '~/layout';

const regionSchema = Yup.object().shape({
  name: Yup.string().required('Please enter region name'),
  description: Yup.string().required('Please enter region comment'),
});
const RegionDetailPage = () => {
  const params = useParams<{regionId: string}>();
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
          name: `Region ${params.regionId}`,
          description:
            'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the',
        }}
        onSubmit={values => {}}
        validationSchema={regionSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                className="w-2/3 disabled:bg-white"
              />
            </Description>

            <Description label="Comments" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Owner" items="start" className="mb-4">
              Admin
            </Description>

            <Description label="Created" className="mb-4">
              {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Description>

            <Description label="Last Modified">
              {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Description>
          </div>
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default RegionDetailPage;
