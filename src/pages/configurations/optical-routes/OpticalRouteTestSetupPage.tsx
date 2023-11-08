import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Link, Outlet, useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {$GET} from '~/util/requestapi';

const columns = {
  name: {label: 'Name', size: 'w-[20%]', sort: true},
  type: {label: 'Type', size: 'w-[15%]'},
  wavelength: {label: 'Wavelength', size: 'w-[15%]'},
  rtu: {label: 'RTU', size: 'w-[20%]'},
  station: {label: 'Station', size: 'w-[20%]'},
  details: {label: 'Details', size: 'w-[5%]'},
  delete: {label: 'Delete', size: 'w-[5%]'},
};

const items = [
  {
    name: 'Test Setup 1',
    type: 'Monitoring',
    wavelength: '2625',
    rtu: 'ARIO4P1625',
    station: 'Station 1',
    detail: '22222',
    delete: '22222',
  },
  {
    name: 'Test Setup 2',
    type: 'ionitoring',
    wavelength: '1625',
    rtu: 'bRIO4P1625',
    station: 'Station 1',
    detail: '11111',
    delete: '11111',
  },
  {
    name: 'Test Setup 1',
    type: 'Proactive',
    wavelength: '32625',
    rtu: 'ARIO4P1625',
    station: 'Station 1',
    detail: '33333',
    delete: '33333',
  },
];

const OpticalRouteTestSetupPage: FC = () => {
  const params = useParams();
  const [alldelets, setAlldelets] = useState<string[]>([]);
  const [allitems, setAllitems] = useState<
    {
      name: string;
      type: string;
      wavelength: string;
      rtu: string;
      station: string;
      detail: string;
      delete: string;
    }[]
  >([]);

  const [selectedTab, setSelectedtab] = useState('Name');
  const {
    request,
    state: {opticalrouteTestSetup, opticalrouteDeletTestsetup},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteTestSetup: state.http.opticalrouteTestSetup,
      opticalrouteDeletTestsetup: state.http.opticalrouteDeletTestsetup,
    }),
    initialRequests: request => {
      request('opticalrouteTestSetup', {
        params: {optical_route_id: params.opticalRouteId || ''},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.opticalrouteDeletTestsetup?.httpRequestStatus === 'loading' &&
        state.opticalrouteDeletTestsetup!.httpRequestStatus === 'success'
      ) {
        request('opticalrouteTestSetup', {
          params: {optical_route_id: params.opticalRouteId || ''},
        });
      }
    },
  });


  useEffect(() => {
    const getsetup = async () => {
      const getdata = await $GET(
        `otdr/optical-route/${params.opticalRouteId}/test-setups`,
      );
      console.log(getdata, 'getdata');
      const all =
        getdata?.map((data: any) => ({
          name: data.name,
          type: data.type,
          wavelength: data.wavelength,
          rtu: data.rtu.name,
          station: data.station.name,
          detail: data.id,
          delete: data.id,
        })) || [];
      setAllitems(all);
    };
    getsetup();
  }, []);

  const sortddata = (tabname: string, sortalfabet: boolean) => {
    const items2 = JSON.parse(JSON.stringify(allitems));
    if (sortalfabet) {
      items2.sort(
        (a: any, b: any) =>
          -a[tabname.toLocaleLowerCase()].localeCompare(
            b[tabname.toLocaleLowerCase()],
            'en-US',
          ),
      );
    } else {
      items2.sort((a: any, b: any) =>
        a[tabname.toLocaleLowerCase()].localeCompare(
          b[tabname.toLocaleLowerCase()],
          'en-US',
        ),
      );
    }
    setAllitems(items2);
  };

  const deletetest = (id: string) => {
    const find = alldelets.findIndex(data => data == id);
    if (find < 0) {
      setAlldelets(prev => [...prev, id]);
    }
  };

  const save = () => {
    request('opticalrouteDeletTestsetup', {
      params: {optical_route_id: params.opticalRouteId || ''},
      data: alldelets,
    });
    setAlldelets([]);
  };

  return (
    <div className="flex flex-grow flex-col">
      <div className="relative flex  flex-grow flex-col gap-y-4 pr-16">
        <Link to={'create'}>
          <BsPlusLg
            size={25}
            color="#18C047"
            className=" absolute right-[30px]"
          />
        </Link>

        <Table
          cols={columns}
          items={allitems}
          tdclassname="text-left pl-[6px]"
          tabicon={selectedTab}
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            sortddata(tabname, sortalfabet);
            setSelectedtab(tabname);
          }}
          dynamicColumns={['details', 'delete']}
          renderDynamicColumn={({key, value}) => {
            if (key === 'details')
              return (
                <Link to={value.detail}>
                  <IoOpenOutline size={22} className="mx-auto" />
                </Link>
              );
            else if (key === 'delete')
              return (
                <IoTrashOutline
                  onClick={() => deletetest(value.delete)}
                  className="mx-auto text-red-500"
                  size={22}
                />
              );
            else return <></>;
          }}
          bordered
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={save}>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>

      {/* Details Modal */}
      <Outlet />
    </div>
  );
};

export default OpticalRouteTestSetupPage;
