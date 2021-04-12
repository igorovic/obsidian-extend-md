import { Plugin, MarkdownPostProcessorContext } from "obsidian";

import "./styles/main.scss";

async function hRulers(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
  try {
    const paragraphs = el.getElementsByTagName("p");
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      let hr;
      let matchTxt = [...p.innerText.matchAll(/--([\w§]+)--/g)];
      let emoji =
        p.innerText.split("--").length >= 1
          ? p.innerText.split("--")[1]
          : undefined;
      switch (true) {
        //bold
        case p.innerText === "===":
          hr = document.createElement("hr");
          hr.addClass("hr-bld");
          return el.replaceChild(hr, p);
        // match html emojis
        case !!emoji:
          hr = document.createElement("hr");
          hr.addClass("hr-text");
          hr.setAttribute("data-content", emoji);
          return el.replaceChild(hr, p);
        // with text
        case matchTxt?.length >= 1:
          const txt = matchTxt[0][1];
          if (!txt) return;
          hr = document.createElement("hr");
          hr.addClass("hr-text");
          hr.setAttribute("data-content", txt);
          return el.replaceChild(hr, p);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default class ExtendMDPlugin extends Plugin {
  async onload() {
    console.log("Loading extend md plugin.");
    this.registerMarkdownPostProcessor(hRulers);
  }
}
