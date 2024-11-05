import { globbySync } from "globby";
import path from "path";
import {
  emptyDirSync,
  readFileSync,
  writeFileSync,
  ensureDirSync,
  copyFileSync,
} from "fs-extra";
import { marked } from "marked";

const MARKDOWN_FILES_DIR = "notes";
const OUT_DIR = "dist";

emptyDirSync("dist");

const indexHtml = readFileSync("app/index.html", "utf8");
const markdownFiles = globbySync("**/*.md", { cwd: MARKDOWN_FILES_DIR }).sort();

for (const file of markdownFiles) {
  const content = readFileSync(`${MARKDOWN_FILES_DIR}/${file}`, "utf8");

  const title = file.replace(".md", "");

  const body = marked(content, { async: false });

  const nav = markdownFiles
    .map((other) => {
      const isActive = other === file;
      const href = other.replace(".md", "");
      return `<a href="/${href}" class="${isActive ? "active" : ""}">${href}</a>`;
    })
    .join("");

  const htmlFilePath = file.replace(".md", ".html");
  const htmlFileDir = path.dirname(htmlFilePath);
  const html = indexHtml
    .replace("TITLE", title)
    .replace("BODY", body)
    .replace("NAV", nav);

  ensureDirSync(`${OUT_DIR}/${htmlFileDir}`);
  writeFileSync(`${OUT_DIR}/${htmlFilePath}`, html);
}

copyFileSync("app/style.css", `${OUT_DIR}/style.css`);
