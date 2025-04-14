import { FieldValues, UseFormSetError, Path } from "react-hook-form";
import { ZodIssue } from "zod";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";



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


export function formatShortTime(date: Date) {
  return dayjs(date).format("H:mm");
}

export function formatShortDate(date: Date) {
  return dayjs(date).format("D MMMM, YYYY");
}

export function formatShortDateTime(dateString: string) {
  return dayjs(dateString).format("dddd, D MMMM, H:mm");
}

export function timeAgoDate(date: string) {
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);
  dayjs.extend(relativeTime);

  if (dayjs(date).isToday()) {
    return "Today";
  }
  if (dayjs(date).isYesterday()) {
    return "Yesterday";
  }

  return dayjs(date).fromNow();
}

export function timeAgoDateTime(date: string) {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
}
