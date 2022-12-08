import "./SampleAtomCommand.css";

type Props = {
  name: string;
  highlight: string[] | string;
  shortcut?: string;
  keyword?: string;
  category: string;
  timeAgo?: string;
  icon?: string;
};
export default function SampleAtomCommand({
  name,
  highlight,
  shortcut,
  keyword,
  timeAgo,
  category,
  icon,
}: Props) {
  console.log("NAME", name)
  console.log("HIGHLIGHT", highlight)
  console.log("KEYWORD", keyword)
  console.log("CATEGORY", category)
  let __html = (highlight && highlight[0] ? highlight[0] : name);
  __html = __html.toString().replace(/\n/g, "<br />");
  return (
    <div className="atom-item">
      {icon && <img className={"atom-icon"} src={icon} alt=""></img>}
      <span className={`atom-category ${category}`}>{category}</span>
      {
        <span
          dangerouslySetInnerHTML={{
            __html,
          }}
        />
      }
      <span className="atom-shortcut">
        {shortcut === "unset" ? "" : shortcut}
      </span>
      <span className="atom-keyword">{keyword}</span>
      <span className="atom-timeAgo">{timeAgo}</span>
    </div>
  );
}
