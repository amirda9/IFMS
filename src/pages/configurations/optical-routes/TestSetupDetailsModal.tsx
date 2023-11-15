import {FC, useState} from 'react';
import {useSelector} from 'react-redux';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn, TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import {useHttpRequest} from '~/hooks';

//this function get full date and time then produce full date
const convertDate = (date: string, time: string) => {
  var datetime = new Date(date + 'T' + time + ':00Z');
  return datetime.toISOString();
};
const TestSetupDetailsModal: FC = () => {
  const params = useParams();

const [validateeror,setvalidateeror]=useState(false)
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
      opticalrouteCreateTestSetup: state.http.opticalrouteCreateTestSetup,
    }),
    initialRequests: request => {
      request('opticalrouteTestSetupDetail', {
        params: {
          optical_route_id: params.opticalRouteId || '',
          test_setup_id: params.testId || '',
        },
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.opticalrouteCreateTestSetup?.httpRequestStatus ===
          'loading' &&
        state.opticalrouteCreateTestSetup!.httpRequestStatus === 'success'
      ) {
        request('opticalrouteTestSetup', {
          params: {optical_route_id: params.opticalRouteId || ''},
        });
      }
    },
  });

  const createtestaetup = () => {
    const newdata = JSON.parse(
      JSON.stringify(opticalroutUpdateTestsetupDetail),
    );
   if(opticalroutUpdateTestsetupDetail?.parameters?.distance_mode != "manual"){
delete newdata?.parameters?.range
   }
   if(opticalroutUpdateTestsetupDetail?.parameters?.pulse_width_mode != "manual"){
    delete newdata?.parameters?.pulse_width
   }
   if(opticalroutUpdateTestsetupDetail?.parameters?.sampling_mode == "automatic"){
    delete newdata?.parameters?.sampling_duration
   }
    newdata.test_program.starting_date.start = convertDate(
      newdata?.startdatePart,
      newdata?.starttimePart,
    );
    newdata.test_program.end_date.end = convertDate(
      newdata?.enddatePart,
      newdata?.endtimePart,
    );
    delete newdata.station_name;
    delete newdata.init_rtu_name;
    delete newdata.startdatePart;
    delete newdata.starttimePart;
    delete newdata.enddatePart;
    delete newdata.endtimePart;
    delete newdata.init_rtu_name;

   
    if (
      newdata.enddatePart == '' ||
      newdata.endtimePart == '' ||
      newdata.init_rtu_id == '' ||
      newdata.init_rtu_name == '' ||
      newdata.name == '' ||
      newdata.startdatePart == '' ||
      newdata.starttimePart == '' ||
      newdata.station_id == '' ||
      newdata.station_name == '' ||
      !newdata.learning_data.increase_count_options.count ||
      newdata.learning_data.increase_count_options.timing.time == '' ||
      newdata.learning_data.increase_count_options.timing.type == '' ||
      newdata.learning_data.increase_count_options.timing.periodic_options
        .period_time == '' ||
        newdata.test_program.end_date.end == "" ||newdata.test_program.period_time.period_time == "" || !newdata.test_program.period_time.value
        || newdata.test_program.starting_date.start == "" || !newdata.parameters.injection_level_threshold ||
        !newdata.parameters.section_loss_threshold || !newdata.parameters.total_loss_threshold || !newdata.parameters.fiber_end_threshold
        || !newdata.parameters.event_reflection_threshold || !newdata.parameters.event_loss_threshold || !newdata.parameters.RBS || !newdata.parameters.IOR
        || !newdata.parameters.sampling_duration
        ){

      setvalidateeror(true)
    } else {
      setvalidateeror(false)
       //We first check whether we want to create a testsetup or update it
    if (params.testId == 'create') {
      request('opticalrouteCreateTestSetup', {
        params: {optical_route_id: params.opticalRouteId || ''},
        data: newdata,
      });
    } else {
      request('opticalrouteUpdateTestSetup', {
        params: {
          optical_route_id: params.opticalRouteId || '',
          test_setup_id: params.testId || '',
        },
        data: newdata,
      });
    }
    }
   
  };

  console.log(opticalrouteTestSetupDetail,'opticalrouteTestSetupDetail');
  
  return (
    <AppDialog
      footerClassName="flex justify-end"
      footer={
        <div className='flex flex-col'>
          {validateeror?
               <span className='text-[20px] text-[red] font-bold mb-[10px]'>لطفا همه ی فیلدها را پر کنید</span>
        :null}
     
<div className="flex gap-x-4">
          <SimpleBtn onClick={() => createtestaetup()} type="button">
            Save
          </SimpleBtn>
          <SimpleBtn link to="..">
            Cancel
          </SimpleBtn>
        </div>
        </div>
        
      }>
      <div className="flex h-full w-full flex-col">
        <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
          <TabItem to="." name="Parameters" />
          <TabItem to="learning" name="Learning" />
          <TabItem to="test-program" name="Test Program" />
          <TabItem to="status" name="Status" />
        </div>

        <Outlet key={params.alarmId} />
      </div>
    </AppDialog>
  );
};

export default TestSetupDetailsModal;
