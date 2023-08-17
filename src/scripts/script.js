import newWindowIcon from "../assets/icon-new-window.svg";
import "./font-theme";
import "./prefersColorScheme";
import "./select";

import dictionarySearch from "./dictionaryapi.js";
import element from "./element-factory";

const searchButton = document.getElementById("search-button");
const searchTerm = document.getElementById("search-term");
const keywordPlayButton = document.querySelector("[data-keyword__play]");

searchButton.addEventListener("click", () => initiateSearch());

function initiateSearch(keyword) {
  const searchFor = keyword || searchTerm.value;
  if (searchFor) {
    location.assign(
      location.href.split("#")[0] + "#" + encodeURIComponent(searchFor)
    );
  }
}

console.log("location: " + location.href.split("#")[1]);
const initialKeyword = location.href.split("#")[1];
if (initialKeyword) {
  search(initialKeyword);
}

window.addEventListener("hashchange", (evt) => {
  console.log("keyword: " + location.href.split("#")[1]);
  const keyword = decodeURIComponent(location.href.split("#")[1]);
  if (keyword) {
    search(keyword);
  }
});

// if enter key on searchTerm, then also search
searchTerm.addEventListener(
  "keydown",
  (evt) => evt.key === "Enter" && initiateSearch()
);

keywordPlayButton.addEventListener("click", (evt) => {
  const audioEl = document.querySelector("[data-keyword__audio]");
  audioEl.play();
});

function search(term) {
  setDataState("busy");
  const keyword = term || searchTerm.value;
  dictionarySearch(keyword).then((result) => {
    if (result.error) {
      setDataState("error");
      fillError(result);
    } else {
      setDataState("keyword");
      fillKeyword(result[0]);
      fillDefinitions(result);
      searchTerm.value = "";
    }
  });
}

function setDataState(state) {
  const dataStateEl = document.querySelector("[data-state]");
  if (state) {
    dataStateEl.setAttribute("data-state", state);
  } else {
    dataStateEl.setAttribute("data-state", "");
  }
}

function fillError(data) {
  console.log(JSON.stringify(data));
  const definitions = document.querySelector("[data-definitions]");
  definitions.innerText = "";
  const title = document.querySelector("[data-error-title]");
  title.innerText = data?.title;
  const message = document.querySelector("[data-error-message]");
  message.innerText = data?.message;
}

function fillKeyword(data) {
  // data-keyword, data-pronunciation, data-audio
  const termEl = document.querySelector("[data-keyword__term]");
  termEl.innerText = data.word;

  const pronunciationEl = document.querySelector(
    "[data-keyword__pronunciation]"
  );
  pronunciationEl.innerText = data.phonetic || "";

  // return first non-empty audio tag
  let audioUrl = data.phonetics.find((e) => {
    return e.audio;
  });
  const audioEl = document.querySelector("[data-keyword__audio]");
  audioEl?.setAttribute("src", audioUrl?.audio);
}

function fillDefinitions(data) {
  const definitions = document.querySelector("[data-definitions]");
  // clear contents if any
  definitions.innerText = "";

  for (const result of data) {
    for (const partOfSpeech of result.meanings) {
      element("h2")
        .text(partOfSpeech.partOfSpeech)
        .class("definition__part-of-speech")
        .class("heading--2")
        .addTo(definitions);
      element("h3")
        .text("Meaning")
        .class("definition__meaning-label")
        .class("heading--3")
        .addTo(definitions);
      const ulEl = element("ul")
        .class("definition__meaning-list")
        .addTo(definitions);

      for (const defn of partOfSpeech.definitions) {
        const liEl = element("li").addTo(ulEl);
        const defnTextEl = element("p")
          .text(defn.definition)
          .class("definition__text")
          .class("text--1")
          .addTo(liEl);
        if (defn.example) {
          element("p")
            .text(defn.example)
            .class("definition__example")
            .class("text--1")
            .addTo(liEl);
        }

        if (defn.synonyms.length) {
          element("h4")
            .text("Synonyms")
            .class("definition__synonym-label")
            .addTo(liEl);
          const defnSynUlEl = element("ul")
            .class("definition__synonym-list")
            .addTo(liEl);
          for (const syn of defn.synonyms) {
            const liEl = element("li")
              .class("definition__synonym")
              .addTo(defnSynUlEl);
            element("a")
              .text(syn)
              .attribute(
                "href",
                location.origin +
                  location.pathname +
                  "#" +
                  encodeURIComponent(syn)
              )
              .addTo(liEl);
          }
        }
        if (defn.antonyms.length) {
          element("h4")
            .text("Antonyms")
            .class("definition__antonym-label")
            .addTo(liEl);
          const defnAntUlEl = element("ul")
            .class("definition__antonym-list")
            .addTo(liEl);
          for (const ant of defn.antonyms) {
            const liEl = element("li").class("definition__antonym").addTo(liEl);
            element("a")
              .text(ant)
              .attribute(
                "href",
                location.origin +
                  location.pathname +
                  "#" +
                  encodeURIComponent(ant)
              )
              .addTo(liEl);
          }
        }
      }
      if (partOfSpeech.synonyms.length) {
        const div = element("div").addTo(definitions);
        element("h3")
          .text("Synonyms")
          .class("definition__synonym-label")
          .class("heading--3")
          .addTo(div);
        const synUlEl = element("ul")
          .class("definition__synonym-list")
          .addTo(div);

        for (const syn of partOfSpeech.synonyms) {
          const liEl = element("li")
            .class("definition__synonym")
            .addTo(synUlEl);
          element("a")
            .text(syn)
            .attribute(
              "href",
              location.origin +
                location.pathname +
                "#" +
                encodeURIComponent(syn)
            )
            .addTo(liEl);
        }
      }
      if (partOfSpeech.antonyms.length) {
        const div = element("div").addTo(definitions);
        element("h3")
          .text("Antonyms")
          .class("definition__antonym-label")
          .class("heading--3")
          .addTo(div);
        const antUlEl = element("ul")
          .class("definition__antonym-list")
          .addTo(div);

        for (const ant of partOfSpeech.antonyms) {
          const liEl = element("li")
            .class("definition__antonym")
            .addTo(antUlEl);
          element("a")
            .text(ant)
            .attribute(
              "href",
              location.origin +
                location.pathname +
                "#" +
                encodeURIComponent(ant)
            )
            .addTo(liEl);
        }
      }
    }
    element("h4")
      .text("Source")
      .class("definition__source-label")
      .addTo(definitions);
    const defnSourceList = element("ul")
      .class("definition__source-list")
      .addTo(definitions);
    for (const url of result.sourceUrls) {
      const sourceItem = element("li")
        .class("definition__source-url")
        .addTo(defnSourceList);
      const ahref = element("a")
        .attribute("href", url)
        .attribute("target", "_blank")
        .addTo(sourceItem);
      element("span").text(url).addTo(ahref);
      element("img")
        .class("icon")
        .class("icon-new-window")
        .attribute("src", newWindowIcon)
        .attribute("aria-hidden", "true")
        .addTo(ahref);
    }
  }
}
