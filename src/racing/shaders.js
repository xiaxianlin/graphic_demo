export const VERTEX_SHADER = `
attribute vec4 a_Position;
attribute vec4 a_Color;

uniform mat4 mvpMatrix;

varying vec4 v_Color;
varying vec4 v_Position;

void main(){
    v_Color = a_Color;
    v_Position = a_Position * mvpMatrix;
    gl_Position = a_Position * mvpMatrix;
}`

export const FRAGMENT_SHADER = `
precision mediump float;

varying vec4 v_Color;

void main(){
    vec3 viewPos = vec3(0, 0.5, -1.0);
    vec4 ominPos = vec4(1.0, 1.0, 1.0, 1.0);
    vec3 ominColor = vec3(1.0, 1.0, 1.0);
    vec3 ambientColor = vec3(0.2, 0.2, 0.2);
    float specExponent = 0.5;

    gl_FragColor = vec4(0.3, 0.3, 0.3, 0.75);
}`
