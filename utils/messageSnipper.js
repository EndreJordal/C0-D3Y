function messageSnipper(message) {
  const firstHalf = message.slice(0, message.length / 2);
  const blockCheck = "```";
  // Create a regular expression with the sequence
  const regex = new RegExp(blockCheck, "g");

  // Use match() with the regex to get an array of matches
  const matches = message.match(regex);

  // Count the number of matches
  const count = matches ? matches.length : 0;

  if (count % 2 === 0) {
    return [
      message.slice(0, firstHalf.lastIndexOf("\n")),
      message.slice(firstHalf.lastIndexOf("\n")),
    ];
  }
  return [
    message.slice(0, firstHalf.lastIndexOf(blockCheck)),
    message.slice(firstHalf.lastIndexOf(blockCheck)),
  ];
}

export { messageSnipper };
