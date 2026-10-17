(function () {
  // Active l'animation d'entrée des cartes (voir styles.css : `.feature-card`
  // est visible par défaut sans cette classe, pour ne jamais dépendre du JS).
  document.documentElement.classList.add('js');

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Étoiles discrètes dans le ciel de fond
  var starsLayer = document.querySelector('.stars');
  if (starsLayer) {
    for (var i = 0; i < 26; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      s.style.top = Math.random() * 70 + '%';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      starsLayer.appendChild(s);
    }
  }

  // Apparition des cartes au scroll
  var cards = document.querySelectorAll('.feature-card');
  if (cards.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { io.observe(c); });
    // Filet de sécurité : si l'observer ne déclenche jamais (capture
    // automatisée sans vrai scroll, navigateur capricieux), le contenu
    // reste visible de toute façon plutôt que bloqué à opacity:0.
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.add('visible'); });
    }, 2000);
  } else {
    cards.forEach(function (c) { c.classList.add('visible'); });
  }
})();
