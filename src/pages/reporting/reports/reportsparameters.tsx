import {FaArrowUp} from 'react-icons/fa6';
import GreaterThan from '~/assets/icons/Greater Than.png';
import {SimpleBtn} from '~/components';
type itemprops = {
  selected: boolean;
  name: string;
};
const Tabitem = ({selected, name}: itemprops) => {
  return (
    <button
      className={`h-[40px] w-full pl-[20px] text-left ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      {name}
    </button>
  );
};
const Tabitemorder = ({selected, name}: itemprops) => {
  return (
    <button
      className={`flex h-[40px] w-full flex-row items-center justify-between px-[20px] text-[18px] font-normal ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      <span>{name}</span>
      <FaArrowUp color={selected ? 'black' : '#006BBC'} />
    </button>
  );
};

function Reportsparameters() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row justify-between">
        <div className="flex h-[667px] w-[29%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Available Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white px-[5px] py-[10px]">
            <Tabitem name="Fault" selected={true} />
            <Tabitem name="Affected Customers" selected={false} />
            <Tabitem name="Applied Threshold" selected={false} />
            <Tabitem name="Distance from Nearest Site" selected={false} />
            <Tabitem name="Last Confirmation Time" selected={false} />
            <Tabitem name="Loss" selected={false} />
            <Tabitem name="Maximum Position" selected={false} />
            <Tabitem name="Minimum Position" selected={false} />
            <Tabitem name="Nearest Site" selected={false} />
            <Tabitem name="Position" selected={false} />
            <Tabitem name="Status" selected={false} />
            <Tabitem name="Treshold Type" selected={false} />
            <Tabitem name="Treshold Value" selected={true} />
          </div>
        </div>
        <div className="mt-[44px] flex h-[540px] w-[6%] flex-col items-center  pt-[100px]">
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>
        <div className="flex h-[667px] w-[29%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Selected Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white px-[5px] py-[10px]">
            <Tabitem name="Fault" selected={true} />
          </div>
        </div>
        <div className="mt-[44px] flex h-[540px] w-[6%] flex-col items-center  pt-[100px]">
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>
        <div className="flex h-[667px] w-[30%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Order By Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white">
            <Tabitemorder name="Fault" selected={false} />
          </div>
          <div className="mt-[10px] flex flex-row items-center justify-between">
            <SimpleBtn>Ascending</SimpleBtn>
            <SimpleBtn>Descending</SimpleBtn>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end">
      <SimpleBtn>Open Report</SimpleBtn>
      <SimpleBtn className='mx-[9px]'>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default Reportsparameters;
