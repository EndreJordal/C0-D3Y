/* function messageSnipper(message) {
  const firstHalf = message.slice(0, Math.floor(message.length / 2));
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
} */

function messageSnipper(message) {
  const blockCheck = "```";
  const codeBlockRegex = /```[^`]*```/gs;

  const codeBlocks = message.match(codeBlockRegex) || [];
  const codeBlockPositions = codeBlocks.map((block) => {
    const startIndex = message.indexOf(block);
    const endIndex = startIndex + block.length;
    return { startIndex, endIndex };
  });

  let snipIndex = Math.floor(message.length / 2);
  let closestNewlineIndex = -1;

  for (let i = snipIndex; i < message.length; i++) {
    if (message[i] === "\n") {
      closestNewlineIndex = i;
      break;
    }
  }

  if (closestNewlineIndex === -1) {
    for (let i = snipIndex; i >= 0; i--) {
      if (message[i] === "\n") {
        closestNewlineIndex = i;
        break;
      }
    }
  }

  if (closestNewlineIndex !== -1) {
    snipIndex = closestNewlineIndex + 1;
  }

  const snippedMessage = message.slice(0, snipIndex);
  const remainingMessage = message.slice(snipIndex);

  // Check if either snippet exceeds 2000 characters
  if (snippedMessage.length > 2000 || remainingMessage.length > 2000) {
    return ["", ""];
  }

  return [snippedMessage, remainingMessage];
}

export { messageSnipper };
