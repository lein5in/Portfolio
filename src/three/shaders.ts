export const atmosphereVert = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewNormal;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal   = normalize(mat3(modelMatrix) * normal);
    vViewNormal    = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFrag = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewNormal;

  uniform vec3  uSunPosition;
  uniform vec3  uDayColor;
  uniform vec3  uDawnColor;
  uniform vec3  uNightColor;
  uniform float uOpacity;
  uniform float uPower;

  void main() {
    vec3  sunDir    = normalize(uSunPosition - vWorldPosition);
    float sunFacing = dot(normalize(vWorldNormal), sunDir);

    vec3 color = mix(uNightColor, uDawnColor, smoothstep(-0.18, 0.05, sunFacing));
    color      = mix(color,       uDayColor,  smoothstep(0.05,  0.55, sunFacing));

    float rim  = 1.0 - abs(dot(normalize(vViewNormal), vec3(0.0, 0.0, 1.0)));
    float limb = pow(rim, uPower);

    float glowStrength = mix(0.18, 1.0, smoothstep(-0.3, 0.3, sunFacing));

    vec3  toCam     = normalize(cameraPosition - vWorldPosition);
    float backlit   = 1.0 - smoothstep(-0.1, 0.45, dot(toCam, sunDir));
    float glowBoost = mix(1.0, 1.15, backlit);

    gl_FragColor = vec4(color, limb * uOpacity * glowStrength * glowBoost);
  }
`;