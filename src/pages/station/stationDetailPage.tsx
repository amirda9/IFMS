import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import * as Yup from 'yup';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';

const stationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter station name'),
  description: Yup.string().required('Please enter station comment'),
  latitude: Yup.string().required('Please enter latitude'),
  longitude: Yup.string().required('Please enter longitude'),
});
const StationDetailPage = () => {
  const params = useParams<{stationId: string}>();
  const {state, request} = useHttpRequest({
    selector: state => ({detail: state.http.stationDetail}),
    initialRequests: request => {
      request('stationDetail', {params: {station_id: params.stationId!}});
    },
  });

  console.log(state,'state');
  
  const buttons = (
    <>
      <SimpleBtn
        type="submit"
        disabled={state.detail?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
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
          <div className="flex flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3"
                className="disabled:bg-white"
                disabled
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3" />
            </Description>

            <Description label="Latitude" items="start">
              <InputFormik
                type="number"
                name="latitude"
                wrapperClassName="w-1/4"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Longitude" items="start">
              <InputFormik
                type="number"
                name="longitude"
                wrapperClassName="w-1/4"
                className="disabled:bg-white"
              />
            </Description>

            <Description label="Region" items="start">
              Region 2
            </Description>

            <Description label="Owner" items="start">
              Admin
            </Description>

            <Description label="Created">
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

export default StationDetailPage;
