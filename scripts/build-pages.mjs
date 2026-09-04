import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";

// Збірка статичного експорту для GitHub Pages.
// На Pages немає Node-сервера: redirects з next.config не працюють,
// тому кореневий index.html з редиректом на /uk/ дописуємо вручну.
process.env.EXPORT_MODE = "1";
process.env.NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/new-creator-landing";

const build = spawnSync("npx", ["next", "build"], { stdio: "inherit", shell: true });
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const redirectPage = `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>NEW CREATOR</title>
    <meta http-equiv="refresh" content="0; url=./uk/" />
    <script>location.replace("./uk/");</script>
  </head>
  <body>
    <a href="./uk/">NEW CREATOR — українською</a>
  </body>
</html>
`;

await writeFile("out/index.html", redirectPage, "utf8");
console.log("Wrote out/index.html redirect to ./uk/");
