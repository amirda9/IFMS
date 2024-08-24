import {useEffect, useState} from 'react';
import {FC} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {NavLink, useNavigate} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import Swal from 'sweetalert2';
import {$DELETE, $Delete, $GET, $Get} from '~/util/requestapi';
import {IoTrashOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import {
  setReportselectedlist,
  setReportserReport,
  setAlldeletereports,
  alldeletereporttype,
  ReportsetReporttype,
  setReportsetlist,
  deletereportset,
  deletereport,
  setloadinggetrports,
  setgetdetailstatus,
  setCreatemoune,
} from './../../../store/slices/reportslice';
import {deepcopy} from '~/util';
import {RootState} from '~/store';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {toast} from 'react-toastify';
import Mainloading from '~/components/loading/mainloading';

type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

type allreportsetType = {
  id: string;
  name: string;
}[];
// ----- main ----- main ----- main ------ main ------- main ------- main
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
// ---------------------------------------------------------------------

const ReportsRouteLayout: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingid, setLoadingid] = useState('');
  // const [list, setList] = useState<allreportsetType>();
  const [selectedId, setSelectedId] = useState('');
  const {
    reportselectedlist,
    ReportsetReport,
    alldeletereports,
    reportsetlist,
    loadinggetrports,
    createmount,
  } = useSelector((state: RootState) => state.reportslice);

  // const {
  //   request,
  //   state: {list, deleteRequest},
  // } = useHttpRequest({
  //   selector: state => ({
  //     list: state.http.networkList,
  //     deleteRequest: state.http.networkDelete,
  //   }),
  //   initialRequests: request => {
  //     if (list?.httpRequestStatus !== 'success') {
  //       request('networkList', undefined);
  //     }
  //   },
  //   onUpdate: (lastState, state) => {
  //     if (
  //       lastState.deleteRequest?.httpRequestStatus === 'loading' &&
  //       state.deleteRequest!.httpRequestStatus === 'success'
  //     ) {
  //       request('networkList', undefined);
  //     }
  //   },
  // });

  useEffect(() => {
    const getallreportsetsrespons = async () => {
      try {
        setLoading(true);
        const allreportsetsrespons = await $Get(`otdr/report-set/`);
        if (allreportsetsrespons?.status == 200) {
          const allreportsetsresponsData = await allreportsetsrespons.json();
          dispatch(setReportsetlist(allreportsetsresponsData));
        }
      } catch (error) {
        console.log(`get all report set error is:${error}`);
      } finally {
        setLoading(false);
      }
    };

    getallreportsetsrespons();
  }, []);

  const findoptical = (networkId: string, opticalId: string) => {
    const findopt = alldeletereports
      ?.find(data => data.Reportsetid == networkId)
      ?.reports?.findIndex((data2: string) => data2 == opticalId);
    if (findopt != undefined && findopt > -1) {
      return true;
    } else {
      return false;
    }
  };

  const [openall, setOpenall] = useState(false);

  const openreportsetreports = async (id: string) => {
    //  dispatch(setloadinggetrports(true));
    const findreportset = reportselectedlist.findIndex(data => data == id);
    //We first check whether network has been clicked before or not.
    if (findreportset > -1) {
      let old = [...reportselectedlist];
      old.splice(findreportset, 1);
      dispatch(setReportselectedlist(old));
    } else {
      let old = [...reportselectedlist];
      old.push(id);
      dispatch(setReportselectedlist(old));
    }
    // -------------------
    // const findreportsetindex = ReportsetReport.findIndex(
    //   data => data.Reportsetid == id,
    // );
    // const reportsetresponse = await $Get(
    //   `otdr/optical-route/?network_id=${id}`,
    // );
    // if (reportsetresponse?.status == 200) {
    //   const opticalslist = await reportsetresponse?.json();
    //   //Here we add or remove the opticalroutes related to this network to the list.
    //   if (findreportsetindex > -1) {
    //     let old = [...ReportsetReport];
    //     let newdata = old.filter(data => data.Reportsetid != id);
    //     newdata.push({Reportsetid: id, reports: opticalslist});
    //     dispatch(setReportserReport(newdata));
    //   } else {
    //     let old = [...ReportsetReport];
    //     old.push({Reportsetid: id, reports: opticalslist});
    //     dispatch(setReportserReport(old));
    //   }
    // }
  };

  const onclickopticalchecbox = (
    e: boolean,
    reportid: string,
    reportsetid: string,
  ) => {
    let oldolldelete: alldeletereporttype = deepcopy(alldeletereports);

    let finddataindex = alldeletereports.findIndex(
      data => data.Reportsetid == reportsetid,
    );
    if (finddataindex > -1) {
      if (e) {
        const newdata = deepcopy(oldolldelete[finddataindex].reports);
        newdata.push(reportid);
        oldolldelete[finddataindex].reports = newdata;
        dispatch(setAlldeletereports(oldolldelete));
      } else {
        const newdata = oldolldelete[finddataindex].reports.filter(
          data => data != reportid,
        );
        oldolldelete[finddataindex].reports = newdata;
        dispatch(setAlldeletereports(oldolldelete));
      }
    } else {
      oldolldelete.push({Reportsetid: reportsetid, reports: [reportid]});
      dispatch(setAlldeletereports(oldolldelete));
    }
  };



  const deleteoneopticalroute = async (
    reportid: string,
    reportsetid: string,
  ) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        setLoading(true);
        //First, we find the list of optical routes of this network that have their checkboxes checked.
        try {
          const findDelete = alldeletereports.findIndex(
            data => data.Reportsetid == reportsetid,
          );


          const alldeleteopticalrouteCopy = deepcopy(alldeletereports);
          const promises = alldeleteopticalrouteCopy[findDelete].reports.map(
            (data: string) =>
              $Delete(`otdr/report-set/${reportsetid}/report/${data}`),
          );

          const results = await Promise.all(promises);
          const reportsetreportCopy = deepcopy(ReportsetReport);
          const findinlistindex = ReportsetReport.findIndex(
            data => data.Reportsetid == reportsetid,
          );

          for (
            let i = 0;
            i < reportsetreportCopy[findinlistindex].reports.length;
            i++
          ) {
            for (
              let j = 0;
              j < alldeleteopticalrouteCopy[findDelete].reports.length;
              j++
            ) {
              if (
                reportsetreportCopy[findinlistindex].reports[i].id ==
                alldeleteopticalrouteCopy[findDelete].reports[j]
              ) {
                const finddataindex = reportsetreportCopy[
                  findinlistindex
                ].reports.findIndex(
                  (data: any) =>
                    data.id ==
                    reportsetreportCopy[findinlistindex].reports[i].id,
                );
    

                reportsetreportCopy[findinlistindex].reports.splice(
                  finddataindex,
                  1,
                );
              }
            }
          }

          dispatch(setReportserReport(reportsetreportCopy));
        } catch (error) {
          console.log(`delete errr is:${error}`);
        } finally {
          setLoading(false);
        }

      }
    });
  };

  const deletereportSet = async (id: string) => {
    try {
      const deleteresponse = await $Delete(`otdr/report-set/${id}`);
      if (deleteresponse?.status == 201) {
        dispatch(deletereportset({reportsetId: id}));
        toast('It was done successfully', {type: 'success', autoClose: 1000});
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`error is:${error}`);
    }
  };
  const lastreportset =
    (reportsetlist && reportsetlist[reportsetlist?.length - 1]?.id) || '';

  const deleteReport = async (report_id: string, report_set_id: string) => {
    try {
      const deleteReportresponse = await $Delete(
        `otdr/report-set/${report_set_id}/report/${report_id}`,
      );
      if (deleteReportresponse?.status == 201) {
        dispatch(
          deletereport({reportsetid: report_set_id, reportid: report_id}),
        );
        toast('It was done successfully', {type: 'success', autoClose: 1000});
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`error is:${error}`);
    }
  };


  
  // --------------------------------------------------------------------------------------
  return (
    <SidebarLayout
      classname="h-[calc(100vh-10px)] w-[25%]"
      createTitle=""
      canAdd>
      {loading ? (
        <Mainloading
          spinerclassname={`fixed left-[calc(15%-50px)] top-[35%] z-[300000] h-[100px] w-[100px]`}
          classname={`fixed left-0 top-0 z-[200000] flex h-screen w-[30%] items-center justify-center bg-neutral-400 opacity-60`}
        />
      ) : null}
      <div className="h-[2000px] w-full">
        {/* <h1 className="my-6 mt-12 text-[20px] font-bold text-[red]">
          This page requires a Full-Access license to view the content
        </h1> */}
        <div className="flex flex-row items-center ">
          <label htmlFor="search" className="mr-2">
            Search
          </label>

          <TextInput
            id="search"
            className="mr-10 w-full"
            onChange={event => {
              console.log(event);
            }}
          />
        </div>

        <div className={`relative mt-[30px] flex w-full flex-col`}>
          <div
            className={`absolute h-[40px] w-[10px] ${
              reportselectedlist.indexOf(lastreportset) > -1
                ? 'bottom-[-20px]'
                : 'bottom-[-15.5px]'
            }  left-[-5px] bg-[#E7EFF7]`}></div>
          <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
            {openall ? (
              <span className="ml-[-4px] mr-[5px] font-light">-</span>
            ) : (
              <span className="mb-[5px] ml-[3px] mr-[5px] font-light">+</span>
            )}

            <button onClick={() => setOpenall(!openall)}>
              <span>Report Sets</span>
            </button>
            <BsPlusLg
              onClick={() => navigate('CreateReportset')}
              color="#18C047"
              className="ml-[10px] cursor-pointer"
            />
          </div>

          {openall ? (
            <>
              {loading ? (
                <GeneralLoadingSpinner size="w-8 h-8" className="ml-10 mt-2" />
              ) : (
                <>
                  {reportsetlist?.map((reportsetdata: any, index: any) => (
                    <div
                      key={index}
                      className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                        reportsetlist && index == reportsetlist?.length - 1
                          ? 'border-none'
                          : 'border-[#000000]'
                      }  `}>
                      {reportsetlist && index == reportsetlist.length - 1 ? (
                        <div className="absolute ml-[0px] h-[36px] border-l-[1px] border-dotted border-[#000000]"></div>
                      ) : null}
                      {/* <div
                        className={`absolute z-10 ${
                          reportselectedlist.indexOf(reportsetdata.id) > -1
                            ? 'bottom-[-2px]'
                            : 'bottom-[-7px]'
                        }  left-[15px] h-[25px] w-[5px] bg-[#E7EFF7]`}></div> */}

                      <div className="relative mt-6  flex flex-col">
                        <div
                          className={`mb-[-10px] flex w-auto flex-row  items-center text-[20px] text-[#000000]`}>
                          <span className="mt-[-6px] text-[12px] ">
                            ........
                          </span>
                          {reportselectedlist.indexOf(reportsetdata.id) > -1 ? (
                            <span className="mx-[3px] font-light">-</span>
                          ) : (
                            <span className="mx-[3px] mt-[-2px] font-light">
                              +
                            </span>
                          )}
                        </div>
                        <SidebarItem
                          selected={
                            selectedId == reportsetdata.id ? true : false
                          }
                          onclick={() => {
                            dispatch(setCreatemoune(false));
                            setLoadingid(reportsetdata.id);
                            openreportsetreports(reportsetdata.id),
                              setSelectedId(reportsetdata.id);
                            navigate(reportsetdata.id);
                          }}
                          canAdd={true}
                          createurl={`CreateReport/${reportsetdata.id}`}
                          onDelete={() => deletereportSet(reportsetdata.id)}
                          // enabelcheck={true}
                          className="ml-[40px] mt-[-20px] w-[calc(100%-20px)]"
                          name={reportsetdata.name}
                          to={reportsetdata.id}
                        />
                        <>
                          {reportselectedlist.indexOf(reportsetdata.id) > -1 ? (
                            <>
                              {/* {loadinggetrports &&
                              loadingid == reportsetdata.id ? (
                                <GeneralLoadingSpinner
                                  size="w-8 h-8"
                                  className="ml-10 mt-2"
                                />
                              ) : ( */}
                                <div className="relative ml-[32px] flex flex-col mt-[-7px] border-l-[1px] border-dotted border-[#000000]">
                                  <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                                 {ReportsetReport?.find(
                                    dataa =>
                                      dataa.Reportsetid == reportsetdata.id,
                                  )?.reports.length == 0 ? (
                                    <div className="absolute left-[-5px] top-[-20px] h-[40px] w-[10px] bg-[#E7EFF7]"></div>
                                  ) : null}

                                  {ReportsetReport?.find(
                                    dataa =>
                                      dataa.Reportsetid == reportsetdata.id,
                                  )?.reports.map((data, index: number) => (
                                    <div
                                      key={index}
                                      className="relative flex w-full flex-row items-center">
                                      <span className="w-[15px] text-[12px]">
                                        .....
                                      </span>
                                      {index ==
                                      ReportsetReport?.find(
                                        dataa =>
                                          dataa.Reportsetid == reportsetdata.id,
                                      )!.reports!.length -
                                        1 ? (
                                        <div className="absolute left-[-5px] top-[31px] h-[40px] w-[10px] bg-[#E7EFF7]"></div>
                                      ) : null}
                                      <SidebarItem
                                        selected={
                                          selectedId == data.id ? true : false
                                        }
                                        onclick={() => {
                                          setSelectedId(data.id),
                                            dispatch(setgetdetailstatus(false));
                                        }}
                                        onclickcheckbox={e =>
                                          onclickopticalchecbox(
                                            e,
                                            data.id,
                                            reportsetdata.id,
                                          )
                                        }
                                        checkstatus={findoptical(
                                          reportsetdata.id,
                                          data.id,
                                        )}
                                        onDelete={() =>
                                          deleteoneopticalroute(
                                            data.id,
                                            reportsetdata.id,
                                          )
                                        }
                                        enabelcheck={true}
                                        className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                                        name={data.name}
                                        to={`${reportsetdata.id}/reportset/report/${data.id}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              {/* )} */}
                            </>
                          ) : null}
                        </>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* </div> */}
    </SidebarLayout>
  );
};

export default ReportsRouteLayout;
