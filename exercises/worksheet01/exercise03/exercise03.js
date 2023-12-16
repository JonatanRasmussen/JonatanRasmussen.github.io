
// main
window.onload = function init(){

    // setup canvas
    gl = WebGLUtils.setupWebGL(document.getElementById("myCanvas"));
    if(!gl){alert("WebGL not available");}

    // blue background
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load shader
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // set pos
    const vertices = [vec2(0, 0), vec2(1, 0), vec2(1, 1)];
    assign_attribute(gl, program, vertices, 2, "myPos");

    // set color
    const colors = [vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1)];
    assign_attribute(gl, program, colors, 3, "myColor");

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}

function assign_attribute(gl, program, vectors, shape, name)
{
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vectors), gl.STATIC_DRAW);

    var pos = gl.getAttribLocation(program, name);
    gl.vertexAttribPointer(pos, shape, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos);
}
