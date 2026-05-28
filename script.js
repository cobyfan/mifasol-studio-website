const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const courseCards = document.querySelectorAll("[data-course]");
const courseDetails = document.querySelectorAll("[data-course-detail]");
const courseSelect = document.querySelector("[data-course-select]");
const contactSection = document.querySelector("#contact");
const detailSection = document.querySelector("#course-details");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeMenu() {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

function scrollToElement(element) {
  if (!element) return;
  element.scrollIntoView({
    behavior: reduceMotion.matches ? "auto" : "smooth",
    block: "start",
  });
}

function setupReveal() {
  const revealItems = [
    ...document.querySelectorAll(
      ".section-heading, .intro-card, .course-filter, .course-card, .detail-grid details, .fee-card, .pathway article, .mini-grid article, .reason-grid article, .results-layout > *, .teacher-grid article, .credentials-panel, .about-image, .about-copy, .faq-list details, .contact-panel > *"
    ),
  ];

  document.documentElement.classList.add("motion-ready");

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setActiveFilter(activeFilter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  courseCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(" ");
    const shouldShow = activeFilter === "all" || categories.includes(activeFilter);
    card.classList.toggle("is-filtered-out", !shouldShow);
  });
}

function selectCourse(courseName) {
  if (!courseSelect || !courseName) return;

  const matchingOption = [...courseSelect.options].find((option) => option.textContent.trim() === courseName);
  if (matchingOption) {
    courseSelect.value = matchingOption.value;
  }
}

function openCourseDetail(courseName) {
  const matchingDetail = [...courseDetails].find((detail) => detail.dataset.courseDetail === courseName);

  if (!matchingDetail) return null;

  courseDetails.forEach((detail) => {
    detail.open = detail === matchingDetail;
    detail.classList.toggle("is-highlighted", detail === matchingDetail);
  });

  window.setTimeout(() => {
    matchingDetail.classList.remove("is-highlighted");
  }, reduceMotion.matches ? 200 : 1600);

  return matchingDetail;
}

function handleCourseAction(event) {
  const card = event.target.closest("[data-course]");
  if (!card) return;

  const link = event.target.closest("a");
  if (link) event.preventDefault();

  const courseName = card.dataset.course;
  const targetHref = link?.getAttribute("href");
  const matchingDetail = openCourseDetail(courseName);

  selectCourse(courseName);

  if (targetHref === "#contact" || !matchingDetail) {
    scrollToElement(contactSection);
    return;
  }

  scrollToElement(detailSection);
}

syncHeader();
setupReveal();

window.addEventListener("scroll", syncHeader, { passive: true });

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  closeMenu();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

courseCards.forEach((card) => {
  card.addEventListener("click", handleCourseAction);
});
