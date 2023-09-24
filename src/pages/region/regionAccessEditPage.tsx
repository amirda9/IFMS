import React, {useRef} from 'react';
import {SimpleBtn, Switch} from '~/components';
import {FormLayout} from '~/layout';
import {useNavigate, useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {EditViewer} from '~/container';
import {EditorRefType} from '~/container/editViewers';
import {AccessEnum} from '~/types';
import { useSelector } from 'react-redux';

const RegionAccessPage = () => {
  const {regionDetail} = useSelector((state: any) => state.http);
  console.log(regionDetail?.data?.access, 'fffrrtttt');
  const editor = useRef<EditorRefType>(null);
  const params = useParams<{regionId: string}>();
  const navigate = useNavigate();
  const {
    request,
    state: {viewers, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.regionAccessList,
      update: state.http.regionAccessUpdate,
    }),
    initialRequests: request => {
      request('regionAccessList', {params: {region_id: params.regionId!}});
    },
  
  });

console.log(viewers,'viewers');
console.log(update,'update');


  const buttons = (
    <>
  
        {/* {regionDetail?.data?.access == 'ADMIN' ? ( */}
      <SimpleBtn
        disabled={update?.httpRequestStatus === 'loading'}
        onClick={() => {
          const admin = viewers!.data!.users.find(
            value => value.access === AccessEnum.admin,
          );
          const viewerList = editor.current!.values;

          if (admin) {
            const index = viewerList.indexOf(admin.user.id);
            if (index !== -1 && index !== null) {
              viewerList.splice(index, 1);
            }
          }

          const users = viewerList.map(value => value);

          request('regionAccessUpdate', {
            params: {region_id: params.regionId!},
            data: {users},
          });
        }}>
        OK
      </SimpleBtn>
      {/* ):null} */}
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );

  return (
    <FormLayout buttons={buttons} wrapperClassName="p-8">
      <div className="mb-4 flex flex-row items-center">
        <span>Users</span>
        <Switch
          wrapperClassName="mx-5"
          onChange={value => {
            editor.current?.setGroup(value);
          }}
        />
        <span>Groups</span>
      </div>
      <EditViewer ref={editor} />
    </FormLayout>
  );
};

export default RegionAccessPage;
