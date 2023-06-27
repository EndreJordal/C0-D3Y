import { SlashCommandBuilder } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName( "regler" )
  .setDescription( "Gir deg en oversikt over hvilke regler som gjelder for kursdeltakere i Kodehode ⚖️" );

const execute = async interaction => {
  
  const content = (await googleSheet({
    write: false,
    sheetName: "Regler",
    range: "A:A",
  })).flat().join("\n")
  
  await interaction.reply({
    content         ,
    ephemeral : true ,
  });
};

export { data, execute };
