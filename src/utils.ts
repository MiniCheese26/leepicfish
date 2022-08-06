import {
  AudioPlayer,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import {Guild, GuildMember} from 'discord.js';

export const joinVc = async (targetMember: GuildMember,
  guild: Guild,
  audioPlayer: AudioPlayer,
  onReady: (vc: VoiceConnection) => Promise<void>) => {
  let vc = getVoiceConnection(guild.id);

  if (!vc) {
    vc = joinVoiceChannel({
      guildId: guild.id,
      channelId: targetMember.voice.channelId ?? '',
      adapterCreator: guild.voiceAdapterCreator,
    });
    vc.subscribe(audioPlayer);
  }

  if (vc.state.status === VoiceConnectionStatus.Ready && vc) {
    await onReady(vc);
  } else {
    vc.once(VoiceConnectionStatus.Ready, async () => {
      if (vc) {
        await onReady(vc);
      }
    });
  }
};
