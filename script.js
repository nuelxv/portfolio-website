(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal (lightweight, single observer) ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // fallback: no IO support, just show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Contact links: smooth click ripple ---------- */
  const contactLinks = document.querySelectorAll(".contact-link");

  contactLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const rect = link.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.8;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      link.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ---------- Feedback form validation ---------- */
  const form = document.getElementById("feedbackForm");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function setFieldError(fieldEl, errorEl, message) {
    fieldEl.closest(".field").classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  if (form) {
    const categoryEl = document.getElementById("fbCategory");
    const messageEl = document.getElementById("fbMessage");
    const messageError = document.getElementById("fbMessageError");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      if (!categoryEl.value) {
        setFieldError(categoryEl, null, "Pilih kategori");
        valid = false;
      } else {
        setFieldError(categoryEl, null, "");
      }

      const message = messageEl.value.trim();
      if (message.length < 5) {
        setFieldError(messageEl, messageError, "Pesan minimal 5 karakter.");
        valid = false;
      } else {
        setFieldError(messageEl, messageError, "");
      }

      if (!valid) return;

      // No heavy backend yet — structured so it's easy to swap in a
      // form/API endpoint later (e.g. fetch('/api/feedback', {...})).
      const payload = {
        name: form.name.value.trim() || "Anonim",
        category: categoryEl.value,
        message,
      };

      // Simple fallback: open a pre-filled mailto draft.
      const subject = encodeURIComponent(`Feedback (${payload.category}) dari ${payload.name}`);
      const body = encodeURIComponent(payload.message);
      const mailtoLink = `mailto:reynard12399@gmail.com?subject=${subject}&body=${body}`;

      showToast("Terima kasih atas masukan Anda!");
      form.reset();

      // Uncomment to actually open the mail client:
      // window.location.href = mailtoLink;
    });

    [categoryEl, messageEl].forEach((el) => {
      el.addEventListener("input", () => {
        el.closest(".field").classList.remove("has-error");
      });
    });
  }
})();
