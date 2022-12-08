import { parseInputCommand } from "./parseInputCommand";
import browser from "webextension-polyfill";
import { useMemo } from "react";
import useShortcut from "./useShortcut";

export type UseSuggestionParam = {
  setInputValue: (a: string) => void;
  inputValue: string;
};

type Template = {
  name: string;
  url: (query: string) => string;
  keyword: string;
};
const templates: Template[] = [
  {
    name: "Google Drive",
    url: (query) => `https://drive.google.com/drive/search?q=${query}`,
    keyword: "gd",
  },
  {
    name: "Youtube",
    url: (query) => `https://www.youtube.com/results?search_query=${query}`,
    keyword: "y",
  },
  {
    name: "Google",
    url: (query) => `https://www.google.com/search?q=${query}`,
    keyword: "g",
  },
  {
    name: "German Wikipedia",
    url: (query) => `https://de.wikipedia.org/w/index.php?search=${query}`,
    keyword: "w",
  },
  {
    name: "English Wikipedia",
    url: (query) => `https://en.wikipedia.org/w/index.php?search=${query}`,
    keyword: "we",
  },
  {
    name: "Google Lucky Search",
    url: (query) => `https://www.google.com/search?btnI=1&q=${query}`,
    keyword: "gl",
  },
  {
    name: "Google Maps",
    url: (query) => `http://maps.google.com/?q=${query}`,
    keyword: "m",
  },
  {
    name: "Contacts",
    url: (query) => `https://contacts.google.com/search/${query}`,
    keyword: "c",
  },
  {
    name: "Photos",
    url: (query) => `https://photos.google.com/search/${query}`,
    keyword: "ph",
  },
  {
    name: "Gmail",
    url: (query) => `https://mail.google.com/mail/u/0/#search/${query}`,
    keyword: "gm",
  },
  {
    name: "Google Scholar",
    url: (query) => `https://scholar.google.com/scholar?q=${query}`,
    keyword: "gs",
  },
  {
    name: "Google Keep",
    url: (query) => `https://keep.google.com/u/0/#search/text%253D${query}`,
    keyword: "gk",
  },
  {
    name: "Amazon",
    url: (query) => `https://www.amazon.de/s?k=${query}`,
    keyword: "amz",
  },

];

export function useTemplatedSuggestions({
  setInputValue,
  inputValue,
}: UseSuggestionParam) {
  const searchTemplates = useMemo(
    () =>
      templates.map((template) => {
        const shortcut = useShortcut(template.keyword, {
          setInputValue,
        });
        return {
          name: `Search ${template.name}`,
          category: "Search",
          command: async function () {
            setInputValue(template.keyword + " ");
          },
          keyword: template.keyword,
          shortcut,
        };
      }),
    []
  );
  const { didMatch, keyword, query } = parseInputCommand(inputValue);
  if (didMatch) {
    for (const template of templates) {
      if (keyword.toLowerCase() === template.keyword.toLowerCase()) {
        return [
          {
            name: `Search ${template.name}: ${query}`,
            category: "Search",
            command: async function () {
              await browser.tabs.create({
                url: template.url(query),
              });
            },
          },
        ];
      }
    }
  } else {
    return searchTemplates;
  }

  return [];
}
