uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main() {
    /* Variables */
    //! It's a typed language, meaning that we must specify a variable's type, and we cannot assign any other type to that variable.
    // float fooBar = 4; ❌
    // float fooBar = 0.123; ✅ 

    //! The following types are available:
    // float
        // float foo = 0.123;
    // int
        // int foo = 4;
    // bool
        // bool foo = true;
    // vec2, vec3, vec4
        // vec2 foo = vec2(0.123, 0.456);
        // vec3 foo = vec3(0.123, 0.456, 0.789);
        // vec4 foo = vec4(0.123, 0.456, 0.789, 1.0);
    // mat2, mat3, mat4
        // mat2 foo = mat2(1.0, 0.0, 0.0, 1.0);
        // mat3 foo = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
        // mat4 foo = mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    // And more...

    //* Functions */
    //! Functions are defined by the keyword void, followed by the function's name, and its parameters.
    // void foo() {
    //     // Do something
    // }

    //! Functions can return a value, and the type of the value must be specified.
    // float foo() {
    //     return 0.123;
    // }

    //! Functions can also receive parameters.
    // float foo(float bar) {
    //     return bar;
    // }

    //! Functions can also receive multiple parameters.
    // float foo(float bar, float baz) {
    //     return bar + baz;
    // }

    //* Operations */
    //! The following operations are available:
    // +, -, *, /, %, ++, --, +=, -=, *=, /=, ==, !=, >, <, >=, <=, &&, ||, !, ?:, =, etc.
    // float foo = 1.0 + 2.0; // result = 3.0
    // float foo = 1.0 - 2.0; // result = -1.0
    // float foo = 1.0 * 2.0; // result = 2.0
    // float foo = 1.0 / 2.0; // result = 0.5
    // float foo = 1.0 % 2.0; // result = 1.0
    // float foo = 1.0++; // result = 2.0
    // float foo = 1.0--; // result = 0.0
    // float foo = 1.0 += 2.0; result = 3.0
    // float foo = 1.0 -= 2.0; result = -1.0
    // float foo = 1.0 *= 2.0; result = 2.0
    // float foo = 1.0 /= 2.0; result = 0.5
    // bool foo = 1.0 == 2.0;   // false
    // bool foo = 1.0 != 2.0;   // true
    // bool foo = 1.0 > 2.0;    // false
    // bool foo = 1.0 < 2.0;    // true
    // bool foo = 1.0 >= 2.0;   // false
    // bool foo = 1.0 <= 2.0;   // true
    // bool foo = true && false; // false
    // bool foo = true || false; // true
    // bool foo = !true;         // false
    // float foo = true ? 1.0 : 2.0; // result = 1.0
    // float foo = false ? 1.0 : 2.0; // result = 2.0
    // float foo = 1.0; // result = 1.0

    //! you can also do the oprations with different types
    //! But we can't mix float and int in these operations:
    // float foo = 1.0 + 2; ❌
    // float foo = 1.0 + 2.0; ✅
    //! to fix this, we can cast the int to a float:
    // float foo = 1.0 + float(2); ✅
    // int foo = 1 + int(2.0); ✅

    //! We can also do operations with vectors and matrices:
    // vec2 foo = vec2(1.0, 2.0) + vec2(3.0, 4.0); // result = vec2(4.0, 6.0)
    // vec3 foo = vec3(1.0, 2.0, 3.0) + vec3(4.0, 5.0, 6.0); // result = vec3(5.0, 7.0, 9.0)
    // vec4 foo = vec4(1.0, 2.0, 3.0, 4.0) + vec4(5.0, 6.0, 7.0, 8.0); // result = vec4(6.0, 8.0, 10.0, 12.0)
    // mat2 foo = mat2(1.0, 2.0, 3.0, 4.0) + mat2(5.0, 6.0, 7.0, 8.0); // result = mat2(6.0, 8.0, 10.0, 12.0)
    // mat3 foo = mat3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0) + mat3(10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0); // result = mat3(11.0, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 25.0, 27.0)
    // mat4 foo = mat4(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0) + mat4(17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0); // result = mat4(18.0, 20.0, 22.0, 24.0, 26.0, 28.0, 30.0, 32.0, 34.0, 36.0, 38.0, 40.0, 42.0, 44.0, 46.0, 48.0)

    //! We can also do operations with vectors and matrices and scalars:
    // vec2 foo = vec2(1.0, 2.0) + 3.0; // result = vec2(4.0, 5.0)
    // vec3 foo = vec3(1.0, 2.0, 3.0) + 4.0; // result = vec3(5.0, 6.0, 7.0)
    // vec4 foo = vec4(1.0, 2.0, 3.0, 4.0) + 5.0; // result = vec4(6.0, 7.0, 8.0, 9.0)
    // mat2 foo = mat2(1.0, 2.0, 3.0, 4.0) + 5.0; // result = mat2(6.0, 7.0, 8.0, 9.0)
    // mat3 foo = mat3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0) + 10.0; // result = mat3(11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0)
    // mat4 foo = mat4(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0) + 17.0; // result = mat4(18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0)

    //! conditionals
    // float foo = 1.0;
    // if (foo == 1.0) {
    //     // do something
    // } else {
    //     // do something else
    // }

    //! loops
    // for (int i = 0; i < 10; i++) {
    //     // do something
    // }

    //! We can also use the built-in functions
    // float foo = sin(1.0); // result = 0.841471
    // float foo = cos(1.0); // result = 0.540302
    // float foo = tan(1.0); // result = 1.55741
    // float foo = asin(1.0); // result = 1.5708
    // float foo = acos(1.0); // result = 0
    // float foo = atan(1.0); // result = 0.785398
    // float foo = pow(2.0, 3.0); // result = 8
    // float foo = exp(1.0); // result = 2.71828
    // float foo = log(1.0); // result = 0
    // float foo = exp2(1.0); // result = 2
    // float foo = log2(1.0); // result = 0
    // float foo = sqrt(1.0); // result = 1
    // float foo = inversesqrt(1.0); // result = 1
    // float foo = abs(-1.0); // result = 1
    // float foo = sign(-1.0); // result = -1
    // float foo = floor(1.5); // result = 1
    // float foo = ceil(1.5); // result = 2
    // float foo = fract(1.5); // result = 0.5
    // float foo = mod(5.0, 2.0); // result = 1
    // float foo = min(1.0, 2.0); // result = 1
    // float foo = max(1.0, 2.0); // result = 2
    // float foo = clamp(1.5, 1.0, 2.0); // result = 1.5
    // float foo = mix(1.0, 2.0, 0.5); // result = 1.5
    // float foo = step(1.0, 2.0); // result = 1
    // float foo = smoothstep(1.0, 2.0, 1.5); // result = 0.5
    // float foo = length(vec2(1.0, 2.0)); // result = 2.23607
    // float foo = distance(vec2(1.0, 2.0), vec2(3.0, 4.0)); // result = 2.82843
    // float foo = dot(vec2(1.0, 2.0), vec2(3.0, 4.0)); // result = 11
    // vec3 foo = cross(vec3(1.0, 2.0, 3.0), vec3(4.0, 5.0, 6.0)); // result = vec3(-3.0, 6.0, -3.0)
    // vec2 foo = normalize(vec2(1.0, 2.0)); // result = vec2(0.447214, 0.894427)
    // float foo = faceforward(1.0, 2.0, 3.0); // result = 1
    // float foo = reflect(1.0, 2.0); // result = 1
    // float foo = refract(1.0, 2.0, 3.0); // result = 1
    // float foo = noise1(1.0); // result = 0.5
    // vec2 foo = noise2(vec2(1.0, 2.0)); // result = vec2(0.5, 0.5)
    // vec3 foo = noise3(vec3(1.0, 2.0, 3.0)); // result = vec3(0.5, 0.5, 0.5)
    // vec4 foo = noise4(vec4(1.0, 2.0, 3.0, 4.0)); // result = vec4(0.5, 0.5, 0.5, 0.5)

    //! Uniforms, attributes, varyings
    // uniform float foo; // a uniform variable is a global variable that is the same for all vertices or fragments
    // attribute float foo; // an attribute variable is a global variable that is different for each vertex
    // varying float foo; // a varying variable is a global variable that is passed from the vertex shader to the fragment shader

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
