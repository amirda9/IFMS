import React from 'react';
import {IoClose, IoReturnUpBack} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {SimpleBtn} from '~/components';

const NetworkHistoryPage = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-[#D9D9D97d]">
      <div className="h-fit w-1/4">
        <div className="flex flex-grow justify-end rounded-t-md bg-p px-2 py-1">
          <button
            className="active:opacity-50"
            onClick={() => navigate('../', {replace: true})}>
            <IoClose size={24} className="text-white " />
          </button>
        </div>
        <div className="flex-grow bg-white">
          <table
            className="w-full border-collapse border border-black text-sm [&_td]:border  [&_td]:border-black"
            border={1}>
            <thead>
              <tr>
                <td className="w-1/12">Index</td>
                <td className="w-2/5">Date</td>
                <td className="w-2/5">User</td>
                <td className="w-2/12">Restore</td>
              </tr>
            </thead>
            <tbody>
              <tr className="[&_*]:text-center">
                <td>1</td>
                <td>2023-10-6 22:59:56</td>
                <td>Ahmad Kazemi</td>
                <td>
                  <SimpleBtn className="my-0 py-0">
                    <IoReturnUpBack size={24} />
                  </SimpleBtn>
                </td>
              </tr>
              <tr className="[&_*]:text-center">
                <td>1</td>
                <td>2023-10-6 22:59:56</td>
                <td>Ahmad Kazemi</td>
                <td>
                  <SimpleBtn className="my-0 py-0">
                    <IoReturnUpBack size={24} />
                  </SimpleBtn>
                </td>
              </tr>
              <tr className="[&_*]:text-center">
                <td>1</td>
                <td>2023-10-6 22:59:56</td>
                <td>Ahmad Kazemi</td>
                <td>
                  <SimpleBtn className="my-0 py-0">
                    <IoReturnUpBack size={24} />
                  </SimpleBtn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkHistoryPage;
