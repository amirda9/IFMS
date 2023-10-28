import {FC} from 'react';
import {SimpleBtn} from '~/components';
import RtuPortItem, {RtuItemProps} from './RtuPortItem';
import { useHttpRequest } from '~/hooks';
import { useParams } from 'react-router-dom';
import { log } from 'console';

const ports: RtuItemProps[] = [
  {
    index: 1,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 4',
    length: 203,
    isActive: true,
  },
  {
    index: 2,
    opticalRoute: 'Optical Route 2',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 5',
    length: 24,
    isActive: true,
  },
  {
    index: 3,
    opticalRoute: 'Optical Route 3',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 6',
    length: 43,
    isActive: true,
  },
  {
    index: 4,
    opticalRoute: 'Optical Route 4',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 1',
    length: 63,
    isActive: false,
  },
  {
    index: 4,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
    ],
    endStation: 'Station 4',
    length: 203,
    isEmpty: true,
  },
  {
    index: 5,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
    ],
    endStation: 'Station 4',
    length: 203,
    isEmpty: true,
  },
];

const RtuPortsPage: FC = () => {
  const params = useParams();
  const {
    state: {rtuports},
    request,
  } = useHttpRequest({
    selector: state => ({
      rtuports: state.http.rtuPorts,
    }),
    initialRequests: request => {
      request('rtuPorts', {params: {rtu_id: params.rtuId || ''}});
    },
    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.update?.httpRequestStatus === 'loading' &&
    //     state.update?.httpRequestStatus === 'success'
    //   ) {
    //     request('rtuDetail', {params: {rtu_Id: params.rtuId || ''}});
    //   }
    // },
    // onUpdate: lastState => {
    //   if (
    //     lastState.create?.httpRequestStatus === 'loading' &&
    //     create?.httpRequestStatus === 'success'
    //   ) {
    //     request('allLinks', undefined);
    //     // navigate('../' + create?.data?.link_id);
    //   }
    // },
  });

 console.log(rtuports,'rtuportsrtuportsrtuports');
 const allports:any=rtuports?.data || [];
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-grow flex-col gap-y-4">
        <div className="flex items-center px-4">
          <span className="basis-16">Index</span>
          <span className="basis-64">Optical Route</span>
          <span className="basis-44">End Station</span>
          <span className="basis-32">Length (km)</span>
          <span className="basis-40">State</span>
          <span className="basis-40"></span>
        </div>
        {allports.length>0 && allports.map((port:any, i:any) => (
          <RtuPortItem key={i} {...port} />
        ))}
      </div>
      <div className="flex gap-x-4 self-end">
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RtuPortsPage;
