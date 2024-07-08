uniform mat4 projectionMatrix; // The projectionMatrix will finally transform our coordinates into the final clip space coordinates.
uniform mat4 viewMatrix; // The viewMatrix will apply transformations relative to the camera. If we rotate the camera to the left, the vertices should be on the right. If we move the camera in direction of the Mesh, the vertices should get bigger, etc.
uniform mat4 modelMatrix; // The modelMatrix will apply all transformations relative to the Mesh. If we scale, rotate or move the Mesh, these transformations will be contained in the modelMatrix and applied to the position.
// uniform mat4 modelViewMatrix; // Shorter way to write the multiplication of the viewMatrix and modelMatrix.
uniform vec2 uFrequency;
uniform float uTime;
// Remember that the same code applies to every vertices of the geometry. 
// Attributes are the only variable that will change between the vertices. 
// The same vertex shader will be applied for each vertex and the position attribute will contain the x, y, and z coordinates of that specific vertex.
attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {

    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    /* This is ther order of multiply */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // we can do this 
    // modelPosition.y += 4.0;

    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.5;

    // modelPosition.z += aRandom;

    // modelPosition.z += sin(modelPosition.x * uFrequency) * 0.5;

    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.5;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.5;

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.9;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.5;
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // gl_Position.y += 4.0;
    // gl_Position.x += 4.0;

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;

}
