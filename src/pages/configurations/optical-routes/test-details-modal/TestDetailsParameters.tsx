import {Form, FormikProvider, useFormik} from 'formik';
import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';

const TestDetailsParameters: FC = () => {
  const formik = useFormik({initialValues: {}, onSubmit: () => {}});

  return (
    <FormikProvider value={formik}>
      <Form className="flex flex-col gap-y-8">
        <div className="flex w-1/2 flex-grow flex-col gap-y-4">
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Name">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
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
            label="Station">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="station"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="RTU">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="rtu"
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
              wrapperClassName='w-full'
              name="sampling-duration"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Refraction">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="refraction"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Scattering Coefficient">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="scattering-coefficient"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Reflection Event Threshold">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="reflection-event-threshold"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Fiber End Threshold">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="fiber-end-threshold"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Connection Loss Threshold">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="connection-loss-threshold"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Fault Threshold Settings">
            <ControlledSelect
              options={[{label: 'Normal'}, {label: 'Abnormal'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Targeted Learning Count">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="targeted-learning-count"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Reset Learning">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="reset-learning"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Reset Frequency">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="reset-frequency"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Reset Periodicity">
            <ControlledSelect
              options={[{label: 'Days'}, {label: 'Months'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Expand Learning">
            <ControlledSelect
              options={[{label: 'Yes'}, {label: 'No'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Expand Frequency">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="expand-frequency"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Expand Periodicity">
            <ControlledSelect
              options={[{label: 'Days'}, {label: 'Months'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Expand Step">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="expand-step"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Expand Learning to Max. # trace(s)">
            <InputFormik
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName='w-full'
              name="expand-learning-max"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Extend Mode (Peak Monitoring)">
            <ControlledSelect
              options={[{label: 'No'}, {label: 'Yes'}]}
              onChange={() => {}}
              className="basis-96"
            />
          </Description>
        </div>

        <div className="flex gap-x-4 self-end">
          <SimpleBtn type="submit">Save</SimpleBtn>
          <SimpleBtn link to="..">
            Cancel
          </SimpleBtn>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default TestDetailsParameters;
