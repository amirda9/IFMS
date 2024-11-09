import React from 'react'
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import {SimpleBtn, Table} from '~/components';
function ReportDetailtable() {

  const topcolumns = {
    index: {label: 'Index', size: 'w-[2%]'},
    Name: {label: 'Name', size: 'w-[15%]'},
    Column1: {label: 'Column 1', size: 'w-[15%]'},
    Column2: {label: 'Column 2', size: 'w-[15%]'},
    Column3: {label: 'Column 3', size: 'w-[15%]'},
    Column4: {label: 'Column 4', size: 'w-[12%]'},
    Column5: {label: 'Column 5', size: 'w-[15%]'},
  };


  return (
    <div className='w-full mt-12 px-4 py-6'>
      <div className='flex flex-row justify-between'>
        <span>Report 1</span>
        <SimpleBtn onClick={()=>{}} className="mx-[9px]">
        Download
        </SimpleBtn>
      </div>

      <Table
        loading={false}
        // onclicktitle={(tabname: string, sortalfabet: boolean) => {
        //   const dataa = [...reightstationsorted];
        //   if (sortalfabet) {
        //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
        //   } else {
        //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
        //   }
        //   setReightstationssorted(dataa);
        // }}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={[]}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left h-[calc(100%-90px)]  mt-2 pb-0 overflow-y-auto "
        dynamicColumns={['index']}
        // renderDynamicColumn={({key, value}) => {
        //   if (key === 'detail')
        //     return (
        //       // <Link to={value.detail}>
        //       <IoOpenOutline
        //         onClick={() =>
        //           window.open(
        //             `/config/chart?opticalrout_id=${value.opticalRouteId!}&measurement_id=${
        //               value.id
        //             }`,
        //             '_blank',
        //             'noopener,noreferrer',
        //           )
        //         }
        //         size={22}
        //         className="mx-auto"
        //       />
        //       // </Link>
        //     );
        //   else if (key === 'delete')
        //     return (
        //       <IoTrashOutline
        //         onClick={() =>
        //           deleteREsult(value.opticalRouteId, value.id, value.index)
        //         }
        //         className="mx-auto cursor-pointer text-red-500"
        //         size={22}
        //       />
        //     );
        //   else return <></>;
        // }}
      />
      <div className="relative flex h-[40px] w-full flex-row justify-center">
        <div className="mt-[20px] flex flex-row  items-center">
          <SimpleBtn className="px-[2px] py-[5px]" type="button">
            <BiChevronsLeft size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronLeft size={20} />
          </SimpleBtn>
          <span className="ml-[20px] text-[20px] font-normal leading-6">
            page
          </span>
          <input
            type="number"
            className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
          <span className="ml-2">/5</span>
          <SimpleBtn className="ml-[20px] px-[2px] py-[5px]" type="button">
            <BiChevronRight size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronsRight size={20} />
          </SimpleBtn>
        </div>
        <div className="absolute right-0 top-[12px] flex flex-row items-center">
          <span className="text-[20px] font-normal leading-6">
            Rows Per Page
          </span>
          <input
            type="number"
            className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
        </div>
      </div>
    </div>
  )
}

export default ReportDetailtable