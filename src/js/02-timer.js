// Descris în documentație
import flatpickr from "flatpickr";
// Import suplimentar de stil
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

// HTML elements
const datePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerContainer = document.querySelector('.timer');
const daysElement = timerContainer.querySelector('[data-days]');
const hoursElement = timerContainer.querySelector('[data-hours]');
const minutesElement = timerContainer.querySelector('[data-minutes]');
const secondsElement = timerContainer.querySelector('[data-seconds]');

// // Initialize flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    handleDateSelection(selectedDates[0]);
  },
};

const flatpickrInstance = flatpickr(datePicker, options);

// // Function to convert milliseconds to days, hours, minutes, and seconds
function convertMs(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

// Function to handle date selection
function handleDateSelection(selectedDate) {
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    Notiflix.Notify.failure('Please choose a date in the future');
    startButton.disabled = true;
    clearInterval(intervalId); 
    displayTimerValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  } else {
    startButton.disabled = false;
  }
}

let intervalId; 

// // Function to start the countdown
function startCountdown(selectedDate) {
  clearInterval(intervalId); 
  startButton.disabled = true; 

  intervalId = setInterval(updateTimer, 1000);

  function updateTimer() {
    const currentTime = new Date();
    const timeDifference = selectedDate.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      displayTimerValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      Notiflix.Notify.success('Countdown completed!');
      startButton.disabled = false; // 
    } else {
      const { days, hours, minutes, seconds } = convertMs(timeDifference);
      displayTimerValues({ days, hours, minutes, seconds });
    }
  }

//   // Initial update to display correct values immediately
  updateTimer();
}

// // Event listener for the "Start" button
startButton.addEventListener('click', () => {
  const selectedDate = flatpickrInstance.selectedDates[0];

  if (intervalId) {
    // If the timer is already running, reset the countdown to the new date
    clearInterval(intervalId);
    startCountdown(selectedDate);
  } else if (selectedDate) {
    startCountdown(selectedDate);
  } else {
    Notiflix.Notify.failure('Please select a valid future date before starting the countdown.');
  }
});

// // Function to display timer values with leading zeros
function displayTimerValues({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// // Function to add leading zero to a number
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

// // Event listener for the "Start" button
startButton.addEventListener('click', () => {
  const selectedDate = flatpickrInstance.selectedDates[0];

  if (selectedDate) {
    startCountdown(selectedDate);
    startButton.disabled = true;
  } else {
    Notiflix.Notify.failure('Please select a valid future date before starting the countdown.');
  }
});
