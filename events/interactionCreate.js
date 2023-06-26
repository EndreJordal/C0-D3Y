import { Events } from "discord.js";

const name    = Events.InteractionCreate;
const execute = async interaction => {
  if ( !interaction.isChatInputCommand() ) return;

  const { commandName } = interaction;
  const command         = interaction.client.commands.get( commandName );

  //if (interaction.isModalSubmit()) return

  if ( !command ) {
    console.error( `No command matching ${ commandName } was found.` );
    return;
  }

  try {
    await command.execute( interaction );
  }

  catch ( error ) {
    console.error( `[ERROR] Error executing ${ commandName }`);
    console.error( error );

    if ( interaction.replied || interaction.deferred )
      await interaction.followUp({
        content   : "There was an error while executing this command!",
        ephemeral : true
    });

    else
      await interaction.reply({
        content   : "There was an error while executing this command!",
        ephemeral : true
    });

  }
};

export { name, execute };
