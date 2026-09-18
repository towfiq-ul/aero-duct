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
        <div key={date} className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {formatDate(date)}
            </h3>
            <span className="text-xs text-slate-500 font-medium">2-Hr Arrival Window</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {daySlots.map((slot) => {
              const isSelected = selectedId === slot.id;
              const isUnavailable = !slot.available;

              if (isUnavailable) {
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-slate-200 bg-white/60 opacity-40 cursor-not-allowed select-none text-center"
                    aria-disabled="true"
                  >
                    <span className="text-xs font-semibold text-slate-400">
                      {formatTime(slot.start)} – {formatTime(slot.end)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Booked</span>
                  </div>
                );
              }

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot.id)}
                  className={[
                    "relative flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-2xs",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm font-bold tracking-tight">
                    {formatTime(slot.start)} – {formatTime(slot.end)}
                  </span>
                  <span
                    className={`text-[11px] font-medium mt-0.5 ${
                      isSelected ? "text-blue-100" : "text-emerald-600"
                    }`}
                  >
                    {isSelected ? "Selected Window ✓" : "Available"}
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
