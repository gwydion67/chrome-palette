import { useEffect, useRef, useState } from "react";
import useCommandSuggestions, { Command } from "./hooks/commandsSuggestions";
//@ts-expect-error
import CommandPalette from "react-command-palette";
import "react-command-palette/dist/themes/chrome.css";
import "react-command-palette/dist/themes/atom.css";
import "react-command-palette/dist/themes/sublime.css";
import "./App.css";
import Header from "./Header";
import SampleAtomCommand from "./SampleAtomCommand";
import { useTemplatedSuggestions } from "./hooks/websitesSuggestions";
import { useAudibleTabSuggestions } from "./hooks/audioSuggestions";
import { useSwitchTabSuggestions } from "./hooks/tabsSuggestions";
import { useHistorySuggestions } from "./hooks/historySuggestions";
import { useBookmarkSuggestions } from "./hooks/bookmarkSuggestions";
import { useBookmarkThisSuggestions } from "./hooks/bookmarkThisSuggestions";

import { sortByUsed, storeLastUsed } from "./last-used";
import usePaletteInput from "./hooks/usePaletteInput";
import { parseInputCommand } from "./hooks/parseInputCommand";
import { useCreateSuggestions } from "./hooks/createNewSuggestions";

function App() {
  const [, forceRender] = useState({});
  const commandPalette = useRef<any>(null);

  const input = usePaletteInput(commandPalette);
  let commands = sortByUsed([
    ...useCommandSuggestions(input),
    ...useAudibleTabSuggestions(input),
    ...useSwitchTabSuggestions("t", input),
    ...useHistorySuggestions("h", input),
    ...useBookmarkSuggestions("b", input),
    ...useBookmarkThisSuggestions("bt", input),
    ...useCreateSuggestions("new", input),
    ...useTemplatedSuggestions(input),
  ]);

  const lastCommands = useRef<Command[]>([]);
  const areEqual =
    commands.length === lastCommands.current.length &&
    commands.every((cmd, i) => cmd === lastCommands.current[i]);
  if (areEqual) {
    commands = lastCommands.current;
  } else {
    lastCommands.current = commands;
    console.log("Commands will rerender and create double search");
  }

  return (
    <CommandPalette
      ref={commandPalette}
      commands={commands}
      display="inline"
      filterSearchQuery={(inputValue: string) => {
        const { didMatch, query } = parseInputCommand(inputValue);
        if (didMatch) return query;
        return inputValue;
      }}
      onChange={() => {
        // force rerender in case commands are input dependant
        forceRender({});
      }}
      getSuggestionValue={() => {
        // hack to avoid that highlighting changes the value of the input
        return commandPalette.current.commandPaletteInput.input.value;
      }}
      options={{
        threshold: -1000000, //-Infinity, // Don't return matches worse than this (higher is faster)
        limit: 8, // Don't return more results than this (lower is faster)
        allowTypo: true, //true, // Allwos a snigle transpoes (false is faster)
        key: "name", // For when targets are objects (see its example usage)
        keys: ["name"], // For when targets are objects (see its example usage)
        scoreFn: null, // For use with `keys` (see its example usage)
      }}
      maxDisplayed={8}
      onRequestClose={() => {
        window.close();
      }}
      onSelect={(command: Command) => {
        storeLastUsed(command);
      }}
      onHighlight={(command?: Command) => {
        command?.onHighlighted?.();
      }}
      placeholder="Search commands"
      renderCommand={SampleAtomCommand}
      showSpinnerOnSelect={false}
      showAllCommandsWhenNoneMatches={false}
    />
  );
}

export default App;
