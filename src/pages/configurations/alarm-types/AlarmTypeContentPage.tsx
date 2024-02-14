import {FC} from 'react';
import {SimpleBtn} from '~/components';
import AlarmCheckboxList from './AlarmCheckboxList';
import AlarmDetailCheckboxList from './AlarmDetailCheckboxList';
import { $Put } from '~/util/requestapi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';
import { toast } from 'react-toastify';

const items = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Affected Customers',
      },
      {
        label: 'Applied Threshold',
      },
      {
        label: 'Distance from Nearest Site',
      },
      {
        label: 'Last Confirmation Time',
      },
      {
        label: 'Loss',
      },
      {
        label: 'Maximum Position',
      },
      {
        label: 'Neatest Site',
      },
      {
        label: 'Position',
      },
      {
        label: 'Status',
      },
      {
        label: 'Threshold Type',
      },
      {
        label: 'Threshold Value',
      },
    ],
  },
];

const primaryandsecondaryitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Network',
      },
      {
        label: 'Region',
      },
      {
        label: 'Station',
      },
      {
        label: 'RTU',
      },
      {
        label: 'OTDR',
      },
      {
        label: 'Switch',
      },
      {
        label: 'Link',
      },
      {
        label: 'Cable',
      },
      {
        label: 'Core',
      },
      {
        label: 'Duct',
      },
      {
        label: 'Mini-Duct',
      },
      {
        label: 'Fiber',
      },
      {
        label: 'Connector',
      },
      {
        label: 'Optical Route',
      },
      {
        label: 'Test Setup',
      },
      {
        label: 'Hour',
      },
      {
        label: 'Day',
      },
      {
        label: 'Week',
      },
      {
        label: 'Month',
      },
    ],
  },
];

const dateandtimeitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Date & Time',
      },
      {
        label: 'Hour',
      },
      {
        label: 'Day',
      },
      {
        label: 'Month',
      },
      {
        label: 'Year',
      },
    ],
  },
];

const networkitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Network Name',
      },
      {
        label: 'Network Admin',
      },
      {
        label: 'Region Name',
      },
      {
        label: 'Region Admin',
      },
      {
        label: 'Station Name',
      },
      {
        label: 'Station Admin',
      },
      {
        label: 'Station Position',
      },
      {
        label: 'Link Name',
      }, 
      {
        label: 'Link Admin',
      },
      {
        label: 'Link Nominal Length',
      },
      {
        label: 'Link Nominal Loss',
      },
      {
        label: 'Link Type',
      },
      {
        label: 'Link Source',
      },
      {
        label: 'Link Destination',
      },
      {
        label: 'Link Cable / Duct',
      },
      {
        label: 'Link Core / Mini Duct - Fiber',
      },
      {
        label: 'Link Distance From Start',
      },
      {
        label: 'Link Segment',
      },
      {
        label: 'Link Distance From Segment Start',
      },
      {
        label: 'Point Position',
      },
      {
        label: 'Splice Nominal Losst',
      },
      {
        label: 'Connector Nominal Loss',
      },
    ],
  },
];


const rtuitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'RTU Name',
      },
      {
        label: 'RTU Station',
      },
      {
        label: 'RTU Model',
      },
      {
        label: 'OTDR Model',
      },
      {
        label: 'OTDR Status',
      },
      {
        label: 'Switch Model',
      },  {
        label: 'Switch Status',
      },  {
        label: 'OTDR IP & Port',
      },  {
        label: 'Switch IP & Port',
      },  {
        label: 'RTU Port Num.',
      }, {
        label: 'RTU Port Index',
      }, {
        label: 'RTU Port Status',
      }
    ],
  },
];


const opticalrouteitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Optical Route Name',
      },
      {
        label: 'Optical Route Source',
      },
      {
        label: 'Optical Route Destination',
      },
      {
        label: '"Optical Route Nominal Length',
      },
      {
        label: 'Optical Route Nominal Loss',
      },
      {
        label: 'Optical Route Type',
      },  {
        label: 'Link Num.',
      },  {
        label: 'Distance From Optical Route Start',
      }
    ],
  },
];


const testsetupitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Test Setup Name',
      },
      {
        label: 'Test Type',
      },
      {
        label: 'Wavelength',
      },
      {
        label: 'Test Setup Start',
      },
      {
        label: 'Test Setup End',
      },
      {
        label: 'Test Setup Periodicity',
      },  {
        label: 'Link Reference Length',
      },  {
        label: 'Optical Route Reference Length',
      },
       {
        label: 'Link Reference Loss',
      },
      {
        label: 'Optical Route Reference Loss',
      },
      {
        label: 'Reference ORL',
      },
      {
        label: 'Reference Noise Floor',
      },
      {
        label: 'Splice Reference Loss',
      },
      {
        label: 'Connector Reference Loss',
      },
      {
        label: 'Splice Reference Reflectance',
      },
      {
        label: 'Connector Reference Reflectance',
      },
      {
        label: 'Break Strategy',
      },
      {
        label: 'Data Save Policy',
      },
      {
        label: 'Test Mode',
      },
      {
        label: 'Run Mode',
      },
      {
        label: 'Distance Mode',
      },
      {
        label: 'Range (km)',
      },
      {
        label: 'Pulse Width Mode',
      },
      {
        label: 'Pulse Width (ns)',
      },
      {
        label: 'Sampling Mode',
      },
      {
        label: 'Sampling Duration',
      },
      {
        label: 'IOR',
      },
      {
        label: 'RBS (dB)',
      },
      {
        label: 'Event Loss Threshold (dB)',
      },
      {
        label: 'Event Reflection Threshold (dB)',
      },
      {
        label: 'Fiber End Threshold (dB)',
      },
      {
        label: 'Total Loss Threshold (dB)',
      },
      {
        label: 'Section Loss Threshold (dB)',
      },
      {
        label: 'Injection Level Threshold (dB)',
      },

    ],
  },
];


const testresultitems = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Switching Status',
      },
      {
        label: 'Applying Test Parameters',
      },
      {
        label: 'Test Execution',
      },
      {
        label: 'Receiving Results',
      },
      {
        label: 'Event Type',
      },
      {
        label: 'Event Loss',
      },  {
        label: 'Event Reflectance',
      }
    ],
  },
];



const AlarmTypeContentPage: FC = () => {
  const params=useParams()
  const {alarmtypedetail} = useSelector((state: RootState) => state.alarmtypes);
  const updatedefinition = async () => {
    const response = await $Put(`otdr/alarm/${params.alarmId}`, {
      alarm_content:alarmtypedetail.alarm_content
    });
    if (response.status == 201) {
      toast('با موفقیت انجام شد', {type: 'success',autoClose:1000});
    } else {
      toast('با خطا مواجه شد', {type: 'error',autoClose:1000});
    }
  };
  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex flex-grow gap-x-8">
        <AlarmCheckboxList
          title="Primary Source"
          items={primaryandsecondaryitems}
          type='Primary'
        />
        <AlarmCheckboxList
          title="Group By Secondary Source"
          items={primaryandsecondaryitems}
          titleCheckbox
          type='Secondary'
        />
        <AlarmDetailCheckboxList title="Alarm Details" items={items} />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={updatedefinition} type="button">Save</SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeContentPage;
