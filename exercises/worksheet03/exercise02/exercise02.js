/**
 * @param {Element} canvasElement
 * @return {WebGLRenderingContext}
 */
function setupWebGL(canvasElement) {
    return WebGLUtils.setupWebGL(canvasElement);
}

function renderContext() {

    var canvasEl = document.getElementById("canvas_B");
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
        var indexSet = [a, b, b, c, c, d, d, a];
        indicesArray.push(...indexSet.map(x => x - 1));
    }

    function buildColorCube() {
        createQuad(2, 1, 5, 6);
        createQuad(6, 5, 8, 7);
        createQuad(5, 1, 4, 8);
        createQuad(2, 6, 7, 3);
        createQuad(4, 3, 7, 8);
        createQuad(1, 2, 3, 4);
    }

    buildColorCube();

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
        webGLContext.cullFace(webGLContext.BACK);
        webGLContext.clear(webGLContext.COLOR_BUFFER_BIT | webGLContext.DEPTH_BUFFER_BIT);

        // 1
        var viewMatrix1 = [
            translate(-.5, .4, 0),
            scalem(.5, .5, .5),
            perspective(42, 1, 2, 3),
            lookAt(vec3(.5, .5, 3), vec3(.5, .5, .5), vec3(0, 1, 0))
        ].reduce(mult);


        let u_var_Loc1 = webGLContext.getUniformLocation(shaderProgram, 'vMatrix');
        webGLContext.uniformMatrix4fv(u_var_Loc1, false, flatten(viewMatrix1));
        webGLContext.drawElements(webGLContext.LINES, indicesArray.length, webGLContext.UNSIGNED_BYTE, 0);

        // 2
        var viewMatrix2 = [
            translate(-.3, -.5, 0),
            scalem(.5, .5, .5),
            perspective(40, 1, 1, 10),
            translate(0, 0, -2),
            lookAt(vec3(0.1, .7, 1), vec3(.5, .5, .5), vec3(0, 1, 0))
        ].reduce(mult);

        let u_var_Loc2 = webGLContext.getUniformLocation(shaderProgram, 'vMatrix');
        webGLContext.uniformMatrix4fv(u_var_Loc2, false, flatten(viewMatrix2));
        webGLContext.drawElements(webGLContext.LINES, indicesArray.length, webGLContext.UNSIGNED_BYTE, 0);

        // 3
        var viewMatrix3 = [
            translate(.55, -.1, 0),
            scalem(.5, .5, .5),
            perspective(45, 1, 1, 2),
            translate(0, 0, -2),
            lookAt(vec3(0, 1, 1), vec3(.5, .5, .5), vec3(0, 1, 0))
        ].reduce(mult);

        let u_var_Loc3 = webGLContext.getUniformLocation(shaderProgram, 'vMatrix');
        webGLContext.uniformMatrix4fv(u_var_Loc3, false, flatten(viewMatrix3));
        webGLContext.drawElements(webGLContext.LINES, indicesArray.length, webGLContext.UNSIGNED_BYTE, 0);
    }

    window.requestAnimationFrame(drawScene);
}

renderContext()