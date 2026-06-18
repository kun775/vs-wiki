#!/usr/bin/env node
/**
 * 角色数据抓取脚本
 * 从 vampire.survivors.wiki MediaWiki API 批量抓取角色数据
 * 生成 char-data.json
 *
 * 用法: node scripts/scrape-characters.mjs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const API = 'https://vampire.survivors.wiki/api.php';

// 所有角色 wiki 页面名
const ALL_CHARACTERS = [
  // === 本体 标准 ===
  { key: 'antonio', wiki: 'Antonio_Belpaese', cat: 'base' },
  { key: 'imelda', wiki: 'Imelda_Belpaese', cat: 'base' },
  { key: 'pasqualina', wiki: 'Pasqualina_Belpaese', cat: 'base' },
  { key: 'gennaro', wiki: 'Gennaro_Belpaese', cat: 'base' },
  { key: 'arca', wiki: 'Arca_Ladonna', cat: 'base' },
  { key: 'porta', wiki: 'Porta_Ladonna', cat: 'base' },
  { key: 'lama', wiki: 'Lama_Ladonna', cat: 'base' },
  { key: 'poe', wiki: 'Poe_Ratcho', cat: 'base' },
  { key: 'clerici', wiki: 'Suor_Clerici', cat: 'base' },
  { key: 'dommario', wiki: 'Dommario', cat: 'base' },
  { key: 'krochi', wiki: 'Krochi_Freetto', cat: 'base' },
  { key: 'christine', wiki: 'Christine_Davain', cat: 'base' },
  { key: 'pugnala', wiki: 'Pugnala_Provola', cat: 'base' },
  { key: 'giovanna', wiki: 'Giovanna_Grana', cat: 'base' },
  { key: 'poppea', wiki: 'Poppea_Pecorina', cat: 'base' },
  { key: 'concetta', wiki: 'Concetta_Caciotta', cat: 'base' },
  { key: 'mortaccio', wiki: 'Mortaccio', cat: 'base' },
  { key: 'yatta', wiki: 'Yatta_Cavallo', cat: 'base' },
  { key: 'bianca', wiki: 'Bianca_Ramba', cat: 'base' },
  { key: 'osole', wiki: "O'Sole_Meeo", cat: 'base' },
  { key: 'ambrojoe', wiki: 'Sir_Ambrojoe', cat: 'base' },
  { key: 'gallo', wiki: 'Iguana_Gallo_Valletto', cat: 'base' },
  { key: 'divano', wiki: 'Divano_Thelma', cat: 'base' },
  { key: 'ziassunta', wiki: "Zi'Assunta_Belpaese", cat: 'base' },
  { key: 'sigma', wiki: 'Queen_Sigma', cat: 'base' },
  { key: 'bat_robbert', wiki: 'Bat_Robbert', cat: 'base' },
  { key: 'ziappunta', wiki: "Zi'Appunta_Belpaese", cat: 'base' },
  { key: 'big_troubler', wiki: 'Big_Troubler', cat: 'base' },
  { key: 'she_moon', wiki: 'She-Moon_Eeta', cat: 'base' },
  { key: 'para_kooleo', wiki: 'Para_Kooleo', cat: 'base' },
  { key: 'santa_ladonna', wiki: 'Santa_Ladonna', cat: 'base' },
  { key: 'gazebo', wiki: 'Gazebo', cat: 'base' },
  { key: 'chula_reh', wiki: 'Chula-Reh', cat: 'base' },
  { key: 'space_dude', wiki: 'Space_Dude', cat: 'base' },
  // === 本体 秘密 ===
  { key: 'exdash', wiki: 'Exdash_Exiviiq', cat: 'base' },
  { key: 'toastie', wiki: 'Toastie', cat: 'base' },
  { key: 'smith', wiki: 'Smith_IV', cat: 'base' },
  { key: 'random', wiki: 'Random', cat: 'base' },
  { key: 'boon', wiki: 'Boon_Marrabbio', cat: 'base' },
  { key: 'avatar', wiki: 'Avatar_Infernas', cat: 'base' },
  { key: 'minnah', wiki: 'Minnah_Mannarah', cat: 'base' },
  { key: 'leda', wiki: 'Leda', cat: 'base' },
  { key: 'cosmo', wiki: 'Cosmo_Pavone', cat: 'base' },
  { key: 'peppino', wiki: 'Peppino', cat: 'base' },
  { key: 'big_trouser', wiki: 'Big_Trouser', cat: 'base' },
  { key: 'missingno', wiki: 'MissingN%E2%96%AF', cat: 'base' },
  { key: 'gains', wiki: 'Gains_Boros', cat: 'base' },
  { key: 'gyorunton', wiki: 'Gyorunton', cat: 'base' },
  { key: 'red_death', wiki: 'Mask_of_the_Red_Death', cat: 'base' },
  { key: 'bats', wiki: 'Bats_Bats_Bats', cat: 'base' },
  { key: 'rose', wiki: 'Rose_De_Infernas', cat: 'base' },
  { key: 'torino', wiki: 'Torino', cat: 'base' },
  { key: 'scorej', wiki: 'Scorej-Oni', cat: 'base' },
  { key: 'gyoruntin', wiki: 'Gyoruntin', cat: 'base' },
  { key: 'secretino', wiki: 'Secretino_Dagsson', cat: 'base' },
  { key: 'space_dette', wiki: 'Space_Dette', cat: 'base' },
  // === 月咒山 ===
  { key: 'miang', wiki: 'Miang_Moonspell', cat: 'moonspell' },
  { key: 'menya', wiki: 'Menya_Moonspell', cat: 'moonspell' },
  { key: 'syuuto', wiki: 'Syuuto_Moonspell', cat: 'moonspell' },
  { key: 'babi_onna', wiki: 'Babi-Onna', cat: 'moonspell' },
  { key: 'mccoy_oni', wiki: 'McCoy-Oni', cat: 'moonspell' },
  { key: 'megalo_menya', wiki: 'Megalo_Menya_Moonspell', cat: 'moonspell' },
  { key: 'megalo_syuuto', wiki: 'Megalo_Syuuto_Moonspell', cat: 'moonspell' },
  { key: 'gavet_oni', wiki: "Gav'Et-Oni", cat: 'moonspell' },
  // === 福斯卡里 ===
  { key: 'eleanor', wiki: 'Eleanor_Uziron', cat: 'foscari' },
  { key: 'maruto', wiki: 'Maruto_Cuts', cat: 'foscari' },
  { key: 'keitha', wiki: 'Keitha_Muort', cat: 'foscari' },
  { key: 'luminaire', wiki: 'Luminaire_Foscari', cat: 'foscari' },
  { key: 'genevieve', wiki: 'Genevieve_Gruy%C3%A8re', cat: 'foscari' },
  { key: 'je_ne_viv', wiki: 'Je-Ne-Viv', cat: 'foscari' },
  { key: 'sammy', wiki: 'Sammy', cat: 'foscari' },
  { key: 'rottin_ghoul', wiki: "Rottin'Ghoul", cat: 'foscari' },
  // === Among Us ===
  { key: 'crewmate', wiki: 'Crewmate_Dino', cat: 'amongus' },
  { key: 'engineer', wiki: 'Engineer_Gino', cat: 'amongus' },
  { key: 'ghost_lino', wiki: 'Ghost_Lino', cat: 'amongus' },
  { key: 'shapeshifter', wiki: 'Shapeshifter_Nino', cat: 'amongus' },
  { key: 'guardian', wiki: 'Guardian_Pina', cat: 'amongus' },
  { key: 'impostor', wiki: 'Impostor_Rina', cat: 'amongus' },
  { key: 'scientist', wiki: 'Scientist_Mina', cat: 'amongus' },
  { key: 'horse', wiki: 'Horse', cat: 'amongus' },
  { key: 'megalo_impostor', wiki: 'Megalo_Impostor_Rina', cat: 'amongus' },
  // === 魂斗罗 ===
  { key: 'bill', wiki: 'Bill_Rizer', cat: 'contra' },
  { key: 'lance', wiki: 'Lance_Bean', cat: 'contra' },
  { key: 'ariana', wiki: 'Ariana', cat: 'contra' },
  { key: 'lucia', wiki: 'Lucia_Zero', cat: 'contra' },
  { key: 'brad', wiki: 'Brad_Fang', cat: 'contra' },
  { key: 'browny', wiki: 'Browny', cat: 'contra' },
  { key: 'sheena', wiki: 'Sheena_Etranzi', cat: 'contra' },
  { key: 'probotector', wiki: 'Probotector', cat: 'contra' },
  { key: 'stanley', wiki: 'Stanley', cat: 'contra' },
  { key: 'newt', wiki: 'Newt_Plissken', cat: 'contra' },
  { key: 'bahamut', wiki: 'Colonel_Bahamut', cat: 'contra' },
  { key: 'simondo', wiki: 'Simondo_Belmont', cat: 'contra' },
  // === 恶魔城 可见 ===
  { key: 'leon', wiki: 'Leon_Belmont', cat: 'castlevania' },
  { key: 'sonia', wiki: 'Sonia_Belmont', cat: 'castlevania' },
  { key: 'trevor', wiki: 'Trevor_Belmont', cat: 'castlevania' },
  { key: 'christopher', wiki: 'Christopher_Belmont', cat: 'castlevania' },
  { key: 'simon', wiki: 'Simon_Belmont', cat: 'castlevania' },
  { key: 'juste', wiki: 'Juste_Belmont', cat: 'castlevania' },
  { key: 'richter', wiki: 'Richter_Belmont', cat: 'castlevania' },
  { key: 'julius', wiki: 'Julius_Belmont', cat: 'castlevania' },
  { key: 'grant', wiki: 'Grant_Danasty', cat: 'castlevania' },
  { key: 'john_morris', wiki: 'John_Morris', cat: 'castlevania' },
  { key: 'jonathan', wiki: 'Jonathan_Morris', cat: 'castlevania' },
  { key: 'soma', wiki: 'Soma_Cruz', cat: 'castlevania' },
  { key: 'charlotte', wiki: 'Charlotte_Aulin', cat: 'castlevania' },
  { key: 'sypha', wiki: 'Sypha_Belnades', cat: 'castlevania' },
  { key: 'yoko', wiki: 'Yoko_Belnades', cat: 'castlevania' },
  { key: 'alucard', wiki: 'Alucard', cat: 'castlevania' },
  { key: 'eric', wiki: 'Eric_Lecarde', cat: 'castlevania' },
  { key: 'hector', wiki: 'Hector', cat: 'castlevania' },
  { key: 'maria', wiki: 'Maria_Renard', cat: 'castlevania' },
  { key: 'shanoa', wiki: 'Shanoa', cat: 'castlevania' },
  // === 恶魔城 隐藏 ===
  { key: 'quincy', wiki: 'Quincy_Morris', cat: 'castlevania' },
  { key: 'maxim', wiki: 'Maxim_Kischine', cat: 'castlevania' },
  { key: 'henry', wiki: 'Henry', cat: 'castlevania' },
  { key: 'dracula', wiki: 'Vlad_Tepes_Dracula', cat: 'castlevania' },
  { key: 'julia', wiki: 'Julia_Laforeze', cat: 'castlevania' },
  { key: 'carrie', wiki: 'Carrie_Fernandez', cat: 'castlevania' },
  { key: 'rinaldo', wiki: 'Rinaldo_Gandolfi', cat: 'castlevania' },
  { key: 'mina', wiki: 'Mina_Hakuba', cat: 'castlevania' },
  { key: 'elizabeth', wiki: 'Elizabeth_Bartley', cat: 'castlevania' },
  { key: 'reinhardt', wiki: 'Reinhardt_Schneider', cat: 'castlevania' },
  { key: 'isaac', wiki: 'Isaac', cat: 'castlevania' },
  { key: 'sara', wiki: 'Sara_Trantoul', cat: 'castlevania' },
  { key: 'vincent', wiki: 'Vincent_Dorin', cat: 'castlevania' },
  { key: 'albus', wiki: 'Albus', cat: 'castlevania' },
  { key: 'lisa', wiki: 'Lisa_Tepes', cat: 'castlevania' },
  { key: 'shaft', wiki: 'Shaft', cat: 'castlevania' },
  { key: 'saint_germain', wiki: 'Saint_Germain', cat: 'castlevania' },
  { key: 'nathan', wiki: 'Nathan_Graves', cat: 'castlevania' },
  { key: 'cornell', wiki: 'Cornell', cat: 'castlevania' },
  { key: 'barlowe', wiki: 'Barlowe', cat: 'castlevania' },
  // === 翡翠幻境 (Emerald Diorama) ===
  { key: 'tsunanori', wiki: 'Tsunanori_Mido', cat: 'emerald_diorama' },
  { key: 'bonnie', wiki: 'Bonnie_Blair', cat: 'emerald_diorama' },
  { key: 'formina', wiki: 'Formina_Franklyn', cat: 'emerald_diorama' },
  { key: 'diva5', wiki: 'Diva_No._5', cat: 'emerald_diorama' },
  { key: 'ameya', wiki: 'Ameya_Aisling', cat: 'emerald_diorama' },
  { key: 'siugnas', wiki: 'Siugnas', cat: 'emerald_diorama' },
  { key: 'final_emperor', wiki: 'Final_Emperor', cat: 'emerald_diorama' },
  { key: 'dolores', wiki: 'Dolores', cat: 'emerald_diorama' },
  { key: 'macha', wiki: 'Macha_Alter_Ego', cat: 'emerald_diorama' },
  { key: 'lita', wiki: 'Lita_Caryx', cat: 'emerald_diorama' },
  { key: 'kugutsu', wiki: 'Kugutsu', cat: 'emerald_diorama' },
  { key: 'mr_s', wiki: 'Mr._S', cat: 'emerald_diorama' },
  { key: 'lolo', wiki: 'Lolo,_Hiss,_Meow,_and_Purr', cat: 'emerald_diorama' },
  { key: 'kina', wiki: 'Kina', cat: 'emerald_diorama' },
  { key: 'imakoo', wiki: 'Imakoo', cat: 'emerald_diorama' },
  { key: 'door_spirit', wiki: 'Malevolent_Door_Spirit', cat: 'emerald_diorama' },
  // === 前厅 (Ante Chamber) ===
  { key: 'jimbo', wiki: 'Jimbo', cat: 'ante_chamber' },
  { key: 'canio', wiki: 'Canio', cat: 'ante_chamber' },
  { key: 'chicot', wiki: 'Chicot', cat: 'ante_chamber' },
  { key: 'perkeo', wiki: 'Perkeo', cat: 'ante_chamber' },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWikiRaw(wikiName) {
  const url = `${API}?action=parse&page=${encodeURIComponent(wikiName)}&prop=wikitext&format=json&formatversion=2`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.parse?.wikitext || null;
  } catch { return null; }
}

function extractInfo(wikitext) {
  const result = { name: '', weapon: '', unlock: '', passive: '', desc: '' };

  // 提取 name
  const nameM = wikitext.match(/\|name1?\s*=\s*(.+)/);
  if (nameM) result.name = nameM[1].replace(/\(Legacy\)/i, '').trim();

  // 提取 weapon
  const wepM = wikitext.match(/\|weapon\s*=\s*(.+)/);
  if (wepM) result.weapon = wepM[1].trim();

  // 提取 unlock
  const unlM = wikitext.match(/\|unlock\s*=\s*(.+)/);
  if (unlM) result.unlock = unlM[1].trim();

  // 提取 description
  const descM = wikitext.match(/\|description\s*=\s*(.+)/);
  if (descM) result.desc = descM[1].trim();

  // 提取被动描述
  const afterInfobox = wikitext.replace(/\{\{Infobox[\s\S]*?\}\}/, '');
  const passM = afterInfobox.match(/==Passive bonuses==\s*\n([\s\S]*?)(?:\n==|$)/);
  if (passM) {
    const lines = passM[1].split('\n').filter(l => l.trim() && !l.startsWith('{') && !l.startsWith('|'));
    result.passive = lines.slice(0, 4).join(' ').replace(/'''/g, '').replace(/\{\{.*?\}\}/g, '').replace(/\s+/g, ' ').trim();
  }
  if (!result.passive && result.desc) result.passive = result.desc;

  return result;
}

// 武器名称→key映射
const WEAPON_MAP = {
  'Whip': 'whip', 'Magic Wand': 'magic_wand', 'Knife': 'knife', 'Axe': 'axe',
  'Cross': 'cross', 'King Bible': 'king_bible', 'Fire Wand': 'fire_wand',
  'Garlic': 'garlic', 'Santa Water': 'santa_water', 'Lightning Ring': 'lightning_ring',
  'Pentagram': 'pentagram', 'Runetracer': 'runetracer', 'Peachone': 'peachone',
  'Ebony Wings': 'ebony_wings', 'Gatti Amari': 'gatti_amari', 'Song of Mana': 'song_of_mana',
  'Shadow Pinion': 'shadow_pinion', 'Clock Lancet': 'clock_lancet', 'Laurel': 'laurel',
  'Vento Sacro': 'vento_sacro', 'Bone': 'bone', 'Cherry Bomb': 'cherry_bomb',
  "Carréllo": 'carrello', 'Celestial Dusting': 'celestial_dusting',
  'La Robba': 'la_robba', 'Greatest Jubilee': 'greatest_jubilee',
  'Bracelet': 'bracelet', 'Candybox': 'candybox', 'Victory Sword': 'victory_sword',
  'Flames of Misspell': 'flames_of_misspell',
  'Silver Wind': 'silver_wind', 'Four Seasons': 'four_seasons',
  'Summon Night': 'summon_night', 'Mirage Robe': 'mirage_robe',
  'Night Sword': 'night_sword', 'Mille Bolle Blu': 'mille_bolle_blu',
  '108 Bocce': 'bocce_108',
  'SpellString': 'spellstring', 'SpellStream': 'spellstream', 'SpellStrike': 'spellstrike',
  'Eskizzibur': 'eskizzibur', 'Flash Arrow': 'flash_arrow',
  'Prismatic Missile': 'prismatic_missile', 'Shadow Servant': 'shadow_servant',
  'Party Popper': 'party_popper',
  'Report!': 'report', 'Lucky Swipe': 'lucky_swipe', 'Lifesign Scan': 'lifesign_scan',
  'Just Vent': 'just_vent', 'Clear Debris': 'clear_debris',
  'Sharp Tongue': 'sharp_tongue', 'Science Rocks': 'science_rocks', 'Hats': 'hats',
  'Long Gun': 'long_gun', 'Short Gun': 'short_gun', 'Spread Shot': 'spread_shot',
  'C-U-Laser': 'c_u_laser', 'Firearm': 'firearm', 'Sonic Bloom': 'sonic_bloom',
  'Homing Miss': 'homing_miss', 'Diver Mines': 'diver_mines',
  'Blade Crossbow': 'blade_crossbow', 'Prism Lass': 'prism_lass', 'Metal Claw': 'metal_claw',
  'Alchemy Whip': 'alchemy_whip', 'Wind Whip': 'wind_whip', 'Platinum Whip': 'platinum_whip',
  'Dragon Water Whip': 'dragon_water_whip', 'Sonic Whip': 'sonic_whip',
  'Jet Black Whip': 'jet_black_whip', 'Vibhuti Whip': 'vibhuti_whip',
  'Vanitas Whip': 'vanitas_whip', 'Shuriken': 'shuriken', 'Curved Knife': 'curved_knife',
  'Javelin': 'javelin', 'Discus': 'discus', 'Iron Ball': 'iron_ball',
  'Silver Revolver': 'silver_revolver', 'Hand Grenade': 'hand_grenade',
  'Wine Glass': 'wine_glass', 'Raging Fire': 'raging_fire', 'Ice Fang': 'ice_fang',
  'Gale Force': 'gale_force', 'Rock Riot': 'rock_riot', 'Fulgur': 'fulgur',
  'Keremet Bubbles': 'keremet_bubbles', 'Hex': 'hex', 'Refectio': 'refectio',
  'Mace': 'mace', 'Star Flail': 'star_flail', 'Alucard Spear': 'alucard_spear',
  'Trident': 'trident', 'Iron Shield': 'iron_shield', "Guardian's Targe": 'guardians_targe',
  'Tyrfing': 'tyrfing', 'Alucart Sworb': 'alucart_sworb', 'Confodere': 'confodere',
  'Globus': 'globus', 'Optical Shot': 'optical_shot',
  'Dextro Custos': 'dextro_custos', 'Sinestro Custos': 'sinestro_custos',
  'Centralis Custos': 'centralis_custos', 'Dominus Anger': 'dominus_anger',
  'Dominus Hatred': 'dominus_hatred', 'Dominus Agony': 'dominus_agony',
  'Sonic Dash': 'sonic_dash', 'Luminatio': 'luminatio', 'Umbra': 'umbra',
  'Endo Gears': 'endo_gears', 'Peri Pendulum': 'peri_pendulum', 'Myo Lift': 'myo_lift',
  'Epi Head': 'epi_head', 'Familiar Forge': 'familiar_forge',
};

function mapWeaponKey(weaponStr) {
  if (!weaponStr) return '';
  const first = weaponStr.split(';')[0].trim();
  // Try direct
  if (WEAPON_MAP[first]) return WEAPON_MAP[first];
  // Clean wiki links
  const clean = first.replace(/\[\[.*?\|(.+?)\]\]/g, '$1').replace(/\[\[|\]\]/g, '').trim();
  if (WEAPON_MAP[clean]) return WEAPON_MAP[clean];
  return clean.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

async function main() {
  console.log(`Scraping ${ALL_CHARACTERS.length} characters...`);

  // 1. Fetch all
  const results = {};
  const batchSize = 3;

  for (let i = 0; i < ALL_CHARACTERS.length; i += batchSize) {
    const batch = ALL_CHARACTERS.slice(i, i + batchSize);
    const promises = batch.map(async (ch) => {
      const wikitext = await fetchWikiRaw(ch.wiki);
      if (!wikitext) {
        console.error(`  FAIL ${ch.key}`);
        return [ch.key, null];
      }
      const info = extractInfo(wikitext);
      return [ch.key, { ...info, category: ch.cat, wiki: ch.wiki }];
    });

    const batchResults = await Promise.all(promises);
    for (const [key, data] of batchResults) {
      if (data) {
        results[key] = data;
        const progress = `[${Object.keys(results).length}/${ALL_CHARACTERS.length}]`;
        console.log(`  ${progress} OK ${key}: ${data.name || '?'}`);
      }
    }

    if (i + batchSize < ALL_CHARACTERS.length) await sleep(2000);
  }

  // 2. Generate JSON
  const charData = {};
  for (const [key, data] of Object.entries(results)) {
    charData[key] = {
      name: data.name || key,
      nameEn: data.name || key,
      category: data.category,
      initWeaponKey: mapWeaponKey(data.weapon),
      weaponRaw: data.weapon,
      passiveDesc: data.passive || '',
      unlock: data.unlock || '默认解锁',
      wikiPage: data.wiki,
    };
  }

  const outPath = join(PROJECT_ROOT, 'scripts', 'char-data.json');
  writeFileSync(outPath, JSON.stringify(charData, null, 2), 'utf-8');
  console.log(`\nSaved ${Object.keys(charData).length} characters to ${outPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
