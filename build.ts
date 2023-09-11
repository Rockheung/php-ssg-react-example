import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import App from "./src/App";

type Manifest = Record<
  string,
  Record<string, unknown> & {
    file: string;
    isEntry?: true;
  }
>;

type Package = {
  name: string;
};

const build = async (): Promise<void> => {
  // vite가 빌드한 결과물을 읽어온다.
  const manifest: Manifest = JSON.parse(
    fs.readFileSync("./dist/manifest.json", "utf-8")
  );
  const packageJson: Package = JSON.parse(
    fs.readFileSync("./package.json", "utf-8")
  );
  // php가 로드할 pre-rendered html block을 만들어준다.
  const subFile = fs.createWriteStream(
    `./dist/${packageJson.name}.php`,
    "utf-8"
  );
  subFile.write('<div id="root">');

  const { pipe } = renderToPipeableStream(React.createElement(App), {
    // 엔트리 포인트의 단일함이 보장되고, 멀티 output 하지 않을 것이기 때문에.
    bootstrapScripts: [
      path.join(
        "dist",
        Object.values(manifest).find((value) => value.isEntry)!.file
      ),
    ],
    onShellReady() {
      pipe(subFile);
      subFile.write("</div>");
    },
  });
};

build().catch(console.error);
