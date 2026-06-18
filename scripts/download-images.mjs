#!/usr/bin/env node
/**
 * 图片自托管下载脚本
 * 从 vampire.survivors.wiki 下载所有物品图标和角色头像到 public/icons/ 和 public/characters/
 *
 * 用法: node scripts/download-images.mjs
 */

import { mkdirSync, existsSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const WIKI_IMG = 'https://vampire.survivors.wiki/images/';

// 从 vsData.ts 提取的物品 key -> wiki 名称映射
const ITEM_WIKI_OVERRIDES = {
  'no_future': 'NO_FUTURE',
  'spellstring': 'SpellString',
  'spellstream': 'SpellStream',
  'spellstrike': 'SpellStrike',
  'spellstrom': 'SpellStrom',
  'report': 'Report%21',
  'c_u_laser': 'C-Laser',
  'fire_l3gs': 'Fire-L3GS',
  'tiragisu': 'Tirajis%C3%BA',
  'flames_of_misspell': 'Flames_of_Misspell',
  'victory_sword': 'Victory_Sword',
  'glass_fandango': 'Glass_Fandango',
  'gatti_amari': 'Gatti_Amari',
  'song_of_mana': 'Song_of_Mana',
  'shadow_pinion': 'Shadow_Pinion',
  'clock_lancet': 'Clock_Lancet',
  'unjust_ejection': 'Unjust_Ejection',
  'clear_asteroids': 'Clear_Asteroids',
  'rocket_science': 'Rocket_Science',
  'impostongue': 'Impostongue',
  'prototype_a': 'Prototype_A',
  'prototype_b': 'Prototype_B',
  'prototype_c': 'Prototype_C',
  'pronto_beam': 'Pronto_Beam',
  'wave_beam': 'Wave_Beam',
  'multistage_missiles': 'Multistage_Missiles',
  'atmo_torpedo': 'Atmo-Torpedo',
  'bfc2000_ad': 'BFC2000-AD',
  'time_warp': 'Time_Warp',
  'big_fuzzy_fist': 'Big_Fuzzy_Fist',
  'alchemy_whip': 'Alchemy_Whip',
  'wind_whip': 'Wind_Whip',
  'platinum_whip': 'Platinum_Whip',
  'dragon_water_whip': 'Dragon_Water_Whip',
  'sonic_whip': 'Sonic_Whip',
  'jet_black_whip': 'Jet_Black_Whip',
  'vibhuti_whip': 'Vibhuti_Whip',
  'vanitas_whip': 'Vanitas_Whip',
  'curved_knife': 'Curved_Knife',
  'iron_ball': 'Iron_Ball',
  'silver_revolver': 'Silver_Revolver',
  'wine_glass': 'Wine_Glass',
  'raging_fire': 'Raging_Fire',
  'ice_fang': 'Ice_Fang',
  'gale_force': 'Gale_Force',
  'rock_riot': 'Rock_Riot',
  'keremet_bubbles': 'Keremet_Bubbles',
  'star_flail': 'Star_Flail',
  'alucard_spear': 'Alucard_Spear',
  'iron_shield': 'Iron_Shield',
  'guardians_targe': "Guardian's_Targe",
  'vampire_killer': 'Vampire_Killer',
  'hurricane_whip': 'Hurricane_Whip',
  'platinum_whip_ev': 'Platinum_Whip_Evolved',
  'dragon_water_whip_ev': 'Dragon_Water_Whip_Evolved',
  'nebula_whip': 'Nebula_Whip',
  'jet_black_whip_ev': 'Jet_Black_Whip_Evolved',
  'vibhuti_whip_ev': 'Vibhuti_Whip_Evolved',
  'vanitas_whip_ev': 'Vanitas_Whip_Evolved',
  'star_shuriken': 'Star_Shuriken',
  'curved_knife_ev': 'Curved_Knife_Evolved',
  'javelin_ev': 'Javelin_Evolved',
  'discus_ev': 'Discus_Evolved',
  'wrecking_ball': 'Wrecking_Ball',
  'gold_revolver': 'Gold_Revolver',
  'cluster_grenade': 'Cluster_Grenade',
  'wine_glass_ev': 'Wine_Glass_Evolved',
  'raging_fire_ev': 'Raging_Fire_Evolved',
  'ice_fang_ev': 'Ice_Fang_Evolved',
  'gale_force_ev': 'Gale_Force_Evolved',
  'rock_riot_ev': 'Rock_Riot_Evolved',
  'fulgur_ev': 'Fulgur_Evolved',
  'keremet_bubbles_ev': 'Keremet_Bubbles_Evolved',
  'hex_ev': 'Hex_Evolved',
  'refectio_ev': 'Refectio_Evolved',
  'mace_ev': 'Mace_Evolved',
  'star_flail_ev': 'Star_Flail_Evolved',
  'alucard_spear_ev': 'Alucard_Spear_Evolved',
  'trident_ev': 'Trident_Evolved',
  'iron_shield_ev': 'Iron_Shield_Evolved',
  'guardians_targe_ev': "Guardian's_Targe_Evolved",
  'tyrfing_ev': 'Tyrfing_Evolved',
  'parm_aegis': 'Parm_Aegis',
  'karomas_mana': "Karoma's_Mana",
  'stone_mask': 'Stone_Mask',
  'skull_omaniac': "Skull_O'Maniac",
  'torronas_box': "Torrona's_Box",
  'silver_ring': 'Silver_Ring',
  'gold_ring': 'Gold_Ring',
  'left_metaglio': 'Metaglio_Left',
  'right_metaglio': 'Metaglio_Right',
  'mini_crewmate': 'Mini_Crewmate',
  'mini_engineer': 'Mini_Engineer',
  'mini_ghost': 'Mini_Ghost',
  'mini_impostor': 'Mini_Impostor',
  'mini_guardian': 'Mini_Guardian',
  'mini_scientist': 'Mini_Scientist',
  'mini_shapeshifter': 'Mini_Shapeshifter',
};

const CHAR_WIKI_NAMES = {
  'antonio': 'Antonio_Belpaese',
  'imelda': 'Imelda_Belpaese',
  'pasqualina': 'Pasqualina_Belpaese',
  'gennaro': 'Gennaro_Belpaese',
  'poe': 'Poe_Ratcho',
  'suor_clerici': 'Suor_Clerici',
  'porta': 'Porta_Ladonna',
  'arca': 'Arca_Ladonna',
  'krochi': 'Krochi_Freetto',
  'christine': 'Christine_Davain',
  'miang': 'Miang_Moonspell',
  'menya': 'Menya_Moonspell',
  'syuuto': 'Syuuto_Moonspell',
  'eleanor': 'Eleanor_Uziron',
  'maruto': 'Maruto_Cuts',
  'keitha': 'Keitha_Muort',
  'crewmate': 'Crewmate_Dino',
  'impostor': 'Impostor_Rina',
  'bill': 'Bill_Rizer',
  'lance': 'Lance_Bean',
  'simon': 'Simon_Belmont',
  'alucard': 'Alucard',
};

function getWikiName(key) {
  const override = ITEM_WIKI_OVERRIDES[key];
  return override || key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
}

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    return 'skip';
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return `fail:${res.status}`;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buf);
    return 'ok';
  } catch (err) {
    return `error:${err.message}`;
  }
}

async function main() {
  const iconsDir = join(PROJECT_ROOT, 'public', 'icons');
  const charsDir = join(PROJECT_ROOT, 'public', 'characters');
  mkdirSync(iconsDir, { recursive: true });
  mkdirSync(charsDir, { recursive: true });

  // 动态导入 vsData 获取所有 key
  const { VS_DATA } = await import(join(PROJECT_ROOT, 'src', 'data', 'vsData.ts'));

  const itemKeys = Object.keys(VS_DATA.items);
  const charKeys = Object.keys(VS_DATA.characters);

  console.log(`Downloading ${itemKeys.length} item icons and ${charKeys.length} character portraits...`);

  let okCount = 0, skipCount = 0, failCount = 0;

  // 下载物品图标
  for (const key of itemKeys) {
    const wikiName = getWikiName(key);
    const url = `${WIKI_IMG}Icon-${wikiName}.png`;
    const dest = join(iconsDir, `${key}.png`);
    const result = await downloadFile(url, dest);
    if (result === 'ok') okCount++;
    else if (result === 'skip') skipCount++;
    else { failCount++; console.error(`  FAIL item ${key}: ${result}`); }
  }

  // 下载角色头像
  for (const key of charKeys) {
    const wikiName = CHAR_WIKI_NAMES[key];
    if (!wikiName) { failCount++; console.error(`  SKIP char ${key}: no wiki name`); continue; }
    const url = `${WIKI_IMG}Select-${wikiName}.png`;
    const dest = join(charsDir, `${key}.png`);
    const result = await downloadFile(url, dest);
    if (result === 'ok') okCount++;
    else if (result === 'skip') skipCount++;
    else { failCount++; console.error(`  FAIL char ${key}: ${result}`); }
  }

  console.log(`\nDone: ${okCount} downloaded, ${skipCount} skipped, ${failCount} failed`);
  console.log(`Icons: ${iconsDir}`);
  console.log(`Characters: ${charsDir}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
