// 翻译 vsData.ts 中角色的 passiveDesc 和 unlock 字段为中文
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DATA_PATH = join(PROJECT_ROOT, 'src', 'data', 'vsData.ts');

let vsData = readFileSync(DATA_PATH, 'utf8');

// --- 物品名称映射 (key → Chinese name) ---
// 从 vsData.ts 自动提取
const itemNameMap = {};
const itemRegex = /"(\w+)":\s*\{\s*name:\s*"([^"]+)"/g;
let m;
while ((m = itemRegex.exec(vsData)) !== null) {
  itemNameMap[m[1]] = m[2];
}

// --- 分类名映射 ---
const categoryMap = {
  base: '本体',
  moonspell: '月咒山',
  foscari: '福斯卡里',
  amongus: 'Among Us 联动',
  contra: '魂斗罗联动',
  castlevania: '恶魔城联动',
  emerald_diorama: '翡翠幻境',
  ante_chamber: '前厅',
};

// --- 统计/属性名映射 ---
const statMap = {
  'Might': '力量',
  'Growth': '成长',
  'Greed': '贪婪',
  'Curse': '诅咒',
  'MoveSpeed': '移速',
  'Magnet': '磁铁',
  'Luck': '运气',
  'Armor': '护甲',
  'Recovery': '回复',
  'Max Health': '最大生命',
  'HP': '生命值',
  'Cooldown': '冷却',
  'Area': '范围',
  'Duration': '持续',
  'Speed': '速度',
  'Amount': '数量',
  'Projectile Speed': '弹速',
  'Revival': '复活',
  'Reroll': '重掷',
  'Skip': '跳过',
  'Banish': '放逐',
  'Charm': '魅力',
  'Magnet Bonus': '磁铁加成',
  'Pierce': '穿透',
  'Defang': '去牙',
  'Porta': '波尔塔',
};

// --- 通用短语替换 ---
const phraseReplacements = [
  // ===== 清理 wiki 表格残留 =====
  [/\s*The following table shows how much (\w[\w\s]*?) (?:she |he |it )?gains by level:?\s*!Levels?!\w+[\s\S]*?$/g, ''],
  [/\s*The following table shows how much (\w[\w\s]*?) (?:she |he |it )?gains by level:?\s*!Levels?[\s\S]*?$/g, ''],
  [/\s*The maximum stats gained this way[\s\S]*?\bLevel\b[\s\S]*?$/g, ''],
  [/\.\s*The\s+following table[\s\S]*?$/g, '。'],

  // ===== 代词清理 =====
  [/\bHe\b/g, '他'],
  [/\bShe\b/g, '她'],
  [/\bIt\b(?=\s+gains|\s+also|\s+starts)/g, '他'],
  [/\bThey\b(?=\s+gain|\s+start|\s+also)/g, '他'],

  // ===== starts with (初始属性) =====
  [/(?:also\s+)?starts?\s+with\s+[-+]?(\d+)(%?\s*)(\w[\w\s]*?)(?:\s*,|\s*\.|\s*$|\s+and|\s*，)/g,
    (m, v, pct, stat) => {
      const s = statMap[stat.trim()] || stat.trim();
      return m.startsWith('also') ? `同时初始 +${v}${pct}${s}，`
        : `初始 +${v}${pct}${s}，`;
    }],
  [/初始\s+拥有\s+(?:with\s+)?/g, '初始拥有 '],
  [/初始\s+拥有\s+(?:a\s+)?hidden weapon akin to/g, '初始拥有隐藏武器（类似'],
  [/(?:also\s+)?start\s+with\b/gi, '初始拥有'],

  // ===== gains (成长属性) =====
  [/gains?\s+\+(\d+)%\s+(\w[\w\s]*?)\s+every\s+(\d+)\s+levels?\s+until\s+level\s+(\d+)/gi,
    '每$3级获得 +$1% $2，至$4级为止'],
  [/gains?\s+\+(\d+)%\s+(\w[\w\s]*?)\s+every\s+(\d+)\s+levels?/gi,
    '每$3级获得 +$1% $2'],
  [/gains?\s+\+(\d+)\s+(\w[\w\s]*?)\s+every\s+(\d+)\s+levels?\s+until\s+level\s+(\d+)/gi,
    '每$3级获得 +$1 $2，至$4级为止'],
  [/gains?\s+\+(\d+)\s+(\w[\w\s]*?)\s+every\s+(\d+)\s+levels?/gi,
    '每$3级获得 +$1 $2'],
  [/gains?\s+\+(\d+)%\s+(\w[\w\s]*?)\s+every\s+level/gi,
    '每级获得 +$1% $2'],
  [/gains?\s+\+(\d+)\s+(\w[\w\s]*?)\s+every\s+level/gi,
    '每级获得 +$1 $2'],
  [/gains?\s+-(\d+)%\s+(\w[\w\s]*?)\s+every\s+(\d+)\s+levels?\s+until\s+level\s+(\d+)/gi,
    '每$3级减少 $1% $2，至$4级为止'],
  [/gains?\s+-(\d+)%\s+(\w[\w\s]*?)\s+every\s+level/gi,
    '每级减少 $1% $2'],
  [/gains?\s+\+(\d+)\s+(\w[\w\s]*?)\s+at\s+level\s+(\d+)/gi,
    '在第$3级获得 +$1 $2'],
  [/gains?\s+(\w[\w\s]*?)\s+every\s+level/gi, '每级获得 $1'],

  // ===== 最高/上限 =====
  [/The maximum (\w[\w\s]*?) gained this way is \+(\d+)%?/gi,
    '通过此方式获得的最高$1为 +$2%'],
  [/The maximum (\w[\w\s]*?) gained this way is -(\d+)%/gi,
    '通过此方式获得的最高$1减免为 -$2%'],
  [/There is no cap on (?:the\s+)?(\w[\w\s]*)\.?/gi, '$1无上限。'],
  [/There is no cap on (?:the\s+)?(\w+)\./gi, '$1无上限。'],
  [/up to \+(\d+)(\s*\w+)?/gi, '最高 +$1$2'],
  [/up to \+(\d+)%/g, '最高 +$1%'],

  // ===== 额外/同时 =====
  [/Additionally,?\s*/gi, '此外，'],
  [/also\s+/gi, '同时'],
  [/and as well as/gi, '与'],

  // ===== 归零/衰减 (MUST come before generic level replacements) =====
  [/until the bonus is entirely gone at level (\d+)/gi, '至第$1级加成全部归零'],
  [/until the starting bonus is entirely gone(?: at level (\d+))?/gi, (m, lv) => lv ? `至第${lv}级初始加成全部归零` : '至加成完全归零'],
  [/until the bonus is entirely gone(?: at level (\d+))?/gi, (m, lv) => lv ? `至第${lv}级此加成完全归零` : '至此加成完全归零'],
  [/is entirely gone/gi, '完全归零'],
  [/however,?\s*the bonus depreciates by (\d+)%?\s*each level,?\s*/gi, '但加成每级衰减$1%，'],
  [/but\s+the\s+bonus\s+depreciates\s+by\s+(\d+)%\s+each\s+level/gi, '但加成每级衰减$1%'],
  [/the\s+bonus\s+depreciates\s+by\s+(\d+)%\s+each\s+level/gi, '加成每级衰减$1%'],

  // ===== 每级/等级 (generic - must come AFTER specific patterns above) =====
  [/level\s+(\d+)/gi, '第$1级'],
  [/every\s+(\d+)\s+levels?/gi, '每$1级'],
  [/per\s+level/gi, '每级'],
  [/on\s+levels\s+([\d,\s]+)/gi, '在第$1级'],

  // ===== 获得加成/基础属性 =====
  [/receives?\s+a?\s+(\w[\w\s]*?)\s+bonus/gi, '获得$1加成'],
  [/receives?\s+bonus(?:es)?\s+to\s+(\w[\w\s]*)/gi, '获得$1加成'],
  [/receives?\s+\+(\d+)%\s+(\w+)\s+bonus/gi, '获得 +$1% $2加成'],
  [/receives?\s+a?\s+(\w+)\s+boost/gi, '获得$1提升'],
  [/gains?\s+minor\s+(\w+)(?:es)?/gi, '获得少量$1'],
  [/gains?\s+(a\s+)?(random\s+)?(\w+)\s+bonus/gi, '获得$3加成'],
  [/gains?\s+bonus(?:es)?\s+to\s+(\w[\w\s]*)/gi, '获得$1加成'],

  // ===== 解锁条件短语 =====
  [/defeat\s+(?:a\s+total\s+of\s+)?(\d+[\d,]*)\s+(.+?)\.?$/gi, '击败 $1 个 $2。'],
  [/defeating\s+(?:a\s+total\s+of\s+)?(\d+[\d,]*)\s+(.+?)\.?$/gi, '击败 $1 个 $2。'],
  [/survive\s+(\d+)\s+minutes\s+in\s+(.+?)\.?$/gi, '在 $2 存活 $1 分钟。'],
  [/find\s+and\s+open\s+(?:the\s+)?(first|second|third|fourth|fifth)?\s*(?:enemy\s+)?coffin\s+in\s+(.+?)\.?$/gi,
    (m, nth, loc) => nth ? `在 ${loc} 找到并打开第${nth}个棺材。` : `在 ${loc} 找到并打开棺材。`],
  [/finding\s+and\s+opening\s+(?:the\s+)?(first|second|third|fourth)?\s*coffin\s+in\s+(.+?)\.?$/gi,
    (m, nth, loc) => nth ? `在 ${loc} 找到并打开第${nth}个棺材。` : `在 ${loc} 找到并打开棺材。`],
  [/evolve\s+(?:the\s+)?(.+?)\.$/gi, '进化 $1。'],
  [/evolving\s+(?:the\s+)?(.+?)\.$/gi, '进化 $1。'],
  [/fully\s+evolve\s+(?:the\s+)?(.+?)\.$/gi, '完全进化 $1。'],
  [/fully\s+evolving\s+(?:the\s+)?(.+?)\.$/gi, '完全进化 $1。'],
  [/obtain\s+(?:the\s+)?(.+?)\.?$/gi, '获得 $1。'],
  [/complete\s+(?:the\s+)?(.+?)\.?$/gi, '完成 $1。'],
  [/get\s+(.+?)\s+to\s+level\s+(\d+)\.?$/gi, '将 $1 升至 $2 级。'],
  [/earn\s+(\d+[\d,]*)\s+coins?\s+in\s+a\s+single\s+run\.?$/gi, '单局获得 $1 金币。'],
  [/recover\s+a\s+total\s+of\s+(\d+[\d,]*)\s+HP\.?$/gi, '累计回复 $1 生命值。'],

  // ===== 包含初始加成 =====
  [/with\s+the\s+starting\s+bonus\s+included/gi, '含初始加成'],
  [/or \+(\d+)% with the starting bonus included/gi, '，含初始加成共 +$1%'],

  // ===== 总计/总计 =====
  [/in\s+total/gi, '总计'],
  [/a\s+total\s+of/gi, '总计'],

  // ===== activate/activate ability =====
  [/will\s+occasionally\s+activate/gi, '会偶尔触发'],
  [/can\s+activate/gi, '可触发'],
  [/whenever\s+(he|she|it|they)\s+/gi, '每当'],

  // ===== extra =====
  [/an?\s+extra\s+level/gi, '额外1级'],
  [/extra\s+level/gi, '额外1级'],
  [/1 extra level/gi, '额外1级'],

  // ===== 常见残留 =====
  [/\bstarts?\s+with\b/gi, '初始拥有'],
  [/\bstarts?\s+with\s+a\s+hidden/gi, '初始拥有隐藏'],
  [/\bstarts?\s+with\s+an?\s+extra\.?/gi, '初始拥有额外'],
  [/\bevery\s+level\b/gi, '每级'],
  [/\bthis\s+bonus\b/gi, '此加成'],
  [/\bthe\s+bonus\b/gi, '此加成'],
  [/\bthese\s+bonuses?\b/gi, '这些加成'],
  [/\bstats?\s+bonus(?:es)?\b/gi, '属性加成'],
  [/\ba\s+bonus\b/gi, '加成'],
  [/\bup\s+to\b/gi, '最多'],
  [/\bcannot\s+be\s+damaged\b/gi, '无法受伤'],
  [/\bcannot\s+be\s+killed\b/gi, '无法被击杀'],
  [/\bupon\s+reaching\b/gi, '达到'],
  [/\bupon\s+obtaining\b/gi, '获得'],
  [/\bupon\s+starting\b/gi, '开始时'],
  [/\bupon\s+leveling\s+up\b/gi, '升级时'],
  [/\bwhenever\b/gi, '每当'],
  [/\bonce\s+every\s+(\d+)\s+seconds?\b/gi, '每$1秒'],
  [/\bonce\s+every\s+other\s+level\b/gi, '每两级'],
  [/\bis\s+able\s+to\b/gi, '可以'],
  [/\bhas\s+a\s+chance\b/gi, '有概率'],
  [/\btriggers?\b/gi, '触发'],
  [/\bactivates?\b/gi, '激活'],
  [/\bdepending\s+on\b/gi, '取决于'],
  [/\bafter\s+(\w[\w\s]*?)\s*$/gi, '在$1后'],
  [/\bwhile\s+playing\s+as\b/gi, '使用'],
  [/\bwhile\s+moving\b/gi, '移动时'],
  [/\bwhile\s+standing\s+still\b/gi, '站立时'],
  [/\bbased\s+on\b/gi, '基于'],
  [/\bcan\s+find\b/gi, '可以发现'],
  [/\bcan\s+also\b/gi, '也可以'],
  [/\bcannot\sfind\b/gi, '无法发现'],
  [/\binstead\b/gi, '取而代之'],
  [/\bprovides?\b/gi, '提供'],
  [/\bleaves?\s+behind\b/gi, '留下'],
  [/\bpicks?\s+up\b/gi, '拾取'],

  // ===== "and" 连词清理 =====
  [/，\s+and\s+/gi, '，'],
  [/\s+and\s+(\d+)/gi, (m, v) => `，+${v}`],
  [/\s+as well as\s+/gi, '，以及'],
  [/，\s*as well as\s+(\d+)/gi, (m, v) => `，+${v}`],

  // ===== 属性扩散 =====
  [/Max Health/gi, '最大生命'],
  [/\bHealth\b/gi, '生命'],
  [/\bSpeed\b/gi, '速度'],
  [/\bMight\b/gi, '力量'],
  [/\bCooldown\b/gi, '冷却'],
  [/\bArea\b/gi, '范围'],
  [/\bGreed\b/gi, '贪婪'],
  [/\bCurse\b/gi, '诅咒'],
  [/\bLuck\b/gi, '运气'],
  [/\bMove[sS]peed\b/gi, '移速'],
  [/\bDuration\b/gi, '持续'],
  [/\bRevival\b/gi, '复活'],
  [/\bRecovery\b/gi, '回复'],
  [/\bArmor\b/gi, '护甲'],
  [/\bCharm\b/gi, '魅力'],
  [/\bReroll\b/gi, '重掷'],
  [/\bSkip\b/gi, '跳过'],
  [/\bBanish\b/gi, '放逐'],
  [/\bAmount\b/gi, '数量'],
  [/\bCharge\b/gi, '充能'],
  [/\bLight\s+Sources?\b/gi, '光源'],
  [/\bspecial\s+pickups?\b/gi, '特殊掉落'],
  [/\bSpecial\s+pickups?\b/gi, '特殊掉落'],
  [/\boverhealing?\b/gi, '过量治疗'],
  [/\bprojectile\b/gi, '弹幕'],

  // ===== 特殊角色 =====
  [/\bShe-Moon\b/g, '月姬'],
  [/\bPara Kooleo\b/g, '帕拉·库雷奥'],
  [/\bSpace Dude\b/g, '太空仔'],
  [/\bSpace Dette\b/g, '太空妹'],
  [/\bSanta Ladonna\b/g, '圣拉多纳'],
  [/\bMask of the Red Death\b/g, '红死假面'],
  [/\bBig Troubler\b/g, '大麻烦'],
  [/\bChula-Reh\b/g, '楚拉-雷'],
  [/\bMcCoy-Oni\b/g, '麦考伊鬼'],
  [/\bGav'Et-Oni\b/g, '加维特鬼'],
  [/\bRottin'Ghoul\b/g, '腐尸'],
  [/\bJe-Ne-Viv\b/g, 'je-ne-viv'],
  [/\bScorej-Oni\b/g, '斯科雷吉鬼'],
  [/\bDiva No\b/g, '歌姬'],
  [/\bDiva\s+No\.\s*5\b/g, '歌姬5号'],
  [/\bZi'Appunta\b/g, '紫·阿彭塔'],
  [/\bSimondo\b/g, '西蒙多'],
  [/\bLolo\b/g, '洛洛'],
  [/\bDoor Spirit\b/g, '门灵'],

  // ===== 更多游戏词 =====
  [/\btransform\s+into\b/gi, '变身为'],
  [/\bfires?\b/gi, '射击'],
  [/\bglimmered\s+techs?\b/gi, '闪烁科技'],
  [/\btech\b/gi, '科技'],
  [/\bShowstopper\b/g, '压轴表演'],
  [/\bFamiliar\b/gi, '使魔'],
  [/\bHiss\b/g, '希斯'],
  [/\bMeow\b/g, '喵'],
  [/\bPurr\b/g, '普尔'],
  [/\bBody\s+parts?\b/gi, '身体部件'],
  [/\btype\b/gi, '类型'],
  [/\bdifferent\b/gi, '不同'],
  [/\bobtains?\b/gi, '获得'],
  [/\bobtaining\b/gi, '获得'],
  [/\bdefeated\b/gi, '击败'],
  [/\bdefeating\b/gi, '击败'],
  [/\bnotably\b/gi, '值得注意的是'],
  [/\bnote\b/gi, '注意'],
  [/\beach\s+time\b/gi, '每次'],
  [/\bevery\s+time\b/gi, '每次'],
  [/\bunique\s+weapon\b/gi, '独特武器'],
  [/\bencountered\b/gi, '获得'],
  [/\bchosen\b/gi, '选择'],
  [/\bchoose\b/gi, '选择'],
  [/\bchoices?\b/gi, '选项'],
  [/\bmore\b/gi, '更多'],
  [/\bless\b/gi, '更少'],
  [/\bfrequently\b/gi, '频繁地'],
  [/\bquickly\b/gi, '快速'],
  [/\binstantly\b/gi, '立即'],
  [/\boccurs?\b/gi, '发生'],
  [/\boccurrence\b/gi, '发生率'],
  [/\bsecond\s+charge\b/gi, '第二重充能'],
  [/\bability\b/gi, '技能'],
  [/\babove\b/gi, '上方'],
  [/\bhead\b/gi, '头'],
  [/\bassigned\b/gi, '分配'],
  [/\bpresented\b/gi, '呈现'],
  [/\bnames?\b/gi, '名字'],
  [/\bselected\b/gi, '选择'],
  [/\brun\b/gi, '游戏'],
  [/\bruns?\b/gi, '局'],
  [/\bnormal\b/gi, '正常'],
  [/\bCreatures?\b/gi, '生物'],
  [/\bappearing\b/gi, '出现'],
  [/\bdropped\b/gi, '掉落'],
  [/\bhidden\s+pickups?\b/gi, '隐藏掉落'],
  [/\bBoss\b/gi, 'Boss'],
  [/\b'not'\b/g, '不'],

  // ===== 最后防线 =====
  [/\bgains\b/gi, '获得'],
  [/\bgain\b(?=\s*\+)/gi, '获得'],
  [/\bgets\b/gi, '获得'],
  [/\bget\b(?=\s*\+)/gi, '获得'],
  [/\buntil\b/gi, '至'],
  [/\benters\s+a\b/gi, '进入'],
  [/\bleaves\b/gi, '离开'],
  [/\bany\s+amount\s+of\b/gi, '任意数量的'],
  [/\ba\s+hidden\b/gi, '一个隐藏的'],
  [/\ban\s+extra\b/gi, '一个额外的'],
  [/\ball\s+weapons\b/gi, '所有武器'],
  [/\bdice\b/gi, '骰子'],
  [/\brolls\b/gi, '掷出'],
  [/\bposes\b/gi, '摆姿势'],
  [/\bignores\b/gi, '忽略'],
  [/\busing\s+only\b/gi, '仅使用'],
  [/'\bnot\b'/g, '不'],
  [/\bas\s+a\b/gi, '作为'],
  [/\bwith\s+a\b/gi, '以获得'],

  // first/second/third/fourth
  [/\b(first|second|third|fourth|fifth)\b/gi, (m, w) => {
    const map = {first:'第一',second:'第二',third:'第三',fourth:'第四',fifth:'第五'};
    return map[w] || w;
  }],

  // ===== 第三轮深度清理 =====
  // 清理 "初始拥有 with" 残留
  [/初始拥有\s+with\s+/gi, '初始拥有 '],

  // 小写代词
  [/\bshe\b/g, '她'],
  [/\bhe\b/g, '他'],

  // has 模式
  [/\bhas\s+an?\s+HP[- ]Critical(?: skill)?\b/gi, '拥有HP暴击技能'],
  [/\bhas\s+an?\s+/gi, '拥有'],
  [/\bhas\s+a\s+chance\b/gi, '有概率'],

  // 常见游戏术语
  [/\bteams\s+with\b/gi, '组队'],
  [/\btwice\b/gi, '两次'],
  [/\binto\b/gi, '成'],
  [/\bany\s+amount\b/gi, '任意数量'],
  [/\bskins?\b/gi, '皮肤'],
  [/\bbody\s+types?\b/gi, '体型'],
  [/\bbase\s+damage\b/gi, '基础伤害'],
  [/\bstarting\s+weapon\b/gi, '初始武器'],
  [/\bmore\s+often\b/gi, '更频繁地'],
  [/\bmore\s+frequently\b/gi, '更频繁地'],
  [/\bcaps?\s+at\b/gi, '上限为'],
  [/\bcap\s+is\b/gi, '上限为'],
  [/\bdecreasing\b/gi, '减少'],
  [/\bincreses?\b/gi, '增加'],
  [/\bpassive\s+effects?\b/gi, '被动效果'],
  [/\bdamaged\b/gi, '受伤'],
  [/\bdamages?\b/gi, '伤害'],
  [/\bhidden\s+weapon\b/gi, '隐藏武器'],
  [/\binnately\s+knows\b/gi, '天生知晓'],
  [/\bknows\s+the\b/gi, '知晓'],
  [/\bproportion\b/gi, '比例'],
  [/\bfollowers?\b/gi, '随从'],
  [/\btoxic\b/gi, '毒素'],
  [/\bdeal\s+damage\b/gi, '造成伤害'],
  [/\bimmune\s+to\b/gi, '免疫'],
  [/\bpermanently\b/gi, '永久'],
  [/\badditively\b/gi, '叠加'],
  [/\badditively\s+increase\b/gi, '叠加增加'],
  [/\bstandalone\b/gi, '独立'],
  [/\bdirectly\b/gi, '直接'],
  [/\bvia\b/gi, '通过'],
  [/\bboosted\s+state\b/gi, '强化状态'],
  [/\bcritical\s+health\b/gi, '低生命'],
  [/\boverhealing?\s+by\b/gi, '过量治疗达'],
  [/\boverheals?\b/gi, '过量治疗'],
  [/\bhealth\s+points\b/gi, '生命点'],
  [/\bhighest\b/gi, '最高'],
  [/\bevery\s+three\b/gi, '每三'],
  [/\bevery\s+five\b/gi, '每五'],
  [/\bevery\s+other\b/gi, '每隔一'],
  [/\bexplosive\s+props?\b/gi, '爆炸道具'],
  [/\bdraft\b/gi, '选取'],
  [/\bcoffin\b/gi, '棺材'],
  [/\bcreates?\b/gi, '产生'],
  [/\babove\b/gi, '上方'],
  [/\bpresented\b/gi, '呈现'],
  [/\bselected\b/gi, '选中'],
  [/\bassigned\b/gi, '分配'],
  [/\bnames?\b/gi, '名字'],
  [/\bthem\b/gi, '他们'],
  [/\btheir\b/gi, '其'],
  [/\bhis\b/gi, '他的'],
  [/\bher\b/gi, '她的'],
  [/\boccurs?\b/gi, '发生'],

  // 武器/道具特殊词
  [/\bGlimmered\s+Tingles\b/g, '闪烁刺感'],
  [/\bweapon akin to\b/gi, '武器（类似'],
  [/\bcan\s+not\b/gi, '无法'],

  // 清理 "of" 残留
  [/的 of\b/gi, '的'],
  [/\bof\s+gold\b/gi, '金币'],
  [/\bof\s+(\d+)\s*(?:names?|choices?)\b/gi, '共$1个名字'],

  // "and" final pass
  [/\s+and\s+/g, '，'],
  [/，，/g, '，'],
  [/，\s*\./g, '。'],
  [/\.{2,}/g, '。'],
  [/，\s*，/g, '，'],
  [/；\s*；/g, '；'],
  [/  +/g, ' '],
  [/\s+,/g, '，'],
  [/\s+。/g, '。'],

  // 清理数字后缀残留
  [/\bsources?\b/gi, '源'],
  [/\bsource\b/gi, '源'],
  [/\bpoints?\b/gi, '点'],
  [/\bseconds?\b/gi, '秒'],
  [/\bminutes?\b/gi, '分钟'],
  [/\blevels?\b/gi, '级'],
  [/\benemies?\b/gi, '敌人'],
  [/\bweapons?\b/gi, '武器'],
  [/\bbonuses?\b/gi, '加成'],
  [/\bpickups?\b/gi, '掉落物'],
  [/\bcoins?\b/gi, '金币'],
  [/\breaper\b/gi, '死神'],
  [/\bnon-red\s+reaper\b/gi, '非红色死神'],
  [/\buppercut\b/gi, '上勾拳'],
  [/\bask\s+for\s+help\b/gi, '寻求帮助'],

  // clean up "a" / "an" before Chinese
  [/一个\s+一个\b/g, '一个'],
  [/\sa\s*$/g, ''],
  [/\san\s*$/g, ''],

  // clean up "with" before numbers (after other translations)
  [/\swith\s+(\d)/g, '以 $1'],
  [/\swith\s+([a-z])/gi, ' $1'],

  // ===== 第四轮：最终深度清理 =====
  // 通用模式
  [/\breduction\b/gi, '减免'],
  [/\bthat\s+activates?\b/gi, '该技能激活'],
  [/\bas\s+soon\s+as\b/gi, '一旦'],
  [/\bas\b/gi, '当'],
  [/\bwill\b/gi, '会'],
  [/\bdoesn'?t\s+even\s+need\b/gi, '甚至不需要'],
  [/\bdoesn'?t\b/gi, '不'],
  [/\blevel\s+up\b/gi, '升级'],
  [/\blevelling\b/gi, '升级'],
  [/\bbegins?\s+at\b/gi, '初始为'],
  [/\binstead\s+of\b/gi, '而非'],
  [/\bin\s+this\s+form\b/gi, '在此形态下'],
  [/\bbecomes?\b/gi, '变为'],
  [/\bcan\b/gi, '可'],
  [/\bat\s+random\b/gi, '随机'],
  [/\bat\s+critical\s+health\b/gi, '在低生命时'],
  [/\bmore\s+often\s+than\s+normal\b/gi, '比正常更频繁'],
  [/\bmore\s+often\s+than\b/gi, '比...更频繁'],
  [/\bone\s+per\s+life\b/gi, '每命一次'],
  [/\bonce\s+per\s+life\b/gi, '每命一次'],
  [/\bhow\s+much\b/gi, '数量'],
  [/\bon[- ]screen\b/gi, '屏幕上'],
  [/\btaking\s+damage\b/gi, '承受伤害'],
  [/\btakes?\b/gi, '获得'],
  [/\bmax(imum)?\s+of\b/gi, '最多'],
  [/\badds?\b/gi, '增加'],
  [/\bdrains?\b/gi, '吸取'],
  [/\bcharged?\b/gi, '充能'],
  [/\bstanding\s+still\b/gi, '站立'],
  [/\bwinds?\s+up\b/gi, '充能'],
  [/\bgranted\b/gi, '授予'],
  [/\bshows?\b/gi, '显示'],
  [/\bvisible\b/gi, '可见'],
  [/\bbe\s*(offered|granted|spawned|presented)\b/gi, '获得'],
  [/\bfor\s+(\d+)\s+seconds?\b/gi, '持续$1秒'],
  [/\bfor\s+every\b/gi, '每'],
  [/\bdoing\b/gi, '造成'],
  [/\bnon-red\b/gi, '非红色的'],
  [/\bretaliatory\b/gi, '反击'],
  [/\botherwise\b/gi, '否则'],
  [/\bspecific\b/gi, '特定'],
  [/\bcharged?\s+ability\b/gi, '充能技能'],
  [/\botherworldly\b/gi, '异世'],
  [/\bmechanical\b/gi, '机械'],
  [/\bdiva\b/gi, '歌姬'],
  [/\bvisit\b/gi, '造访'],
  [/\bfiery\s+balcony\b/gi, '烈焰阳台'],
  [/\bin\s+place\s+of\b/gi, '替代'],
  [/\balternative\b/gi, '替代'],
  [/\bgrants?\b/gi, '给予'],
  [/\bstarts\s+each\b/gi, '每局开始'],
  [/\bper\s+life\b/gi, '每命'],

  // 标点/空格残留
  [/,\s*and\b/gi, '，'],
  [/\s+and\s+/g, '，'],
  [/\s+or\s+/g, '或'],
  [/\s+but\s+/g, '但'],
  [/，\s*or\s+/g, '或'],
  [/，\s*but\s+/g, '但'],

  // 角色名清理 (去掉 Wiki 标记后的名字)
  [/\bVlad\s+Tepes\s+Dracula\b/g, '弗拉德·特佩斯·德古拉'],
  [/\bBonnie\s+Blair\b/g, '邦尼·布莱尔'],
  [/\bFormina\s+Franklyn\b/g, '福米娜·弗兰克林'],
  [/\bAmeya\s+Aisling\b/g, '阿梅娅·艾斯林'],
  [/\bSiugnas\b/g, '休格纳斯'],
  [/\bTsunanori\s+Mido\b/g, '御堂纲纪'],
  [/\bEric\s+Lecarde\b/g, '艾瑞克·勒卡德'],
  [/\bLeon\s+Belmont\b/g, '里昂·贝尔蒙特'],
  [/\bTrevor\s+Belmont\b/g, '特雷弗·贝尔蒙特'],
  [/\bJuste\s+Belmont\b/g, '祖斯特·贝尔蒙特'],
  [/\bJulius\s+Belmont\b/g, '尤里乌斯·贝尔蒙特'],
  [/\bRichter\s+Belmont\b/g, '里希特·贝尔蒙特'],
  [/\bSimon\s+Belmont\b/g, '西蒙·贝尔蒙特'],
  [/\bChristopher\s+Belmont\b/g, '克里斯托弗·贝尔蒙特'],
  [/\bSoma\s+Cruz\b/g, '来须苍真'],
  [/\bCharlotte\s+Aulin\b/g, '夏洛特·奥林'],
  [/\bGrant\s+Danasty\b/g, '格兰特·达纳斯提'],
  [/\bJohn\s+Morris\b/g, '约翰·莫里斯'],
  [/\bJonathan\s+Morris\b/g, '乔纳森·莫里斯'],
  [/\bNathan\s+Graves\b/g, '内森·格雷夫斯'],
  [/\bCornell\b/g, '科内尔'],
  [/\bShanoa\b/g, '夏诺雅'],
  [/\bAlbus\b/g, '阿尔布斯'],
  [/\bSypha\s+Belmont\b/g, '赛法·贝尔蒙特'],
  [/\bSypha\s+Belrades\b/g, '赛法·贝尔蒙特'],
  [/\bSypha\b/g, '赛法'],
  [/\bYoko\s+Belrades\b/g, '洋子·贝尔蒙特'],
  [/\bYoko\b/g, '洋子'],
  [/\bBarlowe\b/g, '巴洛'],
  [/\bReinhardt\s+Schneider\b/g, '莱因哈特·施耐德'],
  [/\bReinhardt\b/g, '莱因哈特'],
  [/\bRinaldo\b/g, '里纳尔多'],
  [/\bGandolfi\b/g, '甘道尔菲'],
  [/\bCarmilla\b/g, '卡米拉'],
  [/\bHector\b/g, '赫克托'],
  [/\bIsaac\b/g, '艾萨克'],
  [/\bJulia\b/g, '朱莉亚'],
  [/\bJoachim\b/g, '约阿希姆'],
  [/\bMaxim\b/g, '马克西姆'],
  [/\bHenry\b/g, '亨利'],
  [/\bCarrie\b/g, '凯莉'],
  [/\bSoleil\b/g, '索莱尔'],
  [/\bDrolta\b/g, '德罗塔'],
  [/\bMina\s+Harker\b/g, '米娜·哈克'],
  [/\bMina\b/g, '米娜'],
  [/\bSara\b/g, '莎拉'],
  [/\bVincent\b/g, '文森特'],
  [/\bLisa\s+Tepes\b/g, '丽莎·特佩斯'],
  [/\bLisa\b/g, '丽莎'],
  [/\bMaria\s+Renard\b/g, '玛丽亚·雷纳德'],
  [/\bMaria\b/g, '玛丽亚'],
  [/\bSonia\b/g, '索妮娅'],
  [/\bDragonslayer\b/g, '屠龙者'],
  [/\bAura\b/g, '光环'],
  [/\bGalamoth\b/g, '加洛莫斯'],

  // 阶段名
  [/\bInverse\s+Emerald\s+Diorama\b/gi, '逆翡翠幻境'],
  [/\bEmerald\s+Diorama\b/gi, '翡翠幻境'],
  [/\bInlaid\s+Library\b/gi, '镶嵌图书馆'],
  [/\bCappella\s+Magna\b/gi, '大教堂'],
  [/\bMad\s+Forest\b/gi, '疯狂森林'],
  [/\bGallo\s+Tower\b/gi, '加洛塔'],
  [/\bDairy\s+Plant\b/gi, '乳品厂'],
  [/\bLake\s+Foscari\b/gi, '福斯卡里湖'],
  [/\bMt\.?Moonspell\b/gi, '月咒山'],
  [/\bMoongolow\b/gi, '月神谷'],
  [/\bBone\s+Zone\b/gi, '白骨区'],
  [/\bOde\s+to\s+Castlevania\b/gi, '恶魔城颂歌'],
  [/\bBoss\s+Rash\b/gi, 'Boss Rush'],
  [/\bGreen\s+Acre\b/gi, '绿茵地'],
  [/\bTiny\s+Bridge\b/gi, '小桥'],
  [/\bIl\s+Molise\b/gi, '伊尔莫利塞'],
  [/\bCarlo\s+Cart\b/gi, '卡罗卡丁车'],
  [/\bEudaimonia\s+Machine\b/gi, '幸福机器'],
  [/\bEudaimonia\s+M\.?\b/gi, '幸福机器'],

  // 物品名
  [/\bRaging\s+Fire\b/g, '烈焰'],
  [/\bIce\s+Fang\b/g, '冰牙'],
  [/\bGale\s+Force\b/g, '狂风'],
  [/\bRock\s+Riot\b/g, '岩石暴乱'],
  [/\bKeremet\s+Bubbles\b/g, '克雷默气泡'],
  [/\bPummarola\b/g, '番茄'],
  [/\bSkull\s+O'?Maniac\b/g, '骷髅狂'],
  [/\bSkull\s+Mania\b/g, '骷髅狂'],
  [/\bPako\s+Battiliar\b/g, '帕科战蝠'],
  [/\bAmmo\s+Appalate\b/g, '弹药装置'],
  [/\bSilver\s+Wind\b/g, '银风'],
  [/\bFour\s+Seasons\b/g, '四季'],
  [/\bSummon\s+Night\b/g, '暗夜召唤'],
  [/\bMirage\s+Robe\b/g, '幻影长袍'],
  [/\bSharp\s+Tongue\b/g, '利舌'],
  [/\bLifesign\s+Scan\b/g, '生命信号扫描'],
  [/\bScience\s+Rocks\b/g, '科学之石'],
  [/\bLucky\s+Swipe\b/g, '幸运一刷'],
  [/\bAlucart\s+Sworb\b/g, '阿鲁卡多之剑'],
  [/\bAlucard\s+Spear\b/g, '阿鲁卡多长矛'],
  [/\bAlucard\s+Shield\b/g, '阿鲁卡多之盾'],
  [/\bJet\s+Black\s+Whip\b/g, '漆黑之鞭'],
  [/\bWind\s+Whip\b/g, '风之鞭'],
  [/\bWater\s+Dragon\s+Whip\b/g, '水龙之鞭'],
  [/\bPlatinum\s+Whip\b/g, '白金之鞭'],
  [/\bVibhuti\s+Whip\b/g, '圣灰之鞭'],
  [/\bAlchemy\s+Whip\b/g, '炼金之鞭'],
  [/\bSonic\s+Whip\b/g, '音速之鞭'],
  [/\bStar\s+Flail\b/g, '星之连枷'],
  [/\bIron\s+Shield\b/g, '铁盾'],
  [/\bIron\s+Ball\b/g, '铁球'],
  [/\bGuardian'?s\s+Targe\b/g, '守护者盾牌'],
  [/\bSilver\s+Revolver\b/g, '银色左轮'],
  [/\bOptical\s+Shot\b/g, '光学射击'],
  [/\bHand\s+Grenade\b/g, '手雷'],
  [/\bWine\s+Glass\b/g, '酒杯'],
  [/\bLong\s+Gun\b/g, '长枪'],
  [/\bShort\s+Gun\b/g, '短枪'],
  [/\bSpread\s+Shot\b/g, '散弹'],
  [/\bDivers?\s+Mines?\b/g, '潜水雷'],
  [/\bGros\s+Michel\b/g, '大麦克'],
  [/\bPhotonstorm\b/g, '光子风暴'],
  [/\bLiving\s+Anguish\b/g, '活体痛苦'],
  [/\bDivine\s+Wood\s+Spirit\b/g, '神木之灵'],
  [/\bEarth\s+Dragon\b/g, '土龙'],
  [/\bIron\s+Maiden\b/g, '铁处女'],
  [/\bSpecter\s+of\s+Iwanaga[- ]hime\b/gi, '岩永姬之灵'],
  [/\bIwanaga[- ]hime\b/gi, '岩永姬'],

  // ===== 第六轮：剩余游戏术语深度翻译 =====
  // 通用游戏词
  [/\bteams?\s+up\b/gi, '组队'],
  [/\bsecondary\s+character\b/gi, '副角色'],
  [/\bfrequency\b/gi, '频率'],
  [/\bsolo\s+skin\b/gi, '单人皮肤'],
  [/\bplayer\s+chooses?\b/gi, '玩家选择'],
  [/\bwon'?t\b/gi, '不会'],
  [/\bfalls\s+below\b/gi, '降至低于'],
  [/\bgreatly\s+increased\b/gi, '大幅增加'],
  [/\bfollowing\s+mechanics?\b/gi, '以下机制'],
  [/\bVermillion\s+Sands\b/gi, '朱砂沙'],
  [/\bsecondary\b/gi, '副'],
  [/\bfollows?\b/gi, '跟随'],
  [/\bchooses?\b/gi, '选择'],
  [/\bsummoned\b/gi, '召唤'],
  [/\bquantity\b/gi, '数量'],
  [/\bincreases\s+enemy\s+spawn/gi, '增加敌人生成'],
  [/\bDuring\b/gi, ''],
  [/\bTriggering\b/gi, '触发'],
  [/\bsolo\b/gi, '单人'],
  [/\bGrelon\b/gi, '格雷隆'],
  [/\bYomi\b/gi, '黄泉'],
  [/\bAvalon\b/gi, '阿瓦隆'],
  [/\bPulchra\b/gi, '普克拉'],

  // 阶段/模式
  [/\bInverse\s+Emerald\s+Diorama\b/gi, '逆翡翠幻境'],
  [/\bInverse\s+Mode\b/gi, '逆模式'],
  [/\bEmerald\s+Diorama\b/gi, '翡翠幻境'],
  [/\bInverese\s+Emerald\s+Diorama\b/gi, '逆翡翠幻境'],

  // 武器/进化名
  [/\bPlatinum\s+Whip\b/g, '白金之鞭'],
  [/\bVibhuti\s+Whip\b/g, '圣灰之鞭'],
  [/\bAlchemy\s+Whip\b/g, '炼金之鞭'],
  [/\bJet\s+Black\s+Whip\b/g, '漆黑之鞭'],
  [/\bWind\s+Whip\b/g, '风之鞭'],
  [/\bWater\s+Dragon\s+Whip\b/g, '水龙之鞭'],
  [/\bSonic\s+Whip\b/g, '音速之鞭'],
  [/\bStar\s+Flail\b/g, '星之连枷'],
  [/\bIron\s+Shield\b/g, '铁盾'],
  [/\bGuardian'?s?\s+Targe\b/gi, '守护者盾牌'],
  [/\bIron\s+Ball\b/g, '铁球'],
  [/\bSilver\s+Revolver\b/g, '银色左轮'],
  [/\bOptical\s+Shot\b/g, '光学射击'],
  [/\bHand\s+Grenade\b/g, '手雷'],
  [/\bWine\s+Glass\b/g, '酒杯'],
  [/\bLong\s+Gun\b/g, '长枪'],
  [/\bShort\s+Gun\b/g, '短枪'],
  [/\bSpread\s+Shot\b/g, '散弹'],
  [/\bDivers?\s+Mines?\b/g, '潜水雷'],
  [/\bGros\s+Michel\b/g, '大麦克'],
  [/\bPhotonstorm\b/g, '光子风暴'],
  [/\bLiving\s+Anguish\b/gi, '活体痛苦'],
  [/\bDivine\s+Wood\s+Spirit\b/gi, '神木之灵'],
  [/\bEarth\s+Dragon\b/gi, '土龙'],
  [/\bIron\s+Maiden\b/gi, '铁处女'],
  [/\bSpecter\s+of\s+Iwanaga[- ]hime\b/gi, '岩永姬之灵'],
  [/\bIwanaga[- ]hime\b/gi, '岩永姬'],
  [/\bRaging\s+Fire\b/g, '烈焰'],
  [/\bIce\s+Fang\b/g, '冰牙'],
  [/\bGale\s+Force\b/g, '狂风'],
  [/\bRock\s+Riot\b/g, '岩石暴乱'],
  [/\bKeremet\s+Bubbles\b/g, '克雷默气泡'],
  [/\bPummarola\b/g, '番茄'],
  [/\bSkull\s+O'?Maniac\b/g, '骷髅狂'],
  [/\bPako\s+Battiliar\b/g, '帕科战蝠'],
  [/\bAmmo\s+Appalate\b/g, '弹药装置'],
  [/\bSilver\s+Wind\b/g, '银风'],
  [/\bFour\s+Seasons\b/g, '四季'],
  [/\bSummon\s+Night\b/g, '暗夜召唤'],
  [/\bMirage\s+Robe\b/g, '幻影长袍'],
  [/\bSharp\s+Tongue\b/g, '利舌'],
  [/\bLifesign\s+Scan\b/g, '生命信号扫描'],
  [/\bScience\s+Rocks\b/g, '科学之石'],
  [/\bLucky\s+Swipe\b/g, '幸运一刷'],
  [/\bAlucart\s+Sworb\b/g, '阿鲁卡多之剑'],
  [/\bAlucard\s+Spear\b/g, '阿鲁卡多长矛'],
  [/\bAlucard\s+Shield\b/g, '阿鲁卡多之盾'],
  [/\bTyrfing\b/g, '提尔锋'],
  [/\bGlobus\b/g, '球体'],
  [/\bMace\b/g, '钉头锤'],
  [/\bFulgur\b/g, '闪电'],
  [/\bLuminatio\b/g, '光辉'],
  [/\bUmbra\b/g, '暗影'],
  [/\bInfernolatro\b/g, '地狱崇拜'],
  [/\bFibonacci\s+Spritz\b/gi, '斐波那契喷雾'],
  [/\bEskizzibur\b/g, '埃斯基祖尔'],
  [/\bJavelin\b/g, '标枪'],

  // possessive forms
  [/([A-Z][a-z]+)'s\b/g, '$1的'],

  // cleanup single articles
  [/\sthe\s/gi, ' '],
  [/\sa\s/gi, ' '],
  [/\san\s/gi, ' '],
  [/\s+(，|。|！|？)/g, '$1'],
  [/(，|。|！|？)\s+/g, '$1'],
  [/\\\s*$/g, '\\'],
  [/\s+\./g, '。'],

  // --- batch 2: common remaining English words/phrases (2026-06-18) ---
  // verb phrases
  [/\bwhich\b/gi, '该效果'],
  [/\bskill\b/gi, '技能'],
  [/\bplayer\b/gi, '玩家'],
  [/\bthey\b/gi, '他'],
  [/\bhim\b/gi, '他'],
  [/\bher\b/gi, '她'],
  [/\bhis\b/gi, '他的'],
  [/\btheir\b/gi, '他们的'],
  [/\bthem\b/gi, '他们'],
  [/\bcharacter\b/gi, '角色'],
  [/\bmay\b/gi, '可能'],
  [/\bwill\s+not\b/gi, '不会'],
  [/\bwill\b/gi, '会'],
  [/\bcan\b/gi, '可以'],
  [/\bcannot\b/gi, '无法'],
  [/\bdoes\s+not\b/gi, '不'],
  [/\bwithout\b/gi, '无'],
  [/\bbeing\b/gi, '被'],
  [/\btaking\b/gi, '受到'],
  [/\breceiving\b/gi, '受到'],
  [/\bgiven\b/gi, '获得'],
  [/\bgain\b/gi, '获得'],
  [/\bgains\b/gi, '获得'],
  [/\bgranted\b/gi, '授予'],
  [/\btriggers?\b/gi, '触发'],
  [/\btriggered\b/gi, '触发'],
  [/\bactivates\b/gi, '激活'],
  [/\bactivated\b/gi, '激活'],
  [/\bactivating\b/gi, '激活'],
  [/\bfire\b/gi, '发射'],
  [/\bfires\b/gi, '发射'],
  [/\bfired\b/gi, '发射'],
  [/\bdamage\b/gi, '伤害'],
  [/\bdeals\b/gi, '造成'],
  [/\bdeal\b/gi, '造成'],
  [/\bcauses?\b/gi, '导致'],
  [/\bresulting\b/gi, '导致'],
  [/\bresults\b/gi, '导致'],
  [/\brecovering\b/gi, '恢复'],
  [/\brecover\b/gi, '恢复'],
  [/\brecovers\b/gi, '恢复'],
  [/\binjured\b/gi, '受伤'],
  [/\bhurt\b/gi, '受伤'],
  [/\bincrease\b/gi, '增加'],
  [/\bincreases\b/gi, '增加'],
  [/\bincreased\b/gi, '增加'],
  [/\bdecreased\b/gi, '减少'],
  [/\bdecreases\b/gi, '减少'],
  [/\breduced\b/gi, '减少'],
  [/\breaches\b/gi, '达到'],
  [/\breach\b/gi, '达到'],
  [/\breached\b/gi, '达到'],
  [/\breaching\b/gi, '达到'],
  [/\bhappens\b/gi, '发生'],
  [/\boccur\b/gi, '发生'],
  [/\boccurs\b/gi, '发生'],
  [/\bappear\b/gi, '出现'],
  [/\bappears\b/gi, '出现'],
  [/\bdisappear\b/gi, '消失'],
  [/\baffect\b/gi, '影响'],
  [/\baffected\b/gi, '影响'],
  [/\baffects\b/gi, '影响'],
  [/\bobtained\b/gi, '获得'],
  [/\bobtain\b/gi, '获得'],
  [/\bremoves?\b/gi, '移除'],
  [/\bremoved\b/gi, '移除'],
  [/\bprovide\b/gi, '提供'],
  [/\bprovides\b/gi, '提供'],
  [/\bselect\b/gi, '选择'],
  [/\bselected\b/gi, '选择'],
  [/\bchooses?\b/gi, '选择'],
  [/\bchosen\b/gi, '选择'],
  [/\bhit\b/gi, '击中'],
  [/\bhits\b/gi, '击中'],
  [/\bland\b/gi, '落地'],
  [/\blands\b/gi, '落地'],
  [/\bstands?\b/gi, '站立'],
  [/\bstanding\b/gi, '站立'],
  [/\bleaves\b/gi, '留下'],
  [/\blasts\b/gi, '持续'],
  [/\blasting\b/gi, '持续'],
  [/\bbegins\b/gi, '开始'],
  [/\bbegin\b/gi, '开始'],
  [/\bduration\b/gi, '持续时间'],
  [/\bcurrent\b/gi, '当前'],
  [/\bpreviously\b/gi, '之前'],

  // nouns
  [/\bgame[\s-]over\b/gi, '游戏结束'],
  [/\benemy\b/gi, '敌人'],
  [/\benemies\b/gi, '敌人'],
  [/\bstage\b/gi, '关卡'],
  [/\brun\b/gi, '局'],
  [/\bruns\b/gi, '局'],
  [/\bscreen\b/gi, '屏幕'],
  [/\bsource\b/gi, '来源'],
  [/\bsources?\b/gi, '来源'],
  [/\binstance\b/gi, '实例'],
  [/\bform\b/gi, '形态'],
  [/\bforms?\b/gi, '形态'],
  [/\bformula\b/gi, '公式'],
  [/\btype\b/gi, '类型'],
  [/\bmode\b/gi, '模式'],
  [/\bversion\b/gi, '版本'],
  [/\bstat\b/gi, '属性'],
  [/\bstats\b/gi, '属性'],
  [/\bmultiplier\b/gi, '倍率'],
  [/\bcharge\b/gi, '充能'],
  [/\bcharged\b/gi, '充能'],
  [/\bslot\b/gi, '栏位'],
  [/\bslots\b/gi, '栏位'],
  [/\bcap\b/gi, '上限'],
  [/\bcaps\b/gi, '上限'],
  [/\bmaximum\b/gi, '最大'],
  [/\bminimum\b/gi, '最小'],
  [/\bvisible\b/gi, '可见'],
  [/\binvisible\b/gi, '不可见'],
  [/\btarget\b/gi, '目标'],
  [/\btargets\b/gi, '目标'],
  [/\bnumber\b/gi, '数量'],
  [/\bamount\b/gi, '数量'],
  [/\bproc\b/gi, '触发'],
  [/\bprocs\b/gi, '触发'],
  [/\bexp\b/gi, '经验'],
  [/\bexperience\b/gi, '经验'],
  [/\blevel\b/gi, '等级'],
  [/\blevels\b/gi, '等级'],
  [/\brevive\b/gi, '复活'],
  [/\brevives\b/gi, '复活'],
  [/\breviving\b/gi, '复活'],
  [/\bdrops\b/gi, '掉落'],
  [/\bdamage\b/gi, '伤害'],
  [/\bgold\b/gi, '金币'],
  [/\bfever\b/gi, '狂热'],
  [/\bcoins?\b/gi, '金币'],
  [/\bweapon\b/gi, '武器'],
  [/\bweapons?\b/gi, '武器'],
  [/\bpassive\b/gi, '被动'],
  [/\barcane\b/gi, '奥秘'],
  [/\barcanas?\b/gi, '奥秘'],
  [/\bchest\b/gi, '宝箱'],
  [/\bchests?\b/gi, '宝箱'],
  [/\bcard\b/gi, '卡牌'],
  [/\bcards?\b/gi, '卡牌'],

  // adjectives/adverbs
  [/\bfatal\b/gi, '致命'],
  [/\brandom\b/gi, '随机'],
  [/\brandomly\b/gi, '随机'],
  [/\bcertain\b/gi, '特定'],
  [/\bsimilar\b/gi, '类似'],
  [/\bnext\b/gi, '下一个'],
  [/\bprevious\b/gi, '上一个'],
  [/\bmultiple\b/gi, '多个'],
  [/\bunique\b/gi, '独特'],
  [/\bpermanent\b/gi, '永久'],
  [/\btemporarily\b/gi, '暂时'],
  [/\btemporary\b/gi, '临时'],
  [/\bhidden\b/gi, '隐藏'],
  [/\bonly\b/gi, '仅'],
  [/\balways\b/gi, '始终'],
  [/\bever\b/gi, '曾'],
  [/\bnever\b/gi, '从不'],
  [/\bonce\b/gi, '一次'],
  [/\bagain\b/gi, '再次'],
  [/\balso\b/gi, '也'],
  [/\binstead\b/gi, '替代'],
  [/\babove\b/gi, '上方'],
  [/\bbelow\b/gi, '以下'],
  [/\bbelow\b/gi, '低于'],
  [/\bunderneath\b/gi, '下方'],
  [/\baround\b/gi, '周围'],
  [/\baround\s+him\b/gi, '他周围'],
  [/\bnearby\b/gi, '附近'],
  [/\bclose\b/gi, '靠近'],
  [/\badjacent\b/gi, '相邻'],
  [/\bother\b/gi, '其他'],
  [/\banother\b/gi, '另一个'],
  [/\beach\b/gi, '每个'],
  [/\ballow\b/gi, '允许'],
  [/\ballowed\b/gi, '允许'],
  [/\bavailable\b/gi, '可用'],
  [/\bable\b/gi, '能够'],
  [/\bpossible\b/gi, '可能'],
  [/\bspecial\b/gi, '特殊'],
  [/\bgreater\b/gi, '更大'],
  [/\bless\b/gi, '更少'],
  [/\bmore\b/gi, '更多'],
  [/\bthan\b/gi, '比'],
  [/\bmost\b/gi, '最'],
  [/\bevery\b/gi, '每'],
  [/\bduring\b/gi, '期间'],
  [/\bafter\b/gi, '之后'],
  [/\bbefore\b/gi, '之前'],
  [/\bbetween\b/gi, '之间'],
  [/\bwhile\b/gi, '当'],

  // prepositions/conjunctions
  [/\band\b/gi, '和'],
  [/\bor\b/gi, '或'],
  [/\bwith\b/gi, '使用'],
  [/\bwithout\b/gi, '无'],
  [/\bfor\b/gi, '为'],
  [/\bfrom\b/gi, '从'],
  [/\binto\b/gi, '至'],
  [/\bthrough\b/gi, '通过'],
  [/\bthroughout\b/gi, '贯穿'],
  [/\bwithin\b/gi, '在...内'],
  [/\bagainst\b/gi, '对抗'],
  [/\bupon\b/gi, '当...时'],
  [/\buntil\b/gi, '直到'],
  [/\bwhen\b/gi, '当'],
  [/\bwhere\b/gi, '在...处'],
  [/\bhowever\b/gi, '但'],
  [/\btherefore\b/gi, '因此'],
  [/\bnot\b/gi, '不'],
  [/\b\'not\'\b/g, '不'],
  [/\bdoesn\'t\b/gi, '不'],
  [/\bdon\'t\b/gi, '不'],
  [/\bwon\'t\b/gi, '不会'],

  // compound phrases
  [/\bskill\s+may\b/gi, '技能可能'],
  [/\bhp\s+drops\s+below\b/gi, 'HP降至低于'],
  [/\bdrops\s+below\b/gi, '降至低于'],
  [/\bresulting\s+in\s+a?\s*game[\s-]over\b/gi, '导致游戏结束'],
  [/\bwithout\s+taking\s+damage\b/gi, '不受到伤害'],
  [/\breceiving\s+fatal\s+damage\b/gi, '受到致命伤害'],
  [/\bif\s+(the\s+)?player\b/gi, '如果玩家'],
  [/\bonce\s+per\b/gi, '每次'],
  [/\bas\s+long\s+as\b/gi, '只要'],
  [/\bas\s+soon\s+as\b/gi, '一旦'],
  [/\bat\s+a?\s*time\b/gi, '一次'],
  [/\bso\s+long\s+as\b/gi, '只要'],
  [/\bin\s+order\s+to\b/gi, '为了'],
  [/\bbased\s+on\b/gi, '基于'],
  [/\bdepending\s+on\b/gi, '取决于'],
  [/\baccording\s+to\b/gi, '根据'],
  [/\binstead\s+of\b/gi, '取代'],
  [/\brather\s+than\b/gi, '而非'],
  [/\balong\s+with\b/gi, '连同'],
  [/\btogether\s+with\b/gi, '连同'],
  [/\bthis\s+way\b/gi, '此方式'],
  [/\bup\s+to\b/gi, '最多'],
  [/\bat\s+least\b/gi, '至少'],
  [/\bat\s+most\b/gi, '最多'],
  [/\bmore\s+than\b/gi, '多于'],
  [/\bless\s+than\b/gi, '少于'],
  [/\bequal\s+to\b/gi, '等于'],
  [/\bgreater\s+than\b/gi, '大于'],
  [/\bsuch\s+as\b/gi, '如'],
  [/\bincluding\b/gi, '包括'],
  [/\bfor\s+example\b/gi, '例如'],
  [/\bno\s+longer\b/gi, '不再'],
  [/\bmore\s+frequently\b/gi, '更频繁'],
  [/\bthe\s+more\b/gi, '越...'],
  [/\bper\s+second\b/gi, '每秒'],
  [/\bper\s+level\b/gi, '每级'],
  [/\bevery\s+time\b/gi, '每次'],
  [/\ball\s+of\b/gi, '所有'],
  [/\bmost\s+of\b/gi, '大部分'],
  [/\ba\s+lot\s+of\b/gi, '大量'],

  // special phrases
  [/\bgame[\s-]over\b/gi, '游戏结束'],
  [/\bcritical\s+health\b/gi, '暴击生命'],
  [/\bcritical\s+hit\b/gi, '暴击'],
  [/\bhp[\s-]critical\b/gi, 'HP暴击'],
  [/\bsoul\s+steal\b/gi, '灵魂窃取'],
  [/\bdark\s+inferno\b/gi, '暗黑地狱火'],
  [/\bsword\s+brothers\b/gi, '剑兄弟'],
  [/\bsummon\s+spirit\b/gi, '召唤灵魂'],
  [/\bimmune\s+to\b/gi, '免疫'],
  [/\bhealth\s+drain\b/gi, '生命吸取'],
  [/\bflame\s+aura\b/gi, '火焰光环'],
  [/\blight\s+sources?\b/gi, '光源'],
  [/\bpower\s+up\b/gi, '升级'],
  [/\bpower\s+ups\b/gi, '升级'],
  [/\bpickup\b/gi, '拾取物'],
  [/\bpickups\b/gi, '拾取物'],
  [/\bmax\s+health\b/gi, '最大生命'],
  [/\bcurrent\s+health\b/gi, '当前生命'],
  [/\bsecondary\s+weapon\b/gi, '副武器'],
  [/\bhidden\s+weapon\b/gi, '隐藏武器'],
  [/\bfollow\s+enemies\b/gi, '跟随敌人'],
  [/\bcertain\s+number\b/gi, '一定数量'],
  [/\bwhip\b/gi, '鞭子'],
  [/\bexplosive\b/gi, '爆炸'],
  [/\bexplosions\b/gi, '爆炸'],
  [/\bprojectile\b/gi, '弹幕'],
  [/\bprojectiles\b/gi, '弹幕'],

  // proper names - leave more context
  [/\bAntonio\b/g, '安东尼奥'],
  [/\bImelda\b/g, '伊梅尔达'],
  [/\bPasqualina\b/g, '帕斯夸莉娜'],
  [/\bGennaro\b/g, '杰纳罗'],
  [/\bArca\b/g, '阿卡'],
  [/\bPorta\b/g, '波塔'],
  [/\bLama\b/g, '拉玛'],
  [/\bClerici\b/g, '克雷莉奇'],
  [/\bDommario\b/g, '多马里奥'],
  [/\bKrochi\b/g, '克罗奇'],
  [/\bChristine\b/g, '克里斯汀'],
  [/\bPugnala\b/g, '普格纳拉'],
  [/\bGiovanna\b/g, '乔凡娜'],
  [/\bPoppea\b/g, '波佩亚'],
  [/\bConcetta\b/g, '康塞塔'],
  [/\bMortaccio\b/g, '莫塔西奥'],
  [/\bCavallo\b/g, '卡瓦洛'],
  [/\bRamba\b/g, '兰巴'],
  [/\bAmbrojoe\b/g, '安布罗乔'],
  [/\bGallo\b/g, '加洛'],
  [/\bDivano\b/g, '迪瓦诺'],
  [/\bZi'Assunta\b/g, '齐阿桑塔'],
  [/\bExdash\b/g, '艾克斯达什'],
  [/\bToastie\b/g, '托斯蒂'],
  [/\bSmith\b/g, '史密斯'],
  [/\bMarrabbio\b/g, '马拉比奥'],
  [/\bAvatar\b/g, '阿凡达'],
  [/\bMinnah\b/g, '明娜'],
  [/\bLeda\b/g, '莱达'],
  [/\bCosmo\b/g, '科斯莫'],
  [/\bPeppino\b/g, '佩皮诺'],
  [/\bTrouser\b/g, '特劳瑟'],
  [/\bGyorunton\b/g, '焦伦顿'],
  [/\bRose\b/g, '罗斯'],
  [/\bMiang\b/g, '米昂'],
  [/\bMenya\b/g, '门雅'],
  [/\bSyuuto\b/g, '修托'],
  [/\bEleanor\b/g, '埃莉诺'],
  [/\bMaruto\b/g, '马鲁托'],
  [/\bKeitha\b/g, '凯莎'],
  [/\bSammy\b/g, '萨米'],
  [/\bCrewmate\b/g, '船员'],
  [/\bEngineer\b/g, '工程师'],
  [/\bGhost\b/g, '幽灵'],
  [/\bShapeshifter\b/g, '变形者'],
  [/\bGuardian\b/g, '守护者'],
  [/\bImpostor\b/g, '内鬼'],
  [/\bImposter\b/g, '内鬼'],
  [/\bScientist\b/g, '科学家'],
  [/\bHorse\b/g, '马'],
  [/\bRina\b/g, '莉娜'],
  [/\bLeon\b/g, '利昂'],
  [/\bTrevor\b/g, '特雷弗'],
  [/\bChristopher\b/g, '克里斯托弗'],
  [/\bSimon\b/g, '西蒙'],
  [/\bJuste\b/g, '贾斯特'],
  [/\bRichter\b/g, '里希特'],
  [/\bJulius\b/g, '尤利乌斯'],
  [/\bJohn\b/g, '约翰'],
  [/\bSoma\b/g, '索玛'],
  [/\bCharlotte\b/g, '夏洛特'],
  [/\bEric\b/g, '埃里克'],
  [/\bKugutsu\b/g, '库古苏'],
  [/\bBonnie\b/g, '邦妮'],
  [/\bDolores\b/g, '多洛雷斯'],
  [/\bKina\b/g, '基娜'],
  [/\bImakoo\b/g, '伊玛库'],
  [/\bJimbo\b/g, '吉姆博'],
  [/\bCanio\b/g, '卡尼奥'],
  [/\bChicot\b/g, '奇科'],
  [/\bPerkeo\b/g, '珀基奥'],

  // --- batch 3: more remaining common words ---
  // extra nouns
  [/\bregular\b/gi, '普通'],
  [/\bnormal\b/gi, '正常'],
  [/\bhealth\b/gi, '生命'],
  [/\bhp\b/gi, 'HP'],
  [/\bmax\b/gi, '最大'],
  [/\bsecond\b/gi, '秒'],
  [/\bseconds?\b/gi, '秒'],
  [/\bminute\b/gi, '分钟'],
  [/\bminutes?\b/gi, '分钟'],
  [/\blife\b/gi, '生命'],
  [/\bfollower\b/gi, '随从'],
  [/\bfollowers\b/gi, '随从'],
  [/\bvacuum\b/gi, '真空'],
  [/\baura\b/gi, '光环'],
  [/\bflame\b/gi, '火焰'],
  [/\bsword\b/gi, '剑'],
  [/\bdemon\b/gi, '恶魔'],
  [/\bdragon\b/gi, '龙'],
  [/\bgun\b/gi, '枪'],
  [/\bguns?\b/gi, '枪'],
  [/\bcat\b/gi, '猫'],
  [/\bcats?\b/gi, '猫'],
  [/\bdice\b/gi, '骰子'],
  [/\bprobability\b/gi, '概率'],
  [/\bfrequency\b/gi, '频率'],
  [/\bbehavior\b/gi, '行为'],
  [/\bmultiply\b/gi, '乘以'],
  [/\bmultiplied\b/gi, '乘以'],
  [/\bmultiplying\b/gi, '乘以'],
  [/\bmultiplies\b/gi, '乘以'],
  [/\breminder\b/gi, '提示'],
  [/\boption\b/gi, '选项'],
  [/\boptions?\b/gi, '选项'],
  [/\bname\b/gi, '名字'],
  [/\bnames?\b/gi, '名字'],
  [/\btable\b/gi, '表格'],
  [/\bpoints?\b/gi, '点'],
  [/\bdifference\b/gi, '差异'],
  [/\bnote\b/gi, '注意'],
  [/\bdice\b/gi, '骰子'],
  [/\bcoffin\b/gi, '棺材'],
  [/\bclassroom\b/gi, '教室'],
  [/\bbonus\b/gi, '加成'],
  [/\bvariant\b/gi, '变体'],
  [/\bvariant\b/gi, '变体'],
  [/\bvalue\b/gi, '数值'],
  [/\bremnant\b/gi, '残余'],
  [/\bsprite\b/gi, '精灵'],
  [/\bsprites?\b/gi, '精灵'],

  // extra verbs
  [/\bgetting\b/gi, '获得'],
  [/\bget\b/gi, '获得'],
  [/\bgive\b/gi, '给予'],
  [/\bgives\b/gi, '给予'],
  [/\bgiving\b/gi, '给予'],
  [/\breplace\b/gi, '替换'],
  [/\breplaced\b/gi, '替换'],
  [/\bfollows?\b/gi, '跟随'],
  [/\bfollowing\b/gi, '跟随'],
  [/\bfollowed\b/gi, '跟随'],
  [/\bdarken\b/gi, '变暗'],
  [/\bdarkens?\b/gi, '变暗'],
  [/\bzoom\b/gi, '缩放'],
  [/\bzooms?\b/gi, '缩放'],
  [/\btransform\b/gi, '变形'],
  [/\btransforms?\b/gi, '变形'],
  [/\btransforming\b/gi, '变形'],
  [/\btransformations?\b/gi, '变形'],
  [/\bpose\b/gi, '摆姿势'],
  [/\bposes?\b/gi, '摆姿势'],
  [/\bdepend\b/gi, '取决于'],
  [/\bdepends?\b/gi, '取决于'],
  [/\bchange\b/gi, '改变'],
  [/\bchanges?\b/gi, '改变'],
  [/\bchanged\b/gi, '改变'],
  [/\bchanging\b/gi, '改变'],
  [/\bend\b/gi, '结束'],
  [/\bends?\b/gi, '结束'],
  [/\bended\b/gi, '结束'],
  [/\bfreeze\b/gi, '冰冻'],
  [/\bfreezes?\b/gi, '冰冻'],
  [/\bfrozen\b/gi, '冰冻'],
  [/\breset\b/gi, '重置'],
  [/\bresets?\b/gi, '重置'],
  [/\bresetting\b/gi, '重置'],
  [/\bequip\b/gi, '装备'],
  [/\bequips?\b/gi, '装备'],
  [/\bequipped\b/gi, '装备'],
  [/\bmove\b/gi, '移动'],
  [/\bmoves?\b/gi, '移动'],
  [/\bmoved\b/gi, '移动'],
  [/\bheal\b/gi, '治疗'],
  [/\bheals?\b/gi, '治疗'],
  [/\bhealing\b/gi, '治疗'],
  [/\bignore\b/gi, '忽略'],
  [/\bignores?\b/gi, '忽略'],
  [/\bignored\b/gi, '忽略'],
  [/\berase\b/gi, '抹除'],
  [/\berases?\b/gi, '抹除'],
  [/\bdestroy\b/gi, '摧毁'],
  [/\bdestroyed\b/gi, '摧毁'],
  [/\bstay\b/gi, '保持'],
  [/\bstays?\b/gi, '保持'],
  [/\bteam\b/gi, '组队'],
  [/\bteams?\b/gi, '组队'],
  [/\bpick\b/gi, '选取'],
  [/\bpicks?\b/gi, '选取'],

  // extra adjectives/adverbs
  [/\bstrong\b/gi, '强'],
  [/\bstronger\b/gi, '更强'],
  [/\bweak\b/gi, '弱'],
  [/\bweaker\b/gi, '更弱'],
  [/\bfast\b/gi, '快速'],
  [/\bfaster\b/gi, '更快'],
  [/\bslow\b/gi, '慢'],
  [/\bslower\b/gi, '更慢'],
  [/\blong\b/gi, '长'],
  [/\blonger\b/gi, '更长'],
  [/\bhigh\b/gi, '高'],
  [/\bhigher\b/gi, '更高'],
  [/\bhighest\b/gi, '最高'],
  [/\blow\b/gi, '低'],
  [/\blower\b/gi, '更低'],
  [/\bfull\b/gi, '满'],
  [/\bfully\b/gi, '完全'],
  [/\bdirect\b/gi, '直接'],
  [/\bdirectly\b/gi, '直接'],
  [/\bexactly\b/gi, '精确'],
  [/\bapproximately\b/gi, '大约'],
  [/\broughly\b/gi, '大约'],
  [/\bmissing\b/gi, '缺失'],
  [/\bproportional\b/gi, '成比例'],
  [/\bproportion\b/gi, '比例'],
  [/\bpart\b/gi, '部分'],
  [/\bparts?\b/gi, '部分'],
  [/\bsignificantly\b/gi, '显著'],
  [/\bslightly\b/gi, '略微'],

  // extra pronouns/quantifiers
  [/\bany\b/gi, '任何'],
  [/\bits\b/gi, '它的'],
  [/\btheir\b/gi, '他们的'],
  [/\bthem\b/gi, '他们'],
  [/\bthese\b/gi, '这些'],
  [/\bthose\b/gi, '那些'],
  [/\bthat\b/gi, '该'],
  [/\bthis\b/gi, '此'],
  [/\bmany\b/gi, '大量'],
  [/\bseveral\b/gi, '若干'],
  [/\bfew\b/gi, '少量'],
  [/\bvarious\b/gi, '各种'],
  [/\bsame\b/gi, '相同'],
  [/\bdifferent\b/gi, '不同'],
  [/\bentire\b/gi, '整个'],
  [/\bwhole\b/gi, '整个'],
  [/\bhalf\b/gi, '一半'],
  [/\bdouble\b/gi, '双倍'],
  [/\btriple\b/gi, '三倍'],
  [/\bnothing\b/gi, '无'],
  [/\beverything\b/gi, '一切'],
  [/\bsomething\b/gi, '某物'],
  [/\banything\b/gi, '任何事物'],

  // extra compound phrases
  [/\bit\s+is\b/gi, '它是'],
  [/\bit\'s\b/gi, '它是'],
  [/\bthat\'s\b/gi, '那是'],
  [/\bdon\'t\b/gi, '不'],
  [/\bdoesn\'t\b/gi, '不'],
  [/\bcan\'t\b/gi, '无法'],
  [/\bwon\'t\b/gi, '不会'],
  [/\bit\'ll\b/gi, '它会'],
  [/\bhas\s+been\b/gi, '已被'],
  [/\bhave\s+been\b/gi, '已被'],
  [/\bsuch\s+as\b/gi, '诸如'],
  [/\bin\s+total\b/gi, '总共'],
  [/\bin\s+the\s+game\b/gi, '在游戏中'],
  [/\bfor\s+the\s+remainder\b/gi, '剩余'],
  [/\bthe\s+rest\s+of\b/gi, '其余的'],
  [/\bwithin\s+a\b/gi, '在...内'],

  // extra name replacements
  [/\bO'Sole\b/g, '奥索莱'],
  [/\bGazebo\b/g, '加泽博'],
  [/\bSecretino\b/g, '秘密蒂诺'],
  [/\bGyoruntin\b/g, '焦伦丁'],
  [/\bBabi-Onna\b/g, '巴比翁纳'],
  [/\bje-ne-viv\b/gi, '热内维'],
  [/\bJe-Ne-Viv\b/g, '热内维'],
  [/\bAmeya\b/g, '阿美雅'],
  [/\bFormina\b/g, '福尔米纳'],
  [/\bTsunanori\b/g, '纲纪'],
  [/\bSurvarot\b/g, '苏瓦罗'],
  [/\bRobbert\b/g, '罗贝特'],
  [/\bApenta\b/g, '阿彭塔'],
  [/\bBelpaese\b/g, '贝尔帕斯'],

  // final cleanup
  [/，\s*，/g, '，'],
  [/。\s*。/g, '。'],
  [/\s{2,}/g, ' '],
];

// --- unlock 条件翻译 ---
const unlockReplacements = [
  ['default', '初始角色'],
  ['默认解锁', '默认解锁'],
  // 基础解锁
  ['Get [[Fire Wand]] to level 4.', '将 火之魔杖 升至4级。'],
  ['Get [[Lightning Ring]] to level 4.', '将 闪电戒指 升至4级。'],
  ['Get Garlic to level 7.', '将 大蒜 升至7级。'],
  ['Get Pentagram to Level 7.', '将 五芒星 升至7级。'],
  ['Recover a total of 1000 HP.', '累计回复 1000 生命值。'],
  ['Earn 5000 coins in a single run.', '单局获得 5000 金币。'],
  ['Defeat a total of 100000 enemies.', '累计击败 100,000 个敌人。'],
  // 棺材
  ['Find and open the coffin in Mad Forest.', '在 疯狂森林 找到并打开棺材。'],
  ['Find and open the coffin in Inlaid Library.', '在 镶嵌图书馆 找到并打开棺材。'],
  ['Find and open the coffin in Dairy Plant.', '在 乳品厂 找到并打开棺材。'],
  ['Find and open the coffin in Gallo Tower.', '在 加洛塔 找到并打开棺材。'],
  ['Find and open the coffin in [[Cappella Magna]].', '在 大教堂 找到并打开棺材。'],
  ['Find and open the coffin in [[Mt.Moonspell]].', '在 月咒山 找到并打开棺材。'],
  ['Find and open the coffin in Lake Foscari.', '在 福斯卡里湖 找到并打开棺材。'],
  ['Find and open the coffin in [[Polus Replica]].', '在 波鲁斯复制区 找到并打开棺材。'],
  ['Find and open the coffin in Neo Galuga', '在 新加鲁加 找到并打开棺材。'],
  ['Find and open the coffin in Hectic Highway.', '在 繁忙公路 找到并打开棺材。'],
  ['Find and open the enemy coffin in Hectic Highway.', '在 繁忙公路 找到并打开敌人棺材。'],
  ['Find and open the coffin in the Ante Chamber.', '在 前厅 找到并打开棺材。'],
  ['Finding and opening the first coffin in Emerald Diorama.', '在 翡翠幻境 找到并打开第一个棺材。'],
  ['Finding and opening the second coffin in Emerald Diorama.', '在 翡翠幻境 找到并打开第二个棺材。'],
  // 特殊击败
  ['Defeat a total of 3000 skeletons or enter the Konami Code in the main menu, then type "spam" in the character select and press enter.', '累计击败 3000 个骷髅，或在主菜单输入科乐美秘技后在选人界面输入 "spam" 并回车。'],
  ['Defeat a total of 3000 Lion Heads.', '累计击败 3000 个 狮头。'],
  ['Defeat a total of 3000 Milk Elementals.', '累计击败 3000 个 牛奶元素。'],
  ['Defeat a total of 3000 Dragon Shrimps.', '累计击败 3000 个 龙虾。'],
  ['Defeat a total of 6000 Stage Killers.', '累计击败 6000 个 舞台杀手。'],
  ['Defeat 6000 [[Kappa]].', '击败 6000 个 河童。'],
  ['Defeat a total of 6000 Sammies.', '累计击败 6000 个 Sammy。'],
  ['Defeat 6000 [[Rotting Ghoul]].', '击败 6000 个 腐尸。'],
  ['Defeat a total of 6000 suspicious looking enemies.', '累计击败 6000 个可疑的敌人。'],
  ['Defeat 1 enemy with Ghost Lino?!', '用 幽灵里诺 击败1个敌人？！'],
  // 超武获得
  ['Obtain the [[Infinite Corridor]]', '获得 无尽回廊。'],
  ['Obtain the [[Crimson Shroud]]', '获得 深红裹尸布。'],
  ['Complete the [[Collection]].', '完成 收藏 全收集。'],
  // 存活
  ['Survive 20 minutes with at least 10% {{Stat|Curse}} active.', '在至少 10% 诅咒下存活 20 分钟。'],
  ['Survive 20 minutes in The Lycaeum.', '在 课堂 存活 20 分钟。'],
  ['Survive 20 minutes in The [[Laborratory]].', '在 实验室 存活 20 分钟。'],
  ['Survive 20 minutes in [[The Coop]]', '在 鸡舍 存活 20 分钟。'],
  ['Survive 20 minutes in [[Westwoods]].', '在 西林 存活 20 分钟。'],
  ['Survive 20 minutes in [[Space 54]].', '在 太空54 存活 20 分钟。'],
  ['Survive the [[Boss Rash]] with just one [[weapon]].', '仅用一把武器通关 Boss Rush。'],
  // 进化
  ['Evolve the [[Pako Battiliar]].', '进化 帕科战蝠。'],
  ['Evolve the [[Ammo Appalate]].', '进化 弹药装置。'],
  ['Evolve the Unearthly Bolt', '进化 异界闪电。'],
  ['Evolve the {{slink|Silver Wind}}.', '进化 银风。'],
  ['Evolve the {{slink|Four Seasons}}.', '进化 四季。'],
  ['Evolve the {{slink|Summon Night}}.', '进化 暗夜召唤。'],
  ['Evolve the {{slink|Mirage Robe}}.', '进化 幻影长袍。'],
  ['Evolve the [[Sharp Tongue]]', '进化 利舌。'],
  ['Evolve the Lifesign Scan', '进化 生命信号扫描。'],
  ['Evolve the Science Rocks', '进化 科学之石。'],
  ['Evolve the Report!', '进化 报告！'],
  ['Evolve the Lucky Swipe', '进化 幸运一刷。'],
  ['Defeat 1 enemy with Ghost Lino?!', '用 幽灵里诺 击败1个敌人？！'],
  ['Evolve the [[Alucart Sworb]].', '进化 阿鲁卡多之剑。'],
  ['Evolve the Jet Black Whip.', '进化 漆黑之鞭。'],
  ['Evolve the Wind Whip.', '进化 风之鞭。'],
  ['Evolve the Guardian\'s Targe.', '进化 守护者盾牌。'],
  ['Evolve the Water Dragon Whip.', '进化 水龙之鞭。'],
  ['Evolve the Javelin.', '进化 标枪。'],
  ['Evolve the Iron Ball and the Alucard Spear.', '进化 铁球 和 阿鲁卡多长矛。'],
  ['Evolve the [[Platinum Whip]] after unlocking [[Vlad Tepes Dracula]].', '解锁 弗拉德·特佩斯·德古拉 后进化 白金之鞭。'],
  ['Evolve the [[Vibhuti Whip]] after unlocking [[Vlad Tepes Dracula]].', '解锁 弗拉德·特佩斯·德古拉 后进化 圣灰之鞭。'],
  ['Evolve the [[Tyrfing]]', '进化 提尔锋。'],
  ['Evolve [[Globus]]', '进化 球体。'],
  ['Evolve the [[Star Flail]].', '进化 星之连枷。'],
  ['Evolve the [[Iron Shield]]', '进化 铁盾。'],
  ['Evolve {{slink|Umbra}}', '进化 暗影。'],
  ['Evolve the [[Mace]].', '进化 钉头锤。'],
  ['Evolve the [[Alchemy Whip]] after unlocking [[Vlad Tepes Dracula]].', '解锁 弗拉德·特佩斯·德古拉 后进化 炼金之鞭。'],
  ['Evolve the [[Fulgur]] and [[Keremet Bubbles]] across any amount of runs.', '在多局游戏中进化 闪电 和 克雷默气泡。'],
  ['Evolve the [[Wine Glass]].', '进化 酒杯。'],
  ['Evolve the [[Luminatio]].', '进化 光辉。'],
  ['Evolve the [[Sonic Whip]].', '进化 音速之鞭。'],
  ['Evolve the [[Silver Revolver]].', '进化 银色左轮。'],
  ['Evolve the [[Optical Shot]].', '进化 光学射击。'],
  ['Evolve Infernolatro.', '进化 地狱崇拜。'],
  ['Evolve Fibonacci Spritz.', '进化 斐波那契喷雾。'],
  ['Evolve the Gros Michel.', '进化 大麦克。'],
  ['Evolving the [[Eskizzibur]].', '进化 埃斯基祖尔。'],
  ['Evolving Long Gun', '进化 长枪。'],
  ['Evolving the Short Gun', '进化 短枪。'],
  ['Evolving the Spread Shot', '进化 散弹。'],
  ['Evolving Firearm', '进化 火器。'],
  ['Evolving Sonic Bloom', '进化 音速绽放。'],
  ['Evolving the Divers Mines.', '进化 潜水雷。'],
  ['Evolving the [[Trident]]', '进化 三叉戟。'],
  ['Evolve the [[Hand Grenade]].', '进化 手雷。'],
  ['Evolve the [[Raging Fire]] [[Ice Fang]], [[Gale Force]], and [[Keremet Bubbles]].', '进化 烈焰、冰牙、狂风 和 克雷默气泡。'],
  ['Fully evolve the Cuctos glyphs', '完全进化 诅咒雕文。'],
  ['Fully evolving the {{slink|Splashers}}', '完全进化 泼洒者。'],
  ['Fully evolving {{slink|Kick}}.', '完全进化 踢击。'],
  ['Fully evolving the {{slink|Twin Dragon}}', '完全进化 双龙。'],
  ['Fully evolve {{slink|Confodere}}', '完全进化 穿刺。'],
  ['Unite {{slink|SpellString}} {{slink|SpellStream}}, and {{slink|SpellStrike}}.', '合体 法术弦、法术流 和 法术打击。'],
  // 武器收集
  ['Finding 7 Barriers', '找到 7 个 屏障。'],
  ['Finding 14 Rapid Fires', '找到 14 个 速射。'],
  ['Finding 21 Grenades', '找到 21 个 手雷。'],
  ['Defeating Big Fuzz in Neo Galuga', '在新加鲁加击败 大毛球。'],
  // 单局击败
  ['Defeat 100000 enemies in a single run with [[Menya Moonspell]].', '用 月咒门也 单局击败 100,000 个敌人。'],
  ['Defeat 100000 enemies in a single run with [[Syuuto Moonspell]].', '用 月咒修吾 单局击败 100,000 个敌人。'],
  ['Defeat 100000 enemies in a run with Impostor Rina.', '用 莉娜伪装者 单局击败 100,000 个敌人。'],
  ['Defeating 100000 enemies in a single run with [[Genevieve Gruyère]].', '用 格涅维芙·格吕耶尔 单局击败 100,000 个敌人。'],
  // 特殊条件
  ['With [[Maruto]] break the Seal of the Abyss.', '用 玛鲁托 打破深渊封印。'],
  ['Defeat the Giant Medusa Head with [[Leon Belmont]].', '用 里昂·贝尔蒙特 击败巨大美杜莎之首。'],
  ['Defeat Gergoth with Julius Belmont.', '用 尤里乌斯·贝尔蒙特 击败 格戈斯。'],
  ['Defeat Slogra and Gaibon with Grant Danasty.', '用 格兰特·达纳斯提 击败 斯洛格拉 和 盖邦。'],
  ['Defeat Abaddon with [[Soma Cruz]].', '用 来须苍真 击败 亚巴顿。'],
  ['Defeat the Doppelganger with Trevor Belmont.', '用 特雷弗·贝尔蒙特 击败 二重身。'],
  ['Complete any stage with Shanoa and Juste Belmont.', '用 夏诺雅 和 祖斯特·贝尔蒙特 通关任意关卡。'],
  ['Finish a run with Richter Belmont.', '用 里希特·贝尔蒙特 完成一局游戏。'],
  // 寻找物品
  ['Find 7 Heart Refresh after opening the Stallion Gate.', '打开种马之门后找到 7 个 心之刷新。'],
  ['Find 7 Mirrors of Truth after opening the Capra Gate.', '打开卡普拉之门后找到 7 个 真理之镜。'],
  ['Find 7 Karma Coins after opening the Scorpion Gate.', '打开蝎子之门后找到 7 个 业力硬币。'],
  // 秘密角色
  ['Settle the score with [[the Reaper]].', '与死神算账。'],
  ['Master all 16 [[Stage item|accessories]] in [[Moongolow]].', '在 月神谷 精通所有 16 个关卡道具。'],
  ['Be a good boy in Il Molise.', '在 伊尔莫利塞 做一只好狗。'],
  ['Find the only one place where flowers bloom in [[The Bone Zone]].', '在 白骨区 找到唯一开花之处。'],
  ['It\'s as simple as ABC: obtain the ring of rings.', '简单如ABC：获得指环之戒。'],
  ['Her royal shadow lies behind the 46th door.', '她的皇家暗影隐藏在 46 号门后。'],
  ['Witness the 17th Colossus wander to new horizons.', '见证第 17 巨像走向新天地。'],
  ['Discover the source of the roaring thunder on the [[Tiny Bridge]].', '在小桥上发现咆哮雷声之源。'],
  ['Forsake victory in favor of sightseeing in [[Carlo Cart]].', '在卡罗卡丁车中放弃胜利，选择观光。'],
  ['Spend your afterparty with the foolish high roller.', '与愚蠢的豪赌者共度余兴派对。'],
  ['Quickly break the bounds of [[Space 54|Space]] and find [[Photonstorm]].', '迅速突破太空边界并找到 光子风暴。'],
  ['1) Cast the [[Spells|spell]] x-x1viiq or find a lot of {{slink|Pie|pies}}. 2) Uppercut a non-red reaper 3) Sometimes you just need to ask for help.', '1)施放咒语 x-x1viiq 或找到大量派。2)对非红色死神使用上勾拳。3)有时只需要寻求帮助。'],
  ['Look under previously owned [[coffin]]s.', '在之前获得的棺材下寻找。'],
  ['Follow the [[Pickups#Pie|trail]] after pillaging {{slink|Pie|pies}}', '洗劫所有派后追随踪迹。'],
  ['It is tangible only in the inverted [[Inlaid Library]]. [[Pickups#Pie|Good luck]].', '仅在逆镶嵌图书馆中可见。祝你好运。'],
  ['Deal with the consequence of stealing [[Pickups#Cheese|cheese]].', '承担偷奶酪的后果。'],
  ['Investigate the bottom of [[Gallo Tower]].', '调查加洛塔底部。'],
  ['With a [[Golden Egg|pure heart]] and two [[Peachone|good]] birds, visit the [[Eudaimonia Machine|Eudaimonia M.]]', '怀着纯净之心和两只善良之鸟，造访幸福机器。'],
  ['Find and open the first coffin in [[Ode to Castlevania]]', '在 恶魔城颂歌 找到并打开第一个棺材。'],
  ['Find and open the second coffin in Ode to Castlevania.', '在 恶魔城颂歌 找到并打开第二个棺材。'],
  ['Find and open the third coffin in Ode to Castlevania.', '在 恶魔城颂歌 找到并打开第三个棺材。'],
  ['Find and open the fourth Coffin in Ode to Castlevania.', '在 恶魔城颂歌 找到并打开第四个棺材。'],
  // 秘密角色 unlock
  ['1) Cast the [[Spells|spell]] x-x1viiq or find a lot of {{slink|Pie|pies}}. 2) Uppercut a non-red reaper 3) Sometimes you just need to ask for help.', '1)施放咒语x-x1viiq或找到大量派。2)对非红色死神使用上勾拳。3)有时只需要寻求帮助。'],
  ['Follow the [[Pickups#Pie|trail]] after pillaging {{slink|Pie|pies}}', '洗劫所有派后追随派之踪迹。'],
  ['It is tangible only in the inverted [[Inlaid Library]]. [[Pickups#Pie|Good luck]].', '仅在逆镶嵌图书馆中可见。祝好运。'],
  ['Deal with the consequence of stealing [[Pickups#Cheese|cheese]].', '承担从乳品厂偷奶酪的后果。'],
  ['With a [[Golden Egg|pure heart]] and two [[Peachone|good]] birds, visit the [[Eudaimonia Machine|Eudaimonia M.]]', '怀着纯净之心和两只善良之鸟，造访幸福机器。'],
  ['Quickly break the bounds of [[Space 54|Space]] and find [[Photonstorm]].', '迅速突破太空边界找到光子风暴。'],
  ['Unite {{slink|SpellString}} {{slink|SpellStream}}, and {{slink|SpellStrike}}.', '合体 法术弦、法术流、法术打击。'],
  ['With [[Maruto]] break the Seal of the Abyss.', '用玛鲁托打破深渊封印。'],
  // Emerald Diorama unlock
  ['Defeating his demon form with {{slink|Bonnie Blair}} or {{slink|Macha}}. (inverse)', '在逆翡翠幻境用邦尼·布莱尔或玛卡击败他的恶魔形态。'],
  ['Defeating his demon form with {{slink|Bonnie Blair}} or {{slink|Formina Franklyn}} in Grelon in Inverse Emerald Diorama.', '在逆翡翠幻境的格雷隆用邦尼·布莱尔或福米娜·弗兰克林击败他的恶魔形态。'],
  ['Defeating the {{slink|Specter of Iwanaga-hime}} with {{slink|Eric Lecarde}}.', '用艾瑞克·勒卡德击败岩永姬之灵。'],
  ['Defeating the {{slink|Specter of Iwanaga-hime}} with {{slink|Siugnas}} in Yomi in Inverse Emerald Diorama.', '在逆翡翠幻境的黄泉用休格纳斯击败岩永姬之灵。'],
  ['Defeating the {{slink|Iron Maiden}} in Avalon in Inverse Emerald Diorama.', '在逆翡翠幻境的阿瓦隆击败铁处女。'],
  ['Defeating the {{slink|Iron Maiden}} in Avalon in Inverse Emerald Diorama with {{slink|Ameya Aisling}}.', '在逆翡翠幻境的阿瓦隆用阿梅娅·艾斯林击败铁处女。'],
  ['Defeating the {{slink|Earth Dragon}} in Inverese Emerald Diorama.', '在逆翡翠幻境击败土龙。'],
  ['Defeating the {{slink|Earth Dragon}} in Inverese Emerald Diorama, Pulchra with {{slink|Tsunanori Mido}}.', '在逆翡翠幻境内，用御堂纲纪击败土龙普克拉。'],
  ['Defeating {{slink|Divine Wood Spirit}} in Miyako City in Inverse Emerald Diorama.', '在逆翡翠幻境的宫古城击败神木之灵。'],
  ['Defeat [[Living Anguish]] as [[Diva No. 5]] in [[Emerald Diorama]].', '在翡翠幻境以歌姬5号击败活体痛苦。'],
  ['Defeating {{slink|Living Anguish}} as {{slink|Diva No. 5}} in {{slink|Emerald Diorama}} with Inverse Mode enabled.', '在逆模式启用下的翡翠幻境以歌姬5号击败活体痛苦。'],
  ['Gather the largest cadre of cats including those that want to travel, get fit, rock on, and go on wild adventures.', '集结最庞大的猫军团，包括想旅行、健身、摇滚和冒险的猫。'],
  ['Gathering the largest cadre of cats, including those that want to travel, get fit, rock on, and go on wild adventures.', '集结最庞大的猫军团，包括想旅行、健身、摇滚和冒险的猫。'],
  ['End anguish with an otherworldly melody as the greatest mechanical diva in Emerald Diorama.', '在翡翠幻境以最伟大的机械歌姬之异世旋律终结痛苦。'],
  ['Let the last ruler re-freeze his most monstrous form.', '让最后的统治者重新冻结他最怪物的形态。'],
  ['Defy the call to adventure in Emerald Diorama.', '在翡翠幻境违抗冒险的召唤。'],
  ['Defying the call to adventure in Emerald Diorama.', '在翡翠幻境违抗冒险的召唤。'],

  // Evolve with extra clauses
  ['Evolve {{slink|Raging Fire}}, {{slink|Ice Fang}}, {{slink|Gale Force}}, and {{slink|Rock Riot}} across any amount of runs.', '在多局游戏中进化 烈焰、冰牙、狂风 和 岩石暴乱。'],

  // Multi-part secrets (duplicates with different formatting)
  ['1) Cast the [[Spells|spell]] x-x1viiq or find a lot of {{slink|Pie|pies}}. 2) Uppercut a non-red reaper 3) Sometimes you just need to ask for help.', '1)施放咒语x-x1viiq或找到大量派。2)对非红色死神使用上勾拳。3)有时只需要寻求帮助。'],
  ['It is tangible only in the inverted [[Inlaid Library]]. [[Pickups#Pie|Good luck]].', '仅在逆镶嵌图书馆中可见。祝好运。'],
  ['It is tangible only in the inverted [[Inlaid Library]]. Good friends might then show the way.', '仅在逆镶嵌图书馆中可见。好友会指引方向。'],

  // Follow trail
  ['Follow the trail after pillaging {{slink|Pummarola}} and {{slink|Skull O\'Maniac}}.', '洗劫番茄和骷髅狂之后跟随踪迹。'],
  ['Follow the [[Pickups#Pie|trail]] after pillaging {{slink|Pie|pies}}', '洗劫所有派后追随踪迹。'],

  // Deal with consequence
  ['Deal with the consequence of stealing cheese from the Dairy Plant.', '承担从乳品厂偷奶酪的后果。'],
  ['Dealing with the consequence of stealing cheese from the Dairy Plant.', '承担从乳品厂偷奶酪的后果。'],

  // Toastie / Smith secret parts
  ['2) Uppercut a non-red reaper', '2)对非红色死神使用上勾拳'],
  ['2) Uppercut non-red reaper', '2)对非红色死神使用上勾拳'],
  ['3) Sometimes you just need to ask for help.', '3)有时只需要寻求帮助。'],

  // Follow trail variants
  ['Follow trail after pillaging {{slink|Pummarola}} and {{slink|Skull O\'Maniac}} from Mad Forest.', '在疯狂森林洗劫番茄和骷髅狂之后跟随踪迹。'],
  ['Follow the trail after pillaging {{slink|Pummarola}} and {{slink|Skull O\'Maniac}} from [[Mad Forest]].', '在疯狂森林洗劫番茄和骷髅狂之后跟随踪迹。'],

  // Fiery balcony
  ['With pure heart and two good friends, visit the fiery balcony in Cappella Magna.', '怀着纯净之心和两个好友，造访大教堂的烈焰阳台。'],
  ['With a pure heart and two good friends, visit the fiery balcony in [[Cappella Magna]].', '怀着纯净之心和两个好友，造访大教堂的烈焰阳台。'],

  // Cats that want to fight
  ['Gather the largest cadre of cats, including those that want to fight.', '集结最庞大的猫军团，包括那些想战斗的猫。'],
  ['Gather largest cadre of cats, including those that want to fight.', '集结最庞大的猫军团，包括那些想战斗的猫。'],

  // Mechanical songstress
  ['End anguish with an otherworldly melody as the greatest mechanical songstress.', '以最伟大的机械歌姬的异世旋律终结痛苦。'],
  ['End anguish with otherworldly melody as greatest mechanical songstress.', '以最伟大的机械歌姬的异世旋律终结痛苦。'],

  // ===== 半翻译残留修复 (部分之前运行已翻译的 unlock) =====
  // Inverse Emerald Diorama boss conditions
  ['使用 Bonnie Blair 或 Formina Franklyn 在格雷隆 Inverse Emerald Diorama 击败 他的恶魔形态。', '在逆翡翠幻境的格雷隆用 邦尼·布莱尔 或 福米娜·弗兰克林 击败他的恶魔形态。'],
  ['使用 Siugnas 在黄泉 Inverse Emerald Diorama 击败 之灵 Iwanaga-hime。', '在逆翡翠幻境的黄泉用 休格纳斯 击败 岩永姬之灵。'],
  ['使用 Ameya Aisling 击败 铁处女 在阿瓦隆 Inverse Emerald Diorama。', '在逆翡翠幻境的阿瓦隆用 阿梅娅·艾斯林 击败 铁处女。'],
  ['使用 Tsunanori Mido 击败 土龙 Inverese Emerald Diorama, 普克拉。', '在逆翡翠幻境中用 御堂纲纪 击败 土龙 普克拉。'],
  ['使用 Inverse Mode 启用 击败 Living Anguish 当 Diva 无. 5 Emerald Diorama。', '在逆模式启用下的翡翠幻境以 歌姬5号 击败 活体痛苦。'],

  // Whip evolutions after unlocking Dracula
  ['进化 Platinum Whip, 解锁后 Vlad Tepes Dracula。', '解锁 弗拉德·特佩斯·德古拉 后进化 白金之鞭。'],
  ['进化 Vibhuti Whip, 解锁后 Vlad Tepes Dracula。', '解锁 弗拉德·特佩斯·德古拉 后进化 圣灰之鞭。'],
  ['进化 Alchemy Whip, 解锁后 Vlad Tepes Dracula。', '解锁 弗拉德·特佩斯·德古拉 后进化 炼金之鞭。'],

  // Multi-item evolution across runs
  ['进化 Raging Fire, Ice Fang, Gale Force,， Rock Riot 跨 任意数量的 局。', '在多局游戏中进化 烈焰、冰牙、狂风 和 岩石暴乱。'],

  // Toastie/Smith secrets - partially translated
  ['It 可见 仅在 逆 Inlaid Library. 好友 会指引 方向.', '仅在逆镶嵌图书馆中可见。好友会指引方向。'],
  ['Quickly break bounds 的 Space， 发现 Love.', '迅速突破太空边界找到光子风暴。'],

  // Maruto seal
  ['以 Maruto, break Seal 的 Abyss.', '用 玛鲁托 打破深渊封印。'],

  // Additional secret patterns
  ['进化 Infernolatro.', '进化 地狱崇拜。'],
  ['进化 Fibonacci Spritz.', '进化 斐波那契喷雾。'],
  [' 进化 Report!', '进化 报告！'],
  ['完全进化 Cuctos glyphs', '完全进化 诅咒雕文。'],

  // Contra patterns
  [' 发现 7 Barriers', '找到 7 个 屏障。'],
  [' 发现 14 Rapid Fires', '找到 14 个 速射。'],
  [' 发现 21 Grenades', '找到 21 个 手雷。'],
  ['击败 Big Fuzz Neo Galuga', '在 新加鲁加 击败 大毛球。'],
];

// --- 翻译 passiveDesc ---
function translatePassive(text) {
  if (!text) return text;
  let result = text;

  // Apply phrase replacements
  for (const [pattern, replacement] of phraseReplacements) {
    result = result.replace(pattern, replacement);
  }

  // Replace stats - {{Stat|Name}}
  for (const [en, zh] of Object.entries(statMap)) {
    result = result.replace(new RegExp(`\\{\\{Stat\\|${en}\\}\\}`, 'gi'), zh);
  }

  // Replace bare stat words (standalone, not inside other words)
  const commonStats = ['Might', 'Growth', 'Greed', 'Curse', 'MoveSpeed', 'Magnet', 'Luck', 'Armor', 'Cooldown', 'Area', 'Duration', 'Amount', 'Revival', 'Reroll', 'Skip', 'Banish', 'Charm', 'Pierce'];
  for (const en of commonStats) {
    // Replace in context like "+20% Might" or "Might bonus"
    result = result.replace(new RegExp(`(?<=[+\\-\\d%.]\\s*)${en}\\b`, 'g'), statMap[en] || en);
    result = result.replace(new RegExp(`\\b${en}\\s*(bonus|increase|decrease|is)`, 'g'), (m, w) => `${statMap[en] || en}${w}`);
    result = result.replace(new RegExp(`\\b${en}\\b`, 'g'), (m) => {
      // Only replace if not already translated and not part of a name
      const before = result.substring(Math.max(0, result.indexOf(m) - 15), result.indexOf(m));
      if (/[a-z]/i.test(before + result.substring(result.indexOf(m) + m.length, result.indexOf(m) + m.length + 15))) {
        return m; // Still in English context, leave for now
      }
      return statMap[en] || en;
    });
  }

  // Replace item references [[ItemName]]
  result = result.replace(/\[\[([^\]]+)\]\]/g, (m, name) => {
    for (const [key, zhName] of Object.entries(itemNameMap)) {
      if (name === key || name === zhName) return zhName;
    }
    const pipeIdx = name.indexOf('|');
    if (pipeIdx > 0) return name.substring(pipeIdx + 1);
    return name;
  });

  // Replace {{slink|ItemName}}
  result = result.replace(/\{\{slink\|([^}|]+)(?:\|[^}]*)?\}\}/g, (m, name) => {
    for (const [key, zhName] of Object.entries(itemNameMap)) {
      if (name === key || name === zhName) return zhName;
    }
    return name;
  });

  // Replace {{Stat|Name}} again (any remaining)
  result = result.replace(/\{\{Stat\|([^}]+)\}\}/g, (m, name) => {
    return statMap[name.trim()] || name.trim();
  });

  // Final: remove any remaining wiki markup
  result = result.replace(/\{\{.*?\}\}/g, '');
  result = result.replace(/\[\[.*?\]\]/g, '');
  result = result.replace(/{{.*?}}/g, '');
  result = result.replace(/!?[A-Z]\w+\s*!?\s*!?[A-Z]\w+\s*!?/g, '');

  // Final cleanup
  result = result.replace(/\.{2,}/g, '。');
  result = result.replace(/，，/g, '，');
  result = result.replace(/，\s*\./g, '。');
  result = result.replace(/，\s*，/g, '，');
  result = result.replace(/；\s*；/g, '；');
  result = result.replace(/  +/g, ' ');
  result = result.trim();

  // Ensure ends with 。
  if (result && !result.endsWith('。') && !result.endsWith('）') && !result.endsWith('...')) {
    const lastChar = result.substring(result.length - 1);
    if (/[a-zA-Z0-9]/.test(lastChar)) {
      result += '。';
    } else if (!/[。！？.!?]/.test(lastChar)) {
      result += '。';
    }
  }

  return result;
}

// --- 翻译 unlock ---
function translateUnlock(text) {
  if (!text) return text;
  let result = text;
  // Try exact matches first
  for (const [en, zh] of unlockReplacements) {
    if (result === en) return zh;
  }
  // Pattern-based fallback
  // Replace [[Item]] references
  result = result.replace(/\[\[([^\]]+)\]\]/g, (m, name) => {
    for (const [key, zhName] of Object.entries(itemNameMap)) {
      if (name === key) return zhName;
    }
    const pipeIdx = name.indexOf('|');
    if (pipeIdx > 0) return name.substring(pipeIdx + 1);
    return name;
  });
  // Replace {{slink|Item}}
  result = result.replace(/\{\{slink\|([^}|]+)(?:\|[^}]*)?\}\}/g, (m, name) => {
    for (const [key, zhName] of Object.entries(itemNameMap)) {
      if (name === key || name === zhName) return zhName;
    }
    return name;
  });
  // Pattern: Evolve the X
  result = result.replace(/Evolve (?:the )?(.+?)\.?$/, '进化 $1。');
  result = result.replace(/Evolving (?:the )?(.+?)\.?$/, '进化 $1。');
  result = result.replace(/Fully evolve (?:the )?(.+?)\.?$/, '完全进化 $1。');
  result = result.replace(/Fully evolving (?:the )?(.+?)\.?$/, '完全进化 $1。');
  // Pattern: Find and open the coffin in X
  result = result.replace(/Find and open (?:the )?coffin in (.+?)\.?$/, '在 $1 找到并打开棺材。');
  result = result.replace(/Finding and opening (?:the )?coffin in (.+?)\.?$/, '在 $1 找到并打开棺材。');
  result = result.replace(/Find and open (?:the )?(first|second|third|fourth|fifth) coffin in (.+?)\.?$/, '在 $2 找到并打开第$1个棺材。');
  // Pattern: Defeat X with Y
  result = result.replace(/Defeat (?:the )?(.+) with (.+?)\.?$/, '使用 $2 击败 $1。');
  result = result.replace(/Defeating (.+) with (.+?)\.?$/, '使用 $2 击败 $1。');
  // Pattern: Survive X minutes
  result = result.replace(/Survive (\d+) minutes in (.+?)\.?$/, '在 $2 存活 $1 分钟。');
  // Pattern: Defeat X enemies
  result = result.replace(/Defeat (?:a total of )?(\d+[\d,]*) (.+?)\.?$/, '击败 $1 个 $2。');
  // Pattern: destroying X
  // Pattern: Find X after opening Y
  result = result.replace(/Find (\d+) (.+?) after opening (.+?)\.?$/, '打开 $3 后找到 $1 个 $2。');
  // Pattern: Get X to level Y
  result = result.replace(/Get (.+?) to level (\d+)\.?$/, '将 $1 升至 $2 级。');
  // Final English → Chinese word replacements
  result = result.replace(/\bor\b/g, '或');
  result = result.replace(/\bafter\s+unlocking\b/gi, '解锁后');
  result = result.replace(/\bhis\s+demon\s+form\b/gi, '他的恶魔形态');
  result = result.replace(/\bthe\s+Specter\s+of\b/gi, '之灵');
  result = result.replace(/\bthe\s+Iron\s+Maiden\b/gi, '铁处女');
  result = result.replace(/\bthe\s+Earth\s+Dragon\b/gi, '土龙');
  result = result.replace(/\bwith\s+Inverse\s+Mode\s+enabled\b/gi, '在逆模式启用下');
  result = result.replace(/\bGood\s+friends\b/gi, '好友');
  result = result.replace(/\bin\s+Yomi\b/gi, '在黄泉');
  result = result.replace(/\bin\s+Grelon\b/gi, '在格雷隆');
  result = result.replace(/\bin\s+Avalon\b/gi, '在阿瓦隆');
  result = result.replace(/\bPulchra\b/g, '普克拉');
  result = result.replace(/\bthe\s+way\b/gi, '方向');
  result = result.replace(/\bmight\s+then\s+show\b/gi, '会指引');
  result = result.replace(/\btangible\b/gi, '可见');
  result = result.replace(/\bonly\s+in\b/gi, '仅在');
  result = result.replace(/\binverted\b/gi, '逆');
  result = result.replace(/\bany\s+amount\s+of\b/gi, '任意数量的');
  result = result.replace(/\bacross\b/gi, '跨');
  result = result.replace(/\bruns?\b/gi, '局');
  result = result.replace(/\bthe\b/gi, '');
  result = result.replace(/\ba\b/gi, '');
  result = result.replace(/\ban\b/gi, '');
  result = result.replace(/,\s*,/g, '，');
  result = result.replace(/\s+/g, ' ');
  result = result.trim();
  // Clean up wiki artifacts
  result = result.replace(/\{\{.*?\}\}/g, '');
  result = result.replace(/\[\[.*?\]\]/g, '');
  result = result.replace(/{{.*?}}/g, '');
  result = result.trim();
  return result;
}

// --- 主处理 ---
// 处理被动描述
vsData = vsData.replace(/passiveDesc:\s*"([^"]*)"/g, (match, text) => {
  const translated = translatePassive(text);
  return `passiveDesc: "${translated}"`;
});

// 处理解锁条件
vsData = vsData.replace(/unlock:\s*"([^"]*)"/g, (match, text) => {
  const translated = translateUnlock(text);
  return `unlock: "${translated}"`;
});

// 写回
writeFileSync(DATA_PATH, vsData, 'utf8');

// 统计
const allPassive = [...vsData.matchAll(/passiveDesc:\s*"([^"]*)"/g)];
const allUnlock = [...vsData.matchAll(/unlock:\s*"([^"]*)"/g)];
const stillEnglish = [];
for (const [_, text] of allPassive) {
  if (/[a-zA-Z]{4,}/.test(text) && !text.includes('ABC') && !/x-x1viiq/.test(text)) {
    stillEnglish.push(`passiveDesc: ${text.substring(0, 60)}`);
  }
}
for (const [_, text] of allUnlock) {
  if (/[a-zA-Z]{4,}/.test(text) && !/ABC|Boss|Konami|x-x1viiq/.test(text)) {
    stillEnglish.push(`unlock: ${text.substring(0, 60)}`);
  }
}

console.log(`Total passiveDesc: ${allPassive.length}`);
console.log(`Total unlock: ${allUnlock.length}`);
if (stillEnglish.length > 0) {
  console.log(`\n⚠ ${stillEnglish.length} entries may still contain English:`);
  stillEnglish.forEach(e => console.log('  ', e));
} else {
  console.log('\n  All entries translated!');
}
