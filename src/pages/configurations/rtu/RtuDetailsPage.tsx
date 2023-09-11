import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';

const RtuDetailsPage: FC = () => {
  const formik = useFormik({
    initialValues: {
      name: 'RTU1',
    },
    onSubmit: () => {},
  });

  return (
    <div className="flex flex-grow">
      <FormikProvider value={formik}>
        <Form className="flex flex-grow flex-col gap-y-8">
          <div className="flex flex-grow flex-col gap-y-4">
            <Description label="Name">
              <InputFormik name="name" wrapperClassName="w-3/5" />
            </Description>
            <Description label="Model">
              <ControlledSelect
                options={[{label: 'Model1'}]}
                onChange={value => {
                  formik.setFieldValue('model', value);
                }}
                className="w-1/4"
              />
            </Description>
            <Description label="Station">
              <ControlledSelect
                options={[{label: 'Station1'}]}
                onChange={value => {
                  formik.setFieldValue('station', value);
                }}
                className="w-1/4"
              />
            </Description>
            <Description label="Contact Person">
              <ControlledSelect
                options={[{label: 'User2'}]}
                onChange={value => {
                  formik.setFieldValue('contactUser', value);
                }}
                className='w-1/4'
              />
            </Description>
          </div>
          <div className="flex gap-x-4 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RtuDetailsPage;
