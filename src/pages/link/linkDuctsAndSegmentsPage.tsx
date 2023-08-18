import React, {Fragment, useState} from 'react';
import {Description, Select, TextInput} from '~/components';
import {IoChevronDown, IoChevronUp, IoTrashOutline} from 'react-icons/io5';

const LinkCablesAndSegmentsPage = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div>
      {[0].map((_, index) => {
        const Chevron = open[index] ? IoChevronUp : IoChevronDown;
        return (
          <div className="my-6 w-9/12 rounded-md bg-gis p-4" key={index}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row">
                <span className="w-14"> {index + 1}</span>
                <Description
                  label="ID:"
                  labelClassName="w-fit pr-2"
                  className="flex-grow-0 pr-14">
                  <TextInput className="w-full" />
                </Description>
                <Description
                  label="Number of Cores:"
                  labelClassName="w-fit pr-2"
                  className="flex-grow-0 pr-14">
                  <TextInput type="number" className="w-28 " />
                </Description>
              </div>
              <div className="flex flex-row items-center gap-x-12">
                <IoTrashOutline
                  size={24}
                  className="cursor-pointer  text-red-500 active:text-red-300"
                />
                <Chevron
                  size={48}
                  className="cursor-pointer active:opacity-50"
                  onClick={() => {
                    if (open[index]) {
                      setOpen({...open, [index]: false});
                    } else {
                      setOpen({...open, [index]: true});
                    }
                  }}
                />
              </div>
            </div>
            {open[index] ? (
              <Fragment>
                <div className="mt-8 flex flex-grow flex-row justify-between">
                  <div className="flex w-3/5 flex-row">
                    <span className="w-3/5 text-center">Mini Duct ID</span>
                    <span className="w-2/5 text-center">Fibres</span>
                  </div>
                  <div className="flex flex-row gap-x-12">
                    <IoTrashOutline
                      size={24}
                      className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                    />
                    <span className="w-12" />
                  </div>
                </div>
                {[0, 1].map((_, index) => (
                  <div className="flex flex-row justify-between" key={index}>
                    <div className="mt-4 flex w-3/5 flex-row">
                      <div className=" flex w-3/5 justify-center">
                        <TextInput className="w-56" type="text" />
                      </div>
                      <div className=" flex w-2/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-12">
                      <IoTrashOutline
                        size={24}
                        className="cursor-pointer  text-red-500  active:text-red-300"
                      />
                      <span className="w-12" />
                    </div>
                  </div>
                ))}

                {/*duct section */}
                <div className="flex-grow-1 mt-8 flex flex-row justify-between">
                  <div className="flex w-full flex-row">
                    <span className="w-1/5 text-center">Start (km)</span>
                    <span className="w-1/5 text-center">Length (km)</span>
                    <span className="w-1/5 text-center">Offset (km)</span>
                    <span className="w-1/5 text-center">Loss</span>
                    <span className="w-1/5 text-center">Fiber Type</span>
                  </div>
                  <div className="flex flex-row gap-x-12">
                    <IoTrashOutline
                      size={24}
                      className="cursor-pointer  text-red-500 opacity-0 active:text-red-300"
                    />
                    <span className="w-12" />
                  </div>
                </div>

                {[...new Array(index ? 1 : 4)].map((_, index) => (
                  <div
                    className="flex-grow-1 flex flex-row justify-between  pt-4"
                    key={index}>
                    <div className="flex w-full flex-row">
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <TextInput className="w-28" type="number" />
                      </div>
                      <div className=" flex w-1/5 justify-center">
                        <Select className="w-28" placeholder="select">
                          <option value="" className="hidden">
                            Select
                          </option>
                          <option value={undefined} className="hidden">
                            Select
                          </option>
                          <option value="NZ-DSF">NZ-DSF</option>
                          <option value="DSF">DSF</option>
                          <option value="SMF">SMF</option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-12">
                      <IoTrashOutline
                        size={24}
                        className="cursor-pointer  text-red-500  active:text-red-300"
                      />
                      <span className="w-12" />
                    </div>
                  </div>
                ))}
              </Fragment>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default LinkCablesAndSegmentsPage;
