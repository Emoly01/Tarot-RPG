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
  { lo
