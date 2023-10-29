import dayjs from 'dayjs';
import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import { useParams } from 'react-router-dom';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useHttpRequest} from '~/hooks';

const OpticalRouteCreatePage: FC = () => {
  const params = useParams();
  const {state, request} = useHttpRequest({
    selector: state => ({
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      comment: '',
      test_ready: false,
      type: '',
      avg_hellix_factor: 0,
      network_id: '',
    },
    onSubmit: (values) => {
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
