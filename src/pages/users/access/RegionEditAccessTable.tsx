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
  region: {label: 'Region', size: 'w-[85%]'},
};

type AccessRegionTableItem = {
  select: boolean;
  index: number;
  region: string;
  id: string;
};

const RegionEditAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
  networkId,
  setIsEditing,
}) => {
  const [noAccessRegions, setNoAccessRegions] = useState<
    AccessRegionTableItem[]
  >([]);
  const [accessedRegions, setAccessedRegions] = useState<
    AccessRegionTableItem[]
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
      regionList: state.http.regionList,
      userRegionAccesses: state.http.userRegionAccesses,
      userUpdateAccesses: state.http.userUpdateAccesses,
    }),
    clearAfterUnmount: ['userUpdateAccesses'],
    initialRequests: request => {
      request('regionList', {params: {network_id: networkId}});
      request('userRegionAccesses', {
        params: {user_id: userId, access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.userUpdateAccesses?.httpRequestStatus === 'loading' &&
        state.userUpdateAccesses?.httpRequestStatus === 'success'
      ) {
        request('userRegionAccesses', {
          params: {user_id: userId, access_type: access, network_id: networkId},
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
        state.userRegionAccesses?.httpRequestStatus === 'success'
      ) {
        const userAccessedRegions = state.userRegionAccesses.data;
        setAccessedRegions(
          userAccessedRegions
            ? userAccessedRegions.map((item, index) => ({
                index: index + 1,
                region: item.region.name,
                select: false,
                id: item.region.id,
              }))
            : [],
        );

        if (state.regionList?.httpRequestStatus === 'success') {
          const regionList = state.regionList.data;

          // Extracting those regions which are not founded in userAccessedRegions
          const noAccessRegions =
            regionList && userAccessedRegions
              ? regionList.filter(
                  item =>
                    !userAccessedRegions.find(acc => acc.region.id === item.id),
                )
              : [];

          setNoAccessRegions(
            noAccessRegions.map((item, index) => ({
              index: index + 1,
              region: item.name,
              select: false,
              id: item.id,
            })),
          );
        }
      }
    },
  });

  const handleNoAccessCheckboxClick = (item: AccessRegionTableItem) => {
    noAccessSelected.includes(item.id)
      ? setNoAccessSelected(prvState => prvState.filter(id => id !== item.id))
      : setNoAccessSelected(prv => [...prv, item.id]);
  };

  const handleAccessedCheckboxClick = (item: AccessRegionTableItem) => {
    accessedNetsSelected.includes(item.id)
      ? setAccessedNetsSelected(prvState =>
          prvState.filter(id => id !== item.id),
        )
      : setAccessedNetsSelected(prv => [...prv, item.id]);
  };

  const handleRegionAddClick = () => {
    setAccessedRegions(prevState =>
      prevState.concat(
        noAccessRegions.filter(item => noAccessSelected.includes(item.id)),
      ),
    );
    setNoAccessRegions(prevState =>
      prevState.filter(item => !noAccessSelected.includes(item.id)),
    );
    setNoAccessSelected([]);
  };

  const handleRegionRemoveClick = () => {
    setNoAccessRegions(prevState =>
      prevState.concat(
        accessedRegions.filter(item => accessedNetsSelected.includes(item.id)),
      ),
    );
    setAccessedRegions(prevState =>
      prevState.filter(item => !accessedNetsSelected.includes(item.id)),
    );
    setAccessedNetsSelected([]);
  };

  const handleSaveClick = () => {
    request('userUpdateAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, resource_type: 'NETWORK'},
      data: {ids: accessedRegions.map(item => item.id)},
    });
  };

  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={columns}
          items={noAccessRegions}
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
          onClickRightButton={handleRegionAddClick}
          onClickLeftButton={handleRegionRemoveClick}
        />
        <Table
          cols={columns}
          items={accessedRegions}
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

export default RegionEditAccessTable;
