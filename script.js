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

const STORAGE_KEY = "weleave-site-editor-v1";

const ui = {
  toggleEditBtn: document.querySelector("#toggle-edit-btn"),
  resetBtn: document.querySelector("#reset-content-btn"),
  editState: document.querySelector("#edit-state"),
  skillEditor: document.querySelector("#skill-editor"),
  projectEditor: document.querySelector("#project-editor"),
  skillInput: document.querySelector("#skill-input"),
  addSkillBtn: document.querySelector("#add-skill-btn"),
  projectTitleInput: document.querySelector("#project-title-input"),
  projectPeriodInput: document.querySelector("#project-period-input"),
  projectRoleInput: document.querySelector("#project-role-input"),
  projectLinkInput: document.querySelector("#project-link-input"),
  projectBulletsInput: document.querySelector("#project-bullets-input"),
  addProjectBtn: document.querySelector("#add-project-btn"),
  skillsContainer: document.querySelector("#skills-chips"),
  projectsContainer: document.querySelector("#projects-grid"),
};

const state = {
  editMode: false,
  skills: [],
  projects: [],
  defaults: {
    skills: [],
    projects: [],
  },
};

function textFrom(element) {
  return element ? element.textContent.trim() : "";
}

function parseSkillsFromDom() {
  return Array.from(ui.skillsContainer.querySelectorAll("span"))
    .map((node) => node.textContent.trim())
    .filter(Boolean);
}

function parseProjectsFromDom() {
  return Array.from(ui.projectsContainer.querySelectorAll(".project-card")).map((card) => {
    const bullets = Array.from(card.querySelectorAll("ul li"))
      .map((item) => item.textContent.trim())
      .filter(Boolean);
    const link = card.querySelector(".text-link");
    return {
      title: textFrom(card.querySelector(".project-head h3")),
      period: textFrom(card.querySelector(".project-head span")),
      role: textFrom(card.querySelector(".project-meta")) || "个人项目",
      bullets,
      linkHref: link ? link.getAttribute("href") || "#" : "#",
      linkText: link ? link.textContent.trim() || "查看项目仓库" : "查看项目仓库",
    };
  });
}

function deepCopyProjects(projects) {
  return projects.map((project) => ({
    ...project,
    bullets: [...project.bullets],
  }));
}

function normalizeUrl(input) {
  const value = input.trim();
  if (!value) {
    return "#";
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

function setEditStateText(text) {
  if (ui.editState) {
    ui.editState.textContent = text;
  }
}

function createSkillChip(skill, index) {
  const chip = document.createElement("span");
  chip.className = "chip-item";

  const label = document.createElement("span");
  label.textContent = skill;
  chip.appendChild(label);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "chip-remove";
  removeBtn.dataset.removeSkill = String(index);
  removeBtn.textContent = "删除";

  if (!state.editMode) {
    removeBtn.classList.add("is-hidden");
  }

  chip.appendChild(removeBtn);
  return chip;
}

function renderSkills() {
  ui.skillsContainer.innerHTML = "";
  state.skills.forEach((skill, index) => {
    ui.skillsContainer.appendChild(createSkillChip(skill, index));
  });
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

  const title = document.createElement("h3");
  title.textContent = project.title || "未命名项目";
  head.appendChild(title);

  const period = document.createElement("span");
  period.textContent = project.period || "时间待补充";
  head.appendChild(period);

  card.appendChild(head);

  const meta = document.createElement("p");
  meta.className = "project-meta";
  meta.textContent = project.role || "个人项目";
  card.appendChild(meta);

  const list = document.createElement("ul");
  const bullets = project.bullets.length > 0 ? project.bullets : ["项目亮点待补充"];
  bullets.forEach((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    list.appendChild(li);
  });
  card.appendChild(list);

  const link = document.createElement("a");
  link.className = "text-link";
  link.href = project.linkHref || "#";
  link.textContent = project.linkText || "查看项目仓库";
  link.target = "_blank";
  link.rel = "noopener";
  card.appendChild(link);

  return card;
}

function renderProjects() {
  ui.projectsContainer.innerHTML = "";

  if (state.projects.length === 0) {
    const emptyTip = document.createElement("p");
    emptyTip.className = "empty-tip";
    emptyTip.textContent = "暂无项目，开启编辑后可新增项目。";
    ui.projectsContainer.appendChild(emptyTip);
    return;
  }

  state.projects.forEach((project, index) => {
    ui.projectsContainer.appendChild(createProjectCard(project, index));
  });
}

function saveState() {
  const payload = {
    skills: state.skills,
    projects: state.projects,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.skills) && Array.isArray(parsed.projects)) {
      state.skills = parsed.skills
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 40);
      state.projects = parsed.projects
        .map((project) => ({
          title: String(project.title || "").trim(),
          period: String(project.period || "").trim(),
          role: String(project.role || "").trim(),
          bullets: Array.isArray(project.bullets)
            ? project.bullets.map((item) => String(item).trim()).filter(Boolean).slice(0, 8)
            : [],
          linkHref: String(project.linkHref || "#").trim() || "#",
          linkText: String(project.linkText || "查看项目仓库").trim() || "查看项目仓库",
        }))
        .filter((project) => project.title);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setEditMode(nextMode) {
  state.editMode = nextMode;

  if (ui.toggleEditBtn) {
    ui.toggleEditBtn.textContent = nextMode ? "退出编辑" : "开启编辑";
  }

  ui.resetBtn.classList.toggle("is-hidden", !nextMode);
  ui.skillEditor.classList.toggle("is-hidden", !nextMode);
  ui.projectEditor.classList.toggle("is-hidden", !nextMode);

  setEditStateText(nextMode ? "当前为编辑模式（会自动保存到本地）" : "当前为浏览模式");
  renderSkills();
  renderProjects();
}

function addSkill() {
  const value = ui.skillInput.value.trim();
  if (!value) {
    setEditStateText("技能不能为空");
    return;
  }
  if (state.skills.includes(value)) {
    setEditStateText("该技能已存在");
    ui.skillInput.value = "";
    return;
  }

  state.skills.push(value);
  ui.skillInput.value = "";
  renderSkills();
  saveState();
  setEditStateText(`已新增技能：${value}`);
}

function removeSkill(index) {
  if (index < 0 || index >= state.skills.length) {
    return;
  }
  const [removed] = state.skills.splice(index, 1);
  renderSkills();
  saveState();
  setEditStateText(`已删除技能：${removed}`);
}

function clearProjectForm() {
  ui.projectTitleInput.value = "";
  ui.projectPeriodInput.value = "";
  ui.projectRoleInput.value = "";
  ui.projectLinkInput.value = "";
  ui.projectBulletsInput.value = "";
}

function addProject() {
  const title = ui.projectTitleInput.value.trim();
  const period = ui.projectPeriodInput.value.trim() || "时间待补充";
  const role = ui.projectRoleInput.value.trim() || "个人项目";
  const linkHref = normalizeUrl(ui.projectLinkInput.value);
  const bullets = ui.projectBulletsInput.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!title) {
    setEditStateText("项目名称不能为空");
    return;
  }
  if (bullets.length === 0) {
    setEditStateText("请至少填写一条项目亮点");
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

  clearProjectForm();
  renderProjects();
  saveState();
  setEditStateText(`已新增项目：${title}`);
}

function removeProject(index) {
  if (index < 0 || index >= state.projects.length) {
    return;
  }
  const [removed] = state.projects.splice(index, 1);
  renderProjects();
  saveState();
  setEditStateText(`已删除项目：${removed.title}`);
}

function resetToDefaults() {
  state.skills = [...state.defaults.skills];
  state.projects = deepCopyProjects(state.defaults.projects);
  localStorage.removeItem(STORAGE_KEY);
  clearProjectForm();
  if (ui.skillInput) {
    ui.skillInput.value = "";
  }
  renderSkills();
  renderProjects();
  setEditStateText("已恢复默认内容");
}

function bindEditorEvents() {
  ui.toggleEditBtn.addEventListener("click", () => {
    setEditMode(!state.editMode);
  });

  ui.resetBtn.addEventListener("click", () => {
    resetToDefaults();
  });

  ui.addSkillBtn.addEventListener("click", addSkill);
  ui.skillInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  });

  ui.skillsContainer.addEventListener("click", (event) => {
    const target = event.target.closest("[data-remove-skill]");
    if (!target) {
      return;
    }
    const index = Number(target.dataset.removeSkill);
    removeSkill(index);
  });

  ui.addProjectBtn.addEventListener("click", addProject);

  ui.projectsContainer.addEventListener("click", (event) => {
    const target = event.target.closest("[data-remove-project]");
    if (!target) {
      return;
    }
    const index = Number(target.dataset.removeProject);
    removeProject(index);
  });
}

function initEditor() {
  if (
    !ui.toggleEditBtn ||
    !ui.resetBtn ||
    !ui.skillEditor ||
    !ui.projectEditor ||
    !ui.skillInput ||
    !ui.addSkillBtn ||
    !ui.projectTitleInput ||
    !ui.projectPeriodInput ||
    !ui.projectRoleInput ||
    !ui.projectLinkInput ||
    !ui.projectBulletsInput ||
    !ui.addProjectBtn ||
    !ui.skillsContainer ||
    !ui.projectsContainer
  ) {
    return;
  }

  state.skills = parseSkillsFromDom();
  state.projects = parseProjectsFromDom();
  state.defaults.skills = [...state.skills];
  state.defaults.projects = deepCopyProjects(state.projects);

  loadState();
  renderSkills();
  renderProjects();
  setEditMode(false);
  bindEditorEvents();
}

initOptionalAssets();
initEditor();
