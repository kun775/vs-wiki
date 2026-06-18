#!/usr/bin/env node
/**
 * Wiki 数据抓取脚本
 * 从 vampire.survivors.wiki MediaWiki API 批量抓取角色数据
 * 生成完整的 vsData.ts
 *
 * 用法: node scripts/scrape-wiki.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const API = 'https://vampire.survivors.wiki/api.php';

// 所有角色及其 wiki 页面名
const ALL_CHARACTERS = {
  // === 本体 标准 ===
  'antonio': { wiki: 'Antonio_Belpaese', category: 'base', secret: false },
  'imelda': { wiki: 'Imelda_Belpaese', category: 'base', secret: false },
  'pasqualina': { wiki: 'Pasqualina_Belpaese', category: 'base', secret: false },
  'gennaro': { wiki: 'Gennaro_Belpaese', category: 'base', secret: false },
  'arca': { wiki: 'Arca_Ladonna', category: 'base', secret: false },
  'porta': { wiki: 'Porta_Ladonna', category: 'base', secret: false },
  'lama': { wiki: 'Lama_Ladonna', category: 'base', secret: false },
  'poe': { wiki: 'Poe_Ratcho', category: 'base', secret: false },
  'clerici': { wiki: 'Suor_Clerici', category: 'base', secret: false },
  'dommario': { wiki: 'Dommario', category: 'base', secret: false },
  'krochi': { wiki: 'Krochi_Freetto', category: 'base', secret: false },
  'christine': { wiki: 'Christine_Davain', category: 'base', secret: false },
  'pugnala': { wiki: 'Pugnala_Provola', category: 'base', secret: false },
  'giovanna': { wiki: 'Giovanna_Grana', category: 'base', secret: false },
  'poppea': { wiki: 'Poppea_Pecorina', category: 'base', secret: false },
  'concetta': { wiki: 'Concetta_Caciotta', category: 'base', secret: false },
  'mortaccio': { wiki: 'Mortaccio', category: 'base', secret: false },
  'yatta': { wiki: 'Yatta_Cavallo', category: 'base', secret: false },
  'bianca': { wiki: 'Bianca_Ramba', category: 'base', secret: false },
  'osole': { wiki: "O'Sole_Meeo", category: 'base', secret: false },
  'ambrojoe': { wiki: 'Sir_Ambrojoe', category: 'base', secret: false },
  'gallo': { wiki: 'Iguana_Gallo_Valletto', category: 'base', secret: false },
  'divano': { wiki: 'Divano_Thelma', category: 'base', secret: false },
  'ziassunta': { wiki: "Zi'Assunta_Belpaese", category: 'base', secret: false },
  'sigma': { wiki: 'Queen_Sigma', category: 'base', secret: false },
  'bat_robbert': { wiki: 'Bat_Robbert', category: 'base', secret: false },
  'ziappunta': { wiki: "Zi'Appunta_Belpaese", category: 'base', secret: false },
  'big_troubler': { wiki: 'Big_Troubler', category: 'base', secret: false },
  'she_moon': { wiki: 'She-Moon_Eeta', category: 'base', secret: false },
  'para_kooleo': { wiki: 'Para_Kooleo', category: 'base', secret: false },
  'santa_ladonna': { wiki: 'Santa_Ladonna', category: 'base', secret: false },
  'gazebo': { wiki: 'Gazebo', category: 'base', secret: false },
  'chula_reh': { wiki: 'Chula-Reh', category: 'base', secret: false },
  'space_dude': { wiki: 'Space_Dude', category: 'base', secret: false },

  // === 本体 秘密 ===
  'exdash': { wiki: 'Exdash_Exiviiq', category: 'base', secret: true },
  'toastie': { wiki: 'Toastie', category: 'base', secret: true },
  'smith': { wiki: 'Smith_IV', category: 'base', secret: true },
  'random': { wiki: 'Random', category: 'base', secret: true },
  'boon': { wiki: 'Boon_Marrabbio', category: 'base', secret: true },
  'avatar': { wiki: 'Avatar_Infernas', category: 'base', secret: true },
  'minnah': { wiki: 'Minnah_Mannarah', category: 'base', secret: true },
  'leda': { wiki: 'Leda', category: 'base', secret: true },
  'cosmo': { wiki: 'Cosmo_Pavone', category: 'base', secret: true },
  'peppino': { wiki: 'Peppino', category: 'base', secret: true },
  'big_trouser': { wiki: 'Big_Trouser', category: 'base', secret: true },
  'missingno': { wiki: 'MissingN%E2%96%AF', category: 'base', secret: true },
  'gains': { wiki: 'Gains_Boros', category: 'base', secret: true },
  'gyorunton': { wiki: 'Gyorunton', category: 'base', secret: true },
  'red_death': { wiki: 'Mask_of_the_Red_Death', category: 'base', secret: true },
  'bats': { wiki: 'Bats_Bats_Bats', category: 'base', secret: true },
  'rose': { wiki: 'Rose_De_Infernas', category: 'base', secret: true },
  'torino': { wiki: 'Torino', category: 'base', secret: true },
  'scorej': { wiki: 'Scorej-Oni', category: 'base', secret: true },
  'gyoruntin': { wiki: 'Gyoruntin', category: 'base', secret: true },
  'secretino': { wiki: 'Secretino_Dagsson', category: 'base', secret: true },
  'space_dette': { wiki: 'Space_Dette', category: 'base', secret: true },

  // === 月咒山 ===
  'miang': { wiki: 'Miang_Moonspell', category: 'moonspell', secret: false },
  'menya': { wiki: 'Menya_Moonspell', category: 'moonspell', secret: false },
  'syuuto': { wiki: 'Syuuto_Moonspell', category: 'moonspell', secret: false },
  'babi_onna': { wiki: 'Babi-Onna', category: 'moonspell', secret: false },
  'mccoy_oni': { wiki: 'McCoy-Oni', category: 'moonspell', secret: false },
  'megalo_menya': { wiki: 'Megalo_Menya_Moonspell', category: 'moonspell', secret: true },
  'megalo_syuuto': { wiki: 'Megalo_Syuuto_Moonspell', category: 'moonspell', secret: true },
  'gavet_oni': { wiki: "Gav'Et-Oni", category: 'moonspell', secret: true },

  // === 福斯卡里 ===
  'eleanor': { wiki: 'Eleanor_Uziron', category: 'foscari', secret: false },
  'maruto': { wiki: 'Maruto_Cuts', category: 'foscari', secret: false },
  'keitha': { wiki: 'Keitha_Muort', category: 'foscari', secret: false },
  'luminaire': { wiki: 'Luminaire_Foscari', category: 'foscari', secret: false },
  'genevieve': { wiki: 'Genevieve_Gruy%C3%A8re', category: 'foscari', secret: false },
  'je_ne_viv': { wiki: 'Je-Ne-Viv', category: 'foscari', secret: true },
  'sammy': { wiki: 'Sammy', category: 'foscari', secret: true },
  'rottin_ghoul': { wiki: "Rottin'Ghoul", category: 'foscari', secret: true },

  // === Among Us ===
  'crewmate': { wiki: 'Crewmate_Dino', category: 'amongus', secret: false },
  'engineer': { wiki: 'Engineer_Gino', category: 'amongus', secret: false },
  'ghost_lino': { wiki: 'Ghost_Lino', category: 'amongus', secret: false },
  'shapeshifter': { wiki: 'Shapeshifter_Nino', category: 'amongus', secret: false },
  'guardian': { wiki: 'Guardian_Pina', category: 'amongus', secret: false },
  'impostor': { wiki: 'Impostor_Rina', category: 'amongus', secret: false },
  'scientist': { wiki: 'Scientist_Mina', category: 'amongus', secret: false },
  'horse': { wiki: 'Horse', category: 'amongus', secret: false },
  'megalo_impostor': { wiki: 'Megalo_Impostor_Rina', category: 'amongus', secret: true },

  // === 魂斗罗 ===
  'bill': { wiki: 'Bill_Rizer', category: 'contra', secret: false },
  'lance': { wiki: 'Lance_Bean', category: 'contra', secret: false },
  'ariana': { wiki: 'Ariana', category: 'contra', secret: false },
  'lucia': { wiki: 'Lucia_Zero', category: 'contra', secret: false },
  'brad': { wiki: 'Brad_Fang', category: 'contra', secret: false },
  'browny': { wiki: 'Browny', category: 'contra', secret: false },
  'sheena': { wiki: 'Sheena_Etranzi', category: 'contra', secret: false },
  'probotector': { wiki: 'Probotector', category: 'contra', secret: false },
  'stanley': { wiki: 'Stanley', category: 'contra', secret: false },
  'newt': { wiki: 'Newt_Plissken', category: 'contra', secret: false },
  'bahamut': { wiki: 'Colonel_Bahamut', category: 'contra', secret: false },
  'simondo': { wiki: 'Simondo_Belmont', category: 'contra', secret: false },

  // === 恶魔城 可见 ===
  'leon': { wiki: 'Leon_Belmont', category: 'castlevania', secret: false },
  'sonia': { wiki: 'Sonia_Belmont', category: 'castlevania', secret: false },
  'trevor': { wiki: 'Trevor_Belmont', category: 'castlevania', secret: false },
  'christopher': { wiki: 'Christopher_Belmont', category: 'castlevania', secret: false },
  'simon': { wiki: 'Simon_Belmont', category: 'castlevania', secret: false },
  'juste': { wiki: 'Juste_Belmont', category: 'castlevania', secret: false },
  'richter': { wiki: 'Richter_Belmont', category: 'castlevania', secret: false },
  'julius': { wiki: 'Julius_Belmont', category: 'castlevania', secret: false },
  'grant': { wiki: 'Grant_Danasty', category: 'castlevania', secret: false },
  'john_morris': { wiki: 'John_Morris', category: 'castlevania', secret: false },
  'jonathan': { wiki: 'Jonathan_Morris', category: 'castlevania', secret: false },
  'soma': { wiki: 'Soma_Cruz', category: 'castlevania', secret: false },
  'charlotte': { wiki: 'Charlotte_Aulin', category: 'castlevania', secret: false },
  'sypha': { wiki: 'Sypha_Belnades', category: 'castlevania', secret: false },
  'yoko': { wiki: 'Yoko_Belnades', category: 'castlevania', secret: false },
  'alucard': { wiki: 'Alucard', category: 'castlevania', secret: false },
  'eric': { wiki: 'Eric_Lecarde', category: 'castlevania', secret: false },
  'hector': { wiki: 'Hector', category: 'castlevania', secret: false },
  'maria': { wiki: 'Maria_Renard', category: 'castlevania', secret: false },
  'shanoa': { wiki: 'Shanoa', category: 'castlevania', secret: false },

  // === 恶魔城 隐藏 ===
  'quincy': { wiki: 'Quincy_Morris', category: 'castlevania', secret: false },
  'maxim': { wiki: 'Maxim_Kischine', category: 'castlevania', secret: false },
  'henry': { wiki: 'Henry', category: 'castlevania', secret: false },
  'dracula': { wiki: 'Vlad_Tepes_Dracula', category: 'castlevania', secret: false },
  'julia': { wiki: 'Julia_Laforeze', category: 'castlevania', secret: false },
  'carrie': { wiki: 'Carrie_Fernandez', category: 'castlevania', secret: false },
  'rinaldo': { wiki: 'Rinaldo_Gandolfi', category: 'castlevania', secret: false },
  'mina': { wiki: 'Mina_Hakuba', category: 'castlevania', secret: false },
  'elizabeth': { wiki: 'Elizabeth_Bartley', category: 'castlevania', secret: false },
  'reinhardt': { wiki: 'Reinhardt_Schneider', category: 'castlevania', secret: false },
  'isaac': { wiki: 'Isaac', category: 'castlevania', secret: false },
  'sara': { wiki: 'Sara_Trantoul', category: 'castlevania', secret: false },
  'vincent': { wiki: 'Vincent_Dorin', category: 'castlevania', secret: false },
  'albus': { wiki: 'Albus', category: 'castlevania', secret: false },
  'lisa': { wiki: 'Lisa_Tepes', category: 'castlevania', secret: false },
  'shaft': { wiki: 'Shaft', category: 'castlevania', secret: false },
  'saint_germain': { wiki: 'Saint_Germain', category: 'castlevania', secret: false },
  'nathan': { wiki: 'Nathan_Graves', category: 'castlevania', secret: false },
  'cornell': { wiki: 'Cornell', category: 'castlevania', secret: false },
  'barlowe': { wiki: 'Barlowe', category: 'castlevania', secret: false },
};

// 为了限制 API 调用，先聚焦最常用的角色
// 完整列表可在后续扩展
const CHARACTERS_TO_FETCH = ALL_CHARACTERS;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWikiPage(wikiName) {
  const url = `${API}?action=parse&page=${encodeURIComponent(wikiName)}&prop=wikitext&format=json&formatversion=2`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.parse?.wikitext || null;
  } catch {
    return null;
  }
}

/**
 * 解析 {{Infobox Character}} 模板
 */
function parseInfobox(wikitext) {
  const result = {
    name: '',
    weapon: '',
    unlock: '',
    cost: 0,
    stats: {},
    passiveText: '',
    description: '',
  };

  // 匹配 infobox 块
  const infoboxMatch = wikitext.match(/\{\{Infobox Character\s*\n([\s\S]*?)\}\}/);
  if (!infoboxMatch) {
    // 尝试匹配单行
    const singleMatch = wikitext.match(/\{\{Infobox Character\s*\|([^}]+)\}\}/);
    if (!singleMatch) return result;
    parseFields(singleMatch[1], result);
  } else {
    parseFields(infoboxMatch[1], result);
  }

  // 提取被动描述（第二段文本）
  const afterInfobox = wikitext.replace(/\{\{Infobox[\s\S]*?\}\}/, '');
  const passiveMatch = afterInfobox.match(/==Passive bonuses==\s*\n([\s\S]*?)(?:\n==|$)/);
  if (passiveMatch) {
    result.passiveText = passiveMatch[1].replace(/'''/g, '').replace(/{{.*?}}/g, '').trim();
  }

  // 提取 description
  const descMatch = wikitext.match(/\|description\s*=\s*(.+?)\n/);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  // 生成简要被动描述
  if (result.passiveText) {
    const lines = result.passiveText.split('\n').filter(l => l.trim());
    result.passiveText = lines.slice(0, 3).join(' ').replace(/\{\|[\s\S]*?\|\}/g, '').replace(/\s+/g, ' ').trim();
  }

  if (!result.passiveText && result.description) {
    result.passiveText = result.description;
  }

  return result;
}

function parseFields(text, result) {
  const lines = text.split('\n');
  const statMap = {
    maxhealth: 'maxHealth',
    recovery: 'recovery',
    armor: 'armor',
    movespeed: 'moveSpeed',
    might: 'might',
    speed: 'speed',
    duration: 'duration',
    area: 'area',
    cooldown: 'cooldown',
    amount: 'amount',
    revival: 'revival',
    magnet: 'magnet',
    luck: 'luck',
    growth: 'growth',
    greed: 'greed',
    curse: 'curse',
    reroll: 'reroll',
    skip: 'skip',
    banish: 'banish',
  };

  for (const line of lines) {
    const fieldMatch = line.match(/^\|(\w+)\s*=\s*(.+)/);
    if (!fieldMatch) continue;
    const [, key, rawValue] = fieldMatch;
    const value = rawValue.trim();

    if (key === 'name' || key === 'name1') {
      result.name = value.replace(/\(Legacy\)/, '').trim();
    } else if (key === 'weapon') {
      result.weapon = value;
    } else if (key === 'unlock') {
      result.unlock = value;
    } else if (key === 'cost') {
      result.cost = parseInt(value) || 0;
    } else if (key === 'dlc') {
      result.dlc = value;
    } else if (key === 'description') {
      result.description = value;
    } else if (statMap[key]) {
      const raw = value.replace(/[+%]/g, '').trim();
      if (raw === '-' || raw === '') {
        result.stats[statMap[key]] = 0;
      } else {
        const num = parseFloat(raw);
        if (!isNaN(num)) result.stats[statMap[key]] = num;
      }
    }
  }
}

/**
 * 武器 key 映射表（wiki名称 -> 内部key）
 */
const WEAPON_KEY_MAP = {
  'Whip': 'whip',
  'Magic Wand': 'magic_wand',
  'Knife': 'knife',
  'Axe': 'axe',
  'Cross': 'cross',
  'King Bible': 'king_bible',
  'Fire Wand': 'fire_wand',
  'Garlic': 'garlic',
  'Santa Water': 'santa_water',
  'Lightning Ring': 'lightning_ring',
  'Pentagram': 'pentagram',
  'Runetracer': 'runetracer',
  'Peachone': 'peachone',
  'Ebony Wings': 'ebony_wings',
  'Gatti Amari': 'gatti_amari',
  'Song of Mana': 'song_of_mana',
  'Shadow Pinion': 'shadow_pinion',
  'Clock Lancet': 'clock_lancet',
  'Laurel': 'laurel',
  'Vento Sacro': 'vento_sacro',
  'Bone': 'bone',
  'Cherry Bomb': 'cherry_bomb',
  "Carréllo": 'carrello',
  'Celestial Dusting': 'celestial_dusting',
  'La Robba': 'la_robba',
  'Greatest Jubilee': 'greatest_jubilee',
  'Bracelet': 'bracelet',
  'Candybox': 'candybox',
  'Victory Sword': 'victory_sword',
  'Flames of Misspell': 'flames_of_misspell',
  'Pako Battiliar': 'pako_battiliar',
  'Ammo Appalate': 'ammo_appalate',
  'Unearthly Bolt': 'unearthly_bolt',
  'Glass Fandango': 'glass_fandango',
  'Santa Javelin': 'santa_javelin',
  'Gaze of Gaea': 'gaze_of_gaea',
  'Magi-Stone': 'magi_stone',
  'Phas3r': 'phas3r',
  'Chaos Rune': 'chaos_rune',
  // DLC weapons
  'Silver Wind': 'silver_wind',
  'Four Seasons': 'four_seasons',
  'Summon Night': 'summon_night',
  'Mirage Robe': 'mirage_robe',
  'Night Sword': 'night_sword',
  'Mille Bolle Blu': 'mille_bolle_blu',
  '108 Bocce': 'bocce_108',
  'SpellString': 'spellstring',
  'SpellStream': 'spellstream',
  'SpellStrike': 'spellstrike',
  'Eskizzibur': 'eskizzibur',
  'Flash Arrow': 'flash_arrow',
  'Prismatic Missile': 'prismatic_missile',
  'Shadow Servant': 'shadow_servant',
  'Party Popper': 'party_popper',
  'Report!': 'report',
  'Lucky Swipe': 'lucky_swipe',
  'Lifesign Scan': 'lifesign_scan',
  'Just Vent': 'just_vent',
  'Clear Debris': 'clear_debris',
  'Sharp Tongue': 'sharp_tongue',
  'Science Rocks': 'science_rocks',
  'Hats': 'hats',
  'Long Gun': 'long_gun',
  'Short Gun': 'short_gun',
  'Spread Shot': 'spread_shot',
  'C-U-Laser': 'c_u_laser',
  'Firearm': 'firearm',
  'Sonic Bloom': 'sonic_bloom',
  'Homing Miss': 'homing_miss',
  'Diver Mines': 'diver_mines',
  'Blade Crossbow': 'blade_crossbow',
  'Prism Lass': 'prism_lass',
  'Metal Claw': 'metal_claw',
  // 恶魔城
  'Alchemy Whip': 'alchemy_whip',
  'Wind Whip': 'wind_whip',
  'Platinum Whip': 'platinum_whip',
  'Dragon Water Whip': 'dragon_water_whip',
  'Sonic Whip': 'sonic_whip',
  'Jet Black Whip': 'jet_black_whip',
  'Vibhuti Whip': 'vibhuti_whip',
  'Vanitas Whip': 'vanitas_whip',
  'Shuriken': 'shuriken',
  'Curved Knife': 'curved_knife',
  'Javelin': 'javelin',
  'Discus': 'discus',
  'Iron Ball': 'iron_ball',
  'Silver Revolver': 'silver_revolver',
  'Hand Grenade': 'hand_grenade',
  'Wine Glass': 'wine_glass',
  'Raging Fire': 'raging_fire',
  'Ice Fang': 'ice_fang',
  'Gale Force': 'gale_force',
  'Rock Riot': 'rock_riot',
  'Fulgur': 'fulgur',
  'Keremet Bubbles': 'keremet_bubbles',
  'Hex': 'hex',
  'Refectio': 'refectio',
  'Mace': 'mace',
  'Star Flail': 'star_flail',
  'Alucard Spear': 'alucard_spear',
  'Trident': 'trident',
  'Iron Shield': 'iron_shield',
  "Guardian's Targe": 'guardians_targe',
  'Tyrfing': 'tyrfing',
  'Alucart Sworb': 'alucart_sworb',
  'Confodere': 'confodere',
  'Globus': 'globus',
  'Optical Shot': 'optical_shot',
  'Dextro Custos': 'dextro_custos',
  'Sinestro Custos': 'sinestro_custos',
  'Centralis Custos': 'centralis_custos',
  'Dominus Anger': 'dominus_anger',
  'Dominus Hatred': 'dominus_hatred',
  'Dominus Agony': 'dominus_agony',
  'Sonic Dash': 'sonic_dash',
  'Luminatio': 'luminatio',
  'Umbra': 'umbra',
  'Valmanway': 'valmanway',
  'Icebrand': 'icebrand',
  'Arrow of Goth': 'arrow_of_goth',
  'Aura Blast': 'aura_blast',
  'Kaiser Knuckle': 'kaiser_knuckle',
  'Pocket Knife': 'pocket_knife',
  'Svarog Statue': 'svarog_statue',
  'Troll Bomb': 'troll_bomb',
  'Hydro Storm': 'hydro_storm',
  'Grand Cross': 'grand_cross',
  'Summon Spirit': 'summon_spirit',
  'Soul Steal': 'soul_steal',
  'Dark Rift': 'dark_rift',
  'Sword Brothers': 'sword_brothers',
  'Summon Spirit Tornado': 'summon_spirit_tornado',
  'Anura': 'anura',
  'Endo Gears': 'endo_gears',
  'Peri Pendulum': 'peri_pendulum',
  'Myo Lift': 'myo_lift',
  'Epi Head': 'epi_head',
  'Familiar Forge': 'familiar_forge',
};

function mapWeaponKey(weaponStr) {
  if (!weaponStr) return '';
  // Handle semicolon-separated multiple weapons
  const weapons = weaponStr.split(';').map(s => s.trim());
  const mapped = weapons.map(w => {
    // Remove wiki links [[...]]
    const clean = w.replace(/\[\[.*?\|(.+?)\]\]/g, '$1').replace(/\[\[|\]\]/g, '').trim();
    // Try direct mapping
    if (WEAPON_KEY_MAP[clean]) return WEAPON_KEY_MAP[clean];
    // Try lowercase
    const key = clean.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (WEAPON_KEY_MAP[key]) return WEAPON_KEY_MAP[key];
    return key;
  });
  return mapped[0]; // Return first weapon as primary
}

// 武器名称中英文对照
const WEAPON_NAMES = {
  'whip': ['鞭子', 'Whip'],
  'magic_wand': ['魔法杖', 'Magic Wand'],
  'knife': ['飞刀', 'Knife'],
  'axe': ['斧头', 'Axe'],
  'cross': ['十字架', 'Cross'],
  'king_bible': ['国王圣经', 'King Bible'],
  'fire_wand': ['火之魔杖', 'Fire Wand'],
  'garlic': ['大蒜', 'Garlic'],
  'santa_water': ['圣水', 'Santa Water'],
  'lightning_ring': ['闪电戒指', 'Lightning Ring'],
  'pentagram': ['五芒星', 'Pentagram'],
  'runetracer': ['符文追踪器', 'Runetracer'],
  'peachone': ['白鸽子', 'Peachone'],
  'ebony_wings': ['黑鸽子', 'Ebony Wings'],
  'gatti_amari': ['猫咪', 'Gatti Amari'],
  'song_of_mana': ['魔力之歌', 'Song of Mana'],
  'shadow_pinion': ['影子针', 'Shadow Pinion'],
  'clock_lancet': ['柳叶刀', 'Clock Lancet'],
  'laurel': ['月桂', 'Laurel'],
  'vento_sacro': ['圣风', 'Vento Sacro'],
  'bone': ['骨头', 'Bone'],
  'cherry_bomb': ['樱桃炸弹', 'Cherry Bomb'],
  'carrello': ['推车', "Carréllo"],
  'celestial_dusting': ['星尘', 'Celestial Dusting'],
  'la_robba': ['掠夺', 'La Robba'],
  'greatest_jubilee': ['庆典', 'Greatest Jubilee'],
  'bracelet': ['手镯', 'Bracelet'],
  'victory_sword': ['胜利之剑', 'Victory Sword'],
  'flames_of_misspell': ['咒炎', 'Flames of Misspell'],
  'silver_wind': ['银风', 'Silver Wind'],
  'four_seasons': ['四季', 'Four Seasons'],
  'summon_night': ['暗夜召唤', 'Summon Night'],
  'mirage_robe': ['幻影长袍', 'Mirage Robe'],
  'night_sword': ['暗夜剑', 'Night Sword'],
  'mille_bolle_blu': ['千蓝泡', 'Mille Bolle Blu'],
  'bocce_108': ['108飞球', '108 Bocce'],
  'spellstring': ['咒弦', 'SpellString'],
  'spellstream': ['咒流', 'SpellStream'],
  'spellstrike': ['咒击', 'SpellStrike'],
  'eskizzibur': ['埃斯基剑', 'Eskizzibur'],
  'flash_arrow': ['闪光箭', 'Flash Arrow'],
  'prismatic_missile': ['棱镜导弹', 'Prismatic Missile'],
  'shadow_servant': ['暗影仆从', 'Shadow Servant'],
  'party_popper': ['派对炮', 'Party Popper'],
  'report': ['报告!', 'Report!'],
  'lucky_swipe': ['幸运刷卡', 'Lucky Swipe'],
  'lifesign_scan': ['生命扫描', 'Lifesign Scan'],
  'just_vent': ['排气管', 'Just Vent'],
  'clear_debris': ['清理碎片', 'Clear Debris'],
  'sharp_tongue': ['利舌', 'Sharp Tongue'],
  'science_rocks': ['科学之力', 'Science Rocks'],
  'hats': ['帽子', 'Hats'],
  'long_gun': ['长枪', 'Long Gun'],
  'short_gun': ['短枪', 'Short Gun'],
  'spread_shot': ['散射枪', 'Spread Shot'],
  'c_u_laser': ['C-U激光', 'C-U-Laser'],
  'firearm': ['火焰臂', 'Firearm'],
  'sonic_bloom': ['音波花', 'Sonic Bloom'],
  'homing_miss': ['追踪导弹', 'Homing Miss'],
  'diver_mines': ['潜水雷', 'Diver Mines'],
  'blade_crossbow': ['刀锋弩', 'Blade Crossbow'],
  'prism_lass': ['棱镜少女', 'Prism Lass'],
  'metal_claw': ['金属爪', 'Metal Claw'],
  'alchemy_whip': ['炼金鞭', 'Alchemy Whip'],
  'alucard': ['阿鲁卡多', 'Alucard'],
  'simon': ['西蒙·贝尔蒙特', 'Simon Belmont'],
};

// 角色名称中英文对照
const CHAR_NAMES = {
  'antonio': ['安东尼奥', 'Antonio Belpaese'],
  'imelda': ['伊梅尔达', 'Imelda Belpaese'],
  'pasqualina': ['帕斯夸莉娜', 'Pasqualina Belpaese'],
  'gennaro': ['杰纳罗', 'Gennaro Belpaese'],
  'arca': ['阿尔卡', 'Arca Ladonna'],
  'porta': ['波尔塔', 'Porta Ladonna'],
  'lama': ['拉玛', 'Lama Ladonna'],
  'poe': ['波伊', 'Poe Ratcho'],
  'clerici': ['克莱里奇修女', 'Suor Clerici'],
  'dommario': ['多姆马里奥', 'Dommario'],
  'krochi': ['克罗奇', 'Krochi Freetto'],
  'christine': ['克里斯汀', 'Christine Davain'],
  'pugnala': ['普格纳拉', 'Pugnala Provola'],
  'giovanna': ['乔凡娜', 'Giovanna Grana'],
  'poppea': ['波佩娅', 'Poppea Pecorina'],
  'concetta': ['康切塔', 'Concetta Caciotta'],
  'mortaccio': ['莫塔乔', 'Mortaccio'],
  'yatta': ['亚塔', 'Yatta Cavallo'],
  'bianca': ['比安卡', 'Bianca Ramba'],
  'osole': ['欧索雷', "O'Sole Meeo"],
  'ambrojoe': ['安布罗乔爵士', 'Sir Ambrojoe'],
  'gallo': ['加洛', 'Iguana Gallo Valletto'],
  'divano': ['迪瓦诺', 'Divano Thelma'],
  'ziassunta': ['齐亚桑塔', "Zi'Assunta Belpaese"],
  'sigma': ['西格玛女王', 'Queen Sigma'],
  'exdash': ['Exdash', 'Exdash Exiviiq'],
  'toastie': ['Toastie', 'Toastie'],
  'smith': ['史密斯四世', 'Smith IV'],
  'random': ['随机', 'Random'],
  'boon': ['布恩', 'Boon Marrabbio'],
  'avatar': ['阿凡达', 'Avatar Infernas'],
  'minnah': ['明娜', 'Minnah Mannarah'],
  'leda': ['莱达', 'Leda'],
  'cosmo': ['科斯莫', 'Cosmo Pavone'],
  'peppino': ['佩皮诺', 'Peppino'],
  'big_trouser': ['大裤子', 'Big Trouser'],
  'missingno': ['MissingNo', 'missingN▯'],
  'gains': ['甘斯', 'Gains Boros'],
  'gyorunton': ['乔伦顿', 'Gyorunton'],
  'red_death': ['红死面具', 'Mask of the Red Death'],
  'miang': ['米昂', 'Miang Moonspell'],
  'menya': ['门雅', 'Menya Moonspell'],
  'syuuto': ['秀人', 'Syuuto Moonspell'],
  'babi_onna': ['芭比女', 'Babi-Onna'],
  'mccoy_oni': ['麦考伊鬼', 'McCoy-Oni'],
  'megalo_menya': ['巨大门雅', 'Megalo Menya'],
  'megalo_syuuto': ['巨大秀人', 'Megalo Syuuto'],
  'gavet_oni': ['加维特鬼', "Gav'Et-Oni"],
  'eleanor': ['埃莉诺', 'Eleanor Uziron'],
  'maruto': ['马鲁托', 'Maruto Cuts'],
  'keitha': ['凯莎', 'Keitha Muort'],
  'luminaire': ['光明使', 'Luminaire Foscari'],
  'genevieve': ['吉纳维芙', 'Genevieve Gruyère'],
  'je_ne_viv': ['Je-Ne-Viv', 'Je-Ne-Viv'],
  'sammy': ['萨米', 'Sammy'],
  'rottin_ghoul': ['腐烂食尸鬼', "Rottin'Ghoul"],
  'crewmate': ['船员', 'Crewmate Dino'],
  'engineer': ['工程师', 'Engineer Gino'],
  'ghost_lino': ['幽灵', 'Ghost Lino'],
  'shapeshifter': ['变形者', 'Shapeshifter Nino'],
  'guardian': ['守护者', 'Guardian Pina'],
  'impostor': ['内鬼', 'Impostor Rina'],
  'scientist': ['科学家', 'Scientist Mina'],
  'horse': ['马', 'Horse'],
  'megalo_impostor': ['巨大内鬼', 'Megalo Impostor'],
  'bill': ['比尔', 'Bill Rizer'],
  'lance': ['兰斯', 'Lance Bean'],
  'ariana': ['阿丽亚娜', 'Ariana'],
  'lucia': ['露西亚', 'Lucia Zero'],
  'brad': ['布拉德', 'Brad Fang'],
  'browny': ['布朗尼', 'Browny'],
  'sheena': ['希娜', 'Sheena Etranzi'],
  'probotector': ['机器人', 'Probotector'],
  'stanley': ['斯坦利', 'Stanley'],
  'newt': ['纽特', 'Newt Plissken'],
  'bahamut': ['巴哈姆特', 'Colonel Bahamut'],
  'simondo': ['西蒙多', 'Simondo Belmont'],
  'leon': ['里昂·贝尔蒙特', 'Leon Belmont'],
  'sonia': ['索尼娅·贝尔蒙特', 'Sonia Belmont'],
  'trevor': ['特雷弗·贝尔蒙特', 'Trevor Belmont'],
  'christopher': ['克里斯托弗·贝尔蒙特', 'Christopher Belmont'],
  'simon': ['西蒙·贝尔蒙特', 'Simon Belmont'],
  'juste': ['朱斯特·贝尔蒙特', 'Juste Belmont'],
  'richter': ['里希特·贝尔蒙特', 'Richter Belmont'],
  'julius': ['尤里乌斯·贝尔蒙特', 'Julius Belmont'],
  'grant': ['格兰特', 'Grant Danasty'],
  'john_morris': ['约翰·莫里斯', 'John Morris'],
  'jonathan': ['乔纳森·莫里斯', 'Jonathan Morris'],
  'soma': ['苍真', 'Soma Cruz'],
  'charlotte': ['夏洛特', 'Charlotte Aulin'],
  'sypha': ['赛法', 'Sypha Belnades'],
  'yoko': ['洋子', 'Yoko Belnades'],
  'alucard': ['阿鲁卡多', 'Alucard'],
  'eric': ['艾里克', 'Eric Lecarde'],
  'hector': ['赫克托', 'Hector'],
  'maria': ['玛丽亚', 'Maria Renard'],
  'shanoa': ['夏诺雅', 'Shanoa'],
  'dracula': ['德古拉', 'Dracula'],
  'elizabeth': ['伊丽莎白', 'Elizabeth Bartley'],
  'isaac': ['艾萨克', 'Isaac'],
};

/**
 * 批量抓取
 */
async function fetchAllCharacters() {
  const entries = Object.entries(CHARACTERS_TO_FETCH);
  const batchSize = 5;
  const results = {};

  console.log(`Fetching ${entries.length} characters in batches of ${batchSize}...`);

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const promises = batch.map(async ([key, info]) => {
      const wikitext = await fetchWikiPage(info.wiki);
      if (!wikitext) {
        console.error(`  FAIL ${key} (${info.wiki}): no data`);
        return [key, null];
      }
      const data = parseInfobox(wikitext);
      data.wikiPage = info.wiki;
      return [key, { ...data, category: info.category, secret: info.secret }];
    });

    const batchResults = await Promise.all(promises);
    for (const [key, data] of batchResults) {
      if (data) {
        results[key] = data;
        console.log(`  OK ${key}: ${data.name || '?'} — weapon: ${data.weapon || '?'}`);
      }
    }

    // 速率限制
    if (i + batchSize < entries.length) {
      await sleep(1500);
    }
  }

  return results;
}

/**
 * 生成 TypeScript
 */
function generateTypeScript(charData, existingData) {
  const categories = {
    base: '本体',
    moonspell: '月咒山',
    foscari: '福斯卡里',
    amongus: 'Among Us 联动',
    contra: '魂斗罗联动',
    castlevania: '恶魔城联动',
    emerald_diorama: '翡翠幻境',
    ante_chamber: '前厅',
  };

  // 角色
  const charEntries = Object.entries(charData).map(([key, data]) => {
    const names = CHAR_NAMES[key] || [data.name || key, data.name || key];
    const weaponKey = mapWeaponKey(data.weapon);
    const passiveDesc = data.passiveText || data.description || '';
    const unlock = data.unlock || '默认解锁';
    const category = data.category || 'base';
    const secret = data.secret ? ' (秘密角色)' : '';
    const icon = '👤';

    return `    "${key}": { name: "${names[0]}", nameEn: "${names[1].replace(/"/g, '\\"')}", icon: "${icon}", category: "${category}", initWeaponKey: "${weaponKey}", passiveDesc: "${passiveDesc.replace(/"/g, '\\"').replace(/\n/g, ' ')}", unlock: "${unlock.replace(/"/g, '\\"')}${secret}", recommends: [] },`;
  });

  const ts = `// 吸血鬼幸存者游戏数据 v1.15+
// 从 vampire.survivors.wiki 自动抓取生成
// 生成日期: ${new Date().toISOString().split('T')[0]}

export interface GameItem {
  name: string;
  nameEn: string;
  type: 'base' | 'passive' | 'evolved';
  category: string;
  desc: string;
  rating?: number;
  icon?: string;
  review?: string;
  img?: string;
  imgLocal?: string;
  imgRemote?: string;
  stats?: {
    dps?: number;
    sur?: number;
    cc?: number;
    gro?: number;
    cdr?: number;
  };
}

export interface Character {
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  initWeaponKey: string;
  passiveDesc: string;
  unlock: string;
  recommends: string[];
  avatar?: string;
  img?: string;
  imgLocal?: string;
  imgRemote?: string;
}

export interface Evolution {
  weapon: string;
  passive: string;
  evolved: string;
  cond?: string;
}

export interface VSData {
  categories: Record<string, string>;
  items: Record<string, GameItem>;
  characters: Record<string, Character>;
  evolutions: Evolution[];
}

export const VS_DATA: VSData = {
  categories: ${JSON.stringify(categories, null, 4)},

  // 物品数据库 (${Object.keys(existingData.items || {}).length} 项)
  items: {
${existingData.itemLines || '    // TODO: items'}
  },

  // 角色数据库 (${charEntries.length} 个角色)
  characters: {
${charEntries.join('\n')}
  },

  // 进化配方 (${(existingData.evolutions || []).length} 条)
  evolutions: ${JSON.stringify(existingData.evolutions || [], null, 4)},
};

// === 图片映射 ===

// Wiki 图片基础 URL
export const WIKI_IMG_REMOTE = 'https://vampire.survivors.wiki/images/';

// 本地图片路径前缀
export const ICONS_LOCAL = '/icons/';
export const CHARS_LOCAL = '/characters/';

// 物品 wiki 名称覆写
export const ITEM_WIKI_OVERRIDES: Record<string, string> = ${JSON.stringify(existingData.itemOverrides || {}, null, 2)};

// 角色 wiki 名称
export const CHAR_WIKI_NAMES: Record<string, string> = ${JSON.stringify(existingData.charWikiNames || {}, null, 2)};

// 运行时注入图片路径
(function () {
  for (const [key, item] of Object.entries(VS_DATA.items)) {
    const wikiName = ITEM_WIKI_OVERRIDES[key] || key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
    item.imgLocal = \`\${ICONS_LOCAL}\${key}.png\`;
    item.imgRemote = \`\${WIKI_IMG_REMOTE}Icon-\${wikiName}.png\`;
  }
  for (const [key, char] of Object.entries(VS_DATA.characters)) {
    const wikiName = CHAR_WIKI_NAMES[key] || key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
    char.imgLocal = \`\${CHARS_LOCAL}\${key}.png\`;
    char.imgRemote = \`\${WIKI_IMG_REMOTE}Select-\${wikiName}.png\`;
  }
})();
`;

  return ts;
}

async function main() {
  // 读取现有数据
  const existingPath = join(PROJECT_ROOT, 'src', 'data', 'vsData.ts');
  let existingItems = {};
  let existingEvolutions = [];
  let existingItemOverrides = {};
  let existingCharWikiNames = {};

  try {
    const existingContent = await import(existingPath);
    existingItems = existingContent.VS_DATA?.items || {};
    existingEvolutions = existingContent.VS_DATA?.evolutions || [];
    existingItemOverrides = existingContent.ITEM_WIKI_OVERRIDES || {};
    existingCharWikiNames = existingContent.CHAR_WIKI_NAMES || {};
  } catch {
    console.log('No existing data file found, creating new one.');
  }

  // 生成 items 的 TypeScript 行（保留现有数据）
  const itemLines = Object.entries(existingItems).map(([key, item]) => {
    const typeStr = JSON.stringify(item);
    return `    "${key}": ${typeStr},`;
  }).join('\n');

  // 建立角色 wiki 名称映射
  const charWikiNames = {};
  for (const [key, info] of Object.entries(CHARACTERS_TO_FETCH)) {
    charWikiNames[key] = info.wiki;
  }

  // 抓取角色
  const charData = await fetchAllCharacters();

  // 生成
  const ts = generateTypeScript(charData, {
    itemLines,
    evolutions: existingEvolutions,
    itemOverrides: existingItemOverrides,
    charWikiNames,
    items: existingItems,
  });

  writeFileSync(existingPath, ts, 'utf-8');
  console.log(`\nGenerated ${existingPath}`);
  console.log(`Characters: ${Object.keys(charData).length}`);
  console.log(`Items: ${Object.keys(existingItems).length}`);
  console.log(`Evolutions: ${existingEvolutions.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
