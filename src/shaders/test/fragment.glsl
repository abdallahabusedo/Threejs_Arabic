precision mediump float;

uniform sampler2D uTexture;
varying vec2 vUv;
varying float vRandom;
varying float vElevation;
void main() {
    // gl_FragColor = vec4(vRandom, vRandom, vRandom, vRandom);
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 0.5 + 1.0;
    gl_FragColor = textureColor;
}