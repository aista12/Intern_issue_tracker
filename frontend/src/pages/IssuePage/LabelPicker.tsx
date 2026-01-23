import { Trash2 } from "lucide-react";

type LabelType = { id: string; name: string; color: string };

export function LabelPicker(props: {
  labels: LabelType[];
  selectedLabelIds: string[];
  setSelectedLabelIds: React.Dispatch<React.SetStateAction<string[]>>;
  askDeleteLabel: (l: { id: string; name: string }) => void;
}) {
  const { labels, selectedLabelIds, setSelectedLabelIds, askDeleteLabel } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l) => {
        const active = selectedLabelIds.includes(l.id);

        return (
          <div
            key={l.id}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${
              active ? "bg-muted" : ""
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedLabelIds((prev) =>
                  active ? prev.filter((x) => x !== l.id) : [...prev, l.id]
                )
              }
              className="flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.name}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                askDeleteLabel(l);
              }}
              className="ml-1 opacity-70 hover:opacity-100"
              aria-label={`Delete label ${l.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
