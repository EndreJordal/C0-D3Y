import { SlashCommandBuilder } from "discord.js";
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
  const quizPrimer = "I want you to make me a quiz question. I will give you the subject and difficulty. You will give me the question and 4 possible answers, 1 correct and 3 wrong. You will select the order of the alternatives randomly so the correct answer is in a random position every time. You will list the alternatives i a bulleted list, labeled 1, 2, 3 and 4. After you list the alternatives, you will add a line that says 'Correct answer: X' where X is the number that corresponds to the correct answer."
  const conversationLog = [{ role: "system", content: quizPrimer }]
  
  // Push question to conversation log
  conversationLog.push({ role: "user", content: question })

  await interaction.deferReply({ ephemeral: true });
  // Generate quiz question
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  })
  
  console.log(result.data.choices[0].message.content.slice(-1))
  await interaction.editReply({
    content: result.data.choices[0].message.content.slice(0, -17),
    ephemeral: true,
  });
};

export { data, execute };