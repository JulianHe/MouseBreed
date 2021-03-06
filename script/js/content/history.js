$(document).ready(function () {
    getData();
    $("#selectedMice").click(function(){
        selectedMiceclick();
    });
});

// Baum
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select(self.frameElement).style("height", "800px");

var mice = [];
var treeData;

function getData(){
    // Auslesen alle Mäuse aus dem localStorage
    var data = loadedBreed;
    var thisCage = data.cages;
    for (var cages in thisCage) {
        var cage_id = thisCage[cages].id;
        var thisMice = thisCage[cage_id].mice;
        for (var key in thisMice) {
            var tmp = thisMice[key];
            addDatatoList(cage_id,tmp);
            mice.push(tmp);
        }
    }
}

function addDatatoList(cageid,mouse){
  var elem = $("#micelist");
    elem.append($('<option>', {
        value: mouse.id,
        text: mouse.name+' (Käfig: '+cageid+' / ID: #'+mouse.id+')'
    }));
}

function selectedMiceclick(){
    var selectedElementValue = $("#micelist").val();
    treeData = findParents(selectedElementValue);
    if (treeData.children != null){
        loadData(JSON.stringify(treeData));
    } else{
        addBen("Historie","Es konnten keine Eltern gefunden werden","error");
    }
}

function findParents(mouse_id){
    var index = -1;
    // Find Index of Mouse in Array
    for (i = 0; i < mice.length; i++) {
        if (mice[i].id == mouse_id){
           index = i;
        }
    }
    var thisMice = mice[index];

    // Naming the Node
    var node = {};
    node.name = thisMice.name+"["+thisMice.id+","+thisMice.genotyp+"]";

    // Finding Mice Parents
    var childs = [];
    for (var m in mice) {
        if (thisMice.father_id == mice[m].id){ // && mice[index].father_id != 0
            childs.push(findParents(mice[m].id));
        }
        if (thisMice.mother_id == mice[m].id){ // && mice[index].mother_id != 0
            childs.push(findParents(mice[m].id));
        }
    }

    // If no Parents
    if (childs < 2){
        node.size = Math.floor(Math.random()*1000000);
    } else {
        node.children = childs;
    }
    return node;
}

function loadData(source){
    // TODO Seite muss neugeladen weren um Infos neu anzuzeigen

    root = JSON.parse(source);
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    root.children.forEach(collapse);
    console.log(root);
    update(root);
}

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}
