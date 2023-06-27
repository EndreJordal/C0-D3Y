import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, 
         TextInputStyle, ActionRowBuilder } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
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
           
      const values = [[
        new Date().toLocaleString("nb-NO"),
        username,
        modalInteraction.fields.getTextInputValue("suggestionInput")
      ]];
      const resource = { values };

      await googleSheet({
        write: true,
        sheetName: "Forslagskassen",
        range: "A2:C2",
        resource,
        valueInputOption: "USER_ENTERED"
      })

      modalInteraction.reply({
        content: "Tusen takk for ditt forslag!",
        ephemeral: true,
      })
    })
};

export { data, execute };
