import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName( "roles" )
  .setDescription( "Provides information about the roles of the user." );

const execute = async interaction => {
  const roles = [ ...interaction.member.roles.cache ]
    .map( ([ _, { name } ]) => name )
    .join`, `;

  await interaction.reply( `Your roles are: ${ roles }.`);
};

export { data, execute };
