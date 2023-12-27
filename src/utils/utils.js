// dependencies
import Swal from "sweetalert2";

// creating toast from sweetalert2
export const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: "success",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// input date to humanReadable Date format
export const inputDateToReadableDate = (date) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

// text trim function 
export const trimText = (text, wordCount = 15) => {
  const textArray = text.split(' ', wordCount);

  return `${textArray.join(' ')} ${textArray.length == wordCount ? '....' : ''}`;
}