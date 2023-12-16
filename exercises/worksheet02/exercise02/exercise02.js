var points = [];
var colors = [];

var colours = [
    vec3(0.3921, 0.5843, 0.9294),   //light blue
    vec3(1.0, 1.0, 1.0),            //white
    vec3(0.0, 0.0, 0.0),            //black
    vec3(0.0, 1.0, 0.61),           //cyan
    vec3(0.64, 0.18, 0.79),         //magenta
    vec3(0.78, 0.61, 0.42),         //brown
];

window.onload = function init(){
    // setup canvas
    canvas = document.getElementById("myCanvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("WebGL not available");}

    // get HTML elements
    var clearMenu = document.getElementById("clearMenu");
    var clearButton = document.getElementById("clearButton");

    // blue background
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load shader
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // clear the canvas
    clearButton.addEventListener("click", function(event) {
        var bgcolor = colours[clearMenu.selectedIndex];
        gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3],bgcolor[4],bgcolor[5]);

        // clear canvas of points (and clear color array)
        points = [];
        colors = [];
        rendering();
    });

    // cursor pos
    var cursorPos = vec2(0.0, 0.0);

    // event listener
    canvas.addEventListener("click", function (ev) {
        var bounds = ev.target.getBoundingClientRect();
        var vec2x = (event.clientX - bounds.left);
        var vec2y = (canvas.height - event.clientY + bounds.top - 1);
        cursorPos = vec2(2*(vec2x)/canvas.width - 1, 2*(vec2y)/canvas.height - 1);

        // colors
        console.log(cursorPos);
        colors.push(colours[colorMenu.selectedIndex]); // black
        points.push(cursorPos);

        // color buffer setup
        var colourBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

        // vertex color setup
        var myColor = gl.getAttribLocation( program, "myColor" );
        gl.vertexAttribPointer( myColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( myColor );

        // vertex buffer setup
        var vectorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        // vertex position setup
        var myPos = gl.getAttribLocation( program, "myPos" );
        gl.vertexAttribPointer( myPos, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( myPos );

        // render each time a new mouseclick-event happens
        rendering();
    });

    // initial render for a blank canvas
    rendering();
}

function rendering() {
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, points.length );
    // LINE_LOOP, LINES, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
}
