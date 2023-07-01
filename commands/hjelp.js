import { SlashCommandBuilder } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("hjelp")
  .setDescription("Gir en oversikt over funksjoner du kan bruke");

const execute = async (interaction) => {
  const content = (
    await googleSheet({
      write: false,
      sheetName: "Hjelp",
      range: "A1",
    })
  )[0][0];

  await interaction.reply({
    content,
    ephemeral: true,
  });
};

export { data, execute };
