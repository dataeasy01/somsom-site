(function () {
  var SUPABASE_URL = 'https://jhnobdghbazbxuejcipv.supabase.co';
  // Clé publique "anon" — volontairement visible côté client, comme dans
  // l'app mobile. Sécurisée par la policy RLS `waitlist_signups_insert_public`
  // (écriture seule, aucune lecture publique possible avec cette clé).
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impobm9iZGdoYmF6Ynh1ZWpjaXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MTc2MTYsImV4cCI6MjEwNzM5MzYxNn0.oVDKQn_sARTQ_LwhCHkQvrAsL5-tsJ_iVS7jJn0quZs';

  var form = document.getElementById('waitlist-form');
  if (!form) return;

  var emailInput = document.getElementById('waitlist-email');
  var submitBtn = document.getElementById('waitlist-submit');
  var msg = document.getElementById('waitlist-msg');

  function setMsg(text, kind) {
    msg.textContent = text || '';
    msg.className = 'waitlist-msg' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (emailInput.value || '').trim();
    if (!email || email.indexOf('@') === -1) {
      setMsg('Entre une adresse email valide.', 'error');
      emailInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';
    setMsg('');

    fetch(SUPABASE_URL + '/rest/v1/waitlist_signups', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email: email, language: navigator.language || null }),
    })
      .then(function (res) {
        // 201 = créé, 409 = déjà inscrit (email unique) — les deux comptent
        // comme un succès du point de vue de la personne qui s'inscrit.
        if (res.ok || res.status === 409) {
          window.location.href = 'merci.html';
          return;
        }
        throw new Error('HTTP ' + res.status);
      })
      .catch(function () {
        setMsg("Échec de l'inscription — réessaie dans un instant.", 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = "M'avertir";
      });
  });

  // CTA sticky mobile : apparaît après le hero, disparaît une fois le
  // formulaire lui-même visible (inutile de pointer vers quelque chose déjà
  // à l'écran).
  var sticky = document.getElementById('sticky-cta');
  if (sticky && 'IntersectionObserver' in window) {
    var hero = document.querySelector('.hero');
    var heroDone = false;
    var formVisible = false;

    function refresh() {
      sticky.classList.toggle('visible', heroDone && !formVisible);
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroDone = !entry.isIntersecting;
        refresh();
      });
    }, { threshold: 0 }).observe(hero);

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        formVisible = entry.isIntersecting;
        refresh();
      });
    }, { threshold: 0.3 }).observe(form);
  }
})();
