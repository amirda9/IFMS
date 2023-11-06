import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setopticalroutUpdateTestsetupDetail} from './../../../../store/slices/opticalroutslice';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {InputFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
import {$GET} from '~/util/requestapi';

const seperatedate = (time: string) => {
  let date = new Date(time);
  let year = date?.getFullYear(); // year = 2023
  let month = date?.getMonth() + 1; // month = 11
  let day = date?.getDate(); // day = 2
  let hour = date?.getHours(); // hour = 9
  let minute = date?.getMinutes(); // minute = 31
  let Minute = Number(minute) < 10 ? `0${minute}` : minute;
  let second = date.getSeconds(); // second = 27
  let datePart = year + '-' + month + '-' + day; // datePart = "2023-11-2"
  let timePart = hour + ':' + Minute; // timePart = "9:31:27"
  return {datePart: datePart, timePart: timePart};
};

const TestDetailsParameters: FC = () => {
  const [mount, setMount] = useState(false);
  const [rtulist, setRtulist] = useState<{name: string; id: string}[]>([]);
  const params = useParams();
  const dispatch = useDispatch();
  const {opticalroutUpdateTestsetupDetail} = useSelector(
    (state: any) => state.opticalroute,
  );

  const {
    request,
    state: {opticalrouteTestSetupDetail, stations},
  } = useHttpRequest({
    selector: state => ({
      stationrtulist: state.http.stationrtuList,
      stations: state.http.allStations,
      opticalrouteTestSetupDetail: state.http.opticalrouteTestSetupDetail,
    }),
    initialRequests: request => {
      request('opticalrouteTestSetupDetail', {
        params: {
          optical_route_id: params.opticalRouteId || '',
          test_setup_id: params.testId || '',
        },
      });
      request('allStations', undefined);
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

  const Detail = opticalrouteTestSetupDetail?.data || {};
  useEffect(() => {
    if (params.testId == 'create') {
    } else {
      const dataa = JSON.parse(JSON.stringify(Detail));
      dataa.station_id = dataa?.station?.id;
      (dataa.init_rtu_id = dataa?.rtu?.id),
        dataa.startdatePart ==
          seperatedate(dataa?.test_program?.starting_date?.start).datePart,
        dataa.starttimePart ==
          seperatedate(dataa?.test_program?.starting_date?.start).timePart,
        dataa.enddatePart ==
          seperatedate(dataa?.test_program?.end_date?.end).datePart,
        dataa.starttimePart ==
          seperatedate(dataa?.test_program?.end_date?.end).timePart,
        delete dataa['station'];
      delete dataa['rtu'];
      dispatch(setopticalroutUpdateTestsetupDetail(dataa));
    }
  }, []);

  console.log(opticalroutUpdateTestsetupDetail,'opticalroutUpdateTestsetupDetail😄');
  
  const formik = useFormik({
    initialValues: {
      name: opticalroutUpdateTestsetupDetail?.name || '',
      station: opticalroutUpdateTestsetupDetail?.station_name,
      stationId: opticalroutUpdateTestsetupDetail?.station_id,
      type: opticalroutUpdateTestsetupDetail?.parameters?.type,
      init_rtu_name: opticalroutUpdateTestsetupDetail?.init_rtu_name,
      init_rtu_id: opticalroutUpdateTestsetupDetail?.init_rtu_id,
      enabled: opticalroutUpdateTestsetupDetail?.parameters?.enabled,
      Wavelength: opticalroutUpdateTestsetupDetail?.parameters?.wavelength,
      BreakStrategy:
        opticalroutUpdateTestsetupDetail?.parameters?.break_strategy,
      DataSavePolicy:
        opticalroutUpdateTestsetupDetail?.parameters?.date_save_policy,
      TestMode: opticalroutUpdateTestsetupDetail?.parameters?.test_mode,
      RunMode: opticalroutUpdateTestsetupDetail?.parameters?.run_mode,
      PulseWidthMode:
        opticalroutUpdateTestsetupDetail?.parameters?.pulse_width_mode,
      PulseWidthns: opticalroutUpdateTestsetupDetail?.parameters?.pulse_width,
      samplingduration:
        opticalroutUpdateTestsetupDetail?.parameters?.sampling_duration,

      IOR: opticalroutUpdateTestsetupDetail?.parameters?.IOR,
      RBS: opticalroutUpdateTestsetupDetail?.parameters?.RBS,

      event_loss_threshold:
        opticalroutUpdateTestsetupDetail?.parameters?.event_loss_threshold,

      event_reflection_threshold:
        opticalroutUpdateTestsetupDetail?.parameters
          ?.event_reflection_threshold,

      fiber_end_threshold:
        opticalroutUpdateTestsetupDetail?.parameters?.fiber_end_threshold,

      total_loss_threshold:
        opticalroutUpdateTestsetupDetail?.parameters?.total_loss_threshold,

      section_loss_threshold:
        opticalroutUpdateTestsetupDetail?.parameters?.section_loss_threshold,
      injection_level_threshold:
        opticalroutUpdateTestsetupDetail?.parameters?.injection_level_threshold,
      DistanceMode: opticalroutUpdateTestsetupDetail?.parameters?.distance_mode,
      Range: opticalroutUpdateTestsetupDetail?.parameters?.range,
      SamplingMode: opticalroutUpdateTestsetupDetail?.parameters?.sampling_mode,
    },

    onSubmit: () => {},
  });

  useEffect(() => {
    const getrtu = async () => {
      const allrtu = await $GET(
        `otdr/station/${opticalroutUpdateTestsetupDetail?.station_id.toString()}/rtus`,
      );
      setRtulist(allrtu);
    };
    if (opticalroutUpdateTestsetupDetail?.station_id?.length > 0) {
      getrtu();
    }
  }, []);
  return (
    <FormikProvider value={formik}>
      <Form className="flex flex-col gap-y-8">
        <div className="flex w-2/3 flex-grow flex-col gap-y-4 pb-4">
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Name">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.name = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="name"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Enabled">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('enabled', e.target.value);
                dataa.parameters.enabled = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.data?.parameters?.enabled ||
                false
              }
              className="basis-96">
              <option value="" className="hidden">
                {opticalrouteTestSetupDetail?.data?.parameters?.enabled ||
                  false}
              </option>
              <option value={undefined} className="hidden">
                {opticalrouteTestSetupDetail?.data?.parameters?.enabled ||
                  false}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                true
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                false
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Type">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('type', e.target.value.toString());
                dataa.parameters.type = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.type}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.type}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.type}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                monitoring
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                maintenance
              </option>
            </Select>
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
              value={opticalroutUpdateTestsetupDetail?.parameters?.station_name}
              onChange={async e => {
                formik.setFieldValue(
                  'station',
                  e.target.value.split('_')[0].toString(),
                );
                formik.setFieldValue(
                  'stationId',
                  e.target.value.split('_')[1].toString(),
                );
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.station_name = e.target.value.split('_')[0].toString();
                dataa.station_id = e.target.value.split('_')[1].toString();
                console.log(e.target.value.split('_')[0].toString(), '🥶');
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
                const allrtu = await $GET(
                  `otdr/station/${e.target.value
                    .split('_')[1]
                    .toString()}/rtus`,
                );
                setRtulist(allrtu);
              }}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.station}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.station}
              </option>

              {stations?.data?.map((data, index) => (
                <option
                  value={`${data.name}_${data.id}`}
                  key={index}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  {data.name}
                </option>
              ))}
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="RTU">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue(
                  'init_rtu_id',
                  e.target.value.split('_')[1].toString(),
                );
                formik.setFieldValue(
                  'init_rtu_name',
                  e.target.value.split('_')[0].toString(),
                );
                dataa.init_rtu_name = e.target.value.split('_')[0].toString();
                dataa.init_rtu_id = e.target.value.split('_')[1].toString();
                console.log(e.target.value.split('_')[0].toString(), '🥶');
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail.init_rtu_name}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.init_rtu_name}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.init_rtu_name}
              </option>

              {rtulist.map((data, index) => (
                <option
                  value={`${data.name}_${data.id}`}
                  key={index}
                  className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  {data.name}
                </option>
              ))}
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Wavelength (nm)">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('Wavelength', e.target.value.toString());
                dataa.parameters.wavelength = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.wavelength}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.Wavelength}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.Wavelength}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1310
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1490
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1550
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                1625
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Break Strategy">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('BreakStrategy', e.target.value);
                dataa.parameters.break_strategy = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.parameters?.break_strategy
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.BreakStrategy}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.BreakStrategy}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                skip
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                continue
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Data Save Policy">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('DataSavePolicy', e.target.value);
                dataa.parameters.date_save_policy = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.parameters?.date_save_policy
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.DataSavePolicy}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.DataSavePolicy}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                save
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                do_not_save
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Test Mode">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('TestMode', e.target.value);
                dataa.parameters.test_mode = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.test_mode}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.TestMode}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.TestMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                fast
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                precision
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Run Mode">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('RunMode', e.target.value);
                dataa.parameters.run_mode = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.run_mode}
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.RunMode}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.RunMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                average
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                realtime
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Distance Mode">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('DistanceMode', e.target.value);
                dataa.parameters.distance_mode = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.parameters?.distance_mode
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.DistanceMode}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.DistanceMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                manual
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                automatic
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Range (km)">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('Range', e.target.value.toString());
                dataa.parameters.range = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.range}
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
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue(
                  'PulseWidthMode',
                  e.target.value.toString(),
                );
                dataa.parameters.pulse_width_mode = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.parameters?.pulse_width_mode
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.PulseWidthMode}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.PulseWidthMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                automatic
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                manual
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Pulse Width (ns)">
            <Select
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('PulseWidthns', e.target.value.toString());
                dataa.parameters.pulse_width = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={opticalroutUpdateTestsetupDetail?.parameters?.pulse_width}
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
              onChange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                formik.setFieldValue('SamplingMode', e.target.value.toString());
                dataa.parameters.sampling_mode = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              value={
                opticalroutUpdateTestsetupDetail?.parameters?.sampling_mode
              }
              className="basis-96">
              <option value="" className="hidden">
                {formik.values.SamplingMode}
              </option>
              <option value={undefined} className="hidden">
                {formik.values.SamplingMode}
              </option>

              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                duration
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                automatic
              </option>
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                repetition
              </option>
            </Select>
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Sampling Duration (s)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.sampling_duration = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
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
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.IOR = e.target.value;
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
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
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.RBS = Number(e.target.value);
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="RBS"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Event Loss threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.event_loss_threshold = Number(e.target.value);
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="event_loss_threshold"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Event Reflection Threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.event_reflection_threshold = Number(
                  e.target.value,
                );
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="event_reflection_threshold"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Fiber End Threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.fiber_end_threshold = Number(e.target.value);
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="fiber_end_threshold"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Total Loss Threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.total_loss_threshold = Number(e.target.value);
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="total_loss_threshold"
              type="number"
            />
          </Description>

          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Section Loss Threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.section_loss_threshold = Number(
                  e.target.value,
                );
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="section_loss_threshold"
              type="number"
            />
          </Description>
          <Description
            className="flex justify-between"
            labelClassName="flex-grow"
            label="Injection Level Threshold (dB)">
            <InputFormik
              onchange={e => {
                const dataa = JSON.parse(
                  JSON.stringify(opticalroutUpdateTestsetupDetail),
                );
                dataa.parameters.injection_level_threshold = Number(
                  e.target.value,
                );
                dispatch(setopticalroutUpdateTestsetupDetail(dataa));
              }}
              outerClassName="!flex-grow-0 w-96"
              wrapperClassName="w-full"
              name="injection_level_threshold"
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
