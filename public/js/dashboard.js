/**
 * Antigravity MCP — Developer Tool Dashboard Controller
 * Accessible, responsive, zero-dependency ES module implementation
 */

// Initial Data State
export const INITIAL_PROJECTS = [
  {
    id: "antigravity-mcp",
    name: "antigravity-mcp",
    path: "E:/Cooking/antigravity-mcp",
    defaultSurface: "dashboard",
    frontendRoots: ["src", "public"],
    blockedRoots: ["dist", "infra", "deploy"],
    status: "active",
    commands: {
      build: "npm run build",
      lint: "npm run typecheck",
      test: "npm test"
    }
  },
  {
    id: "ttsubinos",
    name: "ttsubinos",
    path: "E:/Cooking/TTSubinOS",
    defaultSurface: "product-ui",
    frontendRoots: ["src", "app", "components", "public"],
    blockedRoots: ["server", "backend", "prisma", "migrations", "infra"],
    status: "active",
    commands: {
      build: "npm run build",
      lint: "npm run lint"
    }
  }
];

export const INITIAL_SKILLS = [
  {
    name: "ui-ux-pro-max",
    version: "2.1.0",
    description: "UI/UX design intelligence for web, mobile, and desktop: 79 styles, 192 palettes, 74 font pairings, 119 UX guidelines, 105 icons, and 22 stacks.",
    status: "installed",
    installCommand: "npx --yes ui-ux-pro-max-cli@latest init --ai antigravity",
    tags: ["default", "design-system", "ux-audit"]
  },
  {
    name: "design-taste-frontend",
    version: "2.0.0",
    description: "Anti-slop frontend skill for landing pages, portfolios, and redesigns with strict pre-flight checks.",
    status: "installed",
    installCommand: "npx skills add https://github.com/Leonxlnx/taste-skill --skill 'design-taste-frontend'",
    tags: ["landing", "portfolio", "creative"]
  },
  {
    name: "redesign-existing-projects",
    version: "1.0.0",
    description: "Upgrades existing apps to premium quality without breaking existing business behavior.",
    status: "installed",
    installCommand: "npx skills add https://github.com/Leonxlnx/taste-skill --skill 'redesign-existing-projects'",
    tags: ["redesign", "audit"]
  },
  {
    name: "brand",
    version: "1.2.0",
    description: "Brand voice, visual identity, messaging frameworks, asset management, and style guides.",
    status: "installed",
    installCommand: "agy skill install brand",
    tags: ["identity", "typography"]
  },
  {
    name: "ui-styling",
    version: "1.0.0",
    description: "Tailwind CSS utility styling, shadcn/ui components, and canvas-based accessible design.",
    status: "installed",
    installCommand: "agy skill install ui-styling",
    tags: ["tailwind", "shadcn", "components"]
  }
];

export const INITIAL_TASKS = [
  {
    id: "task-001",
    conversationId: "2cf3ca67-8594-4547-b1c1-f31d6d3cc744",
    project: "antigravity-mcp",
    mode: "redesign",
    surface: "dashboard",
    task: "Redesign and implement developer-tool dashboard frontend with ui-ux-pro-max design system tokens, responsive layout, and accessibility.",
    status: "success",
    timestamp: "Just now",
    exitCode: 0,
    durationMs: 1420,
    changedFiles: ["public/index.html", "public/css/dashboard.css", "public/js/dashboard.js", "dashboard/index.html"],
    antigravityStatus: "SUCCESS",
    details: "Redesigned developer tool dashboard frontend adhering to Glassmorphism/Dark Mode OLED guidelines and Dense (8/10) spacing scale."
  },
  {
    id: "task-002",
    conversationId: "9a42f1b8-6512-42da-9102-1278adbc5231",
    project: "ttsubinos",
    mode: "polish",
    surface: "product-ui",
    task: "Improve telemetry status indicator contrast and keyboard focus outline on operator view.",
    status: "success",
    timestamp: "18m ago",
    exitCode: 0,
    durationMs: 820,
    changedFiles: ["src/components/OperatorHeader.tsx", "src/styles/telemetry.css"],
    antigravityStatus: "SUCCESS",
    details: "Enhanced text contrast to 4.8:1 and added visible focus rings for WCAG AA compliance."
  },
  {
    id: "task-003",
    conversationId: "4b9123fe-891a-493b-b219-c90a12e84123",
    project: "antigravity-mcp",
    mode: "create",
    surface: "general",
    task: "Create postgres user credentials table migration and Prisma schema update.",
    status: "handoff_required",
    timestamp: "45m ago",
    exitCode: 0,
    durationMs: 45,
    changedFiles: [],
    antigravityStatus: "HANDOFF",
    reason: "backend_task",
    details: "Scope guard detected backend database migration request. Returned handoff_required to ChatGPT orchestrator."
  },
  {
    id: "task-004",
    conversationId: "e48102fa-3012-48df-9fa2-8b431c9a0012",
    project: "ttsubinos",
    mode: "responsive",
    surface: "product-ui",
    task: "Refactor data table into responsive stacked cards on viewport under 768px.",
    status: "success",
    timestamp: "2h ago",
    exitCode: 0,
    durationMs: 1150,
    changedFiles: ["src/components/DataTable.tsx"],
    antigravityStatus: "SUCCESS",
    details: "Replaced fixed table width with mobile-first CSS grid reflow for tablet and smartphone views."
  },
  {
    id: "task-005",
    conversationId: "77a8310c-9821-419b-a01c-d78413204910",
    project: "antigravity-mcp",
    mode: "review",
    surface: "dashboard",
    task: "Audit WCAG accessibility across color contrasts, screen reader attributes, and motion settings.",
    status: "success",
    timestamp: "4h ago",
    exitCode: 0,
    durationMs: 650,
    changedFiles: [],
    antigravityStatus: "SUCCESS",
    details: "Read-only inspection passed. 0 accessibility violations found."
  }
];

// Scope Guard keyword regular expressions (mirrors src/security/scopeGuard.ts)
export const BACKEND_SIGNALS = [
  /\bspring\s*boot\b/i,
  /\bnest(?:js)?\b/i,
  /\bexpress(?:\.js)?\b/i,
  /\bfastify\b/i,
  /\bcontroller\b/i,
  /\brepository\b/i,
  /\bdatabase\b/i,
  /\bmigration\b/i,
  /\bprisma\b/i,
  /\btypeorm\b/i,
  /\bsequelize\b/i,
  /\bsql\b/i,
  /\bapi\s+(?:endpoint|route|handler)\b/i,
  /\bwebhook\b/i,
  /\bmessage\s+queue\b/i,
  /\bredis\b/i,
  /\bdocker(?:file)?\b/i,
  /\bnginx\b/i,
  /\bserver-side\b/i,
  /\bbackend\b/i,
  /cơ sở dữ liệu/i,
  /máy chủ/i,
];

export const FRONTEND_SIGNALS = [
  /\bfrontend\b/i,
  /\bui\b/i,
  /\bux\b/i,
  /\breact\b/i,
  /\bnext(?:\.js)?\b/i,
  /\bvue\b/i,
  /\bsvelte\b/i,
  /\bcomponent\b/i,
  /\bpage\b/i,
  /\blayout\b/i,
  /\bcss\b/i,
  /\btailwind\b/i,
  /\bresponsive\b/i,
  /\banimation\b/i,
  /\blanding\b/i,
  /\bportfolio\b/i,
  /\bdashboard\b/i,
  /\bsettings\b/i,
  /\bform\b/i,
  /\bdesign\b/i,
  /\bbutton\b/i,
  /\bmodal\b/i,
  /\bnavbar\b/i,
  /\bsidebar\b/i,
  /\btypography\b/i,
  /\bspacing\b/i,
  /\boverflow\b/i,
  /\bhover\b/i,
  /\bmobile\b/i,
  /\bdesktop\b/i,
  /giao diện/i,
  /\btrang\b/i,
  /\bnút\b/i,
];

/**
 * Evaluates a task instruction against frontend boundary rules.
 * Required by tests/dashboard.test.ts and live scope tester.
 */
export function evaluateScope(task, scope = []) {
  const combined = [task, ...scope].join("\n");
  
  const matchesFrontend = FRONTEND_SIGNALS.filter(pattern => pattern.test(combined)).map(p => p.source);
  const matchesBackend = BACKEND_SIGNALS.filter(pattern => pattern.test(combined)).map(p => p.source);

  const hasFrontend = matchesFrontend.length > 0;
  const hasBackend = matchesBackend.length > 0;

  if (hasBackend && hasFrontend) {
    return {
      kind: "mixed",
      status: "handoff_required",
      matchesFrontend,
      matchesBackend,
      handoffPayload: {
        reason: "mixed_scope",
        details: "The request contains both frontend and backend/infrastructure signals."
      }
    };
  }

  if (hasBackend) {
    return {
      kind: "backend",
      status: "handoff_required",
      matchesFrontend: [],
      matchesBackend,
      handoffPayload: {
        reason: "backend_task",
        details: "The request appears to be backend, database, API, or infrastructure work."
      }
    };
  }

  if (hasFrontend) {
    return {
      kind: "frontend",
      status: "executable",
      matchesFrontend,
      matchesBackend: []
    };
  }

  return {
    kind: "unclear",
    status: "handoff_required",
    matchesFrontend: [],
    matchesBackend: [],
    handoffPayload: {
      reason: "scope_unclear",
      details: "The request does not clearly identify frontend work."
    }
  };
}

export class DashboardApp {
  constructor() {
    this.projects = [...INITIAL_PROJECTS];
    this.skills = [...INITIAL_SKILLS];
    this.tasks = [...INITIAL_TASKS];
    this.selectedTaskId = this.tasks[0]?.id || null;
    this.searchQuery = "";
    this.statusFilter = "all";
    this.modeFilter = "all";

    if (typeof document !== "undefined") {
      this.initElements();
      this.initTheme();
      this.bindEvents();
      this.render();
    }
  }

  initElements() {
    this.tasksListEl = document.getElementById("tasks-list");
    this.tasksEmptyEl = document.getElementById("tasks-empty-state");
    this.taskSearchInput = document.getElementById("task-search-input");
    this.statusFilterSelect = document.getElementById("status-filter-select");
    this.modeFilterSelect = document.getElementById("mode-filter-select");
    this.resetFiltersBtn = document.getElementById("reset-filters-btn");
    this.tasksCountBadge = document.getElementById("tasks-count-badge");
    
    this.inspectorBadge = document.getElementById("inspector-badge");
    this.inspectorBody = document.getElementById("inspector-body");

    this.scopeTestInput = document.getElementById("scope-test-input");
    this.scopeVerdictResult = document.getElementById("scope-verdict-result");

    this.projectsGridEl = document.getElementById("projects-grid");
    this.skillsGridEl = document.getElementById("skills-grid");

    this.tabButtons = document.querySelectorAll(".tab-btn");
    this.tabPanels = document.querySelectorAll(".tab-panel");

    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.refreshTelemetryBtn = document.getElementById("refresh-telemetry-btn");
    this.btnCopyConfigPath = document.getElementById("btn-copy-config-path");

    // Modal
    this.openDispatchBtn = document.getElementById("open-dispatch-btn");
    this.closeModalBtn = document.getElementById("close-modal-btn");
    this.cancelModalBtn = document.getElementById("cancel-modal-btn");
    this.dispatchDialogBackdrop = document.getElementById("dispatch-dialog-backdrop");
    this.dispatchForm = document.getElementById("dispatch-form");
    this.dispatchFormFeedback = document.getElementById("dispatch-form-feedback");
    this.submitDispatchBtn = document.getElementById("submit-dispatch-btn");

    this.toastContainer = document.getElementById("toast-container");
  }

  initTheme() {
    if (typeof localStorage === "undefined" || typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("agy_mcp_theme") || 
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("agy_mcp_theme", nextTheme);
    this.showToast(`Switched to ${nextTheme} theme`);
  }

  bindEvents() {
    this.themeToggleBtn?.addEventListener("click", () => this.toggleTheme());

    this.refreshTelemetryBtn?.addEventListener("click", () => {
      this.refreshTelemetryBtn.classList.add("btn-loading");
      setTimeout(() => {
        this.refreshTelemetryBtn.classList.remove("btn-loading");
        this.showToast("Telemetry metrics refreshed");
      }, 300);
    });

    this.btnCopyConfigPath?.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText("~/.antigravity-mcp/projects.json").then(() => {
          this.showToast("Copied ~/.antigravity-mcp/projects.json to clipboard");
        });
      }
    });

    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetPanelId = btn.getAttribute("aria-controls");
        this.switchTab(btn, targetPanelId);
      });

      btn.addEventListener("keydown", (e) => {
        const tabsArray = Array.from(this.tabButtons);
        const index = tabsArray.indexOf(btn);
        let nextIndex = null;

        if (e.key === "ArrowRight") nextIndex = (index + 1) % tabsArray.length;
        if (e.key === "ArrowLeft") nextIndex = (index - 1 + tabsArray.length) % tabsArray.length;

        if (nextIndex !== null) {
          e.preventDefault();
          const nextBtn = tabsArray[nextIndex];
          nextBtn?.focus();
          if (nextBtn) {
            this.switchTab(nextBtn, nextBtn.getAttribute("aria-controls"));
          }
        }
      });
    });

    this.taskSearchInput?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderTasks();
    });

    this.statusFilterSelect?.addEventListener("change", (e) => {
      this.statusFilter = e.target.value;
      this.renderTasks();
    });

    this.modeFilterSelect?.addEventListener("change", (e) => {
      this.modeFilter = e.target.value;
      this.renderTasks();
    });

    this.resetFiltersBtn?.addEventListener("click", () => {
      this.searchQuery = "";
      this.statusFilter = "all";
      this.modeFilter = "all";
      if (this.taskSearchInput) this.taskSearchInput.value = "";
      if (this.statusFilterSelect) this.statusFilterSelect.value = "all";
      if (this.modeFilterSelect) this.modeFilterSelect.value = "all";
      this.renderTasks();
    });

    this.scopeTestInput?.addEventListener("input", (e) => {
      this.evaluateScopeInput(e.target.value);
    });

    this.openDispatchBtn?.addEventListener("click", () => this.openModal());
    this.closeModalBtn?.addEventListener("click", () => this.closeModal());
    this.cancelModalBtn?.addEventListener("click", () => this.closeModal());

    this.dispatchDialogBackdrop?.addEventListener("click", (e) => {
      if (e.target === this.dispatchDialogBackdrop) this.closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.dispatchDialogBackdrop && !this.dispatchDialogBackdrop.classList.contains("hidden")) {
        this.closeModal();
      }
    });

    this.dispatchForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleDispatchSubmit();
    });
  }

  switchTab(activeBtn, targetPanelId) {
    this.tabButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
      b.setAttribute("tabindex", "-1");
    });
    activeBtn.classList.add("active");
    activeBtn.setAttribute("aria-selected", "true");
    activeBtn.setAttribute("tabindex", "0");

    this.tabPanels.forEach(p => {
      if (p.id === targetPanelId) {
        p.classList.remove("hidden");
      } else {
        p.classList.add("hidden");
      }
    });
  }

  evaluateScopeInput(text) {
    if (!this.scopeVerdictResult) return;
    if (!text || text.trim() === "") {
      this.scopeVerdictResult.className = "scope-verdict";
      this.scopeVerdictResult.innerHTML = `
        <span class="verdict-icon" aria-hidden="true">💡</span>
        <span class="verdict-text">Type a task above to test classification in real time</span>
      `;
      return;
    }

    const decision = evaluateScope(text);

    if (decision.kind === "backend") {
      this.scopeVerdictResult.className = "scope-verdict verdict-backend";
      this.scopeVerdictResult.innerHTML = `
        <span class="verdict-icon" aria-hidden="true">⚠️</span>
        <div class="verdict-info">
          <strong>Handoff Required (Backend Task)</strong>
          <p>Scope guard detected backend work. Handed off to orchestrator.</p>
        </div>
      `;
    } else if (decision.kind === "mixed") {
      this.scopeVerdictResult.className = "scope-verdict verdict-backend";
      this.scopeVerdictResult.innerHTML = `
        <span class="verdict-icon" aria-hidden="true">⚠️</span>
        <div class="verdict-info">
          <strong>Handoff Required (Mixed Scope)</strong>
          <p>Contains both frontend and backend signals. Handed off to orchestrator.</p>
        </div>
      `;
    } else {
      this.scopeVerdictResult.className = "scope-verdict verdict-frontend";
      this.scopeVerdictResult.innerHTML = `
        <span class="verdict-icon" aria-hidden="true">✅</span>
        <div class="verdict-info">
          <strong>Frontend Only (Permitted)</strong>
          <p>Complies with strict frontend boundary and will be routed to Antigravity CLI.</p>
        </div>
      `;
    }
  }

  openModal() {
    this.dispatchDialogBackdrop?.classList.remove("hidden");
    const firstInput = this.dispatchForm?.querySelector("select, input, textarea");
    firstInput?.focus();
  }

  closeModal() {
    this.dispatchDialogBackdrop?.classList.add("hidden");
    if (this.dispatchFormFeedback) {
      this.dispatchFormFeedback.textContent = "";
      this.dispatchFormFeedback.className = "form-feedback";
    }
    this.dispatchForm?.reset();
    this.openDispatchBtn?.focus();
  }

  handleDispatchSubmit() {
    const project = document.getElementById("task-project-select")?.value || "antigravity-mcp";
    const mode = document.getElementById("task-mode-select")?.value || "redesign";
    const surface = document.getElementById("task-surface-select")?.value || "dashboard";
    const instruction = document.getElementById("task-instruction-input")?.value?.trim() || "";
    const scopeRaw = document.getElementById("task-scope-input")?.value?.trim() || "";
    const scope = scopeRaw ? scopeRaw.split(",").map(s => s.trim()) : [];

    const decision = evaluateScope(instruction, scope);
    const isBackend = decision.kind === "backend" || decision.kind === "mixed";

    if (this.submitDispatchBtn) {
      this.submitDispatchBtn.disabled = true;
      const spinner = this.submitDispatchBtn.querySelector(".btn-spinner");
      const btnText = this.submitDispatchBtn.querySelector(".btn-text");
      spinner?.classList.remove("hidden");
      if (btnText) btnText.textContent = "Running Antigravity...";

      setTimeout(() => {
        spinner?.classList.add("hidden");
        if (btnText) btnText.textContent = "Execute Task";
        this.submitDispatchBtn.disabled = false;

        const newId = `task-${String(this.tasks.length + 1).padStart(3, "0")}`;
        const newTask = {
          id: newId,
          conversationId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}`,
          project,
          mode,
          surface,
          task: instruction,
          status: isBackend ? "handoff_required" : "success",
          timestamp: "Just now",
          exitCode: 0,
          durationMs: isBackend ? 35 : Math.floor(Math.random() * 800 + 400),
          changedFiles: isBackend ? [] : [`public/${surface}.html`],
          antigravityStatus: isBackend ? "HANDOFF" : "SUCCESS",
          reason: isBackend ? decision.handoffPayload?.reason : undefined,
          details: isBackend
            ? "Scope guard classified task as backend capability. Returned handoff_required to orchestrator."
            : `Executed ${mode} frontend task on ${project} with ui-ux-pro-max.`
        };

        this.tasks.unshift(newTask);
        this.selectedTaskId = newId;
        this.closeModal();
        this.render();
        this.showToast(`Task ${newId} dispatched (${newTask.status})`);
      }, 600);
    }
  }

  showToast(message) {
    if (!this.toastContainer || typeof document === "undefined") return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  render() {
    this.renderTasks();
    this.renderProjects();
    this.renderSkills();
  }

  renderTasks() {
    if (!this.tasksListEl) return;
    const filtered = this.tasks.filter(t => {
      const matchesSearch = !this.searchQuery ||
        t.task.toLowerCase().includes(this.searchQuery) ||
        t.project.toLowerCase().includes(this.searchQuery) ||
        t.conversationId.toLowerCase().includes(this.searchQuery) ||
        t.mode.toLowerCase().includes(this.searchQuery);
      
      const matchesStatus = this.statusFilter === "all" || t.status === this.statusFilter;
      const matchesMode = this.modeFilter === "all" || t.mode === this.modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });

    if (this.tasksCountBadge) {
      this.tasksCountBadge.textContent = String(filtered.length);
    }

    if (filtered.length === 0) {
      this.tasksListEl.innerHTML = "";
      this.tasksEmptyEl?.classList.remove("hidden");
      this.renderInspector(null);
      return;
    }

    this.tasksEmptyEl?.classList.add("hidden");

    this.tasksListEl.innerHTML = filtered.map(t => {
      const isSelected = t.id === this.selectedTaskId;
      const statusBadge = t.status === "success" 
        ? `<span class="badge badge-success">Success</span>`
        : t.status === "handoff_required"
          ? `<span class="badge badge-warning">Handoff Required</span>`
          : `<span class="badge badge-destructive">${t.status}</span>`;

      return `
        <article class="task-item-card ${isSelected ? 'selected' : ''}" 
                 data-task-id="${t.id}" 
                 role="button" 
                 tabindex="0"
                 aria-label="Task ${t.id}: ${escapeHtml(t.task.slice(0, 50))}">
          <div class="task-header-row">
            <div class="task-meta-left">
              <span class="task-project-tag">${t.project}</span>
              <span class="task-mode-tag">${t.mode}</span>
              <span class="task-time">${t.timestamp}</span>
            </div>
            ${statusBadge}
          </div>

          <div class="task-desc">${escapeHtml(t.task)}</div>

          <div class="task-footer-row">
            <div class="task-files-list">
              <span class="task-files-count">${t.changedFiles.length} changed files</span>
              ${t.changedFiles.slice(0, 2).map(f => `<code>${escapeHtml(f)}</code>`).join(" ")}
              ${t.changedFiles.length > 2 ? `<span>+${t.changedFiles.length - 2} more</span>` : ""}
            </div>
            <span class="text-xs text-secondary text-mono">${t.durationMs}ms</span>
          </div>
        </article>
      `;
    }).join("");

    this.tasksListEl.querySelectorAll(".task-item-card").forEach(card => {
      const taskId = card.getAttribute("data-task-id");
      card.addEventListener("click", () => {
        this.selectedTaskId = taskId;
        this.renderTasks();
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectedTaskId = taskId;
          this.renderTasks();
        }
      });
    });

    const currentTask = this.tasks.find(t => t.id === this.selectedTaskId) || filtered[0] || null;
    this.renderInspector(currentTask);
  }

  renderInspector(task) {
    if (!this.inspectorBadge || !this.inspectorBody) return;
    if (!task) {
      this.inspectorBadge.textContent = "No Selection";
      this.inspectorBody.innerHTML = `
        <div class="inspector-placeholder">
          <p>No task matches current filters.</p>
        </div>
      `;
      return;
    }

    this.inspectorBadge.textContent = task.id;
    this.inspectorBadge.className = task.status === "success" 
      ? "badge badge-success" 
      : task.status === "handoff_required" 
        ? "badge badge-warning" 
        : "badge badge-destructive";

    this.inspectorBody.innerHTML = `
      <div class="inspector-content">
        <div>
          <div class="inspector-section-title">Telemetry Metadata</div>
          <dl class="meta-dl">
            <dt>Conversation:</dt>
            <dd><code>${task.conversationId}</code></dd>
            <dt>Project:</dt>
            <dd><strong>${task.project}</strong></dd>
            <dt>Surface:</dt>
            <dd>${task.surface || "general"}</dd>
            <dt>Duration:</dt>
            <dd>${task.durationMs}ms</dd>
            <dt>Antigravity:</dt>
            <dd>${task.antigravityStatus} (exit code ${task.exitCode})</dd>
          </dl>
        </div>

        <div>
          <div class="inspector-section-title">Execution Rationale &amp; Outcome</div>
          <p class="text-sm text-secondary">${escapeHtml(task.details)}</p>
        </div>

        <div>
          <div class="inspector-section-title">Changed Files (${task.changedFiles.length})</div>
          ${task.changedFiles.length > 0 
            ? `<div class="code-preview-block">${task.changedFiles.map(f => escapeHtml(f)).join("\n")}</div>`
            : `<p class="text-xs text-secondary">No files modified (read-only inspection or handoff)</p>`
          }
        </div>
      </div>
    `;
  }

  renderProjects() {
    if (!this.projectsGridEl) return;
    this.projectsGridEl.innerHTML = this.projects.map(p => `
      <article class="project-card">
        <div class="project-card-header">
          <span class="project-name">${p.name}</span>
          <span class="badge badge-success">${p.status}</span>
        </div>

        <dl class="meta-dl">
          <dt>Filesystem Path:</dt>
          <dd><code>${p.path}</code></dd>
          <dt>Default Surface:</dt>
          <dd><span class="badge badge-subtle">${p.defaultSurface}</span></dd>
          <dt>Frontend Roots:</dt>
          <dd>${p.frontendRoots.map(r => `<code>${r}</code>`).join(" ")}</dd>
          <dt>Blocked Roots:</dt>
          <dd>${p.blockedRoots.map(r => `<code style="color:var(--color-destructive)">${r}</code>`).join(" ")}</dd>
        </dl>
      </article>
    `).join("");
  }

  renderSkills() {
    if (!this.skillsGridEl) return;
    this.skillsGridEl.innerHTML = this.skills.map(s => `
      <article class="skill-card">
        <div class="skill-card-header">
          <span class="skill-name">${s.name}</span>
          <span class="badge badge-primary">v${s.version}</span>
        </div>
        <p class="skill-desc">${escapeHtml(s.description)}</p>
        <div class="meta-dl" style="margin-top:auto">
          <dt>Install CMD:</dt>
          <dd><code>${escapeHtml(s.installCommand)}</code></dd>
        </div>
      </article>
    `).join("");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Bootstrap dashboard on DOM ready when in browser
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.antigravityDashboard = new DashboardApp();
  });
}
