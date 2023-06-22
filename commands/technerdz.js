import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName( "technerdz" )
  .setDescription( "Gir deg en tilfeldig plukket link til noe kult/interessant 🤓" );

const execute = async interaction => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets        = google.sheets({ version: "v4", auth });
  const range         = "Technerdz!A:A";
  const spreadsheetId = process.env.SHEET_ID;

  const content = ( await sheets.spreadsheets.values.get({
    spreadsheetId ,
    range         ,
  }))
  .data.values
  console.log(content)
  await interaction.reply({
    content: "Success"         ,
    ephemeral : true ,
  });
};

export { data, execute };
