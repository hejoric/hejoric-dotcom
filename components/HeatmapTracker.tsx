import HeatmapGrid from "./HeatmapGrid";

interface ActivityData {
  [category: string]: Record<string, number>;
}

const categories = [
  { key: "code", label: "Code", emoji: "💻" },
  { key: "music", label: "Music", emoji: "🎹" },
  { key: "language", label: "Languages (JP/KR)", emoji: "🌏" },
  { key: "fitness", label: "Fitness", emoji: "🏋️" },
  { key: "content", label: "Content", emoji: "🎥" },
];

interface HeatmapTrackerProps {
  data: ActivityData;
}

export default function HeatmapTracker({ data }: HeatmapTrackerProps) {
  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <HeatmapGrid
          key={cat.key}
          category={cat.key}
          label={cat.label}
          emoji={cat.emoji}
          data={data[cat.key] || {}}
        />
      ))}
    </div>
  );
}
