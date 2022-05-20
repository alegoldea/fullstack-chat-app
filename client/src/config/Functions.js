import moment from "moment";

export const getDate = (dateStr) => {
  const date = new Date(dateStr);
  let currentDate = new Date();
  const timeDiff = currentDate.getTime() - date.getTime();

  if (timeDiff <= 24 * 60 * 60 * 1000) {
    //Today
    return moment(date).format("HH:mm");
  } else if (timeDiff <= 48 * 60 * 60 * 1000) {
    // Yesterday
    return "Yesterday";
  } else if (timeDiff <= 168 * 60 * 60 * 1000) {
    // Less than week
    return moment(date).format("dddd");
  } else {
    return moment(date).format("DD/MM/YYYY");
  }
};
