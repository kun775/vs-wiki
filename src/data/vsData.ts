// 吸血鬼幸存者游戏数据 v1.15
// 本文件由 scratch 脚本自动从 index.html 提取。

export interface GameItem {
  name: string;
  nameEn: string;
  type: 'base' | 'passive' | 'evolved';
  category: string;
  desc: string;
  rating?: number;
  icon?: string;
  review?: string;
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
      categories: {
        base: "本体",
        moonspell: "月咒山",
        foscari: "福斯卡里",
        amongus: "Among Us 联动",
        contra: "魂斗罗联动",
        castlevania: "恶魔城联动"
      },
      
      // 物品数据库
      items: {
        // --- 本体 (Base Game) 主武器 ---
        "whip": { name: "鞭子", nameEn: "Whip", type: "base", category: "base", icon: "🪢", desc: "向两侧横扫攻击。升级后可增加穿透和打击数。", rating: 3, review: "进化血鞭是前中期的生存核心，后期输出一般。", stats: { dps: 3, sur: 4, cc: 2, gro: 1, cdr: 2 } },
        "magic_wand": { name: "魔法杖", nameEn: "Magic Wand", type: "base", category: "base", icon: "🪄", desc: "自动锁定距离最近的敌人发射魔法弹。", rating: 3.5, review: "高频单体输出，前期击杀强力怪与Boss的利器。", stats: { dps: 3, sur: 2, cc: 2, gro: 1, cdr: 4 } },
        "knife": { name: "飞刀", nameEn: "Knife", type: "base", category: "base", icon: "🗡️", desc: "朝角色移动的方向连续射出飞刀。", rating: 3, review: "爆发输出惊人，但因为必须面朝怪，不适合作核心清怪技能。", stats: { dps: 4, sur: 1, cc: 1, gro: 1, cdr: 3 } },
        "axe": { name: "斧头", nameEn: "Axe", type: "base", category: "base", icon: "🪓", desc: "向上抛出抛物线弹道斧头，穿透高伤害。", rating: 4, review: "满级后超高基础伤害，进化死亡旋风后是顶级AOE武器。", stats: { dps: 4, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "cross": { name: "十字架", nameEn: "Cross", type: "base", category: "base", icon: "✝️", desc: "投掷出类似回力镖的十字架，回飞穿透。", rating: 3.5, review: "弹道很大，配合高暴击的天堂之剑，清理中距离怪很好用。", stats: { dps: 3, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "king_bible": { name: "国王圣经", nameEn: "King Bible", type: "base", category: "base", icon: "📖", desc: "召唤环绕角色的圣经。阻挡敌人的突进。", rating: 4.5, review: "防御神技！在玩家身边形成闭环保护，安全感拉满。", stats: { dps: 3, sur: 5, cc: 4, gro: 1, cdr: 2 } },
        "fire_wand": { name: "火之魔杖", nameEn: "Fire Wand", type: "base", category: "base", icon: "🔥", desc: "随机朝敌人方向发射火球，伤害极高。", rating: 3, review: "虽然单发输出爆表，但弹道较随机，难以形成稳定护甲。", stats: { dps: 4, sur: 1, cc: 1, gro: 1, cdr: 2 } },
        "garlic": { name: "大蒜", nameEn: "Garlic", type: "base", category: "base", icon: "🧄", desc: "环绕角色的伤害力场，减弱敌人击退抗性。", rating: 4, review: "新手之友！前期站桩刷怪效率拉满，后期转为控场击退用。", stats: { dps: 2, sur: 4, cc: 4, gro: 1, cdr: 2 } },
        "santa_water": { name: "圣水", nameEn: "Santa Water", type: "base", category: "base", icon: "🧪", desc: "从天而降抛洒圣水，砸地后产生持续伤害区域。", rating: 5, review: "本体最强输出武器之一，进化后地毯式铺满屏幕，伤害极高。", stats: { dps: 5, sur: 3, cc: 3, gro: 1, cdr: 3 } },
        "lightning_ring": { name: "闪电戒指", nameEn: "Lightning Ring", type: "base", category: "base", icon: "⚡", desc: "召唤闪电轰击随机敌人，附带范围溅射。", rating: 4, review: "覆盖全图的大范围高伤害闪电，升级成长收益很大。", stats: { dps: 4.5, sur: 1, cc: 2, gro: 1, cdr: 3 } },
        "pentagram": { name: "五芒星", nameEn: "Pentagram", type: "base", category: "base", icon: "✡️", desc: "全屏清空。较低等级可能同时抹去经验值和宝箱。", rating: 4.5, review: "配合高幸运，后期能够无损全屏秒杀，进化美丽月亮是刷等级神器。", stats: { dps: 5, sur: 4, cc: 5, gro: 4, cdr: 1 } },
        "runetracer": { name: "符文追踪器", nameEn: "Runetracer", type: "base", category: "base", icon: "💎", desc: "发射穿透性飞镖，在屏幕边缘反弹。", rating: 4.5, review: "穿透反弹特性在狭窄地图极其恐怖，拥有极高的上限伤害。", stats: { dps: 4.5, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        "peachone": { name: "桃子", nameEn: "Peachone", type: "base", category: "base", icon: "🕊️", desc: "召唤白鸽子，环绕发射圆形连击炮弹。", rating: 3, review: "进化前非常刮痧且难升级，但进化组合后实力翻倍。", stats: { dps: 2.5, sur: 1, cc: 1, gro: 1, cdr: 2 } },
        "ebony_wings": { name: "乌木翼", nameEn: "Ebony Wings", type: "base", category: "base", icon: "🐦", desc: "召唤黑鸽子，与白鸽子错位环绕射击。", rating: 3, review: "与白鸽子功能相似，属于高成本的后期进化核心。", stats: { dps: 2.5, sur: 1, cc: 1, gro: 1, cdr: 2 } },
        "gatti_amari": { name: "钻头(猫咪)", nameEn: "Gatti Amari", type: "base", category: "base", icon: "🐱", desc: "召唤乱窜的猫，它们会争夺场上的道具和经验并抓挠敌人。", rating: 3.5, review: "会和角色抢金币/火把/鸡腿，也会打伤自己，玩心跳的选择。", stats: { dps: 4, sur: 2, cc: 2, gro: 3, cdr: 2 } },
        "song_of_mana": { name: "歌声", nameEn: "Song of Mana", type: "base", category: "base", icon: "🎶", desc: "在垂直方向召唤贯穿全屏的音波声浪。", rating: 4.5, review: "纵向图的绝对霸主，一首曼妙的杀敌挽歌。", stats: { dps: 4.5, sur: 3, cc: 3, gro: 1, cdr: 3 } },
        "shadow_pinion": { name: "影子针", nameEn: "Shadow Pinion", type: "base", category: "base", icon: "📌", desc: "移动时留下一排影子刺，停止移动时将它们向前发射出去。", rating: 2.5, review: "操作繁琐，需要走走停停以释放穿透倒刺。", stats: { dps: 3, sur: 2, cc: 2, gro: 1, cdr: 2 } },
        "clock_lancet": { name: "柳叶刀", nameEn: "Clock Lancet", type: "base", category: "base", icon: "⏱️", desc: "发射冰冻光线，使扇形范围内的敌人陷入无法移动状态。", rating: 4.5, review: "控制之王！配合红黄戒指合成无限走廊，百分比扣死最终Boss。", stats: { dps: 0.5, sur: 5, cc: 5, gro: 1, cdr: 4 } },
        "laurel": { name: "月桂", nameEn: "Laurel", type: "base", category: "base", icon: "🌿", desc: "生成一个短暂免疫所有伤害的护盾。", rating: 5, review: "最纯粹的生存神技，满级轻松抗死死神，进化红寿衣是全游最终防御装。", stats: { dps: 0.5, sur: 5, cc: 2, gro: 1, cdr: 4 } },
        "victory_sword": { name: "胜利之歌", nameEn: "Victory Sword", type: "base", category: "base", icon: "⚔️", desc: "斩击身边最近的敌人，对视线焦点进行致命打击。", rating: 5, review: "伤害频率、范围和暴击全部拉满，进化后是无解大杀器。", stats: { dps: 5, sur: 4, cc: 3, gro: 2, cdr: 4 } },
        "flames_of_misspell": { name: "烈焰", nameEn: "Flames of Misspell", type: "base", category: "base", icon: "🌫️", desc: "从胸口喷出火焰，将前方的对手燃为灰烬。", rating: 4, review: "高频近程喷火，后期进化在屏幕上形成无休止的火场。", stats: { dps: 4.5, sur: 3, cc: 2, gro: 1, cdr: 3 } },
        "glass_fandango": { name: "玻璃箭", nameEn: "Glass Fandango", type: "base", category: "base", icon: "🏹", desc: "根据移速变化发射高穿透玻璃箭，在暴击时可能产生大范围声爆。", rating: 3.8, review: "冰冻状态的怪物会受到额外碎冰伤害，打击感非常清脆。", stats: { dps: 3.5, sur: 2, cc: 3, gro: 1, cdr: 3 } },

        // --- 本体被动 ---
        "hollow_heart": { name: "空虚之心", nameEn: "Hollow Heart", type: "passive", category: "base", icon: "❤️", desc: "提升玩家最大生命值 20% / 40% / 60% / 80% / 100%。", rating: 3, review: "用来配合鞭子进化的常规撑血防具。" },
        "empty_tome": { name: "空白之书", nameEn: "Empty Tome", type: "passive", category: "base", icon: "📔", desc: "减少武器冷却时间，最高减少 40%。", rating: 5, review: "神级万能被动，任何吃冷却的流派必选被动。" },
        "bracer": { name: "护腕", nameEn: "Bracer", type: "passive", category: "base", icon: "🛡️", desc: "提升所有武器弹道速度 10% 到 50%。", rating: 3.5, review: "加速飞刀、符文等弹道的扩散，对特定流派必不可少。" },
        "candelabrador": { name: "烛台", nameEn: "Candelabrador", type: "passive", category: "base", icon: "🕯️", desc: "增加所有攻击范围 10% 到 50%。", rating: 4.5, review: "增大攻击身位，不仅大蒜、圣水得利，圣经保护圈也会增大。" },
        "clover": { name: "幸运三叶草", nameEn: "Clover", type: "passive", category: "base", icon: "🍀", desc: "提升玩家幸运值 10% 到 50%。", rating: 4, review: "提升火把掉落爆率、宝箱升级概率以及暴击几率。" },
        "spellbinder": { name: "拼写器", nameEn: "SpellBinder", type: "passive", category: "base", icon: "🎗️", desc: "延长武器持续时间 10% 到 50%。", rating: 4, review: "让圣水火焰、圣经存在时间极大延长，神级辅助装。" },
        "spinach": { name: "菠菜", nameEn: "Spinach", type: "passive", category: "base", icon: "🥬", desc: "提升所有造成的伤害 10% 到 50%。", rating: 4.5, review: "简单粗暴增伤被动，万能首选。" },
        "pummarola": { name: "愈伤番茄", nameEn: "Pummarola", type: "passive", category: "base", icon: "🍅", desc: "每秒持续恢复生命值 0.2 到 1.0点。", rating: 2.5, review: "回血极慢，中后期作用近乎无，通常为大蒜/鞭子进化而被迫选取。" },
        "attractorb": { name: "吸引器", nameEn: "Attractorb", type: "passive", category: "base", icon: "🧲", desc: "扩大经验吸取范围（拾取磁铁能力）。", rating: 4.5, review: "极大提高清怪后经验回流效率，确保等级不落后。" },
        "duplicator": { name: "复制器", nameEn: "Duplicator", type: "passive", category: "base", icon: "💍", desc: "所有投射物型武器发射数量 +1 / +2。", rating: 5, review: "核心输出增益！几乎所有多弹道武器的威力增幅器。" },
        "crown": { name: "皇冠", nameEn: "Crown", type: "passive", category: "base", icon: "👑", desc: "提升获得的经验值 8% 到 40%。", rating: 4, review: "帮助更快升满其他武器，等级压制首选。" },
        "armor": { name: "护甲", nameEn: "Armor", type: "passive", category: "base", icon: "🧥", desc: "所受伤害减免 1 到 5 点，提升一定的反弹威能。", rating: 3.5, review: "纯肉盾配置或配合符文追踪器进化使用。" },
        "stone_mask": { name: "石面具", nameEn: "Stone Mask", type: "passive", category: "base", icon: "👺", desc: "提升捡取的金币数量 10% 到 50%。", rating: 3, review: "刷金币专用，日常通关不推荐占用宝贵被动槽。" },
        "wings": { name: "翅膀", nameEn: "Wings", type: "passive", category: "base", icon: "🪶", desc: "提升移动速度 10% 到 50%。", rating: 3, review: "增加走位容错率，配合走位型武器极佳。" },
        "skull_omaniac": { name: "疯狂骷髅", nameEn: "Skull O'Maniac", type: "passive", category: "base", icon: "💀", desc: "提升敌人数量、移速和血量 10% 到 50%（诅咒）。", rating: 4, review: "双刃剑！高手刷怪和刷经验必备的挑战型道具。" },
        "torronas_box": { name: "托罗纳的盒子", nameEn: "Torrona's Box", type: "passive", category: "base", icon: "📦", desc: "提升攻击力、攻速、范围（最后一级提供诅咒）。", rating: 4.5, review: "除了升满级会有高诅咒副作用外，前8级提供了极强的全方位战斗加成。" },
        "silver_ring": { name: "银色戒指", nameEn: "Silver Ring", type: "passive", category: "base", icon: "💍", desc: "增加范围和持续时间。需要满级用以解锁进化。", rating: 4, review: "地图拾取专属环，对攻击属性增幅不错。" },
        "gold_ring": { name: "金色戒指", nameEn: "Gold Ring", type: "passive", category: "base", icon: "💍", desc: "提升怪物血量和数量（满级解锁进化）。", rating: 4, review: "高诅咒副作用，与银戒、柳叶刀是绑定组合。" },
        "left_metaglio": { name: "红色披风左", nameEn: "Metaglio Left", type: "passive", category: "base", icon: "🧣", desc: "减少受到的伤害并回复生命（满级解锁进化）。", rating: 4, review: "提升坦度极佳，月桂进化必需品。" },
        "right_metaglio": { name: "红色披风右", nameEn: "Metaglio Right", type: "passive", category: "base", icon: "🧣", desc: "增加诅咒，使敌人变强（满级解锁进化）。", rating: 4, review: "提升难度的地图环，与月桂进化绑定。" },

        // --- 本体超武 ---
        "bloody_tear": { name: "血鞭", nameEn: "Bloody Tear", type: "evolved", category: "base", icon: "🩸", desc: "鞭子进化。能造成毁灭性暴击伤害并吸取生命值。", rating: 4.5, review: "站撸怪海的最强吸血续航保障，极其平稳。", stats: { dps: 3.5, sur: 5, cc: 2, gro: 1, cdr: 2 } },
        "holy_wand": { name: "圣魔杖", nameEn: "Holy Wand", type: "evolved", category: "base", icon: "🪄", desc: "魔杖进化。以零冷却时间的超高频率对最近敌人狂轰滥炸。", rating: 4, review: "压制首领怪极其轻松，开荒首推。" },
        "thousand_edge": { name: "千刃", nameEn: "Thousand Edge", type: "evolved", category: "base", icon: "🗡️", desc: "飞刀进化。无间断倾泻漫天飞刀雨，穿透射击。", rating: 3.5, review: "前向极致DPS，可惜对两侧防御为零。" },
        "death_spiral": { name: "死亡旋风", nameEn: "Death Spiral", type: "evolved", category: "base", icon: "🪓", desc: "斧头进化。向外侧发射大范围旋转的大型镰刀，穿透一切。", rating: 4.8, review: "绝对的T1级割草机器，无视碰撞穿透一切敌人。" },
        "heaven_sword": { name: "天堂之剑", nameEn: "Heaven Sword", type: "evolved", category: "base", icon: "✝️", desc: "十字架进化。发射金色圣剑，带高爆击并且会回旋。", rating: 4, review: "一发入魂的巨额暴击，配合幸运可打出全屏斩杀效果。" },
        "vesper_vespers": { name: "邪恶晚祷", nameEn: "Vesper Vespers", type: "evolved", category: "base", icon: "📖", desc: "圣经进化。无冷却地构成一个永恒环绕的护符护壁。", rating: 4.8, review: "只要攻速不拉胯，在脚下站桩根本没有小怪能够靠近。" },
        "hellfire": { name: "地狱火", nameEn: "Hellfire", type: "evolved", category: "base", icon: "🔥", desc: "火杖进化。喷吐出带有贯穿效果的巨型陨石火球，清路利器。", rating: 4, review: "对付直线长廊地图的神器，伤害判定非常硬核。" },
        "soul_eater": { name: "噬魂者", nameEn: "Soul Eater", type: "evolved", category: "base", icon: "🧄", desc: "大蒜进化。掠夺敌人生命，每击杀怪物或自身受伤均能增强威力。", rating: 4, review: "能吸血、加范围、减退敌人，可以说是全能防具圈。" },
        "la_borra": { name: "净水", nameEn: "La Borra", type: "evolved", category: "base", icon: "🧪", desc: "圣水进化。神圣雨云汇聚到玩家脚下并扩散开，伤害极度爆炸。", rating: 5, review: "毫无悬念的清屏伤害王者，脚下常驻绝对禁区。" },
        "thunder_loop": { name: "雷电环", nameEn: "Thunder Loop", type: "evolved", category: "base", icon: "⚡", desc: "闪电戒指进化。双重闪电打击，在落雷点产生反射伤害环。", rating: 4.5, review: "对密集怪潮有致命毁灭效果，配合清屏效果超棒。" },
        "gorgeous_moon": { name: "美丽月亮", nameEn: "Gorgeous Moon", type: "evolved", category: "base", icon: "🌙", desc: "五芒星进化。瞬间全屏清理并转化为双倍经验值，极速吸引所有结晶。", rating: 5, review: "顶级发育装，也是游戏大后期的最强辅助。" },
        "no_future": { name: "破墟", nameEn: "NO FUTURE", type: "evolved", category: "base", icon: "💎", desc: "符文进化。子弹弹道反弹时、被击中时或自身受创均能触发全屏爆炸。", rating: 5, review: "屏幕震动到停不下来的爆炸连击，大范围清场首选。" },
        "vandalier": { name: "破坏者", nameEn: "Vandalier", type: "evolved", category: "base", icon: "🛸", desc: "两只鸽子融合出的太空飞艇。大范围交叉轰炸，可继续升级8级。", rating: 5, review: "双倍槽位消耗换来的单格究极武器，满级清全图。" },
        "vicious_hunger": { name: "狂暴猫咪", nameEn: "Vicious Hunger", type: "evolved", category: "base", icon: "🦁", desc: "猫咪进化。召唤金色大眼睛吞噬敌人，并将击杀物百分百变金币。", rating: 4, review: "刷金流派的终极配方，日常伤害亦尚可。" },
        "mannajja": { name: "曼纳加", nameEn: "Mannajja", type: "evolved", category: "base", icon: "🎶", desc: "歌声进化。垂直强声波，并使范围内的怪兽永久减速。", rating: 4.5, review: "大范围音浪搭配优秀的缓速效果，强控场输出首选。" },
        "valkyrie_turner": { name: "瓦尔基里投枪", nameEn: "Valkyrie Turner", type: "evolved", category: "base", icon: "🔱", desc: "刺针进化。向背后喷出长龙般的火焰，并依据移速伤害增加。", rating: 3.5, review: "操作难度高，但在高速流派下上限不俗。" },
        "infinite_corridor": { name: "无限走廊", nameEn: "Infinite Corridor", type: "evolved", category: "base", icon: "🌀", desc: "时钟柳叶刀进化。冻结全屏敌人，并削减其50%的最大生命值！", rating: 5, review: "全游最恐怖百分比斩杀，击杀红色死神专用大杀器。", stats: { dps: 5, sur: 5, cc: 5, gro: 1, cdr: 4 } },
        "crimson_shroud": { name: "岁月的红寿衣", nameEn: "Crimson Shroud", type: "evolved", category: "base", icon: "🧣", desc: "月桂进化. 受到的最高伤害限制在10点以内。受伤时触发强反伤爆炸并推开敌人。", rating: 5, review: "终极无敌防御。拥有它你就彻底免于死神的秒杀。", stats: { dps: 2, sur: 5, cc: 3, gro: 1, cdr: 4 } },
        "sole_solution": { name: "唯一方案", nameEn: "Sole Solution", type: "evolved", category: "base", icon: "🎆", desc: "胜利歌进化。生成覆盖整个屏幕的扭曲黑洞，无视所有地形撕碎怪潮。", rating: 5, review: "挂机通关的至尊天花板。华丽的视觉演出。", stats: { dps: 5, sur: 4, cc: 3, gro: 2, cdr: 4 } },
        "ashes_of_muspell": { name: "灰烬", nameEn: "Ashes of Muspell", type: "evolved", category: "base", icon: "🌋", desc: "烈火进化。向四周全方位喷吐毁灭熔岩火光，且自身受击会进一步强化。", rating: 4.5, review: "覆盖极广的扇形火焰攻击，属于输出顶格的选择。", stats: { dps: 4.5, sur: 3, cc: 2, gro: 1, cdr: 3 } },
        "celestial_voulge": { name: "天体投枪", nameEn: "Celestial Voulge", type: "evolved", category: "base", icon: "🌌", desc: "玻璃箭进化。召唤陨石天降，对受到冻结效果的敌人伤害倍增。", rating: 4.2, review: "控制并清扫大量残怪很舒服，大声爆特效炸裂。", stats: { dps: 3.5, sur: 2, cc: 3, gro: 1, cdr: 3 } },

        // --- DLC1: 月咒山 (Legacy of the Moonspell) ---
        "silver_wind": { name: "银风", nameEn: "Silver Wind", type: "base", category: "moonspell", icon: "🌬️", desc: "发射轻柔的银风轨迹，能环绕角色伤害触碰到的敌人。", rating: 3.5, review: "初期割草体验好，对低血怪群清场很快。", stats: { dps: 3, sur: 2, cc: 2, gro: 1, cdr: 3 } },
        "four_seasons": { name: "四季", nameEn: "Four Seasons", type: "base", category: "moonspell", icon: "🌸", desc: "在角色四周循环爆发出春夏秋冬四季交替的魔法花瓣。", rating: 4, review: "爆发范围极大，升级阶段能显著提升伤害范围。", stats: { dps: 4, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "summon_night": { name: "召唤之夜", nameEn: "Summon Night", type: "base", category: "moonspell", icon: "🌃", desc: "在屏幕上方召唤出一道道黑暗尖刺，撕裂敌阵。", rating: 4, review: "纵向地图清怪神技，弹道成长后很夸张。", stats: { dps: 4.2, sur: 1, cc: 2, gro: 1, cdr: 3 } },
        "mirage_robe": { name: "幻影长袍", nameEn: "Mirage Robe", type: "base", category: "moonspell", icon: "🥋", desc: "移动时在背后留下可以迷惑敌人并造成接触伤害的幻影残像。", rating: 3, review: "控场一般，需要玩家频繁走动来布置残像。", stats: { dps: 2.5, sur: 3, cc: 3, gro: 1, cdr: 2 } },
        "night_sword": { name: "夜剑", nameEn: "Night Sword", type: "base", category: "moonspell", icon: "🗡️", desc: "挥砍最近的怪兽。如果杀死敌人，有一定概率掉落治疗心心。", rating: 4.2, review: "自带微量吸血效果，伤害成长极高，适合砍杀流。", stats: { dps: 4.5, sur: 3.5, cc: 2, gro: 1, cdr: 3 } },
        "mille_bolle_blu": { name: "乱杂手榴弹", nameEn: "Mille Bolle Blu", type: "base", category: "moonspell", icon: "🧼", desc: "发射浮空旋转的蔚蓝色水泡，在原地停留并对接触到的怪物爆裂。", rating: 3.5, review: "弹道机制有意思，能在面前形成短暂的泡沫墙壁。", stats: { dps: 3.2, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        
        "festive_winds": { name: "庆典风", nameEn: "Festive Winds", type: "evolved", category: "moonspell", icon: "🎐", desc: "银风进化。吸收击杀怪物的魂魄，以增加大范围杀伤风环。", rating: 4.2, review: "能吸血加移速，不仅是输出，也是求生的核心工具。", stats: { dps: 4, sur: 4.5, cc: 3, gro: 1, cdr: 3 } },
        "godai_shuffle": { name: "五花八门", nameEn: "Godai Shuffle", type: "evolved", category: "moonspell", icon: "🎏", desc: "四季进化。大范围五属性魔法齐放，在场中引起巨大属性爆破。", rating: 5, review: "全屏清剿能力极度恐怖，伤害色彩华丽斑斓。", stats: { dps: 5, sur: 3, cc: 4, gro: 1, cdr: 3 } },
        "echo_night": { name: "黑暗之夜", nameEn: "Echo Night", type: "evolved", category: "moonspell", icon: "🌉", desc: "召唤之夜进化。尖刺变成巨型音响般音爆，向全屏爆发黑色风暴。", rating: 5, review: "全图无死角横扫。是目前版本最强清理辅助超武之一。", stats: { dps: 4.8, sur: 2, cc: 3, gro: 1, cdr: 4 } },
        "jodore": { name: "耀眼长袍", nameEn: "J'Odore", type: "evolved", category: "moonspell", icon: "👚", desc: "长袍进化。幻像现在会移动并把靠近的恶魔击退且冻结。", rating: 4, review: "控怪站桩首选，幻像的行进轨迹能够封锁整条道路。", stats: { dps: 3.5, sur: 4, cc: 4.5, gro: 1, cdr: 3 } },
        "muramasa": { name: "穆拉马萨", nameEn: "Muramasa", type: "evolved", category: "moonspell", icon: "👹", desc: "夜剑进化。砍杀造成双倍暴击，但自身生命会以极低概率缓缓流逝。击杀敌人会掉落红心。", rating: 4.8, review: "吸血和扣血并存。输出惊人的刀魔级武器。", stats: { dps: 5, sur: 4, cc: 2, gro: 1, cdr: 4 } },
        "boo_roo_too": { name: "嘘", nameEn: "Boo Roo Too", type: "evolved", category: "moonspell", icon: "👻", desc: "泡泡进化。吹出带有毒性的绿水炮，会在地表积水并大范围弹开敌人。", rating: 4.2, review: "控制极强，配合击退能在后期挡下高难度的敌军狂潮。", stats: { dps: 4, sur: 3, cc: 4.5, gro: 1, cdr: 3 } },

        // --- DLC2: 福斯卡里 (Tides of the Foscari) ---
        "eskizzibur": { name: "湖中剑", nameEn: "Eskizzibur", type: "base", category: "foscari", icon: "🗡️", desc: "用重型大剑在面前与背后弧线挥砍，第三击震地击退敌人。", rating: 3.8, review: "物理砍击体验极佳，重斩带震击效果。", stats: { dps: 3.5, sur: 3, cc: 3, gro: 1, cdr: 2 } },
        "flash_arrow": { name: "闪光箭", nameEn: "Flash Arrow", type: "base", category: "foscari", icon: "🏹", desc: "朝固定朝向连续抛射光箭，能击穿阻碍。", rating: 3.5, review: "直线爆发非常高，但有死角。", stats: { dps: 3.8, sur: 1.5, cc: 2, gro: 1, cdr: 3 } },
        "spellstring": { name: "乱射", nameEn: "SpellString", type: "base", category: "foscari", icon: "🧵", desc: "发射三发快速跟踪最近怪物的法术小光球。", rating: 3.2, review: "单发较弱，依靠极快攻速取胜，是三系法术核心。", stats: { dps: 3, sur: 1.5, cc: 1.5, gro: 1, cdr: 4 } },
        "spellstream": { name: "咒语书", nameEn: "SpellStream", type: "base", category: "foscari", icon: "📚", desc: "创造一条随角色移动的环形魔法激流，伤害并拖拽怪物。", rating: 3.5, review: "输出平稳，配合减速能造成持续性AOE伤害。", stats: { dps: 3.2, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        "spellstrike": { name: "魔法书", nameEn: "SpellStrike", type: "base", category: "foscari", icon: "📘", desc: "在角色前方向地面狠狠砸下一记重型魔力锤击。", rating: 3.8, review: "伤害范围很大，但攻速稍慢，爆发强力。", stats: { dps: 3.9, sur: 2, cc: 3.5, gro: 1, cdr: 2 } },
        "shadow_servant": { name: "影子仆从", nameEn: "Shadow Servant", type: "base", category: "foscari", icon: "👤", desc: "召唤神秘的蛇影。有一定几率让靠近的敌人瞬间陷入混乱并反戈。", rating: 3.6, review: "控制极具趣味性，容易让怪潮发生内部自相残杀。", stats: { dps: 3.2, sur: 3, cc: 4, gro: 1, cdr: 3 } },
        "prismatic_missile": { name: "耀眼光芒", nameEn: "Prismatic Missile", type: "base", category: "foscari", icon: "💠", desc: "由角色头顶喷洒出彩虹般激光束。在落点造成元素能量爆发。", rating: 4, review: "多段元素伤害。攻击频率惊人。", stats: { dps: 4, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        
        "legionnaire": { name: "瑞纳罗克", nameEn: "Legionnaire", type: "evolved", category: "foscari", icon: "🛡️", desc: "湖中剑进化。每次横扫会向两侧抛出大批虚空士兵英灵，横扫战场。", rating: 4.8, review: "小人海战术！成千上万个士兵替你堵住屏幕，压制力极高。", stats: { dps: 4.8, sur: 4, cc: 4, gro: 1, cdr: 3 } },
        "millionaire": { name: "百万之箭", nameEn: "Millionaire", type: "evolved", category: "foscari", icon: "👑", desc: "闪光箭进化。根据拾取的金币和经验，从天而降下持续的致命箭雨。", rating: 5, review: "输出频率高到戏仿卡顿。射爆全图的终极单边火力压制。", stats: { dps: 5, sur: 2, cc: 3, gro: 2, cdr: 4 } },
        "spellstrom": { name: "符文法术", nameEn: "SpellStrom", type: "evolved", category: "foscari", icon: "🌪️", desc: "三法术卡片合并进化。在地图中心制造一股通天的彩色混沌旋涡，席卷万物。", rating: 5, review: "最强DLC融合超武。全屏黑洞毁灭效果，毁天灭地。", stats: { dps: 5, sur: 4, cc: 5, gro: 1, cdr: 3 } },
        "ophion": { name: "蛇发女妖的呼唤", nameEn: "Ophion", type: "evolved", category: "foscari", icon: "🐍", desc: "影子仆从进化。扔出能造成即死判定的虚空蛇环，吞噬遇到的灵魂。", rating: 4.8, review: "具备无视血量的瞬杀百分比斩杀，非常强横。", stats: { dps: 4.9, sur: 3, cc: 4, gro: 1, cdr: 3 } },
        "luminaire": { name: "发光之花", nameEn: "Luminaire", type: "evolved", category: "foscari", icon: "🌸", desc: "彩虹激光进化。制造出圣洁的彩光风暴，能将地图全部经验升华并且击退邪恶。", rating: 5, review: "兼备清怪、吸经验和无敌特效，辅助性能无出其右。", stats: { dps: 4.6, sur: 5, cc: 4.5, gro: 3, cdr: 3 } },

        // --- DLC3: Among Us 联动 (Emergency Meeting) ---
        "report": { name: "报告!", nameEn: "Report!", type: "base", category: "amongus", icon: "📢", desc: "大声疾呼！在前后方向射出带音波的声波圈，带强击退。", rating: 3.5, review: "伤害还可以，击退效果对防止小怪近身很有帮助。", stats: { dps: 3.2, sur: 3.5, cc: 3.5, gro: 1, cdr: 3 } },
        "lucky_swipe": { name: "幸运卡片", nameEn: "Lucky Swipe", type: "base", category: "amongus", icon: "💳", desc: "在角色左右两侧快速划过刷卡轨道，打击横向范围怪物。", rating: 3.3, review: "类似横向鞭子，需要精确走位来清理上下突脸的怪。", stats: { dps: 3.3, sur: 2, cc: 2, gro: 1, cdr: 3 } },
        "lifesign_scan": { name: "生命体征扫描", nameEn: "Lifesign Scan", type: "base", category: "amongus", icon: "📟", desc: "扫描四周。周期性为角色提供全方位的护盾防护并微量恢复生命。", rating: 4, review: "极强的续航被动辅助武器，保证生存无忧。", stats: { dps: 0.5, sur: 5, cc: 2, gro: 2, cdr: 3 } },
        "just_vent": { name: "管道清理", nameEn: "Just Vent", type: "base", category: "amongus", icon: "🕳️", desc: "在角色脚下生成通气管道，能够瞬间将部分小怪拽入虚无抹杀。", rating: 3.5, review: "秒杀判定不错，但有一定的概率触发限制。", stats: { dps: 3.5, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "clear_debris": { name: "扫除时间", nameEn: "Clear Debris", type: "base", category: "amongus", icon: "🧹", desc: "向四周推射出一圈垃圾障碍物，击退并碾压前路敌人。", rating: 3.4, review: "击退效果明显，适合做防御副手。", stats: { dps: 3, sur: 3, cc: 4, gro: 1, cdr: 3 } },
        "sharp_tongue": { name: "尖锐舌头", nameEn: "Sharp Tongue", type: "base", category: "amongus", icon: "👅", desc: "向前喷吐出内鬼专属的长舌，戳刺前方的敌人。", rating: 3.8, review: "直线高伤害刺击，冷却快，打怪很痛。", stats: { dps: 3.8, sur: 1.5, cc: 1, gro: 1, cdr: 4 } },
        "science_rocks": { name: "科学石头", nameEn: "Science Rocks", type: "base", category: "amongus", icon: "🧪", desc: "向地上抛洒科学试管和结晶碎片，在踩踏后产生大范围属性崩解。", rating: 3.7, review: "需要引怪踩上去才能最大化伤害，踩中后爆发巨大。", stats: { dps: 3.9, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        
        "mini_crewmate": { name: "迷你船员", nameEn: "Mini Crewmate", type: "passive", category: "amongus", icon: "🧑‍🚀", desc: "Among Us 迷你红色伙伴。增加部分全队防御与生命恢复。", rating: 3.5, review: "小小的很可爱，用来进化报告武器的必要被动。" },
        "mini_engineer": { name: "迷你工程师", nameEn: "Mini Engineer", type: "passive", category: "amongus", icon: "👷", desc: "迷你黄色伙伴。提供少量的金币与拾取道具加成。", rating: 3.2, review: "提升一些拾取和容错率。" },
        "mini_ghost": { name: "迷你幽灵", nameEn: "Mini Ghost", type: "passive", category: "amongus", icon: "👻", desc: "迷你白色幽灵。提升微量闪避几率与防御抗性。", rating: 3.5, review: "提供难得的闪避（格挡），在生存流中表现可以。" },
        "mini_impostor": { name: "迷你内鬼", nameEn: "Mini Impostor", type: "passive", category: "amongus", icon: "😈", desc: "迷你紫色内鬼伙伴。微量增加造成的伤害百分比。", rating: 3.6, review: "简单的增伤伙伴。" },
        "mini_guardian": { name: "迷你守护者", nameEn: "Mini Guardian", type: "passive", category: "amongus", icon: "🛡️", desc: "迷你蓝色守护者。额外增加拾取磁铁范围。", rating: 3.4, review: "不错的吸尘器，利于后期吃球。" },
        "mini_scientist": { name: "迷你科学家", nameEn: "Mini Scientist", type: "passive", category: "amongus", icon: "🔬", desc: "迷你粉色伙伴。增加角色经验拾取效率 10%。", rating: 4, review: "小皇冠，性价比不错。" },
        "mini_shapeshifter": { name: "迷你变形者", nameEn: "Mini Shapeshifter", type: "passive", category: "amongus", icon: "👽", desc: "迷你青色伙伴。大幅提升武器冷却速度 8%。", rating: 4.5, review: "优质的减冷却备用被动。" },

        "emergency_meeting": { name: "紧急会议", nameEn: "Emergency Meeting", type: "evolved", category: "amongus", icon: "🚨", desc: "报告进化。全屏红色警报，全屏随机秒杀某一类型怪兽群。", rating: 4.8, review: "全屏秒杀的清怪快感无与伦比，触发警报时画面带感。", stats: { dps: 4.7, sur: 4, cc: 4.5, gro: 1, cdr: 3 } },
        "crossed_wires": { name: "横扫一切", nameEn: "Crossed Wires", type: "evolved", category: "amongus", icon: "🛰️", desc: "卡片进化。在四周引爆数条网线电磁场，范围超大且带减速。", rating: 4.5, review: "控场和清怪一体，电场在四周常驻防护力十足。", stats: { dps: 4.5, sur: 3.5, cc: 4, gro: 1, cdr: 3 } },
        "paranormal_scan": { name: "超自然扫描", nameEn: "Paranormal Scan", type: "evolved", category: "amongus", icon: "📡", desc: "扫描进化。定期对角色属性进行“永久升级”！越到后期，伤害/生命/冷却越无上限叠加。", rating: 5, review: "绝对的外挂级武器。能永久叠加你的面板属性，无尽流的神！", stats: { dps: 4, sur: 5, cc: 2, gro: 5, cdr: 4 } },
        "unjust_ejection": { name: "无法无天", nameEn: "Unjust Ejection", type: "evolved", category: "amongus", icon: "🛸", desc: "管道进化。全屏随机降下太空舱，把视野内的敌人直接驱逐出太空秒杀。", rating: 4.5, review: "驱逐特效拉满，适合对付中后期血厚怪潮。", stats: { dps: 4.5, sur: 3, cc: 3.5, gro: 1, cdr: 2 } },
        "clear_asteroids": { name: "净化世界", nameEn: "Clear Asteroids", type: "evolved", category: "amongus", icon: "☄️", desc: "垃圾进化。召唤满天降落的陨石巨岩，横冲直撞砸碎所有恶魔。", rating: 4.6, review: "视觉震撼的物理砸怪流，砸击面极广。", stats: { dps: 4.6, sur: 3, cc: 3.5, gro: 1, cdr: 3 } },
        "impostongue": { name: "内鬼舌头", nameEn: "Impostongue", type: "evolved", category: "amongus", icon: "🔪", desc: "舌头进化。疯狂突刺的长舌在击杀怪兽后能大幅回流经验或金币。", rating: 4.2, review: "单向伤害拉满，吸血和拾取率很强。", stats: { dps: 4.4, sur: 2, cc: 2, gro: 2, cdr: 4 } },
        "rocket_science": { name: "科技危险", nameEn: "Rocket Science", type: "evolved", category: "amongus", icon: "🚀", desc: "科学石头进化。向四面八方倾泻红蓝色追踪导弹轰击。", rating: 4.7, review: "弹幕超多的跟踪导弹，高输出并且覆盖整个屏幕。", stats: { dps: 4.8, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },

        // --- DLC4: 枪械行动 (Operation Guns) ---
        "long_gun": { name: "金属枪", nameEn: "Long Gun", type: "base", category: "contra", icon: "🔫", desc: "魂斗罗长枪，朝移动朝向持续极速倾泻连发弹药。", rating: 3.5, review: "指向性开火，需要不停移动走位调整弹道。", stats: { dps: 3.6, sur: 1.5, cc: 2, gro: 1, cdr: 3 } },
        "short_gun": { name: "强力鞭(短枪)", nameEn: "Short Gun", type: "base", category: "contra", icon: "🪢", desc: "发射近距离散弹。对贴身敌人造成多重爆破。", rating: 3.4, review: "防贴身效果好，类似短距散弹。", stats: { dps: 3.5, sur: 3, cc: 2.5, gro: 1, cdr: 3 } },
        "spread_shot": { name: "经典散弹枪", nameEn: "Spread Shot", type: "base", category: "contra", icon: "🔫", desc: "向角色前侧发射五个扇面散射弹道，压制力极高。", rating: 4, review: "最经典的魂斗罗散弹，面杀伤直线效果强。", stats: { dps: 4, sur: 1.5, cc: 2.5, gro: 1, cdr: 3 } },
        "c_u_laser": { name: "C-Laser(激光)", nameEn: "C-Laser", type: "base", category: "contra", icon: "🔦", desc: "凝聚一束能够贯穿全图的强力折射激光束。", rating: 3.7, review: "极高的激光单体穿透能力，对首领怪特化。", stats: { dps: 4.1, sur: 1, cc: 1.5, gro: 1, cdr: 3 } },
        "firearm": { name: "喷火枪", nameEn: "Firearm", type: "base", category: "contra", icon: "🔥", desc: "喷射滚滚的近身旋转火焰，阻拦靠近的恶灵。", rating: 3.6, review: "防贴身，攻击硬直明显。", stats: { dps: 3.8, sur: 3.5, cc: 3, gro: 1, cdr: 2 } },
        "sonic_bloom": { name: "音爆枪", nameEn: "Sonic Bloom", type: "base", category: "contra", icon: "📢", desc: "发射超声波圆盘，对敌人进行震荡击退。", rating: 3.6, review: "阻截利器，超大退敌能力。", stats: { dps: 3.3, sur: 3.5, cc: 4.5, gro: 1, cdr: 3 } },
        "homing_miss": { name: "追踪导弹", nameEn: "Homing Miss", type: "base", category: "contra", icon: "🚀", desc: "召唤大批半追踪的小型跟踪导弹轰炸敌阵。", rating: 3.8, review: "全图追踪，容错率好，不需要刻意对准怪开火。", stats: { dps: 4, sur: 2, cc: 2, gro: 1, cdr: 3 } },
        "diver_mines": { name: "潜水地雷", nameEn: "Diver Mines", type: "base", category: "contra", icon: "💣", desc: "在沿路布设水雷地雷，在踩踏爆破后形成多重碎片散射。", rating: 3.5, review: "被动地表陷阱，输出判定在脚下。", stats: { dps: 3.7, sur: 2.5, cc: 3, gro: 1, cdr: 2 } },
        "blade_crossbow": { name: "刀刃弩", nameEn: "Blade Crossbow", type: "base", category: "contra", icon: "🏹", desc: "抛射高穿透螺旋钢刃。在反弹时威力不减。", rating: 3.6, review: "弹道成长高，可以在长走廊发挥很大优势。", stats: { dps: 3.8, sur: 1.5, cc: 2, gro: 1, cdr: 3 } },
        "prism_lass": { name: "棱镜激光", nameEn: "Prism Lass", type: "base", category: "contra", icon: "🏮", desc: "在角色四周产生几道跟随转动的脉冲激光圈，切割周围怪兽。", rating: 3.8, review: "护身性质好，能解决角色周围360度的怪物。", stats: { dps: 3.6, sur: 3.8, cc: 3, gro: 1, cdr: 3 } },
        "metal_claw": { name: "金属爪", nameEn: "Metal Claw", type: "base", category: "contra", icon: "🦖", desc: "召唤高震击的钢爪在身旁快速挥砍裂解敌人。", rating: 3.9, review: "近战极快切割，暴击高。", stats: { dps: 4.2, sur: 3, cc: 2, gro: 1, cdr: 3 } },
        
        "weapon_powerup": { name: "武器强化件", nameEn: "Weapon Power-Up", type: "passive", category: "contra", icon: "💼", desc: "魂斗罗专属强化工具箱。魂斗罗武器进化必备！", rating: 5, review: "不仅是所有 Contra 超武的核心进化件，对伤害也有不俗强化。" },

        "prototype_a": { name: "原型 A", nameEn: "Prototype A", type: "evolved", category: "contra", icon: "🤖", desc: "金属枪进化。召唤自动环绕开火的双悬浮枪射击。", rating: 4.5, review: "两个小炮台全天候护卫，解放双手挂机神器。", stats: { dps: 4.5, sur: 3.5, cc: 3, gro: 1, cdr: 3 } },
        "prototype_b": { name: "原型 B", nameEn: "Prototype B", type: "evolved", category: "contra", icon: "🤖", desc: "短枪进化。散弹弹道呈360度开花，对贴身怪是毁灭打击。", rating: 4.5, review: "全方位防护，爆发力极大，能很好保护自身。", stats: { dps: 4.7, sur: 4.5, cc: 3.5, gro: 1, cdr: 3 } },
        "prototype_c": { name: "原型 C", nameEn: "Prototype C", type: "evolved", category: "contra", icon: "🤖", desc: "散弹枪进化。覆盖全屏正前方的巨量弹幕网，火力极其狂暴。", rating: 4.9, review: "最爽快的弹幕武器，射穿一切大体怪兽。", stats: { dps: 5, sur: 2, cc: 3, gro: 1, cdr: 4 } },
        "pronto_beam": { name: "普朗特光束", nameEn: "Pronto Beam", type: "evolved", category: "contra", icon: "🎇", desc: "激光进化。折射激光会引发全屏二次爆炸，贯穿伤害拉满。", rating: 4.7, review: "单发毁灭性极强，高伤害爆破覆盖。", stats: { dps: 4.9, sur: 2, cc: 2.5, gro: 1, cdr: 3 } },
        "fire_l3gs": { name: "火焰 L3GS", nameEn: "Fire-L3GS", type: "evolved", category: "contra", icon: "🌋", desc: "喷火枪进化。火焰引燃为永久熔岩带，踩上会大范围熔毁。", rating: 4.6, review: "在地下布置火焰裂隙，配合击退可堵门割草。", stats: { dps: 4.6, sur: 4, cc: 3.5, gro: 1, cdr: 3 } },
        "wave_beam": { name: "波动光束", nameEn: "Wave Beam", type: "evolved", category: "contra", icon: "🌀", desc: "音爆枪进化。震荡波大幅度穿过半屏，造成无视防御的重击退。", rating: 4.5, review: "防御流极品，没有任何小怪能突破波动光束的屏障。", stats: { dps: 4, sur: 4.5, cc: 5, gro: 1, cdr: 3 } },
        "multistage_missiles": { name: "多级导弹", nameEn: "Multistage Missiles", type: "evolved", category: "contra", icon: "🚀", desc: "导弹进化。发射巨型三级追踪洲际导弹，撞击全屏大爆炸。", rating: 4.8, review: "导弹体积巨大，爆炸引发大面积闪光，刷图能力极强。", stats: { dps: 4.9, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },
        "atmo_torpedo": { name: "大气鱼雷", nameEn: "Atmo-Torpedo", type: "evolved", category: "contra", icon: "🌌", desc: "地雷进化。生成地核级别的超引力力场黑洞，牵引并粉碎敌人。", rating: 5, review: "带强大的引力聚怪效果！能极大地优化其他散射技能的伤害。", stats: { dps: 4.7, sur: 4, cc: 4.8, gro: 1, cdr: 3 } },
        "bfc2000_ad": { name: "BFC2000-AD", nameEn: "BFC2000-AD", type: "evolved", category: "contra", icon: "🛸", desc: "刀弩进化. 天空降落巨型飞镖母舰朝敌阵中心碾压投射利刃。", rating: 4.7, review: "清屏能力好，反弹机制极强。", stats: { dps: 4.8, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },
        "time_warp": { name: "时间扭曲", nameEn: "Time Warp", type: "evolved", category: "contra", icon: "⏳", desc: "激光脉冲进化。产生令敌兵近乎停滞的巨大缓慢力场结界。", rating: 4.8, review: "高配版柳叶刀！能给全屏减速提供巨大的缓冲余地。", stats: { dps: 3.5, sur: 5, cc: 5, gro: 1, cdr: 4 } },
        "big_fuzzy_fist": { name: "大绒毛拳", nameEn: "Big Fuzzy Fist", type: "evolved", category: "contra", icon: "🤜", desc: "钢爪进化。从天而降巨型愤怒钢爪对首领怪进行致命重扣。", rating: 4.6, review: "打Boss极为迅速，爆发很高，拳拳到肉。", stats: { dps: 4.8, sur: 3, cc: 2.5, gro: 1, cdr: 3 } },

        // --- DLC5: 恶魔城颂歌 (Ode to Castlevania) ---
        "alchemy_whip": { name: "炼金鞭", nameEn: "Alchemy Whip", type: "base", category: "castlevania", icon: "⛓️", desc: "恶魔城系列皮鞭，对被击中的怪施加虚弱状态。", rating: 3.5, review: "经典的皮鞭，打击判定很大。", stats: { dps: 3.3, sur: 2, cc: 2.5, gro: 1, cdr: 3 } },
        "wind_whip": { name: "风之鞭", nameEn: "Wind Whip", type: "base", category: "castlevania", icon: "🪢", desc: "以极高攻速攻击四周，移速越快，出手频率越高。", rating: 3.6, review: "高攻速流派的核心副鞭。", stats: { dps: 3.5, sur: 2.5, cc: 2, gro: 1, cdr: 4 } },
        "platinum_whip": { name: "白金鞭", nameEn: "Platinum Whip", type: "base", category: "castlevania", icon: "⛓️", desc: "闪耀白色光芒的神圣皮鞭，暴击率极高。", rating: 3.7, review: "圣光属性对不死族怪物有毁灭加成。", stats: { dps: 3.8, sur: 2, cc: 2, gro: 1, cdr: 3 } },
        "dragon_water_whip": { name: "龙水鞭", nameEn: "Dragon Water Whip", type: "base", category: "castlevania", icon: "🧪", desc: "洒下冰冷龙涎圣水的元素神鞭，冰冻敌人。", rating: 3.9, review: "冰冻控怪效果优越，安全感佳。", stats: { dps: 3.5, sur: 3.5, cc: 4, gro: 1, cdr: 3 } },
        "sonic_whip": { name: "音波鞭", nameEn: "Sonic Whip", type: "base", category: "castlevania", icon: "⚡", desc: "挥击产生大范围高能音圈，带有穿透震荡。", rating: 3.7, review: "清怪面积尚可，打击带感。", stats: { dps: 3.7, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        "jet_black_whip": { name: "漆黑鞭", nameEn: "Jet Black Whip", type: "base", category: "castlevania", icon: "⛓️", desc: "暗影之鞭，挥动时附带大面积毒雾残留。", rating: 3.8, review: "毒性流派的主干，叠毒输出可观。", stats: { dps: 3.9, sur: 3, cc: 3, gro: 1, cdr: 3 } },
        "vibhuti_whip": { name: "圣灰鞭", nameEn: "Vibhuti Whip", type: "base", category: "castlevania", icon: "🧹", desc: "扬起致盲的神圣尘灰，降低怪兽视野和移速。", rating: 3.6, review: "防御属性出众的降命中尘灰。", stats: { dps: 3.2, sur: 4, cc: 4, gro: 1, cdr: 3 } },
        "vanitas_whip": { name: "虚无鞭", nameEn: "Vanitas Whip", type: "base", category: "castlevania", icon: "🖤", desc: "从空气中凝聚虚无长鞭打击。每次挥击微量汲取魔力。", rating: 3.7, review: "续航型武器，配合CD很猛。", stats: { dps: 3.6, sur: 3.5, cc: 2, gro: 1, cdr: 3 } },
        "shuriken": { name: "手里剑", nameEn: "Shuriken", type: "base", category: "castlevania", icon: "⭐", desc: "向前连续倾泻反弹的星形手里剑镖。", rating: 3.5, review: "反弹机制适合怪多的密闭空间。", stats: { dps: 3.5, sur: 1.5, cc: 2, gro: 1, cdr: 3 } },
        "curved_knife": { name: "弯刀", nameEn: "Curved Knife", type: "base", category: "castlevania", icon: "🗡️", desc: "射出两面回旋的圆月弯刀，割开怪物防御。", rating: 3.6, review: "割喉利器，爆发还行。", stats: { dps: 3.7, sur: 1.5, cc: 2, gro: 1, cdr: 3 } },
        "javelin": { name: "标枪", nameEn: "Javelin", type: "base", category: "castlevania", icon: "🔱", desc: "抛出破空重型骑枪，直线重击退。", rating: 3.7, review: "高伤，带冲撞击退物理判定。", stats: { dps: 3.8, sur: 2, cc: 3.5, gro: 1, cdr: 2 } },
        "discus": { name: "飞盘", nameEn: "Discus", type: "base", category: "castlevania", icon: "🥏", desc: "扔出切割滚动的尖刺飞轮，在墙壁反弹。", rating: 3.6, review: "在狭隘关卡中能达到数倍的穿透输出。", stats: { dps: 3.9, sur: 1.5, cc: 2.5, gro: 1, cdr: 2 } },
        "iron_ball": { name: "铁球", nameEn: "Iron Ball", type: "base", category: "castlevania", icon: "🏀", desc: "向前推行碾压的百斤巨球，震塌地面。", rating: 3.8, review: "纯重打击物理怪神技，伤害基底极大。", stats: { dps: 4, sur: 3, cc: 4, gro: 1, cdr: 2 } },
        "silver_revolver": { name: "银色左轮", nameEn: "Silver Revolver", type: "base", category: "castlevania", icon: "🔫", desc: "极快极速的银弹连发手枪，退魔高伤害。", rating: 3.9, review: "中远距离输出王者之一，点杀效率高。", stats: { dps: 4.2, sur: 2, cc: 2, gro: 1, cdr: 4 } },
        "grenade": { name: "手榴弹", nameEn: "Grenade", type: "base", category: "castlevania", icon: "💣", desc: "投射爆破弹。产生高溅射神圣火团。", rating: 3.7, review: "AOE炸弹，适合清群怪。", stats: { dps: 3.9, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "wine_glass": { name: "酒杯", nameEn: "Wine Glass", type: "base", category: "castlevania", icon: "🍷", desc: "砸下装满红酒的魔法水晶杯。在地面引发持久的恶魔怨毒火海。", rating: 4.1, review: "砸地后地火蔓延极广，输出机制类似圣水。", stats: { dps: 4.3, sur: 3, cc: 3, gro: 1, cdr: 3 } },
        "raging_fire": { name: "烈火术", nameEn: "Raging Fire", type: "base", category: "castlevania", icon: "🔥", desc: "贝尔蒙特秘藏火魔法书，释放多道暴雨般的流火弹。", rating: 3.9, review: "火系清图利器，弹道繁茂。", stats: { dps: 4.1, sur: 2, cc: 2, gro: 1, cdr: 3 } },
        "ice_fang": { name: "冰牙术", nameEn: "Ice Fang", type: "base", category: "castlevania", icon: "❄️", desc: "冰封秘术，地表升起大量穿刺冰锥，附带几率性冰冻效果。", rating: 4, review: "阻杀快，带冻结强控。", stats: { dps: 3.9, sur: 3.5, cc: 4.5, gro: 1, cdr: 3 } },
        "gale_force": { name: "狂风术", nameEn: "Gale Force", type: "base", category: "castlevania", icon: "🌬️", desc: "风魔法，召唤撕裂地图横截面的神风。", rating: 3.8, review: "对付两翼夹攻很强。", stats: { dps: 3.7, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },
        "rock_riot": { name: "滚石术", nameEn: "Rock Riot", type: "base", category: "castlevania", icon: "🪨", desc: "土系坠石轰击。在坑道等边缘能够产生碎石爆炸。", rating: 3.6, review: "地形依赖度高。", stats: { dps: 3.8, sur: 2, cc: 3, gro: 1, cdr: 2 } },
        "fulgur": { name: "雷电术", nameEn: "Fulgur", type: "base", category: "castlevania", icon: "⚡", desc: "降下九天轰天神雷，电离一大片怪兽。", rating: 4.1, review: "大范围爆裂闪电，输出稳定。", stats: { dps: 4.3, sur: 1.5, cc: 2.5, gro: 1, cdr: 3 } },
        "keremet_bubbles": { name: "泡沫术", nameEn: "Keremet Bubbles", type: "base", category: "castlevania", icon: "🧼", desc: "吐出大量的腐蚀毒水泡在屏幕上漂浮。", rating: 3.5, review: "防御阻隔尚可。", stats: { dps: 3.4, sur: 3, cc: 3.5, gro: 1, cdr: 3 } },
        "hex": { name: "诅咒术", nameEn: "Hex", type: "base", category: "castlevania", icon: "🔮", desc: "释放紫黑怨恨魂光，令敌人持续掉血并衰弱。", rating: 3.8, review: "百分比减甲虚弱，高伤神技。", stats: { dps: 4, sur: 3, cc: 3.5, gro: 1, cdr: 3 } },
        "refectio": { name: "圣光术", nameEn: "Refectio", type: "base", category: "castlevania", icon: "✨", desc: "沐浴神恩的圣洁光雨，在范围内治疗并焚烧恶灵。", rating: 4.2, review: "自带疗伤圣环，输出生存极其均衡。", stats: { dps: 3.8, sur: 4.8, cc: 3, gro: 2, cdr: 3 } },
        "mace": { name: "晨星槌", nameEn: "Mace", type: "base", category: "castlevania", icon: "🔨", desc: "物理重力打击锤，附带范围性震波。", rating: 3.7, review: "物理狂敲砸Boss疼。", stats: { dps: 3.9, sur: 2.5, cc: 3.5, gro: 1, cdr: 2 } },
        "star_flail": { name: "星辰连枷", nameEn: "Star Flail", type: "base", category: "castlevania", icon: "📿", desc: "甩出围绕旋转的星之重星锤，敲裂怪群防线。", rating: 3.9, review: "周身圆形防御，站桩给力。", stats: { dps: 3.8, sur: 3.5, cc: 3.5, gro: 1, cdr: 2 } },
        "alucard_spear": { name: "阿鲁卡多之枪", nameEn: "Alucard Spear", type: "base", category: "castlevania", icon: "🔱", desc: "阿鲁卡多传说神枪，戳刺带神圣瞬移伤害判定。", rating: 4.3, review: "指向突刺，威力极猛，带穿破效果。", stats: { dps: 4.4, sur: 3, cc: 2, gro: 1, cdr: 3 } },
        "trident": { name: "三叉戟", nameEn: "Trident", type: "base", category: "castlevania", icon: "🔱", desc: "海神三叉戟，波涛般刺向四周，并能带来水流冲击波。", rating: 4.1, review: "圆形高输出，水波带轻击退。", stats: { dps: 4.2, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },
        "iron_shield": { name: "铁盾", nameEn: "Iron Shield", type: "base", category: "castlevania", icon: "🛡️", desc: "在身体周围架设反射盾牌，弹飞怪兽并减免接触攻击伤害。", rating: 4, review: "极佳防身，反伤大。", stats: { dps: 2, sur: 4.8, cc: 4, gro: 1, cdr: 3 } },
        "guardians_targe": { name: "卫士小盾", nameEn: "Guardian's Targe", type: "base", category: "castlevania", icon: "🛡️", desc: "小盾防御。受击能快速震开敌群并带盾气波。", rating: 3.8, review: "盾牌防御系玩具，反伤强悍。", stats: { dps: 2.5, sur: 4.5, cc: 4, gro: 1, cdr: 3 } },
        "tyrfing": { name: "提尔锋", nameEn: "Tyrfing", type: "base", category: "castlevania", icon: "🗡️", desc: "带诅咒邪剑，输出随损失血量高低巨额增减。", rating: 4, review: "控血高伤流派首选，打得极痛。", stats: { dps: 4.8, sur: 2, cc: 1.5, gro: 1, cdr: 3 } },
        
        "parm_aegis": { name: "帕姆之盾", nameEn: "Parm Aegis", type: "passive", category: "castlevania", icon: "🛡️", desc: "恶魔城专属被动。大幅提升角色全身防御抗性 15%。", rating: 4, review: "防御类神被动，比基础护甲性价比高。" },
        "karomas_mana": { name: "卡洛马魔力", nameEn: "Karoma's Mana", type: "passive", category: "castlevania", icon: "💎", desc: "恶魔城专属。大福度缩短魔导武器技能CD 10%。", rating: 4.5, review: "第二本冷却书，法术流狂喜。" },
        "tiragisu": { name: "提拉米苏", nameEn: "Tiragisu", type: "passive", category: "castlevania", icon: "🍰", desc: "恶魔城专属被动。提供复活机会，并在复活时大幅提升短暂无敌与攻击力。", rating: 5, review: "恶魔城最强生存被动，复活加无敌是终极容错保障。" },
        
        // 恶魔城超武
        "vampire_killer": { name: "圣鞭", nameEn: "Vampire Killer", type: "evolved", category: "castlevania", icon: "⛓️", desc: "炼金鞭进化。圣洁光辉横斩战场，在击碎目标时恢复10点血量且带闪光大爆炸。", rating: 4.8, review: "续航和范围都是霸主，恶魔城的荣耀鞭。", stats: { dps: 4.6, sur: 4.8, cc: 3, gro: 1, cdr: 3 } },
        "hurricane_whip": { name: "飓风鞭", nameEn: "Hurricane Whip", type: "evolved", category: "castlevania", icon: "🌪️", desc: "风鞭进化。攻击产生大量卷席全图的飓风旋涡，高DPS。", rating: 4.7, review: "飓风能自动撕开防线，输出极高。", stats: { dps: 4.9, sur: 3, cc: 4, gro: 1, cdr: 4 } },
        "platinum_whip_ev": { name: "白金鞭·改", nameEn: "Platinum Whip Evolved", type: "evolved", category: "castlevania", icon: "⛓️", desc: "白金鞭强化型。暴击产生极光溅射净化怪潮。", rating: 4.6, review: "伤害十分纯正的神圣大皮鞭。", stats: { dps: 4.7, sur: 2.5, cc: 2, gro: 1, cdr: 3 } },
        "dragon_water_whip_ev": { name: "龙水鞭·改", nameEn: "Dragon Water Whip Evolved", type: "evolved", category: "castlevania", icon: "🧪", desc: "水鞭强化。落冰覆盖面扩大，大面结晶化冰封恶魔。", rating: 4.8, review: "顶配冰控输出，非常安心的配方。", stats: { dps: 4.5, sur: 4.5, cc: 5, gro: 1, cdr: 3 } },
        "nebula_whip": { name: "星云鞭", nameEn: "Nebula Whip", type: "evolved", category: "castlevania", icon: "🌌", desc: "音鞭进化。挥出带高频电浆爆发的星团风暴。", rating: 4.6, review: "高范围溅射闪电鞭，打怪很爽脆。", stats: { dps: 4.8, sur: 3, cc: 3.5, gro: 1, cdr: 3 } },
        "jet_black_whip_ev": { name: "漆黑鞭·改", nameEn: "Jet Black Whip Evolved", type: "evolved", category: "castlevania", icon: "⛓️", desc: "毒雾大面积扩张。中毒魔物伤害和移速永久被削弱。", rating: 4.7, review: "折磨流天花板，毒雾几乎常驻全图。", stats: { dps: 4.7, sur: 4, cc: 4, gro: 1, cdr: 3 } },
        "vibhuti_whip_ev": { name: "圣灰鞭·改", nameEn: "Vibhuti Whip Evolved", type: "evolved", category: "castlevania", icon: "🧹", desc: "尘灰形成圣土结界，入内敌兵承受高额神圣易伤。", rating: 4.5, review: "重度防御阵地战的神物。", stats: { dps: 4.2, sur: 4.8, cc: 4.5, gro: 1, cdr: 3 } },
        "vanitas_whip_ev": { name: "虚无鞭·改", nameEn: "Vanitas Whip Evolved", type: "evolved", category: "castlevania", icon: "🖤", desc: "虚无之刺！每次攻击吸收生命与怒气化作光箭散射。", rating: 4.7, review: "法力流、CD流吸血主武器。", stats: { dps: 4.6, sur: 4.5, cc: 2.5, gro: 1, cdr: 4 } },
        "star_shuriken": { name: "星形手里剑", nameEn: "Star Shuriken", type: "evolved", category: "castlevania", icon: "⭐", desc: "手里剑进化。大号手里剑在场上无尽弹射，爆裂时抛出无数细小飞星。", rating: 4.7, review: "画面上全是旋转的星星，杀伤效果极其狂暴。", stats: { dps: 4.9, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        "curved_knife_ev": { name: "弯刀·改", nameEn: "Curved Knife Evolved", type: "evolved", category: "castlevania", icon: "🗡️", desc: "圆月弯刀化作死亡利刃风暴，绞碎一切碰触体。", rating: 4.6, review: "纯单体直线输出爆表。", stats: { dps: 4.8, sur: 2, cc: 2, gro: 1, cdr: 4 } },
        "javelin_ev": { name: "标枪·改", nameEn: "Javelin Evolved", type: "evolved", category: "castlevania", icon: "🔱", desc: "标枪在场上召唤雷枪矩阵，大面积撕碎防线并震地击飞。", rating: 4.8, review: "物理控制打击首选，重击震撼。", stats: { dps: 4.7, sur: 3.5, cc: 4.5, gro: 1, cdr: 3 } },
        "discus_ev": { name: "飞盘·改", nameEn: "Discus Evolved", type: "evolved", category: "castlevania", icon: "🥏", desc: "飞轮裂变，每个反弹点均引发三向能量波分裂。", rating: 4.7, review: "屏幕边缘反弹流的神器，密室输出无可匹敌。", stats: { dps: 4.9, sur: 2, cc: 3, gro: 1, cdr: 3 } },
        "wrecking_ball": { name: "落锤铁球", nameEn: "Wrecking Ball", type: "evolved", category: "castlevania", icon: "⛓️", desc: "铁球进化。拖挂巨型破碎锤满图横扫冲击，砸扁一切怪物。", rating: 4.8, review: "物理极暴力碾压，小怪连击退机会都没有直接碾碎。", stats: { dps: 4.9, sur: 3.5, cc: 4, gro: 1, cdr: 2 } },
        "gold_revolver": { name: "黄金左轮", nameEn: "Gold Revolver", type: "evolved", category: "castlevania", icon: "🔫", desc: "左轮枪进化. 开火造成黄金暴击弹雨，被击杀魔物高概率化为金币。", rating: 4.9, review: "堪比本体猫眼的高额金币掠夺利器，日常DPS也无情。", stats: { dps: 5, sur: 2.5, cc: 2.5, gro: 3, cdr: 4 } },
        "cluster_grenade": { name: "集束手榴弹", nameEn: "Cluster Grenade", type: "evolved", category: "castlevania", icon: "💣", desc: "手雷分裂为集束神圣爆破，全图范围开火洗地。", rating: 4.6, review: "爆炸的轰鸣声极其悦耳，覆盖很大。", stats: { dps: 4.7, sur: 2.5, cc: 3.5, gro: 1, cdr: 3 } },
        "wine_glass_ev": { name: "酒杯·改", nameEn: "Wine Glass Evolved", type: "evolved", category: "castlevania", icon: "🍷", desc: "红酒泼洒化作吞天圣火墙，极大提升角色的魔伤加倍伤害。", rating: 4.8, review: "极地火燃烧，堪称最强火系AOE底座。", stats: { dps: 4.9, sur: 3.5, cc: 3.5, gro: 1, cdr: 3 } },
        "raging_fire_ev": { name: "烈火术·改", nameEn: "Raging Fire Evolved", type: "evolved", category: "castlevania", icon: "🔥", desc: "火雨降世！在玩家面前形成一列无止境的流火推进潮。", rating: 4.7, review: "法术割草极度爽快，推进力拔群。", stats: { dps: 4.8, sur: 2.5, cc: 3, gro: 1, cdr: 3 } },
        "ice_fang_ev": { name: "冰牙术·改", nameEn: "Ice Fang Evolved", type: "evolved", category: "castlevania", icon: "❄️", desc: "绝对零度！召唤巨大的寒冰城堡碎片拔地而起，冰封大范围恶魔。", rating: 4.9, review: "大冰堡爆发控图，全DLC控怪首选。", stats: { dps: 4.7, sur: 4.8, cc: 5, gro: 1, cdr: 3 } },
        "gale_force_ev": { name: "狂风术·改", nameEn: "Gale Force Evolved", type: "evolved", category: "castlevania", icon: "🌬️", desc: "大龙卷！释放数股狂野的大龙卷风卷起周身怪兽并摔伤。", rating: 4.7, review: "清怪范围超常，高DPS卷击。", stats: { dps: 4.8, sur: 3, cc: 4, gro: 1, cdr: 3 } },
        "rock_riot_ev": { name: "滚石术·改", nameEn: "Rock Riot Evolved", type: "evolved", category: "castlevania", icon: "🪨", desc: "山崩地裂！砸落陨岩引发屏幕震颤及地热溅射爆裂。", rating: 4.6, review: "爆炸伤害范围极夸张，震屏感十足。", stats: { dps: 4.7, sur: 2.5, cc: 3.5, gro: 1, cdr: 2 } },
        "fulgur_ev": { name: "雷电术·改", nameEn: "Fulgur Evolved", type: "evolved", category: "castlevania", icon: "⚡", desc: "狂雷天牢！将怪物禁锢并在雷击中产生无尽闪电链穿梭割草。", rating: 4.9, review: "闪电密布屏幕，全图DPS之皇。", stats: { dps: 5, sur: 2, cc: 4, gro: 1, cdr: 4 } },
        "keremet_bubbles_ev": { name: "泡沫术·改", nameEn: "Keremet Bubbles Evolved", type: "evolved", category: "castlevania", icon: "🧼", desc: "召唤高强酸的彩球毒水泡沫，触碰引发腐蚀酸雾扩散。", rating: 4.5, review: "酸雨覆盖，防身和削甲效果卓越。", stats: { dps: 4.3, sur: 4, cc: 4, gro: 1, cdr: 3 } },
        "hex_ev": { name: "诅咒术·改", nameEn: "Hex Evolved", type: "evolved", category: "castlevania", icon: "🔮", desc: "怨魂风暴！从四周召集恶鬼吞噬小怪，并在击杀后削减全图小怪属性。", rating: 4.8, review: "衰减光环，大后期降怪物血量最强辅助。", stats: { dps: 4.7, sur: 4, cc: 4.5, gro: 1, cdr: 3 } },
        "refectio_ev": { name: "圣光术·改", nameEn: "Refectio Evolved", type: "evolved", category: "castlevania", icon: "✨", desc: "大日如来降恩！制造数个巨大耀眼圣光域，沐浴期间完全免疫低伤并狂怒输出。", rating: 5, review: "极强的范围无敌疗伤圈，安全感与输出并肩顶尖。", stats: { dps: 4.7, sur: 5, cc: 4, gro: 2, cdr: 3 } },
        "mace_ev": { name: "晨星槌·改", nameEn: "Mace Evolved", type: "evolved", category: "castlevania", icon: "🔨", desc: "砸下数道带有崩山地裂爆震效果的巨型流星槌影。", rating: 4.6, review: "打Boss爆发数一数二。", stats: { dps: 4.8, sur: 3, cc: 4, gro: 1, cdr: 2 } },
        "star_flail_ev": { name: "星辰连枷·改", nameEn: "Star Flail Evolved", type: "evolved", category: "castlevania", icon: "📿", desc: "连枷飞舞。引爆金色圣光环星，大幅推开敌群并击晕。", rating: 4.7, review: "阻击神盾，大范围击退控图极佳。", stats: { dps: 4.5, sur: 4.5, cc: 4.8, gro: 1, cdr: 3 } },
        "alucard_spear_ev": { name: "阿鲁卡多之枪·改", nameEn: "Alucard Spear Evolved", type: "evolved", category: "castlevania", icon: "🔱", desc: "化身蝙蝠残影！神枪突刺在图里撕开三条虚空刺斩裂缝。", rating: 4.9, review: "帅到掉渣！带短距瞬移伤害，穿透切割无情。", stats: { dps: 5, sur: 3.5, cc: 2.5, gro: 1, cdr: 4 } },
        "trident_ev": { name: "三叉戟·改", nameEn: "Trident Evolved", type: "evolved", category: "castlevania", icon: "🌊", desc: "怒海狂涛！屏幕爆发出海啸大波浪冲毁四周敌阵。", rating: 4.8, review: "大范围水洗屏，清边清角优秀。", stats: { dps: 4.8, sur: 3.5, cc: 4.5, gro: 1, cdr: 3 } },
        "iron_shield_ev": { name: "铁盾·改", nameEn: "Iron Shield Evolved", type: "evolved", category: "castlevania", icon: "🛡️", desc: "环绕周身的铁壁巨盾，自动防反怪物并几率触发反伤雷击。", rating: 4.7, review: "高肉盾极品超武，反射率惊人。", stats: { dps: 3, sur: 5, cc: 4.5, gro: 1, cdr: 3 } },
        "guardians_targe_ev": { name: "卫士小盾·改", nameEn: "Guardian's Targe Evolved", type: "evolved", category: "castlevania", icon: "🛡️", desc: "守护能量爆燃！受伤触发全图气劲冲击波击退。", rating: 4.5, review: "防贴身、爆发型自保防具。", stats: { dps: 3.5, sur: 4.7, cc: 4.8, gro: 1, cdr: 3 } },
        "tyrfing_ev": { name: "提尔锋·改", nameEn: "Tyrfing Evolved", type: "evolved", category: "castlevania", icon: "🗡️", desc: "嗜血邪神刃！以高昂的血量爆发红黑大剑波，半屏秒杀。", rating: 4.8, review: "极端的空血高伤流派首选，压血压轴极其暴力。", stats: { dps: 5, sur: 2.5, cc: 2, gro: 1, cdr: 3 } }
      },
      
      // 合成关系数据库
      evolutions: [
        // 本体超武
        { weapon: "whip", passive: "hollow_heart", evolved: "bloody_tear" },
        { weapon: "magic_wand", passive: "empty_tome", evolved: "holy_wand" },
        { weapon: "knife", passive: "bracer", evolved: "thousand_edge" },
        { weapon: "axe", passive: "candelabrador", evolved: "death_spiral" },
        { weapon: "cross", passive: "clover", evolved: "heaven_sword" },
        { weapon: "king_bible", passive: "spellbinder", evolved: "vesper_vespers" },
        { weapon: "fire_wand", passive: "spinach", evolved: "hellfire" },
        { weapon: "garlic", passive: "pummarola", evolved: "soul_eater" },
        { weapon: "santa_water", passive: "attractorb", evolved: "la_borra" },
        { weapon: "lightning_ring", passive: "duplicator", evolved: "thunder_loop" },
        { weapon: "pentagram", passive: "crown", evolved: "gorgeous_moon" },
        { weapon: "runetracer", passive: "armor", evolved: "no_future" },
        { weapon: "peachone", passive: "ebony_wings", evolved: "vandalier", cond: "特殊：白鸽子与黑鸽子均需满级（8级）融合成一格" }, 
        { weapon: "gatti_amari", passive: "stone_mask", evolved: "vicious_hunger" },
        { weapon: "song_of_mana", passive: "skull_omaniac", evolved: "mannajja" },
        { weapon: "shadow_pinion", passive: "wings", evolved: "valkyrie_turner" },
        { weapon: "victory_sword", passive: "torronas_box", evolved: "sole_solution", cond: "特殊：主武器满级，且被动「托罗纳的盒子」需升至满级（9级）" },
        { weapon: "flames_of_misspell", passive: "torronas_box", evolved: "ashes_of_muspell", cond: "特殊：主武器满级，且被动「托罗纳的盒子」需升至满级（9级）" },
        { weapon: "glass_fandango", passive: "wings", evolved: "celestial_voulge" },
        // 三件套进化
        { weapon: "clock_lancet", passive: "silver_ring", evolved: "infinite_corridor", cond: "特殊：时钟柳叶刀、银色戒指（地图拾取）、金色戒指（地图拾取）三件套均需升至满级" }, 
        { weapon: "laurel", passive: "left_metaglio", evolved: "crimson_shroud", cond: "特殊：月桂、左披风（地图拾取）、右披风（地图拾取）三件套均需升至满级" },      

        // DLC1: 月咒山
        { weapon: "silver_wind", passive: "pummarola", evolved: "festive_winds" },
        { weapon: "four_seasons", passive: "candelabrador", evolved: "godai_shuffle", cond: "特殊：四季满级，且被动「烛台」与「菠菜」均需满级" }, 
        { weapon: "summon_night", passive: "duplicator", evolved: "echo_night" },
        { weapon: "mirage_robe", passive: "attractorb", evolved: "jodore" },
        { weapon: "night_sword", passive: "stone_mask", evolved: "muramasa" },
        { weapon: "mille_bolle_blu", passive: "spellbinder", evolved: "boo_roo_too" },

        // DLC2: 福斯卡里
        { weapon: "eskizzibur", passive: "bracer", evolved: "legionnaire" },
        { weapon: "flash_arrow", passive: "clover", evolved: "millionaire", cond: "特殊：主武器满级，且被动「三叶草」与「护腕」均需满级" },
        { weapon: "spellstring", passive: "spellstream", evolved: "spellstrom", cond: "联合：乱射、咒语书、魔法书均需升至满级（8级）合并进化" }, 
        { weapon: "shadow_servant", passive: "skull_omaniac", evolved: "ophion" },
        { weapon: "prismatic_missile", passive: "crown", evolved: "luminaire" },

        // DLC3: Among Us
        { weapon: "report", passive: "mini_crewmate", evolved: "emergency_meeting" },
        { weapon: "lucky_swipe", passive: "mini_engineer", evolved: "crossed_wires" },
        { weapon: "lifesign_scan", passive: "mini_ghost", evolved: "paranormal_scan" },
        { weapon: "just_vent", passive: "mini_shapeshifter", evolved: "unjust_ejection" },
        { weapon: "clear_debris", passive: "mini_guardian", evolved: "clear_asteroids" },
        { weapon: "sharp_tongue", passive: "mini_impostor", evolved: "impostongue" },
        { weapon: "science_rocks", passive: "mini_scientist", evolved: "rocket_science" },

        // DLC4: 魂斗罗
        { weapon: "long_gun", passive: "weapon_powerup", evolved: "prototype_a", cond: "常规：主武器满级 + 拥有被动「武器强化件」" },
        { weapon: "short_gun", passive: "weapon_powerup", evolved: "prototype_b", cond: "特殊：主武器满级 + 武器强化件 + 「护腕」" },
        { weapon: "spread_shot", passive: "weapon_powerup", evolved: "prototype_c", cond: "特殊：主武器满级 + 武器强化件 + 「空白之书」" },
        { weapon: "c_u_laser", passive: "weapon_powerup", evolved: "pronto_beam", cond: "特殊：主武器满级 + 武器强化件 + 「提拉米苏」" },
        { weapon: "firearm", passive: "weapon_powerup", evolved: "fire_l3gs", cond: "特殊：主武器满级 + 武器强化件 + 「烛台」" },
        { weapon: "sonic_bloom", passive: "weapon_powerup", evolved: "wave_beam", cond: "特殊：主武器满级 + 武器强化件 + 「护甲」" },
        { weapon: "homing_miss", passive: "weapon_powerup", evolved: "multistage_missiles", cond: "特殊：主武器满级 + 武器强化件 + 「复制器」" },
        { weapon: "diver_mines", passive: "weapon_powerup", evolved: "atmo_torpedo", cond: "特殊：主武器满级 + 武器强化件 + 「吸引器」" },
        { weapon: "blade_crossbow", passive: "weapon_powerup", evolved: "bfc2000_ad", cond: "特殊：主武器满级 + 武器强化件 + 「三叶草」" },
        { weapon: "prism_lass", passive: "weapon_powerup", evolved: "time_warp", cond: "特殊：主武器满级 + 武器强化件 + 「翅膀」" },
        { weapon: "metal_claw", passive: "weapon_powerup", evolved: "big_fuzzy_fist", cond: "特殊：主武器满级 + 武器强化件 + 「空虚之心」" },

        // DLC5: 恶魔城
        { weapon: "alchemy_whip", passive: "tiragisu", evolved: "vampire_killer" },
        { weapon: "wind_whip", passive: "crown", evolved: "hurricane_whip" },
        { weapon: "platinum_whip", passive: "clover", evolved: "platinum_whip_ev" },
        { weapon: "dragon_water_whip", passive: "attractorb", evolved: "dragon_water_whip_ev" },
        { weapon: "sonic_whip", passive: "skull_omaniac", evolved: "nebula_whip" },
        { weapon: "jet_black_whip", passive: "stone_mask", evolved: "jet_black_whip_ev" },
        { weapon: "vibhuti_whip", passive: "candelabrador", evolved: "vibhuti_whip_ev" },
        { weapon: "vanitas_whip", passive: "hollow_heart", evolved: "vanitas_whip_ev" },
        { weapon: "shuriken", passive: "empty_tome", evolved: "star_shuriken" },
        { weapon: "curved_knife", passive: "bracer", evolved: "curved_knife_ev" },
        { weapon: "javelin", passive: "spellbinder", evolved: "javelin_ev" },
        { weapon: "discus", passive: "parm_aegis", evolved: "discus_ev", cond: "特殊：主武器满级，且被动「帕姆之盾」需升至满级" },
        { weapon: "iron_ball", passive: "armor", evolved: "wrecking_ball" },
        { weapon: "silver_revolver", passive: "karomas_mana", evolved: "gold_revolver", cond: "特殊：主武器满级，且被动「卡洛马魔力」需升至满级" },
        { weapon: "grenade", passive: "candelabrador", evolved: "cluster_grenade" },
        { weapon: "wine_glass", passive: "tiragisu", evolved: "wine_glass_ev" },
        // 贝尔蒙特魔法书
        { weapon: "raging_fire", passive: "spinach", evolved: "raging_fire_ev", cond: "特殊：主武器满级，且被动「菠菜」需升至满级" },
        { weapon: "ice_fang", passive: "spellbinder", evolved: "ice_fang_ev", cond: "特殊：主武器满级，且被动「拼写器」需升至满级" },
        { weapon: "gale_force", passive: "bracer", evolved: "gale_force_ev", cond: "特殊：主武器满级，且被动「护腕」需升至满级" },
        { weapon: "rock_riot", passive: "stone_mask", evolved: "rock_riot_ev", cond: "特殊：主武器满级，且被动「石面具」需升至满级" },
        { weapon: "fulgur", passive: "duplicator", evolved: "fulgur_ev", cond: "特殊：主武器满级，且被动「复制器」需升至满级" },
        { weapon: "keremet_bubbles", passive: "armor", evolved: "keremet_bubbles_ev", cond: "特殊：主武器满级，且被动「护甲」需升至满级" },
        { weapon: "hex", passive: "skull_omaniac", evolved: "hex_ev", cond: "特殊：主武器满级，且被动「疯狂骷髅」需升至满级" },
        { weapon: "refectio", passive: "clover", evolved: "refectio_ev", cond: "特殊：主武器满级，且被动「三叶草」需升至满级" },
        
        { weapon: "mace", passive: "hollow_heart", evolved: "mace_ev" },
        { weapon: "star_flail", passive: "pummarola", evolved: "star_flail_ev", cond: "特殊：主武器满级，且被动「愈伤番茄」需升至满级" },
        { weapon: "alucard_spear", passive: "wings", evolved: "alucard_spear_ev" },
        { weapon: "trident", passive: "duplicator", evolved: "trident_ev", cond: "特殊：主武器满级，且被动「复制器」需升至满级" },
        { weapon: "iron_shield", passive: "parm_aegis", evolved: "iron_shield_ev", cond: "特殊：主武器满级，且被动「帕姆之盾」需升至满级" },
        { weapon: "guardians_targe", passive: "pummarola", evolved: "guardians_targe_ev", cond: "特殊：主武器满级，且被动「愈伤番茄」需升至满级" },
        { weapon: "tyrfing", passive: "spinach", evolved: "tyrfing_ev", cond: "特殊：主武器满级，且被动「菠菜」需升至满级" }
      ],
      
      // 角色数据库
      characters: {
        "antonio": {
          name: "安东尼奥",
          nameEn: "Antonio Belmont",
          icon: "🧔",
          category: "base",
          initWeaponKey: "whip",
          passiveDesc: "每10级增加10%伤害，最高+50%。",
          unlock: "初始解锁",
          recommends: ["whip", "spinach", "hollow_heart", "candelabrador"]
        },
        "imelda": {
          name: "伊梅尔达",
          nameEn: "Imelda Belpaese",
          icon: "👩",
          category: "base",
          initWeaponKey: "magic_wand",
          passiveDesc: "每5级增加10%经验获取，最高+30%。",
          unlock: "初始解锁",
          recommends: ["magic_wand", "empty_tome", "crown", "duplicator"]
        },
        "pasqualina": {
          name: "帕斯夸丽娜",
          nameEn: "Pasqualina Belpaese",
          icon: "🧝‍♀️",
          category: "base",
          initWeaponKey: "runetracer",
          passiveDesc: "每5级提升10%弹道速度，最高+30%。",
          unlock: "初始解锁",
          recommends: ["runetracer", "armor", "bracer", "spellbinder"]
        },
        "gennaro": {
          name: "詹纳罗",
          nameEn: "Gennaro Belpaese",
          icon: "🧑",
          category: "base",
          initWeaponKey: "knife",
          passiveDesc: "所有武器的投射物数量永久+1。",
          unlock: "花费 500 金币解锁",
          recommends: ["knife", "bracer", "duplicator", "empty_tome"]
        },
        "poe": {
          name: "坡",
          nameEn: "Poe Ratcho",
          icon: "👴",
          category: "base",
          initWeaponKey: "garlic",
          passiveDesc: "永久+30%拾取范围，但最大生命值-30。",
          unlock: "将大蒜升到4级后解锁",
          recommends: ["garlic", "pummarola", "attractorb", "candelabrador"]
        },
        "suor_clerici": {
          name: "克莱里奇",
          nameEn: "Suor Clerici",
          icon: "👩‍⚕️",
          category: "base",
          initWeaponKey: "santa_water",
          passiveDesc: "每秒恢复 0.5 生命，1级时获得+400%范围加成。",
          unlock: "累计恢复 1000 生命值解锁",
          recommends: ["santa_water", "attractorb", "candelabrador", "spellbinder"]
        },
        "porta": {
          name: "波尔塔",
          nameEn: "Porta Ladona",
          icon: "🧙‍♀️",
          category: "base",
          initWeaponKey: "lightning_ring",
          passiveDesc: "永久拥有+30%范围，且1级时技能冷却大幅降低。",
          unlock: "将闪电戒指升到4级后解锁",
          recommends: ["lightning_ring", "duplicator", "empty_tome", "candelabrador"]
        },
        "arca": {
          name: "阿尔卡",
          nameEn: "Arca Ladona",
          icon: "🧙‍♂️",
          category: "base",
          initWeaponKey: "fire_wand",
          passiveDesc: "每10级减少5%冷却时间，最高-15%。",
          unlock: "将火之魔杖升到4级后解锁",
          recommends: ["fire_wand", "spinach", "empty_tome", "duplicator"]
        },
        "krochi": {
          name: "克罗齐",
          nameEn: "Krochi Freetto",
          icon: "👿",
          category: "base",
          initWeaponKey: "cross",
          passiveDesc: "初始获得1次复活机会，33级时再额外获得1次复活。",
          unlock: "累计击败 100,000 个敌人后解锁",
          recommends: ["cross", "clover", "wings", "hollow_heart"]
        },
        "christine": {
          name: "克里斯汀",
          nameEn: "Christine Davain",
          icon: "👸",
          category: "base",
          initWeaponKey: "pentagram",
          passiveDesc: "初始额外多升1级。生命上限稍低，但移速+10%，冷却-25%。",
          unlock: "在一局中将五芒星升到满级解锁",
          recommends: ["pentagram", "crown", "empty_tome", "attractorb"]
        },
        "miang": {
          name: "美庵",
          nameEn: "Miang Moonspell",
          icon: "🧑‍⚕️",
          category: "moonspell",
          initWeaponKey: "silver_wind",
          passiveDesc: "溢出治疗可增加最大生命上限（最高+1000），且溢出恢复能增加伤害。",
          unlock: "在「月咒山」关卡中打开棺材解锁",
          recommends: ["silver_wind", "pummarola", "hollow_heart", "spellbinder"]
        },
        "menya": {
          name: "门屋",
          nameEn: "Menya Moonspell",
          icon: "🦊",
          category: "moonspell",
          initWeaponKey: "four_seasons",
          passiveDesc: "击杀大量敌人后进入无敌爆发状态，此时移速与范围极大提升。",
          unlock: "在一局中将四季升到满级解锁",
          recommends: ["four_seasons", "candelabrador", "spinach", "empty_tome"]
        },
        "syuuto": {
          name: "修图",
          nameEn: "Syuuto Moonspell",
          icon: "🥷",
          category: "moonspell",
          initWeaponKey: "summon_night",
          passiveDesc: "击杀精英怪可永久提升伤害（上限+50%），且每5分钟触发全屏震波。",
          unlock: "在一局中将召唤之夜升到满级解锁",
          recommends: ["summon_night", "duplicator", "empty_tome", "spinach"]
        },
        "eleanor": {
          name: "埃莉诺",
          nameEn: "Eleanor Uziron",
          icon: "🧝‍♀️",
          category: "foscari",
          initWeaponKey: "spellstring",
          passiveDesc: "在达到 10、20、30级 时分别自动获得「咒语书」和「魔法书」，便于进行融合。",
          unlock: "在「福斯卡里湖」关卡中打开棺材解锁",
          recommends: ["spellstring", "spellstream", "spellstrike", "empty_tome"]
        },
        "maruto": {
          name: "马鲁托",
          nameEn: "Maruto Cuts",
          icon: "💂",
          category: "foscari",
          initWeaponKey: "eskizzibur",
          passiveDesc: "受伤时短暂获得蓄力高防御。击杀敌人会小幅提升近战武器伤害。",
          unlock: "在一局中合成三魔法融合超武「符文法术」解锁",
          recommends: ["eskizzibur", "bracer", "armor", "hollow_heart"]
        },
        "keitha": {
          name: "凯莎",
          nameEn: "Keitha Muort",
          icon: "🏹",
          category: "foscari",
          initWeaponKey: "flash_arrow",
          passiveDesc: "每提升 10% 的移动速度，可增加 1% 武器威力，幸运值加成箭雨射程。",
          unlock: "在一局中将湖中剑进化为「瑞纳罗克」解锁",
          recommends: ["flash_arrow", "clover", "bracer", "wings"]
        },
        "crewmate": {
          name: "红色船员",
          nameEn: "Crewmate Red",
          icon: "🧑‍🚀",
          category: "amongus",
          initWeaponKey: "report",
          passiveDesc: "升级时大幅增加 Mini 船员刷新概率；每10级提升全武器 5% 威能。",
          unlock: "在「波利斯」地图中找到并点击完成紧急任务解锁",
          recommends: ["report", "mini_crewmate", "empty_tome", "attractorb"]
        },
        "impostor": {
          name: "内鬼",
          nameEn: "Impostor Rolo",
          icon: "😈",
          category: "amongus",
          initWeaponKey: "sharp_tongue",
          passiveDesc: "击杀精英怪获得短暂无敌；身边没有 Mini 伙伴时暴击率提升 50%。",
          unlock: "在「波利斯」地图中累计击败 10 个冒牌货解锁",
          recommends: ["sharp_tongue", "mini_impostor", "spinach", "bracer"]
        },
        "bill": {
          name: "比尔·雷泽",
          nameEn: "Bill Rizer",
          icon: "🎖️",
          category: "contra",
          initWeaponKey: "long_gun",
          passiveDesc: "拾取强化件时额外提升 50% 弹道射速与 30% 范围，持续15秒。",
          unlock: "在「新加鲁加」关卡中救出被困的比尔解锁",
          recommends: ["long_gun", "weapon_powerup", "bracer", "empty_tome"]
        },
        "lance": {
          name: "兰斯·比恩",
          nameEn: "Lance Bean",
          icon: "🎖️",
          category: "contra",
          initWeaponKey: "spread_shot",
          passiveDesc: "所有武器的子弹发射数固定+1，且被动拥有强化件伤害翻倍增益。",
          unlock: "在「新加鲁加」中击败最终巨型异形 BOSS 解锁",
          recommends: ["spread_shot", "weapon_powerup", "duplicator", "empty_tome"]
        },
        "simon": {
          name: "西蒙·贝尔蒙特",
          nameEn: "Simon Belmont",
          icon: "🧛‍♂️",
          category: "castlevania",
          initWeaponKey: "alchemy_whip",
          passiveDesc: "鞭类武器伤害+30%；吃红心时触发神圣震波爆击周围恶灵。",
          unlock: "在「恶魔城」中打破墙壁解救西蒙解锁",
          recommends: ["alchemy_whip", "tiragisu", "candelabrador", "spinach"]
        },
        "alucard": {
          name: "阿鲁卡多",
          nameEn: "Alucard",
          icon: "🧛",
          category: "castlevania",
          initWeaponKey: "alucard_spear",
          passiveDesc: "濒死时转化为无敌吸血蝙蝠形态，大范围撕咬敌人并疯狂恢复生命。",
          unlock: "在「恶魔城」关卡中寻得阿鲁卡多之枪后解救他解锁",
          recommends: ["alucard_spear", "wings", "parm_aegis", "karomas_mana"]
        }
      }
    };

const WIKI_IMG = 'https://vampire.survivors.wiki/images/';

const ITEM_WIKI_OVERRIDES: Record<string, string> = {
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
  'ebony_wings': 'Ebony_Wings',
  'hollow_heart': 'Hollow_Heart',
  'empty_tome': 'Empty_Tome',
  'magic_wand': 'Magic_Wand',
  'fire_wand': 'Fire_Wand',
  'santa_water': 'Santa_Water',
  'lightning_ring': 'Lightning_Ring',
  'king_bible': 'King_Bible',
  'bloody_tear': 'Bloody_Tear',
  'holy_wand': 'Holy_Wand',
  'death_spiral': 'Death_Spiral',
  'heaven_sword': 'Heaven_Sword',
  'vesper_vespers': 'Vesper_Vespers',
  'soul_eater': 'Soul_Eater',
  'la_borra': 'La_Borra',
  'thunder_loop': 'Thunder_Loop',
  'gorgeous_moon': 'Gorgeous_Moon',
  'vicious_hunger': 'Vicious_Hunger',
  'valkyrie_turner': 'Valkyrie_Turner',
  'sole_solution': 'Sole_Solution',
  'celestial_voulge': 'Celestial_Voulge',
  'infinite_corridor': 'Infinite_Corridor',
  'crimson_shroud': 'Crimson_Shroud',
  'silver_wind': 'Silver_Wind',
  'four_seasons': 'Four_Seasons',
  'summon_night': 'Summon_Night',
  'mirage_robe': 'Mirage_Robe',
  'night_sword': 'Night_Sword',
  'mille_bolle_blu': 'Mille_Bolle_Blu',
  'festive_winds': 'Festive_Winds',
  'godai_shuffle': 'Godai_Shuffle',
  'echo_night': 'Echo_Night',
  'boo_roo_too': 'Boo_Roo_Too',
  'prismatic_missile': 'Prismatic_Missile',
  'shadow_servant': 'Shadow_Shervant',
  'flash_arrow': 'Flash_Arrow',
  'lucky_swipe': 'Lucky_Swipe',
  'lifesign_scan': 'Lifesign_Scan',
  'just_vent': 'Just_Vent',
  'clear_debris': 'Clear_Debris',
  'sharp_tongue': 'Sharp_Tongue',
  'science_rocks': 'Science_Rocks',
  'long_gun': 'Long_Gun',
  'short_gun': 'Short_Gun',
  'spread_shot': 'Spread_Shot',
  'homing_miss': 'Homing_Miss',
  'diver_mines': 'Diver_Mines',
  'blade_crossbow': 'Blade_Crossbow',
  'prism_lass': 'Prism_Lass',
  'metal_claw': 'Metal_Claw',
  'sonic_bloom': 'Sonic_Bloom',
  'weapon_powerup': 'Weapon_Powerup',
  'emergency_meeting': 'Emergency_Meeting',
  'crossed_wires': 'Crossed_Wires',
  'paranormal_scan': 'Paranormal_Scan',
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

const CHAR_WIKI_NAMES: Record<string, string> = {
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

// 动态拼装图片 URL
Object.keys(VS_DATA.items).forEach(key => {
  const override = ITEM_WIKI_OVERRIDES[key];
  const wikiName = override || key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
  (VS_DATA.items[key] as any).img = WIKI_IMG + 'Icon-' + wikiName + '.png';
});

Object.keys(VS_DATA.characters).forEach(key => {
  const wikiName = CHAR_WIKI_NAMES[key];
  if (wikiName) {
    (VS_DATA.characters[key] as any).img = WIKI_IMG + 'Select-' + wikiName + '.png';
  }
});

