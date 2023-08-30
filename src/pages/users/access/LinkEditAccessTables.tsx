import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import EditAccessTablesView from './EditAccessTablesView';

type Props = {
  userId: string;
  access: AccessEnum;
  networkId: string;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

const columns = {
  select: {label: '', size: 'w-[5%]'},
  index: {label: '#', size: 'w-[10%]'},
  link: {label: 'Link', size: 'w-[85%]'},
};

type AccessLinkTableItem = {
  select: boolean;
  index: number;
  link: string;
  id: string;
};

const LinkEditAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
  networkId,
  setIsEditing,
}) => {
  const [noAccessLinks, setNoAccessLinks] = useState<AccessLinkTableItem[]>([]);
  const [accessedLinks, setAccessedLinks] = useState<AccessLinkTableItem[]>([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedSelected, setAccessedSelected] = useState<string[]>([]);

  const {
    request,
    state: {updateUserLinkAccesses, allLinks, userLinkAccesses},
  } = useHttpRequest({
    selector: state => ({
      allLinks: state.http.allLinks,
      userLinkAccesses: state.http.userLinkAccesses,
      updateUserLinkAccesses: state.http.updateUserLinkAccesses,
    }),
    clearAfterUnmount: ['updateUserLinkAccesses'],
    initialRequests: request => {
      request('allLinks', undefined);
      request('userLinkAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.updateUserLinkAccesses?.httpRequestStatus === 'loading' &&
        state.updateUserLinkAccesses?.httpRequestStatus === 'success'
      ) {
        request('userLinkAccesses', {
          params: {user_id: userId},
          queryString: {access_type: access, network_id: networkId},
        });
        toast('Updated successfully!', {type: 'success'});
        return;
      } else if (state.updateUserLinkAccesses?.httpRequestStatus === 'error') {
        if (state.updateUserLinkAccesses.error?.status === 422) {
        } else {
          toast(
            (state.updateUserLinkAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.updateUserLinkAccesses?.httpRequestStatus !== 'loading' &&
        state.userLinkAccesses?.httpRequestStatus === 'success'
      ) {
        const userAccessedLinks = state.userLinkAccesses.data;
        setAccessedLinks(
          userAccessedLinks
            ? userAccessedLinks.map((item, index) => ({
                index: index + 1,
                link: item.link.name,
                select: false,
                id: item.link.id,
              }))
            : [],
        );

        if (state.allLinks?.httpRequestStatus === 'success') {
          const allLinks = state.allLinks.data?.filter(
            link => link.network_id === networkId,
          );

          // Extracting those links which are not founded in userAccessedLinks
          const noAccessLinks =
            allLinks && userAccessedLinks
              ? allLinks.filter(
                  item =>
                    !userAccessedLinks.find(acc => acc.link.id === item.id),
                )
              : [];

          setNoAccessLinks(
            noAccessLinks.map((item, index) => ({
              index: index + 1,
              link: item.name,
              select: false,
              id: item.id,
            })),
          );
        }
      }
    },
  });

  const handleNoAccessCheckboxClick = (item: AccessLinkTableItem) => {
    noAccessSelected.includes(item.id)
      ? setNoAccessSelected(prvState => prvState.filter(id => id !== item.id))
      : setNoAccessSelected(prv => [...prv, item.id]);
  };

  const handleAccessedCheckboxClick = (item: AccessLinkTableItem) => {
    accessedSelected.includes(item.id)
      ? setAccessedSelected(prvState => prvState.filter(id => id !== item.id))
      : setAccessedSelected(prv => [...prv, item.id]);
  };

  const handleLinkAddClick = () => {
    setAccessedLinks(prevState =>
      prevState.concat(
        noAccessLinks.filter(item => noAccessSelected.includes(item.id)),
      ),
    );
    setNoAccessLinks(prevState =>
      prevState.filter(item => !noAccessSelected.includes(item.id)),
    );
    setNoAccessSelected([]);
  };

  const handleLinkRemoveClick = () => {
    setNoAccessLinks(prevState =>
      prevState.concat(
        accessedLinks.filter(item => accessedSelected.includes(item.id)),
      ),
    );
    setAccessedLinks(prevState =>
      prevState.filter(item => !accessedSelected.includes(item.id)),
    );
    setAccessedSelected([]);
  };

  const handleSaveClick = () => {
    request('updateUserLinkAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
      data: {ids: accessedLinks.map(item => item.id)},
    });
  };

  return (
    <EditAccessTablesView
      tableColumns={columns}
      accessedItems={accessedLinks}
      noAccessItems={noAccessLinks}
      accessedSelected={accessedSelected}
      noAccessSelected={noAccessSelected}
      handleAddClick={handleLinkAddClick}
      handleRemoveClick={handleLinkRemoveClick}
      handleAccessedCheckboxClick={handleAccessedCheckboxClick}
      handleNoAccessCheckboxClick={handleNoAccessCheckboxClick}
      handleSaveClick={handleSaveClick}
      accessedTableLoading={
        userLinkAccesses?.httpRequestStatus === 'loading' ||
        allLinks?.httpRequestStatus === 'loading'
      }
      noAccessTableLoading={
        userLinkAccesses?.httpRequestStatus === 'loading' ||
        allLinks?.httpRequestStatus === 'loading'
      }
      setIsEditing={setIsEditing}
    />
  );
};

export default LinkEditAccessTable;
