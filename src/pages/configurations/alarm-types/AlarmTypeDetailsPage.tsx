import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {RootState} from '~/store';
import {
  setalarmlist,
} from '~/store/slices/alarmstypeslice';
import {deepcopy} from '~/util';
import {$Put} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';

type FormType = {
  name: string;
  comment: string;
  sourceDataSet: string;
};

const AlarmTypeDetailsPage: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {alarmtypedetail, alarmtypelist, alarmtypeloading, getalarmtype} =
    useSelector((state: RootState) => state.alarmtypes);


  const formik = useFormik<FormType>({
    enableReinitialize: true,
    initialValues: {
      name: alarmtypedetail.name,
      comment: alarmtypedetail.comment,
      sourceDataSet: 'Fiber Result',
    },
    onSubmit: async values => {
      try {
        const updatealarmtypedetail = await $Put(
          `otdr/alarm/${params!.alarmId!}`,
          {name: values.name, comment: values.comment},
        );
        if (updatealarmtypedetail?.status == 201) {
          const alarmtypelistCopy = deepcopy(alarmtypelist);
          const findalarmindex = alarmtypelist.findIndex(
            data => data.id == params!.alarmId!,
          );
          alarmtypelistCopy[findalarmindex].name = values.name;
          alarmtypelistCopy[findalarmindex].comment = values.comment;
          dispatch(setalarmlist(alarmtypelistCopy));
          toast('It was done successfully', {type: 'success', autoClose: 1000});
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    },
  });

  if (alarmtypeloading) {
    return <h1>Loaing...</h1>;
  }
  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" className="flex-grow">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" labelClassName="mt-[-30px]">
              <TextareaFormik name="comment" />
            </Description>

            <Description label="Owner" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {alarmtypedetail.owner_username}
              </span>
            </Description>
            <Description label="Created" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {getPrettyDateTime(alarmtypedetail.time_created)}
              </span>
            </Description>
            <Description label="Last Modified" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {getPrettyDateTime(alarmtypedetail.time_modified)}
              </span>
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

export default AlarmTypeDetailsPage;
