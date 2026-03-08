import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => (
  <div className="flex flex-1 animate-fade-in flex-col items-center justify-center gap-4 p-8">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
      <Icon className="h-8 w-8 text-primary" />
    </div>
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="max-w-md text-center text-muted-foreground">{description}</p>
  </div>
);

export default PlaceholderPage;
