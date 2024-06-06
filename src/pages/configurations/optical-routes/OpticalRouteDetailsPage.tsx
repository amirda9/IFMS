import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import * as Yup from 'yup';
import {useParams} from 'react-router-dom';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import {useDispatch} from 'react-redux';
import {changeOpticalroutename} from '~/store/slices/opticalroutslice';
import {UserRole} from '~/constant/users';

const Schema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  avg_hellix_factor: Yup.string().required('Please enter avg_hellix_factor'),
});

const OpticalRouteDetailsPage: FC = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  const {
    request,
    state: {opticalrouteDetail},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteDetail: state.http.opticalrouteDetail,
    }),
    initialRequests: request => {
      // if (list?.httpRequestStatus !== 'success') {
      request('opticalrouteDetail', {
        params: {optical_route_id: params.opticalRouteId!.split('_')[0] || ''},
      });
      // }
    },
  });

  const formik = useFormik({
    validationSchema: Schema,
    enableReinitialize: true,
    initialValues: {
      name: opticalrouteDetail?.data?.name,
      comment: opticalrouteDetail?.data?.comment,
      test_ready: opticalrouteDetail?.data?.test_ready,
      type: opticalrouteDetail?.data?.type,
      avg_hellix_factor: opticalrouteDetail?.data?.avg_hellix_factor,
      id: opticalrouteDetail?.data?.id,
      owner: {
        id: opticalrouteDetail?.data?.owner.id,
        username: opticalrouteDetail?.data?.owner.username,
      },
      time_created: opticalrouteDetail?.data?.time_created,
      time_updated: opticalrouteDetail?.data?.time_updated,
    },
    onSubmit: () => {
      try {
        request('opticalrouteUpdate', {
          params: {
            optical_route_id: params.opticalRouteId!.split('_')[0] || '',
          },
          data: {
            name: formik.values.name || '',
            comment: formik.values.comment || '',
            test_ready: formik.values.test_ready || false,
            type: formik.values.type || '',
            avg_hellix_factor: formik.values.avg_hellix_factor || 0,
          },
        });
        dispatch(
          changeOpticalroutename({
            networkid: params.opticalRouteId!.split('_')[1]!,
            opticalId: params.opticalRouteId!.split('_')[0]!,
            opticalName: formik.values.name!,
          }),
        );
      } catch (error) {}
    },
  });

  if (opticalrouteDetail?.httpRequestStatus == 'loading') {
    return <h1>Loading ...</h1>;
  }

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
              <Select
                onChange={e =>
                  formik.setFieldValue(
                    'type',
                    e.target.value == 'NO' ? false : true,
                  )
                }
                className="min-w-[13rem]">
                <option value="" className="hidden">
                  {opticalrouteDetail?.data?.test_ready == false ? 'NO' : 'YES'}
                </option>
                <option value={undefined} className="hidden">
                  {opticalrouteDetail?.data?.test_ready == false ? 'NO' : 'YES'}
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
            <div className="flex flex-row items-center">
              <Description label="Avg. Helix Factor">
                <InputFormik
                  min={1}
                  max={1.5}
                  step={0.01}
                  name="avg_hellix_factor"
                  className="w-[13rem]"
                  type="number"
                />
              </Description>
              <span className="ml-[4px]">%</span>
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
            {loggedInUser.role === UserRole.SUPER_USER ? (
              <SimpleBtn type="submit">Save</SimpleBtn>
            ) : null}
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
