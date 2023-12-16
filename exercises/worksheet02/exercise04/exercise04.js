

var t = [];
var t_1 = [];
var t_2 = [];
var t_3 = [];
var t_4 = [];
var mode = 2;
var triangle_limit = 5000;
var vertex_limit = 3 * triangle_limit;
var indexCount = 0;

var firstPoint = true;
var secondPoint = false;
var thirdPoint = false;

var points = [];
var triangles = [];
var circles = [];
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

    // blue background
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load shader
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // get HTML elements
    var clearMenu = document.getElementById("clearMenu");
    var clearButton = document.getElementById("clearButton");
    var addPoints = document.getElementById("addPoints");
    var addTriangles = document.getElementById("addTriangles");
    var addCircles = document.getElementById("addCircles");

    // color buffer setup
    var colourBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, sizeof['vec3']*vertex_limit, gl.STATIC_DRAW );

    // vertex color setup
    var myColor = gl.getAttribLocation( program, "myColor" );
    gl.vertexAttribPointer( myColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );

    // vertex buffer setup
    var vectorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertex_limit, gl.STATIC_DRAW );

    // points-button clicked
    addPoints.addEventListener("click", function(event){
        console.log("Points button clicked");
        mode = 0;
    });

    // triangle-button clicked
    addTriangles.addEventListener("click", function(event){
        console.log("Triangle button clicked");
        mode = 1;
        //mode = false;
    });

    // points-button clicked
    addCircles.addEventListener("click", function(event){
        console.log("Circles button clicked");
        mode = 2;
    });

    // vertex position setup
    var myPos = gl.getAttribLocation( program, "myPos" );
    gl.vertexAttribPointer( myPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPos );

    // clear the canvas
    clearButton.addEventListener("click", function(event) {
        var bgcolor = colours[clearMenu.selectedIndex];
        gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3],bgcolor[4],bgcolor[5]);

        // reset everything
        firstPoint = true;
        secondPoint = false;
        thirdPoint = false;
        mode = 2;
        indexCount = 0;
        t = [];
        t_1 = [];
        t_2 = [];
        t_3 = [];
        t_4 = [];
        points = [];
        triangles = [];
        circles = [];
        colors = [];
        rendering();
    });

    canvas.addEventListener("click", function (ev) {
        var bounds = ev.target.getBoundingClientRect();
        cursorPos = vec2(2*(ev.clientX - bounds.left)/canvas.width - 1, 2*(canvas.height - ev.clientY + bounds.top - 1)/canvas.height - 1);

        if(mode == 0){ // point mode enabled
        console.log("[point mode] point added at mousepos: [" + cursorPos[0].toPrecision(1)+ ","+ cursorPos[1].toPrecision(1) + "]");

        t = vec3(colours[colorMenu.selectedIndex]);
        gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));
        gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );

        points.push(indexCount);
        t_1 = cursorPos;
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_1));
        indexCount++;

        } else if (mode == 1){ // triangle-mode enabled

        if(firstPoint){
            console.log("[triangle mode] first point added at mousepos: [" + cursorPos[0].toPrecision(1)+ ","+ cursorPos[1].toPrecision(1) + "]");

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
            console.log("[triangle mode] second point added at mousepos: [" + cursorPos[0].toPrecision(1)+ ","+ cursorPos[1].toPrecision(1) + "]");

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

        } else {
            t = vec3(colours[colorMenu.selectedIndex]);
            gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));

            gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );

            points.pop();
            triangles.push(points.pop());
            t_3 = vec2(cursorPos);

            gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_3));
            indexCount++;

            firstPoint = true;
            thirdPoint = false;
        }
        } else if (mode == 2){ // circle-mode enabled

            // 1st click
            if(firstPoint){
                console.log("[circle mode] first point added at mousepos: [" + cursorPos[0].toPrecision(1)+ ","+ cursorPos[1].toPrecision(1) + "]");

                // colors
                t = vec3(colours[colorMenu.selectedIndex]);
                gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));
                gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );


                // push first point
                points.push(indexCount);
                t_1 = vec2(cursorPos);
                gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_1));
                indexCount++;

                firstPoint = false;
                secondPoint = true;

                // 2nd click
            } else {
                console.log("[circle mode] second point added at mousepos: [" + cursorPos[0].toPrecision(1)+ ","+ cursorPos[1].toPrecision(1) + "]");

                // colors
                t = vec3(colours[colorMenu.selectedIndex]);
                gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));

                // vertex
                gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );
                circles.push(points.pop());
                t_2 = vec2(cursorPos);

                // calculate radius from point1 to point2
                var r = Math.sqrt(Math.pow((t_2[0]-t_1[0]),2) + Math.pow((t_2[1]-t_1[1]),2));


                // make circle
                for (i = 0; i <= 200; i++){

                t = vec3(colours[colorMenu.selectedIndex]);
                gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3']*indexCount, flatten(t));

                gl.bindBuffer( gl.ARRAY_BUFFER, vectorBuffer );
                t_2 = vec2(t_1[0] + r*Math.cos(i*2*Math.PI/200), t_1[1] + r*Math.sin(i*2*Math.PI/200));
                gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*indexCount, flatten(t_2));
                indexCount++;
                }
                secondPoint = false;
                firstPoint = true;
            }
        }
    });
    rendering();
}

function rendering() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // iterate thru all indexes of points-array and draw each point
    for(var i = 0; i < points.length; i++){
        gl.drawArrays(gl.POINTS, points[i],  1);
    }

    // iterate thru all indexes of triangle-array and draw each triangle
    for (var i = 0; i < triangles.length; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, triangles[i], 3);
    }

    // iterate thru all indexes of triangle-array and draw each triangle
    for (var i = 0; i < circles.length; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, circles[i], 202);
    }
    window.requestAnimFrame(rendering);
}
