import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";

interface DaySelectorProps {
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  setMonth?: (date: Date | undefined) => void;
  currentMonth: Date;
}

export default function MonthSelector(props: DaySelectorProps) {
  return (
    <div className="flex justify-between max-w-xl mx-auto p-4">
      <Button onClick={props.onPreviousMonth} variant={"outline"}>
        <ChevronLeft />
      </Button>
      <Popover>
        <Button asChild variant={"ghost"}>
          <PopoverTrigger>
            <h2 className="text-2xl md:text-4xl">
              {props.currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </PopoverTrigger>
        </Button>
        <PopoverContent>
          <Button
            onClick={() => props.setMonth && props.setMonth(new Date())}
            variant={"outline"}
            className="w-full"
          >
            <Sun />
            Current Month
          </Button>
          <Calendar
            // mode="single"
            selected={props.currentMonth}
            onMonthChange={props.setMonth}
            captionLayout="dropdown"
            className="w-full"
          />
        </PopoverContent>
      </Popover>
      <Button onClick={props.onNextMonth} variant={"outline"}>
        <ChevronRight />
      </Button>
    </div>
  );
}
