var writer;
var isCharVisible;
var isOutlineVisible;

var grid_type = "Mi"; // [ "Mi", "Tian" ] ; might support ["9x9", "Hui"] if required;

function printStrokePoints(data) {
    var pointStrs = data.drawnPath.points.map(point => `{x: ${point.x}, y: ${point.y}}`);
    console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
    document.querySelector('#target').innerHTML = '';

    var character = document.querySelector('.js-char').value;
    window.location.hash = character;
    writer = HanziWriter.create('target', character, {
        width: 400,
        height: 400,
        renderer: 'canvas',
        radicalColor: '#166E16',
        onCorrectStroke: printStrokePoints,
        onMistake: printStrokePoints,
    });
    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;
    RenderStoke(character);
}

function addMiGrid(svg, width, height)
{
    var newLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine1.setAttribute('id', 'line1');
    newLine1.setAttribute('x1', '0');
    newLine1.setAttribute('y1', '0');
    newLine1.setAttribute('x2', width);
    newLine1.setAttribute('y2', height);
    newLine1.setAttribute("stroke-dasharray", "3,3");
    newLine1.setAttribute("stroke", "#DDD")
    svg.append(newLine1);

    var newLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine2.setAttribute('id', 'line2');
    newLine2.setAttribute('x1', width);
    newLine2.setAttribute('y1', '0');
    newLine2.setAttribute('x2', '0');
    newLine2.setAttribute('y2', height);
    newLine2.setAttribute("stroke-dasharray", "3,3");
    newLine2.setAttribute("stroke", "#DDD")
    svg.append(newLine2);

    var newLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine3.setAttribute('id', 'line3');
    newLine3.setAttribute('x1', width/2);
    newLine3.setAttribute('y1', '0');
    newLine3.setAttribute('x2', width/2);
    newLine3.setAttribute('y2', height);
    newLine3.setAttribute("stroke", "#DDD");
    newLine3.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine3);

    var newLine4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine4.setAttribute('id', 'line4');
    newLine4.setAttribute('x1', '0');
    newLine4.setAttribute('y1', height/2);
    newLine4.setAttribute('x2', width);
    newLine4.setAttribute('y2', height/2);
    newLine4.setAttribute("stroke-dasharray", "3,3");
    newLine4.setAttribute("stroke", "#DDD")
    svg.append(newLine4);
}

function addTianGrid(svg, width, height) {
    var newLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine3.setAttribute('id', 'line3');
    newLine3.setAttribute('x1', width / 2);
    newLine3.setAttribute('y1', '0');
    newLine3.setAttribute('x2', width / 2);
    newLine3.setAttribute('y2', height);
    newLine3.setAttribute("stroke", "#DDD");
    newLine3.setAttribute("stroke-dasharray", "3,3");
    svg.append(newLine3);

    var newLine4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine4.setAttribute('id', 'line4');
    newLine4.setAttribute('x1', '0');
    newLine4.setAttribute('y1', height / 2);
    newLine4.setAttribute('x2', width);
    newLine4.setAttribute('y2', height / 2);
    newLine4.setAttribute("stroke-dasharray", "3,3");
    newLine4.setAttribute("stroke", "#DDD")
    svg.append(newLine4);
}

function addGrid(svg, width, height)
{
    switch (grid_type)
    {
        case "Mi":
            addMiGrid(svg, width, height);
            break;
        case "Tian":
            addTianGrid(svg, width, height);
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
    addGrid(svg, width, height);

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


window.onload = function () {
    var char = decodeURIComponent(window.location.hash.slice(1));
    if (char) {
        document.querySelector('.js-char').value = char;
    }

    updateCharacter();

    document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
        evt.preventDefault();
        updateCharacter();
        //auto write the character for every update
        writer.animateCharacter();
    });

    document.querySelector('.js-toggle').addEventListener('click', function () {
        isCharVisible ? writer.hideCharacter() : writer.showCharacter();
        isCharVisible = !isCharVisible;
    });
    document.querySelector('.js-toggle-hint').addEventListener('click', function () {
        isOutlineVisible ? writer.hideOutline() : writer.showOutline();
        isOutlineVisible = !isOutlineVisible;
    });
    document.querySelector('.js-animate').addEventListener('click', function () {
        event.preventDefault()
        writer.animateCharacter();
    });
    document.querySelector('.js-quiz').addEventListener('click', function () {
        event.preventDefault()
        writer.quiz({
            showOutline: true
        });
    });

    //add Handler to control the grid type;
    grid_type = 'Mi';

    //when load the page, immediately write the character
    writer.animateCharacter();
}
