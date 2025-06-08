import {
  Search,
  BarChart3,
  Rss,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  Bot,
  Sparkles,
  Smile,
  Frown,
  Meh,
} from "lucide-react";

export default function Icon({ name, ...props }) {
  switch (name) {
    case "Search":
      return <Search {...props} />;
    case "BarChart3":
      return <BarChart3 {...props} />;
    case "Rss":
      return <Rss {...props} />;
    case "Settings":
      return <Settings {...props} />;
    case "ChevronLeft":
      return <ChevronLeft {...props} />;
    case "ChevronRight":
      return <ChevronRight {...props} />;
    case "MessageSquare":
      return <MessageSquare {...props} />;
    case "FileText":
      return <FileText {...props} />;
    case "Bot":
      return <Bot {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Smile":
      return <Smile {...props} />;
    case "Frown":
      return <Frown {...props} />;
    case "Meh":
      return <Meh {...props} />;
    default:
      return null;
  }
}

Icon.displayName = "Icon";
