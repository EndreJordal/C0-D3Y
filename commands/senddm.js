import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName( "senddm" )
  .setDescription( "Sends you a secret dm :o" );

const execute = async interaction => {
  const user = interaction.user;

  try {
    const message = await user.send( "Hello!" );
    console.log( `Sent message ${ message.content } to ${ user.tag }.` )

    await interaction.reply({
      content   : "message sent ;)",
      ephemeral : true,
    });
  }
  catch ( error ) {
    console.error( error );
  }
};

export { data, execute };
