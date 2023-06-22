import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName( "regler" )
  .setDescription( "Gir deg en oversikt over hvilke regler som gjelder for kursdeltakere i Kodehode ⚖️" );

const execute = async interaction => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets        = google.sheets({ version: "v4", auth });
  const range         = "Regler!A:A";
  const spreadsheetId = process.env.SHEET_ID;

  const content = ( await sheets.spreadsheets.values.get({
    spreadsheetId ,
    range         ,
  }))
  .data.values.flat().join("\n")
  
  await interaction.reply({
    content         ,
    ephemeral : true ,
  });
};

export { data, execute };
