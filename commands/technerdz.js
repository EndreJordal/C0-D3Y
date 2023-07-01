import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { googleSheet } from "../utils/googleSheet.js";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("technerdz")
  .setDescription(
    "Gir deg en tilfeldig plukket link til noe kult/interessant 🤓"
  );

const execute = async (interaction) => {
  const content = await googleSheet({
    write: false,
    sheetName: "Technerdz",
    range: "A:A",
  });

  const randomLink = content.flat()[Math.floor(Math.random() * content.length)];
  await interaction.reply({
    content: randomLink,
    ephemeral: true,
  });
};

export { data, execute };
