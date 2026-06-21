/* ZJ Programmers portfolio interactions */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Show a polished local fallback until assets/images/zahid-profile.jpg is added.
  const portrait = document.getElementById("heroPortrait");
  if (portrait) {
    portrait.addEventListener("error", () => {
      if (portrait.src.endsWith(portrait.dataset.fallback)) return;
      portrait.src = portrait.dataset.fallback;
    });
  }

  // Header state, progress bar, and active navigation link.
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav .nav-link")];

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", scrollTop > 24);
    progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;

    let activeId = "home";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 180) activeId = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // Mobile navigation.
  const setMenu = (open) => {
    menuToggle.classList.toggle("active", open);
    mobileMenu.classList.toggle("open", open);
    body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
  };

  menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      closeThemePanel();
      closeProjectModal();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  // Lightweight scroll reveals, counters, and skill bars.
  const reveals = [...document.querySelectorAll(".reveal")];
  reveals.forEach((item) => {
    item.style.setProperty("--reveal-delay", `${item.dataset.delay || 0}ms`);
  });

  const animateCounter = (element) => {
    if (element.dataset.animated) return;
    element.dataset.animated = "true";
    const target = Number(element.dataset.target);
    if (reduceMotion) {
      element.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = Math.floor(target * eased);
      if (progressValue < 1) requestAnimationFrame(tick);
      else element.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".counter").forEach(animateCounter);
      entry.target.querySelectorAll(".skill-row i span").forEach((bar) => {
        bar.style.width = `${bar.dataset.level}%`;
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px" });

  reveals.forEach((item) => observer.observe(item));
  document.querySelectorAll(".stats-grid, .about-skills").forEach((item) => {
    if (!item.classList.contains("reveal")) observer.observe(item);
  });

  // Decorative particles are generated once and kept intentionally subtle.
  const particleField = document.getElementById("particleField");
  if (particleField && !reduceMotion) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 18; index += 1) {
      const particle = document.createElement("i");
      particle.className = "particle";
      particle.style.left = `${5 + Math.random() * 90}%`;
      particle.style.top = `${10 + Math.random() * 78}%`;
      particle.style.setProperty("--duration", `${5 + Math.random() * 7}s`);
      particle.style.setProperty("--delay", `${Math.random() * -7}s`);
      fragment.appendChild(particle);
    }
    particleField.appendChild(fragment);
  }

  // Theme switcher. The selected theme survives refreshes.
  const themeToggle = document.getElementById("themeToggle");
  const themePanel = document.getElementById("themePanel");
  const themeOptions = [...document.querySelectorAll(".theme-option")];
  const allowedThemes = ["gold", "blue", "emerald", "purple", "cyan", "pearl"];
  const themeColors = { gold: "#070707", blue: "#050b1e", emerald: "#031b15", purple: "#12051f", cyan: "#020c12", pearl: "#f4f0e8" };

  const setTheme = (theme) => {
    const nextTheme = allowedThemes.includes(theme) ? theme : "gold";
    root.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[nextTheme]);
    themeOptions.forEach((option) => option.classList.toggle("active", option.dataset.themeValue === nextTheme));
    try { localStorage.setItem("zj-theme", nextTheme); } catch (error) { /* Storage may be disabled. */ }
  };

  const closeThemePanel = () => {
    themePanel.classList.remove("open");
    themeToggle.classList.remove("active");
    themeToggle.setAttribute("aria-expanded", "false");
    themePanel.setAttribute("aria-hidden", "true");
  };

  let savedTheme = "gold";
  try { savedTheme = localStorage.getItem("zj-theme") || "gold"; } catch (error) { /* Use default. */ }
  setTheme(savedTheme);
  themeToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = !themePanel.classList.contains("open");
    themePanel.classList.toggle("open", open);
    themeToggle.classList.toggle("active", open);
    themeToggle.setAttribute("aria-expanded", String(open));
    themePanel.setAttribute("aria-hidden", String(!open));
  });
  themeOptions.forEach((option) => option.addEventListener("click", () => {
    setTheme(option.dataset.themeValue);
    closeThemePanel();
  }));
  document.addEventListener("click", (event) => {
    if (!document.getElementById("themeSwitcher").contains(event.target)) closeThemePanel();
  });

  // Project filtering and detail modal.
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const projectCards = [...document.querySelectorAll(".project-card")];

  filterButtons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => card.classList.add("filtering"));
    window.setTimeout(() => {
      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.classList.toggle("hidden", !matches);
        requestAnimationFrame(() => card.classList.remove("filtering"));
      });
    }, reduceMotion ? 0 : 230);
  }));

  const projects = {
    coffee: {
      title: "Premium Shopify Coffee Store",
      description: "A warm, editorial storefront created to give a specialty coffee brand the credibility and clarity of a category leader.",
      focus: "Shopify, Liquid, UI/UX",
      outcome: "Clearer product discovery"
    },
    bundle: {
      title: "BB Upsell & Bundle Purchase App",
      description: "A focused merchant interface that makes complex campaign setup feel straightforward, from product selection to bundle rules.",
      focus: "Shopify App, Remix, UI",
      outcome: "Faster campaign setup"
    },
    healthcare: {
      title: "HarmonyRenal Healthcare Dashboard",
      description: "A role-aware operational dashboard built to organize treatment records, facilities, patients, and sensitive clinical workflows.",
      focus: "Node.js, MongoDB, UX",
      outcome: "Unified data workflows"
    },
    portfolio: {
      title: "Modern Portfolio Website",
      description: "A high-trust portfolio experience combining clear positioning, polished motion, work samples, social proof, and lead capture.",
      focus: "HTML, CSS, JavaScript",
      outcome: "Stronger lead generation"
    }
  };

  const projectModal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalFocus = document.getElementById("modalFocus");
  const modalOutcome = document.getElementById("modalOutcome");
  let modalTrigger = null;

  const openProjectModal = (card, trigger) => {
    const project = projects[card.dataset.project];
    if (!project) return;
    modalTrigger = trigger;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalFocus.textContent = project.focus;
    modalOutcome.textContent = project.outcome;
    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    window.setTimeout(() => projectModal.querySelector(".modal-close").focus(), 50);
  };

  const closeProjectModal = () => {
    if (!projectModal.classList.contains("open")) return;
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    modalTrigger?.focus();
  };

  projectCards.forEach((card) => {
    card.querySelectorAll(".project-open, .view-details").forEach((button) => {
      button.addEventListener("click", () => openProjectModal(card, button));
    });
  });
  projectModal.querySelectorAll("[data-close-modal]").forEach((item) => item.addEventListener("click", closeProjectModal));

  // Reviews support buttons, touch swiping, mouse dragging, and gentle auto-advance.
  const reviewViewport = document.getElementById("reviewViewport");
  const reviewPrev = document.getElementById("reviewPrev");
  const reviewNext = document.getElementById("reviewNext");
  const reviewCard = reviewViewport.querySelector(".review-card");
  let autoScrollTimer;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDragging = false;

  const reviewStep = () => reviewCard.getBoundingClientRect().width + 18;
  const scrollReviews = (direction = 1) => {
    const nearEnd = reviewViewport.scrollLeft + reviewViewport.clientWidth >= reviewViewport.scrollWidth - 20;
    if (direction > 0 && nearEnd) reviewViewport.scrollTo({ left: 0, behavior: "smooth" });
    else reviewViewport.scrollBy({ left: reviewStep() * direction, behavior: "smooth" });
  };
  const stopAutoScroll = () => window.clearInterval(autoScrollTimer);
  const startAutoScroll = () => {
    stopAutoScroll();
    if (!reduceMotion) autoScrollTimer = window.setInterval(() => scrollReviews(1), 4800);
  };

  reviewPrev.addEventListener("click", () => { scrollReviews(-1); startAutoScroll(); });
  reviewNext.addEventListener("click", () => { scrollReviews(1); startAutoScroll(); });
  reviewViewport.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = reviewViewport.scrollLeft;
    reviewViewport.classList.add("dragging");
    reviewViewport.setPointerCapture(event.pointerId);
    stopAutoScroll();
  });
  reviewViewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    reviewViewport.scrollLeft = dragStartScroll - (event.clientX - dragStartX) * 1.25;
  });
  const endReviewDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    reviewViewport.classList.remove("dragging");
    startAutoScroll();
  };
  reviewViewport.addEventListener("pointerup", endReviewDrag);
  reviewViewport.addEventListener("pointercancel", endReviewDrag);
  reviewViewport.addEventListener("mouseenter", stopAutoScroll);
  reviewViewport.addEventListener("mouseleave", () => { if (!isDragging) startAutoScroll(); });
  reviewViewport.addEventListener("focusin", stopAutoScroll);
  reviewViewport.addEventListener("focusout", startAutoScroll);
  startAutoScroll();

  // Friendly front-end form validation. Connect to Formspree/Netlify Forms when ready.
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const resetFormButton = document.getElementById("resetForm");
  const message = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const fields = [...form.querySelectorAll("input, select, textarea")];

  const errorMessage = (field) => {
    const value = field.value.trim();
    if (!value) return "Please complete this field.";
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    if (field.id === "name" && value.length < 2) return "Please enter at least 2 characters.";
    if (field.id === "message" && value.length < 20) return "Please share at least 20 characters.";
    return "";
  };

  const validateField = (field) => {
    const group = field.closest(".form-group");
    const error = group.querySelector(".field-error");
    const messageText = errorMessage(field);
    group.classList.toggle("invalid", Boolean(messageText));
    field.setAttribute("aria-invalid", String(Boolean(messageText)));
    error.textContent = messageText;
    return !messageText;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-group").classList.contains("invalid")) validateField(field);
    });
  });
  message.addEventListener("input", () => {
    if (message.value.length > 500) message.value = message.value.slice(0, 500);
    charCount.textContent = message.value.length;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      form.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
      return;
    }
    success.classList.add("show");
  });
  resetFormButton.addEventListener("click", () => {
    form.reset();
    charCount.textContent = "0";
    fields.forEach((field) => {
      field.closest(".form-group").classList.remove("invalid");
      field.removeAttribute("aria-invalid");
      field.closest(".form-group").querySelector(".field-error").textContent = "";
    });
    success.classList.remove("show");
    form.querySelector("input")?.focus();
  });
});
