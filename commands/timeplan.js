import { SlashCommandBuilder } from "discord.js";
import { calendarData, fetchCalendar } from "../utils/googleCalendar.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("timeplan")
  .setDescription("Gir deg informasjon om timeplanen for din modul 📅");

const execute = async (interaction) => {
  const userRoles = [...interaction.member.roles.cache].map(
    ([_, { name }]) => name
  );

  const userModule = Object.keys(calendarData).filter((role) =>
    userRoles.includes(`Modul ${role}`)
  );
  let reply = "";
  if (userModule.length > 1) {
    reply =
      "Du er satt opp til flere moduler, så her har det skjedd en feil! 😮 Vennligst ta kontakt med en veileder for å få fikset dette.";
  } else if (userModule.length === 0) {
    reply =
      "Du er ikke oppført i noen moduler akkurat nå 🤔 Vennligst ta kontakt med en veileder for å få fikset dette.";
  } else {
    reply = `# Timeplan \n## Her finner du din timeplan \nDu er i **Modul ${userModule}**\n${await fetchCalendar(
      calendarData[userModule].id
    )}\nFor tilgang til timeplanen din på Google Calendar, [trykk her.](${
      calendarData[userModule].url
    })`;
  }

  await interaction.reply({
    content: reply,
    ephemeral: true,
  });
};

export { data, execute };
