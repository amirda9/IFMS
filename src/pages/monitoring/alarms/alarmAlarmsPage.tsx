import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {RootState} from '~/store';
import {
  useGetAlarmsDetailsPagedMutation,
  useUpdateAlarmDetailsMutation,
} from '~/store/slices/alarmapislice';
import Alarmsparameters from '~/components/alarmsparameters';
import AppDialog from '~/components/modals/AppDialog';
import {setAlarmmodaldata, setShowParameters} from '~/store/slices/alarmsslice';
import Alarmadetail from '~/components/alarmadetail';
import {toast} from 'react-toastify';
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';

function AlarmAlarmsPage() {
  const {showparameters, alarmmodaldata} = useSelector(
    (state: RootState) => state.alarmsslice,
  );
  const dispatch = useDispatch();
  const location = useLocation();
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
  const [getDetailsPaged, {data, error, isLoading}] =
    useGetAlarmsDetailsPagedMutation();
  const [
    updateAlarmDetails,
    {error: updateError, isLoading: updateisLoading,isSuccess, isError},
  ] = useUpdateAlarmDetailsMutation();

  useEffect(() => {
    getDetailsPaged({
      page: pageinationpage,
      limit: rowsPerPage,
      idLisArray: idLisArray,
    });
  }, [pageinationpage]);

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
      getDetailsPaged({
        page: 1,
        limit: Number(e.target.value),
        idLisArray: idLisArray,
      });
    }, 1000);
  };

  useEffect(() => {
    if (isSuccess) {
      toast('Update successful!', {
        type: 'success',
        autoClose: 2000,
      });
    }else{

    }
  }, [isSuccess]);

  if (isLoading || updateisLoading) {
    return <h1>Loading...</h1>;
  }
  if (error || updateError) {
    toast('Encountered an error', {type: 'error', autoClose: 1000});
  }

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
            allalarmdata={data}
            updateallarms={(alarm_id: string, new_status: string) =>
              cahngeAllupdateallarms(alarm_id, new_status)
            }
          />
        </div>

        <div className="relative flex h-[40px] w-full flex-row justify-center">
          <div className="mt-[20px] flex flex-row  items-center">
            <SimpleBtn
              onClick={
                pageinationpage - 2 < 1
                  ? () => {}
                  : () => {
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
            <span className="ml-2">/{data?.total_pages!}</span>
            <SimpleBtn
              onClick={
                pageinationpage == data?.total_pages!
                  ? () => {}
                  : () => {
                      setPageinationpage(prev => prev + 1);
                    }
              }
              className="ml-[20px] px-[2px] py-[5px]"
              type="button">
              <BiChevronRight size={20} />
            </SimpleBtn>
            <SimpleBtn
              onClick={
                pageinationpage + 2 > data?.total_pages!
                  ? () => {}
                  : () => {
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
            loading={updateisLoading}
            onClick={() =>
              updateAlarmDetails({updateallarms: allupdateallarms})
            }
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
