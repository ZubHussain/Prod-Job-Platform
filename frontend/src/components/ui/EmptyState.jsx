import { SearchX } from "lucide-react";
export default function EmptyState({title="Nothing here yet", text="Try another search or come back later."}){
  return <div className="empty"><SearchX size={34}/><h3>{title}</h3><p>{text}</p></div>;
}
