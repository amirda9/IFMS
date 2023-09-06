import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import AccessTablesView from './AccessTablesView';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  link: {label: 'Link', size: 'w-[50%]'},
  source: {label: 'Source', size: 'w-[20%]'},
  destination: {label: 'Destination', size: 'w-[20%]'},
};

type Props = {
  userId: string;
  networkId: string;
  access?: AccessEnum;
};

const LinkAccessTable: FC<Props> = ({
  userId,
  networkId,
  access = AccessEnum.admin,
}) => {
  const [linkTableItems, setLinkTableItems] = useState<
    {index: number; link: string; source: string; destination: string}[]
  >([]);

  const linkAccessQuery = useHttpRequest({
    selector: state => state.http.userLinkAccesses,
    onUpdate: (lastState, state) => {
      if (lastState?.httpRequestStatus === 'loading') {
        if (state?.httpRequestStatus === 'success') {
          if (state.data) {
            setLinkTableItems(
              state.data.map((item, index) => ({
                index: index + 1,
                link: item.link.name,
                source: item.link.source.name,
                destination: item.link.destination.name,
              })),
            );
          }
        } else if (state?.httpRequestStatus === 'error') {
          if (state.error?.status === 422) {
          } // TODO: Handle correctly
          else {
            toast(
              (state.error?.data?.detail as string) ||
                (state.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {
                type: 'error',
              },
            );
          }
        }
      }
    },
  });

  useEffect(() => {
    linkAccessQuery.request('userLinkAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  return (
    <AccessTablesView
      editButtonText="Edit Link(s)"
      tableItems={linkTableItems}
      tableColumns={columns}
      tableLoading={linkAccessQuery.state?.httpRequestStatus === 'loading'}
    />
  );
};

export default LinkAccessTable;
