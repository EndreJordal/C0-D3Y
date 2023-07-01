import { Events } from "discord.js";
import { googleSheet } from "../utils/googleSheet.js";

const name = Events.InteractionCreate;
const execute = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = interaction.client.commands.get(commandName);

  //if (interaction.isModalSubmit()) return

  if (!command) {
    console.error(`No command matching ${commandName} was found.`);
    return;
  }

  try {
    // Logging commands to Google Sheets
    const values = [
      [
        new Date().toLocaleString("nb-NO"),
        interaction.member.user.username.toLowerCase(),
        `/${commandName}`,
      ],
    ];
    const resource = { values };

    await googleSheet({
      write: true,
      sheetName: "Kommando-Logg",
      range: "A2:C2",
      resource,
      valueInputOption: "USER_ENTERED",
    });
    // Running the command
    await command.execute(interaction);
  } catch (error) {
    console.error(`[ERROR] Error executing ${commandName}`);
    console.error(error);

    if (interaction.replied || interaction.deferred)
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    else
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
  }
};

export { name, execute };
