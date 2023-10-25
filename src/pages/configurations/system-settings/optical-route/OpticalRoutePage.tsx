import {Description, Select, TextInput} from '~/components';
import SystemSettingsMain from '../SystemSettingsMain';
import {ReactNode} from 'react';

const wavelengths = [1310, 1490, 1550, 1625];

const iorInitialValues = [
  1.4139, 1.4142, 1.4678, 1.4679, 1.468, 1.4681, 1.4682, 1.4683, 1.4683, 1.4684,
  1.4685, 1.4686, 1.4687, 1.4687, 1.4689, -66.3,
];

const rbsInitialValues = [
  -73.7, -73.3, -79.44, -80.205, -80.48, -81.28, -81.45, -81.7, -81.87, -82,
  -82.2, -82.4, -82.58, -82.64, -82.821,
];
type Rowinputtype = {
  name: string;
  children: ReactNode;
};

const FiberTypeoptions = ['G.652', 'G.653', 'G.654', 'G.655', 'G.656', 'G.657'];
const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="mb-[6px] flex w-[700px] flex-row justify-between text-[20px] font-light leading-[24.2px] text-[#000000]">
      <span className="w-[400px] ">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// -------------------- main --------------------------- main ---------------------- main --------------------- main --------

const OpticalRoutePage = () => {
  return (
    <SystemSettingsMain>
      
      <Rowinput name="Fiber Type">
        <Select className="w-full">
          <option value="" className="hidden">
            FiberTypeoptions[0]
          </option>
          <option value={undefined} className="hidden">
            FiberTypeoptions[0]
          </option>
          {FiberTypeoptions.map((data, index) => (
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              {data}
            </option>
          ))}
        </Select>
      </Rowinput>

      <Rowinput name="Helix Factor">
        <TextInput className="w-full" type="number" defaultValue={1.01} />
      </Rowinput>

      {wavelengths.map((wl, i) => (
        <Rowinput name={`IOR for ${wl} nm wavelength`}>
          <TextInput
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
            type="number"
            defaultValue={iorInitialValues[i]}
          />
        </Rowinput>
      ))}

      {wavelengths.map((wl, i) => (
        <Rowinput name={`RBS for ${wl} nm wavelength`}>
          <TextInput
            className="w-full text-[20px] font-light leading-[24.2px] text-[#000000]"
            type="number"
            defaultValue={iorInitialValues[i]}
          />
        </Rowinput>
      ))}
    </SystemSettingsMain>
  );
};

export default OpticalRoutePage;
