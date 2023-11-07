import {Description, Select, TextInput} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';
import {ReactNode, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';

type Rowinputtype = {
  name: string;
  children: ReactNode;
};

const FiberTypeoptions = ['G.652', 'G.653', 'G.654', 'G.655', 'G.656', 'G.657'];
const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="mb-[6px] flex w-[700px] flex-row justify-between text-[20px] font-light leading-[24.2px] text-[#000000]">
      <span className="w-[400px] ">{name}</span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// -------------------- main --------------------------- main ---------------------- main --------------------- main --------

const OpticalRoutePage = () => {
  const [errortext, setErrortext] = useState('');
  const {
    request,
    state: {SettingsGet},
  } = useHttpRequest({
    selector: state => ({
      SettingsGet: state.http.SettingsGet,
    }),
    initialRequests: request => {
      request('SettingsGet', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.SettingsGet?.httpRequestStatus === 'loading' &&
        state.SettingsGet?.httpRequestStatus === 'success'
      ) {
        request('SettingsGet', undefined);
      }
    },
  });
  const [helixfactor, setHelixfactor] = useState(
    SettingsGet?.data?.optical_route?.helix_factor || 0,
  );
  const [ior, setIor] = useState<{
    1310: number;
    1490: number;
    1550: number;
    1625: number;
  }>(
    SettingsGet?.data?.optical_route?.wavelengths?.IOR || {
      1310: 0,
      1490: 0,
      1550: 0,
      1625: 0,
    },
  );
  const [rbs, setRbs] = useState<{
    1310: number;
    1490: number;
    1550: number;
    1625: number;
  }>(
    SettingsGet?.data?.optical_route?.wavelengths?.RBS || {
      1310: 0,
      1490: 0,
      1550: 0,
      1625: 0,
    },
  );
  const [fiberType, setFiberType] = useState(
    SettingsGet?.data?.optical_route?.fiber_type || 'G.656',
  );

  const onSaveButtonClick = () => {
    if (
      !helixfactor ||
      !ior[1310] ||
      !ior[1490] ||
      !ior[1550] ||
      !ior[1625] ||
      !rbs[1310] ||
      !rbs[1490] ||
      !rbs[1550] ||
      !rbs[1625]
    ) {
      setErrortext('لطفا همه ی فیلد ها را پر کنید');
    } else {
      setErrortext('');
      request('SettingsUpdateopticalroute', {
        data: {
          optical_route: {
            fiber_type: fiberType,
            helix_factor: helixfactor,
            wavelengths: {
              IOR: ior,
              RBS: rbs,
            },
          },
        },
      });
    }
  };

  const onResetButtonClick = () => {
    setHelixfactor(1.02);
    setFiberType('G.656');
    setIor({1310: 1.4678, 1490: 1.4679, 1550: 1.468, 1625: 1.4681});
    setRbs({1310: -79.01, 1490: -79.02, 1550: -79.03, 1625: -79.04});
  };
  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}>
      <Rowinput name="Fiber Type">
        <Select onChange={e => setFiberType(e.target.value)} className="w-full">
          <option value="" className="hidden">
            {fiberType}
          </option>
          <option value={undefined} className="hidden">
            {fiberType}
          </option>
          {FiberTypeoptions.map((data, index) => (
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              {data}
            </option>
          ))}
        </Select>
      </Rowinput>

      <Rowinput name="Helix Factor">
        <TextInput
          value={helixfactor}
          onChange={e => setHelixfactor(Number(e.target.value))}
          className="w-full"
          type="number"
          defaultValue={SettingsGet?.data?.optical_route?.helix_factor || 1.01}
        />
      </Rowinput>

      <Rowinput name={`IOR for 1310 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...ior};
            old[1310] = Number(e.target.value);
            setIor(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={ior[1310]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.IOR?.[1310]
          }
        />
      </Rowinput>
      <Rowinput name={`IOR for 1490 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...ior};
            old[1490] = Number(e.target.value);
            setIor(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={ior[1490]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.IOR?.[1490]
          }
        />
      </Rowinput>

      <Rowinput name={`IOR for 1550 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...ior};
            old[1550] = Number(e.target.value);
            setIor(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={ior[1550]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.IOR?.[1550]
          }
        />
      </Rowinput>

      <Rowinput name={`IOR for 1625 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...ior};
            old[1625] = Number(e.target.value);
            setIor(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={ior[1625]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.IOR?.[1625]
          }
        />
      </Rowinput>

      <Rowinput name={`RBS for 1310 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...rbs};
            old[1310] = Number(e.target.value);
            setRbs(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={rbs[1310]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.RBS?.[1310]
          }
        />
      </Rowinput>

      <Rowinput name={`RBS for 1490 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...rbs};
            old[1490] = Number(e.target.value);
            setRbs(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={rbs[1490]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.RBS?.[1490]
          }
        />
      </Rowinput>

      <Rowinput name={`RBS for 1550 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...rbs};
            old[1550] = Number(e.target.value);
            setRbs(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={rbs[1550]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.RBS?.[1550]
          }
        />
      </Rowinput>
      <Rowinput name={`RBS for 1625 nm wavelength`}>
        <TextInput
          onChange={e => {
            const old = {...rbs};
            old[1625] = Number(e.target.value);
            setRbs(old);
          }}
          className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
          type="number"
          value={rbs[1625]}
          defaultValue={
            SettingsGet?.data?.optical_route?.wavelengths?.RBS?.[1625]
          }
        />
      </Rowinput>
      {errortext.length > 0 ? (
        <span className="text-[20px] text-[red]">{errortext}</span>
      ) : null}
    </SystemSettingsMain>
  );
};

export default OpticalRoutePage;
