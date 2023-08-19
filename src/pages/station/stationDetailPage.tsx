import React from 'react';
import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import dayjs from 'dayjs';
import * as Yup from 'yup';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});
const StationDetailPage = () => {
  const params = useParams<{stationId: string}>();
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
          name: `Station ${params.stationId}`,
          description:
            'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the',
          latitude: 0,
          longitude: 0,
        }}
        onSubmit={values => {}}
        validationSchema={stationSchema}>
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

            <Description label="Latitude" labelClassName="mt-2" items="start">
              <InputFormik
                type="number"
                name="latitude"
                wrapperClassName="w-1/4"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Longitude" labelClassName="mt-2" items="start">
              <InputFormik
                type="number"
                name="longitude"
                wrapperClassName="w-1/4"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Region" items="start" className="mb-4">
              Region 2
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

export default StationDetailPage;
