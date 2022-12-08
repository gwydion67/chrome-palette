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
