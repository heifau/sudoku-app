/// <reference lib="webworker" />


// input:  z.B. '000970000040250107007600403012800600970040035004002910201007500409081060000029000'
addEventListener('message', ({ data }) => {
  const response = data;
  postMessage(response);
});
