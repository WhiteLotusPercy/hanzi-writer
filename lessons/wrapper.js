
function printStrokePoints(data) {
    var pointStrs = data.drawnPath.points.map(point => `{x: ${point.x}, y: ${point.y}}`);
    console.log(`[${pointStrs.join(', ')}]`);
}


function addMiGrid(svg, width, height, thickness=2)
{
    var newLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine1.setAttribute('id', 'line1');
    newLine1.setAttribute('x1', '0');
    newLine1.setAttribute('y1', '0');
    newLine1.setAttribute('x2', width);
    newLine1.setAttribute('y2', height);
    newLine1.setAttribute("stroke", "#DDD");
    newLine1.setAttribute("stroke-width", thickness);
    newLine1.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine1);

    var newLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine2.setAttribute('id', 'line2');
    newLine2.setAttribute('x1', width);
    newLine2.setAttribute('y1', '0');
    newLine2.setAttribute('x2', '0');
    newLine2.setAttribute('y2', height);
    newLine2.setAttribute("stroke", "#DDD");
    newLine2.setAttribute("stroke-width", thickness );
    newLine2.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine2);

    var newLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine3.setAttribute('id', 'line3');
    newLine3.setAttribute('x1', width/2);
    newLine3.setAttribute('y1', '0');
    newLine3.setAttribute('x2', width/2);
    newLine3.setAttribute('y2', height);
    newLine3.setAttribute("stroke", "#DDD");
    newLine3.setAttribute("stroke-width", thickness);
    newLine3.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine3);

    var newLine4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine4.setAttribute('id', 'line4');
    newLine4.setAttribute('x1', '0');
    newLine4.setAttribute('y1', height/2);
    newLine4.setAttribute('x2', width);
    newLine4.setAttribute('y2', height/2);
    newLine4.setAttribute("stroke", "#DDD");
    newLine4.setAttribute("stroke-width", thickness);
    newLine4.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine4);
}

function addTianGrid(svg, width, height, thickness) {
    var newLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine3.setAttribute('id', 'line3');
    newLine3.setAttribute('x1', width / 2);
    newLine3.setAttribute('y1', '0');
    newLine3.setAttribute('x2', width / 2);
    newLine3.setAttribute('y2', height);
    newLine3.setAttribute("stroke", "#DDD");
    newLine3.setAttribute("stroke-width", thickness);
    newLine3.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine3);

    var newLine4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine4.setAttribute('id', 'line4');
    newLine4.setAttribute('x1', '0');
    newLine4.setAttribute('y1', height / 2);
    newLine4.setAttribute('x2', width);
    newLine4.setAttribute('y2', height / 2);
    newLine4.setAttribute("stroke", "#DDD");
    newLine4.setAttribute("stroke-width", thickness);
    newLine4.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine4);
}

function addGrid(svg, width, height, thickness)
{
    switch (grid_type)
    {
        case "Mi":
            addMiGrid(svg, width, height, thickness);
            break;
        case "Tian":
            addTianGrid(svg, width, height, thickness);
            break;
        default:
            //blank;
    }
}


function renderFanningStrokes(target, strokes) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    width = 75;
    height = 75;
    margin = 4;
    svg.style.width = width + 'px';
    svg.style.height = height + 'px';
    svg.style.border = '1px solid #EEE'
    svg.style.marginTop = margin + 'px'
    svg.style.marginLeft = margin + 'px'
    svg.style.marginRight = '0px'
     svg.style.marginBottom = '0px'

    //add grid - method one:
    //svg.setAttribute('class', 'small');

    //add grid - method two: render via svg
    addGrid(svg, width, height, 1);

    target.appendChild(svg);
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // set the transform property on the g element so the character renders at width x height (suggested 75x75)
    var transformData = HanziWriter.getScalingTransform(width, height);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);

    strokes.forEach(function (strokePath, idx, array) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#555';
        if (idx === array.length - 1) {
            path.style.fill = '#777';
        }
        group.appendChild(path);
    });
}


/**
 * render the stroke according to example in https://chanind.github.io/hanzi-writer/docs.html
 */
function RenderStoke(character) {
    document.querySelector('#target-stroke').innerHTML = '';
    HanziWriter.loadCharacterData(character).then(function (charData) {
        var target = document.getElementById('target-stroke');
        for (var i = 0; i < charData.strokes.length; i++) {
            var strokesPortion = charData.strokes.slice(0, i + 1);
            renderFanningStrokes(target, strokesPortion);
        }
    });
}
