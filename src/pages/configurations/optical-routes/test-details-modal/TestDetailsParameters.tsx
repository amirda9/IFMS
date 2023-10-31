import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';
import {useHttpRequest} from '~/hooks';

const TestDetailsParameters: FC = () => {
  const params = useParams();




  const {
    request,
    state: {opticalrouteTestSetupDetail},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteTestSetupDetail: state.http.opticalrouteTestSetupDetail,
    }),
    initialRequests: request => {
      request('opticalrouteTestSetupDetail', {
        params: {
          optical_route_id: params.opticalRouteId || '',
          test_setup_id: params.testId || '',
        },
      });
    },
    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.opticalrouteDeletTestsetup?.httpRequestStatus === 'loading' &&
    //     state.opticalrouteDeletTestsetup!.httpRequestStatus === 'success'
    //   ) {
    //     request('opticalrouteTestSetup', {
    //       params: {optical_route_id: params.opticalRouteId || ''},
    //     });
    //   }
    // },
  });
  const formik = useFormik({
    initialValues: {
      name:opticalrouteTestSetupDetail?.data?.name || "",
      station:opticalrouteTestSetupDetail?.data?.station.name || "",
      rtu:opticalrouteTestSetupDetail?.data?.rtu?.name || "",
      enabled:opticalrouteTestSetupDetail?.data?.parameters?.enabled || false,
      Wavelength:opticalrouteTestSetupDetail?.data?.parameters?.wavelength || "",
      BreakStrategy:opticalrouteTestSetupDetail?.data?.parameters?.break_strategy || "",
      DataSavePolicy:opticalrouteTestSetupDetail?.data?.parameters?.date_save_policy || "",
      TestMode:opticalrouteTestSetupDetail?.data?.parameters.test_mode  || "",
      RunMode:opticalrouteTestSetupDetail?.data?.parameters.run_mode || "",
      PulseWidthMode:opticalrouteTestSetupDetail?.data?.parameters?.pulse_width_mode || "",
      PulseWidthns:opticalrouteTestSetupDetail?.data?.parameters.pulse_width || 0,
      samplingduration:opticalrouteTestSetupDetail?.data?.parameters.run_mode || 0,
      IOR:opticalrouteTestSetupDetail?.data?.parameters?.IOR || 0,
      RBS:opticalrouteTestSetupDetail?.data?.parameters?.RBS || 0,
      SectionLossThreshold:opticalrouteTestSetupDetail?.data?.parameters?.section_loss_threshold || 0,
      InjectionLevelThreshold:opticalrouteTestSetupDetail?.data?.parameters?.injection_level_threshold || 0,
      DistanceMode:opticalrouteTestSetupDetail?.data?.parameters?.distance_mode,
      Range:opticalrouteTestSetupDetail?.data?.parameters?.range,
      SamplingMode:opticalrouteTestSetupDetail?.data?.parameters?.sampling_mode
    },
    onSubmit: () => {},
  });
  console.log(opticalrouteTestSetupDetail, '😘🤑😎');
  console.log(formik.values, 'yyyyyyyyyyy');
  return (
    <FormikProvider value={formik}>
      <Form className="flex flex-col gap-y-8">
        <div className="flex w-2/3 flex-grow flex-col gap-y-4 pb-4">
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Name">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="name"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Enabled">
            <ControlledSelect
              name="enabled"
              options={[{label: 'False'}, {label: 'True'}]}
              onChange={e =>
                formik.setFieldValue('enabel', e == 1 ? 'true' : 'false')
              }
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Type">
            <ControlledSelect
              options={[{label: 'Proactive'}, {label: 'Proactive 2'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Station">
            {/* <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="station"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue('station', e.target.value.toString())
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.station}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.station}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                station1
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                station2
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="RTU">
            {/* <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="rtu"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue('rtu', e.target.value.toString())
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.rtu}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.rtu}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                rtu1
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                rtu2
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Wavelength (nm)">
            {/* <ControlledSelect
              options={[{label: '1625'}, {label: '1630'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e => formik.setFieldValue('Wavelength', e.target.value)}
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.Wavelength}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.Wavelength}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1630
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1630
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Break Strategy">
            {/* <ControlledSelect
              options={[{label: 'Skip'}, {label: 'Slow?'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue('BreakStrategy', e.target.value)
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.BreakStrategy}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.BreakStrategy}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Slow
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Slow
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Data Save Policy">
            <Select
              onChange={e =>
                formik.setFieldValue('DataSavePolicy', e.target.value)
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.DataSavePolicy}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.DataSavePolicy}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Data Save Policy
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Slow
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Test Mode">
            {/* <ControlledSelect
              options={[{label: 'Fast'}, {label: 'Slow?'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}

            <Select
              onChange={e => formik.setFieldValue('TestMode', e.target.value)}
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.TestMode}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.TestMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Fast
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Slow
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Run Mode">
            {/* <ControlledSelect
              options={[{label: 'Average'}, {label: 'Op2'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e => formik.setFieldValue('RunMode', e.target.value)}
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.RunMode}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.RunMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Average
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Op2
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Distance Mode">
            {/* <ControlledSelect
              options={[{label: 'Manual'}, {label: 'Automatic'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e => formik.setFieldValue('DistanceMode', e.target.value)}
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.DistanceMode}
              </option>
              <option value={undefined} className="hidden">
              {formik.values.DistanceMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Average
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Op2
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Range (km)">
            {/* <ControlledSelect
              options={[{label: '3'}, {label: '4'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue('Range', e.target.value.toString())
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.Range} 
              </option>
              <option value={undefined} className="hidden">
              {formik.values.Range} 
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                3
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                4
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Pulse Width Mode">
            {/* <ControlledSelect
              options={[{label: 'Manual'}, {label: 'Automatic'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue(
                  'PulseWidthMode',
                  e.target.value.toString(),
                )
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.PulseWidthMode} 
              </option>
              <option value={undefined} className="hidden">
              {formik.values.PulseWidthMode} 
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Automatic
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Manual
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Pulse Width (ns)">
            {/* <ControlledSelect
              options={[{label: '3'}, {label: '4'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
            <Select
              onChange={e =>
                formik.setFieldValue('PulseWidthns', e.target.value.toString())
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.PulseWidthns} 
              </option>
              <option value={undefined} className="hidden">
              {formik.values.PulseWidthns} 
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                3
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                4
              </option>
            </Select>
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Sampling Mode">
            <Select
              onChange={e =>
                formik.setFieldValue('SamplingMode', e.target.value.toString())
              }
              className="basis-96">
              <option value="" className="hidden">
              {formik.values.SamplingMode} 
              </option>
              <option value={undefined} className="hidden">
              {formik.values.SamplingMode} 
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Duration
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                Duration 2
              </option>
            </Select>
            {/* <ControlledSelect
              options={[{label: 'Duration'}, {label: 'Duration 2'}]}
              onChange={() => {}}
              className="basis-96"
            /> */}
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Sampling Duration (s)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="samplingduration"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="IOR">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="IOR"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="RBS (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="RBS (dB)"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Event Loss threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="Event Loss threshold (dB)"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Event Reflection Threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="Event Reflection Threshold (dB)"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Fiber End Threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="Fiber End Threshold (dB)"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Total Loss Threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="Total Loss Threshold (dB)"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Section Loss Threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="SectionLossThreshold"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Injection Level Threshold (dB)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="InjectionLevelThreshold"
              type="number"
            />
          </Description>
          {/* 
----------- */}
        </div>
      </Form>
    </FormikProvider>
  );
};

export default TestDetailsParameters;
