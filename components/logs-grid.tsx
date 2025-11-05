import { HabitLogProps, HabitProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isToday,
  startOfWeek,
  subYears,
} from "date-fns";
import { getColor } from "./get-color";
import { useRouterStuff } from "./hooks/use-router-stuff";

function MonthView({
  startDate,
  color,
  theme,
  logs,
}: {
  startDate: Date;
  color: HabitProps["color"];
  theme: "light" | "dark";
  logs: HabitLogProps[];
}) {
  let days: Date[] = [];

  // Full View
  const dates = eachDayOfInterval({
    start: subYears(startDate, 1),
    end: startDate,
  });

  days = Array.from({ length: dates.length }, (_, i) => {
    const date = dates[i];
    return date;
  });

  // // if the current day is after the last day, add the needed days to the days array
  if (isAfter(new Date(), days[days.length - 1])) {
    const daysToAdd = differenceInDays(new Date(), days[days.length - 1]);

    days.push(
      ...Array.from({ length: daysToAdd }, (_, i) =>
        addDays(days[days.length - 1], i + 1),
      ),
    );
  }
  // Group days by rows (weeks)
  const weeks: Date[][] = [];
  let week: Date[] = Array(7).fill(null);

  days.forEach((date, idx) => {
    const dayOfWeek = date.getDay();
    week[dayOfWeek] = date;

    // If Sunday or last day, push the week and start a new one
    if (dayOfWeek === 6 || idx === days.length - 1) {
      weeks.push(week);
      week = Array(7).fill(null);
    }
  });

  console.log(weeks);

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(startDate),
    end: endOfWeek(startDate),
  }).map((day) => ({
    index: day.getDay(),
    short: format(day, "EEE"),
    long: format(day, "EEEE"),
  }));

  return daysOfWeek.map((weekday, rowIdx) => (
    <tr key={`${weekday.short}-${rowIdx}`}>
      {weeks.map((week, colIdx) => {
        const date = week[rowIdx];

        return (
          <td key={colIdx}>
            {date && (
              <DateCell
                date={date}
                color={color}
                theme={theme}
                logs={logs || []}
              />
            )}
          </td>
        );
      })}
    </tr>
  ));
}

function FullView({
  startDate,
  color,
  theme,
  logs,
}: {
  startDate: Date;
  color: HabitProps["color"];
  theme: "light" | "dark";
  logs: HabitLogProps[];
}) {
  let days: Date[] = [];

  // Full View
  const dates = eachDayOfInterval({
    start: subYears(startDate, 1),
    end: startDate,
  });

  days = Array.from({ length: dates.length }, (_, i) => {
    const date = dates[i];
    return date;
  });

  // // if the current day is after the last day, add the needed days to the days array
  if (isAfter(new Date(), days[days.length - 1])) {
    const daysToAdd = differenceInDays(new Date(), days[days.length - 1]);

    days.push(
      ...Array.from({ length: daysToAdd }, (_, i) =>
        addDays(days[days.length - 1], i + 1),
      ),
    );
  }
  // Group days by columns (weeks)
  const weeks: Date[][] = [];
  let week: Date[] = Array(7).fill(null);

  days.forEach((date, idx) => {
    const dayOfWeek = date.getDay();
    week[dayOfWeek] = date;

    // If Sunday or last day, push the week and start a new one
    if (dayOfWeek === 6 || idx === days.length - 1) {
      weeks.push(week);
      week = Array(7).fill(null);
    }
  });

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(startDate),
    end: endOfWeek(startDate),
  }).map((day) => ({
    index: day.getDay(),
    short: format(day, "EEE"),
    long: format(day, "EEEE"),
  }));

  return daysOfWeek.map((weekday, rowIdx) => (
    <tr key={`${weekday.short}-${rowIdx}`}>
      {weeks.map((week, colIdx) => {
        const date = week[rowIdx];

        return (
          <td key={colIdx}>
            {date && (
              <DateCell
                date={date}
                color={color}
                theme={theme}
                logs={logs || []}
              />
            )}
          </td>
        );
      })}
    </tr>
  ));
}

export default function LogsGrid({
  startDate,
  color,
  theme,
  logs,
}: {
  startDate: Date;
  color: HabitProps["color"];
  theme: "light" | "dark";
  logs: HabitLogProps[];
}) {
  const { searchParamsObj } = useRouterStuff();

  const monthView = searchParamsObj.view === "month";

  return (
    <div dir="rtl" className="scrollbar-hidden overflow-x-auto">
      <table
        dir="ltr"
        className="relative w-full border-separate border-spacing-0.5"
      >
        <tbody>
          {monthView ? (
            <MonthView
              color={color}
              logs={logs}
              startDate={startDate}
              theme={theme}
            />
          ) : (
            <FullView
              color={color}
              logs={logs}
              startDate={startDate}
              theme={theme}
            />
          )}
        </tbody>
      </table>
    </div>
  );
}

function DateCell({
  date,
  color,
  theme,
  logs,
}: {
  date: Date;
  color: HabitProps["color"];
  theme: "light" | "dark";
  logs: HabitLogProps[];
}) {
  const isChecked = logs.some((log) => isSameDay(log.date, date));

  return (
    <div
      title={format(date, "MMM d, yyyy")}
      data-date={format(date, "yyyy-MM-dd")}
      className={cn(
        "size-2.5 rounded-[3px]",
        isToday(date) && "border-foreground border-1",
      )}
      style={{
        backgroundColor: isChecked
          ? getColor[color][theme].log.done
          : getColor[color][theme].log.pending,
      }}
    />
  );
}
