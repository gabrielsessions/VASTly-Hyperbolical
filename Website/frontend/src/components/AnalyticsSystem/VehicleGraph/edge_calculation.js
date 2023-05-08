// Requires a sorted rows array as input by carid and timestamp
export default function edge_calculation(rows) {
  if (typeof rows !== "object") {
    return;
  }
  const edges = {};
  const times = {};
  let prev = "";
  rows.forEach(element => {
    if (prev !== "") {
      const keyName = prev + ":" + element.gatename;
      if (edges.hasOwnProperty(keyName)) {
        edges[keyName] += 1;
        times[keyName].push(element.timestamp);
      }
      else {
        edges[keyName] = 1;
        times[keyName] = [element.timestamp];
      }
    }
    prev = element.gatename;
  });

  console.log(times);

  const maxWeight = Math.max(...Object.values(edges));
  const edgesKeys = Object.keys(edges);
  const newEdges = new Array(edgesKeys.length);

  for (let i = 0; i < edgesKeys.length; i++) {
    const srcDest = edgesKeys[i].split(":");
    newEdges[i] = { id: edgesKeys[i], source: srcDest[0], target: srcDest[1], animated: true, style: { strokeWidth: edges[edgesKeys[i]]/maxWeight + 1 }, count: times[edgesKeys[i]] }
  }

  //console.log(newEdges);
  return newEdges;

}




