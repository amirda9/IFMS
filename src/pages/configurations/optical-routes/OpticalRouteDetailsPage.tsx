import dayjs from 'dayjs';
import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';

const OpticalRouteDetailsPage: FC = () => {
  const formik = useFormik({initialValues: {}, onSubmit: () => {}});

  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-full" />
            </Description>

            <Description label="Test Ready">
              <ControlledSelect
                options={[{label: 'Yes'}, {label: 'No'}]}
                onChange={() => {}}
                className="min-w-[13rem]"
              />
            </Description>

            <Description label="Type">
              <ControlledSelect
                options={[{label: 'Dark'}]}
                onChange={() => {}}
                className="min-w-[13rem]"
              />
            </Description>

            <Description label="Average Helix (%)">
              <InputFormik name="averageHelix" className="w-[13rem]" type='number' />
            </Description>

            <Description label="IOR">
              <InputFormik name="ior" className="w-[13rem]" type='number' />
            </Description>

            <Description label="RBS">
              <InputFormik name="rbs" className="w-[13rem]" type='number' />
            </Description>

            <Description label="Owner">
              <span>Admin</span>
            </Description>

            <Description label="Created">
              {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Description>

            <Description label="Last Modified">
              {dayjs().format('YYYY-MM-DD HH:mm:ss')}
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

export default OpticalRouteDetailsPage;
