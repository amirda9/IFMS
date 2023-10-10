
import { ResponsiveLineCanvas } from "@nivo/line";
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
],
},
];

return (
<ResponsiveLineCanvas
data={data}
margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
xScale={{ type: "point", }}
xFormat="d"
yScale={{ type: "linear" }}
curve="linear"
colors={{ scheme: "category10" }}
lineWidth={3}

enablePoints={false}
pointSize={10}
pointColor={{ theme: "background" }}
pointBorderWidth={2}
pointBorderColor={{ from: "serieColor" }}
/>
);
}