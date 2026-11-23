const newsletterForm = document.querySelector("#form-newsletter");
const newsletterEmail = document.querySelector("#email-newsletter");
const newsletterError = document.querySelector("#newsletter-error");
const newsletterStatus = document.querySelector("#newsletter-status");
const resetNewsletterBtn = document.querySelector("#reset-newsletter");

const NEWSLETTER_KEY = "kopi-kuripan-newsletter";

function muatNewsletter() {
  try {
    const raw = localStorage.getItem(NEWSLETTER_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (newsletterEmail && data.email) {
      newsletterEmail.value = data.email;
    }
    if (newsletterStatus && data.email) {
      newsletterStatus.textContent = `Terdaftar info promo untuk: ${data.email}`;
      newsletterStatus.classList.add("success");
    }
  } catch (err) {
    console.warn("Data newsletter rusak, direset.", err);
    localStorage.removeItem(NEWSLETTER_KEY);
  }
}

if (newsletterForm && newsletterEmail) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterEmail.setCustomValidity("");

    if (!newsletterEmail.checkValidity()) {
      const msg = newsletterEmail.validity.valueMissing
        ? "Email newsletter wajib diisi."
        : "Format email newsletter belum valid.";
      newsletterEmail.setCustomValidity(msg);
      newsletterEmail.setAttribute("aria-invalid", "true");
      if (newsletterError) newsletterError.textContent = msg;
      newsletterEmail.focus();
      return;
    }

    newsletterEmail.setAttribute("aria-invalid", "false");
    if (newsletterError) newsletterError.textContent = "";

    const payload = {
      email: newsletterEmail.value.trim(),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(payload));

    if (newsletterStatus) {
      newsletterStatus.textContent = `Preferensi newsletter tersimpan untuk ${payload.email}.`;
      newsletterStatus.classList.add("success");
    }
  });

  resetNewsletterBtn?.addEventListener("click", () => {
    localStorage.removeItem(NEWSLETTER_KEY);
    if (newsletterEmail) {
      newsletterEmail.value = "";
      newsletterEmail.setAttribute("aria-invalid", "false");
    }
    if (newsletterError) newsletterError.textContent = "";
    if (newsletterStatus) {
      newsletterStatus.textContent = "Langganan newsletter dihapus.";
      newsletterStatus.classList.remove("success");
    }
  });

  muatNewsletter();
}