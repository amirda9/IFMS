import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {Table} from '~/components';

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
    selector: state => state.http.userLinksAccesses,
  });

  useEffect(() => {
    linkAccessQuery.request('userLinksAccesses', {
      params: {user_id: userId, access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  useEffect(() => {
    if (linkAccessQuery.state?.httpRequestStatus === 'success') {
      if (linkAccessQuery.state.data) {
        setLinkTableItems(
          linkAccessQuery.state.data.map((item, index) => ({
            index: index + 1,
            link: item.link.name,
            source: item.link.source.name,
            destination: item.link.destination.name,
          })),
        );
      }
    } else if (linkAccessQuery.state?.httpRequestStatus === 'error') {
      if (linkAccessQuery.state.error?.status === 422) {
      } // TODO: Handle correctly
      else {
        toast(
          (linkAccessQuery.state.error?.data.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [linkAccessQuery.state]);

  return <Table items={linkTableItems} cols={columns} />;
};

export default LinkAccessTable;
