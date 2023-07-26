import { Events } from "discord.js";
import dotenv from "dotenv";
import { chatGPT } from "../utils/chatGPT.js";

dotenv.config();

const name = Events.MessageCreate;
const execute = async (message) => {
  if (message.author.bot) return;

  //If message is a DM to the bot, ChatGPT will respond.
  if (!message.guild) {
    const response = await chatGPT(message);
    if (response.length > 2000) {
      await message.reply(
        "Svar fra ChatGPT for langt for Discord 🤔 Vi jobber med en fiks, denne er snart på plass!"
      );
    } else {
      await message.reply(response);
    }
  }
};

export { name, execute };
