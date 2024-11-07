import fs from "fs-extra";
import { globbySync } from "globby";
import path from "path";

export function listFiles(pattern: string) {
  return globbySync([pattern, "!node_modules"]).sort();
}

export function readFile(src: string) {
  return fs.readFileSync(src, "utf8");
}

export function emptyDir(dir: string) {
  fs.emptyDirSync(dir);
}

export function copyFile(src: string, dst: string) {
  const dir = path.dirname(dst);
  fs.ensureDirSync(dir);
  fs.copyFileSync(src, dst);
}

export async function writeFile(dst: string, data: string) {
  const dir = path.dirname(dst);
  await fs.ensureDir(dir);
  await fs.writeFile(dst, data);
}
