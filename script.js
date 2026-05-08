(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const STORAGE_KEYS = {
    theme: "weleave.theme.v5",
    skills: "weleave.skills.v5",
    projects: "weleave.projects.v5",
    notes: "weleave.notes.v5",
  };

  const DEFAULT_SKILLS = [
    "C++20",
    "C++17",
    "STL / RAII",
    "模板与泛型",
    "移动语义",
    "智能指针",
    "异常安全",
    "并发编程",
    "线程池",
    "std::future",
    "condition_variable",
    "CMake",
    "Linux / WSL",
    "Git / GitHub",
    "调试与日志",
    "单元测试",
    "性能分析",
    "JSON / YAML",
    "MySQL",
    "Redis",
    "ECS 架构",
    "资源热更新",
    "文件系统监控",
    "工程化构建",
    "GitHub Pages",
    "HTML / CSS",
    "JavaScript",
    "localStorage",
    "数据导入导出",
    "项目文档整理",
    "断点调试",
    "内存泄漏排查",
    "接口边界设计",
    "学习计划拆解",
    "技术复盘"
  ];

  const DEFAULT_PROJECTS = [
    {
      id: "threadpool-cpp",
      title: "C++ ThreadPool 学习实现",
      period: "2025.10 - 2025.11",
      role: "学习项目",
      status: "已完成",
      tags: ["C++", "并发", "线程池", "future"],
      bullets: [
        "封装任务提交接口，支持 std::future 获取异步结果。",
        "使用 mutex 与 condition_variable 管理任务队列同步。",
        "整理等待任务完成、异常传递和优雅关闭等边界行为。"
      ],
      linkHref: "https://github.com/weleave/ThreadPool_CPP",
      linkText: "查看项目仓库",
      date: "2025-10-20",
      createdAt: 1760918400000
    },
    {
      id: "cmake-lab",
      title: "CMake 构建实验记录",
      period: "2025.11 - 2025.12",
      role: "学习项目",
      status: "已完成",
      tags: ["CMake", "工程化", "构建", "脚本"],
      bullets: [
        "整理 target、include、link 和多配置构建的基础用法。",
        "把常用构建命令沉淀为脚本，减少重复操作。",
        "记录 Debug/Release 参数差异和常见链接错误处理方式。"
      ],
      linkHref: "https://github.com/weleave/ThreadPool_CPP",
      linkText: "查看项目仓库",
      date: "2025-11-18",
      createdAt: 1763424000000
    },
    {
      id: "mini-ecs",
      title: "Mini ECS 轻量级实体组件系统",
      period: "2025.12 - 2026.02",
      role: "个人项目",
      status: "已完成",
      tags: ["C++", "ECS", "架构", "性能"],
      bullets: [
        "实现实体句柄与组件稀疏存储，完成 ECS 原型核心能力。",
        "采用 generation + swap-remove 机制提升安全性与性能。",
        "通过压力测试和独立构建验证项目可运行性。"
      ],
      linkHref: "https://github.com/weleave/mini-ecs-cpp",
      linkText: "查看项目仓库",
      date: "2025-12-22",
      createdAt: 1766361600000
    },
    {
      id: "hotreload",
      title: "HotReload 资源热更新工具",
      period: "2026.02 - 2026.03",
      role: "个人项目",
      status: "进行中",
      tags: ["C++", "热更新", "工具链", "文件系统"],
      bullets: [
        "实现配置加载、目录扫描与资源变更检测流程。",
        "建立增量更新与元信息映射，缩短调试反馈时间。",
        "覆盖首次加载与重复加载场景，支持持续迭代。"
      ],
      linkHref: "https://github.com/weleave/HotReloadKit",
      linkText: "查看项目仓库",
      date: "2026-02-18",
      createdAt: 1771372800000
    },
    {
      id: "personal-site",
      title: "GitHub Pages 个人学习站",
      period: "2026.04 - 2026.04",
      role: "个人网站",
      status: "进行中",
      tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      bullets: [
        "构建多页面学习站，包含技能、项目、笔记、归档和游乐场。",
        "使用 localStorage 实现本地可编辑内容和数据导入导出。",
        "补充主题切换、筛选、归档聚合和趣味工具页面。"
      ],
      linkHref: "https://github.com/weleave/ThreadPool_CPP",
      linkText: "查看项目仓库",
      date: "2026-04-28",
      createdAt: 1777334400000
    }
  ];

  const DEFAULT_NOTES = [
    {
      id: "note-2025-10-threadpool",
      title: "线程池基本结构梳理",
      date: "2025-10-16",
      category: "并发",
      status: "已完成",
      summary: "记录工作线程、任务队列、条件变量和任务提交接口的基本关系。",
      createdAt: 1760572800000
    },
    {
      id: "note-2025-10-future",
      title: "std::future 与 packaged_task 复盘",
      date: "2025-10-28",
      category: "C++",
      status: "已完成",
      summary: "整理异步结果返回、异常传递和任务包装的使用方式。",
      createdAt: 1761609600000
    },
    {
      id: "note-2025-11-cmake",
      title: "CMake 多配置构建整理",
      date: "2025-11-12",
      category: "CMake",
      status: "已完成",
      summary: "完成 Debug/Release 构建参数对比，并把常用命令写成脚本提高复用效率。",
      createdAt: 1762905600000
    },
    {
      id: "note-2025-12-ecs-storage",
      title: "ECS 组件存储结构复盘",
      date: "2025-12-18",
      category: "ECS",
      status: "已完成",
      summary: "整理 sparse set、句柄 generation 和 swap-remove 的优缺点。",
      createdAt: 1766016000000
    },
    {
      id: "note-2026-01-raii",
      title: "RAII 与资源生命周期记录",
      date: "2026-01-09",
      category: "现代 C++",
      status: "已完成",
      summary: "复盘智能指针、析构释放和异常安全之间的关系。",
      createdAt: 1767916800000
    },
    {
      id: "note-2026-02-hotreload",
      title: "资源热更新文件监控方案",
      date: "2026-02-20",
      category: "工具链",
      status: "进行中",
      summary: "记录轮询、时间戳和目录快照三种方案的实现成本和适用场景。",
      createdAt: 1771545600000
    },
    {
      id: "note-2026-03-debug",
      title: "C++ 调试与日志定位流程",
      date: "2026-03-15",
      category: "调试",
      status: "进行中",
      summary: "整理编译错误、运行时断点、日志分层和最小复现的排查顺序。",
      createdAt: 1773532800000
    },
    {
      id: "note-2026-04-threadpool-cancel",
      title: "线程池任务取消策略调研",
      date: "2026-04-26",
      category: "并发",
      status: "进行中",
      summary: "对比共享标志位、任务包装器和队列清理三种方式，准备做可中断版本验证。",
      createdAt: 1777161600000
    }
  ];
  function safeParseJSON(text, fallback = null) {
    try {
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  }

  function loadStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return safeParseJSON(raw, fallback) ?? fallback;
  }

  function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getSkills() {
    const saved = loadStorage(STORAGE_KEYS.skills, []);
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_SKILLS;
  }

  function getProjects() {
    const saved = loadStorage(STORAGE_KEYS.projects, []);
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_PROJECTS;
  }

  function getNotes() {
    const saved = loadStorage(STORAGE_KEYS.notes, []);
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_NOTES;
  }

  function todayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function normalizeUrl(value) {
    const trimmed = value.trim();
    if (!trimmed) return "#";
    return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function showToast(message) {
    const toast = qs("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsText(file, "utf-8");
    });
  }

  function initYear() {
    const node = qs("#year");
    if (node) node.textContent = String(new Date().getFullYear());
  }

  function initReveal() {
    const nodes = qsa("[data-reveal]");
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -18px 0px" }
    );
    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index * 65, 320)}ms`;
      observer.observe(node);
    });
  }

  function initNavActive() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    qsa(".nav-link[data-page]").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-page") === page);
    });
  }

  function initPageWipe() {
    const wipe = qs("#page-wipe");
    if (!wipe) return;
    requestAnimationFrame(() => wipe.classList.add("loaded"));
    qsa("a[data-transition]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") {
          return;
        }
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) return;
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
    if (!orb) return;
    const move = (x, y) => {
      orb.style.transform = `translate(${x - 110}px, ${y - 110}px)`;
    };
    move(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener("pointermove", (event) => move(event.clientX, event.clientY));
  }

  function initBackTop() {
    const btn = qs("#back-top-btn");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("is-hidden", window.scrollY < 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initThemeSwitcher() {
    const dots = qsa(".theme-dot");
    if (!dots.length) return;
    const applyTheme = (theme) => {
      if (theme === "default") document.body.removeAttribute("data-theme");
      else document.body.setAttribute("data-theme", theme);
      dots.forEach((dot) => dot.classList.toggle("active", dot.dataset.theme === theme));
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    };
    applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || "default");
    dots.forEach((dot) => dot.addEventListener("click", () => applyTheme(dot.dataset.theme || "default")));
  }

  async function fileExists(path) {
    try {
      const head = await fetch(path, { method: "HEAD" });
      if (head.ok) return true;
      const get = await fetch(path, { method: "GET" });
      return get.ok;
    } catch {
      return false;
    }
  }

  async function initOptionalAssets() {
    if (window.location.protocol === "file:") return;
    const avatarFrame = qs("#avatar-frame");
    if (avatarFrame && (await fileExists("./avatar.jpg"))) avatarFrame.classList.add("has-image");
    const resumeLink = qs("#resume-link");
    if (resumeLink && !(await fileExists("./resume.jpg"))) resumeLink.classList.add("is-hidden");
  }

  function initCopyButtons() {
    qsa("[data-copy-text]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute("data-copy-text") || "");
          showToast("已复制到剪贴板");
        } catch {
          showToast("复制失败，请手动复制");
        }
      });
    });
  }

  function renderTagList(tags, root) {
    root.innerHTML = "";
    tags.forEach((tag) => {
      const node = document.createElement("span");
      node.className = "tag";
      node.textContent = tag;
      root.appendChild(node);
    });
  }

  function createProjectCard(project, index, editMode = false) {
    const card = document.createElement("article");
    card.className = "project-card";
    if (editMode) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "project-remove";
      remove.dataset.removeProject = String(index);
      remove.textContent = "删除";
      card.appendChild(remove);
    }

    const head = document.createElement("div");
    head.className = "project-head";
    head.innerHTML = `<h3></h3><span></span>`;
    qs("h3", head).textContent = project.title;
    qs("span", head).textContent = project.period || "时间待补充";
    card.appendChild(head);

    const meta = document.createElement("p");
    meta.className = "project-meta";
    meta.textContent = project.role || "个人项目";
    card.appendChild(meta);

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = project.status || "进行中";
    card.appendChild(badge);

    if (project.tags?.length) {
      const tagList = document.createElement("div");
      tagList.className = "tag-list";
      renderTagList(project.tags, tagList);
      card.appendChild(tagList);
    }

    const ul = document.createElement("ul");
    (project.bullets?.length ? project.bullets : ["项目亮点待补充"]).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    card.appendChild(ul);

    const link = document.createElement("a");
    link.className = "project-link";
    link.href = project.linkHref || "#";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = project.linkText || "查看项目仓库";
    card.appendChild(link);
    return card;
  }

  function initSkillsEditor() {
    const root = qs("#skills-editor-root");
    if (!root) return;
    const list = qs("#skills-list", root);
    const toggleBtn = qs("#skills-edit-toggle", root);
    const resetBtn = qs("#skills-reset-btn", root);
    const panel = qs("#skills-editor-panel", root);
    const input = qs("#skill-input", root);
    const addBtn = qs("#skill-add-btn", root);
    const statusNode = qs("#skills-status", root);
    const exportBtn = qs("#skills-export-btn", root);
    const importBtn = qs("#skills-import-btn", root);
    const importInput = qs("#skills-import-input", root);
    if (!list || !toggleBtn || !resetBtn || !panel || !input || !addBtn || !statusNode || !exportBtn || !importBtn || !importInput) return;

    const state = { editMode: false, skills: [...getSkills()] };
    const setStatus = (text) => (statusNode.textContent = text);
    const save = () => {
      saveStorage(STORAGE_KEYS.skills, state.skills);
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    };
    const render = () => {
      list.innerHTML = "";
      state.skills.forEach((skill, index) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        const label = document.createElement("span");
        label.className = "chip-label";
        label.textContent = skill;
        chip.appendChild(label);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-btn";
        remove.dataset.removeSkill = String(index);
        remove.textContent = "删";
        remove.classList.toggle("is-hidden", !state.editMode);
        chip.appendChild(remove);
        list.appendChild(chip);
      });
    };
    const setEditMode = (mode) => {
      state.editMode = mode;
      panel.classList.toggle("is-hidden", !mode);
      resetBtn.classList.toggle("is-hidden", !mode);
      toggleBtn.textContent = mode ? "退出编辑" : "开启编辑";
      setStatus(mode ? "编辑模式，修改会自动保存在浏览器本地" : "浏览模式");
      render();
    };
    const addSkill = () => {
      const value = input.value.trim();
      if (!value) return setStatus("技能不能为空");
      if (state.skills.includes(value)) {
        input.value = "";
        return setStatus("该技能已存在");
      }
      state.skills.push(value);
      input.value = "";
      render();
      save();
      setStatus(`已新增技能：${value}`);
    };
    toggleBtn.addEventListener("click", () => setEditMode(!state.editMode));
    addBtn.addEventListener("click", addSkill);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addSkill();
      }
    });
    list.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-remove-skill]");
      if (!btn) return;
      const [removed] = state.skills.splice(Number(btn.dataset.removeSkill), 1);
      render();
      save();
      setStatus(`已删除技能：${removed}`);
    });
    resetBtn.addEventListener("click", () => {
      state.skills = [...DEFAULT_SKILLS];
      localStorage.removeItem(STORAGE_KEYS.skills);
      render();
      setStatus("已恢复默认技能");
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    });
    exportBtn.addEventListener("click", () => downloadJSON("weleave-skills.json", state.skills));
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const parsed = safeParseJSON(await readFileAsText(file), null);
        if (!Array.isArray(parsed)) throw new Error("invalid");
        state.skills = parsed.map((x) => String(x).trim()).filter(Boolean).slice(0, 120);
        render();
        save();
        setStatus("技能数据导入成功");
      } catch {
        setStatus("导入失败，文件格式错误");
      } finally {
        importInput.value = "";
      }
    });
    render();
    setEditMode(false);
  }

  function initProjectsEditor() {
    const root = qs("#projects-editor-root");
    if (!root) return;
    const list = qs("#projects-list", root);
    const toggleBtn = qs("#projects-edit-toggle", root);
    const resetBtn = qs("#projects-reset-btn", root);
    const panel = qs("#projects-editor-panel", root);
    const statusNode = qs("#projects-status", root);
    const exportBtn = qs("#projects-export-btn", root);
    const importBtn = qs("#projects-import-btn", root);
    const importInput = qs("#projects-import-input", root);
    const titleInput = qs("#project-title-input", root);
    const periodInput = qs("#project-period-input", root);
    const roleInput = qs("#project-role-input", root);
    const statusInput = qs("#project-status-input", root);
    const tagsInput = qs("#project-tags-input", root);
    const linkInput = qs("#project-link-input", root);
    const bulletsInput = qs("#project-bullets-input", root);
    const addBtn = qs("#project-add-btn", root);
    const searchInput = qs("#project-search-input", root);
    const statusFilter = qs("#project-filter-select", root);
    const tagFilter = qs("#project-tag-filter", root);
    if (!list || !toggleBtn || !resetBtn || !panel || !statusNode || !exportBtn || !importBtn || !importInput || !titleInput || !periodInput || !roleInput || !statusInput || !tagsInput || !linkInput || !bulletsInput || !addBtn || !searchInput || !statusFilter || !tagFilter) return;

    const state = { editMode: false, query: "", statusFilter: "全部", selectedTags: new Set(), projects: getProjects().map((p) => ({ ...p, tags: [...(p.tags || [])], bullets: [...(p.bullets || [])] })) };
    const setStatus = (text) => (statusNode.textContent = text);
    const save = () => {
      saveStorage(STORAGE_KEYS.projects, state.projects);
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    };
    const allTags = () => [...new Set(state.projects.flatMap((project) => project.tags || []))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    const renderTagFilter = () => {
      tagFilter.innerHTML = "";
      allTags().forEach((tag) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tag-filter-btn";
        btn.textContent = tag;
        btn.dataset.tag = tag;
        btn.classList.toggle("active", state.selectedTags.has(tag));
        tagFilter.appendChild(btn);
      });
    };
    const filteredProjects = () => {
      const query = state.query.trim().toLowerCase();
      return state.projects.filter((project) => {
        if (state.statusFilter !== "全部" && project.status !== state.statusFilter) return false;
        for (const tag of state.selectedTags) {
          if (!(project.tags || []).includes(tag)) return false;
        }
        if (!query) return true;
        const text = [project.title, project.period, project.role, project.status, (project.tags || []).join(" "), (project.bullets || []).join(" ")].join(" ").toLowerCase();
        return text.includes(query);
      });
    };
    const render = () => {
      renderTagFilter();
      list.innerHTML = "";
      const filtered = filteredProjects();
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-tip";
        empty.textContent = "没有匹配到项目，试试更换筛选条件。";
        list.appendChild(empty);
        return;
      }
      filtered.forEach((project) => {
        const index = state.projects.findIndex((p) => p.id === project.id);
        list.appendChild(createProjectCard(project, index, state.editMode));
      });
    };
    const setEditMode = (mode) => {
      state.editMode = mode;
      panel.classList.toggle("is-hidden", !mode);
      resetBtn.classList.toggle("is-hidden", !mode);
      toggleBtn.textContent = mode ? "退出编辑" : "开启编辑";
      setStatus(mode ? "编辑模式，修改会自动保存在浏览器本地" : "浏览模式");
      render();
    };
    const addProject = () => {
      const title = titleInput.value.trim();
      const bullets = bulletsInput.value.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 12);
      if (!title) return setStatus("项目名称不能为空");
      if (!bullets.length) return setStatus("请至少填写一条项目亮点");
      const project = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        period: periodInput.value.trim() || "时间待补充",
        role: roleInput.value.trim() || "个人项目",
        status: statusInput.value || "进行中",
        tags: tagsInput.value.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 12),
        bullets,
        linkHref: normalizeUrl(linkInput.value),
        linkText: linkInput.value.trim() ? "查看项目仓库" : "项目链接待补充",
        date: todayString(),
        createdAt: Date.now(),
      };
      state.projects.unshift(project);
      [titleInput, periodInput, roleInput, tagsInput, linkInput, bulletsInput].forEach((input) => (input.value = ""));
      statusInput.value = "进行中";
      save();
      render();
      setStatus(`已新增项目：${project.title}`);
    };
    toggleBtn.addEventListener("click", () => setEditMode(!state.editMode));
    addBtn.addEventListener("click", addProject);
    list.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-remove-project]");
      if (!btn) return;
      const [removed] = state.projects.splice(Number(btn.dataset.removeProject), 1);
      save();
      render();
      setStatus(`已删除项目：${removed.title}`);
    });
    tagFilter.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-tag]");
      if (!btn) return;
      const tag = btn.dataset.tag;
      if (state.selectedTags.has(tag)) state.selectedTags.delete(tag);
      else state.selectedTags.add(tag);
      render();
    });
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      render();
    });
    statusFilter.addEventListener("change", () => {
      state.statusFilter = statusFilter.value;
      render();
    });
    resetBtn.addEventListener("click", () => {
      state.projects = DEFAULT_PROJECTS.map((p) => ({ ...p, tags: [...p.tags], bullets: [...p.bullets] }));
      state.selectedTags.clear();
      localStorage.removeItem(STORAGE_KEYS.projects);
      render();
      setStatus("已恢复默认项目");
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    });
    exportBtn.addEventListener("click", () => downloadJSON("weleave-projects.json", state.projects));
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const parsed = safeParseJSON(await readFileAsText(file), null);
        if (!Array.isArray(parsed)) throw new Error("invalid");
        state.projects = parsed.filter((p) => p && p.title).map((p, i) => ({ ...DEFAULT_PROJECTS[0], ...p, id: String(p.id || `import-${i}`), tags: Array.isArray(p.tags) ? p.tags : [], bullets: Array.isArray(p.bullets) ? p.bullets : [] }));
        state.selectedTags.clear();
        save();
        render();
        setStatus("项目数据导入成功");
      } catch {
        setStatus("导入失败，文件格式错误");
      } finally {
        importInput.value = "";
      }
    });
    render();
    setEditMode(false);
  }

  function createNoteCard(note, index, editMode = false) {
    const card = document.createElement("article");
    card.className = "note-card";
    if (editMode) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "note-remove";
      remove.dataset.removeNote = String(index);
      remove.textContent = "删除";
      card.appendChild(remove);
    }
    const head = document.createElement("div");
    head.className = "note-head";
    head.innerHTML = `<h3></h3><span class="note-date"></span>`;
    qs("h3", head).textContent = note.title;
    qs(".note-date", head).textContent = note.date;
    card.appendChild(head);
    const tags = document.createElement("div");
    tags.className = "tag-list";
    renderTagList([note.status || "进行中", note.category || "通用"], tags);
    card.appendChild(tags);
    const summary = document.createElement("p");
    summary.className = "note-summary";
    summary.textContent = note.summary || "暂无摘要";
    card.appendChild(summary);
    return card;
  }

  function initNotesBoard() {
    const root = qs("#notes-board-root");
    if (!root) return;
    const list = qs("#notes-list", root);
    const toggleBtn = qs("#notes-edit-toggle", root);
    const resetBtn = qs("#notes-reset-btn", root);
    const panel = qs("#notes-editor-panel", root);
    const statusNode = qs("#notes-status", root);
    const exportBtn = qs("#notes-export-btn", root);
    const importBtn = qs("#notes-import-btn", root);
    const importInput = qs("#notes-import-input", root);
    const titleInput = qs("#note-title-input", root);
    const categoryInput = qs("#note-category-input", root);
    const dateInput = qs("#note-date-input", root);
    const noteStatusInput = qs("#note-status-input", root);
    const summaryInput = qs("#note-summary-input", root);
    const addBtn = qs("#note-add-btn", root);
    const searchInput = qs("#note-search-input", root);
    const statusFilter = qs("#note-status-filter", root);
    const categoryFilter = qs("#note-category-filter", root);
    if (!list || !toggleBtn || !resetBtn || !panel || !statusNode || !exportBtn || !importBtn || !importInput || !titleInput || !categoryInput || !dateInput || !noteStatusInput || !summaryInput || !addBtn || !searchInput || !statusFilter || !categoryFilter) return;

    dateInput.value = todayString();
    const state = { editMode: false, query: "", statusFilter: "全部", categoryFilter: "", notes: getNotes().map((n) => ({ ...n })) };
    const setStatus = (text) => (statusNode.textContent = text);
    const save = () => {
      saveStorage(STORAGE_KEYS.notes, state.notes);
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    };
    const filteredNotes = () => {
      const query = state.query.trim().toLowerCase();
      const category = state.categoryFilter.trim().toLowerCase();
      return state.notes.filter((note) => {
        if (state.statusFilter !== "全部" && note.status !== state.statusFilter) return false;
        if (category && !(note.category || "").toLowerCase().includes(category)) return false;
        if (!query) return true;
        return `${note.title} ${note.category} ${note.status} ${note.summary}`.toLowerCase().includes(query);
      });
    };
    const render = () => {
      list.innerHTML = "";
      const filtered = filteredNotes();
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-tip";
        empty.textContent = "暂无匹配笔记，尝试调整筛选条件。";
        list.appendChild(empty);
        return;
      }
      filtered.forEach((note) => {
        const index = state.notes.findIndex((n) => n.id === note.id);
        list.appendChild(createNoteCard(note, index, state.editMode));
      });
    };
    const setEditMode = (mode) => {
      state.editMode = mode;
      panel.classList.toggle("is-hidden", !mode);
      resetBtn.classList.toggle("is-hidden", !mode);
      toggleBtn.textContent = mode ? "退出编辑" : "开启编辑";
      setStatus(mode ? "编辑模式，修改会自动保存在浏览器本地" : "浏览模式");
      render();
    };
    const addNote = () => {
      const title = titleInput.value.trim();
      const summary = summaryInput.value.trim();
      if (!title) return setStatus("笔记标题不能为空");
      if (!summary) return setStatus("请填写学习摘要");
      const note = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        date: dateInput.value || todayString(),
        category: categoryInput.value.trim() || "通用",
        status: noteStatusInput.value || "进行中",
        summary,
        createdAt: Date.now(),
      };
      state.notes.unshift(note);
      titleInput.value = "";
      categoryInput.value = "";
      dateInput.value = todayString();
      noteStatusInput.value = "进行中";
      summaryInput.value = "";
      save();
      render();
      setStatus(`已新增笔记：${note.title}`);
    };
    toggleBtn.addEventListener("click", () => setEditMode(!state.editMode));
    addBtn.addEventListener("click", addNote);
    list.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-remove-note]");
      if (!btn) return;
      const [removed] = state.notes.splice(Number(btn.dataset.removeNote), 1);
      save();
      render();
      setStatus(`已删除笔记：${removed.title}`);
    });
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      render();
    });
    statusFilter.addEventListener("change", () => {
      state.statusFilter = statusFilter.value;
      render();
    });
    categoryFilter.addEventListener("input", () => {
      state.categoryFilter = categoryFilter.value;
      render();
    });
    resetBtn.addEventListener("click", () => {
      state.notes = DEFAULT_NOTES.map((n) => ({ ...n }));
      localStorage.removeItem(STORAGE_KEYS.notes);
      render();
      setStatus("已恢复默认笔记");
      document.dispatchEvent(new CustomEvent("weleave:data-change"));
    });
    exportBtn.addEventListener("click", () => downloadJSON("weleave-notes.json", state.notes));
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const parsed = safeParseJSON(await readFileAsText(file), null);
        if (!Array.isArray(parsed)) throw new Error("invalid");
        state.notes = parsed.filter((n) => n && n.title).map((n, i) => ({ ...DEFAULT_NOTES[0], ...n, id: String(n.id || `note-import-${i}`) }));
        save();
        render();
        setStatus("笔记数据导入成功");
      } catch {
        setStatus("导入失败，文件格式错误");
      } finally {
        importInput.value = "";
      }
    });
    render();
    setEditMode(false);
  }

  function monthKey(dateText) {
    const match = String(dateText || "").match(/(\d{4})[.-](\d{1,2})/);
    if (!match) return "未归档";
    return `${match[1]}-${String(match[2]).padStart(2, "0")}`;
  }

  function initArchivePage() {
    const root = qs("#archive-root");
    if (!root) return;
    const list = qs("#archive-list", root);
    const typeFilter = qs("#archive-type-filter", root);
    if (!list || !typeFilter) return;

    const render = () => {
      const type = typeFilter.value;
      const items = [
        ...getProjects().map((project) => ({ type: "项目", title: project.title, date: project.date || project.period, meta: project.status, summary: (project.bullets || []).join(" "), tags: project.tags || [] })),
        ...getNotes().map((note) => ({ type: "笔记", title: note.title, date: note.date, meta: note.status, summary: note.summary, tags: [note.category] })),
      ].filter((item) => type === "全部" || item.type === type);
      const groups = new Map();
      items.forEach((item) => {
        const key = monthKey(item.date);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
      });
      list.innerHTML = "";
      [...groups.keys()].sort().reverse().forEach((key) => {
        const section = document.createElement("section");
        section.className = "archive-month";
        const title = document.createElement("h3");
        title.textContent = key;
        section.appendChild(title);
        groups.get(key).forEach((item) => {
          const entry = document.createElement("article");
          entry.className = "archive-entry";
          entry.innerHTML = `<span class="badge">${item.type}</span><h4></h4><p></p><div class="tag-list"></div>`;
          qs("h4", entry).textContent = item.title;
          qs("p", entry).textContent = item.summary;
          renderTagList([item.meta, ...item.tags].filter(Boolean), qs(".tag-list", entry));
          section.appendChild(entry);
        });
        list.appendChild(section);
      });
    };
    typeFilter.addEventListener("change", render);
    render();
  }

  function initIndexDashboard() {
    const root = qs("#home-preview-root");
    if (!root) return;
    const skillCount = qs("#count-skills", root);
    const projectCount = qs("#count-projects", root);
    const noteCount = qs("#count-notes", root);
    const notesList = qs("#home-latest-notes", root);
    if (!skillCount || !projectCount || !noteCount || !notesList) return;
    const render = () => {
      const skills = getSkills();
      const projects = getProjects();
      const notes = getNotes();
      skillCount.textContent = String(skills.length);
      projectCount.textContent = String(projects.length);
      noteCount.textContent = String(notes.length);
      notesList.innerHTML = "";
      [...notes].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, 3).forEach((note) => {
        const card = document.createElement("article");
        card.className = "feature-card";
        card.innerHTML = `<h3></h3><p></p><div class="tag-list"></div>`;
        qs("h3", card).textContent = note.title;
        qs("p", card).textContent = note.summary;
        renderTagList([note.status, note.category, note.date].filter(Boolean), qs(".tag-list", card));
        notesList.appendChild(card);
      });
    };
    render();
    document.addEventListener("weleave:data-change", render);
  }

  function initPlayground() {
    const root = qs("#playground-root");
    if (!root) return;

    const ideaTopics = [
      "线程池", "ECS 组件系统", "资源热更新", "CMake 构建", "日志系统", "配置解析",
      "LRU Cache", "任务调度器", "文件监控", "MySQL 查询", "Redis 缓存", "单元测试",
      "性能 benchmark", "对象池", "事件总线", "命令行工具", "项目文档", "错误处理"
    ];
    const ideaActions = [
      "实现一个最小可运行版本", "补一组边界测试", "写一篇复盘笔记", "增加日志输出",
      "做一次性能对比", "抽象出可复用接口", "增加异常处理", "整理 README 示例",
      "画出模块关系", "拆分一个独立模块", "增加一个调试开关", "补充一段使用示例"
    ];
    const ideaOutputs = [
      "并记录设计取舍", "并写出失败场景", "并给出 CMake 运行方式", "并整理成表格",
      "并比较两种实现", "并列出后续优化点", "并补充一段测试数据", "并说明复杂度"
    ];
    const ideas = ideaTopics.flatMap((topic) =>
      ideaActions.flatMap((action) => ideaOutputs.map((output) => `${action}：${topic}，${output}。`))
    );

    const snippets = [
      "std::lock_guard<std::mutex> lock(mutex_);",
      "std::unique_lock<std::mutex> lock(mutex_);",
      "cv_.wait(lock, [&] { return stop_ || !tasks_.empty(); });",
      "auto future = pool.submit([] { return 42; });",
      "std::packaged_task<int()> task(fn);",
      "std::filesystem::last_write_time(path);",
      "target_compile_features(app PRIVATE cxx_std_20)",
      "target_link_libraries(app PRIVATE Threads::Threads)",
      "std::chrono::steady_clock::now();",
      "std::jthread worker([&](std::stop_token st) { /* ... */ });",
      "std::unordered_map<std::string, Resource> cache;",
      "std::optional<Config> load_config(const std::filesystem::path& path);",
      "EXPECT_EQ(result.size(), expected_size);",
      "auto it = std::find_if(items.begin(), items.end(), pred);",
      "std::shared_ptr<Node> node = std::make_shared<Node>();",
      "std::span<const std::byte> bytes(buffer.data(), buffer.size());",
      "if (!std::filesystem::exists(config_path)) return {};",
      "std::sort(records.begin(), records.end(), compare_by_time);",
      "std::atomic_bool stop{false};",
      "std::queue<std::function<void()>> tasks;"
    ];

    const palettes = [
      ["#0f9a94", "#ff7f50", "#1f2431", "#f7f3eb"],
      ["#0a78ba", "#22b5a6", "#263238", "#eff7fb"],
      ["#d05b34", "#f39d35", "#2f2a25", "#fff5ee"],
      ["#2f6f4e", "#e0a458", "#263238", "#f4f1de"],
      ["#4b6cb7", "#76b852", "#1d2731", "#f5f7fa"],
      ["#7a4eab", "#f0a202", "#2b2d42", "#f8f7ff"],
      ["#006d77", "#e29578", "#263238", "#edf6f9"],
      ["#31572c", "#fca311", "#14213d", "#fefae0"]
    ];

    const ideaOutput = qs("#idea-output", root);
    const snippetOutput = qs("#snippet-output", root);
    const paletteOutput = qs("#palette-output", root);
    const timerDisplay = qs("#timer-display", root);
    const minutesInput = qs("#focus-minutes", root);
    const ideaCount = qs("#idea-count", root);
    let timer = null;
    let remaining = 25 * 60;

    if (ideaCount) ideaCount.textContent = String(ideas.length);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const setTimerText = () => {
      const min = String(Math.floor(remaining / 60)).padStart(2, "0");
      const sec = String(remaining % 60).padStart(2, "0");
      timerDisplay.textContent = `${min}:${sec}`;
    };
    setTimerText();

    qs("#idea-generate", root)?.addEventListener("click", () => (ideaOutput.textContent = pick(ideas)));
    qs("#snippet-generate", root)?.addEventListener("click", () => (snippetOutput.textContent = pick(snippets)));
    qs("#palette-shuffle", root)?.addEventListener("click", () => {
      paletteOutput.innerHTML = "";
      pick(palettes).forEach((color) => {
        const swatch = document.createElement("span");
        swatch.className = "swatch";
        swatch.style.background = color;
        swatch.title = color;
        paletteOutput.appendChild(swatch);
      });
    });
    qs("#focus-start", root)?.addEventListener("click", () => {
      if (timer) return;
      remaining = Math.max(1, Number(minutesInput.value || 25)) * 60;
      setTimerText();
      timer = window.setInterval(() => {
        remaining -= 1;
        setTimerText();
        if (remaining <= 0) {
          window.clearInterval(timer);
          timer = null;
          showToast("专注时间结束");
        }
      }, 1000);
    });
    qs("#focus-reset", root)?.addEventListener("click", () => {
      if (timer) window.clearInterval(timer);
      timer = null;
      remaining = Math.max(1, Number(minutesInput.value || 25)) * 60;
      setTimerText();
    });
  }
  initYear();
  initReveal();
  initNavActive();
  initPageWipe();
  initCursorOrb();
  initBackTop();
  initThemeSwitcher();
  initOptionalAssets();
  initCopyButtons();
  initSkillsEditor();
  initProjectsEditor();
  initNotesBoard();
  initArchivePage();
  initIndexDashboard();
  initPlayground();
})();


