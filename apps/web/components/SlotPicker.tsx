"use client";

import type { Slot } from "@/lib/mockData";

type SlotPickerProps = {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function SlotPicker({ slots, selectedId, onSelect }: SlotPickerProps) {
  // Group by date
  const byDate = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[slot.date]!.push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(byDate).map(([date, daySlots]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{formatDate(date)}</h3>
          <div className="grid grid-cols-3 gap-2">
            {daySlots.map((slot) => {
              const isSelected = selectedId === slot.id;
              const isUnavailable = !slot.available;

              if (isUnavailable) {
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed select-none"
                    aria-disabled="true"
                  >
                    <span className="text-sm text-gray-400 line-through">
                      {formatTime(slot.start)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      – {formatTime(slot.end)}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">Unavailable</span>
                  </div>
                );
              }

              return (
                <button
                  key={slot.id}
                  onClick={() => onSelect(slot.id)}
                  className={[
                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm font-medium">{formatTime(slot.start)}</span>
                  <span className={`text-xs mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    – {formatTime(slot.end)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SlotPicker;
