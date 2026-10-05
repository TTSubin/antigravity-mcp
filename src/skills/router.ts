import type {
  FrontendMode,
  FrontendSurface,
} from "../types.js";

export interface SkillRoute {
  skills: string[];
  installCommands: Record<string, string>;
}

const TASTE_SOURCE = "https://github.com/Leonxlnx/taste-skill";
const UI_UX_PRO_MAX_INSTALL =
  "npx --yes ui-ux-pro-max-cli@latest init --ai antigravity";

function install(skill: string): string {
  if (skill === "ui-ux-pro-max") return UI_UX_PRO_MAX_INSTALL;
  return `npx skills add ${TASTE_SOURCE} --skill "${skill}"`;
}

export function routeSkills(
  mode: FrontendMode,
  surface: FrontendSurface,
  explicit: string[] = [],
): SkillRoute {
  if (explicit.length > 0) {
    return {
      skills: [...new Set(explicit)],
      installCommands: Object.fromEntries(
        explicit.map((skill) => [skill, install(skill)]),
      ),
    };
  }

  const skills: string[] = ["ui-ux-pro-max"];

  if (mode === "redesign" || mode === "polish" || mode === "review") {
    skills.push("redesign-existing-projects");
  }

  if (
    surface === "dashboard" ||
    surface === "settings" ||
    surface === "form" ||
    surface === "product-ui"
  ) {
    skills.push("design-taste-frontend-v1");
  } else {
    skills.push("design-taste-frontend");
  }

  const unique = [...new Set(skills)];
  return {
    skills: unique,
    installCommands: Object.fromEntries(
      unique.map((skill) => [skill, install(skill)]),
    ),
  };
}
