import { Events } from "discord.js";
import { google } from "googleapis";
import dotenv     from "dotenv";

dotenv.config();

const name    = Events.MessageCreate;
const execute = async message => {
  if ( message?.author?.bot ) return;

  const username = message?.author?.username;
  const query    = message?.content;


  await message.reply( "X" );
};

export { name, execute };
