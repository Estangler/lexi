import Badge from "../components/Badge/index";
import Button from "../components/Button/index";
import { Sparkles } from "lucide-react";

export default function ComponentsDoc() {
  return (
    <div className="p-10 flex gap-3">
      <div className="flex flex-col gap-2">
        <Button>Primary</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Disabled
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
        <Button variant="ghost" loading>
          Disabled
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Badge Icon={Sparkles} label="Powered by ">
          <strong className="text-primary">Groq</strong>
        </Badge>
        <div className="flex gap-2">
          <Badge label="Resumo" variant="primary" />
          <Badge label="Resumo" variant="primary" />
          <Badge label="01" variant="primary" />
        </div>
      </div>
    </div>
  );
}
