// This instruction lets us decide how precise can a float be. There are different possible values:
// highp
// mediump
// lowp
// highp can have performance hit and might not even work on some devices. lowp can create bugs by the lack of precision. We ordinarily use mediump. We also could have set the precision for the vertex shader but it's not required.
precision mediump float;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
    // if we want to set the a below 1 set the transparency to true in the RawShaderMaterial
    // vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = textureColor;
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 0.5 + 1.0;
    gl_FragColor = textureColor;
}