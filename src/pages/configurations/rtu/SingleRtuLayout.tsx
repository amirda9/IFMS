import {FC} from 'react';
import {useSelector} from 'react-redux';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

type Iprops = {
  rtuId: string;
  stationId: string;
  regionId: string;
  networkId: string;
};
const SingleRtuLayout: FC = () => {
  const params = useParams<Iprops>();
  const {rtugetdetailStatus} = useSelector((state: any) => state.rtu);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        {rtugetdetailStatus ? <TabItem to="ports" name="Ports" /> : null}
      </div>

      <Outlet key={params.rtuId} />
    </div>
  );
};

export default SingleRtuLayout;
