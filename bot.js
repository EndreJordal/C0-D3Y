// imports
import dotenv from "dotenv";
import fs     from "fs/promises";
import path   from "node:path";

// named imports
import { Client            } from "discord.js";
import { Collection        } from "discord.js";
import { Events            } from "discord.js";
import { GatewayIntentBits } from "discord.js";

// initialize environment variables
dotenv.config();
const { DISCORD_TOKEN } = process.env;

const client = new Client({
  intents : [ GatewayIntentBits.Guilds ]
});

client.commands = new Collection();

const __filename   = new URL( import.meta.url ).pathname;
const __dirname    = path.dirname( __filename );
const commandsPath = path.join( __dirname, "commands" );

const commandFiles = ( await fs
  .readdir( commandsPath ) )
  .filter( fileName => fileName.endsWith( ".js" ) );

// load all commandfiles from the command folder
for ( const fileName of commandFiles ) {
  const filePath = path.join( commandsPath, fileName );
  const command  = await import( filePath );
  
  if ( "data" in command && "execute" in command )
    client.commands.set( command.data.name, command );
  else
    console.warn(
      `[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.`
    );
}

// command handler
client.on( Events.InteractionCreate, async interaction => {
  if ( !interaction.isChatInputCommand() ) return;

  const { commandName } = interaction;
  const command         = interaction.client.commands.get( commandName );

  if ( !command ) {
    console.error( `No command matching ${ commandName } was found.` );
    return;
  }

  try {
    await command.execute( interaction );
  }

  catch ( error ) {
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
});

client.once( Events.ClientReady, client => {
  console.log( `Ready! Logged in as ${ client.user.tag }.` );
});

client.login( DISCORD_TOKEN );
