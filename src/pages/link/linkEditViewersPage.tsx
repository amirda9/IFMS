import React, {useRef} from 'react';
import {SimpleBtn, Switch} from '~/components';
import {FormLayout} from '~/layout';
import {useNavigate, useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {EditViewer} from '~/container';
import {EditorRefType} from '~/container/editViewers';
import {AccessEnum} from '~/types';
import {useDispatch, useSelector} from 'react-redux';
import {setlinkviewers,setlinkviewersstatus} from './../../store/slices/networkslice'
const RegionAccessPage = () => {
  const {linkDetail} = useSelector((state: any) => state.http);
  const editor = useRef<EditorRefType>(null);
  const params = useParams<{linkId: string}>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    request,
    state: {viewers, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.linkAccessList,
      update: state.http.linkAccessUpdate,
    }),
    initialRequests: request => {
      request('linkAccessList', {params: {link_id: params.linkId!}});
      editor.current?.setAdminid(
        viewers?.data!.users.find(data => data.access == 'ADMIN')?.user.id ||
          '',
      );
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
        request('linkAccessList', {params: {link_id: params.linkId!}});
        navigate('../access', {replace: true, relative: 'path'});
      }
    },
  });

  const buttons = (
    <>
        <SimpleBtn
          disabled={update?.httpRequestStatus === 'loading'}
          onClick={() => {
            const admin = viewers!.data!.users.find(
              value => value?.access === AccessEnum.admin,
            );
            const viewerList = editor.current!.values;

            if (admin) {
              const index = viewerList.indexOf(admin.user.id);
              if (index !== -1 && index !== null) {
                viewerList.splice(index, 1);
              }
            }

            const users = viewerList.map(value => value);
            dispatch(setlinkviewers(users)) 
            dispatch(setlinkviewersstatus(true)) 
            navigate(-1)
          }}>
          OK
        </SimpleBtn>
      <SimpleBtn onClick={()=>{dispatch(setlinkviewersstatus(false)),navigate(-1) }}>
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
