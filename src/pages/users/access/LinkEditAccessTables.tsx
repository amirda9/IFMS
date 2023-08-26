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
  const [noAccessLinks, setNoAccessLinks] = useState<
    AccessLinkTableItem[]
  >([]);
  const [accessedLinks, setAccessedLinks] = useState<
    AccessLinkTableItem[]
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
      allLinks: state.http.allLinks,
      userLinkAccesses: state.http.userLinkAccesses,
      userUpdateAccesses: state.http.userUpdateAccesses,
    }),
    clearAfterUnmount: ['userUpdateAccesses'],
    initialRequests: request => {
      request('allLinks', undefined);
      request('userLinkAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access, network_id: networkId},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.userUpdateAccesses?.httpRequestStatus === 'loading' &&
        state.userUpdateAccesses?.httpRequestStatus === 'success'
      ) {
        request('userLinkAccesses', {
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
          const allLinks = state.allLinks.data;

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
    accessedNetsSelected.includes(item.id)
      ? setAccessedNetsSelected(prvState =>
          prvState.filter(id => id !== item.id),
        )
      : setAccessedNetsSelected(prv => [...prv, item.id]);
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
        accessedLinks.filter(item => accessedNetsSelected.includes(item.id)),
      ),
    );
    setAccessedLinks(prevState =>
      prevState.filter(item => !accessedNetsSelected.includes(item.id)),
    );
    setAccessedNetsSelected([]);
  };

  const handleSaveClick = () => {
    request('userUpdateAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, resource_type: 'LINK'},
      data: {ids: accessedLinks.map(item => item.id)},
    });
  };

  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={columns}
          items={noAccessLinks}
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
          onClickRightButton={handleLinkAddClick}
          onClickLeftButton={handleLinkRemoveClick}
        />
        <Table
          cols={columns}
          items={accessedLinks}
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

export default LinkEditAccessTable;
