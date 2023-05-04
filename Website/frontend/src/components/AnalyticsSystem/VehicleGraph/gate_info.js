
/*
general-gate 0-7
camping 0-8
gate 0-8
entrance 0-4
ranger-stop 0-7
ranger-base
*/

function genCircularPts(center, radius, numPts) {
  const arr = new Array(numPts);
  for (let i = 0; i < numPts; i++) {
    const theta = 2 * Math.PI * i / numPts;
    arr[i] = {
      x: center.x + radius * Math.cos(theta),
      y: center.y + radius * Math.sin(theta)
    }
  }
  return arr;
}

const innerCircle = genCircularPts(
  { x: 200, y: 200 }, 75, 5
);

const outerCircle = genCircularPts(
  { x: 200, y: 200 }, 350, 35
);

const gate_colors = {
  "general-gate": ["#F8B4B4", "#F98080", "#F05252"], // red 300, 400, 500
  "gate": ["#84E1BC", "#31C48D", "#0E9F6E"], // green 300, 400, 500
  "camping": ["#A4CAFE", "#76A9FA", "#3F83F8"], // blue 300, 400, 500
  "ranger-stop": ["#CABFFD", "#AC94FA", "#9061F9"], // purple 300, 400, 500
  "entrance": ["#F8B4D9", "#F17EB8", "#E74694"] // pink 300, 400, 500
}

const gate_setup = [
  { type: "general-gate", count: 8 },
  { type: "gate", count: 9 },
  { type: "camping", count: 9, xStart: 1700, yStart: 200 },
  { type: "ranger-stop", count: 8, xStart: 2600, yStart: 200 },
  { type: "entrance", count: 5, xStart: 1600, yStart: 0 }
];

const gate_info = new Array(40);
let inner_counter = 0;
let outer_counter = 0;

gate_setup.forEach(element => {
  for (let i = 0; i < element.count; i++) {
    const index = inner_counter + outer_counter;
    const gate_name = element.type + i;
    if (element.type == "entrance") {
      gate_info[index] = {
        id: gate_name,
        position: innerCircle[inner_counter],
        data: { label: i },
        style: { width: 30, height: 40, background: gate_colors[element.type][0] }
      };
      inner_counter++;
    }
    else {
      gate_info[index] = {
        id: gate_name,
        position: outerCircle[outer_counter],
        data: { label: i },
        style: { width: 30, height: 40, background: gate_colors[element.type][0] }
      };
      outer_counter++;
    }
    
  }
});
gate_info[39] = {
  id: "ranger-base",
  position: outerCircle[outerCircle.length - 1],
  data: { label: "rb" },
  style: { width: 30, height: 40, background: "#FACA15" },
};

console.log(gate_info);

export default gate_info;
