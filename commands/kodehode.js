import { SlashCommandBuilder } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("kodehode")
  .setDescription("Gir deg en generell oversikt over Kodehode kurset");

const execute = async (interaction) => {
  const content = (
    await googleSheet({
      write: false,
      sheetName: "Kodehode",
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
