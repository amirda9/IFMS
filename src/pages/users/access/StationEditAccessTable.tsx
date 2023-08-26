import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';

type Props = {
  userId: string;
  access: AccessEnum;
  networkId: string;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
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
  setIsEditing,
}) => {
  const [noAccessStations, setNoAccessStations] = useState<
    AccessStationTableItem[]
  >([]);
  const [accessedStations, setAccessedStations] = useState<
    AccessStationTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedNetsSelected, setAccessedNetsSelected] = useState<string[]>(
    [],
  );

  const {
    request,
    state: {userUpdateAccesses},
  } = useHttpRequest({
    selector: state => ({
      allStations: state.http.allStations,
      userStationAccesses: state.http.userStationAccesses,
      userUpdateAccesses: state.http.userUpdateAccesses,
    }),
    clearAfterUnmount: ['userUpdateAccesses'],
    initialRequests: request => {
      request('allStations', undefined);
      request('userStationAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.userUpdateAccesses?.httpRequestStatus === 'loading' &&
        state.userUpdateAccesses?.httpRequestStatus === 'success'
      ) {
        request('userStationAccesses', {
          params: {user_id: userId},
          queryString: {access_type: access, network_id: networkId},
        });
        toast('Updated successfully!', {type: 'success'});
        return;
      } else if (state.userUpdateAccesses?.httpRequestStatus === 'error') {
        if (state.userUpdateAccesses.error?.status === 422) {
        } else {
          toast(
            (state.userUpdateAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.userUpdateAccesses?.httpRequestStatus !== 'loading' &&
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
          const allStations = state.allStations.data;

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
    accessedNetsSelected.includes(item.id)
      ? setAccessedNetsSelected(prvState =>
          prvState.filter(id => id !== item.id),
        )
      : setAccessedNetsSelected(prv => [...prv, item.id]);
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
        accessedStations.filter(item => accessedNetsSelected.includes(item.id)),
      ),
    );
    setAccessedStations(prevState =>
      prevState.filter(item => !accessedNetsSelected.includes(item.id)),
    );
    setAccessedNetsSelected([]);
  };

  const handleSaveClick = () => {
    request('userUpdateAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, resource_type: 'STATION'},
      data: {ids: accessedStations.map(item => item.id)},
    });
  };

  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={columns}
          items={noAccessStations}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleNoAccessCheckboxClick(value)}
              checked={noAccessSelected.includes(value.id)}
            />
          )}
        />
        <DoubleSideButtonGroup
          onClickRightButton={handleStationAddClick}
          onClickLeftButton={handleStationRemoveClick}
        />
        <Table
          cols={columns}
          items={accessedStations}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleAccessedCheckboxClick(value)}
              checked={accessedNetsSelected.includes(value.id)}
            />
          )}
        />
      </div>
      <div className="flex gap-x-2 self-end">
        <SimpleBtn onClick={handleSaveClick}>Save</SimpleBtn>
        <SimpleBtn
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(false);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default StationEditAccessTable;
