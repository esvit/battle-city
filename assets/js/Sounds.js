export default
class Sounds {
  constructor() {
    this.sounds = {
      idle: document.getElementById('audio_idle'),
      move: document.getElementById('audio_move'),
      shoot: document.getElementById('audio_shoot'),
      explosion: document.getElementById('audio_explosion'),
      hit: document.getElementById('audio_hit'),
      start: document.getElementById('audio_start'),
      levelUp: document.getElementById('audio_level_up'),
      collect: document.getElementById('audio_collect'),
      bomb: document.getElementById('audio_bomb'),
      gameOver: document.getElementById('audio_game_over'),
      pick: document.getElementById('audio_pick'),
      wall: document.getElementById('audio_wall'),
      score: document.getElementById('audio_score'),
      victory: document.getElementById('audio_victory')
    };
  }

  async play(name, stopSounds = []) {
    const audio = [];
    for (const soundName in this.sounds) {
      const sound = this.sounds[soundName];

      if (soundName === name) {
        try {
          sound.muted = false;
          audio.push(sound.play());
        } catch (err) {

        }
      } else if (stopSounds.includes(soundName)) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
    await Promise.all(audio);
  }

  stop() {
    for (const soundName in this.sounds) {
      const sound = this.sounds[soundName];

      sound.pause();
      sound.currentTime = 0;
    }
  }
}
