// script.js - three.js background object (simple gear-like torus)
// Uses three.js r128 (loaded via CDN in index.html)
(function() {
  // Ensure three is loaded
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('gearCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // Torus + small teeth (approach: using torus + noise to look mechanical)
  const torusGeo = new THREE.TorusGeometry(2.0, 0.4, 32, 120);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00c6ff, metalness: 0.8, roughness: 0.25, emissive: 0x002f3a, emissiveIntensity: 0.1 });
  const torus = new THREE.Mesh(torusGeo, mat);
  scene.add(torus);

  // add an inner ring to give visual depth
  const inner = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.12, 16, 100), new THREE.MeshStandardMaterial({ color:0x00ffb2, metalness:0.6, roughness:0.35 }));
  inner.rotation.x = 0.6;
  scene.add(inner);

  // lights
  const p1 = new THREE.PointLight(0xffffff, 1.0);
  p1.position.set(5,5,5);
  scene.add(p1);
  const p2 = new THREE.PointLight(0x00c6ff, 0.6);
  p2.position.set(-4,2,3);
  scene.add(p2);
  const amb = new THREE.AmbientLight(0x111318, 0.8);
  scene.add(amb);

  // subtle camera movement by pointer
  let pointer = {x:0,y:0};
  window.addEventListener('pointermove', (e)=> {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.x = nx * 0.15;
    pointer.y = ny * 0.12;
  });

  // animate
  function animate(){
    requestAnimationFrame(animate);
    torus.rotation.x += 0.007;
    torus.rotation.y += 0.0045;
    inner.rotation.y -= 0.006;
    // parallax camera shift
    camera.position.x += (pointer.x - camera.position.x) * 0.02;
    camera.position.y += (-pointer.y - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  // resize handler
  window.addEventListener('resize', ()=> {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });
})();
