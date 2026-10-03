// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
});

// Header border once the page is scrolled
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form
// The form is not connected to any sending service yet. On submit it validates
// the fields and offers to send the message through the visitor's email app.
// To make it live, point it at a form service (e.g. Formspree, Netlify Forms)
// and replace the block marked "NOT CONNECTED" with a fetch() to that endpoint.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const EMAIL = 'therapy@angelamarkham.co.uk';

function showStatus(html, isError) {
  status.innerHTML = html;
  status.classList.toggle('error', Boolean(isError));
  status.hidden = false;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let firstInvalid = null;
  form.querySelectorAll('[required]').forEach((el) => {
    const wrapper = el.type === 'checkbox' ? el.closest('.check') : el.closest('.field');
    const valid = el.type === 'checkbox' ? el.checked : el.checkValidity() && el.value.trim() !== '';
    wrapper.classList.toggle('invalid', !valid);
    if (!valid && !firstInvalid) firstInvalid = el;
  });

  if (firstInvalid) {
    showStatus('Please fill in your name, a valid email address and a message, and tick the box to confirm.', true);
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);

  // NOT CONNECTED: nothing is sent from the website. Offer an email draft instead.
  const subject = `Therapy enquiry – ${data.get('type')}`;
  const lines = [data.get('message'), '', `Name: ${data.get('name')}`, `Email: ${data.get('email')}`];
  if (data.get('phone')) lines.push(`Phone: ${data.get('phone')}`);
  const body = lines.join('\n');
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  showStatus(
    'Thank you. Online sending isn’t available yet, so your message has <strong>not</strong> been sent. ' +
    `<a href="${mailto}">Open it in your email app</a> to send it, ` +
    `or contact Angela directly on <a href="tel:+447894916618">07894 916618</a>.`
  );
});

form.addEventListener('input', (e) => {
  const wrapper = e.target.closest('.field, .check');
  if (wrapper) wrapper.classList.remove('invalid');
});
