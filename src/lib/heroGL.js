/* Fondo WebGL del hero: rayos de luz con zoom blur radial que salen de un núcleo brillante.
   Portado 1:1 desde el artefacto aprobado (AP_GL). La paleta llega como 7 colores RGB (0–1) en el orden
   shadow, teal, cyan, cyan-light, lime, ocre, rose. */
var VERT = 'attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}';
var FRAG = [
  'precision highp float;',
  'uniform vec2 uRes;',
  'uniform float uTime;',
  'uniform float uFlow;',
  'uniform vec2 uPointer;',
  'uniform float uProgress;',
  'uniform vec4 uText;',
  'uniform float uTextAmt;',
  'uniform vec3 uTun;',
  'uniform sampler2D uNoise;',
  'uniform vec3 uPal[7];',
  '#define N 32',
  'vec3 rampA(float x){x=clamp(x,0.0,1.0)*3.0;vec3 c=mix(uPal[1],uPal[2],clamp(x,0.0,1.0));c=mix(c,uPal[4],clamp(x-1.0,0.0,1.0));return mix(c,uPal[3],clamp(x-2.0,0.0,1.0));}',
  'vec3 rampB(float x){x=clamp(x,0.0,1.0)*3.0;vec3 c=mix(uPal[1],uPal[5],clamp(x,0.0,1.0));c=mix(c,uPal[6],clamp(x-1.0,0.0,1.0));return mix(c,uPal[3],clamp(x-2.0,0.0,1.0));}',
  'vec3 rampW(float x){x=clamp(x,0.0,1.0)*3.0;vec3 brown=uPal[5]*0.5+uPal[0]*0.25;vec3 c=mix(brown,uPal[5],clamp(x,0.0,1.0));c=mix(c,uPal[6],clamp(x-1.0,0.0,1.0));return mix(c,mix(uPal[6],vec3(1.0),0.35),clamp(x-2.0,0.0,1.0));}',
  'void main(){',
  '  vec2 uv=gl_FragCoord.xy/uRes;',
  '  vec2 core=vec2(0.5,0.45+0.07*uProgress)+uPointer*0.04;',
  '  vec2 p=uv-core; p.x*=uRes.x/uRes.y;',
  '  p/=mix(1.0,1.35,uProgress);',
  '  float r=length(p);',
  '  float u=atan(p.y,p.x)*0.15915494+0.5;',
  '  float drift=0.5-0.5*cos(uTime*0.31415927);',
  '  float breathe=1.0+0.1*sin(uTime*1.0471976);',
  '  vec3 accC=vec3(0.0); vec3 accW=vec3(0.0); float wsum=0.0;',
  '  for(int i=0;i<N;i++){',
  '    float k=float(i)/float(N-1);',
  '    float rr=r*(1.0-0.75*k);',
  '    float s=log(rr+0.02)*0.45-uFlow;',
  '    vec4 n=texture2D(uNoise,vec2(u,s));',
  '    float fine=texture2D(uNoise,vec2(u*2.0,s*1.3+0.37)).g;',
  '    float shape=texture2D(uNoise,vec2(u,s*0.45)).r;',
  '    float ray=smoothstep(0.38,0.76,shape); ray*=ray;',
  '    ray*=(0.45+0.75*n.a)*(0.9+0.16*fine);',
  '    float cx=clamp(n.b*1.45-0.22+0.35*(shape-0.5),0.0,1.0);',
  '    float w=1.0-0.5*k;',
  '    accC+=mix(rampA(cx),rampB(cx),drift*0.6)*ray*w;',
  '    accW+=rampW(cx)*ray*w;',
  '    wsum+=w;',
  '  }',
  '  accC/=wsum; accW/=wsum;',
  '  float upper=smoothstep(core.y+0.04,core.y+0.42,uv.y);',
  '  float warm=clamp(upper*(clamp(uProgress*1.15,0.0,1.0)*0.92+0.12*drift),0.0,1.0);',
  '  vec3 acc=mix(accC,accW,warm);',
  '  float fall=mix(1.6,0.9,smoothstep(0.0,1.1,r));',
  '  vec3 base=uPal[0]*0.9+mix(uPal[1],uPal[5]*0.6,warm)*0.18*(1.0-smoothstep(0.0,1.0,r));',
  '  vec3 col=base+acc*fall*1.9;',
  '  float band=exp(-pow(p.y*11.0,2.0))*exp(-p.x*p.x*2.5);',
  '  float pt=exp(-r*r*90.0);',
  '  col+=(mix(uPal[2],uPal[3],0.6)*band*0.55+mix(uPal[3],vec3(1.0),0.6)*(pt*1.4+exp(-r*7.0)*0.25))*breathe;',
  '  col+=mix(uPal[3],vec3(1.0),0.7)*smoothstep(0.0,1.0,uTun.y)*exp(-r*r*mix(40.0,0.3,uTun.y))*2.2;',
  '  vec2 q=(uv-uText.xy)/uText.zw;',
  '  float tm=(1.0-smoothstep(0.6,1.05,length(q)))*uTextAmt;',
  '  col*=mix(1.0,0.3,tm);',
  '  col*=mix(1.0,0.86,smoothstep(0.85,1.5,r));',
  '  col=1.0-exp(-col*1.15);',
  '  col=clamp(mix(vec3(dot(col,vec3(0.2126,0.7152,0.0722))),col,1.65),0.0,1.0);',
  '  gl_FragColor=vec4(col,1.0);',
  '}'
].join('\n');

function mulberry(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Textura de ruido periódica (se repite en ángulo y en radio): R = forma de los haces, G = detalle fino, B = color, A = pulsos que viajan hacia afuera.
function makeNoise(W, H) {
  var rnd = mulberry(20261028);
  function layer(px, py, amp) { var g = new Float32Array(px * py); for (var i = 0; i < g.length; i++) g[i] = rnd(); return { px: px, py: py, g: g, amp: amp }; }
  function sample(L, u, v) {
    var x = u * L.px, y = v * L.py, x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    var i0 = x0 % L.px, i1 = (x0 + 1) % L.px, j0 = y0 % L.py, j1 = (y0 + 1) % L.py, P = L.px, g = L.g;
    var a = g[j0 * P + i0], b = g[j0 * P + i1], c = g[j1 * P + i0], d = g[j1 * P + i1];
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  var chans = [
    [layer(9, 2, 0.4), layer(17, 2, 0.4), layer(33, 3, 0.2)],
    [layer(40, 6, 0.6), layer(80, 12, 0.4)],
    [layer(4, 2, 0.7), layer(8, 3, 0.3)],
    [layer(13, 7, 0.6), layer(26, 11, 0.4)]
  ];
  var NC = chans.length;
  var out = new Float32Array(W * H * NC);
  for (var y = 0; y < H; y++) {
    var v = y / H;
    for (var x = 0; x < W; x++) {
      var u = x / W, o = (y * W + x) * NC;
      for (var c = 0; c < NC; c++) {
        var s = 0, ls = chans[c];
        for (var k = 0; k < ls.length; k++) s += ls[k].amp * sample(ls[k], u, v);
        out[o + c] = s;
      }
    }
  }
  var bytes = new Uint8Array(W * H * 4);
  for (var ch = 0; ch < NC; ch++) {
    var mn = 1e9, mx = -1e9, i;
    for (i = ch; i < out.length; i += NC) { if (out[i] < mn) mn = out[i]; if (out[i] > mx) mx = out[i]; }
    var span = (mx - mn) || 1;
    for (i = 0; i < W * H; i++) bytes[i * 4 + ch] = Math.round((out[i * NC + ch] - mn) / span * 255);
  }
  return bytes;
}

function create(canvas, palette) {
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); } return s; }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  var TW = 512, TH = 256;
  var tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, makeNoise(TW, TH));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  var L = {};
  ['uRes', 'uTime', 'uFlow', 'uPointer', 'uProgress', 'uText', 'uTextAmt', 'uTun', 'uNoise'].forEach(function (n) { L[n] = gl.getUniformLocation(prog, n); });
  gl.uniform1i(L.uNoise, 0);
  gl.uniform3fv(gl.getUniformLocation(prog, 'uPal[0]'), new Float32Array(palette));
  return {
    resize: function (cssW, cssH, scale) {
      var w = Math.max(1, Math.round(cssW * scale)), h = Math.max(1, Math.round(cssH * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(L.uRes, w, h);
    },
    render: function (t, flow, px, py, progress, text, tun) {
      var tb = text || [0.5, 0.5, 0.1, 0.1, 0];
      var tn = tun || [0, 0, 0];
      gl.uniform3f(L.uTun, tn[0], tn[1], tn[2]);
      gl.uniform4f(L.uText, tb[0], tb[1], tb[2], tb[3]);
      gl.uniform1f(L.uTextAmt, tb[4]);
      gl.uniform1f(L.uTime, t);
      gl.uniform1f(L.uFlow, flow);
      gl.uniform2f(L.uPointer, px, py);
      gl.uniform1f(L.uProgress, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy: function () { gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog); }
  };
}

export { create as createHeroGL };
