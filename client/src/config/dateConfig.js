import moment from "moment";

export const getDate = (dateStr) => {
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%dh",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  const date = new Date(dateStr);
  let currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();

  if (timeDiff <= 89 * 60 * 1000) {
    //Today, 2 hours ago (pot modifica 89 la 120)
    return moment(date).format("HH:mm");
  } else if (timeDiff <= 12 * 60 * 60 * 1000) {
    return moment(date, "YYYYMMDDHHmmss").fromNow();
  } else if (timeDiff <= 22 * 60 * 60 * 1000) {
    //Today, more than 12 hours; 23 hours is considered "a day ago" already - see moment.js documentation
    return moment(date, "YYYYMMDDHHmm").fromNow();
  } else if (timeDiff <= 48 * 60 * 60 * 1000) {
    // Yesterday
    return "Yesterday";
  } else if (timeDiff <= 168 * 60 * 60 * 1000) {
    // Less than week
    return moment(date).format("ddd");
  } else {
    return moment(date).format("DD/MM/YYYY");
  }
};
