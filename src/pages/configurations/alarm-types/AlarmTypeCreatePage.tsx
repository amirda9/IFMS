import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import { $Post } from '~/util/requestapi';

type FormType = {
  name: string;
  comment: string;
  // sourceDataSet: string;
};

const AlarmTypeCreatePage: FC = () => {
  const formik = useFormik<FormType>({
    initialValues: {
      name: '',
      comment: '',
      // sourceDataSet: 'Fiber Result',
    },
    onSubmit: async(values) => {
const response=await $Post(`otdr/alarm/`,{name:values.name,comment:values.comment})
if(response.status == 200){
 
}
    },
  });

  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" className="flex-grow">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment">
              <TextareaFormik name="comment" />
            </Description>

            {/* <Description label="Source Data Set">
              <ControlledSelect
                options={[{label: 'Fiber Result'}]}
                value={formik.values.sourceDataSet || ''}
                onChange={() => {}}
                className="min-w-[19rem]"
              />
            </Description> */}
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

export default AlarmTypeCreatePage;
