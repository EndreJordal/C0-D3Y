import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("oversikt")
  .setDescription("Gir en oversikt over serveren 📊")
  .addStringOption((option) =>
    option
      .setName("Modul/By")
      .setDescription("Hva vil du ha en oversikt over?")
      .addChoices(
        { name: "Totaloversikt", value: "total" },
        { name: "Modul A", value: "modulA" },
        { name: "Modul B", value: "modulB" },
        { name: "Modul C", value: "modulC" },
        { name: "Modul D", value: "modulD" },
        { name: "Modul E", value: "modulE" },
        { name: "Modul S", value: "modulS" },
        { name: "Praksis", value: "praksis" },
        { name: "Veiledere & Ansatte", value: "veiledere" },
        { name: "Bergen", value: "bergen" },
        { name: "Stavanger", value: "stavanger" },
        { name: "Haugesund", value: "haugesund" }
      )
      .setRequired(true)
  );

const execute = async (interaction) => {
  await interaction.guild.members.fetch();
  const userRoles = [...interaction.member.roles.cache].map(
    ([_, { name }]) => name
  );

  if (!userRoles.includes("Admin") || !userRoles.includes("Teacher")) {
    await interaction.reply({
      content: `Denne kommandoen er ikke tilgjengelig for kursdeltakere. 😥`,
      ephemeral: true,
    });
    return;
  }

  const roles = interaction.guild.roles.cache;

  const memberCount = roles.map(
    (role) => `* ${role} har ${role.members.size} medlemm(er).`
  ).join`\n`;

  const content = `**Denne serveren heter ${interaction.guild.name} og har ${interaction.guild.memberCount} medlemmer.**\nDet er ${roles.size} roller på denne serveren:\n${memberCount}`;

  await interaction.reply({
    content: content,
    ephemeral: true,
  });
};

export { data, execute };
