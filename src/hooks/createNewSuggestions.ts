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
};
const templates: Template[] = [
  {
    name: "Calendar Event",
    url: (query) => `https://drive.google.com/drive/search?q=${query}`,
  },
];

export function useCreateSuggestions(
  KEYWORD: string,
  { setInputValue, inputValue }: UseSuggestionParam,
) {
  const shortcut = useShortcut(KEYWORD, { setInputValue });
  const { didMatch, keyword } = parseInputCommand(inputValue);
  const myMatch = keyword === KEYWORD;

  const keywordSuggestion = useMemo(
    () => [
      {
        name: "Create New",
        category: "Command",
        command: async function () {
          setInputValue(KEYWORD + " ");
        },
        keyword: KEYWORD,
      },
    ],
    [],
  );

  if (myMatch) return [];
  if (didMatch) return [];
  return keywordSuggestion;
}
