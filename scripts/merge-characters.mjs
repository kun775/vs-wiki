#!/usr/bin/env node
/**
 * 角色数据合并脚本
 * 将 scraped char-data.json 合并到 src/data/vsData.ts 中
 * 
 * 用法: node scripts/merge-characters.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// 角色中文名映射
const CHAR_NAMES_ZH = {
  'antonio': '安东尼奥', 'imelda': '伊梅尔达', 'pasqualina': '帕斯夸丽娜',
  'gennaro': '詹纳罗', 'arca': '阿尔卡', 'porta': '波尔塔',
  'lama': '拉玛', 'poe': '坡', 'clerici': '克莱里奇',
  'dommario': '多姆马里奥', 'krochi': '克罗齐', 'christine': '克里斯汀',
  'pugnala': '普格纳拉', 'giovanna': '乔凡娜', 'poppea': '波佩娅',
  'concetta': '康切塔', 'mortaccio': '莫塔乔', 'yatta': '亚塔',
  'bianca': '比安卡', 'osole': '欧索雷', 'ambrojoe': '安布罗乔爵士',
  'gallo': '加洛', 'divano': '迪瓦诺', 'ziassunta': '齐亚桑塔',
  'sigma': '西格玛女王', 'bat_robbert': '蝙蝠罗伯特', 'ziappunta': '齐亚普塔',
  'big_troubler': '大麻烦', 'she_moon': '月亮她', 'para_kooleo': '帕拉库利奥',
  'santa_ladonna': '圣诞拉多娜', 'gazebo': '凉亭', 'chula_reh': '库拉雷',
  'space_dude': '太空小子',
  'exdash': 'Exdash', 'toastie': 'Toastie', 'smith': '史密斯四世',
  'random': '随机', 'boon': '布恩', 'avatar': '阿凡达',
  'minnah': '明娜', 'leda': '莱达', 'cosmo': '科斯莫',
  'peppino': '佩皮诺', 'big_trouser': '大裤子', 'missingno': 'MissingNo',
  'gains': '甘斯', 'gyorunton': '乔伦顿', 'red_death': '红死面具',
  'bats': '蝙蝠群', 'rose': '罗斯', 'torino': '托里诺',
  'scorej': '计分鬼', 'gyoruntin': '乔伦汀', 'secretino': '秘密鬼',
  'space_dette': '太空女郎',
  'miang': '美庵', 'menya': '门屋', 'syuuto': '修图',
  'babi_onna': '芭比女', 'mccoy_oni': '麦考伊鬼',
  'megalo_menya': '巨大门屋', 'megalo_syuuto': '巨大修图', 'gavet_oni': '加维特鬼',
  'eleanor': '埃莉诺', 'maruto': '马鲁托', 'keitha': '凯莎',
  'luminaire': '光明使', 'genevieve': '吉纳维芙', 'je_ne_viv': 'Je-Ne-Viv',
  'sammy': '萨米', 'rottin_ghoul': '腐烂食尸鬼',
  'crewmate': '船员', 'engineer': '工程师', 'ghost_lino': '幽灵',
  'shapeshifter': '变形者', 'guardian': '守护者', 'impostor': '内鬼',
  'scientist': '科学家', 'horse': '马', 'megalo_impostor': '巨大内鬼',
  'bill': '比尔·雷泽', 'lance': '兰斯·比恩', 'ariana': '阿丽亚娜',
  'lucia': '露西亚', 'brad': '布拉德', 'browny': '布朗尼',
  'sheena': '希娜', 'probotector': '机器人', 'stanley': '斯坦利',
  'newt': '纽特', 'bahamut': '巴哈姆特', 'simondo': '西蒙多',
  'leon': '里昂', 'sonia': '索尼娅', 'trevor': '特雷弗',
  'christopher': '克里斯托弗', 'simon': '西蒙', 'juste': '朱斯特',
  'richter': '里希特', 'julius': '尤里乌斯', 'grant': '格兰特',
  'john_morris': '约翰·莫里斯', 'jonathan': '乔纳森', 'soma': '苍真',
  'charlotte': '夏洛特', 'sypha': '赛法', 'yoko': '洋子',
  'alucard': '阿鲁卡多', 'eric': '艾里克', 'hector': '赫克托',
  'maria': '玛丽亚', 'shanoa': '夏诺雅',
  'quincy': '昆西', 'maxim': '马克西姆', 'henry': '亨利',
  'dracula': '德古拉', 'julia': '茱莉亚', 'carrie': '卡丽',
  'rinaldo': '里纳尔多', 'mina': '美奈', 'elizabeth': '伊丽莎白',
  'reinhardt': '莱因哈特', 'isaac': '艾萨克', 'sara': '莎拉',
  'vincent': '文森特', 'albus': '阿尔布斯', 'lisa': '丽莎',
  'shaft': '夏福特', 'saint_germain': '圣日耳曼', 'nathan': '内森',
  'cornell': '康奈尔', 'barlowe': '巴洛',
  'tsunanori': '纲纪', 'bonnie': '邦妮', 'formina': '福米娜',
  'diva5': '歌姬5号', 'ameya': '阿美亚', 'siugnas': '修格纳斯',
  'final_emperor': '最终皇帝', 'dolores': '多洛雷斯', 'macha': '玛卡',
  'lita': '莉塔', 'kugutsu': '傀儡', 'mr_s': 'S先生',
  'lolo': '洛洛小队', 'kina': '基娜', 'imakoo': '伊玛库',
  'door_spirit': '门灵',
  'jimbo': '金波', 'canio': '卡尼奥', 'chicot': '奇科特', 'perkeo': '珀尔克',
};

// 角色图标映射 (使用通用emoji作为fallback)
function getIcon(cat, key) {
  const icons = {
    base: '⚔️', moonspell: '🌙', foscari: '🌊', amongus: '🚀',
    contra: '🔫', castlevania: '🏰', emerald_diorama: '💎', ante_chamber: '🎭',
  };
  return icons[cat] || '👤';
}

function escapeStr(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function main() {
  const charDataPath = join(PROJECT_ROOT, 'scripts', 'char-data.json');
  const vsDataPath = join(PROJECT_ROOT, 'src', 'data', 'vsData.ts');

  const charData = JSON.parse(readFileSync(charDataPath, 'utf-8'));
  let vsContent = readFileSync(vsDataPath, 'utf-8');

  // 生成角色 TypeScript 条目
  const charLines = [];
  for (const [key, data] of Object.entries(charData)) {
    const zhName = CHAR_NAMES_ZH[key] || data.name || key;
    const enName = data.nameEn || data.name || key;
    const cat = data.category || 'base';
    const icon = getIcon(cat, key);
    const weapon = data.initWeaponKey || '';
    const passive = escapeStr(data.passiveDesc || '');
    const unlock = escapeStr(data.unlock || '默认解锁');

    charLines.push(
      `        "${key}": {\n` +
      `          name: "${escapeStr(zhName)}",\n` +
      `          nameEn: "${escapeStr(enName)}",\n` +
      `          icon: "${icon}",\n` +
      `          category: "${cat}",\n` +
      `          initWeaponKey: "${weapon}",\n` +
      `          passiveDesc: "${passive}",\n` +
      `          unlock: "${unlock}",\n` +
      `          recommends: []\n` +
      `        },`
    );
  }

  const newCharSection = `      // 角色数据库 (${charLines.length} 个角色)\n      characters: {\n${charLines.join('\n')}\n      }`;

  // 替换角色部分
  // 匹配从 "characters: {" 到对应的 "}" 
  const charStartIdx = vsContent.lastIndexOf('characters: {');
  if (charStartIdx === -1) {
    console.error('Cannot find characters section in vsData.ts');
    process.exit(1);
  }

  // 找到对应的闭合大括号
  let depth = 0;
  let charEndIdx = -1;
  for (let i = charStartIdx; i < vsContent.length; i++) {
    if (vsContent[i] === '{') depth++;
    if (vsContent[i] === '}') {
      depth--;
      if (depth === 0) {
        charEndIdx = i + 1;
        break;
      }
    }
  }

  if (charEndIdx === -1) {
    console.error('Cannot find end of characters section');
    process.exit(1);
  }

  // 替换
  vsContent = vsContent.slice(0, charStartIdx) + newCharSection + vsContent.slice(charEndIdx);

  // 更新 CHAR_WIKI_NAMES 部分
  const wikiNamesLines = [];
  for (const [key, data] of Object.entries(charData)) {
    wikiNamesLines.push(`  '${key}': "${escapeStr(data.wikiPage || '')}",`);
  }

  const wikiNamesSection = `const CHAR_WIKI_NAMES: Record<string, string> = {\n${wikiNamesLines.join('\n')}\n};`;

  // 替换旧的 CHAR_WIKI_NAMES
  const oldWikiStart = vsContent.indexOf('const CHAR_WIKI_NAMES');
  if (oldWikiStart !== -1) {
    let oldWikiEnd = vsContent.indexOf('\nconst ', oldWikiStart + 10);
    if (oldWikiEnd === -1) oldWikiEnd = vsContent.indexOf('\n//', oldWikiStart + 10);
    if (oldWikiEnd === -1) oldWikiEnd = vsContent.indexOf('\n(', oldWikiStart + 10);
    if (oldWikiEnd === -1) oldWikiEnd = vsContent.length;
    vsContent = vsContent.slice(0, oldWikiStart) + wikiNamesSection + '\n' + vsContent.slice(oldWikiEnd);
  }

  writeFileSync(vsDataPath, vsContent, 'utf-8');
  console.log(`Updated ${vsDataPath}`);
  console.log(`Characters: ${charLines.length}`);
}

main();
