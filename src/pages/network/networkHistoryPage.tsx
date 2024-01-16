import {IoClose, IoReturnUpBack} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {useHttpRequest} from '~/hooks';
import {getPrettyDateTime} from '~/util/time';
import Vector from './../../assets/images/Vector.png'

const NetworkHistoryPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate('../', {replace: true});
  const {
    state: {detail},
  } = useHttpRequest({selector: state => ({detail: state.http.networkDetail})});
  return (
    <div
      className="absolute top-0 left-0 right-0 h-full flex items-center justify-center bg-[#D9D9D97d]"
      onClick={goBack}>
      <div className="h-fit w-[679px]">

        <div className="flex flex-grow justify-end rounded-t-md bg-p px-2 py-1">
          <button className="active:opacity-50" onClick={goBack}>
            <IoClose size={24} className="text-white " />
          </button>
        </div>

        <div className="flex-grow bg-white">
          <table
            className="w-full border-collapse border border-black text-sm [&_td]:border  [&_td]:border-black [&_td]:text-center"
            border={1}>
            <thead className="[&_td]:bg-blueLight [&_td]:py-1">
              <tr>
                <td className="w-1/12">Index</td>
                <td className="w-2/5">Date</td>
                <td className="w-2/5">User</td>
                <td className="w-[100px]">Restore</td>
              </tr>
            </thead>
            <tbody>
              {detail!.data!.versions.map((version, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{getPrettyDateTime(version.time_created)}</td>
                  <td>Anonymous User</td>
                  <td className='w-[80px]'>
                    <SimpleBtn className="!my-0 !px-5 w-[80px]  !py-1">
   
                
                    <img src={Vector} className='w-[24px] z-20 h-[21px]' />
                   
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
