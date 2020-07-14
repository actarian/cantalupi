export const FRAGMENT_SHARED = /* glsl */ `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_mx;
uniform float u_my;
uniform float u_speed;
uniform float u_opacity;

float random(vec2 st) {
	return fract(sin(dot(st.xy + cos(u_time), vec2(12.9898 , 78.233))) * (43758.5453123));
}

vec2 coord(in vec2 p) {
	p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
	    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
	return p;
}
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(vec2(u_mx, u_my))
#define ee noise(gl_FragCoord.xy / u_resolution.xy)
#define rx 1.0 / min(u_resolution.x, u_resolution.y)

float sCircle(in vec2 p, in float w) {
    return length(p) * 2.0 - w;
}

float sGradient(in vec2 p) {
    return length(p);
}
`;

export const FRAGMENT_SHADER_1 = FRAGMENT_SHARED + `
void main() {
	vec2 p = st - vec2(mx.x, mx.y * -1.0);
	vec3 color = vec3(1.0);
	// float noise = random(p) * 0.1;
	// color = vec3(clamp(0.0, 1.0, color.r - noise));
	// float circle = sCircle(p, 0.2 - 0.2 * u_speed + cos(u_time) * 0.1);
	// circle += sCircle(p, 0.05 - 0.05 * u_speed + cos(u_time) * 0.025);
	float circle = sCircle(p, 0.2 + cos(u_time) * 0.1);
	circle += sCircle(p, 0.05 + cos(u_time) * 0.025);
	circle = clamp(0.0, 1.0, circle);
	// float alpha = smoothstep(0.0, 0.99, 1.0 - circle) * (0.4 + cos(u_time) * 0.35);
	float alpha = smoothstep(0.0, 0.8, 1.0 - circle) * 0.6 * u_opacity;
	gl_FragColor = vec4(color, alpha);
}
`;

export const FRAGMENT_SHADER_2 = FRAGMENT_SHARED + `
void main() {
	vec2 p = st - vec2(mx.x, mx.y * -1.0);
	vec3 color = vec3(0.0);
	float noise = random(p) * 0.1;
	color = vec3(clamp(0.0, 1.0, color.r + noise));
	// float circle = sCircle(p, 4.0 - 2.5 * u_speed + cos(u_time) * 0.05);
	// float circle = sGradient(p * (0.25 + 1.75 * u_speed));
	float circle = sGradient(p * 0.25);
	float alpha = clamp(0.0, 1.0, circle * 0.5) * u_opacity; // smoothstep(0.0, 0.99, circle) * 0.7;
	gl_FragColor = vec4(color, alpha);
}
`;
