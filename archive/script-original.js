


/* ── DIAGNOSTIC CHECKLIST INTERACTION ── */
(function () {
  var diagItems = document.querySelectorAll('.diag-item');
  var diagCount = document.getElementById('diagCount');

  /* Stagger reveal on scroll */
  function revealDiagItems() {
    var winH = window.innerHeight;
    diagItems.forEach(function (item, i) {
      var top = item.getBoundingClientRect().top;
      if (top < winH - 60 && !item.classList.contains('revealed')) {
        setTimeout(function () { item.classList.add('revealed'); }, i * 100);
      }
    });
  }
  window.addEventListener('scroll', revealDiagItems);
  revealDiagItems();

  /* Click to toggle check */
  function updateCounter() {
    var checked = document.querySelectorAll('.diag-item.checked').length;
    if (diagCount) diagCount.textContent = checked;
  }
  diagItems.forEach(function (item) {
    item.addEventListener('click', function () {
      item.classList.toggle('checked');
      updateCounter();
    });
  });
})();

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



/* SERVIÇOS: hover troca imagem + ativa item */

const serviceItems = document.querySelectorAll('.service-item');

const serviceImg = document.getElementById('service-img');

serviceItems.forEach(item => {

  item.addEventListener('mouseenter', () => {

    serviceItems.forEach(el => el.classList.remove('active'));

    item.classList.add('active');

    if (serviceImg) {

      const newSrc = item.getAttribute('data-img');

      if (newSrc) {

        serviceImg.style.opacity = '0';

        setTimeout(() => { serviceImg.src = newSrc; serviceImg.style.opacity = '1'; }, 200);

      }

    }

  });

  item.addEventListener('mouseleave', () => {

    item.classList.remove('active');

    serviceItems[0].classList.add('active');

  });

});



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
  carouselItems.forEach(item => {
    const video = item.querySelector('.case-video-3d');
    if (video) {
      item.addEventListener('mouseenter', () => { video.play().catch(e => console.log("Auto-play bloqueado.")); });
      item.addEventListener('mouseleave', () => { video.pause(); });
    }
  });
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
  const transicaoTitle = document.querySelector('#transicao .title-medium');

  if (heroTitle) {
    heroTitle.dataset.originalHtml = heroTitle.innerHTML;
    // Trigger typewriter immediately for hero
    setTimeout(() => typeText(heroTitle, 40), 300);
  }

  if (transicaoTitle) {
    transicaoTitle.dataset.originalHtml = transicaoTitle.innerHTML;
    // Trigger via GSAP when scrolled into view
    ScrollTrigger.create({
      trigger: transicaoTitle,
      start: 'top 85%',
      onEnter: () => typeText(transicaoTitle, 40)
    });
  }

  // Floating Bento Parallax Logic
  const methodCards = document.querySelectorAll('.galilee-card');
  methodCards.forEach(card => {
    const visual = card.querySelector('.galilee-visual');
    const title = card.querySelector('.galilee-text h3');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Move elements independently based on mouse position within card
      if (visual) visual.style.transform = `translate3d(${x * 0.1}px, ${y * 0.1}px, 20px)`;
      if (title) title.style.transform = `translate3d(${x * 0.05}px, ${y * 0.05}px, 10px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset internal elements when mouse leaves
      if (visual) visual.style.transform = `translate3d(0, 0, 0)`;
      if (title) title.style.transform = `translate3d(0, 0, 0)`;
    });
  });
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

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

    loadGLTF('foguete.glb'),

    loadGLTF('astronaut.glb')

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

        // Sticky Servicos ScrollSwap
        const stItems = document.querySelectorAll('.service-item');
        const stImg = document.getElementById('service-img');
        stItems.forEach(item => {
          ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              stItems.forEach(el => el.classList.remove('active'));
              item.classList.add('active');
              if (stImg) {
                const newSrc = item.getAttribute('data-img');
                if (newSrc && !stImg.src.includes(newSrc)) {
                  stImg.style.opacity = '0';
                  setTimeout(() => { stImg.src = newSrc; stImg.style.opacity = '1'; }, 250);
                }
              }
            },
            onEnterBack: () => {
              stItems.forEach(el => el.classList.remove('active'));
              item.classList.add('active');
              if (stImg) {
                const newSrc = item.getAttribute('data-img');
                if (newSrc && !stImg.src.includes(newSrc)) {
                  stImg.style.opacity = '0';
                  setTimeout(() => { stImg.src = newSrc; stImg.style.opacity = '1'; }, 250);
                }
              }
            }
          });
        });

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

        // CEO Image Parallax
        gsap.fromTo('.ceo-cutout',
          { y: 80 },
          {
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: "#ceo",
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );

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
document.addEventListener('DOMContentLoaded', function () {
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
    { t: "SOPY", img: "sopy-print.png" },
    { t: "MP DISTRIBUIDORA", img: "mp-print.png" },
    { t: "NEXT EVENTOS", img: "next-print.png" },
    { t: "JOHNNY COOKER", img: "johny-print.png" },
    { t: "HYPE KBEAUTY", img: "kbeauty-print.png" },
    { t: "CAFE CARANDAI", img: "cafe-print.png" }
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
                vec3 finalColor = mix(tex.rgb, tex.rgb * 1.4, hoverEffect);

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

    meshes.forEach(mesh => {
      const isHov = hoveredMesh === mesh;
      mesh.material.uniforms.hoverEffect.value += ((isHov ? 1.0 : 0.0) - mesh.material.uniforms.hoverEffect.value) * 0.1;
    });

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
});


// ── Showreel: Lusion-style sticky scroll animation ──────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('canvas-showreel');
  if (!canvas || typeof THREE === 'undefined') return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();

  function makeCamera() {
    var W = window.innerWidth, H = window.innerHeight;
    var cam = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -100, 100);
    cam.position.z = 5;
    return cam;
  }
  var camera = makeCamera();

  function screenToWorld(sx, sy) {
    return new THREE.Vector2(sx - window.innerWidth / 2, window.innerHeight / 2 - sy);
  }
  function elWorldRect(id) {
    var el = document.getElementById(id);
    var rect = el.getBoundingClientRect();
    var tl = screenToWorld(rect.left, rect.top);
    return { x: tl.x, y: tl.y, width: rect.width, height: rect.height };
  }
  function rectToVec4(r) {
    return new THREE.Vector4(r.x, r.y, r.height, r.width);
  }

  // ── Shaders (identical to lusion reference) ────────────────────────────
  var vertexShader = [
    '#define PI 3.14159265358979',
    'uniform float animateProgress;',
    'uniform vec4 startRect;',
    'uniform vec4 endRect;',
    'varying vec2 vUv;',
    '',
    'vec2 rotateLocal(vec2 v, float a) {',
    '  float s = sin(a), c = cos(a);',
    '  return vec2(v.x*c - v.y*s, v.x*s + v.y*c);',
    '}',
    '',
    'vec2 getRectPos(vec4 rect, vec2 uv) {',
    '  vec2 pos;',
    '  pos.x = mix(rect.x, rect.x + rect.w, uv.x);',
    '  pos.y = mix(rect.y - rect.z, rect.y, uv.y);',
    '  return pos;',
    '}',
    '',
    'void main() {',
    '  float transitionWeight = 1.0 - (pow(uv.x * uv.x, 0.75) + pow(uv.y, 1.5)) / 2.0;',
    '  float localProgress = smoothstep(',
    '    transitionWeight * 0.3,',
    '    0.7 + transitionWeight * 0.3,',
    '    animateProgress',
    '  );',
    '  vec2 startPos = getRectPos(startRect, uv);',
    '  vec2 endPos   = getRectPos(endRect,   uv);',
    '  vec2 posXY    = mix(startPos, endPos, localProgress);',
    '  float width = mix(startRect.w, endRect.w, localProgress);',
    '  posXY.x += mix(width, 0.0, cos(localProgress * PI * 2.0) * 0.5 + 0.5) * 0.1;',
    '  float rot = (smoothstep(0.0, 1.0, localProgress) - localProgress) * -0.5;',
    '  posXY = rotateLocal(posXY, rot);',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(posXY, 0.0, 1.0);',
    '  vUv = uv;',
    '}'
  ].join('\n');

  var fragmentShader = [
    '#define REFERENCE_ASPECT 1.77777777778',
    'uniform float animateProgress;',
    'uniform vec4 startRect;',
    'uniform vec4 endRect;',
    'uniform sampler2D map;',
    'varying vec2 vUv;',
    '',
    'float roundedCornerMask(vec2 uv, float radius, float aspect) {',
    '  vec2 uvAspect = vec2(uv.x * aspect, uv.y);',
    '  vec2 q = abs(uvAspect - vec2(aspect * 0.5, 0.5)) - vec2(aspect * 0.5 - radius, 0.5 - radius);',
    '  float d = length(max(q, 0.0)) - radius;',
    '  return 1.0 - smoothstep(-0.008, 0.008, d);',
    '}',
    '',
    'float getAspect() {',
    '  float w = mix(startRect.w, endRect.w, animateProgress);',
    '  float h = mix(startRect.z, endRect.z, animateProgress);',
    '  return w / max(h, 0.0001);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = vUv;',
    '  float aspect = getAspect();',
    '  float aspectScale = (aspect / REFERENCE_ASPECT) - 1.0;',
    '  aspectScale /= max(aspect, 0.0001);',
    '  uv.y = mix(aspectScale, 1.0 - aspectScale, vUv.y);',
    '  uv.y = clamp(uv.y, 0.0, 1.0);',
    '  vec4 albedo = texture2D(map, uv);',
    '  float darken = mix(1.0, 0.45, animateProgress);',
    '  float currentRadius = mix(0.08, 0.02, animateProgress);',
    '  albedo.a = roundedCornerMask(vUv, currentRadius, aspect);',
    '  gl_FragColor = vec4(albedo.rgb * darken, albedo.a);',
    '}'
  ].join('\n');

  // ── Texture ──────────────────────────────────────────────────────────
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop');
  if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;

  // ── Mesh ─────────────────────────────────────────────────────────────
  var geo = new THREE.PlaneGeometry(1, 1, 64, 64);
  var uniforms = {
    animateProgress: { value: 0 },
    startRect: { value: new THREE.Vector4() },
    endRect: { value: new THREE.Vector4() },
    map: { value: texture }
  };
  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader,
    transparent: true, side: THREE.DoubleSide
  });
  var mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // ── Scroll logic ─────────────────────────────────────────────────────
  var scrollAnimStart = 0, scrollAnimEnd = 0;
  var sectionEl = document.getElementById('showreel-section');
  var uiLayer = document.getElementById('ui-layer');

  function recalcRects() {
    uniforms.startRect.value = rectToVec4(elWorldRect('video-start-anchor'));
    uniforms.endRect.value = rectToVec4(elWorldRect('video-end-anchor'));
  }

  function calcScrollPositions() {
    var rect = sectionEl.getBoundingClientRect();
    scrollAnimStart = rect.top + window.scrollY;
    scrollAnimEnd = scrollAnimStart + rect.height - window.innerHeight;
  }

  var targetProgress = 0, currentProgress = 0;
  var autoScrollRAF = null, userScrolling = false, scrollTimeout = null;
  var scrollDirection = 1, lastScrollY = window.scrollY;

  function stopAutoScroll() {
    if (autoScrollRAF) {
      if (typeof autoScrollRAF === 'number' && autoScrollRAF !== 1) {
        cancelAnimationFrame(autoScrollRAF);
      }
      // If Lenis is driving the scroll, stop it
      var lenis = window.__lenis;
      if (lenis && lenis.stop) lenis.stop();
      if (lenis && lenis.start) lenis.start();
      autoScrollRAF = null;
    }
  }

  function autoScrollTo(destY) {
    stopAutoScroll();
    // Use Lenis scrollTo if available (it handles smooth scroll properly)
    var lenis = window.__lenis;
    if (lenis && lenis.scrollTo) {
      lenis.scrollTo(destY, {
        duration: Math.min(Math.abs(destY - window.scrollY) * 0.0015, 1.2),
        easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
        onComplete: function () { autoScrollRAF = null; }
      });
      autoScrollRAF = 1; // flag to indicate auto-scroll is active
      return;
    }
    // Fallback: native scroll
    var startY = window.scrollY;
    var distance = destY - startY;
    var duration = Math.min(Math.abs(distance) * 1.5, 1200);
    var startTime = performance.now();
    function step(now) {
      if (userScrolling) return;
      var elapsed = now - startTime;
      var t = Math.min(elapsed / duration, 1);
      var ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, startY + distance * ease);
      if (t < 1) autoScrollRAF = requestAnimationFrame(step);
      else autoScrollRAF = null;
    }
    autoScrollRAF = requestAnimationFrame(step);
  }

  function handleUserInteraction() {
    userScrolling = true;
    stopAutoScroll();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      userScrolling = false;
      checkSnap();
    }, 150);
  }

  function checkSnap() {
    if (autoScrollRAF || userScrolling) return;
    if (window.scrollY > scrollAnimStart && window.scrollY < scrollAnimEnd) {
      var rawProgress = (window.scrollY - scrollAnimStart) / (scrollAnimEnd - scrollAnimStart);
      if (scrollDirection === 1) {
        if (rawProgress > 0.02) autoScrollTo(scrollAnimEnd);
        else autoScrollTo(scrollAnimStart);
      } else {
        if (rawProgress < 0.98) autoScrollTo(scrollAnimStart);
        else autoScrollTo(scrollAnimEnd);
      }
    }
  }

  function onScroll() {
    if (window.scrollY > lastScrollY) scrollDirection = 1;
    else if (window.scrollY < lastScrollY) scrollDirection = -1;
    lastScrollY = window.scrollY;

    targetProgress = THREE.MathUtils.clamp(
      THREE.MathUtils.inverseLerp(scrollAnimStart, scrollAnimEnd, window.scrollY), 0, 1
    );
    recalcRects();

    var sr = sectionEl.getBoundingClientRect();
    var inSection = sr.top < window.innerHeight && sr.bottom > 0;
    canvas.style.opacity = inSection ? '1' : '0';

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      userScrolling = false;
      checkSnap();
    }, 200);
  }

  window.addEventListener('wheel', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });
  window.addEventListener('touchmove', handleUserInteraction, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', function () {
    camera.left = -window.innerWidth / 2; camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2; camera.bottom = -window.innerHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    recalcRects(); calcScrollPositions(); onScroll();
  });

  function animate() {
    requestAnimationFrame(animate);
    currentProgress += (targetProgress - currentProgress) * 0.08;
    uniforms.animateProgress.value = currentProgress;

    if (uiLayer) {
      if (currentProgress > 0.7) {
        uiLayer.style.opacity = String((currentProgress - 0.7) * 3.33);
        uiLayer.style.pointerEvents = currentProgress > 0.95 ? 'auto' : 'none';
      } else {
        uiLayer.style.opacity = '0';
        uiLayer.style.pointerEvents = 'none';
      }
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(function () {
    recalcRects(); calcScrollPositions(); onScroll(); animate();
  });

});
