var writer;
var isCharVisible;
var isOutlineVisible;

var grid_type = "Mi"; // [ "Mi", "Tian" ] ; might support ["9x9", "Hui"] if required;
var num_of_chars_per_row = 10;
var size = 75;

/**
 * a simple hash function:
 * https: //stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/22429679
 */
String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


function updateSheet() {
    document.querySelector('#target-sheet').innerHTML = '';

    var characters = document.querySelector('.js-char').value;
    window.location.hash = characters;

    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;

    RenderSheet(characters);
}

function renderFanningStrokesEx(target, strokes, upto, size = 75, mode = 'default') {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    width = size;
    height = size;
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

    if (upto == 0) {
        strokes.forEach(function (strokePath, idx, array) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', strokePath);
            // style the character paths
            path.style.fill = '#555';
            group.appendChild(path);
        });
        return;
    }

    //write once in light color
    strokes.forEach(function (strokePath, idx, array) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#efefef';
        group.appendChild(path);
    });

    if (upto < 0) {
        return;
    }

    strokes.forEach(function (strokePath, idx, array) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#aaa';

        if (idx >= upto) {
            return;
        } else if (idx === array.length - 1) {
            path.style.fill = '#bbb';
        }
        group.appendChild(path);
    });
}

function RenderRowCore(character, charData) {

    //get the target-row by the hash-id
    id = character.hashCode();
    target = document.getElementById(id);

    var length = charData.strokes.length;
    var strokesPortion = charData.strokes.slice(0, length);
    renderFanningStrokesEx(target, strokesPortion, 0, size);

    length = Math.min(charData.strokes.length, num_of_chars_per_row - 1);
    strokesPortion = charData.strokes.slice(0, length);
    for (var i = 0; i < length; i++) {
        renderFanningStrokesEx(target, strokesPortion, i + 1, size);
    }

    /**
     * show the remanining stroke in lighter color
     */
    for (var i = length; i < num_of_chars_per_row - 1; i++) {
        renderFanningStrokesEx(target, strokesPortion, -1, size);
    }
}

function RenderRow(character) {
    //pass the character to the Core function
    HanziWriter.loadCharacterData(character).then(function (charData) {
        RenderRowCore(character, charData);
    });
}

/**
 * render the stroke according to example in https://chanind.github.io/hanzi-writer/docs.html
 */
function RenderSheet(characters) {

    target = document.getElementById('target-sheet');

    //loop over the chars array;
    var charsArray = characters.split('');
    rows = [];
    for (n = 0; n < charsArray.length; n++) {
        character = charsArray[n];

        //current new
        newrow = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        id = character.hashCode();
        newrow.setAttribute("id", id);

        /*
        txtnode = document.createTextNode(character);
        newrow.appendChild(txtnode);
        */
        target.appendChild(newrow);

        RenderRow(character);
    }
}

window.onload = function () {
    var char = decodeURIComponent(window.location.hash.slice(1));
    if (char) {
        document.querySelector('.js-char').value = char;
    }

    updateSheet();

    document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
        evt.preventDefault();
        updateSheet();
    });

    //add Handler to control the grid type;
    //grid_type = get value from select control;

}
