import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import { writeFileSync } from "fs";
import path from "path";
import pkg from "./package.json";

const TEST_VAULT = "../test_vault/";
const OBSIDIAN_PLUGINSDIR = ".obsidian/plugins/";
const PLUGIN_NAME = pkg.name;
const DEV_PLUGIN_DEST = path.join(TEST_VAULT, OBSIDIAN_PLUGINSDIR, PLUGIN_NAME);
const isDev = String(process.env.NODE_ENV).toLowerCase() === "development";
const plugins = [];

if (!isDev) {
  plugins.push(terser());
}

const Config = {
  input: "src/main.ts",
  output: [
    {
      file: "dist/main.js",
      sourcemap: "inline",
      format: "cjs",
      exports: "default",
      plugins,
    },
  ],
  external: ["obsidian", "fs", "path", "util"],
  plugins: [
    typescript({ target: "ES2020" }),
    nodeResolve({ browser: true }),
    commonjs(),
    scss({
      output: function (styles) {
        writeFileSync("dist/styles.css", styles);
        if (isDev) {
          writeFileSync(path.join(DEV_PLUGIN_DEST, "styles.css"), styles);
        }
      },
      sass: require("sass"),
    }),
  ],
};

/**
 * Development environment
 */
if (isDev && TEST_VAULT) {
  // copy plugin to TEST_VAULT
  Config.output.push({
    file: path.join(DEV_PLUGIN_DEST, "main.js"),
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
    plugins,
  });
  Config.plugins.push(
    copy({
      targets: [
        {
          src: "manifest.json",
          dest: path.join(DEV_PLUGIN_DEST),
        },
        {
          src: "dist/styles.css",
          dest: path.join(DEV_PLUGIN_DEST),
        },
      ],
    })
  );
}

export default Config;
