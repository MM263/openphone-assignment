interface FormattedDateProps {
  dateString: string;
}
export const FormattedDate = ({ dateString }: FormattedDateProps) => {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    console.error("Invalid date string provided:", dateString);
    return <span>Invalid Date</span>;
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  let formattedDate;

  const olderDateFormatter = new Intl.DateTimeFormat(undefined, {
    // 'undefined' uses the browser's default locale
    month: "short", // MMM (e.g., Apr)
    day: "numeric", // d (e.g., 3)
    hour: "2-digit", // HH (e.g., 23)
    minute: "2-digit", // mm (e.g., 56)
    hour12: false, // Use 24-hour format
  });

  const todayFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (inputDate < startOfToday) {
    formattedDate = olderDateFormatter.format(inputDate);
  } else {
    formattedDate = todayFormatter.format(inputDate);
  }

  return <span>{formattedDate}</span>;
};
