import {FC} from 'react';
import {SimpleBtn} from '~/components';
import RouteItem from './RouteItem';
import { useHttpRequest } from '~/hooks';
import { useParams } from 'react-router-dom';

const OpticalRouteRoutePage: FC = () => {
  const params=useParams()
  const {
    request,
    state: {opticalrouteRoute},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteRoute: state.http.opticalrouteRoute,
    }),
    initialRequests: request => {
      // if (list?.httpRequestStatus !== 'success') {
      request('opticalrouteRoute', {
        params: {optical_route_id: params.opticalRouteId || ''},
      });
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
  console.log(opticalrouteRoute,'opticalrouteRoute😵‍💫');
  
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-y-4 w-10/12">
        <div className='flex gap-x-4 px-4'>
          <span className='basis-10'></span>
          <span className='flex-1 text-[20px] leading-[24.2px]'>Source Station</span>
          <span className='flex-1 text-[20px] leading-[24.2px]'>Destination Station</span>
          <span className='flex-1 text-[20px] leading-[24.2px]'>Cable (Duct)</span>
          <span className='basis-30 text-[20px] leading-[24.2px]'>Core (Fiber)</span>
          <span className='basis-10'></span>
        </div>
        <RouteItem
          index={1}
          sourceOptions={[{label: 'Station 1'}, {label: 'Station 2'}]}
          destinationOptions={[{label: 'Station 1'}, {label: 'Station 2'}]}
          ductOptions={[{label: 'Cable 1'}, {label: 'Cable 2'}]}
          fiberOptions={[{label: 'Fiber 1'}, {label: 'Fiber 2'}]}
          selectedSource="Station 1"
          selectedDestination="Station 1"
          selectedDuct="Cable 1"
          selectedFiber="Fiber 1"
        />
        <RouteItem
          index={2}
          sourceOptions={[{label: 'Station 1'}, {label: 'Station 2'}]}
          destinationOptions={[{label: 'Station 1'}, {label: 'Station 2'}]}
          ductOptions={[{label: 'Cable 1'}, {label: 'Cable 2'}]}
          fiberOptions={[{label: 'Fiber 1'}, {label: 'Fiber 2'}]}
          selectedSource="Station 2"
          selectedDestination="Station 2"
          selectedDuct="Cable 2"
          selectedFiber="Fiber 2"
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default OpticalRouteRoutePage;
