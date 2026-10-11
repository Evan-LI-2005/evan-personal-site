const profile = window.PROFILE;
const setText = (id, value) => { document.getElementById(id).textContent = value; };
setText('travel-date', profile.turkey.date);
setText('travel-title', profile.turkey.title);
setText('travel-description', profile.turkey.description);
profile.turkey.photos.forEach((photo, index) => {
  const figure = document.createElement('figure'); figure.className = 'travel-photo';
  const img = document.createElement('img'); img.src = photo.src; img.alt = photo.alt;
  img.width = photo.width; img.height = photo.height; img.loading = 'lazy'; img.decoding = 'async';
  const caption = document.createElement('figcaption');
  const title = document.createElement('h3'); title.textContent = `0${index + 1} / ${photo.title}`;
  const text = document.createElement('p'); text.textContent = photo.caption;
  caption.append(title, text); figure.append(img, caption); document.getElementById('travel-photos').append(figure);
});
setText('egypt-date', profile.egypt.date);
setText('egypt-title', profile.egypt.title);
setText('egypt-description', profile.egypt.description);
profile.egypt.photos.forEach((photo, index) => {
  const figure = document.createElement('figure'); figure.className = 'travel-photo';
  const img = document.createElement('img'); img.src = photo.src; img.alt = photo.alt;
  img.width = photo.width; img.height = photo.height; img.loading = 'lazy'; img.decoding = 'async';
  const caption = document.createElement('figcaption');
  const title = document.createElement('h3'); title.textContent = `0${index + 1} / ${photo.title}`;
  const text = document.createElement('p'); text.textContent = photo.caption;
  caption.append(title, text); figure.append(img, caption); document.getElementById('egypt-photos').append(figure);
});
document.title = `${profile.name} · 个人空间`;
['brand-name', 'hero-name', 'footer-name'].forEach(id => setText(id, profile.name));
setText('hero-role', profile.role); setText('hero-description', profile.description);
const portrait = document.getElementById('profile-portrait'); portrait.src = profile.portrait.src; portrait.alt = profile.portrait.alt; setText('portrait-caption', profile.portrait.caption);
setText('about-intro', profile.aboutIntro); setText('about-body', profile.aboutBody);
const personality = document.getElementById('personal-quote');
profile.quote.split('·').map(word => word.trim()).filter(Boolean).forEach((word, index) => {
  const row = document.createElement('span'); row.className = 'personality-word';
  const number = document.createElement('span'); number.className = 'personality-index'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span'); label.textContent = word;
  row.append(number, label); personality.append(row);
});
function tagList(target, tags) { target.replaceChildren(...tags.map(text => { const tag = document.createElement('span'); tag.textContent = text; return tag; })); }
tagList(document.getElementById('interests'), profile.interests);
profile.experiences.forEach((item, index) => {
  const row = document.createElement('article'); row.className = 'timeline-row';
  const date = document.createElement('p'); date.className = 'timeline-date'; date.textContent = item.date;
  const content = document.createElement('div'); content.className = 'timeline-content';
  const title = document.createElement('h3'); title.textContent = item.title;
  const organization = document.createElement('p'); organization.className = 'timeline-organization'; organization.textContent = item.organization;
  const description = document.createElement('p'); description.className = 'muted'; description.textContent = item.description;
  content.append(title, organization, description);
  if (item.photos?.length) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'experience-gallery-button'; button.textContent = '查看活动照片 ↗'; button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => openDetail({ category: item.date, title: item.title, description: item.organization, detail: item.description, photos: item.photos, tags: ['100 余人参与', '跨社团联谊', '活动统筹', '采购负责'] }, button));
    content.append(button);
  }
  const number = document.createElement('span'); number.className = 'timeline-number'; number.textContent = `0${index + 1}`;
  row.append(date, content, number); document.getElementById('timeline').append(row);
});
const dialog = document.getElementById('project-dialog'); let trigger;
function openDetail(project, source) {
    trigger = source; setText('dialog-category', project.category); setText('dialog-title', project.title);
    setText('dialog-description', project.description); setText('dialog-detail', project.detail);
    dialog.querySelector('.detail-photos')?.remove();
    if (project.photos?.length) {
      const gallery = document.createElement('div'); gallery.className = 'detail-photos';
      project.photos.forEach(photo => {
        if (photo.group) { const heading = document.createElement('h4'); heading.className = 'photo-group-title'; heading.textContent = photo.group; gallery.append(heading); }
        const figure = document.createElement('figure');
        const img = document.createElement('img'); img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy';
        const caption = document.createElement('figcaption'); caption.textContent = photo.caption;
        figure.append(img, caption); gallery.append(figure);
      });
      document.getElementById('dialog-detail').after(gallery);
    }
    tagList(document.getElementById('dialog-tags'), project.tags); dialog.showModal();
}
profile.projects.forEach(project => {
  const card = document.createElement('button'); card.type = 'button'; card.className = 'project-card'; card.setAttribute('aria-haspopup', 'dialog');
  const art = document.createElement('div'); art.className = `project-art ${project.art}`; art.setAttribute('aria-hidden', 'true');
  art.innerHTML = '<i></i><i></i><i></i><span>✳</span>';
  if (project.image) {
    art.replaceChildren(); art.classList.add('has-photo');
    const cover = document.createElement('img'); cover.src = project.image; cover.alt = ''; cover.loading = 'lazy'; if (project.imagePosition) cover.style.objectPosition = project.imagePosition; art.append(cover);
  }
  const body = document.createElement('div'); body.className = 'project-body';
  const category = document.createElement('p'); category.className = 'eyebrow'; category.textContent = project.category;
  const heading = document.createElement('h3'); heading.textContent = project.title;
  const arrow = document.createElement('span'); arrow.className = 'project-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
  const description = document.createElement('p'); description.className = 'muted'; description.textContent = project.description;
  body.append(category, heading, description, arrow); card.append(art, body);
  card.addEventListener('click', () => {
    openDetail(project, card);
  });
  document.getElementById('projects').append(card);
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => trigger?.focus());
const links = document.getElementById('contact-links');
[['email', '邮箱'], ['github', 'GitHub'], ['website', '个人主页']].forEach(([key, label]) => {
  const value = profile.contact[key]?.trim(); if (!value) return;
  let href;
  if (key === 'email') { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return; href = `mailto:${value}`; }
  else { try { const url = new URL(value); if (!['https:', 'http:'].includes(url.protocol)) return; href = url.href; } catch { return; } }
  const link = document.createElement('a'); link.href = href; link.className = 'contact-link'; link.textContent = `${label} ↗`; links.append(link);
});
setText('contact-note', profile.contact.note);
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('reveal-pending'); observer.observe(element); });
}

// 行星固定在原来的中心，仅改变朝向。拖动时停下自动转动。
const art = document.querySelector('.hero-art');
art.removeAttribute('aria-hidden');
art.querySelectorAll('.orbit, .sphere, .art-cross, .art-label, .art-coordinate, .floating-label').forEach(element => element.setAttribute('aria-hidden', 'true'));
const planet = document.createElement('div');
planet.className = 'interactive-planet';
planet.tabIndex = 0;
planet.setAttribute('role', 'group');
planet.setAttribute('aria-label', '互动天王星：按住鼠标左键拖动改变朝向，也可使用方向键；Home 键重置');
planet.append(...art.querySelectorAll('.orbit, .sphere'));
art.prepend(planet);
const renderPlanet3D = window.createPlanetRenderer(planet);
const hint = document.createElement('span');
hint.className = 'planet-hint'; hint.textContent = '按住拖动，探索不同朝向';
art.append(hint);
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let pitch = 0, yaw = 0, roll = 0, velocityX = 0, velocityY = 0;
let dragging = false, pointerId = null, lastX = 0, lastY = 0, lastTime = 0;
let frameId = null;
const clampPitch = value => Math.max(-48, Math.min(48, value));
function drawPlanet() {
  if (renderPlanet3D) { renderPlanet3D(pitch, yaw, roll); return; }
  planet.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg)`;
  // 球体始终保持圆形轮廓，星环随空间朝向变化。
  planet.querySelector('.sphere').style.transform = `rotateZ(${-roll}deg) rotateY(${-yaw}deg) rotateX(${-pitch}deg)`;
}
function animatePlanet(time) {
  frameId = null;
  const delta = Math.min((time - (lastTime || time)) / 1000, 0.05);
  lastTime = time;
  if (!dragging && !motionPreference.matches) {
    roll += delta * 2.5;
    yaw += velocityX * delta;
    pitch = clampPitch(pitch + velocityY * delta);
    const decay = Math.exp(-delta * 4);
    velocityX *= decay; velocityY *= decay;
  }
  drawPlanet();
  if (!document.hidden && !motionPreference.matches) frameId = requestAnimationFrame(animatePlanet);
}
function startAnimation() {
  if (frameId !== null) return;
  lastTime = 0;
  frameId = requestAnimationFrame(animatePlanet);
}
planet.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  dragging = true; pointerId = event.pointerId;
  lastX = event.clientX; lastY = event.clientY;
  velocityX = 0; velocityY = 0;
  planet.setPointerCapture(pointerId);
  planet.classList.add('is-dragging'); planet.classList.add('pointer-focused'); planet.focus({ preventScroll: true });
});
planet.addEventListener('pointermove', event => {
  if (!dragging || event.pointerId !== pointerId) return;
  const dx = event.clientX - lastX, dy = event.clientY - lastY;
  yaw += dx * 0.35; pitch = clampPitch(pitch - dy * 0.35);
  velocityX = Math.max(-90, Math.min(90, dx * 8));
  velocityY = Math.max(-90, Math.min(90, -dy * 8));
  lastX = event.clientX; lastY = event.clientY;
  drawPlanet();
});
function stopDragging(event) {
  if (event.pointerId !== pointerId) return;
  dragging = false; pointerId = null; planet.classList.remove('is-dragging');
  if (event.type === 'pointercancel') { velocityX = 0; velocityY = 0; }
}
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => planet.addEventListener(type, stopDragging));
planet.addEventListener('keydown', event => {
  planet.classList.remove('pointer-focused');
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
  event.preventDefault(); velocityX = 0; velocityY = 0;
  if (event.key === 'ArrowLeft') yaw -= 8;
  if (event.key === 'ArrowRight') yaw += 8;
  if (event.key === 'ArrowUp') pitch = clampPitch(pitch + 8);
  if (event.key === 'ArrowDown') pitch = clampPitch(pitch - 8);
  if (event.key === 'Home') { pitch = 0; yaw = 0; roll = 0; }
  drawPlanet();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (frameId !== null) cancelAnimationFrame(frameId); frameId = null; }
  else startAnimation();
});
motionPreference.addEventListener('change', () => {
  velocityX = 0; velocityY = 0;
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null; startAnimation();
});
startAnimation();
