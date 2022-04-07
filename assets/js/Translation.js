const langs = {
  uk: {
    '1player': '1 ГРАВЕЦЬ',
    '2players': '2 ГРАВЦЯ (СКОРО)',
    'constructor': 'КОНСТРУКТОР',
    'donate': 'ДОНАТЬ НА АРМІЮ',
  },
  en: {
    '1player': '1 PLAYER',
    '2players': '2 PLAYERS (SOON)',
    'constructor': 'CONSTRUCTOR',
    'donate': 'DONATE TO ARMY',
  }
};

export default
class Translation {
  constructor() {
    this.lang = 'uk';
  }

  get(name) {
    return langs[this.lang][name];
  }
}
