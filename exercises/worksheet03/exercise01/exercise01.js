/**
 * @param {Element} canvasElement
 * @return {WebGLRenderingContext}
 */
function setupWebGL(canvasElement) {
    return WebGLUtils.setupWebGL(canvasElement);
}

function renderContext() {


    var canvasEl = document.getElementById("canvas_A");
    var webGLContext = setupWebGL(canvasEl);

    var shaderProgram = initShaders(webGLContext, "vertex-shader-1", "fragment-shader-1");
    webGLContext.useProgram(shaderProgram);

    const cubeVertices = [
        vec3(0, 0, 1),
        vec3(1, 0, 1),
        vec3(1, 1, 1),
        vec3(0, 1, 1),
        vec3(0, 0, 0),
        vec3(1, 0, 0),
        vec3(1, 1, 0),
        vec3(0, 1, 0)
    ];


    const cubeColors = [
        [1.0, 0.0, 0.0],
        [1.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [1.0, 1.0, 1.0],
        [0.0, 1.0, 1.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0]
    ];

    var indicesArray = [];

    function createQuad(a, b, c, d) {
        var indices = [a, b, b, c, c, d, d, a];
        indicesArray.push(...indices.map(x => x - 1));
    }

    function colorCube() {
        createQuad(2, 1, 5, 6);
        createQuad(6, 5, 8, 7);
        createQuad(5, 1, 4, 8);
        createQuad(4, 3, 7, 8);
        createQuad(2, 6, 7, 3);
        createQuad(1, 2, 3, 4);
    }

    colorCube();

    const vPosition = webGLContext.createBuffer();
    webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, vPosition);
    webGLContext.bufferData(webGLContext.ARRAY_BUFFER, flatten(cubeVertices), webGLContext.STATIC_DRAW);

    {
        let vLocation = webGLContext.getAttribLocation(shaderProgram, 'vPosition');
        webGLContext.vertexAttribPointer(vLocation, 3, webGLContext.FLOAT, false, 0, 0);
        webGLContext.enableVertexAttribArray(vLocation);
    }

    const vColor = webGLContext.createBuffer();
    webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, vColor);
    webGLContext.bufferData(webGLContext.ARRAY_BUFFER, flatten(cubeColors), webGLContext.STATIC_DRAW);

    {
        let vLocation = webGLContext.getAttribLocation(shaderProgram, 'vColor');
        webGLContext.vertexAttribPointer(vLocation, 3, webGLContext.FLOAT, false, 0, 0);
        webGLContext.enableVertexAttribArray(vLocation);
    }

    const vElems = webGLContext.createBuffer();
    webGLContext.bindBuffer(webGLContext.ELEMENT_ARRAY_BUFFER, vElems);
    webGLContext.bufferData(webGLContext.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesArray), webGLContext.STATIC_DRAW);

    function drawScene() {

        webGLContext.clearColor(0.79, 0.7, 0.61, 1.0);
        webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);

        var viewMatrix = [rotateX(-35), rotateY(-45), translate(-.6, -.6, -.6)].reduce(mult);

        let u_var_Loc = webGLContext.getUniformLocation(shaderProgram, 'vMatrix');
        webGLContext.uniformMatrix4fv(u_var_Loc, false, flatten(viewMatrix));

        webGLContext.drawElements(webGLContext.LINES, indicesArray.length, webGLContext.UNSIGNED_BYTE, 0);
        window.requestAnimationFrame(drawScene);
    }

    window.requestAnimationFrame(drawScene);
}

renderContext()