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
};
const templates: Template[] = [
  {
    name: "New Calendar Event",
    url: (query) => `https://meeting.new`,
  },
  {
    name: "New GitHub Repository",
    url: (query) => `https://repo.new`,
  },
  {
    name: "New GitHub Gist",
    url: (query) => `https://gist.new`,
  },
  {
    name: "New GitHub Codespace",
    url: (query) => `https://codespace.new`,
  },
  {
    name: "New Google Docs",
    url: (query) => `https://docs.new`,
  },
  {
    name: "New Google Spreadsheet",
    url: (query) => `https://sheets.new`,
  },
  {
    name: "New Google Slides",
    url: (query) => `https://slides.new`,
  },
  {
    name: "New Prezi",
    url: (query) => `https://prezi.new`,
  },
  {
    name: "New CodePen",
    url: (query) => `https://pen.new`,
  },
  {
    name: "New Kotlin Pad",
    url: (query) => `https://kotlin.new`,
  },
  {
    name: "New Python Pad",
    url: (query) => `https://python.new`,
  },
  {
    name: "New Code Snippet",
    url: (query) => `https://snippet.new`,
  },
  {
    name: "New Deepnote Notebook",
    url: (query) => `https://deepnote.new`,
  },
  {
    name: "New Google App Script",
    url: (query) => `https://script.new`,
  },
  {
    name: "New HTTP Request",
    url: (query) => `https://req.new`,
  },
  {
    name: "New MatLab Playground",
    url: (query) => `https://matlab.new`,
  },
  {
    name: "New Runkit Playground",
    url: (query) => `https://playground.new`,
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
      }
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
