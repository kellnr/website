// Only the languages used by <CodeBlock lang="..."> are bundled; the full highlight.js
// build ships ~190 languages and was the bulk of the main chunk. Add a language here
// when a code block needs it. Unknown `lang` values fall back to auto-detection.
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import ini from "highlight.js/lib/languages/ini";
import json from "highlight.js/lib/languages/json";
import makefile from "highlight.js/lib/languages/makefile";
import nix from "highlight.js/lib/languages/nix";
import powershell from "highlight.js/lib/languages/powershell";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";
import wasm from "highlight.js/lib/languages/wasm";
import x86asm from "highlight.js/lib/languages/x86asm";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("c", c);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("json", json);
hljs.registerLanguage("makefile", makefile);
hljs.registerLanguage("nix", nix);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("wasm", wasm);
hljs.registerLanguage("x86asm", x86asm);
hljs.registerLanguage("yaml", yaml);

export default hljs;
