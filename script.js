const revealNodes = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -20px 0px",
  }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 60, 220)}ms`;
  observer.observe(node);
});

const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

async function fileExists(path) {
  try {
    const head = await fetch(path, { method: "HEAD" });
    if (head.ok) {
      return true;
    }
    const get = await fetch(path, { method: "GET" });
    return get.ok;
  } catch {
    return false;
  }
}

async function initOptionalAssets() {
  if (window.location.protocol === "file:") {
    return;
  }

  const resumeLink = document.querySelector("#resume-link");
  if (resumeLink) {
    const hasResume = await fileExists("./resume.jpg");
    if (!hasResume) {
      resumeLink.classList.add("is-hidden");
    }
  }

  const avatarBox = document.querySelector("#avatar-box");
  if (avatarBox) {
    const hasAvatar = await fileExists("./avatar.jpg");
    if (hasAvatar) {
      avatarBox.classList.add("has-image");
    }
  }
}

initOptionalAssets();
