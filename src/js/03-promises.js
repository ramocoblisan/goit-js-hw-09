import * as Notiflix from 'notiflix';

 function createPromise(position, delay) {
   const shouldResolve = Math.random() > 0.3;

   // Return a promise
   return new Promise((resolve, reject) => {
     setTimeout(() => {
       if (shouldResolve) {
         resolve({ position, delay });
       } else {
         reject({ position, delay });
       }
     }, delay);
   });
 }

 // Handle form submission
 document.querySelector('.form').addEventListener('submit', function (event) {
   event.preventDefault();

   // Get form values
   const firstDelay = parseInt(this.elements.delay.value, 10);
   const delayStep = parseInt(this.elements.step.value, 10);
   const amount = parseInt(this.elements.amount.value, 10);

   // Create promises
   for (let i = 1; i <= amount; i++) {
     const delay = firstDelay + (i - 1) * delayStep;

     // Use Notiflix to show notifications
     createPromise(i, delay)
       .then(({ position, delay }) => {
         Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
       })
       .catch(({ position, delay }) => {
         Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
       });
   }
 });