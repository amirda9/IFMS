import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {useDispatch} from 'react-redux';
import {
  Link,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {setopticalroutUpdateTestsetupDetail} from '~/store/slices/opticalroutslice';
import {deepcopy} from '~/util';
import {$Get} from '~/util/requestapi';

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
  const {pathname} = useLocation();
  const [loading, setLoading] = useState(false);
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
  const {request, state} = useHttpRequest({
    selector: state => ({}),
    initialRequests: request => {},
  });

  const Getsetup = async () => {
    try {
      setLoading(true);
      const getalldata = await $Get(
        `otdr/optical-route/${
          params.opticalRouteId!.split('_')[0]
        }/test-setups`,
      );
      const getdata = await getalldata?.json();
      if (getalldata?.status == 200) {
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
      }
    } catch (error) {
      console.log(`gettestsetupError is:${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Getsetup();
  }, [pathname]);

  const sortddata = (tabname: string, sortalfabet: boolean) => {
    const items2 = deepcopy(allitems);
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
      params: {optical_route_id: params.opticalRouteId!.split('_')[0] || ''},
      data: alldelets,
    });
    setAlldelets([]);
    Getsetup();
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const create = () => {
    dispatch(
      setopticalroutUpdateTestsetupDetail({
        name: '',
        station_id: '',
        station_name: '',
        init_rtu_id: '',
        init_rtu_name: '',
        startdatePart: '',
        starttimePart: '',
        enddatePart: '',
        endtimePart: '',
        parameters: {
          enabled: true,
          type: 'monitoring',
          wavelength: '1625',
          break_strategy: 'skip',
          date_save_policy: 'save',
          test_mode: 'fast',
          run_mode: 'average',
          distance_mode: 'manual',
          range: 3,
          pulse_width_mode: 'manual',
          pulse_width: 3,
          sampling_mode: 'duration',
          sampling_duration: 4,
          IOR: 1.476,
          RBS: -79,
          event_loss_threshold: 0.05,
          event_reflection_threshold: -40,
          fiber_end_threshold: 5,
          total_loss_threshold: 5,
          section_loss_threshold: 5,
          injection_level_threshold: 5,
        },
        learning_data: {
          targeted_count_per_cycle: 30,
          start_cycle_time: {
            type: 'fixed',
            time: '',
            periodic_options: {
              value: 0,
              period_time: 'secondly',
            },
          },
          increase_count_options: {
            count: 2,
            timing: {
              type: 'fixed',
              time: '',
              periodic_options: {
                value: 0,
                period_time: 'secondly',
              },
            },
            maximum_count: 60,
          },
        },
        test_program: {
          starting_date: {
            immediately: false,
          },
          end_date: {
            indefinite: true,
          },
          period_time: {
            value: 0,
            period_time: 'secondly',
          },
        },
      }),
    );
    navigate('create');
  };
  return (
    <div className="flex flex-grow flex-col">
      <div className="relative flex  flex-grow flex-col gap-y-4 pr-16">
        <Link to={'create'}>
          <BsPlusLg
            onClick={create}
            size={25}
            color="#18C047"
            className=" absolute right-[30px]"
          />
        </Link>

        <Table
          loading={loading}
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
                  className="mx-auto cursor-pointer text-red-500"
                  size={22}
                />
              );
            else return <></>;
          }}
          bordered
        />
      </div>
      <div className="mt-[20px] flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={save}>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>

      {/* Details Modal */}
      <Outlet />
    </div>
  );
};

export default OpticalRouteTestSetupPage;
