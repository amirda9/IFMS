
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const LinkEmptyPage = () => {
  const {network, http} = useSelector((state: any) => state);
  let findtaype = network.type.find(
    (data: any) => data.id == network.linkdetail?.id,
  );

  const params = useParams<{linkId: string}>();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
        {findtaype?.type == 'cable' ? (
          <TabItem
            to="cables-segments"
            name="Cables & Segments"
            className="w-40"
          />
        ) : (
          <TabItem
            to="ducts-segments"
            name="Ducts & Segments"
            className="w-40"
          />
        )}

        <TabItem to="points" name="Points" />
      </div>
      <Outlet key={params.linkId} />
    </div>
  );
};

export default LinkEmptyPage;
