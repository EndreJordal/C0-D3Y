import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

const data = new SlashCommandBuilder()
  .setName("forslagskassen")
  .setDescription("Bruk denne for å sende et forslag til kurset")
  .addStringOption(option =>
    option.setName("forslag")
      .setDescription("Skriv inn ditt forslag her")
      .setRequired(true)
  );

const execute = async interaction => {
  const username = interaction.user.username.toLowerCase();

  dotenv.config();

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "Forslagskassen!A2:D4";

  const values = [[
    new Date().toUTCString(),
    username,
    interaction.options.getString("forslag")
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

  await interaction.reply({
    content   : "Tusen takk for ditt forslag!" ,
    ephemeral : true                           ,
  });
};

export { data, execute };
