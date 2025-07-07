import { startOfDay, subDays } from "date-fns";

function getStartDateAndEndDate(): { startDate: Date; endDate: Date } {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;

  return { startDate, endDate };
}

export default getStartDateAndEndDate;

export const getDateRange = (days: number) => {
  const today = new Date();
  const startDate = subDays(startOfDay(today), days - 1);
  return { startDate, endDate: today };
};
