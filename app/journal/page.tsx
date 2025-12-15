"use client";

import { Authenticated, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function JournalPage() {
  const entries = useQuery(api.entry.getEntries);
  const addEntry = useMutation(api.entry.addEntry);

  return (
    <>
      <h1>Journal</h1>
      <Authenticated>
        <Button onClick={() => addEntry({ text: "New entry" })}>
          Add Entry
        </Button>
        {entries && entries.length > 0 ? (
          <ul>
            {entries.map((entry) => (
              <li key={entry._id.toString()}>{entry.text}</li>
            ))}
          </ul>
        ) : (
          <p>No entries found.</p>
        )}
      </Authenticated>
    </>
  );
}
