import {FC, useState} from 'react';

import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import ErrorPage403 from '../errors/403';
import {UserRole} from '~/constant/users';
import {toast} from 'react-toastify';
import {IoTrashOutline} from 'react-icons/io5';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  ipAddress: {label: 'IP Address', size: 'w-[20%]'},
  startDate: {label: 'Start Date', size: 'w-[20%]'},
  lastAccess: {label: 'Last Access', size: 'w-[20%]'},
  state: {label: 'State', size: 'w-[20%]'},
  terminate: {label: 'Terminate', size: 'w-[10%]'},
};

type SessionTableItem = {
  index: number;
  ipAddress: string;
  startDate: string;
  lastAccess: string;
  state: string;
  terminate: JSX.Element;
};

const UserSessionsPage: FC = () => {
  const {userId} = useParams();

  const [tableSessions, setTableSessions] = useState<SessionTableItem[]>([]);

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  const {
    state: {deleteUserSession, userDetails},
    request,
  } = useHttpRequest({
    selector: state => ({
      userDetails: state.http.userDetail,
      deleteUserSession: state.http.deleteUserSession,
    }),
    initialRequests: request => {
      request('userDetail', {params: {user_id: userId!}});
    },
    onUpdate: (lastState, state) => {
      if (state.userDetails?.httpRequestStatus === 'success') {
        const sessions = state.userDetails.data?.sessions || [];
        setTableSessions(
          sessions.map((ses, i) => ({
            index: i + 1,
            ipAddress: ses.ip_address,
            startDate: ses.start_date,
            lastAccess: ses.last_access,
            state: ses.state,
            terminate: <IoTrashOutline className="text-red-500 mx-auto" size={24} />,
          })),
        );
      }

      if (lastState.deleteUserSession?.httpRequestStatus === 'loading') {
        if (state.deleteUserSession?.httpRequestStatus === 'success') {
          toast('Session was successfully terminated.', {type: 'success'});
          request('userDetail', {params: {user_id: userId!}});
        } else if (state.deleteUserSession?.httpRequestStatus === 'error') {
          toast(
            (state.deleteUserSession.error?.data?.detail as string) ||
              'An unknown error has occurred.',
            {type: 'error'},
          );
        }
      }
    },
  });

  const terminateAllSessions = () => {};

  const sessionTerminateClick = () => {};

  if (loggedInUser.role !== UserRole.SUPER_USER && loggedInUser.id !== userId) {
    return <ErrorPage403 />;
  }

  return (
    <>
      <div className="flex-grow">
        <Table cols={columns} items={tableSessions} bordered />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={terminateAllSessions}>
          Terminate all Sessions
        </SimpleBtn>
      </div>
    </>
  );
};

export default UserSessionsPage;
