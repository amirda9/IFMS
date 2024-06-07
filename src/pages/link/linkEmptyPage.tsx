
import {TabItem} from '~/components';
import {Outlet, useLocation, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useMemo } from 'react';
type mainprops={
  regionId:string,networkId:string,linkId:string
  }
const LinkEmptyPage = () => {
  const path=useLocation()
  const {network, http} = useSelector((state: any) => state);
  let findtaype = network.type.find(
    (data: any) => data.id == network.linkdetail?.id,
  );

  const params = useParams<mainprops>();
  const isinclude=useMemo(()=>path.pathname.includes(`defaultregionlinkdetailpage`),[path.pathname])
  
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to={`${isinclude?"defaultregionlinkdetailpage":"."}`}  name="Detail" />
        <TabItem to={`${isinclude?"access/defaultregionlinkdetailpage":"access"}`}  name="Access" />
        {findtaype?.type == 'cable' ? (
          <TabItem
          to={`${isinclude?"cables-segments/defaultregionlinkdetailpage":"cables-segments"}`} 
            name="Cables & Segments"
            className="w-40"
          />
        ) : (
          <TabItem
          to={`${isinclude?"ducts-segments/defaultregionlinkdetailpage":"ducts-segments"}`} 
            name="Ducts & Segments"
            className="w-40"
          />
        )}

        <TabItem  to={`${isinclude?"points/defaultregionlinkdetailpage":"points"}`}  name="Points" />
      </div>
      <Outlet key={params.linkId!} />
    </div>
  );
};

export default LinkEmptyPage;
