// ===== NAVIGATION =====
(function(){
  var nav = document.getElementById('nav');
  var navLinks = document.querySelector('.nav-links');
  var toggle = document.getElementById('navToggle');
  var ticking = false;

  // Mobile nav toggle — full-screen overlay with body scroll lock
  if (toggle && navLinks) {
    toggle.addEventListener('click', function(){
      var isOpen = navLinks.classList.toggle('open');
      // Lock body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close mobile menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on Escape key
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll: apple-style fixed nav, only add scrolled class for backdrop
  window.addEventListener('scroll', function(){
    if (!ticking) {
      requestAnimationFrame(function(){
        if (nav) {
          if (window.pageYOffset > 0) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
(function(){
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function observe(selector) {
    document.querySelectorAll(selector).forEach(function(el){ observer.observe(el); });
  }

  function observeAnimations(container) {
    var elems = (typeof container === 'string' ? document.querySelector(container) : container);
    if (!elems) return;
    elems.querySelectorAll(
      '.anim-fade-up, .anim-fade-in, .anim-scale-in, .anim-slide-left, .anim-slide-right, .timeline-item'
    ).forEach(function(el){ observer.observe(el); });
  }

  // Observe on every page
  document.addEventListener('DOMContentLoaded', function(){
    // Observe timeline items
    var timeline = document.querySelector('.timeline');
    if (timeline) {
      timeline.querySelectorAll('.timeline-item').forEach(function(item, i){
        item.style.transitionDelay = (i * 0.12) + 's';
      });
    }

    // Observe all animated elements
    observeAnimations(document.body);

    // Re-observe when tag filter changes visibility
    var filterTags = document.getElementById('filterTags');
    if (filterTags) {
      filterTags.addEventListener('click', function(){
        setTimeout(function(){ observeAnimations(document.body); }, 100);
      });
    }
  });

  // Expose globally
  window.observeAnimations = observeAnimations;
  window.observeNew = observe;
})();

// ===== PROJECT FILTER =====
(function(){
  var pf = document.getElementById('projectFilters');
  if (!pf) return;
  pf.addEventListener('click', function(e){
    var btn = e.target.closest('.filter-tag');
    if (!btn) return;
    pf.querySelectorAll('.filter-tag').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
  });
})();
