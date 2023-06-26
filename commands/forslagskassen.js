import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, 
         TextInputStyle, ActionRowBuilder } from "discord.js";
import { google } from "googleapis";
import dotenv from "dotenv";

const data = new SlashCommandBuilder()
  .setName("forslagskassen")
  .setDescription("Bruk denne for å sende et forslag til kurset");

const execute = async interaction => {

  const username = interaction.user.username.toLowerCase();

  dotenv.config();

  const modal = new ModalBuilder()
    .setTitle("Send inn ditt forslag til kurset 💌")
    .setCustomId(`forslagskassen-${interaction.user.id}`)


  const suggestionInput = new TextInputBuilder()
    .setCustomId("suggestionInput")
    .setLabel("Skriv inn ditt forslag")
    .setStyle(TextInputStyle.Paragraph)

  const actionRow = new ActionRowBuilder().addComponents(suggestionInput)
  
  modal.addComponents(actionRow)

  await interaction.showModal(modal)

  const filter = (interaction) => interaction.customId === `forslagskassen-${interaction.user.id}`
  interaction
    .awaitModalSubmit({filter, time: 600000000})
    .then(async (modalInteraction) => {
      
      //post to google sheets

      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    
      const sheets = google.sheets({ version: "v4", auth });
      const range = "Forslagskassen!A2:D4";
    
      const values = [[
        new Date().toLocaleString("nb-NO"),
        username,
        modalInteraction.fields.getTextInputValue("suggestionInput")
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

      modalInteraction.reply({
        content: "Tusen takk for ditt forslag!",
        ephemeral: true,
      })
    })
};

export { data, execute };
