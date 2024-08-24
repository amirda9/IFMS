
import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import { useLocation } from 'react-router-dom';
const SinglereportsLayout: FC = () => {
  const location=useLocation()

  let result=location.pathname.includes("CreateReport")
  const params = useParams();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        <TabItem to={result?"Createreportsparameters" :"Parameters"} name="Parameters" />

      </div>

      <Outlet key={params.opticalRouteId} />
    </div>
  );
};

export default SinglereportsLayout;
