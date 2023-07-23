import React from 'react';
import {Description, SimpleBtn} from '~/components';

const NetworkAccessPage = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Network Admin" className="mb-4">
          <select>
            <option>ahmad Kazemi</option>
          </select>
        </Description>
        <Description
          label="Network Viewers(s)"
          items="start"
          className="h-full">
          <div className="h-full w-3/5 rounded-md border border-black bg-white">
            <table className="max-h-full w-full [&_td]:text-center">
              <thead>
                <tr className="[&_td]:border-r [&_td]:!border-goodGray [&_td]:border-b [&_td]:bg-blueLight [&_td]:py-1">
                  <td className="w-1/12 rounded-tl-md">Index</td>
                  <td className="w-3/12">User</td>
                  <td className="w-3/12">Region</td>
                  <td className="w-3/12 rounded-tr-md !border-r-0">Station</td>
                </tr>
              </thead>
              <tbody className="">
                {[...new Array(5)].map(() => (
                  <tr
                    className="[&_td]:bg-white [&_td]:py-1 last:[&_td]:last:rounded-br-md first:[&_td]:last:rounded-bl-md"
                    key={Math.random()}>
                    <td>Index</td>
                    <td>User</td>
                    <td>Region</td>
                    <td>Station</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Description>
      </div>
      <div className="flex flex-row gap-x-2 self-end">
        <SimpleBtn>Edit Network Viewer(s)</SimpleBtn>
        <SimpleBtn>Explore</SimpleBtn>
        <SimpleBtn>History</SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default NetworkAccessPage;
