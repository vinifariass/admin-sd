import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  name?: string;
};

export function DatePicker({ value, onChange, name }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>(
    value ? format(value, "yyyy-MM-dd") : ""
  );

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "yyyy-MM-dd"));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedDate = new Date(newValue);
    if (!isNaN(parsedDate.getTime())) {
      onChange(parsedDate);
    } else {
      onChange(undefined);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"));
      onChange(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : <span>Selecione uma data</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col space-y-2 p-2">
          <Input
            type="date"
            name={name}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
