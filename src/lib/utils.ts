import { FieldValues, UseFormSetError, Path } from "react-hook-form";
import { ZodIssue } from "zod";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: { error: string | ZodIssue[] },
  setError: UseFormSetError<TFieldValues>
) {
  // Handle server errors by Zod
  if (Array.isArray(errorResponse.error)) {
    errorResponse.error.forEach((e) => {
      const fieldName = e.path.join(".") as Path<TFieldValues>;
      setError(fieldName, { message: e.message });
    });
  } else {
    setError("root.serverError", { message: errorResponse.error });
  }
}

export const calculateAge = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};


// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const getUserTimezone = () => dayjs.tz.guess();

export function formatShortTime(date: Date) {
  return dayjs.utc(date).tz(getUserTimezone()).format("H:mm");
}

export function formatShortDate(date: Date | string) {
  return dayjs.utc(date).tz(getUserTimezone()).format("D MMMM, YYYY");
}

export function formatShortDateTime(date: Date | string) {
  return dayjs
    .utc(date)
    .tz(getUserTimezone())
    .format("dddd, D MMMM, YYYY H:mm");
}

export function timeAgoDate(date: string) {
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);
  dayjs.extend(relativeTime);

  const localDate = dayjs.utc(date).tz(getUserTimezone());

  if (localDate.isToday()) {
    return "Today";
  }
  if (localDate.isYesterday()) {
    return "Yesterday";
  }

  return localDate.fromNow();
}

export function timeAgoDateTime(date: string) {
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);
  dayjs.extend(relativeTime);
  
  const localDate = dayjs.utc(date).tz(getUserTimezone());

  // if date is less than an hour ago, use the display the time difference in words
  if (dayjs().diff(localDate, 'hour') < 1) {
    return localDate.fromNow();
  }

  if (localDate.isToday()) {
    return `Today, ${localDate.format("H:mm")}`;
  }
  if (localDate.isYesterday()) {
    return `Yesterday, ${localDate.format("H:mm")}`;
  }

  return formatShortDate(date);
}
