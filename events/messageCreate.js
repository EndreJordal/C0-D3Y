import { Events } from "discord.js";
import { google } from "googleapis";
import dotenv     from "dotenv";

dotenv.config();

Array.prototype.random = function () {
  return this[ Math.floor( Math.random() * this.length ) ];
}

const name    = Events.MessageCreate;
const execute = async message => {
  if ( message?.author?.bot ) return;

  const username = message?.author?.username;
  const reply    = message?.content;

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "Deltakerlogger!A2:C2";

  const values = [[
    new Date().toUTCString() ,
    username                 ,
    reply                    ,
  ]];

  const spreadsheetId = process.env.SHEET_ID;
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  await sheets.spreadsheets.values.append({
    range,
    resource,
    spreadsheetId,
    valueInputOption,
  });

  await message.reply( "Takk for svar :)" );
};

export { name, execute };
