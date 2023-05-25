import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName( "ping" )
  .setDescription( "Replies with Pong!" );

const execute = async interaction => {
  const username = interaction.user.username.toLowerCase();

  if ( username.includes( "joe" ) )
    await interaction.reply( "Go suck a lemon!" );

  else if ( username.includes( "sindre" ) )
    await interaction.reply( "My man!" );

  else
    await interaction.reply( "Pong!" );
};

export { data, execute };
