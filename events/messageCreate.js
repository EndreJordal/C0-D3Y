import { Events } from "discord.js";
import dotenv     from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { googleSheet } from "../utils/googleSheet.js";

dotenv.config();

const name    = Events.MessageCreate;
const execute = async message => {
  if ( message?.author?.bot ) return;
  // Logging commands to Google Sheets
  const values = [[
    new Date().toLocaleString("nb-NO"),
    message.author.username.toLowerCase(),
    message.content
  ]];
  const resource = { values };

  await googleSheet({
    write: true,
    sheetName: "Chat-Logg",
    range: "A2:C2",
    resource,
    valueInputOption: "USER_ENTERED"
  })
  // OpenAI API configuration
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration);

  // Fetch bot primer from Google Sheet
  const botPrimer = (await googleSheet({
    write: false,
    sheetName: "ChatGPT-Primer",
    range: "A1",
  }))[0][0]
  
  // Primer for conversation
  const conversationLog = [{ role: "system", content: botPrimer }]
  await message.channel.sendTyping();

  // Add current and previous messages to conversation log
  const prevMessages = await message.channel.messages.fetch({ limit: 15 })
  prevMessages.reverse().forEach(msg => {
    conversationLog.push({ role: "user", content: msg.content })
  })

  // Generate response
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  })

  // Reply to user
  await message.reply(result.data.choices[0].message.content)
};

export { name, execute };
