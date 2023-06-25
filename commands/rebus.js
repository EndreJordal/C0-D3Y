import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("rebus")
  .setDescription("Use this command to submit your solution to Sommer Rebus Del 1")
  .addStringOption(option =>
    option.setName("solution")
      .setDescription("Paste in your solution")
      .setRequired(true)
  );

const execute = async interaction => {
  
    const correctsolution = "{|klpy,-6}kz;<=,on}khz?@>OI"
    const submittedSolution = interaction.options.getString("solution")
    const correctReply = "Good job! You solved it! lol"
    const incorrectReply = "No. Just no."
    const content = correctsolution === submittedSolution ? correctReply : incorrectReply

  await interaction.reply({
    content          ,
    ephemeral : true ,
  });
};

export { data, execute };