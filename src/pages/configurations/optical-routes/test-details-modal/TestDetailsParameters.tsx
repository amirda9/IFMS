import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';

const TestDetailsParameters: FC = () => {
  const formik = useFormik({initialValues: {}, onSubmit: () => {}});

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
              options={[{label: 'True'}, {label: 'False'}]}
              onChange={() => {}}
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
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="station"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="RTU">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="rtu"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Wavelength (nm)">
            <ControlledSelect
              options={[{label: '1625'}, {label: '1630'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Break Strategy">
            <ControlledSelect
              options={[{label: 'Skip'}, {label: 'Slow?'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Data Save Policy">
            <ControlledSelect
              options={[{label: 'Attach Trace File'}, {label: 'Slow?'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Test Mode">
            <ControlledSelect
              options={[{label: 'Fast'}, {label: 'Slow?'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Run Mode">
            <ControlledSelect
              options={[{label: 'Average'}, {label: 'Op2'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Distance Mode">
            <ControlledSelect
              options={[{label: 'Manual'}, {label: 'Automatic'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Range (km)">
            <ControlledSelect
              options={[{label: '3'}, {label: '4'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Pulse Width Mode">
            <ControlledSelect
              options={[{label: 'Manual'}, {label: 'Automatic'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Pulse Width (ns)">
            <ControlledSelect
              options={[{label: '3'}, {label: '4'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Sampling Mode">
            <ControlledSelect
              options={[{label: 'Duration'}, {label: 'Duration 2'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Sampling Duration (s)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="sampling-duration"
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
              name="Section Loss Threshold (dB)"
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
              name="Injection Level Threshold (dB)"
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
