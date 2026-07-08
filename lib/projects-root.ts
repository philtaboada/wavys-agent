import { existsSync } from "node:fs";
import { platform } from "node:os";

/** Ruta canónica Phil (Windows) — siempre usa `C:\Users\siste\Project`. */
export const PROJECTS_ROOT_WINDOWS = "C:\\Users\\siste\\Project";

/** Mac externo (histórico / backup). */
export const PROJECTS_ROOT_MAC =
  "/Volumes/mac externo/Mac Externo/projects";

/** Cloud agent (Cursor). */
export const PROJECTS_ROOT_CLOUD = "/workspace/project";

/**
 * Resuelve la raíz de repos de Phil.
 * Orden: override → PROJECTS_ROOT env → OS/entorno detectado → Windows (canónico).
 */
export function resolveProjectsRoot(override?: string): string {
  if (override?.trim()) return override.trim();
  if (process.env.PROJECTS_ROOT?.trim()) {
    return process.env.PROJECTS_ROOT.trim();
  }

  if (platform() === "win32") return PROJECTS_ROOT_WINDOWS;

  if (existsSync(PROJECTS_ROOT_CLOUD)) return PROJECTS_ROOT_CLOUD;
  if (existsSync(PROJECTS_ROOT_MAC)) return PROJECTS_ROOT_MAC;

  return PROJECTS_ROOT_WINDOWS;
}
