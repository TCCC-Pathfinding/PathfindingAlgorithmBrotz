## Pathfinding Algorithm

Name: Riley Brotz

###Travelling Routes

The findShortestPath(nodes, edges) method was made to create an array of copies of all the nodes to represent unvisited
nodes, to ensure no destinations were revisited on this path.  Another array was made to contain the edges (paths) that
are connected to the current node the person is at and hasn't been visited on the path yet.  The path is selected based
on the shortest route of the array of connected edges.  This is done in a while loop that continues until all nodes
(locations) have been visited.

###Backtracking

Due to the possibility of hitting a dead end where not all places can be visited on a certain route, backtracking was
added.  The algorithm checks for if there are any edges connected to the node leading to unvisited nodes.  If there are,
the program continues adding more nodes to form a route.  If not, the method checks if there are any nodes that have
not been visited.  If not, the program will set the current node to the previous node, remove the most recent addition
to the collection of connected nodes, and remove the edge of the shortest distance from the array element storing the
connected edges to ensure the program checks the next shortest route.  If all routes are tried and no route between all
restaurants can be found, a pop-up message wil appear saying there is no route.

###Helper Methods

The method was broken up into several helper methods.  One was used to sort an array of connected edges from shortest to
longest to make getting the shortest route easier.  Some others removed nodes and edges their respective arrays.  One got
the distance between two nodes.  Another few retrieved a specific node, edge, or index of one of those.

###Extra Features

I have designed the home page in the color green so it feels less generic than a white background.  I also added a title
and description to make the purpose of this page clear.  I also attached a link to a page displaying a form to buy a
DLC Pack for a Wilmington Pathfinder.  The path finder for Wilmington and purchase option don't exist as it was made to
appear like a purchase page.