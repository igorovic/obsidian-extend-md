import { URL } from "url";
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
          if (!txt) return el;
          hr = document.createElement("hr");
          hr.addClass("hr-text");
          hr.setAttribute("data-content", txt);
          return el.replaceChild(hr, p);
        default:
          return el;
      }
    }
  } catch (err) {
    console.error(err);
    return el;
  }
}

async function UrlHighlighter(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext
) {
  console.log(source, el);
  console.log(el);
  let presentation;
  try {
    const _url = new URL(source);
    //console.log(_url);
    presentation = document.createElement("p");
    presentation.innerHTML = source;
    presentation.innerHTML = presentation.innerHTML.replaceAll(
      "?",
      `<span class="reserved-char">?</span>`
    );
    presentation.innerHTML = presentation.innerHTML.replaceAll(
      "&amp;",
      `<span class="reserved-char">&amp;</span>`
    );
    presentation.innerHTML = presentation.innerHTML.replaceAll(
      "#",
      `<span class="reserved-char">#</span>`
    );
  } catch (err) {
    console.error(err);
    presentation = document.createElement("pre");
    presentation.innerText = source;
  } finally {
    el.parentElement.replaceChild(presentation, el);
  }
}

export default class ExtendMDPlugin extends Plugin {
  async onload() {
    console.log("Loading extend md plugin.");
    this.registerMarkdownPostProcessor(hRulers);
    this.registerMarkdownCodeBlockProcessor("url", UrlHighlighter);
  }
}
