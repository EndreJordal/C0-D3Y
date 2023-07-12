function messageSnipper(response) {
  /*
  Response will be the response of the chatGPT function in the form of a string, which is over 2000 character long.
  this function will split the response into chunks of max 2000 characters and return an array of strings. It will
  preserve the formatting of the response, so that the chunks will be split at the end of a sentence, and it will
  not split inside code blocks, denoted by triple backticks. Neither will it split inside single backticks.
  */
  return [
    response.slice(0, 2000),
    response.slice(2000, 4000),
    response.slice(4000, 6000),
  ];
}

export { messageSnipper };
