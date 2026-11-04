const QUOTE_EMAIL = "";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      siteNav.classList.remove("is-open");
    }
  });
}

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const draftLink = document.querySelector("#draft-link");

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const formData = new FormData(quoteForm);
  const details = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Organisation: ${formData.get("organisation") || "Not provided"}`,
    `Service: ${formData.get("service")}`,
    "",
    "Project details:",
    formData.get("details"),
  ].join("\n");
  const subject = `Quotation request — ${formData.get("service")}`;
  draftLink.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  draftLink.hidden = false;
  formStatus.hidden = false;

  if (QUOTE_EMAIL) {
    statusTitle.textContent = "Your request is ready to send.";
    statusMessage.textContent = "Use the email-draft link below to open your email app with the project details filled in, then review and send when you’re ready.";
  } else {
    statusTitle.textContent = "Your project details are ready.";
    statusMessage.textContent = "Stela’s receiving email hasn’t been set up yet. Open the prepared draft and add the business email address before sending.";
  }

  formStatus.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
});
