// @ts-nocheck
/**
 * @param {Element} canvas The canvas element to create a context from.
 * @return {WebGLRenderingContext} The created context.
 */
function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

function createEmptyArrayBuffer(gl, program, var_name, num, type) {
    let buffer = gl.createBuffer(); // Create a buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const a_attribute = gl.getAttribLocation(program, var_name);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute); // Enable the assignment

    return buffer;
}

function createChessboard() {
    const texSize = 64;
    const numRows = 8;
    const numCols = 8;
    const numComponents = 4;
    let myImage = new Uint8Array(numComponents * texSize * texSize);

    for (let i = 0; i < texSize; ++i) {
        for (let j = 0; j < texSize; ++j) {
            let patchx = Math.floor(i / (texSize / numRows));
            let patchy = Math.floor(j / (texSize / numCols));
            let c = (patchx % 2 !== patchy % 2 ? 255 : 0);

            let index = numComponents * (i * texSize + j);
            myImage[index + 0] = c;
            myImage[index + 1] = c;
            myImage[index + 2] = c;
            myImage[index + 3] = 255;
        }
    }

    return myImage;
}

function context() {
    // Prepare WebGL
    let canvas = document.getElementById("canvas_A");
    let gl = setupWebGL(canvas);

    // Load shaders
    let program = initShaders(gl, "vertex-shader-1", "fragment-shader-1");
    gl.useProgram(program);

    // vertices
    const vertices = [vec3(-2, -1, -1), vec3(-2, -1, -5), vec3(2, -1, -5), vec3(2, -1, -1),
        vec3(0.25, -0.5, -1.75), vec3(0.25, -0.5, -1.25), vec3(0.75, -0.5, -1.25), vec3(0.75, -0.5, -1.75),
        vec3(-1, -1, -3), vec3(-1, -1, -2.5), vec3(-1, 0, -2.5), vec3(-1, 0, -3)
    ];

    const texCoords = [vec2(-1, -1), vec2(-1, 1), vec2(1, 1), vec2(1, -1), vec2(-1, -1), vec2(-1, 1), vec2(1, 1), vec2(1, -1), vec2(-1, -1), vec2(-1, 1), vec2(1, 1), vec2(1, -1)];
    const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11];

    const vertexBuffer = createEmptyArrayBuffer(gl, program, 'position', 3, gl.FLOAT);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    const texCoordsBuffer = createEmptyArrayBuffer(gl, program, 'texPosition', 2, gl.FLOAT);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // image texture
    var image = document.createElement('img');
    image.crossorigin = 'anonymous';
    image.onload = e => {
        console.log("Texture loaded");
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.src = 'textures/xamp23.png';

    // solid red texture
    {
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }

    function render() {
        // background
        gl.clearColor(0.79, 0.7, 0.61, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let pspMtrx = perspective(90, 1, 1, 20);

        {
            let u_var_Loc = gl.getUniformLocation(program, 'perspective');
            gl.uniformMatrix4fv(u_var_Loc, false, flatten(pspMtrx));
        }

        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
        gl.drawElements(gl.TRIANGLES, indices.length - 6, gl.UNSIGNED_BYTE, 6);

        window.requestAnimationFrame(render);
    }

    {
        let u_var_Loc = gl.getUniformLocation(program, 'modelView');
        gl.uniformMatrix4fv(u_var_Loc, false, flatten(mat4()));
    }

    window.requestAnimationFrame(render);
}

context()