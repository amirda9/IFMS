import {useParams} from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {useNavigate} from 'react-router-dom';
import {networkExplored} from '~/constant';
import Cookies from 'js-cookie';
import {FormLayout} from '~/layout';
import {Form, Formik} from 'formik';
import {InputFormik, TextareaFormik} from '~/container';
import {useDispatch, useSelector} from 'react-redux';
import {settypestate} from './../../store/slices/networkslice';
import * as Yup from 'yup';
import SelectFormik from '~/container/formik/SelectFormik';
import {getPrettyDateTime} from '~/util/time';
import {useHttpRequest} from '~/hooks';

const linkSchema = Yup.object().shape({
  name: Yup.string().required('Please enter link name'),
  description: Yup.string().required('Please enter link comment'),
  source: Yup.string().required('Please select source'),
  destination: Yup.string().required('Please select destination'),
  type: Yup.string().required('Please select type'),
});
const LinkCreatePage = () => {
  const networkId = Cookies.get(networkExplored);
  const navigate = useNavigate();
  const {linkDetail} = useSelector((state: any) => state.http);
  console.log(linkDetail?.data?.access, 'fffrrtttt');
  const {type} = useSelector((state: any) => state.network);
  const dispatch = useDispatch();
  const params = useParams<{linkId: string}>();

  const {
    state: {create,allLinks},
    request,
  } = useHttpRequest({
    selector: state => ({create: state.http.linkCreate,allLinks: state.http.allLinks}),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
    onUpdate: lastState => {
      if (
        lastState.create?.httpRequestStatus === 'loading' &&
        create?.httpRequestStatus === 'success'
      ) {
        request('allLinks', undefined);
        // navigate('../' + create?.data?.link_id);
      }
    },
  });

  console.log(create, 'createuuuuuuu');

  console.log(allLinks, 'allLinks');

  // const buttons = (
  //   <>
  //     {/* {linkDetail?.data?.access == 'ADMIN' ? ( */}
  //       <SimpleBtn type="submit" >
  //         Save
  //       </SimpleBtn>
  //     {/* ) : null} */}
  //     <SimpleBtn>Cancel</SimpleBtn>
  //   </>
  // );
  const buttons = (
    <>
      <SimpleBtn
        onClick={() => {
          document.getElementById('formSubmit')?.click();
        }}
        disabled={create?.httpRequestStatus === 'loading'}>
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
          name: `Link name`,
          description:
            'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the',
          latitude: 0,
          longitude: 0,
          destination: '',
          source: '',
          type: 'cable',
        }}
        onSubmit={values => {
          request('linkCreate', {
            data: {
              name: values.name,
              network_id: networkId!,
              source_id: values.source,
              destination_id: values.destination,
              link_points: [
                {
                  latitude: 1,
                  longitude: 1,
                },
                {
                  latitude: 0,
                  longitude: 0,
                },
              ],
              // region_id:"",
              description: values.description,
              type: values.type,
            },
          });
        }}
        validationSchema={linkSchema}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <Description label="Name" labelClassName="mt-2" items="start">
              <InputFormik
                name="name"
                wrapperClassName="w-2/3 text-sm"
                className="disabled:bg-white"
                // disabled
              />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="description" className="w-2/3 text-sm" />
            </Description>

            <Description label="Source" items="center">
              <SelectFormik
                name="source"
                className="w-1/5 text-sm disabled:bg-white">
                <option>source1</option>
                <option>source1</option>
              </SelectFormik>
            </Description>

            <Description label="Destination" items="center">
              <SelectFormik
                name="destination"
                className="w-1/5 text-sm disabled:bg-white">
                <option>destination1</option>
                <option>destination2</option>
              </SelectFormik>
            </Description>

            <Description label="Type" items="center">
              <SelectFormik
                defaultValue={type}
                onChange={e => dispatch(settypestate(e.target.value))}
                name="type"
                className="w-1/5 text-sm disabled:bg-white">
                <option>Cable</option>
                <option>duct</option>
              </SelectFormik>
            </Description>
          </div>
          <button type="submit" id="formSubmit" hidden />
        </Form>
      </Formik>
    </FormLayout>
  );
};

export default LinkCreatePage;
