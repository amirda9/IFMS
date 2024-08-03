import {useState} from 'react';
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
} from './../../../store/slices/reportslice';
import {deepcopy} from '~/util';
import {RootState} from '~/store';

type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

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

const ReportsRouteLayout: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState('');
  const {reportselectedlist, ReportsetReport, alldeletereports} =
    useSelector((state: RootState) => state.reportslice);
  const {
    request,
    state: {list, deleteRequest},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      deleteRequest: state.http.networkDelete,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteRequest?.httpRequestStatus === 'loading' &&
        state.deleteRequest!.httpRequestStatus === 'success'
      ) {
        request('networkList', undefined);
      }
    },
  });

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

  const Itembtn = ({name, id, classname}: Itembtntype) => {
    return (
      <div
        className={`flex h-[70px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">.....</span>
        {reportselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => {
            opennetworkopticallist(id), setSelectedId(id);
            navigate('4646');
          }}
          className={`${
            reportselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
        {reportselectedlist.indexOf(id) > -1 ? (
          <NavLink to={`create/${id}`} end>
            <BsPlusLg color="#18C047" className="ml-[10px]" />
          </NavLink>
        ) : null}
        {selectedId == id ? (
          <IoTrashOutline
            onClick={() => deletenetworkoptical(id)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = async (id: string) => {
    const findnetwork = reportselectedlist.findIndex(data => data == id);
    //We first check whether network has been clicked before or not.
    if (findnetwork > -1) {
      let old = [...reportselectedlist];
      old.splice(findnetwork, 1);
      dispatch(setReportselectedlist(old));
    } else {
      let old = [...reportselectedlist];
      old.push(id);
      dispatch(setReportselectedlist(old));
    }
    // -------------------
    const findopt = ReportsetReport.findIndex(data => data.Reportsetid == id);
    const opticals = await $Get(`otdr/optical-route/?network_id=${id}`);
    if (opticals?.status == 200) {
      const opticalslist = await opticals?.json();
      //Here we add or remove the opticalroutes related to this network to the list.
      if (findopt > -1) {
        let old = [...ReportsetReport];
        let newdata = old.filter(data => data.Reportsetid != id);
        newdata.push({Reportsetid: id, reports: opticalslist});
        dispatch(setReportserReport(newdata));
      } else {
        let old = [...ReportsetReport];
        old.push({Reportsetid: id, reports: opticalslist});
        dispatch(setReportserReport(old));
      }
    }
  };

  const onclickopticalchecbox = (
    e: boolean,
    opticalid: string,
    networkid: string,
  ) => {
    let oldoptical: alldeletereporttype = deepcopy(alldeletereports);

    let finddataindex = alldeletereports.findIndex(
      data => data.Reportsetid == networkid,
    );
    if (finddataindex > -1) {
      if (e) {
        const newdata = deepcopy(oldoptical[finddataindex].reports);
        newdata.push(opticalid);
        oldoptical[finddataindex].reports = newdata;
        dispatch(setAlldeletereports(oldoptical));
      } else {
        const newdata = oldoptical[finddataindex].reports.filter(
          data => data != opticalid,
        );
        oldoptical[finddataindex].reports = newdata;
        dispatch(setAlldeletereports(oldoptical));
      }
    } else {
      oldoptical.push({Reportsetid: networkid, reports: [opticalid]});
      dispatch(setAlldeletereports(oldoptical));
    }
  };

  const deleteoneopticalroute = async (
    opticalid: string,
    networkid: string,
  ) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        //First, we find the list of optical routes of this network that have their checkboxes checked.
        const findopticalroute = alldeletereports.findIndex(
          data => data.Reportsetid == networkid,
        );
        const alldeleteopticalrouteCopy = deepcopy(alldeletereports);
        try {
          const deleteOticalroute = await $Delete(
            `otdr/optical-route/batch_delete`,
            alldeletereports[findopticalroute]!.reports,
          );
          if (deleteOticalroute?.status == 201) {
            let networkopticalCopy = deepcopy(ReportsetReport);
            const finddataindex = ReportsetReport.findIndex(
              (data:any) => data.Reportsetid == networkid,
            );
            //we update the networks uptical route
            let newnetworkopticalroute = [];
            for (
              let i = 0;
              i < ReportsetReport[finddataindex].reports.length;
              i++
            ) {
              if (
                alldeletereports[
                  findopticalroute
                ]!.reports!.findIndex(
                  data =>
                    data == ReportsetReport[finddataindex].reports[i].id,
                ) < 0
              ) {
                newnetworkopticalroute.push({
                  id: ReportsetReport[finddataindex].reports[i].id,
                  name: ReportsetReport[finddataindex].reports[i].name,
                });
              }
            }
            networkopticalCopy[finddataindex].opticalrouts =
              newnetworkopticalroute;
            dispatch(setReportserReport(networkopticalCopy));
            //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
            alldeleteopticalrouteCopy[findopticalroute].opticalrouts = [];
            dispatch(setAlldeletereports(alldeleteopticalrouteCopy));
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const deletenetworkoptical = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let networkopticalCopy: ReportsetReporttype = deepcopy(ReportsetReport);
        const finddata = ReportsetReport.findIndex(data => data.Reportsetid == id);
        //delete all rtues related to this netwok
        const deleteOticalroute = await $Delete(
          `otdr/optical-route/batch_delete`,
          networkopticalCopy[finddata].reports.map(data => data.id),
        );
        if (deleteOticalroute?.status == 201) {
          networkopticalCopy[finddata].reports = [];
        }
        dispatch(setReportserReport(networkopticalCopy));
        // -------------------------------
        //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
        const alldeleteopticalrouteCopy: alldeletereporttype = deepcopy(
          alldeletereports,
        );
        const finddeleteopticalrout = alldeleteopticalrouteCopy.findIndex(
          data => data.Reportsetid == id,
        );
        alldeleteopticalrouteCopy[finddeleteopticalrout].reports = [];
        dispatch(setAlldeletereports(alldeleteopticalrouteCopy));
      }
    });
  };
  const lastnetwork =
    (list?.data && list?.data[list?.data?.length - 1].id) || '';

  return (
    <SidebarLayout createTitle="" canAdd>
      <h1 className="my-6 mt-12 text-[20px] font-bold text-[red]">
        This page requires a Full-Access license to view the content
      </h1>
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
            reportselectedlist.indexOf(lastnetwork) > -1
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
        </div>

        {openall ? (
          <>
            {list?.data?.map((dataaa, index) => (
              <div
                key={index}
                className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                  list?.data && index == list?.data?.length - 1
                    ? 'border-none'
                    : 'border-[#000000]'
                }  `}>
                {list?.data && index == list?.data?.length - 1 ? (
                  <div className="absolute ml-[0px] h-[36px] border-l-[1px] border-dotted border-[#000000]"></div>
                ) : null}
                <div
                  className={`absolute z-10 ${
                    reportselectedlist.indexOf(dataaa.id) > -1
                      ? 'bottom-[-2px]'
                      : 'bottom-[-7px]'
                  }  left-[15px] h-[25px] w-[5px] bg-[#E7EFF7]`}></div>

                <div className="relative flex flex-col">
                  <Itembtn
                    classname="mb-[-10px]"
                    name={dataaa.name}
                    id={dataaa.id}
                  />

                  {reportselectedlist.indexOf(dataaa.id) > -1 ? (
                    <div className="relative ml-[18px] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                      <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                      {ReportsetReport
                        ?.find(dataa => dataa.Reportsetid == dataaa.id)
                        ?.reports.map((data, index: number) => (
                          <div
                            key={index}
                            className="flex w-full flex-row items-center">
                            <span className="w-[15px] text-[12px]">.....</span>

                            <SidebarItem
                              selected={selectedId == data.id ? true : false}
                              onclick={() => setSelectedId(data.id)}
                              onclickcheckbox={e =>
                                onclickopticalchecbox(e, data.id, dataaa.id)
                              }
                              checkstatus={findoptical(dataaa.id, data.id)}
                              onDelete={() =>
                                deleteoneopticalroute(data.id, dataaa.id)
                              }
                              enabelcheck={true}
                              className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                              name={data.name}
                              to={data.id}
                            />
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
      {/* </div> */}
    </SidebarLayout>
  );
};

export default ReportsRouteLayout;
