import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { googleSheet } from "./googleSheet.js";
//import { messageSnipper } from "./messageSnipper.js";

dotenv.config();

async function chatGPT(message) {
  const slashCheck = [
    "/hjelp",
    "/timeplan",
    "/regler",
    "/ferie",
    "/ressurser",
    "/kodehode",
    "/technerdz",
    "/varsle",
    "/quiz-me",
    "/forslagskassen",
  ];
  for (let cmd of slashCheck) {
    if (message.content.toLowerCase().startsWith(cmd)) {
      await message.reply(
        "Du må bruke disse kommandoene i en kanal på kodehode serveren, samme hvilken kanal. Både kommandoen og svaret er kun synlig for deg!"
      );
      return;
    }
  }
  // Getting user info
  const client = message.client;
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const member = await guild.members.fetch(message.author.id);
  const userRoles = member.roles.cache.map((role) => role.name);
  const userName = message.author.username;
  const userModule = userRoles.filter((role) => role.startsWith("Modul"));
  const userInfo = `${userName}, ${userModule}`;
  // Logging commands to Google Sheets
  const values = [
    [
      new Date().toLocaleString("nb-NO"),
      message.author.username.toLowerCase(),
      message.content.length,
    ],
  ];
  const resource = { values };

  await googleSheet({
    write: true,
    sheetName: "Chat-Logg",
    range: "A2:C2",
    resource,
    valueInputOption: "USER_ENTERED",
  });
  // OpenAI API configuration
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Fetch bot primer from Google Sheet
  const botPrimer = (
    await googleSheet({
      write: false,
      sheetName: "ChatGPT-Primer",
      range: "A1",
    })
  )[0][0];

  // Primer for conversation
  const conversationLog = [{ role: "system", content: botPrimer + userInfo }];
  await message.channel.sendTyping();

  // Add current and previous messages to conversation log
  const prevMessages = await message.channel.messages.fetch({ limit: 15 });
  prevMessages.reverse().forEach((msg) => {
    conversationLog.push({ role: "user", content: msg.content });
  });

  // Generate response
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  // Return response content
  return result.data.choices[0].message.content;
}

export { chatGPT };
