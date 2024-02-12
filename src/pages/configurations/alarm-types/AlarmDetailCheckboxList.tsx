import {FC} from 'react';

type Item = {
  label: string;
  items?: Item[];
};

type Props = {
  title?: string;
  titleCheckbox?: boolean;
  items: Item[];
};

type itemdata = {
  label: string;
  items: {label: string}[];
}[];
const dateandtimeitems: any = [
  {
    label: 'Date & Time',
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

const networkitems: any = [
  {
    label: 'Network',
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

const rtuitems: itemdata = [
  {
    label: 'rtu',
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
      },
      {
        label: 'Switch Status',
      },
      {
        label: 'OTDR IP & Port',
      },
      {
        label: 'Switch IP & Port',
      },
      {
        label: 'RTU Port Num.',
      },
      {
        label: 'RTU Port Index',
      },
      {
        label: 'RTU Port Status',
      },
    ],
  },
];

const opticalrouteitems = [
  {
    label: 'optical_route',
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
      },
      {
        label: 'Link Num.',
      },
      {
        label: 'Distance From Optical Route Start',
      },
    ],
  },
];

const testsetupitems = [
  {
    label: 'test_setup',
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
      },
      {
        label: 'Link Reference Length',
      },
      {
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
    label: 'test_result',
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
      },
      {
        label: 'Event Reflectance',
      },
    ],
  },
];
const renderNetworkGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};

const rendeRtuGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};
const rendeOpticalRouteGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};

const rendeTestSetupGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};

const rendeTestResultGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};

const rendeDateGroup = (item: Item) => {
  return (
    <>
      <div className="pb-2">
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{item.label}</span>
      </div>
      {item?.items?.map(item => (
        <div className="pl-4">
          <div className="pb-2">
            <span className="mr-2">
              <input type="checkbox" />
            </span>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </>
  );
};
// {item.items.map(renderItemGroup)}
const AlarmDetailCheckboxList: FC<Props> = ({title, titleCheckbox}) => {
  return (
    <div className="flex flex-1 flex-col gap-y-4 ">
      {/* *********** Date & Time ********* */}
      <div>
        <span className="mr-2">
          <input type="checkbox" />
        </span>
        <span>{title}</span>
      </div>

      <div className="flex-grow border border-black bg-white p-4 pt-[0px] h-[652px] overflow-y-auto ">
        {dateandtimeitems.map(rendeDateGroup)}
        {/* *********** Network ********* */}
        {networkitems.map(renderNetworkGroup)}
        {/* *********** rtu ********* */}
        {rtuitems.map(rendeRtuGroup)}
        {/* *********** optical_route ********* */}
        {opticalrouteitems.map(rendeOpticalRouteGroup)}
        {/* *********** test_setup ********* */}
        {testsetupitems.map(rendeTestSetupGroup)}
        {/* *********** test_result ********* */}
        {testresultitems.map(rendeTestResultGroup)}
      </div>
    </div>
  );
};

export default AlarmDetailCheckboxList;
