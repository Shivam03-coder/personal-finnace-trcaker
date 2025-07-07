function getStartDateAndEndDate(): { startDate: Date; endDate: Date } {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;

  return { startDate, endDate };
}

export default getStartDateAndEndDate;
