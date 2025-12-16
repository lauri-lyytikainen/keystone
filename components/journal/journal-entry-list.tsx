import JournalEntry from "./journal-entry";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState, useEffect, useCallback, useMemo } from "react";

interface JournalEntryListProps {
  currentMonth: Date;
}

export default function JournalEntryList(props: JournalEntryListProps) {
  const [entryTexts, setEntryTexts] = useState<Record<string, string>>({});
  const [debouncedEntryTexts, setDebouncedEntryTexts] = useState<
    Record<string, string>
  >({});

  // Get all entries for the current month to populate existing text
  const rawEntries = useQuery(api.entry.getEntries, {
    month: props.currentMonth.getMonth() + 1, // getMonth() is 0-based, but we want 1-based
    year: props.currentMonth.getFullYear(),
  });

  const allEntries = useMemo(() => rawEntries ?? [], [rawEntries]);
  const addEntry = useMutation(api.entry.addEntry);

  // Debounce the entry texts with a 500ms delay
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {};

    Object.entries(entryTexts).forEach(([dateStr, text]) => {
      if (debouncedEntryTexts[dateStr] !== text) {
        if (timeouts[dateStr]) {
          clearTimeout(timeouts[dateStr]);
        }
        timeouts[dateStr] = setTimeout(() => {
          setDebouncedEntryTexts((prev) => ({ ...prev, [dateStr]: text }));
        }, 500);
      }
    });

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout));
    };
  }, [entryTexts, debouncedEntryTexts]);

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const dates = [];
    for (let i = 1; i <= days; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  }

  function getDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  function getEntryText(date: Date): string {
    const dateStr = getDateString(date);
    // Check local state first, then existing entries
    if (entryTexts[dateStr] !== undefined) {
      return entryTexts[dateStr];
    }
    const existingEntry = allEntries.find((entry) => entry.date === dateStr);
    return existingEntry?.text ?? "";
  }

  // Debounced save function
  const debouncedSave = useCallback(
    (dateStr: string, text: string) => {
      const existingEntry = allEntries.find((entry) => entry.date === dateStr);
      if (text.trim() || existingEntry) {
        addEntry({ date: dateStr, text });
      }
    },
    [allEntries, addEntry],
  );

  // Auto-save when debounced text changes
  useEffect(() => {
    Object.entries(debouncedEntryTexts).forEach(([dateStr, text]) => {
      const originalText =
        allEntries.find((entry) => entry.date === dateStr)?.text ?? "";
      if (text !== originalText) {
        debouncedSave(dateStr, text);
      }
    });
  }, [debouncedEntryTexts, allEntries, debouncedSave]);

  function handleTextChange(date: Date, text: string) {
    const dateStr = getDateString(date);
    setEntryTexts((prev) => ({ ...prev, [dateStr]: text }));
  }

  function handleTextBlur(date: Date) {
    const dateStr = getDateString(date);
    const text = getEntryText(date);

    // Force immediate save on blur if there are changes
    const existingEntry = allEntries.find((entry) => entry.date === dateStr);
    const originalText = existingEntry?.text ?? "";
    if (text !== originalText && (text.trim() || existingEntry)) {
      // Update the debounced state immediately to prevent conflicts
      setDebouncedEntryTexts((prev) => ({ ...prev, [dateStr]: text }));
      addEntry({ date: dateStr, text });
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        {getDaysInMonth(props.currentMonth).map((date, i) => (
          <div key={i}>
            <JournalEntry
              date={date}
              entryText={getEntryText(date)}
              onTextChange={handleTextChange}
              onTextBlur={handleTextBlur}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
