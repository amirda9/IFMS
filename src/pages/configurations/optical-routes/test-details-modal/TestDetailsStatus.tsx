import dayjs from 'dayjs';
import {FC, useEffect, useState} from 'react';
import {IoOpenOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn} from '~/components';

import {toast} from 'react-toastify';
import Selectbox from '~/components/selectbox/selectbox';
import {RootState} from '~/store';
import {$Get, $Post} from '~/util/requestapi';
import {deepcopy} from '~/util/deepcopy';
import {setopticalroutUpdateTestsetupDetail} from '~/store/slices/opticalroutslice';
type Rowtext = {
  name: string;
  value: string;
};

const options = [
  {label: 'Valid', value: 'valid'},
  {label: 'InValid', value: 'invalid'},
];
const Rowtext = ({name, value}: Rowtext) => {
  return (
    <div className="mb-[4px] flex flex-row">
      <span className="w-[250px] text-[20px] font-light leading-[24.2px]">
        {name}
      </span>
      <span className="text-[18px] font-light leading-[24.2px]">{value}</span>
    </div>
  );
};

const TestDetailsStatus: FC = () => {
  const params = useParams();
  const [testnowloading, setTestnowloading] = useState(false);
  const [errorcount, setErrorcount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    opticalroutUpdateTestsetupDetail,
    modalloading,
    gettestsetupdetaildata,
  } = useSelector((state: RootState) => state.opticalroute);

  const testnow = async () => {
    try {
      setTestnowloading(true);
      const testnowresponse = await $Post(
        `otdr/optical-route/${params?.opticalRouteId}/single-measurement?test_setup_id=${params?.testId}&measurement_type=learning`,
        {},
      );
  
      if (testnowresponse?.status == 201) {
        const responsjeson = await testnowresponse.json();
  
        await new Promise<void>((resolve, reject) => {
          const intervalId = setInterval(async () => {
            try {
              const checkstatusresponse = await $Get(
                `otdr/optical-route/${params?.opticalRouteId}/check-status/${responsjeson}`,
              );
  
              if (checkstatusresponse?.status == 200) {
                const resultstatus = await checkstatusresponse?.json();
                if (resultstatus == "SUCCESS") {
                  setTestnowloading(false);
                  clearInterval(intervalId);
                  toast('It was done successfully', {
                    type: 'success',
                    autoClose: 1000,
                  });
                  resolve(); // پایان عملیات
                }
              } else {
                setErrorcount((prev) => {
                  const newCount = prev + 1;
                  if (newCount === 4) {
                    clearInterval(intervalId);
                    toast('An error was encountered', {
                      type: 'error',
                      autoClose: 1000,
                    });
                    setErrorcount(0);
                    setTestnowloading(false);
                    reject(new Error('Max retries reached'));
                  }
                  return newCount;
                });
              }
            } catch (err) {
              clearInterval(intervalId);
              reject(err);
            }
          }, 1000);
        });
      } else {
        toast('Encountered an error', { type: 'error', autoClose: 1000 });
      }
    } catch (error) {
      console.log(`the test now error is:${error}`);
    } finally {
      setTestnowloading(false);
    }
  };

  useEffect(() => {
    if (!gettestsetupdetaildata) {
      navigate(-1);
    }
  }, []);

  console.log("testnowloadingtestnowloading",testnowloading);
  
  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex flex-grow flex-col gap-y-4">
        <Rowtext name="Current Learning Cycle" value={'1'} />

        <div className="flex flex-row">
          <Rowtext name="On Learning" value={'No'} />
          <SimpleBtn
            loading={testnowloading}
            onClick={testnow}
            className="ml-48">
            Test Now
          </SimpleBtn>
        </div>

        <Rowtext
          name="Current Cycle Start"
          value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
        />

        <Rowtext
          name="Next Cycle Start"
          value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
        />

        <Rowtext
          name="First Reference Time"
          value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
        />

        <Rowtext
          name="Last Reference Time"
          value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
        />

        <div className="flex flex-row">
          <span className="w-[250px] text-[20px] font-light leading-[24.2px]">
            Current Reference
          </span>
          <IoOpenOutline
            className="cursor-pointer"
            onClick={
              () =>
                window.open(
                  `/config/CurrentReference?opticalrout_id=${params?.opticalRouteId}&test_setup_id=${params?.testId}&current_reference_id=${
                    opticalroutUpdateTestsetupDetail?.status
                      ?.current_reference_id || ''
                  }`,
                  '_blank',
                  'noopener,noreferrer',
                )
              // navigate(`../../../chart`, {
              //   state: {
              //     opticalrout_id: params.opticalRouteId!,
              //     measurement_id: value.measurement_id,
              //   },
              // })
            }
            size={25}
          />
        </div>

        <div className="flex flex-row items-center">
          <span>Reference Status</span>
          <Selectbox
            defaultvalue={
              opticalroutUpdateTestsetupDetail.status.reference_status
            }
            onclickItem={(e: {lable: string; value: string}) => {
              let dataa: any = deepcopy(opticalroutUpdateTestsetupDetail);
              dataa.status.reference_status = e.value;
              dispatch(setopticalroutUpdateTestsetupDetail(dataa));
            }}
            options={options}
            classname="w-[123px] rounded-[10px] h-[40px]"
          />
        </div>

        <Rowtext name="Last Learning Count" value={'24'} />
      </div>
    </div>
  );
};

export default TestDetailsStatus;
