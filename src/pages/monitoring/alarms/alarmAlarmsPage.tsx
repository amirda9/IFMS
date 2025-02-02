import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useSearchParams} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {RootState} from '~/store';
import Alarmsparameters from '~/components/alarmsparameters';
import AppDialog from '~/components/modals/AppDialog';
import {
  changealarmstatus,
  setAlarmmodaldata,
  setAllalarmdata,
  setShowParameters,
} from '~/store/slices/alarmsslice';
import Alarmadetail from '~/components/alarmadetail';
import {$Post, $Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';
// *************** types *************** types ******************** types ******

type modalvalue = {
  id: string;
  secondary_source: string;
  measurement_id: string;
  optical_route_id: string;
  test_setup_id: string;
  severity: string;
  status: string;
  region_name: string;
  region_admin: string;
  station_name: string;
  time_created: string;
  time_modified: string;
  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
  contributing_conditions: [
    {
      parameter: string;
      operator: string;
      fault: string;
      coef: number;
      value: string;
      reference_value: number;
      measured_value: number;
    },
  ];
};

// *************** types *************** types ******************** types ******

function AlarmAlarmsPage() {
  const {allalarmdata, alarmstatus, showparameters, alarmmodaldata} =
    useSelector((state: RootState) => state.alarmsslice);
  const [modaldata, setModaldata] = useState<modalvalue | null>(null);
  const [allpages, setAllpages] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateloading, setUpdateloading] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const idLisArray = location.state?.id_list!;
  const typingTimeout = useRef<any>(null);
  const [pageinationpage, setPageinationpage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allupdateallarms, setAllupdateallarms] = useState<
    {
      alarm_id: string;
      new_status: string;
    }[]
  >([]);

  const geralarmsdetail = async (pagenumber: number, row = rowsPerPage) => {
    setLoading(true);
    try {
      const response = await $Post(
        `otdr/alarm/events/details_paged/?limit=${row}&page=${pagenumber}`,
        idLisArray,
      );
      if (response?.status == 200) {
        const responsedata = await response?.json();
        setAllpages(responsedata.total_pages);
        dispatch(changealarmstatus(true));
        dispatch(setAllalarmdata(responsedata));
      }
    } catch (error) {
      console.log(`get alarms detail error:${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!alarmstatus) {

    geralarmsdetail(1, 20);
    // }
  }, []);

  const updatealarms = async () => {
    try {
      setUpdateloading(true);
      const response = await $Put(
        `otdr/alarm/events/update_status/`,
        allupdateallarms,
      );
      if (response?.status == 201) {
        dispatch(changealarmstatus(true));
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`update error is:${error}`);
    } finally {
      setUpdateloading(false);
    }
  };

  useEffect(() => {
    if (modaldata) {
      dispatch(setShowParameters(true));
    }
  }, [modaldata]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const cahngeAllupdateallarms = (alarm_id: string, new_status: string) => {
    setAllupdateallarms(prev => [
      ...prev,
      {alarm_id: alarm_id, new_status: new_status},
    ]);
  };

  const changerowperpage = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    // Clear the previous timeout if it exists
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      geralarmsdetail(pageinationpage, Number(e.target.value));
    }, 1000);
  };

  return (
    <>
      {showparameters && alarmmodaldata ? (
        <AppDialog
          closefunc={() => {
            dispatch(setAlarmmodaldata(null)),
              dispatch(setShowParameters(false));
          }}>
          <Alarmsparameters />
        </AppDialog>
      ) : null}

      <div className="mt-4 box-border flex w-full flex-col px-2   pb-8">
        <div className="flex h-auto min-h-[calc(100vh-330px)] w-full flex-col">
          <Alarmadetail
            // @ts-ignore
            allalarmdata={allalarmdata}
            updateallarms={(alarm_id: string, new_status: string) =>
              cahngeAllupdateallarms(alarm_id, new_status)
            }
            // changemodaldata={(data: modalvalue) => changemodaldata(data)}
          />
        </div>

        <div className="relative flex h-[40px] w-full flex-row justify-center">
          <div className="mt-[20px] flex flex-row  items-center">
            <SimpleBtn
              onClick={
                pageinationpage - 2 < 1
                  ? () => {}
                  : () => {
                      geralarmsdetail(pageinationpage - 2),
                        setPageinationpage(prev => prev - 2);
                    }
              }
              className="px-[2px] py-[5px]"
              type="button">
              <BiChevronsLeft size={20} />
            </SimpleBtn>
            <SimpleBtn
              onClick={
                pageinationpage == 1
                  ? () => {}
                  : () => {
                      geralarmsdetail(pageinationpage - 1),
                        setPageinationpage(prev => prev - 1);
                    }
              }
              className="ml-2 px-[2px] py-[5px]"
              type="button">
              <BiChevronLeft size={20} />
            </SimpleBtn>
            <span className="ml-[20px] text-[20px] font-normal leading-6">
              page
            </span>
            <input
              onChange={() => {}}
              value={pageinationpage}
              type="number"
              className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <span className="ml-2">/{allpages}</span>
            <SimpleBtn
              onClick={
                pageinationpage == allpages
                  ? () => {}
                  : () => {
                      geralarmsdetail(pageinationpage + 1),
                        setPageinationpage(prev => prev + 1);
                    }
              }
              className="ml-[20px] px-[2px] py-[5px]"
              type="button">
              <BiChevronRight size={20} />
            </SimpleBtn>
            <SimpleBtn
              onClick={
                pageinationpage + 2 > allpages
                  ? () => {}
                  : () => {
                      geralarmsdetail(pageinationpage + 2),
                        setPageinationpage(prev => prev + 2);
                    }
              }
              className="ml-2 px-[2px] py-[5px]"
              type="button">
              <BiChevronsRight size={20} />
            </SimpleBtn>
          </div>
          <div className="absolute right-0 top-[12px] flex flex-row items-center">
            <span className="text-[20px] font-normal leading-6">
              Rows Per Page
            </span>
            <input
              onChange={e => changerowperpage(e)}
              value={rowsPerPage}
              type="number"
              className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-row justify-end gap-x-4">
          <SimpleBtn
            loading={updateloading}
            onClick={updatealarms}
            type="submit">
            Save
          </SimpleBtn>

          <SimpleBtn link to="../">
            Cancel
          </SimpleBtn>
        </div>
      </div>
    </>
  );
}

export default AlarmAlarmsPage;
