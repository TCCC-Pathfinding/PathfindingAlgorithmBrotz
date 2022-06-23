import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {Feature, Map, View} from 'ol';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';

/**
 * Tech Connect Project # 1
 * Restaurant Map Pathfinding
 */

//Vector Source containing features on map
const source = new VectorSource();

// Basic client to host JSON data
const client = new XMLHttpRequest();

/**
 * IMPORTANT! SET THIS TO YOUR LOCATION
 */
 const city = "buffalo" //Choose "buffalo" or "wilmington" based on your location

 /**
  * IMPORTANT! SET THIS TO YOUR LOCATION
  * Make sure you only have one dataset or the other, not both
  */
 client.open('GET', './data/buffalo_graph.json');
//  client.open('GET', './data/wilmington_graph.json');

// Creates features from JSON data
client.onload = function () {
    const json = JSON.parse(client.responseText);
    const nodeFeatures = []
    const restaurantFeatures = []
    const nodes = json["nodes"];
    const edges = json["edges"];

    for (let location of json["nodes"]){
      let coords = [location["lon"],location["lat"]]
      let feature = new Feature({
        geometry: new Point(fromLonLat(coords)),
      })
      // Checks if the ID doesn't contain any letters.
      if(!(/[a-zA-Z]/.test(location["id"]))){
        // Styling configuration 
        const style = new Style({
          image: new CircleStyle({
            radius: 1.5,
            fill: new Fill({
              color: '#0084ff',
            }),
            stroke: new Stroke({
              color: 'black',
              width: 1,
            }),
          })
        });

        feature.setStyle(style)
        nodeFeatures.push(feature)
      } else{
          // Styling configuration with text
          const style = new Style({
            image: new CircleStyle({
              radius: 3,
              fill: new Fill({
                color: '#FF10F0',
              }),
              stroke: new Stroke({
                color: 'black',
                width: 1,
              }),
            }),
            text: new Text({
              font: '12px Calibri,sans-serif',
              text: location["id"],
              textBaseline: 'bottom',
              fill: new Fill({
                color: 'rgba(0,0,0,1)'
              }),
              stroke: new Stroke({
                color: 'rgba(255,255,255,1)',
                width: 3
              })
            })
          });
  
          feature.setStyle(style)
          restaurantFeatures.push(feature)
      }
    }
    // Add the node features to the Vector Source (You may choose to render this or not)
    source.addFeatures(nodeFeatures);
    // Add the restaurant features to Vector Source
    source.addFeatures(restaurantFeatures)

    /**
     * TODO: Implement findShortestPath function to find the shortest path between the restaurants in list of coordinates
     */
    let shortestPath = findShortestPath(nodes, edges)
    // Renders the route based on an array of coordinates e.g. [[lon, lat],[lon, lat]]
    renderRoutes(shortestPath)

  };
  client.send();

/**
 * @param nodes: Array of objects containing coordinate of street with ID, latitude and longitude
 * @param edges: Array of objects showing how each point should connect together
 * @returns Array of coordinates of route e.g. [[lon, lat],[lon, lat]]
 */
function findShortestPath(nodes, edges){
  // TODO: IMPLEMENT ME
    var startNode = ["Pearl Street Grill & Brewery", 42.8810807, -78.8774103];
    currentNode = startNode;
    var unvisitedNodes = nodes;
    var route = [];
    var connectedNodesCollection = [];
    var backtrack = false;
    while (unvisitedNodes != []){
        // set current and previous nodes, and travel shortest available route
        var previousNode = currentNode
        //updates new set of routes when a new node is reached
        if(backtrack == false){
            var connectedEdges = getNodeEdges(unvisitedNodes, currentNode, edges);
            connectedNodesCollection.append(connectedEdges);
        }
        closestNode = connectedEdges[0][1];
        route.append[getLatAndLong(closestNode)];
        unvisitedNodes = removeNode(closestNode, unvisitedNodes);
        currentNode = closestNode;
        // check if all places were visited
        if(unvisitedNodes == []){
            return route;
        // check if it is still possible to travel to all destinations
        else if(connectedEdges == [] && currentNode[1] == startNode[1] && currentNode[2] == startNode[2]){
            window.alert("No possible path between all destinations");
            return [];
        // check for any "dead ends" where not all places were visited
        } else if(connectedEdges == []){
            //undoes the route travelled and checks a different route at the previous node
            unvisitedNodes.append(currentNode);
            connectedNodesCollection.pop();
            route.pop();
            currentNode = previousNode;
            var connectedEdges = connectedNodesCollection[connectedNodesCollection.length - 1];
            connectedNodesCollection = removeEdgeFromCollection(connectedNodesCollection);
            backtrack = true;
        } else {
            backtrack = false;
        }
    }
}

// used to help remove visited nodes from unvisitedNodes array
function removeNode(node, nodes){
    var index = getNodeIndex(nodes, node[0]);
    nodes.splice(index, 1);
    return nodes;
}

// removes an edge from the array of arrays of edges connected to nodes for a particular route
function removeEdgeFromCollection(edgeCollections){
    edgeCollections[edgeCollections.length - 1].shift();;
    return edgeCollections;
}

// gets node in an array of nodes
function getNode(nodes, placeName){
    for(var i = 0; i < nodes.length; i++){
        if(nodes[i][0] == placeName){
            return nodes[i];
        }
    }
    return [];
}

// gets edge in an array of edges
function getEdge(edges, placeName){
    for(var i = 0; i < edges.length; i++){
        if(edges[i][1] == placeName){
           return edges[i];
        }
    }
    return [];
}

// gets index of a node in an array of nodes
function getNodeIndex(nodes, placeName){
    for(var i = 0; i < nodes.length; i++){
        if(nodes[i][0] == placeName){
            return i;
        }
    }
    return -1;
}

// gets [long, lat] of node
function getLatAndLong(node){
    return [node[2], node[1]];
}

// gets edges connected to a node
function getNodeEdges(nodes, node, edges){
    var connectedEdges = [];
    for(var i = 0; i < edges.length; i++){
        if(edges[i][0][1] == node[1] && edges[i][0][2] == node[2]){
            connectedEdges.append(edges[i]);
        }
        if(edges[i][1][2] == node[1] && edges[i][1][2] == node[2]){
            connectedEdges.append(edges[i]);
        }
    }
    connectedEdges = sortConnectedEdges(connectedEdges);
    return connectedEdges;
}

// sorted connectedEdges array from shortest to longest distance
function sortConnectedEdges(nodes, edges){
    for(int i = 0; i < edges.length; i++){
        for(int j = i + 1; j < edges.length; j++){
            if(getDistance(nodes, edges[i]) > getDistance(nodes, edges[j])){
                temp = edges[i];
                edges[i] = edges[j];
                edges[j] = temp;
            }
        }
    }
    return edges;
}

// gets distance between two nodes on an edge
function getDistance(nodes, edge){
    //MODIFY TO WORK WITH NODES AND STRING LOCATIONS
    var node1 = getNodeIndex(nodes, edge[0]);
    var node2 = getNodeIndex(nodes, edge[1]);
    return sqrt((nodes[node1][1] - nodes[node2][1])**2 + (nodes[node1][2] - nodes[node2][2])**2);
}

// Layer containing the points rendered on top of the map
const vectorLayer = new VectorLayer({
  source: source,
});

// Layer with the actual map
const osmLayer = new TileLayer({
  source: new OSM(),
})

// View Object
let view
switch(city.toLowerCase()){
  case "buffalo":
    view = new View({
      center: fromLonLat([-78.8759022, 42.8926101]),
      zoom: 15,
    })
    break;
  case "wilmington":
    view = new View({
      center: fromLonLat([-75.549883, 39.749889]),
      zoom: 15,
    })
    break;
  default:
    view = new View({
      center: fromLonLat([0,0]),
      zoom: 1,
    })   
}

// Map Object
const map = new Map({
  target: 'map-container',
  layers: [ osmLayer, vectorLayer],
  view: view
});

// To allow the map to refresh itself
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();

// Renders routes between a list of coordinates in order
async function renderRoutes(pointsList){
  let line = new LineString(pointsList).transform('EPSG:4326', 'EPSG:3857')
  var feature = new Feature(line);
  let routeStyle = new Style({
      stroke: new Stroke({
      width: 3, 
      color: [10, 10, 10, 0.7]
      })
  })

  feature.setStyle(routeStyle);
  source.addFeature(feature)
