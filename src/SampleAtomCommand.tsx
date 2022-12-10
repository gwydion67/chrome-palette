import "./SampleAtomCommand.css";

type Props = {
  name: string;
  highlight: string;
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
  const __html = (highlight ? highlight : name).replace(/\n/g, "<br />");
  return (
    <div className="atom-item">
      <div>
        {icon && <img className={"atom-icon"} src={icon} alt=""></img>}
        <span className={`atom-category ${category}`}>{category}</span>
        {
          <span
            dangerouslySetInnerHTML={{
              __html,
            }}
          />
        }
      </div>
      <div>
        {shortcut && shortcut !== "unset" && (
          <span className="atom-shortcut">{shortcut}</span>
        )}
        {keyword && <span className="atom-keyword">{keyword}</span>}
        {timeAgo && <span className="atom-timeAgo">{timeAgo}</span>}
      </div>
    </div>
  );
}
