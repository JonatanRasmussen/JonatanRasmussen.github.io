

var t = [];
var t_1 = [];
var t_2 = [];
var t_3 = [];
var triangle_limit = 5000;
var vertex_limit = 3 * triangle_limit;
var indexCount = 0;

var pointMode = false;
var firstPoint = true;
var secondPoint = false;
var thirdPoint = false;

var points = [];
var triangles = [];
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
    var addPoints = document.getElementById("addPoints");
    var addTriangles = document.getElementById("addTriangles");
    var clearMenu = document.getElementById("clearMenu");
    var clearButton = document.getElementById("clearButton");

    // blue background
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load shader
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // buffers
    var colourBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, sizeof['vec3']*vertex_limit, gl.STATIC_DRAW );
    var myColor = gl.getAttribLocation( program, "myColor" );
    gl.vertexAttribPointer( myColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );
    var vectorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertex_limit, gl.STATIC_DRAW );

    // triangle-mode enabled
    addTriangles.addEventListener("click", function(event){
        console.log("Triangle button clicked");
        pointMode = false;
    });

    // points-mode enabled
    addPoints.addEventListener("click", function(event){
        console.log("Points button clicked");
        pointMode = true;
    });

    // vertex position setup
    var myPos = gl.getAttribLocation( program, "myPos" );
    gl.vertexAttribPointer( myPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPos );

    // reset
    clearButton.addEventListener("click", function(event) {
        var bgcolor = colours[clearMenu.selectedIndex];
        gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3],bgcolor[4],bgcolor[5]);

        triangles = [];         // defaults
        points = [];
        colors = [];
        pointMode = false;
        firstPoint = true;
        secondPoint = false;
        thirdPoint = false;
        indexCount = 0;
        rendering();
    });

    // eventlisten
    canvas.addEventListener("click", function (ev) {
        var bounds = ev.target.getBoundingClientRect();
        var vec2x = (event.clientX - bounds.left);
        var vec2y = (canvas.height - event.clientY + bounds.top - 1);
        var cursorPos = vec2(2*(vec2x)/canvas.width - 1, 2*(vec2y)/canvas.height - 1);

        if (pointMode) {
        console.log("[point mode] point added at mousepos: " + cursorPos + ", at vBuffer-index: " + indexCount);

        t = vec3(colours[colorMenu.selectedIndex]);
        gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));
        gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );


        points.push(indexCount);
        t_1 = cursorPos;
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_1));
        indexCount++;

        } else {
        console.log(cursorPos);

        if(firstPoint){
            console.log("[triangle mode] first point added at mousepos: " + cursorPos + ", at vBuffer-index: " + indexCount);

        //  colors.push(index);
            t = vec3(colours[colorMenu.selectedIndex]);
            gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));
            gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );


            points.push(indexCount);
            t_1 = vec2(cursorPos);
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_1));
            indexCount++;

            firstPoint = false;
            secondPoint = true;

        } else if (secondPoint){
            console.log("[triangle mode] second point added at mousepos: " + cursorPos + ", at vBuffer-index: " + indexCount);


            colors.push(indexCount);
            t = vec3(colours[colorMenu.selectedIndex]);
            gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));
            gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );

            points.push(indexCount);
            t_2 = vec2(cursorPos);
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_2));
            indexCount++;

            secondPoint = false;
            thirdPoint = true;

        } else{
            // removes latest two points from point-array
            //  console.log("points size before pop: " + points.length);


            t = vec3(colours[colorMenu.selectedIndex]);
            gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));

            gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );

            points.pop();
            triangles.push(points.pop());
            //  console.log("points size after pop: " + points.length);
            //  console.log("[triangle mode] popped last two points in point-array");
            //  console.log("[triangle mode] triangle added at vertex index: " + index);


            t_3 = vec2(cursorPos);

            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_3));
            indexCount++;

            firstPoint = true;
            thirdPoint = false;
        }
        }
    });
    rendering();
}

function rendering() {
    gl.clear( gl.COLOR_BUFFER_BIT);

    // iterate thru all indexes of points-array and draw each point
    for(var i = 0; i < points.length; i++){
        gl.drawArrays(gl.POINTS, points[i],  1);
    }

    // iterate thru all indexes of triangle-array and draw each triangle
    for (var i = 0; i < triangles.length; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, triangles[i], 3);
    }

    window.requestAnimFrame(rendering);
}
