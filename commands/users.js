import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName( "users" )
  .setDescription( "Echoes the users with a specific role." )
  .addRoleOption( option => option
    .setName( "role" )
    .setDescription( "The selected role." ) );

const execute = async interaction => {
  const roleId    = interaction.options.getRole( "role" )?.id;
  const roles     = interaction.guild.roles.cache;
  const roleNames = roles.map( ({ name }) => name ).join`, `;

  const members = roles
    .map( role => `${ role } has ${ role.members.size } member(s): ${ role.members.map( ({ displayName }) => displayName ).join`, ` }.` )
    .join`\n`

  await interaction.reply( `There are ${ roles.size } roles on this server; ${ roleNames }.\n${ members }` );
};

export { data, execute };
