(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const STORAGE_KEYS = {
    skills: "weleave.skills.v2",
    projects: "weleave.projects.v2",
  };

  function initYear() {
    const yearNode = qs("#year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  function initReveal() {
    const nodes = qsa("[data-reveal]");
    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -20px 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
      observer.observe(node);
    });
  }

  function initNavActive() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    qsa(".nav-link[data-page]").forEach((link) => {
      const target = link.getAttribute("data-page");
      if (target === page) {
        link.classList.add("active");
      }
    });
  }

  function initPageWipe() {
    const wipe = qs("#page-wipe");
    if (!wipe) {
      return;
    }

    requestAnimationFrame(() => {
      wipe.classList.add("loaded");
    });

    qsa("a[data-transition]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank"
        ) {
          return;
        }

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) {
          return;
        }

        event.preventDefault();
        wipe.classList.remove("loaded");
        window.setTimeout(() => {
          window.location.href = href;
        }, 260);
      });
    });
  }

  function initCursorOrb() {
    const orb = qs(".cursor-orb");
    if (!orb) {
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    window.addEventListener("pointermove", (event) => {
      x = event.clientX;
      y = event.clientY;
      orb.style.transform = `translate(${x - 110}px, ${y - 110}px)`;
    });
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

    const avatarFrame = qs("#avatar-frame");
    const avatarImage = qs("#avatar-image");
    if (avatarFrame && avatarImage) {
      const hasAvatar = await fileExists("./avatar.jpg");
      if (hasAvatar) {
        avatarFrame.classList.add("has-image");
      }
    }

    const resumeLink = qs("#resume-link");
    if (resumeLink) {
      const hasResume = await fileExists("./resume.jpg");
      if (!hasResume) {
        resumeLink.classList.add("is-hidden");
      }
    }
  }

  function safeJsonParse(input) {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  }

  function initSkillsEditor() {
    const root = qs("#skills-editor-root");
    if (!root) {
      return;
    }

    const list = qs("#skills-list", root);
    const toggleBtn = qs("#skills-edit-toggle", root);
    const resetBtn = qs("#skills-reset-btn", root);
    const panel = qs("#skills-editor-panel", root);
    const input = qs("#skill-input", root);
    const addBtn = qs("#skill-add-btn", root);
    const statusNode = qs("#skills-status", root);

    if (!list || !toggleBtn || !resetBtn || !panel || !input || !addBtn || !statusNode) {
      return;
    }

    const defaults = qsa(".chip", list)
      .map((chip) => {
        const labelNode = qs(".chip-label", chip);
        return labelNode ? labelNode.textContent.trim() : chip.textContent.trim();
      })
      .filter(Boolean);

    const state = {
      editMode: false,
      skills: [...defaults],
    };

    const cached = safeJsonParse(localStorage.getItem(STORAGE_KEYS.skills) || "");
    if (Array.isArray(cached) && cached.length > 0) {
      state.skills = cached.map((item) => String(item).trim()).filter(Boolean).slice(0, 80);
    }

    function setStatus(text) {
      statusNode.textContent = text;
    }

    function save() {
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(state.skills));
    }

    function render() {
      list.innerHTML = "";
      state.skills.forEach((skill, index) => {
        const chip = document.createElement("span");
        chip.className = "chip";

        const label = document.createElement("span");
        label.className = "chip-label";
        label.textContent = skill;
        chip.appendChild(label);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "删";
        removeBtn.dataset.removeSkill = String(index);
        if (!state.editMode) {
          removeBtn.classList.add("is-hidden");
        }
        chip.appendChild(removeBtn);

        list.appendChild(chip);
      });
    }

    function addSkill() {
      const value = input.value.trim();
      if (!value) {
        setStatus("技能不能为空");
        return;
      }
      if (state.skills.includes(value)) {
        input.value = "";
        setStatus("该技能已存在");
        return;
      }

      state.skills.push(value);
      input.value = "";
      render();
      save();
      setStatus(`已新增技能：${value}`);
    }

    function removeSkill(index) {
      if (index < 0 || index >= state.skills.length) {
        return;
      }
      const [removed] = state.skills.splice(index, 1);
      render();
      save();
      setStatus(`已删除技能：${removed}`);
    }

    function setEditMode(nextMode) {
      state.editMode = nextMode;
      panel.classList.toggle("is-hidden", !nextMode);
      resetBtn.classList.toggle("is-hidden", !nextMode);
      toggleBtn.textContent = nextMode ? "退出编辑" : "开启编辑";
      setStatus(nextMode ? "编辑模式已开启（自动保存到本地）" : "浏览模式");
      render();
    }

    toggleBtn.addEventListener("click", () => setEditMode(!state.editMode));
    addBtn.addEventListener("click", addSkill);

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addSkill();
      }
    });

    list.addEventListener("click", (event) => {
      const target = event.target.closest("[data-remove-skill]");
      if (!target) {
        return;
      }
      removeSkill(Number(target.dataset.removeSkill));
    });

    resetBtn.addEventListener("click", () => {
      state.skills = [...defaults];
      localStorage.removeItem(STORAGE_KEYS.skills);
      render();
      setStatus("已恢复默认技能内容");
    });

    render();
    setEditMode(false);
  }

  function extractProjectFromCard(card) {
    const title = qs(".project-head h3", card)?.textContent.trim() || "未命名项目";
    const period = qs(".project-head span", card)?.textContent.trim() || "时间待补充";
    const role = qs(".project-meta", card)?.textContent.trim() || "个人项目";
    const bullets = qsa("ul li", card)
      .map((li) => li.textContent.trim())
      .filter(Boolean)
      .slice(0, 8);
    const linkNode = qs(".project-link", card);
    const linkHref = linkNode?.getAttribute("href") || "#";
    const linkText = linkNode?.textContent.trim() || "查看项目仓库";

    return { title, period, role, bullets, linkHref, linkText };
  }

  function normalizeUrl(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "#";
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  function initProjectsEditor() {
    const root = qs("#projects-editor-root");
    if (!root) {
      return;
    }

    const list = qs("#projects-list", root);
    const toggleBtn = qs("#projects-edit-toggle", root);
    const resetBtn = qs("#projects-reset-btn", root);
    const panel = qs("#projects-editor-panel", root);
    const statusNode = qs("#projects-status", root);

    const titleInput = qs("#project-title-input", root);
    const periodInput = qs("#project-period-input", root);
    const roleInput = qs("#project-role-input", root);
    const linkInput = qs("#project-link-input", root);
    const bulletsInput = qs("#project-bullets-input", root);
    const addBtn = qs("#project-add-btn", root);

    if (
      !list ||
      !toggleBtn ||
      !resetBtn ||
      !panel ||
      !statusNode ||
      !titleInput ||
      !periodInput ||
      !roleInput ||
      !linkInput ||
      !bulletsInput ||
      !addBtn
    ) {
      return;
    }

    const defaults = qsa(".project-card", list).map(extractProjectFromCard);
    const cached = safeJsonParse(localStorage.getItem(STORAGE_KEYS.projects) || "");

    const state = {
      editMode: false,
      projects:
        Array.isArray(cached) && cached.length > 0
          ? cached
              .map((item) => ({
                title: String(item.title || "").trim(),
                period: String(item.period || "").trim(),
                role: String(item.role || "").trim(),
                bullets: Array.isArray(item.bullets)
                  ? item.bullets.map((x) => String(x).trim()).filter(Boolean).slice(0, 8)
                  : [],
                linkHref: String(item.linkHref || "#").trim() || "#",
                linkText: String(item.linkText || "查看项目仓库").trim() || "查看项目仓库",
              }))
              .filter((item) => item.title)
          : defaults,
    };

    function setStatus(text) {
      statusNode.textContent = text;
    }

    function save() {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(state.projects));
    }

    function clearForm() {
      titleInput.value = "";
      periodInput.value = "";
      roleInput.value = "";
      linkInput.value = "";
      bulletsInput.value = "";
    }

    function createProjectCard(project, index) {
      const card = document.createElement("article");
      card.className = "project-card";

      if (state.editMode) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "project-remove";
        removeBtn.dataset.removeProject = String(index);
        removeBtn.textContent = "删除";
        card.appendChild(removeBtn);
      }

      const head = document.createElement("div");
      head.className = "project-head";
      const h3 = document.createElement("h3");
      h3.textContent = project.title;
      const period = document.createElement("span");
      period.textContent = project.period || "时间待补充";
      head.append(h3, period);
      card.appendChild(head);

      const meta = document.createElement("p");
      meta.className = "project-meta";
      meta.textContent = project.role || "个人项目";
      card.appendChild(meta);

      const ul = document.createElement("ul");
      const bullets = project.bullets.length > 0 ? project.bullets : ["项目亮点待补充"];
      bullets.forEach((bullet) => {
        const li = document.createElement("li");
        li.textContent = bullet;
        ul.appendChild(li);
      });
      card.appendChild(ul);

      const link = document.createElement("a");
      link.className = "project-link";
      link.href = project.linkHref || "#";
      link.textContent = project.linkText || "查看项目仓库";
      link.target = "_blank";
      link.rel = "noopener";
      card.appendChild(link);

      return card;
    }

    function render() {
      list.innerHTML = "";
      if (state.projects.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-tip";
        empty.textContent = "暂无项目，开启编辑模式后可以新增项目。";
        list.appendChild(empty);
        return;
      }
      state.projects.forEach((project, index) => {
        list.appendChild(createProjectCard(project, index));
      });
    }

    function addProject() {
      const title = titleInput.value.trim();
      const period = periodInput.value.trim() || "时间待补充";
      const role = roleInput.value.trim() || "个人项目";
      const linkHref = normalizeUrl(linkInput.value);
      const bullets = bulletsInput.value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8);

      if (!title) {
        setStatus("项目名称不能为空");
        return;
      }
      if (bullets.length === 0) {
        setStatus("请至少填写一条项目亮点");
        return;
      }

      state.projects.unshift({
        title,
        period,
        role,
        bullets,
        linkHref,
        linkText: linkHref === "#" ? "项目链接待补充" : "查看项目仓库",
      });
      clearForm();
      render();
      save();
      setStatus(`已新增项目：${title}`);
    }

    function removeProject(index) {
      if (index < 0 || index >= state.projects.length) {
        return;
      }
      const [removed] = state.projects.splice(index, 1);
      render();
      save();
      setStatus(`已删除项目：${removed.title}`);
    }

    function setEditMode(nextMode) {
      state.editMode = nextMode;
      panel.classList.toggle("is-hidden", !nextMode);
      resetBtn.classList.toggle("is-hidden", !nextMode);
      toggleBtn.textContent = nextMode ? "退出编辑" : "开启编辑";
      setStatus(nextMode ? "编辑模式已开启（自动保存到本地）" : "浏览模式");
      render();
    }

    toggleBtn.addEventListener("click", () => setEditMode(!state.editMode));
    addBtn.addEventListener("click", addProject);

    list.addEventListener("click", (event) => {
      const target = event.target.closest("[data-remove-project]");
      if (!target) {
        return;
      }
      removeProject(Number(target.dataset.removeProject));
    });

    resetBtn.addEventListener("click", () => {
      state.projects = defaults.map((item) => ({
        ...item,
        bullets: [...item.bullets],
      }));
      localStorage.removeItem(STORAGE_KEYS.projects);
      clearForm();
      render();
      setStatus("已恢复默认项目内容");
    });

    render();
    setEditMode(false);
  }

  initYear();
  initReveal();
  initNavActive();
  initPageWipe();
  initCursorOrb();
  initOptionalAssets();
  initSkillsEditor();
  initProjectsEditor();
})();
