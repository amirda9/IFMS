import {FC, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import ErrorPage403 from '../errors/403';
import {UserRole} from '~/constant/users';
import {toast} from 'react-toastify';
import {IoTrashOutline} from 'react-icons/io5';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {getPrettyDateTime} from '~/util/time';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  ipAddress: {label: 'IP Address', size: 'w-[20%]'},
  startDate: {label: 'Start Date', size: 'w-[20%]'},
  lastAccess: {label: 'Last Access', size: 'w-[20%]'},
  state: {label: 'State', size: 'w-[20%]'},
  terminate: {label: 'Terminate', size: 'w-[10%]'},
};

type SessionTableItem = {
  id: string;
  index: number;
  ipAddress: string;
  startDate: string;
  lastAccess: string;
  state: string;
  terminate: JSX.Element;
};

const ALL_SESSIONS = 'ALL';

const UserSessionsPage: FC = () => {
  const {userId} = useParams();

  const [tableSessions, setTableSessions] = useState<SessionTableItem[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const sessionIdToDelete = useRef<string | null>(null);

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  const {
    state: {deleteUserSession, userDetails, userSession},
    request,
  } = useHttpRequest({
    selector: state => ({
      userDetails: state.http.userDetail,
      userSession: state.http.userSession,
      deleteUserSession: state.http.deleteUserSession,
    }),
    initialRequests: request => {
      // request('userDetail', {params: {user_id: userId!}});
      request('userSession', {params: {user_id: userId!}});
    },
    onUpdate: (lastState, state) => {
      if (state.userSession?.httpRequestStatus === 'success') {
        const sessions = state.userSession?.data || [];
        setTableSessions(
          sessions.map((ses, i) => ({
            id: ses.id,
            index: i + 1,
            ipAddress: ses.ip_address,
            startDate: getPrettyDateTime(ses.start_date),
            lastAccess: getPrettyDateTime(ses.last_access),
            state: ses.state,
            terminate: (
              <IoTrashOutline
                className="mx-auto cursor-pointer text-red-500"
                size={24}
                onClick={() => {
                  sessionIdToDelete.current = ses.id;
                  setDeleteModalOpen(true);
                }}
              />
            ),
          })),
        );
      }

      if (lastState.deleteUserSession?.httpRequestStatus === 'loading') {
        if (state.deleteUserSession?.httpRequestStatus === 'success') {
          toast('Session was successfully terminated.', {type: 'success'});
          // request('userDetail', {params: {user_id: userId!}});
          request('userSession', {params: {user_id: userId!}});
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

  const terminateAllSessions = () => {
    tableSessions.map(ses => {
      request('deleteUserSession', {
        params: {session_id: ses.id, user_id: loggedInUser?.id},
      });
    });

    setDeleteModalOpen(false);
  };

  const handleSessionTerminate = (id: string) => {
    request('deleteUserSession', {
      params: {session_id: id, user_id: loggedInUser?.id},
    });

    setDeleteModalOpen(false);
  };

  if (loggedInUser.role !== UserRole.SUPER_USER && loggedInUser.id !== userId) {
    return <ErrorPage403 />;
  }

  return (
    <>
      <div className="flex-grow">
        <Table cols={columns} items={tableSessions} bordered />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn
          onClick={() => {
            sessionIdToDelete.current = ALL_SESSIONS;
            setDeleteModalOpen(true);
          }}>
          Terminate all Sessions
        </SimpleBtn>
      </div>

      <ConfirmationModal
        title={
          sessionIdToDelete.current === ALL_SESSIONS
            ? 'Terminate all Sessions'
            : 'Terminate Session'
        }
        description={`Are you sure you want to terminate ${
          sessionIdToDelete.current === ALL_SESSIONS
            ? 'all sessions'
            : 'this session'
        }?`}
        onPrimaryClick={() => {
          sessionIdToDelete.current === ALL_SESSIONS
            ? terminateAllSessions()
            : handleSessionTerminate(sessionIdToDelete.current!);
        }}
        open={isDeleteModalOpen}
        setOpen={setDeleteModalOpen}
        primaryButtonText="Terminate"
        type="danger"
      />
    </>
  );
};

export default UserSessionsPage;
