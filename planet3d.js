// 透视光线与真实球面、星环平面求交，不旋转二维贴片。
window.createPlanetRenderer = function (host) {
  const canvas = document.createElement('canvas');
  canvas.className = 'planet-canvas'; canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return null;
  const vertex = `attribute vec2 point; varying vec2 uv;
    void main(){uv=point;gl_Position=vec4(point,0.,1.);}`;
  const fragment = `precision highp float;
    varying vec2 uv; uniform vec2 size; uniform vec3 angle;
    mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
    mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
    mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
    float hitSphere(vec3 o,vec3 d){float b=dot(o,d);float h=b*b-dot(o,o)+1.;if(h<0.)return 1000.;return -b-sqrt(h);}
    void main(){
      vec2 p=uv; p.x*=size.x/size.y;
      vec3 eye=vec3(0.,0.,5.);
      vec3 ray=normalize(vec3(p*.33,-1.));
      mat3 inv=rz(-angle.z)*ry(-angle.y)*rx(-angle.x);
      vec3 o=inv*eye,d=inv*ray;
      vec3 light=normalize(vec3(.65,.65,1.));
      float sphereT=hitSphere(eye,ray);
      vec3 color=vec3(0.);float alpha=0.;
      if(sphereT<999.){
        vec3 point=eye+ray*sphereT;vec3 normal=normalize(point);vec3 local=inv*normal;
        float diffuse=max(dot(normal,light),0.);
        float latitude=dot(local,normalize(vec3(.87,.4,.25)));
        float bands=sin(latitude*32.+sin(local.x*8.)*.25)*.012+sin(latitude*71.)*.004;
        vec3 base=vec3(.38,.58,.61)+bands;
        color=base*(.10+.86*pow(diffuse,.8));
        float rim=pow(1.-max(dot(normal,-ray),0.),3.);
        color+=vec3(.18,.34,.40)*rim*.12;
        color+=vec3(.035)*pow(max(dot(reflect(-light,normal),-ray),0.),24.);
        alpha=1.;
      }
      vec3 ringNormal=normalize(vec3(.87,.4,.25));
      float denom=dot(d,ringNormal);
      if(abs(denom)>.0001){
        float t=-dot(o,ringNormal)/denom;
        vec3 q=o+d*t;float radius=length(q);
        float width=.0035;
        float rings=(1.-smoothstep(width,width+.003,abs(radius-1.27)))*.42;
        rings=max(rings,(1.-smoothstep(width,width+.003,abs(radius-1.36)))*.60);
        rings=max(rings,(1.-smoothstep(.006,.009,abs(radius-1.47)))*.82);
        if(t>0.&&rings>.001&&t<sphereT){
          vec3 world=eye+ray*t;
          float shade=.28+.72*clamp((dot(normalize(world),light)+1.)*.5,0.,1.);
          vec3 ringColor=mix(vec3(.20,.30,.37),vec3(.68,.77,.75),shade);
          float b=dot(world,light),h=b*b-dot(world,world)+1.;
          if(h>0.&&-b-sqrt(h)>0.)ringColor*=.22;
          color=mix(color,ringColor,rings);alpha=rings+alpha*(1.-rings);
          if(alpha>0.)color/=alpha;
        }
      }
      gl_FragColor=vec4(color,alpha);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  let program;
  try {
    program = gl.createProgram(); gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch { return null; }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, 'point'); gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  const angleUniform = gl.getUniformLocation(program, 'angle');
  const sizeUniform = gl.getUniformLocation(program, 'size');
  host.append(canvas); host.classList.add('has-3d');
  let latest = [0,0,0];
  function render(x,y,z) {
    latest=[x,y,z];
    const ratio=Math.min(devicePixelRatio || 1,2);
    const width=Math.round(host.clientWidth*ratio),height=Math.round(host.clientHeight*ratio);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    gl.viewport(0,0,width,height);gl.uniform2f(sizeUniform,width,height);
    gl.uniform3f(angleUniform,x*Math.PI/180,y*Math.PI/180,z*Math.PI/180);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  new ResizeObserver(()=>render(...latest)).observe(host);
  canvas.addEventListener('webglcontextlost', event=>{event.preventDefault();host.classList.remove('has-3d');});
  return render;
};
