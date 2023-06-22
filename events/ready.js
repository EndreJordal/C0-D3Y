import { Events } from "discord.js";

const name    = Events.ClientReady;
const once    = true;
const execute = async client => {
  console.log( `Ready! Logged in as ${ client.user.tag }` );

 //  const guildId = "837036371062423642";
 //  const roleId  = "904667787568496661";
 // 
 //  const guild     = await client.guilds.fetch( guildId );
 //  const members   = await guild.members.fetch();
 //
 //  await members
 //    .filter( user => [ ...user._roles ].find( role => role === roleId ) )
 //    .forEach( async user => user.send( "Hei, kan du svare på denne meldingen med en liten tekst." ) )
}

export { name, once, execute };
