/* =========================================================
   app.js – ID Card Generator
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- SELECTORS ---------- */
  const navLinks       = document.querySelectorAll('.nav-link');
  const sections       = document.querySelectorAll('section');
  const mobileBtn      = document.querySelector('.mobile-menu-btn');
  const navMenu        = document.querySelector('.nav-menu');
  const generateBtn    = document.getElementById('generateBtn');

  // Form fields
  const fileInput      = document.getElementById('fileInput');
  const previewImg     = document.getElementById('previewImage');
  const defaultIcon    = document.getElementById('defaultIcon');
  const cardPhoto      = document.getElementById('cardPhoto');
  const cardIcon       = document.getElementById('cardIcon');

  const inputs = {
    fullName:   document.getElementById('fullName'),
    idNumber:   document.getElementById('idNumber'),
    dob:        document.getElementById('dob'),
    bloodGroup: document.getElementById('bloodGroup'),
    institute:  document.getElementById('institute'),
    instAddr:   document.getElementById('instituteAddress'),
    course:     document.getElementById('course'),
    validity:   document.getElementById('validity'),
    address:    document.getElementById('address'),
    phone:      document.getElementById('phone')
  };

  // Preview elements
  const preview = {
    name:      document.getElementById('previewName'),
    id:        document.getElementById('previewId'),
    dob:       document.getElementById('previewDob'),
    blood:     document.getElementById('previewBlood'),
    course:    document.getElementById('previewCourse'),
    phone:     document.getElementById('previewPhone'),
    validity:  document.getElementById('previewValidity'),
    institute: document.getElementById('previewInstitute'),
    instAddr:  document.getElementById('previewInstituteAddress'),
    address:   document.getElementById('previewAddress')
  };

  const qrContainer = document.getElementById('qrCode');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn    = document.getElementById('resetBtn');
  const sizeOpts    = document.querySelectorAll('.size-option');
  const idCard      = document.querySelector('.id-card');

  /* ---------- NAVIGATION ---------- */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.section;

      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      link.classList.add('active');
      document.getElementById(target).classList.add('active');

      navMenu.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  mobileBtn.addEventListener('click', () => navMenu.classList.toggle('active'));

  generateBtn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('[data-section="generate"]').click();
  });

  /* ---------- PHOTO UPLOAD ---------- */
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      previewImg.src = ev.target.result;
      previewImg.style.display = 'block';
      defaultIcon.style.display = 'none';

      cardPhoto.src = ev.target.result;
      cardPhoto.style.display = 'block';
      cardIcon.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  /* ---------- REAL-TIME PREVIEW ---------- */
  const allInputs = document.querySelectorAll('#generate input, #generate select, #generate textarea');
  allInputs.forEach(i => i.addEventListener('input', updatePreview));

  function updatePreview() {
    preview.name.textContent      = inputs.fullName.value || 'Full Name';
    preview.id.textContent        = inputs.idNumber.value || 'N/A';
    preview.dob.textContent       = inputs.dob.value || 'N/A';
    preview.blood.textContent     = inputs.bloodGroup.value || 'N/A';
    preview.course.textContent    = inputs.course.value || 'N/A';
    preview.phone.textContent     = inputs.phone.value || 'N/A';
    preview.validity.textContent  = inputs.validity.value || 'N/A';
    preview.institute.textContent = inputs.institute.value || 'Institute Name';
    preview.instAddr.textContent  = inputs.instAddr.value || 'INSTITUTE ADDRESS';
    preview.address.textContent   = inputs.address.value || 'N/A';

    generateQR();
  }

  /* ---------- QR CODE ---------- */
  function generateQR() {
    qrContainer.innerHTML = '';
    const data = `
Name: ${inputs.fullName.value || 'N/A'}
ID: ${inputs.idNumber.value || 'N/A'}
Institute: ${inputs.institute.value || 'N/A'}
Course: ${inputs.course.value || 'N/A'}
Phone: ${inputs.phone.value || 'N/A'}
    `.trim();

    QRCode.toCanvas(data, { width: 60, margin: 1, color: { dark: '#000', light: '#fff' } }, (err, canvas) => {
      if (err) {
        const placeholder = document.createElement('div');
        placeholder.textContent = 'QR';
        placeholder.style.fontSize = '10px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.height = '100%';
        qrContainer.appendChild(placeholder);
      } else {
        qrContainer.appendChild(canvas);
      }
    });
  }

  /* ---------- CARD SIZE SWITCH ---------- */
  sizeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      sizeOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const size = opt.dataset.size; // standard | small | large
      idCard.className = `id-card ${size}`;
    });
  });

  /* ---------- DOWNLOAD ---------- */
  downloadBtn.addEventListener('click', () => {
    html2canvas(idCard, { scale: 2, useCORS: true, logging: false }).then(canvas => {
      const link = document.createElement('a');
      link.download = `id-card-${inputs.idNumber.value || 'unknown'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });

  /* ---------- RESET ---------- */
  resetBtn.addEventListener('click', () => {
    // clear form
    Object.values(inputs).forEach(i => i.value = '');
    fileInput.value = '';

    // reset photo
    previewImg.style.display = 'none';
    defaultIcon.style.display = 'flex';
    cardPhoto.style.display = 'none';
    cardIcon.style.display = 'flex';

    // reset preview text
    updatePreview();
    qrContainer.innerHTML = '';
  });

  /* ---------- CONTACT FORM (Formspree) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alert('Thank you! Your message has been sent.');
          contactForm.reset();
        } else {
          throw new Error('Network error');
        }
      } catch (err) {
        alert('Oops! Something went wrong. Please try again later.');
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  /* ---------- INITIAL QR (empty) ---------- */
  generateQR();
});