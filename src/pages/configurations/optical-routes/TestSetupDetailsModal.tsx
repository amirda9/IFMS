import {FC, useState} from 'react';
import { useSelector } from 'react-redux';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn, TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import { useHttpRequest } from '~/hooks';

const convertDate=(date:string,time:string)=>{
  var datetime = new Date(date + "T" + time + ":00Z"); // شیء Date با اضافه کردن حرف T و ثانیه و محدوده زمانی
return datetime.toISOString(); // رشته با فرمت ISO 8601
}
const TestSetupDetailsModal: FC = () => {
  const params = useParams();

  const {opticalroutUpdateTestsetupDetail} = useSelector(
    (state: any) => state.opticalroute,
  );
  console.log(opticalroutUpdateTestsetupDetail,'🥵😄');


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
      // request('opticalrouteTestSetupDetail', {
      //   params: {
      //     optical_route_id: params.opticalRouteId || '',
      //     test_setup_id: params.testId || '',
      //   },
      // });

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

  console.log(params,'params');
  // opticalRouteId
  // testId
 const createtestaetup=()=>{
  const newdata=JSON.parse(JSON.stringify(opticalroutUpdateTestsetupDetail))
  newdata.test_program.starting_date.start=convertDate(newdata?.startdatePart,newdata?.starttimePart)
  newdata.test_program.end_date.end=convertDate(newdata?.enddatePart,newdata?.endtimePart)
  delete newdata.station_name
  delete newdata.init_rtu_name
  delete newdata.startdatePart
  delete newdata.starttimePart
  delete newdata.enddatePart,
  delete newdata.endtimePart,
  delete newdata.init_rtu_name,
console.log(newdata,'newdata');

 request("opticalrouteCreateTestSetup",{params:{optical_route_id:params.opticalRouteId || ""},data:newdata})
 }

  return (
    <AppDialog
      footerClassName="flex justify-end"
      footer={
        <div className="flex gap-x-4">
          <SimpleBtn onClick={()=>createtestaetup()} type="button">Save</SimpleBtn>
          <SimpleBtn link to="..">
            Cancel
          </SimpleBtn>
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
