//------------------------------------------------------------------------------
// imports
//------------------------------------------------------------------------------
import dotenv from "dotenv";
import fs     from "fs/promises";
import path   from "node:path";

//------------------------------------------------------------------------------
// named imports
//------------------------------------------------------------------------------
import { Client            } from "discord.js";
import { Collection        } from "discord.js";
import { GatewayIntentBits } from "discord.js";

//------------------------------------------------------------------------------
// load environment variables
//------------------------------------------------------------------------------
dotenv.config();
const { DISCORD_TOKEN } = process.env;
const __filename        = new URL( import.meta.url ).pathname;
const __dirname         = path.dirname( __filename );

//------------------------------------------------------------------------------
// initialize a new client
//------------------------------------------------------------------------------
const client = new Client({
  intents : [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ]
});

//------------------------------------------------------------------------------
// dynamically load commands from a folder
//------------------------------------------------------------------------------
client.commands      = new Collection();
const commandsFolder = path.join( __dirname, "commands" );

const commandFiles = ( await fs
  .readdir( commandsFolder ) )
  .filter( fileName => fileName.endsWith( ".js" ) );

commandFiles.forEach( async file => {
  const filePath = path.join( commandsFolder, file );
  const command  = await import( filePath );
  
  if ( command[ "data" ] && command[ "execute" ] )
    client.commands.set( command.data.name, command );
  else
    console.warn(
      `[WARNING] The command at ${
        filePath
       } is missing a required "data" or "execute" property.`
    );
});

//------------------------------------------------------------------------------
// handle events
//------------------------------------------------------------------------------
const eventsFolder = path.join( __dirname, "events" );
const eventFiles = ( await fs
  .readdir( eventsFolder ) )
  .filter( fileName => fileName.endsWith( ".js" ) );

eventFiles.forEach( async file => {
  const filePath = path.join( eventsFolder, file );
  const event    = await import( filePath );

  client[ event.once ? "once" : "on" ]( event.name, ( ...args ) => 
    event.execute( ...args )
  );
});

//------------------------------------------------------------------------------
// start client
//------------------------------------------------------------------------------
client.login( DISCORD_TOKEN );
