import React, { useState, useEffect } from "react";
import { fetchAvailableSlots, type AvailableSlot } from "@/lib/api";

export type Slot = AvailableSlot;

export interface SlotPickerProps {
  selectedDate?: string;
  selectedSlotId?: string;
  onSelectSlot?: (date: string, slot: Slot) => void;
  className?: string;
}

const DEFAULT_SLOTS: Slot[] = [
  { id: "slot-1", time: "08:00 AM - 10:00 AM", period: "Morning", available: true },
  { id: "slot-2", time: "10:00 AM - 12:00 PM", period: "Morning", available: true },
  { id: "slot-3", time: "01:00 PM - 03:00 PM", period: "Afternoon", available: true },
  { id: "slot-4", time: "03:00 PM - 05:00 PM", period: "Afternoon", available: false },
  { id: "slot-5", time: "05:00 PM - 07:00 PM", period: "Evening", available: true },
];

export const SlotPicker: React.FC<SlotPickerProps> = ({
  selectedDate: initialDate,
  selectedSlotId: initialSlotId,
  onSelectSlot,
  className = "",
}) => {
  // Generate next 5 days
  const today = new Date();
  const dates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
      formatted: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const [activeDate, setActiveDate] = useState(initialDate || dates[0].iso);
  const [activeSlotId, setActiveSlotId] = useState<string | undefined>(initialSlotId || "slot-1");
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS);

  useEffect(() => {
    let mounted = true;
    fetchAvailableSlots(activeDate).then((liveSlots) => {
      if (mounted && liveSlots.length > 0) {
        setSlots(liveSlots);
      }
    });
    return () => {
      mounted = false;
    };
  }, [activeDate]);

  const handleSlotClick = (slot: Slot) => {
    if (!slot.available) return;
    setActiveSlotId(slot.id);
    onSelectSlot?.(activeDate, slot);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Date Carousel/Tabs */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Appointment Date
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {dates.map((d) => (
            <button
              key={d.iso}
              type="button"
              onClick={() => setActiveDate(d.iso)}
              className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                activeDate === d.iso
                  ? "bg-[#203060] border-[#203060] text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <span className="block text-xs font-bold">{d.dayName}</span>
              <span className={`block text-[11px] ${activeDate === d.iso ? "text-[#a8d6eb]" : "text-slate-400"}`}>
                {d.formatted}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Hour Arrival Slots */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Guaranteed 2-Hour Arrival Window
        </label>
        <div className="space-y-2">
          {slots.map((slot) => {
            const isSelected = activeSlotId === slot.id;
            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-colors ${
                  !slot.available
                    ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 opacity-40 cursor-not-allowed text-slate-400"
                    : isSelected
                    ? "border-[#203060] dark:border-[#60a0d0] bg-[#e6f0f9]/50 dark:bg-[#0050a0]/20 text-[#203060] dark:text-white font-semibold cursor-pointer shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#0050a0]" />
                  <span>{slot.time}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({slot.period})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      slot.available ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {slot.available ? (isSelected ? "Selected ✓" : "Available") : "Filled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <span>⏱️</span>
        <span>Guaranteed 2-hour arrival or you automatically receive a $50 on-time service credit.</span>
      </p>
    </div>
  );
};

export default SlotPicker;
