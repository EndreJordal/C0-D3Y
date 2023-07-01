import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { googleSheet } from "../utils/googleSheet.js";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("ferie")
  .setDescription(
    "Gir deg en oppdatert oversikt over kommende ferie og fridager for Kodehode 🏝️"
  );

const execute = async (interaction) => {
  const content = (
    await googleSheet({
      write: false,
      sheetName: "Ferie",
      range: "A:A",
    })
  )
    .flat()
    .join("\n");

  await interaction.reply({
    content,
    ephemeral: true,
  });
};

export { data, execute };
