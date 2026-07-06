/* ==========================================================================
   Portfolio Dynamic Logic & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Navigation Header & Link Highlighting ---
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Highlighting Nav Links on Scroll using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle portion of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call


  // --- 2. Mobile Nav Menu Drawer Toggle ---
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // --- 3. Typing Text Animation on Hero ---
  const typingElement = document.getElementById('typing-anim');
  if (typingElement) {
    const roles = ['AI & ML Engineer', 'Data Scientist', 'Data Engineer', 'Generative AI Architect', 'Python Specialist'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 1500; 
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    };

    setTimeout(typeEffect, 800);
  }

  // --- 3.5. Neural Network Canvas Simulation ---
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 65;
    let connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.65)';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (connectionDistance - dist) / connectionDistance * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const alpha = (mouse.radius - dist) / mouse.radius * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // --- 4. Interactive Mouse Tilt/Parallax Card Effect ---
  const tiltCard = document.getElementById('hero-profile-card');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within client rect
      const y = e.clientY - rect.top;  // y coordinate within client rect
      
      // Calculate rotation degrees (-10deg to 10deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      tiltCard.style.transition = 'transform 0.5s ease';
    });

    tiltCard.addEventListener('mouseenter', () => {
      tiltCard.style.transition = 'none';
    });
  }


  // --- 5. Skill Bars Auto-Animate on Scroll ---
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const animateSkills = () => {
    skillBars.forEach(bar => {
      const targetPercent = bar.getAttribute('data-percent');
      bar.style.width = targetPercent;
    });
  };

  const skillsObserverOptions = {
    threshold: 0.15
  };

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkills();
        skillsObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, skillsObserverOptions);

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }


  // --- 6. Skills Tab Switching Mechanism ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.skills-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      // Deactivate all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      panels.forEach(panel => panel.classList.remove('active'));

      // Activate selected
      button.classList.add('active');
      const targetPanel = document.getElementById(`panel-${tabId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        
        // Trigger layout animations in the new tab
        const tabSkillBars = targetPanel.querySelectorAll('.skill-bar-fill');
        tabSkillBars.forEach(bar => {
          bar.style.width = bar.getAttribute('data-percent');
        });
      }
    });
  });


  // --- 7. Projects Filters Trigger ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // Update Active Button State
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'projectFadeIn 0.4s forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // --- 8. Contact Form Handling and Modal Success Trigger ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const successModal = document.getElementById('success-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const statusMsg = document.getElementById('contact-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      // Reset style feedback
      statusMsg.style.display = 'none';
      statusMsg.className = 'form-status-msg';

      let isValid = true;
      
      // Simple verification check
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'rgba(239, 68, 68, 0.5)'; // Soft Red Alert border
        } else {
          input.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }
      });

      if (!isValid) {
        statusMsg.textContent = 'Please fill out all fields.';
        statusMsg.className = 'form-status-msg error';
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#ef4444';
        return;
      }

      // Check email pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        statusMsg.textContent = 'Please specify a valid email address.';
        statusMsg.className = 'form-status-msg error';
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#ef4444';
        return;
      }

      // If valid, submit to FormSubmit.co via AJAX
      const submitBtn = document.getElementById('contact-submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        _subject: `New Portfolio Message: ${subjectInput.value.trim()}`
      };

      fetch('https://formsubmit.co/ajax/saiashishchauhan@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (successModal) {
          successModal.classList.add('open');
          successModal.setAttribute('aria-hidden', 'false');
          contactForm.reset();
          
          // Reset form input borders
          const inputs = contactForm.querySelectorAll('.form-input');
          inputs.forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.06)';
          });
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        statusMsg.textContent = 'Failed to send message. Please check your network and try again.';
        statusMsg.className = 'form-status-msg error';
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#ef4444';
      });
    });
  }

  // Close Success Modal Handler
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
      successModal.setAttribute('aria-hidden', 'true');
    });

    // Close on overlay background click
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('open');
        successModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- 9. Scroll Reveal Transition Trigger ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

});
