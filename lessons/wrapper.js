var writer;
var isCharVisible;
var isOutlineVisible;

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


function renderFanningStrokes(target, strokes) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    width = 75;
    height = 75;
    svg.style.width = width + 'px';
    svg.style.height = height + 'px';
    svg.style.border = '1px solid #EEE'
    svg.style.marginTop = '3px'
    svg.style.marginLeft = '3px'
    svg.style.marginRight = '3px'
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


window.onload = function() {
	var char = decodeURIComponent(window.location.hash.slice(1));
	if (char) {
		document.querySelector('.js-char').value = char;
	}

	updateCharacter();

	document.querySelector('.js-char-form').addEventListener('submit', function(evt) {
		evt.preventDefault();
        updateCharacter();
        //auto write the character for every update
        writer.animateCharacter();
	});

	document.querySelector('.js-toggle').addEventListener('click', function() {
		isCharVisible ? writer.hideCharacter() : writer.showCharacter();
		isCharVisible = !isCharVisible;
	});
	document.querySelector('.js-toggle-hint').addEventListener('click', function() {
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

    //when load the page, immediately write the character
    writer.animateCharacter();
}
