import { useState, useEffect, useCallback, useRef } from "react";
import { storage } from './storage.js';

const SAVE_KEY = 'wta-save';

const TAROT_DATA = {
  major: [
    { name: "The Fool", upright: "New beginnings, innocence, spontaneity, free spirit", reversed: "Recklessness, risk-taking, naivety, holding back" },
    { name: "The Magician", upright: "Willpower, manifestation, resourcefulness, skill", reversed: "Manipulation, trickery, wasted talent, illusion" },
    { name: "The High Priestess", upright: "Intuition, mystery, inner knowledge, the subconscious", reversed: "Secrets withheld, disconnection from intuition, withdrawal" },
    { name: "The Empress", upright: "Abundance, nurturing, fertility, nature, sensuality", reversed: "Dependence, smothering, creative block, neglecting self-care" },
    { name: "The Emperor", upright: "Authority, structure, stability, father figure", reversed: "Tyranny, rigidity, lack of discipline, domination" },
    { name: "The Hierophant", upright: "Tradition, spiritual wisdom, conformity, mentorship", reversed: "Rebellion, nonconformity, challenging the status quo" },
    { name: "The Lovers", upright: "Love, harmony, partnerships, alignment of values", reversed: "Disharmony, imbalance, misalignment, difficult choices" },
    { name: "The Chariot", upright: "Determination, willpower, triumph, control", reversed: "Lack of direction, aggression, powerlessness" },
    { name: "Strength", upright: "Inner strength, courage, patience, compassion", reversed: "Self-doubt, weakness, insecurity, raw emotion" },
    { name: "The Hermit", upright: "Soul searching, introspection, solitude, inner guidance", reversed: "Isolation, loneliness, withdrawal, lost your way" },
    { name: "Wheel of Fortune", upright: "Change, cycles, fate, turning points, luck", reversed: "Bad luck, resistance to change, breaking cycles" },
    { name: "Justice", upright: "Fairness, truth, law, cause and effect, balance", reversed: "Injustice, dishonesty, imbalance, lack of accountability" },
    { name: "The Hanged Man", upright: "Surrender, letting go, new perspective, pause", reversed: "Stalling, resistance, indecision, needless sacrifice" },
    { name: "Death", upright: "Transformation, endings, change, transition, release", reversed: "Resistance to change, fear of endings, stagnation" },
    { name: "Temperance", upright: "Balance, moderation, patience, harmony, purpose", reversed: "Imbalance, excess, lack of patience, misalignment" },
    { name: "The Devil", upright: "Shadow self, attachment, addiction, materialism", reversed: "Releasing limiting beliefs, freedom, reclaiming power" },
    { name: "The Tower", upright: "Sudden upheaval, revelation, chaos, awakening", reversed: "Averting disaster, fear of change, delaying the inevitable" },
    { name: "The Star", upright: "Hope, renewal, inspiration, serenity, faith", reversed: "Despair, disconnection, lack of faith, discouragement" },
    { name: "The Moon", upright: "Illusion, intuition, the unconscious, anxiety, fear", reversed: "Release of fear, clarity emerging, repressed emotions" },
    { name: "The Sun", upright: "Joy, success, vitality, warmth, positivity", reversed: "Temporary sadness, overly optimistic, lack of clarity" },
    { name: "Judgement", upright: "Reflection, reckoning, inner calling, absolution", reversed: "Self-doubt, refusal of self-examination, ignoring the call" },
    { name: "The World", upright: "Completion, accomplishment, fulfillment, wholeness", reversed: "Incompletion, shortcuts, delays, lack of closure" },
  ],
  cups: [
    { name: "Ace of Cups", upright: "New love, emotional awakening, compassion, creativity", reversed: "Emotional loss, blocked creativity, emptiness" },
    { name: "Two of Cups", upright: "Partnership, unity, mutual attraction, deep connection", reversed: "Imbalance in partnership, broken communication, tension" },
    { name: "Three of Cups", upright: "Celebration, friendship, community, joy, gathering", reversed: "Overindulgence, gossip, isolation, third-party interference" },
    { name: "Four of Cups", upright: "Apathy, contemplation, feeling disconnected, reevaluation", reversed: "New awareness, acceptance, moving forward, gratitude" },
    { name: "Five of Cups", upright: "Loss, grief, disappointment, regret, focusing on the negative", reversed: "Acceptance, moving on, finding peace, forgiveness" },
    { name: "Six of Cups", upright: "Nostalgia, childhood memories, reunion, innocence", reversed: "Living in the past, unrealistic expectations, clinging" },
    { name: "Seven of Cups", upright: "Fantasy, choices, wishful thinking, illusion", reversed: "Clarity, focus, making a decision, grounding" },
    { name: "Eight of Cups", upright: "Walking away, disillusionment, leaving behind, searching for truth", reversed: "Fear of change, staying in comfort zone, avoidance" },
    { name: "Nine of Cups", upright: "Contentment, satisfaction, wishes fulfilled, gratitude", reversed: "Dissatisfaction, greed, materialism, unfulfilled wishes" },
    { name: "Ten of Cups", upright: "Harmony, family, happiness, emotional fulfillment, alignment", reversed: "Broken family, domestic conflict, misaligned values" },
    { name: "Page of Cups", upright: "Creative opportunity, emotional message, intuition, inner child", reversed: "Emotional immaturity, creative block, mood swings" },
    { name: "Knight of Cups", upright: "Romance, charm, following the heart, imagination", reversed: "Moodiness, unrealistic expectations, jealousy" },
    { name: "Queen of Cups", upright: "Compassion, emotional security, calm, intuitive healer", reversed: "Emotional insecurity, codependency, martyrdom" },
    { name: "King of Cups", upright: "Emotional balance, diplomacy, compassion, wisdom", reversed: "Emotional manipulation, moodiness, volatility" },
  ],
  wands: [
    { name: "Ace of Wands", upright: "Inspiration, new opportunity, creative spark, potential", reversed: "Delays, lack of motivation, missed opportunity" },
    { name: "Two of Wands", upright: "Planning, future vision, decisions, discovery", reversed: "Fear of the unknown, lack of planning, playing it safe" },
    { name: "Three of Wands", upright: "Expansion, foresight, progress, looking ahead", reversed: "Setbacks, delays, frustration, obstacles to growth" },
    { name: "Four of Wands", upright: "Celebration, harmony, homecoming, community", reversed: "Lack of support, instability, feeling unwelcome" },
    { name: "Five of Wands", upright: "Conflict, competition, tension, disagreement", reversed: "Avoiding conflict, compromise, finding common ground" },
    { name: "Six of Wands", upright: "Victory, recognition, success, public praise", reversed: "Excess pride, lack of recognition, fall from grace" },
    { name: "Seven of Wands", upright: "Perseverance, standing your ground, defending beliefs", reversed: "Giving up, overwhelmed, being worn down" },
    { name: "Eight of Wands", upright: "Swift action, movement, quick decisions, momentum", reversed: "Delays, waiting, slowdown, frustration" },
    { name: "Nine of Wands", upright: "Resilience, persistence, last stand, boundaries", reversed: "Exhaustion, giving up, paranoia, overwhelmed" },
    { name: "Ten of Wands", upright: "Burden, overcommitment, responsibility, hard work", reversed: "Releasing burdens, delegation, letting go of stress" },
    { name: "Page of Wands", upright: "Enthusiasm, exploration, discovery, free spirit", reversed: "Lack of direction, setbacks to new ideas, hasty decisions" },
    { name: "Knight of Wands", upright: "Energy, passion, adventure, impulsiveness", reversed: "Haste, frustration, scattered energy, delays in travel" },
    { name: "Queen of Wands", upright: "Courage, confidence, determination, warmth, vibrancy", reversed: "Selfishness, jealousy, insecurity, temperamental" },
    { name: "King of Wands", upright: "Leadership, vision, big picture, taking charge", reversed: "Impulsiveness, ruthlessness, high expectations, domineering" },
  ],
  swords: [
    { name: "Ace of Swords", upright: "Clarity, breakthrough, new idea, mental sharpness", reversed: "Confusion, miscommunication, clouded judgment" },
    { name: "Two of Swords", upright: "Indecision, stalemate, blocked emotions, avoidance", reversed: "Seeing the truth, releasing indecision, information overload" },
    { name: "Three of Swords", upright: "Heartbreak, emotional pain, sorrow, grief, betrayal", reversed: "Recovery, forgiveness, releasing pain, healing" },
    { name: "Four of Swords", upright: "Rest, recovery, contemplation, restoration, solitude", reversed: "Restlessness, burnout, refusing to rest, stagnation" },
    { name: "Five of Swords", upright: "Conflict, defeat, betrayal, winning at all costs", reversed: "Reconciliation, making amends, moving past conflict" },
    { name: "Six of Swords", upright: "Transition, moving on, leaving behind, healing journey", reversed: "Resistance to change, unresolved issues, stuck" },
    { name: "Seven of Swords", upright: "Deception, strategy, stealth, getting away with something", reversed: "Confession, conscience, coming clean, rethinking approach" },
    { name: "Eight of Swords", upright: "Restriction, imprisonment, self-limiting beliefs, victim mentality", reversed: "Freedom, release, new perspective, empowerment" },
    { name: "Nine of Swords", upright: "Anxiety, nightmares, worry, fear, despair", reversed: "Recovery, letting go of worry, hope, reaching out for help" },
    { name: "Ten of Swords", upright: "Painful ending, rock bottom, betrayal, crisis", reversed: "Recovery, regeneration, resisting an inevitable end" },
    { name: "Page of Swords", upright: "Curiosity, new ideas, mental agility, communication", reversed: "Deception, manipulation, all talk and no action" },
    { name: "Knight of Swords", upright: "Ambition, action, drive, fast thinking, assertive", reversed: "Restlessness, unfocused, burnout, recklessness" },
    { name: "Queen of Swords", upright: "Independence, clear thinking, direct communication, boundaries", reversed: "Coldness, cruelty, bitterness, overly critical" },
    { name: "King of Swords", upright: "Authority, intellect, truth, clear thinking, ethics", reversed: "Manipulation, cruelty, abuse of power, dishonesty" },
  ],
  pentacles: [
    { name: "Ace of Pentacles", upright: "New financial opportunity, prosperity, abundance, manifestation", reversed: "Missed opportunity, scarcity mindset, poor planning" },
    { name: "Two of Pentacles", upright: "Balance, juggling priorities, adaptability, multitasking", reversed: "Overwhelm, imbalance, overextended, losing control" },
    { name: "Three of Pentacles", upright: "Teamwork, collaboration, craftsmanship, building together", reversed: "Disharmony, poor work ethic, lack of teamwork" },
    { name: "Four of Pentacles", upright: "Security, control, holding on, saving, possessiveness", reversed: "Generosity, letting go, releasing control, sharing" },
    { name: "Five of Pentacles", upright: "Hardship, loss, isolation, worry, financial difficulty", reversed: "Recovery, improvement, turning a corner, spiritual wealth" },
    { name: "Six of Pentacles", upright: "Generosity, giving and receiving, charity, sharing wealth", reversed: "Power dynamics, strings attached, selfishness, debt" },
    { name: "Seven of Pentacles", upright: "Patience, investment, long-term view, waiting for results", reversed: "Impatience, lack of reward, poor investment, frustration" },
    { name: "Eight of Pentacles", upright: "Skill development, apprenticeship, dedication, mastery", reversed: "Perfectionism, lack of focus, no ambition, rushed work" },
    { name: "Nine of Pentacles", upright: "Abundance, luxury, self-sufficiency, independence, reward", reversed: "Over-investment in work, superficiality, hustling, setbacks" },
    { name: "Ten of Pentacles", upright: "Legacy, wealth, family, inheritance, long-term success", reversed: "Family disputes, financial failure, loss of legacy" },
    { name: "Page of Pentacles", upright: "Ambition, desire to learn, new venture, studiousness", reversed: "Lack of progress, procrastination, missed lessons" },
    { name: "Knight of Pentacles", upright: "Hard work, routine, responsibility, persistence", reversed: "Boredom, laziness, feeling stuck, perfectionism" },
    { name: "Queen of Pentacles", upright: "Nurturing, practical, providing, down-to-earth, abundance", reversed: "Self-care neglect, work-home imbalance, smothering" },
    { name: "King of Pentacles", upright: "Wealth, security, leadership, discipline, abundance", reversed: "Greed, materialism, poor financial decisions, stubborn" },
  ],
};

const LEVEL_CONFIG = [
  { level: 1, title: "Novice Apprentice", xpNeeded: 0, cards: ["major"], reversed: false, unlock: null },
  { level: 2, title: "Curious Student", xpNeeded: 60, cards: ["major"], reversed: false, unlock: { emoji: "🌿", name: "Sprig of Dried Lavender", desc: "\"For calm hands and a steady mind,\" your mentor whispers, tucking it into your pocket." } },
  { level: 3, title: "Attentive Pupil", xpNeeded: 150, cards: ["major"], reversed: false, unlock: { emoji: "🕯", name: "Beeswax Candle", desc: "\"Light it when you read. The flame will teach you focus.\"" } },
  { level: 4, title: "Budding Reader", xpNeeded: 270, cards: ["major"], reversed: true, unlock: { emoji: "🔮", name: "Reversed Cards Unlocked", desc: "\"The cards have a shadow side, child. It's time you learned to read it.\" From now on, cards may appear reversed." } },
  { level: 5, title: "Intuitive Student", xpNeeded: 420, cards: ["major"], reversed: true, unlock: { emoji: "🪻", name: "Bundle of Rosemary", desc: "\"For remembrance. You'll need it as your studies deepen.\"" } },
  { level: 6, title: "Card Whisperer", xpNeeded: 600, cards: ["major", "cups"], reversed: true, unlock: { emoji: "🍵", name: "The Suit of Cups", desc: "\"You've earned the right to read the waters, child. The Cups will teach you about the heart.\" The Cups suit is now in your deck." } },
  { level: 7, title: "Emotional Reader", xpNeeded: 810, cards: ["major", "cups"], reversed: true, unlock: { emoji: "🌹", name: "Small Rose Quartz", desc: "Your mentor places a rough pink crystal in your palm. \"A fairy might live in this one,\" she says with a knowing smile." } },
  { level: 8, title: "Flame Tender", xpNeeded: 1050, cards: ["major", "cups", "wands"], reversed: true, unlock: { emoji: "🪄", name: "The Suit of Wands", desc: "\"Fire and ambition, creativity and will. The Wands have stories to tell you.\" The Wands suit is now in your deck." } },
  { level: 9, title: "Dual Reader", xpNeeded: 1320, cards: ["major", "cups", "wands"], reversed: true, unlock: { emoji: "🌙", name: "Crescent Moon Charm", desc: "\"Wear this when you read at night. The moon sharpens what the sun obscures.\"" } },
  { level: 10, title: "Practiced Seer", xpNeeded: 1620, cards: ["major", "cups", "wands", "swords"], reversed: true, unlock: { emoji: "⚔", name: "The Suit of Swords", desc: "\"Truth cuts, child. The Swords demand honesty — from you and from those you read for.\" The Swords suit is now in your deck." } },
  { level: 11, title: "Sharp Reader", xpNeeded: 1950, cards: ["major", "cups", "wands", "swords"], reversed: true, unlock: { emoji: "🖤", name: "Black Candle", desc: "Your mentor carves your initial into dark wax. \"For shadow work. You're ready.\"" } },
  { level: 12, title: "Gifted Oracle", xpNeeded: 2310, cards: ["major", "cups", "wands", "swords", "pentacles"], reversed: true, unlock: { emoji: "🪙", name: "The Suit of Pentacles", desc: "\"Earth, craft, and patience. The Pentacles complete your deck.\" You now read from the full 78 cards." } },
  { level: 13, title: "Full Deck Reader", xpNeeded: 2700, cards: ["major", "cups", "wands", "swords", "pentacles"], reversed: true, unlock: { emoji: "📖", name: "Your Own Grimoire", desc: "Your mentor presents you with a leather-bound journal. \"Write your readings down. Your interpretations matter now.\"" } },
  { level: 14, title: "Village Witch", xpNeeded: 3120, cards: ["major", "cups", "wands", "swords", "pentacles"], reversed: true, unlock: { emoji: "🌿", name: "Windowsill Herb Garden", desc: "\"The cottage is starting to feel like yours, isn't it?\" Your mentor smiles from the doorway." } },
  { level: 15, title: "Hedge Witch", xpNeeded: 3570, cards: ["major", "cups", "wands", "swords", "pentacles"], reversed: true, unlock: { emoji: "🏡", name: "Key to the Cottage", desc: "Your mentor presses a warm iron key into your hand. \"It was always going to be yours, child.\"" } },
];

const getLevel = (xp) => {
  let current = LEVEL_CONFIG[0];
  for (const lc of LEVEL_CONFIG) {
    if (xp >= lc.xpNeeded) current = lc;
    else break;
  }
  return current;
};

const getNextLevel = (xp) => {
  for (const lc of LEVEL_CONFIG) {
    if (xp < lc.xpNeeded) return lc;
  }
  return null;
};

const getAvailableCards = (level) => {
  const config = LEVEL_CONFIG.find(l => l.level === level) || LEVEL_CONFIG[0];
  let cards = [];
  config.cards.forEach(suit => {
    if (TAROT_DATA[suit]) cards = [...cards, ...TAROT_DATA[suit]];
  });
  return { cards, allowReversed: config.reversed };
};

const SCENARIOS = [
  { location: "the village well", npc: "Elara, the baker's daughter", situations: [
    "is torn between staying in the village or following a traveling merchant she's fallen for",
    "found a pouch of coins that doesn't belong to her and doesn't know what to do",
    "has been having vivid dreams she doesn't understand",
    "wants to open her own bakery but her family expects her to tend the farm",
    "feels like her best friend has been avoiding her lately",
  ]},
  { location: "the crossroads at dusk", npc: "Old Matthias, the woodcutter", situations: [
    "is grieving the loss of his wife and can't find purpose anymore",
    "suspects someone has been stealing timber from his land",
    "was offered a lucrative deal that feels too good to be true",
    "wants to reconcile with his estranged son",
    "is afraid his strength is failing and he can no longer do his work",
  ]},
  { location: "the moonlit garden", npc: "Rowan, the herbalist's apprentice", situations: [
    "accidentally ruined a batch of important medicine and is afraid to confess",
    "has feelings for someone who doesn't seem to notice them",
    "discovered they have a natural gift for magic but it frightens them",
    "is being pressured to choose a life path and feels paralyzed",
    "overheard a secret that could hurt someone they care about",
  ]},
  { location: "the old stone bridge", npc: "Captain Lira, a retired soldier", situations: [
    "carries guilt from a decision she made during a battle long ago",
    "has been offered her old command back but fears she's changed too much",
    "suspects corruption among the town council but has no proof",
    "wants to tell someone the truth about her past but fears rejection",
    "feels restless in peacetime and doesn't know who she is without a war to fight",
  ]},
  { location: "the candlelit study", npc: "Thistle, a young scribe", situations: [
    "discovered a hidden message in an old manuscript and doesn't know who to trust with it",
    "is being asked to forge a document and is afraid to refuse",
    "wants to write their own stories but feels their ideas aren't good enough",
    "is overwhelmed by the expectations placed on them as the brightest student",
    "found out their mentor has been lying about something important",
  ]},
  { location: "the forest clearing", npc: "Bramble, a traveling tinker", situations: [
    "keeps running from town to town and wonders if they'll ever feel at home",
    "was betrayed by a business partner and lost everything",
    "found a strange artifact and doesn't know if it's a blessing or a curse",
    "wants to settle down but is afraid of being trapped",
    "has been carrying a message for someone who may no longer want to receive it",
  ]},
  { location: "the quiet chapel", npc: "Sister Maren, the healer", situations: [
    "is questioning her faith after failing to save a patient",
    "discovered she has more power than the order allows her to use",
    "is caught between loyalty to her order and compassion for an outcast",
    "carries a burden of secrets confided to her that weigh heavily",
    "wants to leave the chapel but fears what she'd become without its structure",
  ]},
  { location: "the harvest market", npc: "Fennel, a young mother", situations: [
    "is struggling to provide for her children alone after her partner left",
    "received an inheritance she feels guilty about accepting",
    "wants to pursue a craft but everyone tells her she should focus on her children",
    "is in a feud with a neighbor that has spiraled out of control",
    "senses something is wrong with her child but no healer can find anything",
  ]},
];

const MENTOR_RESPONSES = {
  perfect: [
    "Your mentor nods slowly, firelight dancing in her eyes. \"Well read, little one. You're beginning to see what the cards truly say, not just what they show.\"",
    "A rare smile crosses your mentor's weathered face. \"The cards chose well in finding you. That reading was as clear as spring water.\"",
    "\"Ah,\" your mentor breathes, setting down her tea. \"You felt that one, didn't you? Good. The best readings come from the gut, not the book.\"",
    "Your mentor places a warm hand on your shoulder. \"That's the reading of someone who listens. The cards will always speak to those who truly hear.\"",
  ],
  good: [
    "Your mentor tilts her head. \"Close, little one. You caught the thread but didn't follow it all the way. Let me show you what you missed...\"",
    "\"Not bad,\" your mentor says, pouring you more tea. \"You have the intuition. Now let's sharpen it. Consider this...\"",
    "Your mentor hums thoughtfully. \"You're reading with your head when this card wants your heart. You found part of the meaning, but there's more beneath the surface.\"",
  ],
  wrong: [
    "Your mentor shakes her head gently. \"Don't be discouraged. Even the oldest witches misread the cards sometimes. Here's what they were trying to tell you...\"",
    "\"Ah, little one,\" your mentor says softly. \"The cards speak in whispers, not shouts. You were listening for the wrong voice. Let me guide you...\"",
    "Your mentor stirs the fire. \"A misread isn't a failure — it's a lesson wearing a mask. Let me show you what the card truly meant here...\"",
  ],
  stuffing: [
    "Your mentor's eyes narrow. \"You're reciting meanings, child, not reading. A real reading speaks TO someone, not AT a textbook.\"",
    "\"Hmm,\" your mentor says dryly. \"I see you know the words. But words without heart are just noise. Tell me what this card means for THEM.\"",
    "Your mentor taps the card. \"You've listed what it means. Now tell me what it means HERE, for THIS person, in THIS moment. That's reading.\"",
  ],
};

// Expanded synonyms that show understanding even without exact keywords
const CONCEPT_MAP = {
  new_beginnings: ["begin", "start", "fresh", "dawn", "birth", "embark", "leap", "chapter", "venture", "open", "door", "first", "step", "unknown", "ahead"],
  endings: ["end", "close", "finish", "goodbye", "leave", "behind", "over", "complete", "done", "final", "last", "death", "die", "gone"],
  love_connection: ["love", "heart", "romance", "partner", "relationship", "connection", "bond", "together", "unite", "soul", "care", "cherish", "tenderness", "intimacy", "attraction", "drawn"],
  conflict: ["conflict", "fight", "struggle", "tension", "clash", "disagree", "oppose", "battle", "war", "rival", "compete", "friction", "hostile"],
  change_transform: ["change", "transform", "transition", "shift", "evolve", "grow", "become", "different", "turn", "metamorphosis", "adapt", "move", "progress", "develop"],
  fear_anxiety: ["fear", "anxiety", "worry", "doubt", "afraid", "scared", "uncertain", "dread", "panic", "nervous", "uneasy", "terrified", "hesitate", "apprehensive"],
  strength_courage: ["strength", "courage", "brave", "power", "resilience", "endure", "persist", "overcome", "stand", "firm", "bold", "confident", "resolve", "determination"],
  balance_harmony: ["balance", "harmony", "peace", "equilibrium", "moderate", "patience", "steady", "calm", "center", "stable", "fair", "equal", "middle", "ground"],
  loss_grief: ["loss", "grief", "pain", "sorrow", "mourn", "miss", "regret", "suffer", "wound", "hurt", "broken", "devastate", "empty"],
  wisdom_truth: ["wisdom", "knowledge", "learn", "understand", "insight", "clarity", "truth", "realize", "discover", "aware", "enlighten", "see", "know", "perceive"],
  control_authority: ["control", "power", "authority", "discipline", "structure", "order", "command", "rule", "master", "direct", "lead", "govern", "boundaries"],
  creativity_inspiration: ["creative", "inspiration", "imagination", "art", "vision", "dream", "idea", "spark", "muse", "express", "passion", "fire", "create", "invent"],
  deception: ["deceit", "deception", "lie", "trick", "betray", "dishonest", "false", "manipulate", "scheme", "hide", "conceal", "mask", "pretend", "illusion"],
  freedom: ["freedom", "free", "liberate", "release", "escape", "break", "chains", "open", "unbound", "independent", "autonomy", "choice"],
  healing: ["heal", "recover", "mend", "restore", "repair", "renew", "better", "improve", "forgive", "soothe", "nurture", "comfort", "tend"],
  abundance: ["abundance", "wealth", "prosper", "rich", "plenty", "reward", "fortune", "generous", "gift", "bless", "flourish", "thrive", "harvest"],
  isolation: ["alone", "isolate", "solitude", "lonely", "withdraw", "hermit", "retreat", "separate", "distant", "apart", "seclude", "inward"],
  commitment: ["commit", "dedicate", "loyal", "faithful", "promise", "vow", "devote", "stick", "choose", "decide", "pledge", "stay"],
  blocked: ["block", "stuck", "stagnant", "trap", "restrict", "imprison", "limit", "obstacle", "barrier", "prevent", "stop", "wall", "unable", "frozen"],
  letting_go: ["let go", "release", "surrender", "accept", "move on", "detach", "relinquish", "give up", "forgive", "drop", "shed"],
};

function scoreInterpretation(input, card, isReversed, scenario) {
  const text = input.toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const correctMeaning = isReversed ? card.reversed : card.upright;
  const wrongMeaning = isReversed ? card.upright : card.reversed;
  const correctKeywords = correctMeaning.toLowerCase().split(/[,\s]+/).filter(w => w.length > 3);
  const wrongKeywords = wrongMeaning.toLowerCase().split(/[,\s]+/).filter(w => w.length > 3);

  // --- PENALTY: Too short ---
  if (wordCount < 8) return { score: "wrong", reason: "too_short" };

  // --- PENALTY: Keyword stuffing detection ---
  // If the response is mostly just tarot keywords with no connective tissue
  const allTarotKeywords = [...correctKeywords, ...wrongKeywords];
  const tarotWordCount = words.filter(w => allTarotKeywords.includes(w)).length;
  const stuffingRatio = tarotWordCount / wordCount;

  // Count sentence-like structure (periods, commas, conjunctions)
  const hasStructure = (text.includes('.') || text.includes(',') || text.includes(' and ') ||
    text.includes(' but ') || text.includes(' because ') || text.includes(' should ') ||
    text.includes(' might ') || text.includes(' could ') || text.includes(' perhaps ') ||
    text.includes(' maybe ') || text.includes(' think ') || text.includes(' feel ') ||
    text.includes(' suggest ') || text.includes(' need ') || text.includes(' tell '));

  if (stuffingRatio > 0.5 && !hasStructure) {
    return { score: "wrong", reason: "stuffing" };
  }

  // --- SCORING: Concept matching (broader than keywords) ---
  let conceptScore = 0;
  const meaningLower = correctMeaning.toLowerCase();

  Object.entries(CONCEPT_MAP).forEach(([concept, synonyms]) => {
    const meaningMatchesThisConcept = synonyms.some(s => meaningLower.includes(s));
    if (meaningMatchesThisConcept) {
      const inputMatchesThisConcept = synonyms.some(s => text.includes(s));
      if (inputMatchesThisConcept) conceptScore += 1;
    }
  });

  // --- SCORING: Direct keyword hits (but weighted less than before) ---
  let directHits = 0;
  const usedKeywords = new Set();
  correctKeywords.forEach(kw => {
    if (text.includes(kw) && !usedKeywords.has(kw)) {
      directHits += 0.5;
      usedKeywords.add(kw);
    }
  });

  // --- SCORING: Wrong keyword hits (penalty) ---
  let wrongHits = 0;
  wrongKeywords.forEach(kw => {
    if (text.includes(kw) && !correctKeywords.includes(kw)) wrongHits++;
  });

  // --- BONUS: Referencing the NPC's situation ---
  let contextBonus = 0;
  if (scenario) {
    const npcFirstName = scenario.npc.split(',')[0].split(' ').pop().toLowerCase();
    const situationWords = scenario.situation.toLowerCase().split(/\s+/).filter(w => w.length > 4);

    // Mentioning the NPC by name
    if (text.includes(npcFirstName)) contextBonus += 0.5;

    // Referencing their specific situation
    const situationHits = situationWords.filter(w => text.includes(w)).length;
    if (situationHits >= 2) contextBonus += 1;
    else if (situationHits >= 1) contextBonus += 0.5;

    // Using advice-giving language (speaking TO the person)
    const adviceWords = ["you", "your", "them", "they", "their", "should", "could", "might", "perhaps", "consider", "suggest", "advice", "guidance", "tell", "encourage", "remind", "warn"];
    const adviceHits = adviceWords.filter(w => text.includes(w)).length;
    if (adviceHits >= 2) contextBonus += 0.5;
  }

  // --- BONUS: Reversed awareness ---
  let reversalBonus = 0;
  if (isReversed) {
    const reversalLanguage = ["reverse", "block", "imbalance", "lack", "too much", "avoid", "resist",
      "struggle", "shadow", "opposite", "excess", "deny", "unable", "stuck", "lost", "warning",
      "careful", "caution", "danger", "neglect", "ignore", "suppress", "twisted", "inverted",
      "dark side", "overdo", "under", "misuse", "distort"];
    if (reversalLanguage.some(w => text.includes(w))) reversalBonus += 0.5;
  }

  // --- FINAL SCORE ---
  const totalScore = conceptScore + directHits + contextBonus + reversalBonus - (wrongHits * 0.5);

  if (totalScore >= 3 && contextBonus >= 0.5) return { score: "perfect", reason: "full" };
  if (totalScore >= 2.5) return { score: "perfect", reason: "full" };
  if (totalScore >= 1.5 || (conceptScore >= 1 && contextBonus >= 0.5)) return { score: "good", reason: "partial" };
  if (totalScore >= 0.5) return { score: "good", reason: "partial" };
  return { score: "wrong", reason: "miss" };
}

const CARD_SYMBOLS = {
  "The Fool": "🌿", "The Magician": "✨", "The High Priestess": "🌙", "The Empress": "🌸",
  "The Emperor": "🏔", "The Hierophant": "📜", "The Lovers": "💞", "The Chariot": "⚡",
  "Strength": "🦁", "The Hermit": "🕯", "Wheel of Fortune": "☸", "Justice": "⚖",
  "The Hanged Man": "🍂", "Death": "🦋", "Temperance": "🌊", "The Devil": "🔗",
  "The Tower": "🌩", "The Star": "⭐", "The Moon": "🌑", "The Sun": "☀",
  "Judgement": "🔔", "The World": "🌍",
};

const getCardSymbol = (name) => {
  if (CARD_SYMBOLS[name]) return CARD_SYMBOLS[name];
  if (name.includes("Wands")) return "🪄";
  if (name.includes("Cups")) return "🍵";
  if (name.includes("Swords")) return "⚔";
  if (name.includes("Pentacles")) return "🪙";
  return "🃏";
};

export default function App() {
  const [screen, setScreen] = useState("title");
  const [apprenticeName, setApprenticeName] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [isReversed, setIsReversed] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [interpretation, setInterpretation] = useState("");
  const [result, setResult] = useState(null);
  const [totalXP, setTotalXP] = useState(0);
  const [stats, setStats] = useState({ perfect: 0, good: 0, wrong: 0, total: 0 });
  const [encounterHistory, setEncounterHistory] = useState([]);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [newReward, setNewReward] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [textVisible, setTextVisible] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const saveProgress = useCallback(async (data) => {
    try {
      await storage.set(SAVE_KEY, JSON.stringify(data));
    } catch (e) { console.error('Save failed:', e); }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const saved = await storage.get(SAVE_KEY);
        if (saved && saved.value) {
          const d = typeof saved.value === 'string' ? JSON.parse(saved.value) : saved.value;
          if (d.name) { setApprenticeName(d.name); setScreen("hub"); }
          if (d.s) setStats(d.s);
          if (d.xp !== undefined) setTotalXP(d.xp);
          if (d.h) setEncounterHistory(d.h);
          if (d.r) setUnlockedRewards(d.r);
        }
      } catch (e) { console.log('No save found, starting fresh'); }
      setLoaded(true);
      setTimeout(() => setTextVisible(true), 150);
    }
    load();
  }, []);

  const transition = useCallback((next, delay = 300) => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen(next);
      setFadeIn(true);
      setTextVisible(false);
      setTimeout(() => setTextVisible(true), 100);
    }, delay);
  }, []);

  const currentLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const xpInLevel = nextLevel ? totalXP - currentLevel.xpNeeded : 0;
  const xpForLevel = nextLevel ? nextLevel.xpNeeded - currentLevel.xpNeeded : 1;

  const generateEncounter = useCallback(() => {
    const { cards, allowReversed } = getAvailableCards(currentLevel.level);
    const card = cards[Math.floor(Math.random() * cards.length)];
    const reversed = allowReversed ? Math.random() > 0.6 : false;
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const situation = scenario.situations[Math.floor(Math.random() * scenario.situations.length)];
    setCurrentCard(card);
    setIsReversed(reversed);
    setCurrentScenario({ ...scenario, situation });
    setInterpretation("");
    setResult(null);
    setCardRevealed(false);
    setShowMeaning(false);
    setNewReward(null);
    transition("encounter");
    setTimeout(() => setCardRevealed(true), 800);
  }, [transition, currentLevel]);

  const submitInterpretation = useCallback(() => {
    if (interpretation.trim().length < 10) return;
    const result = scoreInterpretation(interpretation, currentCard, isReversed, currentScenario);
    const score = result.score;
    const reason = result.reason;
    
    // Pick response based on score and reason
    let responsePool;
    if (reason === "stuffing") {
      responsePool = MENTOR_RESPONSES.stuffing;
    } else {
      responsePool = MENTOR_RESPONSES[score];
    }
    const response = responsePool[Math.floor(Math.random() * responsePool.length)];
    
    // Stuffing gets wrong-level XP
    const xpGain = reason === "stuffing" ? 5 : score === "perfect" ? 30 : score === "good" ? 15 : 5;
    const effectiveScore = reason === "stuffing" ? "wrong" : score;
    const newXP = totalXP + xpGain;
    const newStats = { ...stats, [effectiveScore]: stats[effectiveScore] + 1, total: stats.total + 1 };
    const newHistory = [...encounterHistory, { card: currentCard.name, reversed: isReversed, score: effectiveScore, npc: currentScenario.npc }];
    const oldLevel = getLevel(totalXP);
    const newLevelObj = getLevel(newXP);
    let reward = null;
    let newRewards = [...unlockedRewards];
    if (newLevelObj.level > oldLevel.level && newLevelObj.unlock) {
      reward = newLevelObj.unlock;
      if (!newRewards.find(r => r.name === reward.name)) newRewards.push(reward);
    }
    setResult({ score: effectiveScore, response, xpGain });
    setTotalXP(newXP);
    setStats(newStats);
    setEncounterHistory(newHistory);
    setUnlockedRewards(newRewards);
    setShowMeaning(true);
    if (reward) setNewReward(reward);
    saveProgress({ name: apprenticeName, s: newStats, xp: newXP, h: newHistory, r: newRewards });
  }, [interpretation, currentCard, isReversed, totalXP, stats, encounterHistory, currentScenario, apprenticeName, unlockedRewards, saveProgress]);

  const startGame = useCallback(() => {
    if (!apprenticeName.trim()) return;
    saveProgress({ name: apprenticeName, s: stats, xp: totalXP, h: encounterHistory, r: unlockedRewards });
    transition("hub");
  }, [apprenticeName, stats, totalXP, encounterHistory, unlockedRewards, saveProgress, transition]);

  const deckInfo = (() => {
    const { cards, allowReversed } = getAvailableCards(currentLevel.level);
    const suits = currentLevel.cards || ["major"];
    const suitNames = suits.map(s => s === "major" ? "Major Arcana" : s.charAt(0).toUpperCase() + s.slice(1));
    return { count: cards.length * (allowReversed ? 2 : 1), suitNames, allowReversed };
  })();

  return (
    <div data-fade={fadeIn ? "true" : "false"} data-visible={textVisible ? "true" : "false"} style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg, #2a3a2a 0%, #1e2b1e 40%, #1a241a 100%)",
      fontFamily: "'Crimson Text', 'Georgia', serif",
      color: "#f4ead5",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&display=swap');
        :root {
          --forest: #2a3a2a; --forest-deep: #1e2b1e; --forest-light: #3d5a3d;
          --cream: #f4ead5; --cream-dim: #d4c9b0;
          --accent: #8b6b4a; --accent-light: #c4956a;
          --gold: #d4a84b; --gold-dim: #a07830;
          --moonstone: #c8d8e4; --card-bg: #f0e6d0;
          --success: #7dad7d; --partial: #d4a84b; --miss: #b07070;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade-container { transition: opacity 0.4s ease; }
        [data-fade="true"] .fade-container { opacity: 1; }
        [data-fade="false"] .fade-container { opacity: 0; }
        .text-reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-visible="true"] .text-reveal { opacity: 1; transform: translateY(0); }
        .screen-wrap { max-width: 520px; margin: 0 auto; padding: 24px 20px; min-height: 100vh; display: flex; flex-direction: column; }
        .title-text { font-family: 'Cinzel Decorative', 'Cinzel', serif; font-weight: 400; letter-spacing: 0.08em; }
        .heading { font-family: 'Cinzel', serif; font-weight: 500; letter-spacing: 0.05em; }
        .body-text { font-family: 'Crimson Text', Georgia, serif; font-size: 17px; line-height: 1.7; color: var(--cream-dim); }
        .btn { font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: 1.5px solid var(--accent); background: transparent; color: var(--cream); padding: 14px 32px; cursor: pointer; transition: all 0.3s ease; }
        .btn:hover { background: var(--accent); box-shadow: 0 0 20px rgba(139,107,74,0.3); }
        .btn:active { transform: scale(0.98); }
        .btn-primary { background: var(--accent); border-color: var(--accent-light); }
        .btn-primary:hover { background: var(--accent-light); }
        .card-display { background: var(--card-bg); border: 2px solid var(--accent); padding: 28px 24px; text-align: center; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 0 60px rgba(139,107,74,0.1); transition: transform 0.6s ease; margin: 16px auto; max-width: 280px; transform: rotateY(90deg) scale(0.9); }
        .card-display.revealed { transform: rotateY(0deg) scale(1); }
        .card-display::before { content: ''; position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; border: 1px solid var(--accent); opacity: 0.4; pointer-events: none; }
        .textarea-input { width: 100%; min-height: 100px; background: rgba(30,43,30,0.6); border: 1px solid var(--accent); color: var(--cream); font-family: 'Crimson Text', Georgia, serif; font-size: 16px; line-height: 1.6; padding: 14px 16px; resize: vertical; outline: none; transition: border-color 0.3s; }
        .textarea-input:focus { border-color: var(--gold); box-shadow: 0 0 12px rgba(212,168,75,0.15); }
        .textarea-input::placeholder { color: rgba(244,234,213,0.3); font-style: italic; }
        .name-input { background: transparent; border: none; border-bottom: 1.5px solid var(--accent); color: var(--cream); font-family: 'Cinzel', serif; font-size: 20px; text-align: center; padding: 8px 16px; outline: none; width: 100%; max-width: 280px; letter-spacing: 0.05em; }
        .name-input:focus { border-bottom-color: var(--gold); }
        .name-input::placeholder { color: rgba(244,234,213,0.25); font-size: 16px; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
        .divider span { font-size: 14px; color: var(--accent); }
        .xp-bar-outer { width: 100%; height: 6px; background: rgba(139,107,74,0.2); border-radius: 3px; overflow: hidden; }
        .xp-bar-inner { height: 100%; background: linear-gradient(90deg, var(--accent), var(--gold)); border-radius: 3px; transition: width 0.8s ease; }
        .result-banner { padding: 20px; border-left: 3px solid; margin: 16px 0; background: rgba(0,0,0,0.2); }
        .result-perfect { border-color: var(--success); }
        .result-good { border-color: var(--partial); }
        .result-wrong { border-color: var(--miss); }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
        .stat-box { text-align: center; padding: 14px 8px; background: rgba(139,107,74,0.1); border: 1px solid rgba(139,107,74,0.2); }
        .stat-number { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: var(--gold); display: block; }
        .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--cream-dim); margin-top: 4px; }
        .history-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid rgba(139,107,74,0.15); font-size: 15px; }
        .history-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .leaf-decoration { position: fixed; pointer-events: none; opacity: 0.04; font-size: 120px; z-index: 0; }
        .meaning-reveal { background: rgba(139,107,74,0.1); border: 1px solid rgba(139,107,74,0.25); padding: 16px 18px; margin: 12px 0; }
        .reversed-badge { display: inline-block; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--miss); border: 1px solid var(--miss); padding: 2px 10px; margin-top: 8px; opacity: 0.8; }
        .reward-banner { background: rgba(212,168,75,0.1); border: 1px solid rgba(212,168,75,0.3); padding: 20px; margin: 16px 0; text-align: center; animation: rewardGlow 2s ease infinite; }
        @keyframes rewardGlow { 0%, 100% { box-shadow: 0 0 8px rgba(212,168,75,0.1); } 50% { box-shadow: 0 0 20px rgba(212,168,75,0.25); } }
        .reward-shelf-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(139,107,74,0.08); border: 1px solid rgba(139,107,74,0.15); margin-bottom: 8px; }
        .deck-info { font-size: 12px; color: var(--cream-dim); opacity: 0.6; text-align: center; padding: 8px; border: 1px dashed rgba(139,107,74,0.2); margin-top: 8px; }
        @media (max-width: 480px) { .screen-wrap { padding: 20px 16px; } .card-display { padding: 22px 18px; max-width: 240px; } .stat-grid { gap: 8px; } }
      `}</style>

      <div className="leaf-decoration" style={{ top: -20, right: -30, transform: 'rotate(25deg)' }}>🌿</div>
      <div className="leaf-decoration" style={{ bottom: -20, left: -30, transform: 'rotate(-15deg)' }}>🍃</div>

      <div className="fade-container">
        {!loaded && (
          <div className="screen-wrap" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 36, opacity: 0.5 }}>🌙</div>
            <p className="body-text" style={{ marginTop: 12, fontStyle: 'italic', opacity: 0.5 }}>The cards are stirring...</p>
          </div>
        )}

        {loaded && screen === "title" && (
          <div className="screen-wrap" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 32 }}>
            <div className="text-reveal">
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.7 }}>🌙</div>
              <h1 className="title-text" style={{ fontSize: 26, color: 'var(--cream)', marginBottom: 8 }}>The Witch's Apprentice</h1>
              <p className="body-text" style={{ fontSize: 15, maxWidth: 340, margin: '0 auto', opacity: 0.7 }}>A tarot learning journey through story and intuition</p>
            </div>
            <div className="divider"><span>✦</span></div>
            <div className="text-reveal" style={{ transitionDelay: '0.2s' }}>
              <p className="body-text" style={{ marginBottom: 20, fontStyle: 'italic', fontSize: 16 }}>"Come in, child. The cards have been waiting for you."</p>
              <p className="body-text" style={{ marginBottom: 28, fontSize: 15 }}>What shall I call you, little one?</p>
              <input className="name-input" type="text" placeholder="Your name..." value={apprenticeName}
                onChange={e => setApprenticeName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && startGame()} autoFocus />
            </div>
            <div className="text-reveal" style={{ transitionDelay: '0.4s' }}>
              <button className="btn btn-primary" onClick={startGame} disabled={!apprenticeName.trim()} style={{ opacity: apprenticeName.trim() ? 1 : 0.4 }}>Begin Your Apprenticeship</button>
            </div>
          </div>
        )}

        {loaded && screen === "hub" && (
          <div className="screen-wrap" style={{ gap: 16 }}>
            <div className="text-reveal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-light)', marginBottom: 4 }}>{currentLevel.title}</p>
                  <h2 className="heading" style={{ fontSize: 22 }}>{apprenticeName}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="heading" style={{ fontSize: 14, color: 'var(--gold)' }}>Level {currentLevel.level}</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Experience</span>
                  <span style={{ fontSize: 11, color: 'var(--cream-dim)' }}>{nextLevel ? `${xpInLevel}/${xpForLevel}` : 'MAX'}</span>
                </div>
                <div className="xp-bar-outer"><div className="xp-bar-inner" style={{ width: `${nextLevel ? (xpInLevel / xpForLevel) * 100 : 100}%` }}/></div>
              </div>
            </div>
            <div className="deck-info">{deckInfo.suitNames.join(" · ")} — {deckInfo.count} possible readings {!deckInfo.allowReversed && " · Upright only"}</div>
            <div className="text-reveal" style={{ transitionDelay: '0.15s' }}>
              <p className="body-text" style={{ fontStyle: 'italic', marginBottom: 8, fontSize: 16 }}>
                {stats.total === 0 ? `"Welcome, ${apprenticeName}. Your first lesson awaits. Someone in the village needs guidance — will you read the cards for them?"`
                  : nextLevel && currentLevel.level < 4 ? `"We begin with the Major Arcana, ${apprenticeName}. Master the big voices before you listen for the whispers."`
                  : stats.perfect > stats.good + stats.wrong ? `"Your gift grows stronger, ${apprenticeName}. The cards speak clearly through you now."`
                  : `"Every reading teaches us something, ${apprenticeName}. There is always more to learn."`}
              </p>
            </div>
            <div className="text-reveal" style={{ transitionDelay: '0.3s', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={generateEncounter}>🌙 Draw a Card</button>
              {stats.total > 0 && <button className="btn" onClick={() => transition("journal")}>View Your Journal</button>}
              {unlockedRewards.length > 0 && <button className="btn" onClick={() => transition("shelf")}>🌿 Your Shelf</button>}
            </div>
            {stats.total > 0 && (
              <div className="text-reveal" style={{ transitionDelay: '0.4s', marginTop: 8 }}>
                <div className="stat-grid">
                  <div className="stat-box"><span className="stat-number">{stats.total}</span><div className="stat-label">Readings</div></div>
                  <div className="stat-box"><span className="stat-number" style={{ color: 'var(--success)' }}>{stats.perfect}</span><div className="stat-label">Clear</div></div>
                  <div className="stat-box"><span className="stat-number" style={{ color: 'var(--partial)' }}>{stats.good}</span><div className="stat-label">Partial</div></div>
                </div>
              </div>
            )}
          </div>
        )}

        {loaded && screen === "encounter" && currentCard && currentScenario && (
          <div className="screen-wrap" style={{ gap: 12 }}>
            <div className="text-reveal">
              <button className="btn" onClick={() => transition("hub")} style={{ padding: '6px 16px', fontSize: 11, marginBottom: 8, border: '1px solid rgba(139,107,74,0.3)' }}>← Return</button>
              <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-light)', marginBottom: 6 }}>{currentScenario.location}</p>
              <p className="body-text" style={{ fontSize: 17 }}>You find <strong style={{ color: 'var(--cream)' }}>{currentScenario.npc}</strong> at {currentScenario.location}. They {currentScenario.situation}.</p>
              <p className="body-text" style={{ fontSize: 15, marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>You shuffle your deck and draw a card to guide them...</p>
            </div>
            <div className={`card-display${cardRevealed ? ' revealed' : ''}`}>
              <div style={{ fontSize: 42, marginBottom: 10, transform: isReversed ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>{getCardSymbol(currentCard.name)}</div>
              <h3 className="heading" style={{ fontSize: 20, color: '#2a3a2a', marginBottom: 4 }}>{currentCard.name}</h3>
              {isReversed && <div className="reversed-badge">Reversed</div>}
            </div>
            {!result && (
              <div className="text-reveal" style={{ transitionDelay: '0.3s' }}>
                <p className="body-text" style={{ fontSize: 14, marginBottom: 10 }}>How do you interpret this card for {currentScenario.npc.split(',')[0]}? What guidance do the cards offer?</p>
                <textarea className="textarea-input" placeholder="Share your reading... What does this card mean in their situation?"
                  value={interpretation} onChange={e => setInterpretation(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitInterpretation(); } }} autoFocus />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--cream-dim)', opacity: 0.5 }}>{interpretation.length < 10 ? 'Write a bit more...' : 'Press Enter or click Submit'}</span>
                  <button className="btn btn-primary" onClick={submitInterpretation} disabled={interpretation.trim().length < 10}
                    style={{ padding: '10px 24px', fontSize: 12, opacity: interpretation.trim().length < 10 ? 0.4 : 1 }}>Submit Reading</button>
                </div>
              </div>
            )}
            {result && (
              <div className="text-reveal" style={{ transitionDelay: '0.1s' }}>
                <div className={`result-banner result-${result.score}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="heading" style={{ fontSize: 13, color: result.score === 'perfect' ? 'var(--success)' : result.score === 'good' ? 'var(--partial)' : 'var(--miss)' }}>
                      {result.score === 'perfect' ? '★ Clear Reading' : result.score === 'good' ? '◐ Partial Reading' : '○ Misread'}</span>
                    <span style={{ fontSize: 13, color: 'var(--gold)' }}>+{result.xpGain} XP</span>
                  </div>
                  <p className="body-text" style={{ fontSize: 16 }}>{result.response}</p>
                </div>
                {showMeaning && (
                  <div className="meaning-reveal">
                    <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-light)', marginBottom: 8 }}>{currentCard.name} — {isReversed ? 'Reversed' : 'Upright'} Meaning</p>
                    <p className="body-text" style={{ fontSize: 16, color: 'var(--cream)' }}>{isReversed ? currentCard.reversed : currentCard.upright}</p>
                  </div>
                )}
                {newReward && (
                  <div className="reward-banner">
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{newReward.emoji}</div>
                    <p className="heading" style={{ fontSize: 14, color: 'var(--gold)', marginBottom: 8 }}>Level Up! — {newReward.name}</p>
                    <p className="body-text" style={{ fontSize: 15, fontStyle: 'italic' }}>{newReward.desc}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={generateEncounter} style={{ flex: 1, minWidth: 160 }}>Next Reading</button>
                  <button className="btn" onClick={() => transition("hub")} style={{ flex: 1, minWidth: 130 }}>Return Home</button>
                </div>
              </div>
            )}
          </div>
        )}

        {loaded && screen === "journal" && (
          <div className="screen-wrap" style={{ gap: 16 }}>
            <div className="text-reveal">
              <button className="btn" onClick={() => transition("hub")} style={{ padding: '6px 16px', fontSize: 11, marginBottom: 12, border: '1px solid rgba(139,107,74,0.3)' }}>← Return</button>
              <h2 className="heading" style={{ fontSize: 20, marginBottom: 4 }}>📖 Apprentice Journal</h2>
              <p className="body-text" style={{ fontSize: 14, opacity: 0.6 }}>Your reading history</p>
            </div>
            <div className="divider"><span>✦</span></div>
            <div className="text-reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="stat-grid">
                <div className="stat-box"><span className="stat-number">{stats.total}</span><div className="stat-label">Total</div></div>
                <div className="stat-box"><span className="stat-number" style={{ color: 'var(--success)' }}>{stats.perfect}</span><div className="stat-label">Clear</div></div>
                <div className="stat-box"><span className="stat-number" style={{ color: 'var(--partial)' }}>{stats.good}</span><div className="stat-label">Partial</div></div>
              </div>
              {stats.total > 0 && <div style={{ textAlign: 'center', marginTop: 8 }}><span style={{ fontSize: 13, color: 'var(--cream-dim)' }}>Accuracy: {Math.round((stats.perfect / stats.total) * 100)}% clear readings</span></div>}
            </div>
            <div className="divider"><span>✦</span></div>
            <div className="text-reveal" style={{ transitionDelay: '0.3s' }}>
              {encounterHistory.length === 0 ? (
                <p className="body-text" style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.5 }}>No readings yet. The pages await your story.</p>
              ) : (
                <div>{[...encounterHistory].reverse().map((entry, i) => (
                  <div key={i} className="history-item">
                    <div className="history-dot" style={{ background: entry.score === 'perfect' ? 'var(--success)' : entry.score === 'good' ? 'var(--partial)' : 'var(--miss)' }}/>
                    <span style={{ flex: 1, color: 'var(--cream-dim)' }}>{getCardSymbol(entry.card)} {entry.card}{entry.reversed ? ' ↺' : ''}</span>
                    <span style={{ fontSize: 12, color: 'var(--cream-dim)', opacity: 0.5 }}>{entry.npc.split(',')[0]}</span>
                  </div>
                ))}</div>
              )}
            </div>
            {stats.total > 0 && (
              <div className="text-reveal" style={{ transitionDelay: '0.45s', marginTop: 16, textAlign: 'center' }}>
                <button className="btn" onClick={async () => {
                  if (confirm("Start a new apprenticeship? This will erase all your progress.")) {
                    setStats({ perfect: 0, good: 0, wrong: 0, total: 0 }); setTotalXP(0);
                    setEncounterHistory([]); setUnlockedRewards([]); setApprenticeName("");
                    try { await storage.set(SAVE_KEY, JSON.stringify({})); } catch(e) {}
                    transition("title");
                  }
                }} style={{ padding: '8px 20px', fontSize: 11, opacity: 0.5, border: '1px solid rgba(139,107,74,0.2)' }}>Start New Apprenticeship</button>
              </div>
            )}
          </div>
        )}

        {loaded && screen === "shelf" && (
          <div className="screen-wrap" style={{ gap: 16 }}>
            <div className="text-reveal">
              <button className="btn" onClick={() => transition("hub")} style={{ padding: '6px 16px', fontSize: 11, marginBottom: 12, border: '1px solid rgba(139,107,74,0.3)' }}>← Return</button>
              <h2 className="heading" style={{ fontSize: 20, marginBottom: 4 }}>🌿 Your Shelf</h2>
              <p className="body-text" style={{ fontSize: 14, opacity: 0.6 }}>Gifts from your mentor, earned through your readings</p>
            </div>
            <div className="divider"><span>✦</span></div>
            <div className="text-reveal" style={{ transitionDelay: '0.15s' }}>
              {unlockedRewards.map((r, i) => (
                <div key={i} className="reward-shelf-item">
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{r.emoji}</span>
                  <div>
                    <p className="heading" style={{ fontSize: 13, color: 'var(--cream)', marginBottom: 4 }}>{r.name}</p>
                    <p className="body-text" style={{ fontSize: 14, lineHeight: 1.5 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider"><span>✦</span></div>
            <div className="text-reveal" style={{ transitionDelay: '0.3s' }}>
              <p className="body-text" style={{ fontSize: 13, textAlign: 'center', opacity: 0.4, fontStyle: 'italic' }}>
                {LEVEL_CONFIG.filter(l => l.unlock).length - unlockedRewards.length} more gifts await as you grow...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
