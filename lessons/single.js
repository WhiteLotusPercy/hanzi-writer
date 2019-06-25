
var writer;
var isCharVisible;
var isOutlineVisible;

var grid_type = "Mi"; // [ "Mi", "Tian" ] ; might support ["9x9", "Hui"] if required;

function updateCharacter() {
    document.querySelector('#target').innerHTML = '';

    var character = document.querySelector('.js-char').value;
    window.location.hash = character;
    writer = HanziWriter.create('target', character, {
        width: 400,
        height: 400,
        /* i don't know how to add grid for canvs, so use svg*/
        //renderer: 'canvas',
        radicalColor: '#166E16',
        onCorrectStroke: printStrokePoints,
        onMistake: printStrokePoints,
    });
    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;

    var target = document.getElementById('target');
    width = 400;
    height = 400;
    addGrid(target, width, height, 2.5);

    RenderStoke(character);
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
    //grid_type = get value from select control;

    //when load the page, immediately write the character
    writer.animateCharacter();
}
