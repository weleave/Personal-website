(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const STORAGE_KEYS = {
    skills: "weleave.skills.v3",
    projects: "weleave.projects.v5",
    memos: "weleave.playground.memos.v1",
    focusSessions: "weleave.playground.focus.sessions.v1",
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

  function initPlaygroundTools() {
    const root = qs("#playground-root");
    if (!root) {
      return;
    }

    const memoInput = qs("#memo-input");
    const memoAddBtn = qs("#memo-add-btn");
    const memoClearBtn = qs("#memo-clear-btn");
    const memoList = qs("#memo-list");
    const memoStatus = qs("#memo-status");

    const timerDisplay = qs("#focus-timer-display");
    const focusSessionCount = qs("#focus-session-count");
    const focusStartBtn = qs("#focus-start-btn");
    const focusPauseBtn = qs("#focus-pause-btn");
    const focusResetBtn = qs("#focus-reset-btn");
    const focusStatus = qs("#focus-status");
    const presetButtons = qsa("[data-focus-minutes]");

    const ideaRefreshBtn = qs("#idea-refresh-btn");
    const ideaTextNode = qs("#idea-card-text");
    const ideaTagNode = qs("#idea-card-tag");

    if (
      !memoInput ||
      !memoAddBtn ||
      !memoClearBtn ||
      !memoList ||
      !memoStatus ||
      !timerDisplay ||
      !focusSessionCount ||
      !focusStartBtn ||
      !focusPauseBtn ||
      !focusResetBtn ||
      !focusStatus ||
      !ideaRefreshBtn ||
      !ideaTextNode ||
      !ideaTagNode
    ) {
      return;
    }

    const memoDefaults = [
      "做一个只记录一句话的小页面，不追求复杂功能，先把交互做顺。",
      "给网站补一个纯娱乐模块，例如随机配色卡、冷知识卡片或者小型打卡器。",
      "把某个已经写过的 C++ 模块画成结构图，再反过来检查接口边界是否清晰。",
    ];

    const ideaDeck = [
      {
        text: "做一个“今天吃什么”随机卡片，点击按钮随机抽一个餐食，并记录最近 5 次选择。",
        tag: "#生活小工具",
      },
      {
        text: "写一个极简像素画板，只支持 8x8 网格和 6 种颜色，但要能一键清空和导出截图。",
        tag: "#交互实验",
      },
      {
        text: "做一个纯前端倒数日组件，输入一个日期后自动算还剩几天，并根据接近程度改变背景色。",
        tag: "#时间组件",
      },
      {
        text: "做一个“随机一句提醒”卡片，不讲大道理，只放短句，比如先提交一个可运行版本，再慢慢重构。",
        tag: "#轻量提示器",
      },
      {
        text: "给个人站点做一个隐藏彩蛋：连续点击品牌名 5 次后，随机切换一套主题色并显示一条提示。",
        tag: "#网页彩蛋",
      },
      {
        text: "做一个极简本地书签板，把临时想看的技术文章链接先存下来，支持一键复制和删除。",
        tag: "#本地收藏",
      },
    ];

    const noteState = {
      memos: memoDefaults,
    };

    const cachedMemos = safeJsonParse(localStorage.getItem(STORAGE_KEYS.memos) || "");
    if (Array.isArray(cachedMemos) && cachedMemos.length > 0) {
      noteState.memos = cachedMemos.map((item) => String(item).trim()).filter(Boolean).slice(0, 60);
    }

    function saveMemos() {
      localStorage.setItem(STORAGE_KEYS.memos, JSON.stringify(noteState.memos));
    }

    function setMemoStatus(text) {
      memoStatus.textContent = text;
    }

    function renderMemos() {
      memoList.innerHTML = "";
      if (noteState.memos.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-tip";
        empty.textContent = "现在没有便签，可以先写一条临时想法。";
        memoList.appendChild(empty);
        return;
      }

      noteState.memos.forEach((memo, index) => {
        const card = document.createElement("article");
        card.className = "note-card";

        const text = document.createElement("p");
        text.textContent = memo;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "删";
        removeBtn.dataset.removeMemo = String(index);

        card.append(text, removeBtn);
        memoList.appendChild(card);
      });
    }

    function addMemo() {
      const value = memoInput.value.trim();
      if (!value) {
        setMemoStatus("便签内容不能为空");
        return;
      }

      noteState.memos.unshift(value);
      noteState.memos = noteState.memos.slice(0, 60);
      memoInput.value = "";
      renderMemos();
      saveMemos();
      setMemoStatus("已新增一条便签");
    }

    function removeMemo(index) {
      if (index < 0 || index >= noteState.memos.length) {
        return;
      }
      noteState.memos.splice(index, 1);
      renderMemos();
      saveMemos();
      setMemoStatus("已删除一条便签");
    }

    memoAddBtn.addEventListener("click", addMemo);
    memoInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addMemo();
      }
    });

    memoList.addEventListener("click", (event) => {
      const removeBtn = event.target.closest("[data-remove-memo]");
      if (!removeBtn) {
        return;
      }
      removeMemo(Number(removeBtn.dataset.removeMemo));
    });

    memoClearBtn.addEventListener("click", () => {
      noteState.memos = [];
      saveMemos();
      renderMemos();
      setMemoStatus("已清空便签墙");
    });

    let focusDurationSec = 25 * 60;
    let focusRemainSec = focusDurationSec;
    let timerId = null;
    let sessions = Number(localStorage.getItem(STORAGE_KEYS.focusSessions) || "0");
    if (!Number.isFinite(sessions) || sessions < 0) {
      sessions = 0;
    }

    function formatTimer(totalSec) {
      const safeSec = Math.max(0, Math.floor(totalSec));
      const minutes = String(Math.floor(safeSec / 60)).padStart(2, "0");
      const seconds = String(safeSec % 60).padStart(2, "0");
      return `${minutes}:${seconds}`;
    }

    function saveSessions() {
      localStorage.setItem(STORAGE_KEYS.focusSessions, String(sessions));
    }

    function renderTimer() {
      timerDisplay.textContent = formatTimer(focusRemainSec);
      focusSessionCount.textContent = String(sessions);
    }

    function stopTimer() {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function setFocusStatus(text) {
      focusStatus.textContent = text;
    }

    function setFocusDuration(minutes) {
      stopTimer();
      focusDurationSec = minutes * 60;
      focusRemainSec = focusDurationSec;
      presetButtons.forEach((btn) => {
        btn.classList.toggle("active", Number(btn.dataset.focusMinutes) === minutes);
      });
      renderTimer();
      setFocusStatus(`已切换到 ${minutes} 分钟专注模式`);
    }

    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setFocusDuration(Number(button.dataset.focusMinutes));
      });
    });

    focusStartBtn.addEventListener("click", () => {
      if (timerId !== null) {
        return;
      }

      setFocusStatus("专注计时进行中");
      timerId = window.setInterval(() => {
        focusRemainSec -= 1;
        renderTimer();

        if (focusRemainSec <= 0) {
          stopTimer();
          sessions += 1;
          saveSessions();
          focusRemainSec = focusDurationSec;
          renderTimer();
          setFocusStatus(`本轮完成，累计 ${sessions} 轮专注`);
        }
      }, 1000);
    });

    focusPauseBtn.addEventListener("click", () => {
      stopTimer();
      setFocusStatus("已暂停计时");
    });

    focusResetBtn.addEventListener("click", () => {
      stopTimer();
      focusRemainSec = focusDurationSec;
      renderTimer();
      setFocusStatus("已重置当前计时");
    });

    function refreshIdeaCard() {
      const nextIndex = Math.floor(Math.random() * ideaDeck.length);
      const idea = ideaDeck[nextIndex];
      ideaTextNode.textContent = idea.text;
      ideaTagNode.textContent = idea.tag;
    }

    ideaRefreshBtn.addEventListener("click", refreshIdeaCard);

    renderMemos();
    renderTimer();
    refreshIdeaCard();
  }

  initYear();
  initReveal();
  initNavActive();
  initPageWipe();
  initCursorOrb();
  initOptionalAssets();
  initSkillsEditor();
  initProjectsEditor();
  initPlaygroundTools();
})();
