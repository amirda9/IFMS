import {useMemo, useRef, useState} from 'react';
import {SimpleBtn} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import {useSelector} from 'react-redux';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {Request} from '~/hooks/useHttpRequest';
import {useParams} from 'react-router-dom';
import {UserRole} from '~/constant/users';
import ErrorPage403 from '../errors/403';
const login = localStorage.getItem('login');
import axios from 'axios';
const NetworkGisPage = () => {
  const inputref: any = useRef(null);
  const accesstoken = login && JSON.parse(login)?.data?.access_token || "";
  const params = useParams<{networkId: string}>();
  const {networkDetail} = useSelector((state: any) => state.http);
  const {networkidadmin} = useSelector((state: any) => state.networktree);
  const [title, setTitle] = useState('');
  const [shapefile, setShapefile] = useState<any>();
  const [error, setError] = useState('');
  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {
    state: {detail, update},
    request,
  } = useHttpRequest({
    selector: state => ({
      detail: state.http.networkDetail,
      update: state.http.networkUpdate,
    }),
    initialRequests,
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        initialRequests(request);
      }
    },
  });

  const canchange = useMemo(() => {
    let isnetworkadmin =
      networkidadmin.findIndex((data: string) => data == params.networkId!) > -1
        ? true
        : false;
    if (isnetworkadmin || loggedInUser.role == UserRole.SUPER_USER) {
      return true;
    } else {
      return false;
    }
  }, [params.networkId]);
  const buttons = (
    <>
      {canchange ? (
        <SimpleBtn link to="../edit-access">
          Add Shapefile
        </SimpleBtn>
      ) : null}
      <SimpleBtn>History</SimpleBtn>
      {canchange ? <SimpleBtn>Save</SimpleBtn> : null}
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  const canselupload = () => {
    setTitle('');
    setShapefile('');
  };

  const createshape = async() => {
    if (title == '') {
      setError('نام نباید خالی باشد');
    } else if(shapefile.length == 0) {
      setError('فایلی آپلود نشده است');
    } else{
      
    }
   
    
    try {
      let formData = new FormData();
      formData.append("title",title);
      formData.append("shapefile",shapefile, shapefile.name);
      await axios.post(`http://37.32.27.143:8080/api/otdr/network/${params.networkId!}/shapefile`,formData,{
        headers: {
            'Authorization': `Bearer ${accesstoken}`,
        }
    })
    } catch (error) {
      console.log(`create shape error is:${error}`);   
    }
  };

  const deleteshapefile = (id: string) => {
    request('deleteShapefile', {params: {shapefile_id: id}});
  };
  if (canchange) {
    return (
      <div className="relative flex w-full flex-col">
        <div className="fixed left-0 top-[-80px] z-[100000] h-[140vh] w-full bg-[#D9D9D9] opacity-70"></div>
        <div className="fixed left-[calc(50%-300px)] top-[200px] z-[110000] h-[200px] w-[600px] rounded-[10px] bg-[#E7EFF7] p-6 pb-2">
          <div className=" mb-[20px] flex w-full flex-row items-center justify-between">
            <span className="w-[70px]">name</span>
            <div className="w-[calc(100%-70px)]">
              <input

                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-[40px] w-full rounded-[10px]"
              />
            </div>
          </div>
          <div className=" mb-[20px] flex w-full flex-row items-center justify-between">
            <span className="w-[70px]">File</span>
            <div className="w-[calc(100%-70px)]">{shapefile?.name}</div>
          </div>
          <div className="mt-8 flex w-full flex-row items-center justify-end">
            {error.length>0?
               <span className="mr-4 font-bold text-[red]">
               {error}
             </span>
          :
          null}
         
            <SimpleBtn onClick={createshape} className="h-[40px]">
              Ok
            </SimpleBtn>
            <SimpleBtn onClick={canselupload} className="mx-2 h-[40px]">
              Cancel
            </SimpleBtn>
            <SimpleBtn
              onClick={() => inputref?.current?.click()}
              className="h-[40px]">
              Choose file
            </SimpleBtn>
          </div>
          <input
            onChange={e => e.target.files && setShapefile(e.target.files[0])}
            type="file"
            
            ref={inputref}
            className="-z-50 h-[0px] w-full rounded-[10px]"
          />
        </div>

        {/* ******* form ********** form **************** form ************** form ************* */}
        <FormLayout buttons={buttons}>
          <div className="flex flex-col gap-y-4">
            {networkDetail?.data?.shapefiles?.map(
              (
                data: {
                  id: string;
                  path: string;
                  title: string;
                },
                index: number,
              ) => (
                <div className="flex h-20 w-2/3 flex-row items-center justify-between rounded-lg bg-gis px-4">
                  <div className="flex flex-row gap-x-20">
                    <span>{index + 1}</span>
                    <span>{data.title}</span>
                  </div>
                  <div className="flex flex-row gap-x-8">
                    <SimpleBtn>Download</SimpleBtn>
                    {canchange ? (
                      <IoTrashOutline
                        onClick={() => deleteshapefile(data.id)}
                        size={24}
                        className="text-red-500 active:text-red-300"
                      />
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        </FormLayout>
      </div>
    );
  } else {
    return <ErrorPage403 />;
  }
};

export default NetworkGisPage;
