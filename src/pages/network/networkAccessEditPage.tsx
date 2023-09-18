import React, {useRef} from 'react';
import {SimpleBtn, Switch} from '~/components';
import {FormLayout} from '~/layout';
import {useNavigate, useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {EditViewer} from '~/container';
import {EditorRefType} from '~/container/editViewers';
import {AccessEnum} from '~/types';

const NetworkAccessPage = () => {
  const editor = useRef<EditorRefType>(null);
  const params = useParams<{networkId: string}>();
  const navigate = useNavigate();
  const {
    request,
    state: {viewers, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.networkAccessList,
      update: state.http.networkAccessUpdate,
    }),
    initialRequests: request => {
      request('networkAccessList', {params: {network_id: params.networkId!}});
    },
    onUpdate: lastState => {
      if (
        lastState.viewers?.httpRequestStatus === 'loading' &&
        viewers?.httpRequestStatus === 'success'
      ) {
        editor.current?.setValues(
          viewers.data!.users.map(viewer => viewer.user.id),
        );
      }
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        update?.httpRequestStatus === 'success'
      ) {
        request('networkAccessList', {params: {network_id: params.networkId!}});
        navigate('../access', {replace: true, relative: 'path'});
      }
    },
  });

  const buttons = (
    <div className='mt-[25px]'>
       <SimpleBtn
      className='w-[149px] h-[40px]'
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

          request('networkAccessUpdate', {
            params: {network_id: params.networkId!},
            data: {users},
          });
        }}>
        OK
      </SimpleBtn>
      <SimpleBtn className='py-[12px] px-14 ml-2 ' to="./../access" link>
        <span>Cancel</span>
      
      </SimpleBtn>
    </div>
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

export default NetworkAccessPage;
