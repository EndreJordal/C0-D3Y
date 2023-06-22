// imports
import dotenv from "dotenv";
import fs     from "fs/promises";
import path   from "node:path";

// named imports
import { REST   } from "discord.js";
import { Routes } from "discord.js";

// initialize environment variables
dotenv.config();

// destructure evnvironment variables
const { CLIENT_ID     } = process.env;
const { DISCORD_TOKEN } = process.env;
const { GUILD_ID      } = process.env;

const commands = [];

const commandsPath = path.resolve("./commands");

const commandFiles = ( await fs
  .readdir( commandsPath ) )
  .filter( fileName => fileName.endsWith( ".js" ) );

// load all commandfiles from the command folder
for (const fileName of commandFiles) {
  const filePath = path.join(commandsPath, fileName);
  const fileUrl = new URL(`file:${filePath}`);
  const command = await import(fileUrl.href);

  
  if ( "data" in command && "execute" in command )
    commands.push( command.data.toJSON() );
  else
    console.warn(
      `[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.`
    );
}

const rest = new REST().setToken( DISCORD_TOKEN );

( async () => {
  try {
    console.log( `Started refreshing ${ commands.length } application (/) commands.` );

    const data = await rest.put(
      Routes.applicationGuildCommands( CLIENT_ID, GUILD_ID ),
      { body : commands },
    );

    console.log( `Sucessfully reloaded ${ data.length } application (/) commands.` );
  } catch ( error ) {
    console.error( error );
  }
})();
