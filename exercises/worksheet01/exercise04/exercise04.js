
// main
window.onload = function init(){

    // setup canvas
    gl = WebGLUtils.setupWebGL(document.getElementById("myCanvas"));
    if(!gl){alert("WebGL not available");}

    // load shader
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // set pos
    const vertices = [vec2(0, 0), vec2(-0.5, 0), vec2(0, 0.5), vec2(0.5, 0), vec2(0, -0.5), vec2(-0.5, 0)];
    assign_attribute(gl, program, vertices, 2, "myPos");

    // set color
    var location = gl.getUniformLocation(program, 'myColor');
    gl.uniform3f(location, 1, 1, 1);

    // loop
    var animate = t =>
    {
        let a = t / -2000;

        // blue background
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // rotate
        var location = gl.getUniformLocation(program, 'myMatrix');
        gl.uniformMatrix2fv(location, false, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)]);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
        window.requestAnimationFrame(animate);
    }
    animate(0);
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
