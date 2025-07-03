document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.main-navbar');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarSupportedContent');
  const mainContentWrapper = document.getElementById('main-content-wrapper');
  const body = document.body;

  // --- Utility Functions ---

  // Dynamically calculate scroll offset for fixed navbar
  const getScrollOffset = () => {
    // Approximate navbar height, if it changes significantly, adjust this.
    // Or get actual height: navbar ? navbar.offsetHeight : 80;
    // Given your HTML, navbar has fixed-top, so its height contributes to the offset.
    const navbarHeight = 80; // A reasonable approximation for typical fixed-top navbar height
    const buffer = 20; // Extra buffer to ensure content isn't cut off
    return navbarHeight + buffer;
  };

  // --- Smooth Scrolling for Navigation Links ---
  document.querySelectorAll('a.nav-link[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offset = getScrollOffset();
        // Calculate position considering the target element's top position minus the offset
        const targetScrollPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: Math.max(0, targetScrollPosition), // Ensure scroll position isn't negative
          behavior: 'smooth',
        });

        // Close navbar on mobile after clicking a link
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarToggler.click(); // Programmatically click the toggler to close it
        }
      }
    });
  });

  // --- Navbar Behavior on Scroll and Toggle ---

  // Add 'scrolled' class to navbar on scroll
  window.addEventListener('scroll', function () {
    if (navbar) {
      if (window.scrollY > 80) {
        // Add 'scrolled' class after 80px scroll
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Handle active navigation link highlighting
    updateActiveNavLink();
  });

  // Handle navbar toggle events for mobile view
  if (navbarCollapse && mainContentWrapper) {
    navbarCollapse.addEventListener('show.bs.collapse', function () {
      if (window.innerWidth < 992) {
        // Apply only on mobile (Bootstrap's default breakpoint for navbar collapse)
        body.classList.add('navbar-open');
        mainContentWrapper.classList.remove('faded-in');
        mainContentWrapper.classList.add('faded-out');
      }
    });

    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
      if (window.innerWidth < 992) {
        // Apply only on mobile
        body.classList.remove('navbar-open');
        mainContentWrapper.classList.remove('faded-out');
        mainContentWrapper.classList.add('faded-in');
      }
    });
  }

  // Dynamic active navigation link highlighting
  const updateActiveNavLink = () => {
    const navLinks = document.querySelectorAll('.main-nav-links .nav-link');
    // Select all your sections by their IDs, as defined in your HTML
    const sections = document.querySelectorAll('#home, #biografi, #pendidikan, #hobi, #achievement, #contact');

    // Only update if navbar is not open on mobile, or if on desktop
    if (window.innerWidth >= 992 || (navbarCollapse && !navbarCollapse.classList.contains('show'))) {
      let currentSectionId = '';
      const offset = getScrollOffset(); // Get dynamic offset

      sections.forEach((section) => {
        // Get section's top position relative to the document
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Adjust current scroll position to account for the navbar offset
        // This makes the active link highlight when the section is at the "visible top"
        if (window.scrollY >= sectionTop - offset - 1 && window.scrollY < sectionTop + sectionHeight - offset - 1) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        // Check if the link's href matches the current active section ID
        if (link.getAttribute('href').includes(currentSectionId)) {
          link.classList.add('active');
        }
      });
    }
  };

  // Initial call to set active link on page load
  updateActiveNavLink();
  window.addEventListener('resize', updateActiveNavLink); // Update on resize too

  // --- Animation for elements on scroll using Intersection Observer ---
  // Elements to animate: about-content, education-item, hobbies-content, achievement-card
  // I am assuming you want these to fade in. If you want more, add a class 'fade-on-scroll' to them.
  const fadeOnScrollElements = document.querySelectorAll('.about-content, .education-item, .hobbies-content, .achievement-card');

  if (fadeOnScrollElements.length > 0) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.15, // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    fadeOnScrollElements.forEach((element) => {
      element.classList.add('fade-on-scroll'); // Add initial hidden class via JS
      observer.observe(element);
    });
  }

  // --- Initial Animation for Hero Section Elements on Page Load ---
  const profileImage = document.querySelector('.profile-image');
  const profileName = document.querySelector('.profile-name');
  const profileTitle = document.querySelector('.profile-title');
  const profileUniversity = document.querySelector('.profile-university');
  const profileCard = document.querySelector('.profile-card');

  if (profileImage && profileName && profileTitle && profileUniversity && profileCard) {
    // Prevent re-animation if already animated (e.g., on page back/forward)
    if (!profileCard.classList.contains('fade-in-initial')) {
      // No need to set initial hidden state via JS, CSS handles it via .profile-card:not(.fade-in-initial)
      // Or if you prefer to set it here, ensure it doesn't conflict with CSS.
      // For now, rely on CSS initial states and JS to add the .fade-in-initial class.

      // Animate in sequence for a layered effect
      setTimeout(() => {
        profileCard.classList.add('fade-in-initial');
      }, 200);

      setTimeout(() => {
        profileImage.classList.add('fade-in-initial');
      }, 600);

      setTimeout(() => {
        profileName.classList.add('fade-in-initial');
      }, 1000);

      setTimeout(() => {
        profileTitle.classList.add('fade-in-initial');
      }, 1200);

      setTimeout(() => {
        profileUniversity.classList.add('fade-in-initial');
      }, 1400);
    }
  }

  // --- Scroll to Top Button Functionality ---
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.setAttribute('id', 'scrollTopBtn');
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', function () {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Initial check for scroll top button on load
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollTopBtn.style.display = 'block';
  }
});
