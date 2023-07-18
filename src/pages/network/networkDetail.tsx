import React from 'react';
import {Description, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';

const NetworkDetail = () => {
  const params = useParams<{networkId: string}>();
  const {
    state: {detail},
  } = useHttpRequest({
    selector: state => ({detail: state.http.networkDetail}),
    initialRequests: request => {
      request('networkDetail', {params: {networkId: params.networkId!}});
    },
  });
  return (
    <div className="flex flex-col gap-4 ">
      <Description label="Name">
        <TextInput />
      </Description>
      <Description label="Comment" items="start">
        <textarea />
      </Description>
      <Description label="Owner">Admin</Description>
      <Description label="Created">
        <TextInput />
      </Description>
      <Description label="Last Modified">
        <TextInput />
      </Description>
    </div>
  );
};

export default NetworkDetail;
