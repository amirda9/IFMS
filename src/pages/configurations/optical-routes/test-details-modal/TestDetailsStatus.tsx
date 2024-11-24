import dayjs from 'dayjs';
import {FC, useEffect} from 'react';
import {IoOpenOutline} from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SimpleBtn } from '~/components';
import Selectbox from '~/components/selectbox/selectbox';
import { RootState } from '~/store';
type Rowtext = {
  name: string;
  value: string;
};

const options=[{label:"Valid",value:"Valid"}]
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
  const params=useParams()
  const navigate=useNavigate()
  console.log('paramsppppppppppp',params);
  const {opticalroutUpdateTestsetupDetail,modalloading,gettestsetupdetaildata} = useSelector(
    (state: RootState) => state.opticalroute,
  );

  useEffect(()=>{
    if (!gettestsetupdetaildata) {
      navigate(-1)
    }
  },[])

  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex flex-grow flex-col gap-y-4">
        <Rowtext name="Current Learning Cycle" value={'1'} />

<div
className='flex flex-row'
>
<Rowtext name="On Learning" value={'No'} />
<SimpleBtn className='ml-48'>
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
          
          onClick={
            () =>
              window.open(
                `/config/CurrentReference?opticalrout_id=${params?.opticalRouteId}&test_setup_id=${params?.testId}&current_reference_id=${opticalroutUpdateTestsetupDetail?.status?.current_reference_id || ""}`,
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
          
          size={25} />
    
        
        </div>

        <div className="flex flex-row items-center">
          <span >
            Reference Status
          </span>
          <Selectbox onclickItem={()=>{}} options={options} classname="w-[123px] rounded-[10px] h-[40px]" />
        </div>

        <Rowtext name="Last Learning Count" value={'24'} />
      </div>
    </div>
  );
};

export default TestDetailsStatus;
