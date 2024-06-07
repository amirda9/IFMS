import {FC, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn, TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import {useHttpRequest} from '~/hooks';
import {deepcopy} from '~/util';
import {useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {
  setgettestsetupdetaildata,
  setmodalloading,
} from '~/store/slices/opticalroutslice';
//this function get full date and time then produce full date

const TestSetupDetailsModal: FC = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const {gettestsetupdetaildata} = useSelector(
    (state: any) => state.opticalroute,
  );
  const location = useLocation();
  console.log('params88', params);
  const navigate = useNavigate();
  const [validateeror, setvalidateeror] = useState(false);
  const {opticalroutUpdateTestsetupDetail} = useSelector(
    (state: any) => state.opticalroute,
  );


  console.log("🔥",params);
  
  const {request, state} = useHttpRequest({
    selector: state => ({
      stationrtulist: state.http.stationrtuList,
      stations: state.http.allStations,
      opticalrouteUpdateTestSetup: state.http.opticalrouteUpdateTestSetup,
      opticalrouteTestSetupDetail: state.http.opticalrouteTestSetupDetail,
      opticalrouteCreateTestSetup: state.http.opticalrouteCreateTestSetup,
    }),
    initialRequests: request => {
      request('opticalrouteTestSetupDetail', {
        params: {
          optical_route_id: params.opticalRouteId! || '',
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
        // request('opticalrouteTestSetup', {
        //   params: {
        //     optical_route_id: params.opticalRouteId!.split('_')[0] || '',
        //   },
        // });
        request('opticalrouteTestSetup', {
          params: {
            optical_route_id: params.opticalRouteId! || '',
          },
        });
      }
    },
  });

  const createtestaetup = () => {
    const newdata = deepcopy(opticalroutUpdateTestsetupDetail);
    try {
      dispatch(setmodalloading(true));
      if (
        opticalroutUpdateTestsetupDetail?.parameters?.distance_mode != 'manual'
      ) {
        delete newdata?.parameters?.range;
      }
      if (
        opticalroutUpdateTestsetupDetail?.parameters?.pulse_width_mode !=
        'manual'
      ) {
        delete newdata?.parameters?.pulse_width;
      }
      if (
        opticalroutUpdateTestsetupDetail?.parameters?.sampling_mode ==
        'automatic'
      ) {
        delete newdata?.parameters?.sampling_duration;
      }
      newdata.test_program.starting_date.start = `${newdata?.startdatePart} ${newdata?.starttimePart}:00`;
      newdata.test_program.end_date.end = `${newdata?.enddatePart} ${newdata?.endtimePart}:00`;

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
        // newdata.learning_data.increase_count_options.timing.time == '' ||
        newdata.learning_data.increase_count_options.timing.type == '' ||
        newdata.learning_data.increase_count_options.timing.periodic_options
          .period_time == '' ||
        newdata.test_program.end_date.end == '' ||
        newdata.test_program.period_time.period_time == '' ||
        !newdata.test_program.period_time.value ||
        newdata.test_program.starting_date.start == '' ||
        !newdata.parameters.injection_level_threshold ||
        !newdata.parameters.section_loss_threshold ||
        !newdata.parameters.total_loss_threshold ||
        !newdata.parameters.fiber_end_threshold ||
        !newdata.parameters.event_reflection_threshold ||
        !newdata.parameters.event_loss_threshold ||
        !newdata.parameters.RBS ||
        !newdata.parameters.IOR ||
        !newdata.parameters.sampling_duration
      ) {
        setvalidateeror(true);
      } else {
        setvalidateeror(false);
        //We first check whether we want to create a testsetup or update it
        if (params.testId == 'create') {
          request('opticalrouteCreateTestSetup', {
            params: {
              optical_route_id: params.opticalRouteId!.split('_')[0] || '',
            },
            data: newdata,
          });
        } else {
          request('opticalrouteUpdateTestSetup', {
            params: {
              optical_route_id: params.opticalRouteId! || '',
              test_setup_id: params.testId || '',
            },
            data: newdata,
          });
        }
      }
    } catch (error) {
      toast('An error was encountered', {type: 'error', autoClose: 1000});
    } finally {
      setTimeout(() => {
        dispatch(setmodalloading(false));
        dispatch(setgettestsetupdetaildata(false));
        location.pathname.indexOf('monitoring') > -1
          ? navigate('/monitoring/test-on-demand')
          : navigate(
              `/config/optical-routes/${
                params.opticalRouteId!
              }/${params.networkId}/test-setup`,
            );
      }, 3000);
    }
  };


  return (
    <AppDialog
      closefunc={
        location.pathname.indexOf('monitoring') > -1
          ? () => navigate('/monitoring/test-on-demand')
          : () => navigate('..')
      }
      footerClassName="flex justify-end"
      footer={
        <div className="flex flex-col">
          {validateeror ? (
            <span className="mb-[10px] text-[20px] font-bold text-[red]">
              لطفا همه ی فیلدها را پر کنید
            </span>
          ) : null}

          <div className="flex gap-x-4">
            <SimpleBtn onClick={() => createtestaetup()} type="button">
              Save
            </SimpleBtn>
            <SimpleBtn
              className="cursor-pointer"
              onClick={
                location.pathname.indexOf('monitoring') > -1
                  ? () => {
                      dispatch(setgettestsetupdetaildata(false)),
                        navigate('/monitoring/test-on-demand');
                    }
                  : () => {
                      dispatch(setgettestsetupdetaildata(false)),
                        navigate('..');
                    }
              }
              type="button"
              // to={
              //   location.pathname.indexOf('monitoring') > -1
              //     ? '/monitoring/test-on-demand'
              //     : '..'
              // }
            >
              Cancel
            </SimpleBtn>
          </div>
        </div>
      }>
      <div className="flex h-full w-full flex-col">
        <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
          <TabItem to="." name="Parameters" />
          {gettestsetupdetaildata ? (
            <>
              <TabItem to="learning" name="Learning" />
              <TabItem to="test-program" name="Test Program" />
              <TabItem to="status" name="Status" />
            </>
          ) : null}
        </div>

        <Outlet key={params.testId} />
      </div>
    </AppDialog>
  );
};

export default TestSetupDetailsModal;
