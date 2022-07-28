const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const queue = new Map();
const {
  SlashCommandBuilder,
  Integration,
  VoiceChannel,
} = require("discord.js");

/**
 *
 * @param channel
 * @returns {Promise<VoiceConnection>}
 * connects the bot to the channel specified in the params.
 */
async function connectToChannel(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, "ready", 30_000);
    return connection;
  } catch (error) {
    //disconnects the bot in case an error is thrown
    connection.destroy();
    throw error;
  }
}

/**
 *
 * @type {{data: SlashCommandBuilder, execute(*): Promise<void>}}
 * Creates the Slash command.
 */
module.exports = {
  //command information
  data: new SlashCommandBuilder().setName("play").setDescription("join VC"),
  //Command implementation
  async execute(interaction) {
    //Specifies that the channel to join is the channel of the user who requested the bot
    const channel = interaction.member.voice.channel;
    //Creates the empty audio player
    const player = createAudioPlayer();
    try {
      //Audio source
      const resource = createAudioResource("./media/test.mp3");
      //Join the Channel
      const connection = await connectToChannel(channel);
      //Pass the audio source to the empty player
      player.play(resource);
      //Subscribes the bot to the player.
      connection.subscribe(player);
      interaction.reply("Playing now!");
    } catch (error) {
      console.error(error);
    }
  },
};
