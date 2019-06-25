var writer;
var isCharVisible;
var isOutlineVisible;

var grid_type = "Mi"; // [ "Mi", "Tian" ] ; might support ["9x9", "Hui"] if required;


var size = 75;

function updateSheet() {
    document.querySelector('#target-sheet').innerHTML = '';

    var characters = document.querySelector('.js-char').value;
    window.location.hash = characters;

    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;

    //characters = '星';
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

    if (upto == 0)
    {
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

var num_of_chars_per_row = 10;

/**
 * render the stroke according to example in https://chanind.github.io/hanzi-writer/docs.html
 */
function RenderSheet(characters) {
    document.querySelector('#target-sheet').innerHTML = '';

    //loop over the chars array;
    character = '仁';
    var charsArray = characters.split('');

    for (n = 0; n < charsArray.length; n++)
    {
        character = charsArray[n];

        /**
         * show the remanining stroke in lighter color
         */
        HanziWriter.loadCharacterData(character).then(function (charData) {
            var target = document.getElementById('target-sheet');

            var length = charData.strokes.length;
            var strokesPortion = charData.strokes.slice(0, length);
            renderFanningStrokesEx(target, strokesPortion, 0, size);

            length = Math.min(charData.strokes.length, num_of_chars_per_row - 1);
            strokesPortion = charData.strokes.slice(0, length);
            for (var i = 0; i < length; i++) {
                renderFanningStrokesEx(target, strokesPortion, i + 1, size);
            }

            for (var i = length; i < num_of_chars_per_row - 1; i++) {
                renderFanningStrokesEx(target, strokesPortion, -1, size);
            }
        });
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
