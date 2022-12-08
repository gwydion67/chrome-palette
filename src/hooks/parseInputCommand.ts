export const parseInputCommand = (inputValue: string) => {
  const [match, keyword, query] =
    inputValue.match(/^([a-zA-Z]{1,3})\s(.*)/) || [];
  return {
    didMatch: match !== undefined,
    keyword: keyword?.toLowerCase() || "",
    query: query || "",
  };
};
