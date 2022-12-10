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
  icon?: string;
};
const templates: Template[] = [
  {
    name: "Google Drive",
    url: (query) => `https://drive.google.com/drive/search?q=${query}`,
    keyword: "gd",
    icon: "chrome://favicon/https://drive.google.com",
  },
  {
    name: "Youtube",
    url: (query) => `https://www.youtube.com/results?search_query=${query}`,
    keyword: "y",
    icon: "chrome://favicon/https://youtube.com",
  },
  {
    name: "Google",
    url: (query) => `https://www.google.com/search?q=${query}`,
    keyword: "g",
    icon: "chrome://favicon/https://google.com",
  },
  {
    name: "German Wikipedia",
    url: (query) => `https://de.wikipedia.org/w/index.php?search=${query}`,
    keyword: "w",
    icon: "chrome://favicon/https://de.wikipedia.org",
  },
  {
    name: "English Wikipedia",
    url: (query) => `https://en.wikipedia.org/w/index.php?search=${query}`,
    keyword: "we",
    icon: "chrome://favicon/https://en.wikipedia.org",
  },
  {
    name: "Google Lucky Search",
    url: (query) => `https://www.google.com/search?btnI=1&q=${query}`,
    keyword: "gl",
    icon: "chrome://favicon/https://google.com",
  },
  {
    name: "Google Maps",
    url: (query) => `http://maps.google.com/?q=${query}`,
    keyword: "m",
    icon: "chrome://favicon/https://maps.google.com",
  },
  {
    name: "Contacts",
    url: (query) => `https://contacts.google.com/search/${query}`,
    keyword: "c",
    icon: "chrome://favicon/https://contacts.google.com",
  },
  {
    name: "Photos",
    url: (query) => `https://photos.google.com/search/${query}`,
    keyword: "ph",
    icon: "chrome://favicon/https://photos.google.com",
  },
  {
    name: "Gmail",
    url: (query) => `https://mail.google.com/mail/u/0/#search/${query}`,
    keyword: "gm",
    icon: "chrome://favicon/https://mail.google.com",
  },
  {
    name: "Google Scholar",
    url: (query) => `https://scholar.google.com/scholar?q=${query}`,
    keyword: "gs",
    icon: "chrome://favicon/https://scholar.google.com",
  },
  {
    name: "Google Keep",
    url: (query) => `https://keep.google.com/u/0/#search/text%253D${query}`,
    keyword: "gk",
    icon: "chrome://favicon/https://keep.google.com",
  },
  {
    name: "Amazon",
    url: (query) => `https://www.amazon.de/s?k=${query}`,
    keyword: "amz",
    icon: "chrome://favicon/https://amazon.de",
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
          icon: template.icon,
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
            icon: template.icon,
          },
        ];
      }
    }
  } else {
    return searchTemplates;
  }

  return [];
}
