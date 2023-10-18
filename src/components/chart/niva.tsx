import {useState} from 'react'
import { ResponsiveLineCanvas,ResponsiveLine } from "@nivo/line";
export default function MyResponsiveLineCanvas() {
const data = [
{
id: "سری A",
data: [
{ x: 1, y: 12 },
{ x: 2, y: 17 },
{ x: 3, y: 18 },
{ x: 4, y: 14 },
{ x: 5, y: 19 },
{ x: 6, y: 22 },
{ x: 7, y: 27 },
{ x: 8, y: 29 },
{ x: 10, y: 31 },
{ x: 11, y: 35 },
],
},
];



const [xScale, setXScale] = useState<any>({
 type: "point",
 });
 const [yScale, setYScale] = useState<any>({
  type: "linear",
 })  
 const zoom = () => {
  setXScale({
  type: "point",
  min: 2,
  // max: 4,
  });
  setYScale({
  type: "linear",
  min: 15, 
  // max: 20,
  });
  };
return (
 <div className='cursor-pointer w-full h-full'>
<ResponsiveLine

data={data}
margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
xScale={xScale}
yScale={yScale}
xFormat="d"
curve="linear"
colors={{ scheme: "category10" }}
lineWidth={3}
useMesh={false}


enablePoints={true}
pointSize={10}
pointColor={{ theme: "background" }}
pointBorderWidth={2}
pointBorderColor={{ from: "serieColor" }}
/>
<button onClick={zoom} className='absoloute z-50 top-[200px] reight-[200px]'>Zoom</button>
</div>
);
}




