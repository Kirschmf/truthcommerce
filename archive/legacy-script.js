/* SCROLL REVEAL */

function reveal() {

  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {

    var windowHeight = window.innerHeight;

    var elementTop = reveals[i].getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) { reveals[i].classList.add("active"); }

  }

}

window.addEventListener("scroll", reveal); reveal();







/* LÓGICA DO FAQ (ACCORDION) COM GSAP */

document.addEventListener('DOMContentLoaded', () => {

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerInner = item.querySelector('.faq-answer-inner');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-open');

      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('faq-open')) {
          otherItem.classList.remove('faq-open');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherInner = otherItem.querySelector('.faq-answer-inner');
          gsap.to(otherAnswer, { height: 0, duration: 0.4, ease: "power2.inOut" });
          gsap.to(otherInner, { autoAlpha: 0, y: -10, duration: 0.2 });
        }
      });

      if (!isOpen) {
        item.classList.add('faq-open');
        gsap.fromTo(answer, { height: 0 }, { height: "auto", duration: 0.5, ease: "power2.out" });
        gsap.fromTo(answerInner, { autoAlpha: 0, y: -15 }, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" });
      } else {
        item.classList.remove('faq-open');
        gsap.to(answer, { height: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(answerInner, { autoAlpha: 0, y: -10, duration: 0.2 });
      }
    });
  });

  /* SERVIÇOS: hover troca imagem + ativa item */
  const serviceItems = document.querySelectorAll('.service-item');
  const serviceImg = document.getElementById('service-img');

  // Initial State: First item active by default
  if (serviceItems.length > 0 && serviceImg) {
    const firstItem = serviceItems[0];
    firstItem.classList.add('active');
    serviceImg.src = firstItem.getAttribute('data-img');
    serviceImg.style.opacity = '1';
  }

  serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      serviceItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      if (serviceImg) {
        const newSrc = item.getAttribute('data-img');
        if (newSrc && serviceImg.src !== newSrc) {
          // Smooth transition for image swap
          gsap.to(serviceImg, {
            opacity: 0, duration: 0.2, onComplete: () => {
              serviceImg.src = newSrc;
              gsap.to(serviceImg, { opacity: 1, duration: 0.3 });
            }
          });
        }
      }
    });

    item.addEventListener('mouseleave', () => {
      // Keep it active or the user can choose. 
      // User requested the first one visible on load, usually implies we stay on the current one.
    });
  });

  /* MAGNÉTIC BUTTONS LOGIC */
  const magneticBtns = document.querySelectorAll('.btn.primary');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const hc = rect.left + rect.width / 2;
      const vc = rect.top + rect.height / 2;

      // Max pull distance
      const pullX = (e.clientX - hc) * 0.3;
      const pullY = (e.clientY - vc) * 0.3;

      gsap.to(btn, {
        x: pullX,
        y: pullY,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  /* OLD CAROUSEL VIDEO LOGIC (COMMENTED OUT)
  const carouselItems = document.querySelectorAll('.carousel-item');
  carouselItems.forEach(item => { ... });
  */

});


/* ── VIDEO SLIDER: removed — replaced by Lusion dep panel ── */





/* MOBILE MENU LOGIC */
(function () {
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('mobileOverlay');
  const close = document.getElementById('menuClose');
  const mobileLinks = overlay ? overlay.querySelectorAll('.mobile-link, .mobile-cta') : [];

  function openMenu() {
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();









// Initialize Lenis Smooth Scroll
window.__lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Integrate Lenis with GSAP ScrollTrigger
window.__lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  window.__lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Typewriter Text Reveal Logic
function typeText(element, speed = 40) {
  if (element.dataset.typed) return;
  element.dataset.typed = "true";

  const originalText = element.innerText;
  element.innerText = ""; // Clear text for typing effect

  let iteration = 0;
  let interval = setInterval(() => {
    // Show substring of text plus a cursor block during typing
    element.innerText = originalText.substring(0, iteration) + "|";
    iteration++;

    if (iteration > originalText.length) {
      clearInterval(interval);
      // Restore original HTML perfectly (in case of internal spans like .accent)
      element.innerHTML = element.dataset.originalHtml;
    }
  }, speed);
}

// Apply to Titles
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector('.hero-title');

  if (heroTitle) {
    heroTitle.dataset.originalHtml = heroTitle.innerHTML;
    setTimeout(() => typeText(heroTitle, 40), 300);
  }
});



/*
 
 * =====================================================
 
 *  GLB → PARTICLE CLOUD  |  30,000 Points
 
 *  Scroll-Morphing: Rocket → Earth → Astronaut
 
 * =====================================================
 
 *  ⚠️  Run via Live Server to avoid CORS errors.
 
 * =====================================================
 
 */

document.addEventListener('DOMContentLoaded', function () {

  var wrapper = document.getElementById('canvas-3d-wrapper');

  if (!wrapper || typeof THREE === 'undefined') return;



  /* ── SCENE ── */

  var W = wrapper.offsetWidth || 400;

  var H = wrapper.offsetHeight || 400;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);

  camera.position.set(0, 0, 15);



  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(W, H);

  wrapper.appendChild(renderer.domElement);



  /* ── GLOW SPRITE (Alta Resolução) ── */

  var cs = 1024;

  var cv = document.createElement('canvas');

  cv.width = cv.height = cs;

  var ctx = cv.getContext('2d');

  var grd = ctx.createRadialGradient(cs / 2, cs / 2, 0, cs / 2, cs / 2, cs / 2);

  grd.addColorStop(0.0, 'rgba(255,255,255,1)');

  grd.addColorStop(0.15, 'rgba(255,255,255,0.9)');

  grd.addColorStop(0.4, 'rgba(255,255,255,0.3)');

  grd.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = grd;

  ctx.fillRect(0, 0, cs, cs);

  var glowTex = new THREE.CanvasTexture(cv);

  glowTex.minFilter = THREE.LinearMipMapLinearFilter;



  /* ── CONSTANTS ── */

  var N = 30000;

  var cGreen = new THREE.Color('#07dd2b');
  var cWhite = new THREE.Color('#ffffff');
  var cTemp = new THREE.Color();



  var particleGroup = new THREE.Group();

  scene.add(particleGroup);

  particleGroup.rotation.z = -0.3;

  particleGroup.rotation.x = 0.15;


  /* Initial position/scale set by GSAP matchMedia below */



  /* ── EXTRACT SHAPE DATA FROM GLTF (returns {positions, colors}) ── */

  function extractShapeData(gltf, colorScheme) {

    var triangles = [];

    var totalArea = 0;

    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, minZ = 1e9, maxZ = -1e9;



    gltf.scene.updateMatrixWorld(true);



    gltf.scene.traverse(function (child) {

      if (!child.isMesh || !child.geometry) return;

      var geo = child.geometry.clone();

      geo.applyMatrix4(child.matrixWorld);

      if (geo.index) geo = geo.toNonIndexed();

      var pos = geo.attributes.position;

      if (!pos || pos.count < 3) return;



      geo.computeBoundingBox();

      var bb = geo.boundingBox;

      var extX = bb.max.x - bb.min.x;

      var extY = bb.max.y - bb.min.y;

      var extZ = bb.max.z - bb.min.z;

      var maxHoriz = Math.max(extX, extZ);



      var meshName = child.name || '';

      if (maxHoriz > 20 || extY > 20) return;

      if (meshName.includes('Text') || meshName.includes('Backdrop') || meshName.includes('Side')) return;



      for (var i = 0; i < pos.count; i += 3) {

        var ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);

        var bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1);

        var cx = pos.getX(i + 2), cy = pos.getY(i + 2), cz = pos.getZ(i + 2);



        var abx = bx - ax, aby = by - ay, abz = bz - az;

        var acx = cx - ax, acy = cy - ay, acz = cz - az;

        var crossX = aby * acz - abz * acy;

        var crossY = abz * acx - abx * acz;

        var crossZ = abx * acy - aby * acx;

        var area = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ) * 0.5;



        if (area > 0.00001) {

          triangles.push([ax, ay, az, bx, by, bz, cx, cy, cz, area]);

          totalArea += area;

          if (ax < minX) minX = ax; if (bx < minX) minX = bx; if (cx < minX) minX = cx;

          if (ax > maxX) maxX = ax; if (bx > maxX) maxX = bx; if (cx > maxX) maxX = cx;

          if (ay < minY) minY = ay; if (by < minY) minY = by; if (cy < minY) minY = cy;

          if (ay > maxY) maxY = ay; if (by > maxY) maxY = by; if (cy > maxY) maxY = cy;

          if (az < minZ) minZ = az; if (bz < minZ) minZ = bz; if (cz < minZ) minZ = cz;

          if (az > maxZ) maxZ = az; if (bz > maxZ) maxZ = bz; if (cz > maxZ) maxZ = cz;

        }

      }

    });



    if (triangles.length === 0) { console.error('No triangles in model.'); return null; }

    console.log('[' + colorScheme + '] Triangles:', triangles.length, '| Area:', totalArea.toFixed(2));



    var sizeX = maxX - minX || 1;

    var sizeY = maxY - minY || 1;

    var cenX = (maxX + minX) / 2, cenY = (maxY + minY) / 2, cenZ = (maxZ + minZ) / 2;

    var scale = 5.5 / sizeY;



    var positions = new Float32Array(N * 3);

    var colors = new Float32Array(N * 3);



    var cdf = new Float32Array(triangles.length);

    var runSum = 0;

    for (var k = 0; k < triangles.length; k++) {

      runSum += triangles[k][9];

      cdf[k] = runSum;

    }



    for (var i = 0; i < N; i++) {

      var rnd = Math.random() * totalArea;

      var lo = 0, hi = triangles.length - 1;

      while (lo < hi) {

        var mid = (lo + hi) >> 1;

        if (cdf[mid] < rnd) lo = mid + 1; else hi = mid;

      }

      var t = triangles[lo];



      var r1 = Math.random(), r2 = Math.random();

      if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }



      var px = (t[0] + r1 * (t[3] - t[0]) + r2 * (t[6] - t[0]) - cenX) * scale;

      var py = (t[1] + r1 * (t[4] - t[1]) + r2 * (t[7] - t[1]) - cenY) * scale;

      var pz = (t[2] + r1 * (t[5] - t[2]) + r2 * (t[8] - t[2]) - cenZ) * scale;



      positions[i * 3] = px;

      positions[i * 3 + 1] = py;

      positions[i * 3 + 2] = pz;



      /* ── COLOR BY SCHEME ── */

      var halfW = (sizeX * scale) * 0.5;

      var normalizedY = (py - (-2.75 * scale)) / (5.5 * scale);

      if (normalizedY < 0) normalizedY = 0;

      if (normalizedY > 1) normalizedY = 1;



      if (colorScheme === 'rocket') {
        var flameCutoff = 0.22;
        if (normalizedY < flameCutoff) {
          var flameIntensity = 1.0 - (normalizedY / flameCutoff);
          cTemp.copy(cGreen);
          var sp = 0.8 + flameIntensity * 0.2 + Math.random() * 0.1;
          colors[i * 3] = cTemp.r * sp; colors[i * 3 + 1] = cTemp.g * sp; colors[i * 3 + 2] = cTemp.b * sp;
        } else {
          var sp = 0.95 + Math.random() * 0.3;
          colors[i * 3] = sp; colors[i * 3 + 1] = sp; colors[i * 3 + 2] = sp;
        }
      } else if (colorScheme === 'astronaut') {
        /* Bright White Astronaut + Green Accents */
        var noise = Math.sin(i * 12.9898 + 78.233) * 0.5 + 0.5;
        var visorZone = normalizedY > 0.65 && normalizedY < 0.85;

        if (visorZone && Math.random() > 0.3) {
          /* Bright green visor */
          cTemp.copy(cGreen);
          var sp = 0.6 + Math.random() * 0.4;
          colors[i * 3] = cTemp.r * sp; colors[i * 3 + 1] = cTemp.g * sp; colors[i * 3 + 2] = cTemp.b * sp;
        } else if (noise > 0.88) {
          /* Neon green edge glow */
          cTemp.copy(cGreen);
          colors[i * 3] = cTemp.r * 0.8; colors[i * 3 + 1] = cTemp.g * 0.8; colors[i * 3 + 2] = cTemp.b * 0.8;
        } else {
          /* Pure White/Bright Silver body */
          var sp = 0.85 + Math.random() * 0.15;
          colors[i * 3] = sp; colors[i * 3 + 1] = sp; colors[i * 3 + 2] = sp;
        }
      }

    }



    return { positions: positions, colors: colors };

  }



  /* ── LOAD 2 MODELS VIA Promise.all (Rocket + Astronaut) ── */

  var loader = new THREE.GLTFLoader();

  function loadGLTF(url) {

    return new Promise(function (resolve, reject) {

      loader.load(url, resolve,

        function (xhr) { if (xhr.total) console.log(url + ': ' + Math.round(xhr.loaded / xhr.total * 100) + '%'); },

        reject

      );

    });

  }



  /* ── STATE ── */

  var shape1Pos, shape1Col, shape2Pos, shape2Col;

  var basePositions = null;

  var velocities = null;

  var cloudReady = false;

  var scatterNoise = null;



  /* ── MORPH STATE ── */

  var morphState = { progress: 0 };

  var scatterStrength = 8.0;



  Promise.all([

    loadGLTF('assets/models/foguete.glb'),

    loadGLTF('assets/models/astronaut.glb')

  ]).then(function (results) {

    var rocketData = extractShapeData(results[0], 'rocket');

    var astronautData = extractShapeData(results[1], 'astronaut');



    if (!rocketData || !astronautData) {

      console.error('Failed to extract shape data from models.');

      return;

    }



    shape1Pos = rocketData.positions; shape1Col = rocketData.colors;

    shape2Pos = astronautData.positions; shape2Col = astronautData.colors;



    /* Create Points mesh with rocket data initially */

    var initPositions = new Float32Array(shape1Pos);

    var initColors = new Float32Array(shape1Col);

    var cloudGeo = new THREE.BufferGeometry();

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(initPositions, 3));

    cloudGeo.setAttribute('color', new THREE.BufferAttribute(initColors, 3));



    var cloudMat = new THREE.PointsMaterial({

      size: 0.09,

      map: glowTex,

      vertexColors: true,

      transparent: true,

      opacity: 1,

      blending: THREE.AdditiveBlending,

      depthWrite: false,

      sizeAttenuation: true

    });



    particleGroup.add(new THREE.Points(cloudGeo, cloudMat));



    /* Base positions + drift velocities */

    basePositions = new Float32Array(shape1Pos);

    velocities = new Float32Array(N * 3);

    for (var v = 0; v < N * 3; v++) {

      velocities[v] = (Math.random() - 0.5) * 0.005;

    }



    /* Precompute deterministic scatter noise per particle */

    scatterNoise = new Float32Array(N * 3);

    for (var s = 0; s < N; s++) {

      scatterNoise[s * 3] = Math.sin(s * 1234.5678) * 2.0 - 1.0;

      scatterNoise[s * 3 + 1] = Math.cos(s * 2345.6789) * 2.0 - 1.0;

      scatterNoise[s * 3 + 2] = Math.sin(s * 3456.7890 + 1.23) * 2.0 - 1.0;

    }



    cloudReady = true;

    console.log('Rocket + Astronaut particle shapes loaded: ' + N + ' points each.');



    /* ── GSAP SCROLLTRIGGER: RESPONSIVE TRAJECTORY ── */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      var mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
      }, function (context) {
        var isDesktop = context.conditions.isDesktop;
        var isMobile = context.conditions.isMobile;

        // 1. SET INITIAL POSITIONS BASED ON DEVICE
        if (isMobile) {
          particleGroup.position.set(1.5, -2.8, 0); // Start low and to the right
          particleGroup.scale.set(1.0, 1.0, 1.0);
          particleGroup.rotation.z = 0.6; // Tilt: base right, tip left
        } else {
          particleGroup.position.set(4.0, -0.5, 0); // Right side for Desktop Hero
          particleGroup.scale.set(1.5, 1.5, 1.5);
        }

        var mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-wrapper',
            start: 'top top',
            endTrigger: '#alerta',
            end: 'center center',
            scrub: 1.0
          }
        });

        // Morph Shape (Same for both)
        mainTimeline.to(morphState, { progress: 1, duration: 1, ease: 'power2.inOut' }, 0);

        // Hero AutoAlpha Fade
        gsap.fromTo('.hero-content',
          { autoAlpha: 1, scale: 1 },
          {
            scrollTrigger: {
              trigger: '.hero-wrapper',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.0
            },
            autoAlpha: 0,
            scale: 0.9,
            ease: 'power1.out'
          }
        );

        // Sticky Servicos ScrollSwap removed as per user request (hover only)


        // 2. MOVE TRAJECTORY BASED ON DEVICE
        if (isMobile) {
          // On mobile, move to bottom-center (below the Alerta text)
          mainTimeline.to(particleGroup.position, { x: 0, y: -2.0, duration: 1, ease: 'power2.inOut' }, 0);
        } else {
          // On desktop, move from right to left
          mainTimeline.to(particleGroup.position, { x: -4.0, y: -1, duration: 1, ease: 'power2.inOut' }, 0);
        }

        // Rotation based on device
        if (isMobile) {
          // Straighten astronaut on mobile (remove diagonal tilt)
          mainTimeline.to(particleGroup.rotation, { x: 0, z: 0, duration: 1, ease: 'power2.inOut' }, 0);
        } else {
          // Straighten rotation on desktop
          mainTimeline.to(particleGroup.rotation, { x: 0, z: 0, duration: 1, ease: 'power2.inOut' }, 0);
        }

        // Footer Parallax Title
        gsap.fromTo('.bgword',
          { y: -150 },
          {
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: ".footer",
              start: "top bottom",
              end: "bottom bottom",
              scrub: true
            }
          }
        );

        // Protocolo Bento Glow
        gsap.utils.toArray('.bento-item').forEach(function (item) {
          ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            onEnter: () => item.classList.add('is-active'),
            onLeaveBack: () => item.classList.remove('is-active')
          });
        });


        /* OLD STACKING CARDS SCROLLTRIGGER (COMMENTED OUT)
        if (isMobile) {
          const mobileCards = gsap.utils.toArray('.mobile-stacking-card');
          const container = document.querySelector('.stacking-cards-container');
          mobileCards.forEach((card, index) => { ... });
        }
        */

        return function () {
          // Cleanup when resizing across breakpoints
        };
      });
    }

  }).catch(function (err) {

    console.error('Failed to load GLB models:', err);

  });



  /* ── WINDOW-LEVEL MOUSE TRACKING (works across entire screen) ── */

  var raycaster = new THREE.Raycaster();

  var mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  var mouseNDC = new THREE.Vector2(-999, -999);

  var localMouse = new THREE.Vector3();

  var isHovering = false;

  var inverseMatrix = new THREE.Matrix4();

  var planeHit = new THREE.Vector3();



  window.addEventListener('mousemove', function (e) {

    var rect = wrapper.getBoundingClientRect();

    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;

    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    isHovering = true;

  });



  window.addEventListener('mouseleave', function () {

    isHovering = false;

  });



  /* ── PHYSICS TUNING ── */

  var hoverRadius = 1.0;

  var pushStrength = 0.08;

  var springK = 0.04;



  /* ── ANIMATE: Morphing + Scatter + Organic Drift + Elastic Repulsion ── */

  function animate() {

    requestAnimationFrame(animate);

    /* No rotation — astronaut stands still */



    if (cloudReady && particleGroup.children.length > 0) {

      var points = particleGroup.children[0];

      var posAttr = points.geometry.attributes.position;

      var colAttr = points.geometry.attributes.color;

      var arr = posAttr.array;

      var colArr = colAttr.array;



      /* ── MORPH: Rocket (0) → Astronaut (1) ── */

      var p = morphState.progress;

      var localProgress = Math.max(0, Math.min(p, 1));

      var fromPos = shape1Pos, toPos = shape2Pos;

      var fromCol = shape1Col, toCol = shape2Col;



      /* Dynamic blending: Additive (glow on dark) → Normal (dark on light) */

      var mat = points.material;

      if (localProgress > 0.5) {

        if (mat.blending !== THREE.NormalBlending) {

          mat.blending = THREE.NormalBlending;

          mat.opacity = 0.9;

          mat.needsUpdate = true;

        }

      } else {

        if (mat.blending !== THREE.AdditiveBlending) {

          mat.blending = THREE.AdditiveBlending;

          mat.opacity = 1;

          mat.needsUpdate = true;

        }

      }



      /* Scatter multiplier: peaks at midway, zero at endpoints */

      var scatter = Math.sin(localProgress * Math.PI) * scatterStrength;



      /* Convert mouse to particleGroup local space */

      if (isHovering) {

        raycaster.setFromCamera(mouseNDC, camera);

        if (raycaster.ray.intersectPlane(mousePlane, planeHit)) {

          particleGroup.updateMatrixWorld();

          inverseMatrix.copy(particleGroup.matrixWorld).invert();

          localMouse.copy(planeHit).applyMatrix4(inverseMatrix);

        }

      }



      for (var i = 0; i < N; i++) {

        var ix = i * 3, iy = ix + 1, iz = ix + 2;



        /* Lerp target position between shapes */

        var bx = fromPos[ix] + (toPos[ix] - fromPos[ix]) * localProgress;

        var by = fromPos[iy] + (toPos[iy] - fromPos[iy]) * localProgress;

        var bz = fromPos[iz] + (toPos[iz] - fromPos[iz]) * localProgress;



        /* Add deterministic scatter noise (stardust explosion) */

        bx += scatterNoise[ix] * scatter;

        by += scatterNoise[iy] * scatter;

        bz += scatterNoise[iz] * scatter;



        /* Lerp colors */

        colArr[ix] = fromCol[ix] + (toCol[ix] - fromCol[ix]) * localProgress;

        colArr[iy] = fromCol[iy] + (toCol[iy] - fromCol[iy]) * localProgress;

        colArr[iz] = fromCol[iz] + (toCol[iz] - fromCol[iz]) * localProgress;



        var cx = arr[ix], cy = arr[iy], cz = arr[iz];

        var vx = velocities[ix], vy = velocities[iy], vz = velocities[iz];



        /* 1. ORGANIC DRIFT: add per-particle velocity */

        cx += vx;

        cy += vy;

        cz += vz;



        /* 2. REPULSION: 2D distance (dx, dy) ignoring Z for Vue-like feel */

        if (isHovering) {

          var dx = cx - localMouse.x;

          var dy = cy - localMouse.y;

          var dist = Math.sqrt(dx * dx + dy * dy);



          if (dist < hoverRadius && dist > 0.001) {

            var force = (1.0 - dist / hoverRadius);

            var invDist = 1.0 / dist;

            cx += dx * invDist * force * pushStrength;

            cy += dy * invDist * force * pushStrength;

          }

        }



        /* 3. ELASTIC SPRING: pull back to morphed base position */

        cx += (bx - cx) * springK;

        cy += (by - cy) * springK;

        cz += (bz - cz) * springK;



        arr[ix] = cx;

        arr[iy] = cy;

        arr[iz] = cz;

      }



      posAttr.needsUpdate = true;

      colAttr.needsUpdate = true;

    }



    renderer.render(scene, camera);

  }

  animate();



  /* ── RESIZE ── */

  window.addEventListener('resize', function () {

    var w = wrapper.offsetWidth, h = wrapper.offsetHeight;

    if (!w || !h) return;

    camera.aspect = w / h;

    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

  });

});





// ── CARROSSEL 3D — código EXATO do CARROUSEL.HTML ───────────────────────
window.addEventListener('load', function () {
  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040507, 0.00001);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 20000);

  const carouselGroup = new THREE.Group();
  scene.add(carouselGroup);

  const radius = 3500;
  const cardW = 1100;
  const cardH = 620;

  const cases = [
    { t: "SOPY", img: "assets/images/sopy-print.png" },
    { t: "MP DISTRIBUIDORA", img: "assets/images/mp-print.png" },
    { t: "NEXT EVENTOS", img: "assets/images/next-print.png" },
    { t: "JOHNNY COOKER", img: "assets/images/johny-print.png" },
    { t: "HYPE KBEAUTY", img: "assets/images/kbeauty-print.png" },
    { t: "CAFE CARANDAI", img: "assets/images/cafe-print.png" }
  ];

  const fullCases = [...cases, ...cases, ...cases];
  const totalItems = fullCases.length;

  const textureLoader = new THREE.TextureLoader();
  const meshes = [];

  const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

  const fragmentShader = `
            uniform sampler2D map; uniform float hoverEffect; varying vec2 vUv;
            void main() {
                vec2 uv = vUv;

                if (!gl_FrontFacing) {
                    uv.x = 1.0 - uv.x;
                }

                vec4 tex = texture2D(map, uv);
                vec3 finalColor = tex.rgb;

                if (gl_FrontFacing) {
                    finalColor *= 0.15;
                }

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

  fullCases.forEach((c, i) => {
    const angle = (i / totalItems) * Math.PI * 2;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: textureLoader.load(c.img) },
        hoverEffect: { value: 0.0 }
      },
      vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide
    });

    const geo = new THREE.CylinderGeometry(radius, radius, cardH, 32, 1, true, angle - (cardW / radius) / 2, cardW / radius);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { ...c };

    carouselGroup.add(mesh);
    meshes.push(mesh);
  });

  // ── SATELLITE PARTICLE CLOUD (center of ring) ─────────────────────────
  var SAT_N = 20000;
  var satelliteGroup = new THREE.Group();
  satelliteGroup.renderOrder = -1; // Render behind cards
  scene.add(satelliteGroup);
  var satCloudReady = false;
  var satVelocities = null;
  var satBasePositions = null;
  var satScatterNoise = null;

  // Glow sprite texture
  var satCS = 512;
  var satCV = document.createElement('canvas');
  satCV.width = satCV.height = satCS;
  var satCtx = satCV.getContext('2d');
  var satGrd = satCtx.createRadialGradient(satCS / 2, satCS / 2, 0, satCS / 2, satCS / 2, satCS / 2);
  satGrd.addColorStop(0.0, 'rgba(255,255,255,1)');
  satGrd.addColorStop(0.15, 'rgba(255,255,255,0.9)');
  satGrd.addColorStop(0.4, 'rgba(255,255,255,0.3)');
  satGrd.addColorStop(1.0, 'rgba(0,0,0,0)');
  satCtx.fillStyle = satGrd;
  satCtx.fillRect(0, 0, satCS, satCS);
  var satGlowTex = new THREE.CanvasTexture(satCV);
  satGlowTex.minFilter = THREE.LinearMipMapLinearFilter;

  var satGreen = new THREE.Color('#07dd2b');
  var satTemp = new THREE.Color();

  function extractSatelliteData(gltf) {
    var triangles = [];
    var totalArea = 0;
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, minZ = 1e9, maxZ = -1e9;

    gltf.scene.rotation.set(0, 91, 0);
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse(function (child) {
      if (!child.isMesh || !child.geometry) return;
      var geo = child.geometry.clone();
      geo.applyMatrix4(child.matrixWorld);
      if (geo.index) geo = geo.toNonIndexed();
      var pos = geo.attributes.position;
      if (!pos || pos.count < 3) return;

      geo.computeBoundingBox();
      var bb = geo.boundingBox;
      var extX = bb.max.x - bb.min.x;
      var extY = bb.max.y - bb.min.y;
      var extZ = bb.max.z - bb.min.z;
      var maxHoriz = Math.max(extX, extZ);

      var meshName = child.name || '';
      if (maxHoriz > 50 || extY > 50) return;
      if (meshName.includes('Text') || meshName.includes('Backdrop') || meshName.includes('Side')) return;

      for (var i = 0; i < pos.count; i += 3) {
        var ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
        var bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1);
        var cx = pos.getX(i + 2), cy = pos.getY(i + 2), cz = pos.getZ(i + 2);

        var abx = bx - ax, aby = by - ay, abz = bz - az;
        var acx = cx - ax, acy = cy - ay, acz = cz - az;
        var crossX = aby * acz - abz * acy;
        var crossY = abz * acx - abx * acz;
        var crossZ = abx * acy - aby * acx;
        var area = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ) * 0.5;

        if (area > 0.00001) {
          triangles.push([ax, ay, az, bx, by, bz, cx, cy, cz, area]);
          totalArea += area;
          if (ax < minX) minX = ax; if (bx < minX) minX = bx; if (cx < minX) minX = cx;
          if (ax > maxX) maxX = ax; if (bx > maxX) maxX = bx; if (cx > maxX) maxX = cx;
          if (ay < minY) minY = ay; if (by < minY) minY = by; if (cy < minY) minY = cy;
          if (ay > maxY) maxY = ay; if (by > maxY) maxY = by; if (cy > maxY) maxY = cy;
          if (az < minZ) minZ = az; if (bz < minZ) minZ = bz; if (cz < minZ) minZ = cz;
          if (az > maxZ) maxZ = az; if (bz > maxZ) maxZ = bz; if (cz > maxZ) maxZ = cz;
        }
      }
    });

    if (triangles.length === 0) { console.error('No triangles in satellite model.'); return null; }
    console.log('[satellite] Triangles:', triangles.length, '| Area:', totalArea.toFixed(2));

    var sizeY = maxY - minY || 1;
    var cenX = (maxX + minX) / 2, cenY = (maxY + minY) / 2, cenZ = (maxZ + minZ) / 2;
    var scale = 1500 / sizeY; // Scale to ~1500 units for a larger satellite inside the ring

    var positions = new Float32Array(SAT_N * 3);
    var colors = new Float32Array(SAT_N * 3);

    var cdf = new Float32Array(triangles.length);
    var runSum = 0;
    for (var k = 0; k < triangles.length; k++) {
      runSum += triangles[k][9];
      cdf[k] = runSum;
    }

    for (var i = 0; i < SAT_N; i++) {
      var rnd = Math.random() * totalArea;
      var lo = 0, hi = triangles.length - 1;
      while (lo < hi) {
        var mid = (lo + hi) >> 1;
        if (cdf[mid] < rnd) lo = mid + 1; else hi = mid;
      }
      var t = triangles[lo];
      var r1 = Math.random(), r2 = Math.random();
      if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }

      var px = (t[0] + r1 * (t[3] - t[0]) + r2 * (t[6] - t[0]) - cenX) * scale;
      var py = (t[1] + r1 * (t[4] - t[1]) + r2 * (t[7] - t[1]) - cenY) * scale;
      var pz = (t[2] + r1 * (t[5] - t[2]) + r2 * (t[8] - t[2]) - cenZ) * scale;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // Color: white/silver body with sporadic green accents
      var noise = Math.sin(i * 12.9898 + 78.233) * 0.5 + 0.5;
      if (noise > 0.85) {
        satTemp.copy(satGreen);
        var sp = 0.6 + Math.random() * 0.4;
        colors[i * 3] = satTemp.r * sp;
        colors[i * 3 + 1] = satTemp.g * sp;
        colors[i * 3 + 2] = satTemp.b * sp;
      } else {
        var sp = 0.85 + Math.random() * 0.15;
        colors[i * 3] = sp;
        colors[i * 3 + 1] = sp;
        colors[i * 3 + 2] = sp;
      }
    }

    return { positions: positions, colors: colors };
  }

  // Load satellite model
  var satLoader = new THREE.GLTFLoader();
  satLoader.load('assets/models/satellite.glb', function (gltf) {
    var satData = extractSatelliteData(gltf);
    if (!satData) return;

    var satGeo = new THREE.BufferGeometry();
    var satPositions = new Float32Array(satData.positions);
    satGeo.setAttribute('position', new THREE.BufferAttribute(satPositions, 3));
    satGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(satData.colors), 3));

    var satMat = new THREE.PointsMaterial({
      size: 20,
      map: satGlowTex,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      sizeAttenuation: true
    });

    satelliteGroup.add(new THREE.Points(satGeo, satMat));

    // Store base positions and init drift velocities
    satBasePositions = new Float32Array(satData.positions);
    satVelocities = new Float32Array(SAT_N * 3);
    for (var v = 0; v < SAT_N * 3; v++) {
      satVelocities[v] = (Math.random() - 0.5) * 0.05; // Reduced from 0.8 to match hero scene proportions
    }

    // Precompute scatter noise (deterministic per particle, like rocket morph)
    satScatterNoise = new Float32Array(SAT_N * 3);
    for (var sn = 0; sn < SAT_N; sn++) {
      satScatterNoise[sn * 3] = Math.sin(sn * 1234.5678) * 2.0 - 1.0;
      satScatterNoise[sn * 3 + 1] = Math.cos(sn * 2345.6789) * 2.0 - 1.0;
      satScatterNoise[sn * 3 + 2] = Math.sin(sn * 3456.7890 + 1.23) * 2.0 - 1.0;
    }

    satCloudReady = true;
    console.log('Satellite particle cloud loaded:', SAT_N, 'points');
  }, undefined, function (err) {
    console.error('Failed to load satelite.glb:', err);
  });

  // ==========================================
  // SATELLITE CONSTANTS (Synced with Hero Scene)
  var satSpringK = 0.04;        // Matched hero spring feel
  var satScatterStrength = 1200;
  var satHoverRadius = 400;     // Reduced from 1000 to be more local
  var satPushStrength = 8;      // Matched hero push feel relative to scale

  // Mouse tracking for satellite repulsion
  var satRaycaster = new THREE.Raycaster();
  var satMousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  var satLocalMouse = new THREE.Vector3();
  var satInverseMatrix = new THREE.Matrix4();
  var satPlaneHit = new THREE.Vector3();
  var satMouseActive = false;
  // ==========================================
  // 3. A JORNADA (GSAP SCROLLTRIGGER)
  // ==========================================
  let camProxy = {
    y: 4000,
    z: 8000,
    lookY: 0,
    lookZ: 0,
    tilt: 0.20,
    fogDensity: 0.00001,
    hudOpacity: 0
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#carousel-section",
      start: "top top",
      end: "+=6000",
      scrub: 1.5,
      pin: true
    }
  });

  // FASE 1: O MERGULHO
  tl.to(camProxy, {
    y: 0,
    z: -500,
    lookY: 0,
    lookZ: -4000,
    tilt: 0,
    fogDensity: 0.0001,
    hudOpacity: 1,
    duration: 1.5,
    ease: "power2.inOut"
  });

  // FASE 2: EXPLORAÇÃO
  tl.to({}, { duration: 1.5 });

  // FASE 3: A SAÍDA
  tl.to(camProxy, {
    y: 4000,
    z: 8000,
    lookY: 0,
    lookZ: 0,
    tilt: 0.20,
    fogDensity: 0.00001,
    hudOpacity: 0,
    duration: 1.5,
    ease: "power2.inOut"
  });

  // ==========================================
  // 4. INTERAÇÃO E RENDER
  // ==========================================
  let ringRotation = 0;
  let targetRingRotation = 0;
  let isDragging = false;
  let startX = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  const modal = document.getElementById('modal');

  // Scroll wheel rotates the ring when inside the carousel
  window.addEventListener('wheel', (e) => {
    if (camProxy.hudOpacity > 0.5) {
      targetRingRotation += e.deltaY * 0.0008;
    }
  }, { passive: true });

  // Drag to rotate
  window.addEventListener('mousedown', e => {
    if (camProxy.hudOpacity > 0.8) {
      isDragging = true; startX = e.clientX;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      targetRingRotation += (e.clientX - startX) * 0.002;
      startX = e.clientX;
    }
  });

  // Click on card to open modal
  window.addEventListener('click', () => {
    if (hoveredMesh && camProxy.hudOpacity > 0.8 && !modal.classList.contains('active')) {
      document.getElementById('modal-img').src = hoveredMesh.userData.img;
      document.getElementById('modal-title').textContent = hoveredMesh.userData.t;
      modal.classList.add('active');
    }
  });

  document.querySelector('.modal-close').addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.remove('active');
  });

  function animate() {
    requestAnimationFrame(animate);

    camera.position.set(0, camProxy.y, camProxy.z);
    camera.lookAt(0, camProxy.lookY, camProxy.lookZ);
    scene.fog.density = camProxy.fogDensity;
    carouselGroup.rotation.x = camProxy.tilt;
    document.getElementById('carousel-hud').style.opacity = camProxy.hudOpacity;

    let autoSpinSpeed = camProxy.hudOpacity > 0.8 ? 0.0003 : 0.003;
    if (!isDragging) targetRingRotation -= autoSpinSpeed;
    ringRotation += (targetRingRotation - ringRotation) * 0.06;
    carouselGroup.rotation.y = ringRotation;

    if (camProxy.hudOpacity > 0.8 && !modal.classList.contains('active')) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        hoveredMesh = intersects[0].object;
        canvas.style.cursor = 'pointer';
      } else {
        hoveredMesh = null;
        canvas.style.cursor = 'default';
      }
    } else {
      hoveredMesh = null;
    }

    // ── SATELLITE: scatter + rotation + drift + mouse repulsion ──
    if (satCloudReady && satelliteGroup.children.length > 0) {
      var satPoints = satelliteGroup.children[0];
      var satMaterial = satPoints.material;

      // Scatter strength driven by hudOpacity (0=formed, 1=fully scattered)
      var satScatter = camProxy.hudOpacity * satScatterStrength;

      // Fade opacity slightly at full scatter so particles dissolve
      var satOpacity = 1.0 - Math.max(0, (camProxy.hudOpacity - 0.6) * 2.5);
      satMaterial.opacity = Math.max(0, satOpacity);

      // Slow idle rotation
      satelliteGroup.rotation.y += 0.002;
      satelliteGroup.rotation.x = 0;

      // Mouse repulsion: logic unified with rocket/astronaut
      satMouseActive = false;
      if (camProxy.hudOpacity < 0.5) {
        satRaycaster.setFromCamera(mouse, camera);
        if (satRaycaster.ray.intersectPlane(satMousePlane, satPlaneHit)) {
          satelliteGroup.updateMatrixWorld();
          satInverseMatrix.copy(satelliteGroup.matrixWorld).invert();
          satLocalMouse.copy(satPlaneHit).applyMatrix4(satInverseMatrix);

          // Only activate if mouse is actually near the satellite (NDC check or distance)
          if (Math.abs(mouse.x) < 0.95 && Math.abs(mouse.y) < 0.95) {
            satMouseActive = true;
          }
        }
      }

      // Per-particle: scatter + drift + mouse repulsion + spring return
      var satPosAttr = satPoints.geometry.attributes.position;
      var satArr = satPosAttr.array;
      for (var si = 0; si < SAT_N; si++) {
        var six = si * 3, siy = six + 1, siz = six + 2;

        // Target position = base + scatter noise
        var targetX = satBasePositions[six] + satScatterNoise[six] * satScatter;
        var targetY = satBasePositions[siy] + satScatterNoise[siy] * satScatter;
        var targetZ = satBasePositions[siz] + satScatterNoise[siz] * satScatter;

        // Organic drift
        satArr[six] += satVelocities[six];
        satArr[siy] += satVelocities[siy];
        satArr[siz] += satVelocities[siz];

        // Mouse repulsion (2D: x, y)
        if (satMouseActive) {
          var mdx = satArr[six] - satLocalMouse.x;
          var mdy = satArr[siy] - satLocalMouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < satHoverRadius && mdist > 0.1) {
            var mforce = (1.0 - mdist / satHoverRadius);
            var minvDist = 1.0 / mdist;
            satArr[six] += mdx * minvDist * mforce * satPushStrength;
            satArr[siy] += mdy * minvDist * mforce * satPushStrength;
          }
        }

        // Spring return to target (base + scatter)
        satArr[six] += (targetX - satArr[six]) * satSpringK;
        satArr[siy] += (targetY - satArr[siy]) * satSpringK;
        satArr[siz] += (targetZ - satArr[siz]) * satSpringK;
      }
      satPosAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
});


// ── Showreel LERP animation + YouTube IFrame API ─────────────────────────
(function () {
  var track      = document.getElementById('showreel');
  var videoWrap  = document.getElementById('sr-video-wrap');
  var introLayer = document.getElementById('sr-intro');
  var uiLayer    = document.getElementById('sr-ui');
  var playBtn    = document.querySelector('.sr-play-btn');
  if (!track || !videoWrap) return;

  // ── YouTube Player ──────────────────────────────────
  var ytPlayer    = null;
  var ytReady     = false;
  var shouldPlay  = false;

  function initYT() {
    if (typeof YT === 'undefined' || !YT.Player) {
      setTimeout(initYT, 100);
      return;
    }
    ytPlayer = new YT.Player('sr-yt-player', {
      videoId: '_-AS5DtDeqs',
      playerVars: {
        controls: 0, showinfo: 0, rel: 0,
        modestbranding: 1, playsinline: 1,
        iv_load_policy: 3, disablekb: 1,
        mute: 1, loop: 1, playlist: '_-AS5DtDeqs',
        enablejsapi: 1,
      },
      events: {
        onReady: function (e) {
          ytReady = true;
          e.target.mute();
          if (shouldPlay) e.target.playVideo();
        }
      }
    });
  }

  // Trigger after DOM + YT API both ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYT);
  } else {
    initYT();
  }

  // ── LERP Scroll ─────────────────────────────────────
  var isMob = window.innerWidth <= 768;
  var startW, startH, endW, endH;
  function setBreakpoint() {
    isMob  = window.innerWidth <= 768;
    startW = isMob ? 82 : 45;  startH = isMob ? 28 : 35;
    endW   = isMob ? 92 : 88;  endH   = isMob ? 72 : 82;
  }
  setBreakpoint();

  var targetP = 0, currentP = 0, ease = 0.08;
  var animEnd = 0.45, animDone = false;

  function captureScroll() {
    var rect = track.getBoundingClientRect();
    var raw  = -rect.top / (track.offsetHeight - window.innerHeight);
    targetP = Math.min(Math.max(raw, 0), 1);
  }
  window.addEventListener('scroll', captureScroll, { passive: true });
  if (window.__lenis) window.__lenis.on('scroll', captureScroll);
  captureScroll();

  // ── Play button ──────────────────────────────────────
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (ytPlayer && ytReady) { ytPlayer.seekTo(0, true); ytPlayer.playVideo(); }
      uiLayer.style.opacity       = '0';
      uiLayer.style.pointerEvents = 'none';
      uiLayer.classList.add('sr-ui-playing');
    });
  }

  // ── Render loop ──────────────────────────────────────
  var ytWrapper = videoWrap.querySelector('.sr-yt-wrapper');

  function renderLoop() {
    currentP += (targetP - currentP) * ease;

    var expansion = Math.min(currentP / animEnd, 1);
    var ep = 1 - Math.pow(1 - expansion, 3);

    videoWrap.style.width        = (startW + (endW - startW) * ep) + 'vw';
    videoWrap.style.height       = (startH + (endH - startH) * ep) + 'vh';
    videoWrap.style.borderRadius = (28 + (20 - 28) * ep) + 'px';

    var introFade = Math.min(currentP / (animEnd * 0.6), 1);
    introLayer.style.opacity   = Math.max(1 - introFade * 1.5, 0);
    introLayer.style.transform = 'translateY(' + (introFade * 140) + 'px) scale(' + (1 - introFade * 0.04) + ')';

    if (ytWrapper) ytWrapper.style.opacity = 0.2 + 0.8 * ep;

    // Start video once when animation finishes (only once)
    if (!animDone && ep >= 0.98) {
      animDone = true; shouldPlay = true;
      if (ytPlayer && ytReady) ytPlayer.playVideo();
    }

    // Dashboard UI
    if (!uiLayer.classList.contains('sr-ui-playing')) {
      var uiO = currentP > animEnd * 0.9
        ? Math.min((currentP - animEnd * 0.9) / 0.06, 1) : 0;
      uiLayer.style.opacity       = uiO;
      uiLayer.style.pointerEvents = uiO > 0.5 ? 'auto' : 'none';
    }

    requestAnimationFrame(renderLoop);
  }

  window.addEventListener('resize', function () { setBreakpoint(); captureScroll(); }, { passive: true });
  requestAnimationFrame(renderLoop);
})();

/* =========================================
   PAGE BACKGROUND — canvas único, campo estelar virtual
========================================= */

(function () {
  const cv  = document.getElementById('bg-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  // Paleta de nebulosas — verde da marca (#07dd2b)
  const NEBULA_COLORS = [
    [7,  221, 43],   // verde vivo
    [5,  160, 30],   // verde médio
    [10, 255, 70],   // verde claro
    [3,  120, 20],   // verde escuro
    [20, 200, 100],  // verde-esmeralda
    [30, 230, 80],   // verde-teal
  ];

  let W, H, totalH;
  let scrollY = 0;
  let stars  = [];
  let clouds = [];

  /* ── Scroll: compatível com Lenis ── */
  function trackScroll() {
    if (window.__lenis) {
      window.__lenis.on('scroll', ({ scroll }) => { scrollY = scroll; });
    }
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  }

  /* ── Resize ── */
  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
    totalH = Math.max(document.body.scrollHeight, window.innerHeight);
    buildStars();
    buildClouds();
  }

  /* ── Estrelas distribuídas pela altura total virtual ── */
  function buildStars() {
    const count = Math.round((W * totalH) / 6000);
    stars = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * totalH,
      r:  Math.random() * 1.4 + 0.2,
      o:  Math.random() * 0.7 + 0.15,
      do: (Math.random() - 0.5) * 0.009,
      dx: (Math.random() - 0.5) * 0.06,
      dy: (Math.random() - 0.5) * 0.025,
    }));
  }

  /* ── Nebulosas distribuídas em zonas ao longo da página ── */
  function buildClouds() {
    const zones = Math.ceil(totalH / H) + 1;
    clouds = [];
    for (let z = 0; z < zones; z++) {
      // 2–3 nuvens por zona de viewport
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const yBase = z * H + Math.random() * H;
        clouds.push(newCloud(yBase));
      }
    }
    // Stagger inicial — evita que todas apareçam ao mesmo tempo
    clouds.forEach(cl => {
      cl.a   = Math.random() * cl.ta * 0.8;
      cl.dir = Math.random() < 0.5 ? 1 : -1;
    });
  }

  function newCloud(y) {
    const col  = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)];
    const maxR = Math.max(W, H) * (0.2 + Math.random() * 0.4);
    return {
      x:   Math.random() * W,
      y:   y !== undefined ? y : Math.random() * totalH,
      rx:  maxR * (0.5 + Math.random() * 0.5),
      ry:  maxR * (0.25 + Math.random() * 0.4),
      rot: Math.random() * Math.PI * 2,
      maxR,
      a:   0,
      ta:  0.04 + Math.random() * 0.05,
      da:  0.00025 + Math.random() * 0.00025,
      dir: 1,
      r:   Math.max(0, col[0] + Math.floor((Math.random() - 0.5) * 18)),
      g:   Math.max(0, col[1] + Math.floor((Math.random() - 0.5) * 18)),
      b:   Math.max(0, col[2] + Math.floor((Math.random() - 0.5) * 18)),
    };
  }

  /* ── Loop de renderização ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const sy = scrollY;

    // --- Nebulosas ---
    for (let i = clouds.length - 1; i >= 0; i--) {
      const cl = clouds[i];
      const sy2 = cl.y - sy;

      // Culling: fora da tela (com margem do maior raio)
      if (sy2 < -(cl.maxR * 2) || sy2 > H + cl.maxR * 2) {
        // Ainda anima opacity para quando entrar em foco
        cl.a = Math.max(0, cl.a - cl.da);
        continue;
      }

      cl.a += cl.da * cl.dir;
      if (cl.dir ===  1 && cl.a >= cl.ta) cl.dir = -1;
      if (cl.dir === -1 && cl.a <= 0) {
        // Reinicia a nuvem em nova posição aleatória na página
        clouds[i] = newCloud();
        clouds[i].a = 0;
        continue;
      }

      ctx.save();
      ctx.translate(cl.x, sy2);
      ctx.rotate(cl.rot);
      ctx.scale(cl.rx / cl.maxR, cl.ry / cl.maxR);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, cl.maxR);
      g.addColorStop(0,    `rgba(${cl.r},${cl.g},${cl.b},${cl.a})`);
      g.addColorStop(0.35, `rgba(${cl.r},${cl.g},${cl.b},${cl.a * 0.6})`);
      g.addColorStop(0.65, `rgba(${cl.r},${cl.g},${cl.b},${cl.a * 0.2})`);
      g.addColorStop(1,    `rgba(${cl.r},${cl.g},${cl.b},0)`);
      ctx.beginPath();
      ctx.arc(0, 0, cl.maxR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    // --- Estrelas ---
    for (const s of stars) {
      const sy2 = s.y - sy;
      if (sy2 < -10 || sy2 > H + 10) {
        // Drift continua mesmo fora da tela
        s.x += s.dx; s.y += s.dy;
        if (s.x > W) s.x = 0; if (s.x < 0) s.x = W;
        if (s.y > totalH) s.y = 0; if (s.y < 0) s.y = totalH;
        continue;
      }

      // Twinkle
      s.o += s.do;
      if (s.o > 0.92 || s.o < 0.07) s.do *= -1;

      // Drift
      s.x += s.dx; s.y += s.dy;
      if (s.x > W) s.x = 0; if (s.x < 0) s.x = W;
      if (s.y > totalH) s.y = 0; if (s.y < 0) s.y = totalH;

      // Halo para estrelas maiores
      if (s.r > 1.0) {
        const gr = ctx.createRadialGradient(s.x, sy2, 0, s.x, sy2, s.r * 3.5);
        gr.addColorStop(0, `rgba(200,215,255,${s.o * 0.45})`);
        gr.addColorStop(1, `rgba(200,215,255,0)`);
        ctx.beginPath();
        ctx.arc(s.x, sy2, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x, sy2, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,215,255,${s.o})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  /* ── Extensão quando o JS expande a página após o load ── */
  function extendIfGrown() {
    const newH = Math.max(document.body.scrollHeight, window.innerHeight);
    if (newH <= totalH) return;
    const prevH = totalH;
    totalH = newH;

    // Adiciona estrelas só para a zona nova (sem rebuild — sem flicker)
    const extra = Math.round((W * (newH - prevH)) / 6000);
    for (let i = 0; i < extra; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  prevH + Math.random() * (newH - prevH),
        r:  Math.random() * 1.4 + 0.2,
        o:  Math.random() * 0.7 + 0.15,
        do: (Math.random() - 0.5) * 0.009,
        dx: (Math.random() - 0.5) * 0.06,
        dy: (Math.random() - 0.5) * 0.025,
      });
    }

    // Adiciona nebulosas para as novas zonas
    const newZones = Math.ceil((newH - prevH) / H);
    for (let z = 0; z < newZones; z++) {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        clouds.push(newCloud(prevH + z * H + Math.random() * H));
      }
    }
  }

  /* ── Init ── */
  let _started = false;
  function start() {
    if (_started) return;
    _started = true;
    resize();
    draw();
  }

  window.addEventListener('resize', resize, { passive: true });
  trackScroll();

  window.addEventListener('load', () => {
    start();
    // Three.js / GSAP expandem a página depois do load — rechecamos em cascata
    setTimeout(extendIfGrown, 400);
    setTimeout(extendIfGrown, 1200);
    setTimeout(extendIfGrown, 3000);
  });
  if (document.readyState === 'complete') start();

})();
