import Badge from "../components/Badge/index";
import Button from "../components/Button/index";

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
        <Badge>
          Powered by{" "}
          <strong className="font-semibold text-primary">Groq</strong>
        </Badge>
      </div>
    </div>
  );
}
