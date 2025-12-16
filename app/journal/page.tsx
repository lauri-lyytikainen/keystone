"use client";

import { useState } from "react";
import MonthSelector from "@/components/journal/month-selector";
import JournalEntryList from "@/components/journal/journal-entry-list";

export default function JournalPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  function handlePreviousMonth() {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setMonth(selectedMonth.getMonth() - 1);
    setSelectedMonth(previousMonth);
  }

  function handleNextMonth() {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(selectedMonth.getMonth() + 1);
    setSelectedMonth(nextMonth);
  }

  return (
    <>
      <MonthSelector
        currentMonth={selectedMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        setMonth={(date: Date | undefined) => {
          if (date) setSelectedMonth(date);
        }}
      />
      <JournalEntryList currentMonth={selectedMonth} />
    </>
  );
}
