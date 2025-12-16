import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface JournalEntryProps {
  date: Date;
  entryText: string;
  onTextChange: (date: Date, text: string) => void;
  onTextBlur: (date: Date) => void;
}

export default function JournalEntry({
  date,
  entryText,
  onTextChange,
  onTextBlur,
}: JournalEntryProps) {
  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  const entryContent = (
    <div className="flex gap-2">
      <div className="flex w-16 items-center justify-between">
        <p>{date.toLocaleDateString(undefined, { weekday: "short" })}</p>
        <p>{date.getDate()} </p>
      </div>
      <Input
        value={entryText}
        onChange={(e) => onTextChange(date, e.target.value)}
        onBlur={() => onTextBlur(date)}
      />
    </div>
  );

  if (isToday(date)) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Today&#39;s Journal Entry
            <span className="text-sm font-normal text-muted-foreground">
              -{" "}
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex w-16 items-center justify-between shrink-0">
              <p>
                {date.toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
              <p>{date.getDate()}</p>
            </div>
            <Input
              value={entryText}
              onChange={(e) => onTextChange(date, e.target.value)}
              onBlur={() => onTextBlur(date)}
              placeholder="What happened today? Share your thoughts, experiences, or reflections..."
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return entryContent;
}
