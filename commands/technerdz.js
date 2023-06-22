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

  const randomLink = content[0][Math.floor(Math.random() * content[0].length)]
  await interaction.reply({
    content: randomLink         ,
    ephemeral : true ,
  });
};

export { data, execute };
