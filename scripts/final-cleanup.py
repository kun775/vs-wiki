#!/usr/bin/env python3
"""Final cleanup: replace remaining English words in already most-Chinese text."""
import re

DATA_PATH = "src/data/vsData.ts"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Word-level replacements (applied only inside passiveDesc and unlock strings)
word_replacements = [
    # Prepositions / particles
    (r'\bat\b', '在'),
    (r'\bto\b', ''),
    (r'\bfrom\b', '从'),
    (r'\bin\b', ''),
    (r'\bby\b', '达'),
    (r'\bof\b', '的'),
    (r'\bfor\b', '持续'),
    (r'\bwith\b', '以'),
    (r'\bupon\b', '当'),
    (r'\bafter\b', '后'),
    (r'\bwhile\b', '当'),
    (r'\binto\b', '成'),
    (r'\bvia\b', '通过'),

    # Conjunctions
    (r'\band\b', '，'),
    (r'\bor\b', '或'),
    (r'\bbut\b', '但'),

    # Pronouns / Determiners
    (r'\bthis\b', '此'),
    (r'\bthat\b', ''),
    (r'\bthese\b', '这些'),
    (r'\bthose\b', '那些'),
    (r'\bits\b', '其'),
    (r'\bitself\b', '自身'),
    (r'\btheir\b', '其'),
    (r'\bhis\b', '他的'),
    (r'\bher\b', '她的'),
    (r'\bthe\b', ''),
    (r'\ba\b', ''),
    (r'\ban\b', ''),
    (r'\beach\b', '每'),
    (r'\bevery\b', '每'),
    (r'\ball\b', '所有'),
    (r'\bsome\b', '某些'),
    (r'\bany\b', '任意'),
    (r'\bno\b', '无'),
    (r'\bonly\b', '仅'),
    (r'\bjust\b', '只'),
    (r'\balso\b', '也'),

    # Verbs - common
    (r'\bis\b', ''),
    (r'\bare\b', ''),
    (r'\bbe\b', ''),
    (r'\bwas\b', ''),
    (r'\bwere\b', ''),
    (r'\bhas\b', '拥有'),
    (r'\bhave\b', '有'),
    (r'\bhad\b', '拥有'),
    (r'\bwill\b', '会'),
    (r'\bwould\b', '会'),
    (r'\bcan\b', '可'),
    (r'\bcannot\b', '无法'),
    (r'\bdoes\b', ''),
    (r'\bdo\b', ''),
    (r'\bdon\'?t\b', '不'),
    (r'\bdoing\b', '造成'),
    (r'\bdoesn\'?t\b', '不'),
    (r'\bsays?\b', '说'),
    (r'\bmakes?\b', '使得'),
    (r'\bbecomes?\b', '变为'),
    (r'\btakes?\b', '获得'),
    (r'\bgives?\b', '给予'),
    (r'\bfind\b', '发现'),
    (r'\bfound\b', '发现'),
    (r'\bgets?\b', '获得'),
    (r'\bgained?\b', '获得'),
    (r'\bgain\b', '获得'),
    (r'\bloses?\b', '失去'),
    (r'\blosing\b', '失去'),
    (r'\bincreases?\b', '增加'),
    (r'\bdecreases?\b', '减少'),
    (r'\bdecreasing\b', '减少'),
    (r'\breceives?\b', '获得'),
    (r'\bobtaining?\b', '获得'),
    (r'\bobtains?\b', '获得'),
    (r'\btriggered?\b', '触发'),
    (r'\btriggers?\b', '触发'),
    (r'\bappears?\b', '出现'),
    (r'\bappearing\b', '出现'),
    (r'\bspawns?\b', '生成'),
    (r'\bdamaged?\b', '受伤'),
    (r'\bdamaging\b', '伤害'),
    (r'\bcharges?\b', '充能'),
    (r'\bcharged\b', '充能'),
    (r'\buses?\b', '使用'),
    (r'\busing\b', '使用'),
    (r'\ballows?\b', '允许'),
    (r'\bprovides?\b', '提供'),

    # Nouns
    (r'\btime\b', '次'),
    (r'\btimes\b', '次'),
    (r'\bdamage\b', '伤害'),
    (r'\bhealth\b', '生命'),
    (r'\bweapon\b', '武器'),
    (r'\bweapons?\b', '武器'),
    (r'\benem(?:y|ies)\b', '敌人'),
    (r'\bprojectiles?\b', '弹幕'),
    (r'\bruns?\b', '局'),
    (r'\blevel\b', '级'),
    (r'\blevels?\b', '级'),
    (r'\bseconds?\b', '秒'),
    (r'\bminutes?\b', '分钟'),
    (r'\bpercent\b', '%'),
    (r'\bbonus(?:es)?\b', '加成'),
    (r'\beffect\b', '效果'),
    (r'\beffects?\b', '效果'),
    (r'\b(?:followers?|familiars?)\b', '随从'),
    (r'\bcats?\b', '猫'),
    (r'\bnormal\b', '正常'),
    (r'\bnormal\b', '正常'),
    (r'\bspecial\b', '特殊'),
    (r'\bhidden\b', '隐藏'),
    (r'\brandom\b', '随机'),
    (r'\bagainst\b', '对抗'),
    (r'\bunder\b', '下方'),
    (r'\babove\b', '上方'),
    (r'\baround\b', '周围'),
    (r'\bmore\b', '更'),
    (r'\bless\b', '更少'),
    (r'\bwhen\b', '当'),
    (r'\bwhere\b', '在'),
    (r'\bhow\b', ''),
    (r'\bwhat\b', ''),
    (r'\bnew\b', '新的'),
    (r'\bold\b', '旧的'),
    (r'\blasty?\b', '最后'),
    (r'\bflasty?\b', '最后'),
    (r'\bnow\b', '现在'),

    # Adverbs
    (r'\boften\b', '频繁地'),
    (r'\bfrequently\b', '频繁地'),
    (r'\balways\b', '总是'),
    (r'\bnever\b', '从不'),
    (r'\bstill\b', '仍然'),
    (r'\bagain\b', '再次'),
    (r'\btoo\b', '也'),
    (r'\bvery\b', '非常'),
    (r'\bhigh\b', '高'),
    (r'\blow\b', '低'),
    (r'\bhigher\b', '更高'),
    (r'\bhighest\b', '最高'),
    (r'\binstead\b', '取而代之'),
    (r'\bonce\b', '一次'),

    # Other common
    (r'\bthere\b', ''),
    (r'\bhere\b', ''),
    (r'\bthen\b', '然后'),
    (r'\bnow\b', '现在'),
    (r'\bso\b', '因此'),
    (r'\bas\b', '当'),
    (r'\bnot\b', '不'),
    (r'\bout\b', '出'),
    (r'\bup\b', '向上'),
    (r'\bdown\b', '向下'),
    (r'\bon\b', '在'),
    (r'\boff\b', '关闭'),
    (r'\bover\b', '超过'),
    (r'\bthrough\b', '通过'),
    (r'\bbetween\b', '之间'),

    # Game specific
    (r'\bincreses?\b', '增加'),
    (r'\badditively\b', '叠加'),
    (r'\bretaliatory\b', '反击'),
    (r'\bmultipli(?:e|cation)\b', '倍率'),
    (r'\bproportion\b', '比例'),
    (r'\bteams?\s+up\b', '组队'),
    (r'\bsongstress\b', '歌姬'),
    (r'\bdance\b', '舞蹈'),
    (r'\benabled\b', '启用'),
    (r'\bstats?\b', '属性'),
    (r'\bpetrified\b', '石化'),
    (r'\bcritical\b', '暴击'),
    (r'\bevolves?\b', '进化'),
    (r'\bevolving\b', '进化'),
    (r'\bevolved\b', '进化'),
    (r'\bstandstill\b', '静止'),
    (r'\baspects?\b', '方面'),
    (r'\bglimmers?\b', '闪烁'),
    (r'\bglimmered\b', '闪烁的'),
    (r'\boffered\b', '提供'),
    (r'\bgranted\b', '授予'),
    (r'\bpresented\b', '呈现'),
    (r'\bassigned\b', '分配'),
    (r'\bselected\b', '选中'),
    (r'\bselection\b', '选择'),
    (r'\bchoices?\b', '选项'),
    (r'\bdetermines?\b', '决定'),
    (r'\binfluences?\b', '影响'),
    (r'\bdepending\b', '取决于'),
    (r'\bdepends?\b', '取决于'),

    # cleanup artifacts
    (r'，\s*，', '，'),
    (r'。\s*。', '。'),
    (r'\s{2,}', ' '),
    (r'\s+，', '，'),
    (r'\s+。', '。'),
    (r'，\s*$', '。'),
    (r'。\s+。', '。'),
]

def cleanup_string(s):
    if not s:
        return s
    for pattern, replacement in word_replacements:
        s = re.sub(pattern, replacement, s, flags=re.IGNORECASE)
    # Final cleanup
    s = re.sub(r'，\s*，', '，', s)
    s = re.sub(r'。\s*。', '。', s)
    s = re.sub(r'\s{2,}', ' ', s)
    s = s.strip()
    # Ensure ends with 。or other punctuation
    if s and not re.search(r'[。！？.!?]$', s) and not s.endswith('\\'):
        s += '。'
    return s

# Process passiveDesc fields
def repl_passive(m):
    text = m.group(1)
    cleaned = cleanup_string(text)
    return f'passiveDesc: "{cleaned}"'

# Process unlock fields
def repl_unlock(m):
    text = m.group(1)
    cleaned = cleanup_string(text)
    return f'unlock: "{cleaned}"'

content = re.sub(r'passiveDesc:\s*"([^"]*)"', repl_passive, content)
content = re.sub(r'unlock:\s*"([^"]*)"', repl_unlock, content)

with open(DATA_PATH, "w", encoding="utf-8") as f:
    f.write(content)

# Count remaining English
all_passive = re.findall(r'passiveDesc:\s*"([^"]*)"', content)
all_unlock = re.findall(r'unlock:\s*"([^"]*)"', content)
remaining = []
for text in all_passive:
    if re.search(r'[a-zA-Z]{4,}', text):
        if 'ABC' not in text and 'x-x1viiq' not in text:
            remaining.append(f'passiveDesc: {text[:80]}')
for text in all_unlock:
    if re.search(r'[a-zA-Z]{4,}', text):
        if 'ABC' not in text and 'Boss' not in text and 'Konami' not in text and 'x-x1viiq' not in text:
            remaining.append(f'unlock: {text[:80]}')

print(f'Total passiveDesc: {len(all_passive)}')
print(f'Total unlock: {len(all_unlock)}')
if remaining:
    print(f'\nWARNING: {len(remaining)} entries may still contain English:')
    for r in remaining:
        print(f'   {r}')
else:
    print('\nAll entries cleaned!')
