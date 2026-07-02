import HeatmapGrid from "./HeatmapGrid";
import { CATEGORIES } from "@/lib/categories";

interface ActivityData {
  [category: string]: Record<string, number>;
}

interface HeatmapTrackerProps {
  data: ActivityData;
}

export default function HeatmapTracker({ data }: HeatmapTrackerProps) {
  return (
    <div>
      {CATEGORIES.map((cat) => (
        <HeatmapGrid
          key={cat.key}
          label={cat.label}
          colorVar={cat.colorVar}
          data={data[cat.key] || {}}
        />
      ))}
    </div>
  );
}
