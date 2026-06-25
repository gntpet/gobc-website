// ===========================
// NAVIGATION: scroll + toggle
// ===========================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMobile.classList.toggle('open');
});

// Close mobile menu on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// ===========================
// SCROLL ANIMATIONS
// ===========================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===========================
// CONTACT FORM
// ===========================
const form = document.getElementById('contactForm');
const formFields = form.querySelectorAll('[data-required]');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
  const errEl = document.getElementById(fieldId + 'Error');
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('visible');
  }
  const input = document.getElementById(fieldId);
  if (input) input.style.borderColor = '#dc2626';
}

function clearError(fieldId) {
  const errEl = document.getElementById(fieldId + 'Error');
  if (errEl) errEl.classList.remove('visible');
  const input = document.getElementById(fieldId);
  if (input) input.style.borderColor = '';
}

// Live validation on blur
form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.style.borderColor === 'rgb(220, 38, 38)') validateField(input);
  });
});

function validateField(input) {
  const id = input.id;
  const val = input.value.trim();

  if (input.dataset.required && !val) {
    showError(id, 'This field is required.');
    return false;
  }
  if (id === 'email' && val && !validateEmail(val)) {
    showError(id, 'Please enter a valid email address.');
    return false;
  }
  clearError(id);
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('.form-input').forEach(input => {
    if (!validateField(input)) valid = false;
  });

  if (!valid) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Build mailto link as a static-site fallback
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Migration enquiry from ${name}${company ? ' – ' + company : ''}`);
  const body    = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`
  );

  // Try to open mail client; show success regardless
  window.location.href = `mailto:info@gobc.nl?subject=${subject}&body=${body}`;

  // Show success state after brief delay
  setTimeout(() => {
    form.style.display = 'none';
    formSuccess.classList.add('visible');
  }, 600);
});
