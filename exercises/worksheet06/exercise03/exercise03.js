// @ts-nocheck
/**
 * @param {Element} canvas The canvas element to create a context from.
 * @return {WebGLRenderingContext} The created context.
 */
function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

function context() {
    // Prepare WebGL
    var canvas = document.getElementById("canvas_C");
    var gl = setupWebGL(canvas);

    // Load shaders
    var program = initShaders(gl, "vertex-shader-3", "fragment-shader-3");
    gl.useProgram(program);

    // POSITIONS
    const vertices = [
        vec3(1, -1, -1),
        vec3(-1, 1, -1),
        vec3(-1, -1, 1),
        vec3(1, 1, 1),
    ].map(x => scale(1 / Math.sqrt(3), x));

    var elems = [];

    function triangle(a, b, c) {
        // elems.push(a, b, b, c, c, a); // LINES
        elems.push(a, c, b); // TRIANGLES
    }

    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }

    function divideTriangle(a, b, c, count) {
        if (count > 1) {
            var ab = normalize(mix(a, b, 0.5));
            var ac = normalize(mix(a, c, 0.5));
            var bc = normalize(mix(b, c, 0.5));

            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        } else {
            triangle(a, b, c);
        }
    }

    function redraw_sphere(subdivision) {
        elems = [];
        tetrahedron(...vertices, subdivision);

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(elems), gl.STATIC_DRAW);

        let vLocation = gl.getAttribLocation(program, 'vPosition');
        gl.vertexAttribPointer(vLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vLocation);
    }

    var subdivision = 8;
    redraw_sphere(subdivision);

    function increase_subdivision() {
        subdivision = Math.min(8, subdivision + 1);
        redraw_sphere(subdivision);
    }

    function decrease_subdivision() {
        subdivision = Math.max(1, subdivision - 1);
        redraw_sphere(subdivision);
    }

    document.getElementById("increase_subdivision3").onclick = increase_subdivision;
    document.getElementById("decrease_subdivision3").onclick = decrease_subdivision;

    // texture
    var image = document.createElement('img');
    image.crossorigin = 'anonymous';
    image.onload = e => {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.src = 'textures/earth.jpg';

    function render(time) {
        // background
        gl.clearColor(0.79, 0.7, 0.61, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // view
        var worldMatrix = rotateY(-time / 121);

        var viewMatrix = [
            perspective(45, 1, 1, 6),
            translate(0, 0, -4)
        ].reduce(mult);

        {
            let u_var_Loc = gl.getUniformLocation(program, 'worldMatrix');
            gl.uniformMatrix4fv(u_var_Loc, false, flatten(worldMatrix));
        } {
            let u_var_Loc = gl.getUniformLocation(program, 'viewMatrix');
            gl.uniformMatrix4fv(u_var_Loc, false, flatten(viewMatrix));
        }

        // points
        gl.drawArrays(gl.TRIANGLES, 0, elems.length);
        window.requestAnimationFrame(render);
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    window.requestAnimationFrame(render);
}

context()