import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {cretealarmtype} from '~/store/slices/alarmstypeslice';
import {$Post} from '~/util/requestapi';

type FormType = {
  name: string;
  comment: string;
};

const AlarmTypeCreatePage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik<FormType>({
    initialValues: {
      name: '',
      comment: '',
    },
    onSubmit: async values => {
      try {
        const response = await $Post(`otdr/alarm/`, {
          name: values.name,
          comment: values.comment,
        });
        if (response?.status == 200) {
          const responsedata = await response?.json();
          dispatch(cretealarmtype({id: responsedata, name: values.name}));
          navigate(`../${responsedata}`);
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
        `createalarmError is:${error}`;
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
