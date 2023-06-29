import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("quiz-me")
  .setDescription(
    "Gir deg et quiz spørsmål! Du kan velge både tema og vanskelighetsgrad 🎓"
  )
  .addStringOption((option) =>
    option
      .setName("tema")
      .setDescription("Hvilket tema vil du spørsmålet skal være?")
      .addChoices(
        { name: "HTML", value: "html" },
        { name: "CSS", value: "css" },
        { name: "Figma", value: "figma" },
        { name: "Javascript", value: "javascript" },
        { name: "React", value: "react" },
        { name: "Git/GitHub", value: "git" },
        { name: "Node/Express", value: "node" },
        { name: "SQL", value: "sql" },
        { name: "MongoDB", value: "mongodb" }
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("vanskelighetsgrad")
      .setDescription("Hvor vanskelig vil du spørsmålet skal være?")
      .addChoices(
        { name: "Lett", value: "beginner" },
        { name: "Medium", value: "intermediate" },
        { name: "Vanskelig", value: "advanced" },
        { name: "Sinnsykt vanskelig", value: "expert" }
      )
      .setRequired(true)
  );

const execute = async interaction => {
  const subject = interaction.options._hoistedOptions[0].value
  const difficulty = interaction.options._hoistedOptions[1].value
  const question = `Please quiz me on the subject of ${subject} with a difficulty of ${difficulty}.`

  // OpenAI API configuration
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration);

  // Primer for quiz
  const quizPrimer = "I want you to make me a quiz question. I will give you the subject and difficulty. You will give me the question and 4 possible answers, 1 correct and 3 wrong. You will select the order of the alternatives randomly so the correct answer is in a random position every time. You will list the alternatives i a bulleted list, labeled 1, 2, 3 and 4. After you list the alternatives, you will add a line that says 'Correct answer: X' where X is the number that corresponds to the correct answer. Make a heading with markdown like so:'# Here is your question...' Then put '### ' in front of the actual question. No markup on the alternatives. but remember to label the alternatives 1, 2, 3, and 4"
  const conversationLog = [{ role: "system", content: quizPrimer }]
  
  // Push question to conversation log
  conversationLog.push({ role: "user", content: question })

  await interaction.deferReply({ ephemeral: true });
  // Generate quiz question
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  })
  
  const firstOption = new ButtonBuilder()
  .setCustomId('1')
  .setLabel('1')
  .setStyle(ButtonStyle.Primary);

  const secondOption = new ButtonBuilder()
  .setCustomId('2')
  .setLabel('2')
  .setStyle(ButtonStyle.Primary);

  const thirdOption = new ButtonBuilder()
  .setCustomId('3')
  .setLabel('3')
  .setStyle(ButtonStyle.Primary);

  const fourthOption = new ButtonBuilder()
  .setCustomId('4')
  .setLabel('4')
  .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder()
  .addComponents(firstOption, secondOption, thirdOption, fourthOption);
  const gptQuiz = result.data.choices[0].message.content.slice(0, -17)
  const correctAnswer = result.data.choices[0].message.content.slice(-1)
  const response = await interaction.editReply({
    content: gptQuiz,
    components: [row],
    ephemeral: true,
  });
  
  const collectorFilter = i => i.user.id === interaction.user.id;

  const correctReplyArray = [
    `${gptQuiz}\n### ${correctAnswer} var rett svar, bra jobba!! 😄`,
    `${gptQuiz}\n### Yes! Rett svar var ${correctAnswer}, bra jobba!! 😄`,
    `${gptQuiz}\n### Konge! ${correctAnswer} er korrekt, du er sjef!! 😄`,
    `${gptQuiz}\n### High five! ${correctAnswer} er helt rett, ta ett til spørsmål da? 😄`,
    `${gptQuiz}\n### ${correctAnswer} var rett! Du er god, vet du det?? 😄`,
    `${gptQuiz}\n### ${correctAnswer} er 100% rett, nydelig!! 😄`,
    `${gptQuiz}\n### Kanon!! 💥 ${correctAnswer} er såklart riktig svar! Dette kan du! 😄`,
  ]

  const tip = "\n\n*TIPS: Trykk piltast opp for å få opp /quiz-me kommandoen du nettopp kjørte, med samme innstillinger for tema/vanskelighet, så kan du bare trykke Enter for et nytt spørsmål!*"

  try {
	const answer = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

    if (answer.customId === correctAnswer) {
		await answer.update({ content: correctReplyArray[Math.floor(Math.random() * correctReplyArray.length)] + tip, components: [] });
	} else  {
		await answer.update({ content: `${gptQuiz}\n### ${answer.customId} var dessverre feil, ${correctAnswer} var rett. 😥` + tip, components: [] });
	}
} catch (e) {
	await interaction.editReply({ content: 'Du har max 1 minutt på å svare, og tiden er ute 😥', components: [] });
}

};

export { data, execute };