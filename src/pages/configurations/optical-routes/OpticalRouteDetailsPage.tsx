import dayjs from 'dayjs';
import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import { useParams } from 'react-router-dom';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import { useHttpRequest } from '~/hooks';
import { getPrettyDateTime } from '~/util/time';

const OpticalRouteDetailsPage: FC = () => {
  const params=useParams()

  const {
    request,
    state: {opticalrouteDetail},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteDetail: state.http.opticalrouteDetail,
    }),
    initialRequests: request => {
      // if (list?.httpRequestStatus !== 'success') {
        request('opticalrouteDetail', {params:{optical_route_id:params.opticalRouteId || ""
        }});
      // }
    },
    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.deleteRequest?.httpRequestStatus === 'loading' &&
    //     state.deleteRequest!.httpRequestStatus === 'success'
    //   ) {
    //     request('networkList', undefined);
    //   }
    // },
  });
  // console.log(opticalrouteDetail?.data,'opticalrouteDetail');
  const formik = useFormik({  enableReinitialize:true,initialValues: {
    name:opticalrouteDetail?.data?.name,
  comment: opticalrouteDetail?.data?.comment,
  test_ready: opticalrouteDetail?.data?.test_ready,
  type:opticalrouteDetail?.data?.type,
  avg_hellix_factor:opticalrouteDetail?.data?.avg_hellix_factor,
  id:opticalrouteDetail?.data?.id,
  owner: {
    id:opticalrouteDetail?.data?.owner.id,
    username:opticalrouteDetail?.data?.owner.username
  },
  time_created:opticalrouteDetail?.data?.time_created,
  time_updated:opticalrouteDetail?.data?.time_updated
  }, onSubmit: () => {

  }});

  console.log(formik.values,'uuu');
  
  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider    value={formik}>
        <Form    className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" items="start">
              <InputFormik  name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" items="start">
              <TextareaFormik name="comment" className="w-full" />
            </Description>

            <Description label="Test Ready">
            <Select
                onChange={e => formik.setFieldValue('type', e.target.value == "NO"?false:true)}
                className="min-w-[13rem]">
                <option value="" className="hidden">
                {opticalrouteDetail?.data?.test_ready == false?"NO":"YES"}
                </option>
                <option value={undefined} className="hidden">
                {opticalrouteDetail?.data?.test_ready == false?"NO":"YES"}
                </option>

                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
               YES
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              NO
                </option>
              </Select>
            </Description>

            <Description label="Type">
            <Select
                onChange={e => formik.setFieldValue('type', e.target.value)}
                className="min-w-[13rem]">
                <option value="" className="hidden">
                {opticalrouteDetail?.data?.type}
                </option>
                <option value={undefined} className="hidden">
                {opticalrouteDetail?.data?.type}
                </option>

                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                dark
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  light
                </option>
              </Select>
            </Description>
             <div className='flex flex-row items-center'>
             <Description label="Avg. Helix Factor">
              <InputFormik name="avg_hellix_factor" className="w-[13rem]" type='number' />
            </Description>
            <span className='ml-[4px]'>
            %
            </span>
            
             </div>
         

            <Description label="Owner">
              <span>{opticalrouteDetail?.data?.owner.username}</span>
            </Description>

            <Description label="Created">
              {getPrettyDateTime(opticalrouteDetail?.data?.time_created)}
            </Description>

            <Description label="Last Modified">
              {getPrettyDateTime(opticalrouteDetail?.data?.time_updated)}
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
