import L from 'leaflet';
import icon from '~/assets/icons/noRed.png';
const NoRed = new L.Icon({
  iconUrl: icon,
  iconRetinaUrl: icon,
  iconSize: new L.Point(30, 30),
  className: 'rounded-[15px] border-[#e0ee0ff]',
});

export default NoRed;