import { SlashCommandBuilder } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("ressurser")
  .setDescription(
    "Gir deg en oversikt over nyttige ressurser og verktøy for Kodehoder 🧑‍💻"
  );

const execute = async (interaction) => {
  const content = (
    await googleSheet({
      write: false,
      sheetName: "Ressurser",
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
