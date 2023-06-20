import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

const data = new SlashCommandBuilder()
  .setName( "sendtosheet" )
  .setDescription( "Adds a new row in the sheet." );

const execute = async interaction => {
  const username = interaction.user.username.toLowerCase();

  dotenv.config();

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "Ark 1!A2:D4";

  const values = [[
    username,
    new Date().toUTCString(),
    Math.floor(Math.random() * 10),
    "lorem ipsum"
  ]];

  const spreadsheetId = process.env.SHEET_ID;
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  const result = await sheets.spreadsheets.values.append({
    range,
    resource,
    spreadsheetId,
    valueInputOption,
  });

  console.log(result.data);

  await interaction.reply( "Updated Sheet :)" );
};

export { data, execute };
