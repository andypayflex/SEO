const config = window.SITE_CONFIG;
const nav = document.querySelector('#main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
document.body.classList.add('js-enabled');

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 16);
}
updateHeader();

// Keep the current section visible in both the visual and accessible navigation.
const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')]
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.section);

function updateActiveSection() {
  const current = sectionLinks.filter(({ section }) => section.getBoundingClientRect().top <= 160).at(-1);
  sectionLinks.forEach(({ link }) => {
    const isActive = link === current?.link;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scrollUpdatePending = false;
function scheduleScrollUpdate() {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  requestAnimationFrame(() => {
    updateHeader();
    updateActiveSection();
    scrollUpdatePending = false;
  });
}
window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
updateActiveSection();

document.querySelector('#year').textContent = String(new Date().getFullYear());
document.querySelectorAll('[data-email-link]').forEach(link => {
  link.href = `mailto:${config.email}`;
  link.firstChild.textContent = `${config.email} `;
});
const isPlaceholder = config.email.toLowerCase().endsWith('.example');
document.querySelector('#placeholder-note').hidden = !isPlaceholder;
document.querySelector('#draft-warning').hidden = !isPlaceholder;

function openDialog(dialog) {
  closeMenu();
  dialog.showModal();
  document.body.classList.add('has-open-dialog');
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('has-open-dialog');
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

const services = {
  technical: {
    label: 'Technical SEO', eyebrow: '01 / A STRONGER FOUNDATION',
    description: 'Give your content a website that supports it. Our technical professionals combine software engineering and SEO expertise to find and fix the obstacles between your business and your audience.',
    deliverables: ['A technical site audit with clear priorities', 'Crawlability, indexing, and site structure review', 'Page speed and mobile usability improvements', 'Metadata, internal linking, and structured data', 'Implementation support and checks after changes']
  },
  content: {
    label: 'Content & copywriting', eyebrow: '02 / WORDS WITH PURPOSE',
    description: 'Bring your brand to life in words. Our copywriting professionals create clear, thoughtful content shaped around your audience, your voice, and the questions people are searching for.',
    deliverables: ['Brand voice and messaging guidance', 'Website and landing page copy', 'Search-led articles and blog content', 'Refreshes for content that needs a new direction', 'Editorial review and on-page content optimisation']
  },
  strategy: {
    label: 'SEO strategy', eyebrow: '03 / YOUR NEXT CHAPTER',
    description: 'Bring the technical work and the writing into one purposeful plan. We identify relevant search opportunities and turn them into an achievable roadmap for your business.',
    deliverables: ['Business goals and audience discovery', 'Keyword and search intent research', 'Competitor and content gap review', 'A prioritised technical and content roadmap', 'Agreed measures and plain-language progress reporting']
  }
};
const serviceDialog = document.querySelector('#service-dialog');
serviceDialog.setAttribute('aria-labelledby', 'service-dialog-title');
serviceDialog.setAttribute('aria-describedby', 'service-dialog-description');
let selectedService;
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    selectedService = services[button.dataset.service];
    if (!selectedService) return;
    document.querySelector('#service-eyebrow').textContent = selectedService.eyebrow;
    document.querySelector('#service-dialog-title').textContent = selectedService.label;
    document.querySelector('#service-dialog-description').textContent = selectedService.description;
    document.querySelector('#service-deliverables').replaceChildren(...selectedService.deliverables.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    openDialog(serviceDialog);
  });
});
document.querySelector('#service-enquire').addEventListener('click', () => {
  document.querySelector('#service').value = selectedService.label;
  serviceDialog.close();
  document.querySelector('#contact').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  document.querySelector('#name').focus({ preventScroll: true });
});

const form = document.querySelector('#enquiry-form');
const enquiryDialog = document.querySelector('#enquiry-dialog');
const emailPreview = document.querySelector('#email-preview');
const copyStatus = document.querySelector('#copy-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  // Native validation handles required and email fields; reject whitespace-only text too.
  for (const field of ['name', 'message']) {
    const input = form.elements.namedItem(field);
    if (!String(data.get(field)).trim()) {
      input.setCustomValidity('Please add a little detail here.');
      input.reportValidity();
      return;
    }
  }
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const website = String(data.get('website')).trim();
  const service = String(data.get('service'));
  const message = String(data.get('message')).trim();
  const subject = `Bytes of Content enquiry: ${service}`;
  const body = `Hi Bytes of Content team,\n\nI’d love to chat about ${service === 'Let’s work it out together' ? 'how you can help my business' : service.toLowerCase()}.\n\nName: ${name}\nEmail: ${email}${website ? `\nWebsite: ${website}` : ''}\n\n${message}\n\nThanks,\n${name}`;
  emailPreview.value = `To: ${config.email}\nSubject: ${subject}\n\n${body}`;
  document.querySelector('#send-draft').href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  copyStatus.textContent = '';
  document.querySelector('#copy-draft').textContent = 'Copy text';
  openDialog(enquiryDialog);
});
form.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
// Enable only after the local draft handler is installed. With JavaScript off,
// the browser must never fall back to submitting contact details in a GET URL.
form.querySelector('[type="submit"]').disabled = false;
document.querySelector('#copy-draft').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(emailPreview.value);
    copyStatus.textContent = 'Copied. Paste your enquiry into your email.';
    document.querySelector('#copy-draft').textContent = 'Copied ✓';
  } catch {
    emailPreview.focus();
    emailPreview.select();
    copyStatus.textContent = 'Select and copy the draft above using your device’s copy command.';
  }
});
document.querySelector('#privacy-button').addEventListener('click', () => openDialog(document.querySelector('#privacy-dialog')));
