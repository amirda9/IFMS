import dayjs from 'dayjs';
import {FC, useEffect, useState} from 'react';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {useParams, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';
import {deepcopy} from '~/util';
import {$Delete, $Get} from '~/util/requestapi';

const columns = {
  index: {label: 'Index', size: 'w-[7%]'},
  date: {label: 'Date', size: 'w-[18%]', sort: true},
  type: {label: 'Type', size: 'w-[18%]'},
  alarms: {label: 'Alarms', size: 'w-[9%]'},
  rtu: {label: 'RTU', size: 'w-[24%]'},
  station: {label: 'Station', size: 'w-[10%]'},
  details: {label: 'Details', size: 'w-[7%]'},
  delete: {label: 'Delete', size: 'w-[7%]'},
};

type historydatatype = {
  measurement_id: string;
  index: number;
  date: string;
  type: string;
  alarms: number;
  rtu: string;
  station: string;
  details: string;
  delete: string;
}[];

type Iprops={
  opticalRouteId:string
  networkId:string
}
const items = [
  {
    index: 1,
    measurement_id: '565',
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Proactive-On Demand',
    alarms: 0,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
  {
    index: 2,
    measurement_id: '55665',
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Maintenance-Automatic',
    alarms: 2,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
  {
    index: 3,
    measurement_id: '5665655',
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Maintenance-On Demand',
    alarms: 4,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
];

const OpticalRouteTestHistoryPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams<Iprops>();
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedtab, setSelectedtab] = useState('Date');
  const [veiwertablesorte, setVeiwertablesort] = useState(false);
  const [historydata, setHistorydata] = useState<historydatatype>([]);
  const [deletelist, setDeletelist] = useState<string[]>([]);

  const gethistory = async () => {
    try {
      setLoading(true);
      const getdata = await $Get(
        `otdr/optical-route/${
          params.opticalRouteId!
        }/test-setups/history`,
      );

      const data: {
        measurement_id: string;
        index: number;
        date: string;
        type: string;
        alarms: number;
        rtu: string;
        station: string;
      }[] = await getdata?.json();

      if (getdata?.status == 200) {
        setHistorydata(data.map(prev => ({...prev, details: '', delete: ''})));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gethistory();
  }, []);

  const sortdveiwers = (tabname: string, sortalfabet: boolean) => {
    const historydataCopy = deepcopy(historydata);
    if (tabname == 'Index') {
    } else if (tabname == 'Alarms') {
      if (sortalfabet) {
        historydataCopy.sort(function (a: any, b: any) {
          return a.alarms - b.alarms;
        });
      } else {
        historydataCopy.sort(function (a: any, b: any) {
          return b.alarms - a.alarms;
        });
      }
    } else {
      if (sortalfabet) {
        historydataCopy.sort(
          (a: any, b: any) =>
            -a[tabname.toString().toLowerCase()].localeCompare(
              b[tabname.toString().toLowerCase()],
              'en-US',
            ),
        );
      } else {
        historydataCopy.sort((a: any, b: any) =>
          a[tabname.toString().toLowerCase()].localeCompare(
            b[tabname.toString().toLowerCase()],
            'en-US',
          ),
        );
      }
    }
    setHistorydata(historydataCopy);
  };

  useEffect(() => {
    if (mount) {
      if (selectedtab != 'Index') {
        sortdveiwers(selectedtab, veiwertablesorte);
      }
    }
    setMount(true);
  }, [veiwertablesorte, selectedtab]);

  const deletehistory = async () => {
    try {
      setLoading(true);
      const deleteonehistory = await $Delete(
        `otdr/optical-route/${
          params.opticalRouteId!
        }/measurements`,
        deletelist,
      );
      const data = await deleteonehistory?.json();
      if (deleteonehistory?.status == 201) {
        const getdata = await $Get(
          `otdr/optical-route/${
            params.opticalRouteId!
          }/test-setups/history`,
        );
        const data: {
          measurement_id: string;
          index: number;
          date: string;
          type: string;
          alarms: number;
          rtu: string;
          station: string;
        }[] = await getdata?.json();
        if (getdata?.status == 200) {
          setHistorydata(
            data.map(prev => ({...prev, details: '', delete: ''})),
          );
        }
      }
      toast('It was done successfully', {type: 'success', autoClose: 1000});
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    } finally {
      setLoading(false);
      setDeletelist([]);
    }
  };

  const onclickdelete = async (id: string) => {
    const findidindex = deletelist.findIndex(data => data == id);
    if (findidindex < 0) {
      setDeletelist(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-y-4 pr-16">
        <Table
          loading={loading}
          tdclassname="text-left pl-[6px]"
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            setSelectedtab(tabname), setVeiwertablesort(sortalfabet);
          }}
          tabicon={selectedtab}
          cols={columns}
          items={historydata}
          dynamicColumns={['details', 'delete']}
          renderDynamicColumn={({value, key}) => {
            if (key === 'details')
              return (
                <IoOpenOutline
                  onClick={() =>
                    navigate(`../../../chart`, {
                      state: {
                        opticalrout_id: params.opticalRouteId!,
                        measurement_id: value.measurement_id,
                      },
                    })
                  }
                  size={22}
                  className="mx-auto cursor-pointer"
                />
              );
            else if (key === 'delete')
              return (
                <IoTrashOutline
                  onClick={() => onclickdelete(value.measurement_id)}
                  className="mx-auto cursor-pointer text-red-500"
                  size={22}
                />
              );
            else return <></>;
          }}
          bordered
        />
      </div>
      <div className="mt-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={deletehistory}>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default OpticalRouteTestHistoryPage;
