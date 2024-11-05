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

const CWD = "notes";

emptyDirSync("dist");

const files = globbySync("**/*", { cwd: CWD }).sort();

for (const file of files) {
  const content = readFileSync(`${CWD}/${file}`, "utf8");
  const body = marked(content, { async: false });
  const title = file.replace(".md", "");
  const nav = files.map((other) => {
    const isActive = other === file;
    const name = other.replace(".md", "");
    return `<a href="/${name}" class="${isActive ? "active" : ""}">${name}</a>`;
  });

  const htmlFilePath = file.replace(".md", ".html");
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <nav>${nav.join("")}</nav>
    <main>${body}</main>
  </body>
`;

  ensureDirSync(`dist/${path.dirname(htmlFilePath)}`);
  writeFileSync(`dist/${htmlFilePath}`, html);
}

copyFileSync("app/style.css", "dist/style.css");
