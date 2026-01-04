// Update navbar padding on window resize and load
function updateNavbarPadding() {
  const navbarHeight = parseInt($('#main-navbar').css('height')) || 0;
  $('body').css('padding-top', navbarHeight);
}

$(window).on('resize', updateNavbarPadding);
$(window).on('load', updateNavbarPadding);

// Initialize scroll listener
$(document).on('scroll', onScroll);

// Handle active tab on navigation click
$('#menu-center li').on('click', function() {
  $('#menu-center li').removeClass('active');
  $(this).addClass('active');
});

// Smooth scroll to sections
$('a[href^="#"]').on('click', function(e) {
  e.preventDefault();
  $(document).off('scroll');

  // Remove active class from all links
  $('#menu-center a').parent().removeClass('active');
  $(this).parent().addClass('active');

  const target = this.hash;
  const $target = $(target);
  
  if ($target.length) {
    $('html, body').stop().animate({
      scrollTop: $target.offset().top
    }, 800, 'swing', function() {
      window.location.hash = target;
      $(document).on('scroll', onScroll);
    });
  }
});

// Handle active navigation based on scroll position
function onScroll(event) {
  const scrollPos = $(document).scrollTop() + 100; // Offset for navbar
  
  $('#menu-center a').each(function() {
    const $currLink = $(this);
    const refElement = $currLink.attr('href');
    const $refElement = $(refElement);
    
    if ($refElement.length) {
      const elementTop = $refElement.offset().top;
      const elementHeight = $refElement.outerHeight();
      
      if (elementTop <= scrollPos && elementTop + elementHeight > scrollPos) {
        $('#menu-center li').removeClass('active');
        $currLink.parent().addClass('active');
      }
    }
  });
}

// CGPA Count Animation
function initCGPAAnimation() {
  const cgpaElement = $('.cgpa-value');
  let hasAnimated = false;

  function startCGPACount() {
    if (hasAnimated || cgpaElement.length === 0) return;

    hasAnimated = true;
    const targetValue = 9.2;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;

    function animateCount() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
      
      cgpaElement.text(currentValue.toFixed(1));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        cgpaElement.text(targetValue.toFixed(1));
      }
    }

    animateCount();
  }

  // Use Intersection Observer to trigger animation when element comes into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCGPACount();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    cgpaElement.each(function() {
      observer.observe(this);
    });
  } else {
    // Fallback for older browsers - start animation on load
    $(window).on('load', startCGPACount);
  }
}

// Initialize CGPA animation when document is ready
$(document).ready(function() {
  initCGPAAnimation();
  initLeadershipMouseAnimation();
  initStatisticsCounter();
});

// Leadership Section Mouse Animation
function initLeadershipMouseAnimation() {
  const leadershipCards = document.querySelectorAll('.leadership-card, .achievement-card');

  leadershipCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });

    // Tilt effect on mouse move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const rotateX = ((mouseY - centerY) / centerY) * 5;
      const rotateY = ((centerX - mouseX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-8px)';
    });
  });
}

// Statistics Counter Animation
function initStatisticsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  function animateStats() {
    if (hasAnimated) return;
    hasAnimated = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target')) || 0;
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;

      function updateCount() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

        stat.textContent = currentValue + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + '+';
        }
      }

      updateCount();
    });
  }

  // Trigger animation when stats come into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.statistics-container');
    if (statsContainer) {
      observer.observe(statsContainer);
    }
  } else {
    // Fallback
    $(window).on('load', animateStats);
  }
}