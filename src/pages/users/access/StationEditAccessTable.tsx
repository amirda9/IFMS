import {FC, useState} from 'react';
import {toast} from 'react-toastify';
import {useAppDispatch, useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import EditAccessTablesView from './EditAccessTablesView';
import { userAccessActions } from '~/store/slices';

type Props = {
  userId: string;
  access: AccessEnum;
  networkId: string;
};

const columns = {
  select: {label: '', size: 'w-[5%]'},
  index: {label: '#', size: 'w-[10%]'},
  station: {label: 'Station', size: 'w-[85%]'},
};

type AccessStationTableItem = {
  select: boolean;
  index: number;
  station: string;
  id: string;
};

const StationEditAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
  networkId,
}) => {
  const dispatch = useAppDispatch();

  const [noAccessStations, setNoAccessStations] = useState<
    AccessStationTableItem[]
  >([]);
  const [accessedStations, setAccessedStations] = useState<
    AccessStationTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedSelected, setAccessedSelected] = useState<string[]>([]);

  const {
    request,
    state: {updateUserStationAccesses, allStations, userStationAccesses},
  } = useHttpRequest({
    selector: state => ({
      allStations: state.http.allStations,
      userStationAccesses: state.http.userStationAccesses,
      updateUserStationAccesses: state.http.updateUserStationAccesses,
    }),
    clearAfterUnmount: ['updateUserStationAccesses'],
    initialRequests: request => {
      request('allStations', undefined);
      request('userStationAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.updateUserStationAccesses?.httpRequestStatus === 'loading' &&
        state.updateUserStationAccesses?.httpRequestStatus === 'success'
      ) {
        toast('Updated successfully!', {type: 'success'});
        dispatch(userAccessActions.setIsEditingUserAccess(false));
        return;
      } else if (
        state.updateUserStationAccesses?.httpRequestStatus === 'error'
      ) {
        if (state.updateUserStationAccesses.error?.status === 422) {
        } else {
          toast(
            (state.updateUserStationAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.updateUserStationAccesses?.httpRequestStatus !== 'loading' &&
        state.userStationAccesses?.httpRequestStatus === 'success'
      ) {
        const userAccessedStations = state.userStationAccesses.data;
        setAccessedStations(
          userAccessedStations
            ? userAccessedStations.map((item, index) => ({
                index: index + 1,
                station: item.station.name,
                select: false,
                id: item.station.id,
              }))
            : [],
        );

        if (state.allStations?.httpRequestStatus === 'success') {
          const allStations = state.allStations.data?.filter(
            station => station.network_id === networkId,
          );

          // Extracting those stations which are not founded in userAccessedStations
          const noAccessStations =
            allStations && userAccessedStations
              ? allStations.filter(
                  item =>
                    !userAccessedStations.find(
                      acc => acc.station.id === item.id,
                    ),
                )
              : [];

          setNoAccessStations(
            noAccessStations.map((item, index) => ({
              index: index + 1,
              station: item.name,
              select: false,
              id: item.id,
            })),
          );
        }
      }
    },
  });

  const handleNoAccessCheckboxClick = (item: AccessStationTableItem) => {
    noAccessSelected.includes(item.id)
      ? setNoAccessSelected(prvState => prvState.filter(id => id !== item.id))
      : setNoAccessSelected(prv => [...prv, item.id]);
  };

  const handleAccessedCheckboxClick = (item: AccessStationTableItem) => {
    accessedSelected.includes(item.id)
      ? setAccessedSelected(prvState => prvState.filter(id => id !== item.id))
      : setAccessedSelected(prv => [...prv, item.id]);
  };

  const handleStationAddClick = () => {
    setAccessedStations(prevState =>
      prevState.concat(
        noAccessStations.filter(item => noAccessSelected.includes(item.id)),
      ),
    );
    setNoAccessStations(prevState =>
      prevState.filter(item => !noAccessSelected.includes(item.id)),
    );
    setNoAccessSelected([]);
  };

  const handleStationRemoveClick = () => {
    setNoAccessStations(prevState =>
      prevState.concat(
        accessedStations.filter(item => accessedSelected.includes(item.id)),
      ),
    );
    setAccessedStations(prevState =>
      prevState.filter(item => !accessedSelected.includes(item.id)),
    );
    setAccessedSelected([]);
  };

  const handleSaveClick = () => {
    request('updateUserStationAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
      data: {ids: accessedStations.map(item => item.id)},
    });
  };

  return (
    <EditAccessTablesView
      tableColumns={columns}
      accessedItems={accessedStations}
      noAccessItems={noAccessStations}
      accessedSelected={accessedSelected}
      noAccessSelected={noAccessSelected}
      handleAddClick={handleStationAddClick}
      handleRemoveClick={handleStationRemoveClick}
      handleAccessedCheckboxClick={handleAccessedCheckboxClick}
      handleNoAccessCheckboxClick={handleNoAccessCheckboxClick}
      handleSaveClick={handleSaveClick}
      accessedTableLoading={
        userStationAccesses?.httpRequestStatus === 'loading' ||
        allStations?.httpRequestStatus === 'loading'
      }
      noAccessTableLoading={
        userStationAccesses?.httpRequestStatus === 'loading' ||
        allStations?.httpRequestStatus === 'loading'
      }
    />
  );
};

export default StationEditAccessTable;
