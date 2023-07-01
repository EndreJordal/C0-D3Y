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
  .setName("varsle")
  .setDescription("Bruk denne for å sende inn et varsel til kurset");

const execute = async (interaction) => {
  const username = interaction.user.username.toLowerCase();

  dotenv.config();

  const modal = new ModalBuilder()
    .setTitle("Send inn et varsel.")
    .setCustomId(`varsel-${interaction.user.id}`);

  const varselInput = new TextInputBuilder()
    .setCustomId("varselInput")
    .setLabel("Skriv inn ditt varsel")
    .setStyle(TextInputStyle.Paragraph);

  const actionRow = new ActionRowBuilder().addComponents(varselInput);

  modal.addComponents(actionRow);

  await interaction.showModal(modal);

  const filter = (interaction) =>
    interaction.customId === `varsel-${interaction.user.id}`;
  interaction
    .awaitModalSubmit({ filter, time: 600000000 })
    .then(async (modalInteraction) => {
      const values = [
        [
          new Date().toLocaleString("nb-NO"),
          username,
          modalInteraction.fields.getTextInputValue("varselInput"),
        ],
      ];
      const resource = { values };

      await googleSheet({
        write: true,
        sheetName: "Varsler",
        range: "A2:C2",
        resource,
        valueInputOption: "USER_ENTERED",
      });

      await googleSheet({
        note: true,
        resource: "@endre@jobloop.no VARSEL HAR BLITT SENDT INN!",
      });

      modalInteraction.reply({
        content:
          "Ditt varsel har blitt mottatt. Du vil bli kontaktet av en veileder/ansatt i løpet av kort tid.",
        ephemeral: true,
      });
    });
};

export { data, execute };
