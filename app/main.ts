import { marked } from "marked";
import { copyFile, emptyDir, listFiles, readFile, writeFile } from "./utils.ts";

emptyDir("dist");

const markdownFiles = listFiles("**/*.md");
const indexHtml = readFile("app/templates/index.html");
const navItemHtml = readFile("app/templates/nav-item.html");

for (const file of markdownFiles) {
  const content = readFile(file);
  const title = file.replace(".md", "");
  const body = marked(content, { async: false });
  const nav = markdownFiles
    .map((other) => {
      const isActive = other === file;
      const href = other.replace(".md", "");
      return navItemHtml
        .replace("PATH", `/${href}`)
        .replace("LABEL", href)
        .replace("ACTIVE", isActive ? "active" : "");
    })
    .join("");

  const htmlFilePath = file.replace(".md", ".html");
  const html = indexHtml
    .replace("TITLE", title)
    .replace("BODY", body)
    .replace("NAV", nav);

  writeFile(`dist/${htmlFilePath}`, html);
}

copyFile("app/style.css", "dist/style.css");
