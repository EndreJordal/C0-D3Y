import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const data = new SlashCommandBuilder()
  .setName("rebus")
  .setDescription("Use this command to submit your solution to Sommer Rebus Del 1")
  .addStringOption(option =>
    option.setName("solution")
      .setDescription("Paste in your solution")
      .setRequired(true)
  );

const execute = async interaction => {
  
    const correctsolution = "{|klpy,-6}kz;<=,on}khz?@>OI"
    const submittedSolution = interaction.options.getString("solution")
    const incorrectReply = `Wrong answer, please try again.
If you think you got it right, but it says it's wrong.
You may ask Endre, Joe or Sindre for a check.`

    const correctReply = `Correct answer!

Congratulations on completing the meatspace part of your challenges,
fellow rebels. The time has come to transcend into the vast realms of
cyberspace, where we'll unleash our hacking prowess upon those corporate
swine. Prepare yourself for the ultimate hack, for I have acquired a
login to one of SinTech Solutions critical servers.

To infiltrate their stronghold, execute the following command within
your terminal using the mighty SSH protocol:
\`\`\`bash
ssh admin@10.33.221.66
\`\`\`
Remember, the key to access lies in the password: "whiterabbit"

Once you breach their defenses, a file containing crucial instructions
awaits your discovery. Employ the sacred "cat" command to unveil its
secrets:
\`\`\`bash
cat instructions.txt
\`\`\`

Armed with knowledge, you shall navigate their intricate server structure
using the following tools bestowed upon you:
\`\`\`bash
tree                     # view folder structure of entire server
pwd                      # show path of current folder
cd                       # return to start folder
cd ..                    # move up to parent folder
cd [foldername]          # move into folder
ls                       # list contents of current folder
ls -l                    # show contents of current folder as a vertical list
ls -a                    # include hidden files in current folder
cat [filename]           # view contents of a file
grep [search] [filename] # search line by line for a string in a file
exit                     # logout the ssh session
\`\`\`

If you are stuck use "cd" to return to the starting folder and "cat
instructions.txt" from that folder to view the instructions again. Use
"tree" to show the file structure of the entire server. And if you are
really really stuck you may ask one of the greybeard hackers in the back.
`;

  const content = correctsolution === submittedSolution ? correctReply : incorrectReply

  await interaction.reply({
    content          ,
    ephemeral : true ,
  });
};

export { data, execute };
