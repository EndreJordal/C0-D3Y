import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
import dotenv from "dotenv";

const data = new SlashCommandBuilder()
  .setName("ukesrapport")
  .setDescription("Bruk denne for å sende inn din ukesrapport 👩‍💻");

const execute = async (interaction) => {
  const username = interaction.user.username.toLowerCase();

  dotenv.config();

  const modal = new ModalBuilder()
    .setTitle("👩‍💻 Send inn din ukesrapport her 💌")
    .setCustomId(`ukesrapport-${interaction.user.id}`);

  const ukesrapportInput = new TextInputBuilder()
    .setCustomId("ukesrapportInput")
    .setLabel("Skriv noe om hva du har lært/gjort denne uken")
    .setStyle(TextInputStyle.Paragraph);

  const actionRow = new ActionRowBuilder().addComponents(ukesrapportInput);

  modal.addComponents(actionRow);

  await interaction.showModal(modal);

  const filter = (interaction) =>
    interaction.customId === `ukesrapport-${interaction.user.id}`;
  interaction
    .awaitModalSubmit({ filter, time: 900000000 })
    .then(async (modalInteraction) => {
      const values = [
        [
          new Date().toLocaleString("nb-NO"),
          username,
          modalInteraction.fields.getTextInputValue("ukesrapportInput"),
        ],
      ];
      const resource = { values };

      await googleSheet({
        write: true,
        sheetName: "Deltaker-Ukesrapporter",
        range: "A2:C2",
        resource,
        valueInputOption: "USER_ENTERED",
      });

      modalInteraction.reply({
        content: "Tusen takk for rapporten! 💌 ",
        ephemeral: true,
      });
    });
};

export { data, execute };
