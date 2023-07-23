import React from 'react';
import {IoClose, IoReturnUpBack} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {useHttpRequest} from '~/hooks';
import dayjs from 'dayjs';

const NetworkHistoryPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate('../', {replace: true});
  const {
    state: {detail},
  } = useHttpRequest({selector: state => ({detail: state.http.networkDetail})});
  return (
    <div
      className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-[#D9D9D97d]"
      onClick={goBack}>
      <div className="h-fit w-1/4">
        <div className="flex flex-grow justify-end rounded-t-md bg-p px-2 py-1">
          <button className="active:opacity-50" onClick={goBack}>
            <IoClose size={24} className="text-white " />
          </button>
        </div>
        <div className="flex-grow bg-white">
          <table
            className="w-full border-collapse border border-black text-sm [&_td]:border  [&_td]:border-black [&_td]:text-center"
            border={1}>
            <thead className="[&_td]:bg-background [&_td]:py-1">
              <tr>
                <td className="w-1/12">Index</td>
                <td className="w-2/5">Date</td>
                <td className="w-2/5">User</td>
                <td className="w-1/12">Restore</td>
              </tr>
            </thead>
            <tbody>
              {detail!.data!.versions.map((version, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {dayjs(version.time_created).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td>Anonymous User</td>
                  <td>
                    <SimpleBtn className="!my-0 !px-5 !py-0">
                      <IoReturnUpBack size={24} />
                    </SimpleBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkHistoryPage;
