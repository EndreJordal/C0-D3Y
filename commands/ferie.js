import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName( "ferie" )
  .setDescription( "Gir deg en oppdatert oversikt over kommende ferie og fridager for Kodehode 🏝️" );

const execute = async interaction => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets            = google.sheets({ version: "v4", auth });
  const range             = "Ferie!A:A";
  const spreadsheetId     = process.env.SHEET_ID;
  const valueRenderOption = "UNFORMATTED_VALUE";

  const content = ( await sheets.spreadsheets.values.get({
    spreadsheetId     ,
    valueRenderOption ,
    range             ,
  }))
  .data.values.flat().join("\n")
  
  await interaction.reply({
    content         ,
    ephemeral : true ,
  });
};

export { data, execute };
