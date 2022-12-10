import { parseInputCommand } from "./parseInputCommand";
import browser from "webextension-polyfill";
import { useMemo } from "react";
import useShortcut from "./useShortcut";
import { Command } from "./commandsSuggestions";

export type UseSuggestionParam = {
  setInputValue: (a: string) => void;
  inputValue: string;
};

type Template = {
  name: string;
  url: (query: string) => string;
  icon?: string;
};
const templates: Template[] = [
  {
    name: "Calendar Event",
    url: (query) => `https://meeting.new`,
    icon: "chrome://favicon/https://calendar.google.com",
  },
  {
    name: "GitHub Repository",
    url: (query) => `https://repo.new`,
    icon: "chrome://favicon/https://github.com",
  },
  {
    name: "GitHub Gist",
    url: (query) => `https://gist.new`,
    icon: "chrome://favicon/https://github.com",
  },
  {
    name: "GitHub Codespace",
    url: (query) => `https://codespace.new`,
    icon: "chrome://favicon/https://github.com",
  },
  {
    name: "Google Docs",
    url: (query) => `https://docs.new`,
    icon: "chrome://favicon/https://docs.google.com",
  },
  {
    name: "Google Spreadsheet",
    url: (query) => `https://sheets.new`,
    icon: "chrome://favicon/https://sheets.google.com",
  },
  {
    name: "Google Slides",
    url: (query) => `https://slides.new`,
    icon: "chrome://favicon/https://slides.google.com",
  },
  {
    name: "Prezi",
    url: (query) => `https://prezi.new`,
    icon: "chrome://favicon/https://prezi.com",
  },
  {
    name: "CodePen",
    url: (query) => `https://pen.new`,
    icon: "chrome://favicon/https://codepen.io",
  },
  {
    name: "Kotlin Pad",
    url: (query) => `https://kotlin.new`,
    icon: "chrome://favicon/https://app.coderpad.io",
  },
  {
    name: "Python Pad",
    url: (query) => `https://python.new`,
    icon: "chrome://favicon/https://app.coderpad.io",
  },
  {
    name: "Code Snippet",
    url: (query) => `https://snippet.new`,
    icon: "chrome://favicon/https://codespace.app",
  },
  {
    name: "Deepnote Notebook",
    url: (query) => `https://deepnote.new`,
    icon: "chrome://favicon/https://deepnote.com",
  },
  {
    name: "Google App Script",
    url: (query) => `https://script.new`,
    icon: "chrome://favicon/https://script.google.com",
  },
  {
    name: "HTTP Request",
    url: (query) => `https://req.new`,
    icon: "chrome://favicon/https://httpie.io",
  },
  {
    name: "MatLab Playground",
    url: (query) => `https://matlab.new`,
    icon: "chrome://favicon/https://matlab.mathworks.com",
  },
  {
    name: "Runkit Playground",
    url: (query) => `https://playground.new`,
    icon: "chrome://favicon/https://runkit.com",
  },
];

export function useCreateSuggestions(
  KEYWORD: string,
  { setInputValue, inputValue }: UseSuggestionParam,
) {
  const { didMatch, keyword } = parseInputCommand(inputValue);
  const myMatch = keyword === KEYWORD;

  const commands: Command[] = useMemo(() => {
    return templates.map((template) => ({
      name: template.name,
      category: "New",
      command: async function () {
        const url = template.url(inputValue);
        await browser.tabs.create({ url });
      },
      icon: template.icon,
    }));
  }, [setInputValue]);

  const keywordSuggestion = useMemo(
    () => [
      {
        name: "Create New",
        category: "New",
        command: async function () {
          setInputValue(KEYWORD + " ");
        },
        keyword: KEYWORD,
      },
    ],
    [],
  );

  if (myMatch) return commands;
  if (didMatch) return [];
  return keywordSuggestion;
}
