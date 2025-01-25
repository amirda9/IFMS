import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
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
// *************** types *************** types ******************** types ******

type modalvalue = {
  contributing_conditions: {
    coef: number;
    parameter: string;
    value: string;
    reference_value: number;
    measured_value: number;
  }[];

  id: string;

  region_admin: string;

  region_name: string;

  secondary_source: string;

  severity: string;

  station_name: string;

  status: string;

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
};

// *************** types *************** types ******************** types ******

function AlarmAlarmsPage() {
  const {allalarmdata, alarmstatus, showparameters, alarmmodaldata} =
    useSelector((state: RootState) => state.alarmsslice);
  const [modaldata, setModaldata] = useState<modalvalue | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateloading, setUpdateloading] = useState(false);
  const location = useLocation();
  const idLisArray = location.state?.id_list!;
  const [allupdateallarms, setAllupdateallarms] = useState<
    {
      alarm_id: string;
      new_status: string;
    }[]
  >([]);

  const geralarmsdetail = async () => {
    try {
      setLoading(true);
      const response = await $Post(`otdr/alarm/events/details`, idLisArray);
      if (response?.status == 200) {
        const responsedata = await response?.json();
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
    if (!alarmstatus) {
      geralarmsdetail();
    }
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

  // const changemodaldata = (data: modalvalue) => {
  //   setModaldata(data);
  // };

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

      <div className="mt-4 box-border flex w-full flex-col px-2  pb-8">
        <Alarmadetail
          // @ts-ignore
          allalarmdata={allalarmdata}
          updateallarms={(alarm_id: string, new_status: string) =>
            cahngeAllupdateallarms(alarm_id, new_status)
          }
          // changemodaldata={(data: modalvalue) => changemodaldata(data)}
        />
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
