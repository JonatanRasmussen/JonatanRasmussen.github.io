//
// start here
//
var points = [];
var vertices = [];
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

    // cursor pos
    var cursorPos = vec2(0.0, 0.0);

    // event listener
    canvas.addEventListener("click", function (event) {
        var bounds = event.target.getBoundingClientRect();
        var vec2x = (event.clientX - bounds.left);
        var vec2y = (canvas.height - event.clientY + bounds.top - 1);
        cursorPos = vec2(2*(vec2x)/canvas.width - 1, 2*(vec2y)/canvas.height - 1);
        console.log(cursorPos);
        vertices.push(cursorPos);

        // buffer
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        // render
        var pos = gl.getAttribLocation(program, "myPos");
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(pos);
        rendering(vertices.length);
    });
    rendering(vertices.length);
}

function rendering(length) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, length );
}
