import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName( "hjelp" )
  .setDescription( "Gir en hjelpsom melding." );

const execute = async interaction => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets        = google.sheets({ version: "v4", auth });
  const range         = "Hjelp!A1";
  const spreadsheetId = process.env.SHEET_ID;

  const content = ( await sheets.spreadsheets.values.get({
    spreadsheetId ,
    range         ,
  }))
  .data.values[0][0]

  await interaction.reply({
    content          ,
    ephemeral : true ,
  });
};

export { data, execute };
