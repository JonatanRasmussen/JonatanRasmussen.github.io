
// main
window.onload = function init(){

    // setup canvas
    gl = WebGLUtils.setupWebGL(document.getElementById("myCanvas"));
    if(!gl){alert("WebGL not available");}

    // blue background
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}