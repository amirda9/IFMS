import {FC, useState} from 'react';
import {toast} from 'react-toastify';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import EditAccessTablesView from './EditAccessTablesView';
import {useNavigate} from 'react-router-dom';

type Props = {
  userId: string;
  access: AccessEnum;
  networkId: string;
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
}) => {
  const navigate = useNavigate();

  const [noAccessRegions, setNoAccessRegions] = useState<
    AccessRegionTableItem[]
  >([]);
  const [accessedRegions, setAccessedRegions] = useState<
    AccessRegionTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedSelected, setAccessedSelected] = useState<string[]>([]);

  const {
    request,
    state: {updateUserRegionAccesses, regionList, userRegionAccesses},
  } = useHttpRequest({
    selector: state => ({
      regionList: state.http.regionList,
      userRegionAccesses: state.http.userRegionAccesses,
      updateUserRegionAccesses: state.http.updateUserRegionAccesses,
    }),
    clearAfterUnmount: ['updateUserRegionAccesses'],
    initialRequests: request => {
      request('regionList', {params: {network_id: networkId}});
      request('userRegionAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.updateUserRegionAccesses?.httpRequestStatus === 'loading' &&
        state.updateUserRegionAccesses?.httpRequestStatus === 'success'
      ) {
        toast('Updated successfully!', {type: 'success'});
        navigate('../access');
        return;
      } else if (
        state.updateUserRegionAccesses?.httpRequestStatus === 'error'
      ) {
        if (state.updateUserRegionAccesses.error?.status === 422) {
        } else {
          toast(
            (state.updateUserRegionAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.updateUserRegionAccesses?.httpRequestStatus !== 'loading' &&
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
    accessedSelected.includes(item.id)
      ? setAccessedSelected(prvState => prvState.filter(id => id !== item.id))
      : setAccessedSelected(prv => [...prv, item.id]);
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
        accessedRegions.filter(item => accessedSelected.includes(item.id)),
      ),
    );
    setAccessedRegions(prevState =>
      prevState.filter(item => !accessedSelected.includes(item.id)),
    );
    setAccessedSelected([]);
  };

  const handleSaveClick = () => {
    request('updateUserRegionAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
      data: {ids: accessedRegions.map(item => item.id)},
    });
  };

  return (
    <EditAccessTablesView
      tableColumns={columns}
      accessedItems={accessedRegions}
      noAccessItems={noAccessRegions}
      accessedSelected={accessedSelected}
      noAccessSelected={noAccessSelected}
      handleAddClick={handleRegionAddClick}
      handleRemoveClick={handleRegionRemoveClick}
      handleAccessedCheckboxClick={handleAccessedCheckboxClick}
      handleNoAccessCheckboxClick={handleNoAccessCheckboxClick}
      handleSaveClick={handleSaveClick}
      accessedTableLoading={
        userRegionAccesses?.httpRequestStatus === 'loading' ||
        regionList?.httpRequestStatus === 'loading'
      }
      noAccessTableLoading={
        userRegionAccesses?.httpRequestStatus === 'loading' ||
        regionList?.httpRequestStatus === 'loading'
      }
    />
  );
};

export default RegionEditAccessTable;
