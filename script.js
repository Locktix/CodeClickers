// =============================
//  Code Clicker : De Zéro au Mégacorp
// =============================

// -----------------------------
//  Constantes & catalogues
// -----------------------------

const SAVE_KEY = "codeClickerSave_v1";
const SAVE_INTERVAL_MS = 10_000;
const TICK_INTERVAL_MS = 1_000; // production passive par seconde

// Catalogues statiques (non stockés dans localStorage)
const UPGRADE_CATALOG = [
  {
    id: "commenterCode",
    name: "Commenter le code",
    description: "x2 Bytes par clic.",
    cost: 50,
    type: "multiplier_click",
    value: 2,
  },
  {
    id: "apprendreCss",
    name: "Apprendre le CSS",
    description: "+2 Bytes par clic.",
    cost: 150,
    type: "flat_click",
    value: 2,
  },
  {
    id: "optimiserAlgo",
    name: "Optimiser les algos",
    description: "x2 production passive.",
    cost: 500,
    type: "multiplier_passive",
    value: 2,
  },
  {
    id: "frameworkJs",
    name: "Maîtriser un framework JS",
    description: "+10 Bytes / sec.",
    cost: 1500,
    type: "flat_passive",
    value: 10,
  },
  {
    id: "cleanArchitecture",
    name: "Clean Architecture",
    description: "x2 Bytes par clic et x1.5 production passive.",
    cost: 5000,
    type: "combo",
    value: { clickMultiplier: 2, passiveMultiplier: 1.5 },
  },
  {
    id: "devOps",
    name: "Pipeline CI/CD",
    description: "+25 Bytes / sec.",
    cost: 12000,
    type: "flat_passive",
    value: 25,
  },
  {
    id: "mentorJunior",
    name: "Mentorer des juniors",
    description: "+5 Bytes par clic.",
    cost: 20000,
    type: "flat_click",
    value: 5,
  },
  {
    id: "designPatterns",
    name: "Design Patterns",
    description: "x2 Bytes par clic.",
    cost: 45000,
    type: "multiplier_click",
    value: 2,
  },
  {
    id: "profiling",
    name: "Profiling & Optimisation",
    description: "x2 production passive.",
    cost: 90000,
    type: "multiplier_passive",
    value: 2,
  },
  {
    id: "aiPairProgrammer",
    name: "IA Pair Programmer",
    description: "+50 Bytes / sec.",
    cost: 200000,
    type: "flat_passive",
    value: 50,
  },
  {
    id: "architecteEntreprise",
    name: "Architecte d'entreprise",
    description: "+15 Bytes par clic.",
    cost: 500000,
    type: "flat_click",
    value: 15,
  },
  {
    id: "fullStackGuru",
    name: "Full-Stack Guru",
    description: "x2.5 Bytes par clic.",
    cost: 1200000,
    type: "multiplier_click",
    value: 2.5,
  },
  {
    id: "quantumCompiler",
    name: "Compilateur quantique",
    description: "x3 production passive.",
    cost: 2500000,
    type: "multiplier_passive",
    value: 3,
  },
  {
    id: "uxResearchTeam",
    name: "Équipe UX Research",
    description: "+25 Bytes par clic.",
    cost: 4000000,
    type: "flat_click",
    value: 25,
  },
  {
    id: "autonomousAgents",
    name: "Agents autonomes IA",
    description: "+150 Bytes / sec.",
    cost: 7500000,
    type: "flat_passive",
    value: 150,
  },
  {
    id: "neuralPM",
    name: "Neural Product Manager",
    description: "x4 production passive.",
    cost: 15000000,
    type: "multiplier_passive",
    value: 4,
  },
];

const GENERATOR_CATALOG = [
  {
    id: "juniorDev",
    name: "Stagiaire Junior",
    baseCost: 25,
    baseProduction: 0.5, // bytes / sec
    costMultiplier: 1.15,
    description: "Écrit un peu de code quand il comprend la spec.",
  },
  {
    id: "freelancer",
    name: "Freelancer",
    baseCost: 120,
    baseProduction: 2,
    costMultiplier: 1.15,
    description: "Facture à l'heure, pas au résultat.",
  },
  {
    id: "devSenior",
    name: "Dev Senior",
    baseCost: 600,
    baseProduction: 8,
    costMultiplier: 1.15,
    description: "Automatise les tâches répétitives.",
  },
  {
    id: "equipeProduit",
    name: "Équipe Produit",
    baseCost: 2500,
    baseProduction: 30,
    costMultiplier: 1.18,
    description: "Livrent des features pendant que vous dormez.",
  },
  {
    id: "agenceOffshore",
    name: "Agence Offshore",
    baseCost: 12000,
    baseProduction: 90,
    costMultiplier: 1.2,
    description: "Une armée de devs à bas coût (mais il faut relire).",
  },
  {
    id: "saasFactory",
    name: "Usine à SaaS",
    baseCost: 55000,
    baseProduction: 260,
    costMultiplier: 1.22,
    description: "Industrialise la création de produits réutilisables.",
  },
  {
    id: "megaCorp",
    name: "Mégacorp Tech",
    baseCost: 250000,
    baseProduction: 1200,
    costMultiplier: 1.25,
    description: "Votre empire logiciel tourne à l'échelle planétaire.",
  },
  {
    id: "incubateurStartups",
    name: "Incubateur de Startups",
    baseCost: 800000,
    baseProduction: 3800,
    costMultiplier: 1.25,
    description: "Vous lancez 10 projets par an, 1 devient un succès mondial.",
  },
  {
    id: "cloudCluster",
    name: "Cluster Cloud",
    baseCost: 2500000,
    baseProduction: 12000,
    costMultiplier: 1.27,
    description: "Des milliers de serveurs qui build en continu.",
  },
  {
    id: "labRAndD",
    name: "Lab R&D",
    baseCost: 8000000,
    baseProduction: 42000,
    costMultiplier: 1.3,
    description: "Recherche de nouvelles techno qui explosent la productivité.",
  },
  {
    id: "galacticOutsourcing",
    name: "Galactic Outsourcing",
    baseCost: 20000000,
    baseProduction: 90000,
    costMultiplier: 1.3,
    description: "Des équipes interplanétaires qui codent 30h/jour.",
  },
  {
    id: "hivemindAI",
    name: "IA HiveMind",
    baseCost: 60000000,
    baseProduction: 280000,
    costMultiplier: 1.32,
    description: "Un cerveau collectif neuronal dédié à votre roadmap.",
  },
  {
    id: "temporalLoop",
    name: "Boucle Temporelle",
    baseCost: 180000000,
    baseProduction: 900000,
    costMultiplier: 1.35,
    description: "Du code livré hier grâce aux lignes temporelles parallèles.",
  },
  {
    id: "quantumUniverse",
    name: "Univers Quantique",
    baseCost: 600000000,
    baseProduction: 3200000,
    costMultiplier: 1.38,
    description: "Chaque timeline alternate ship sa feature en même temps.",
  },
];

const ACHIEVEMENT_CATALOG = [
  {
    id: "first_click",
    name: "Hello, World",
    description: "Écrire votre première ligne de code.",
    type: "total_bytes",
    threshold: 1,
  },
  {
    id: "kilobyte_club",
    name: "Kilobyte Club",
    description: "Cumuler 1 000 bytes écrits.",
    type: "total_bytes",
    threshold: 1000,
  },
  {
    id: "megabyte_club",
    name: "Megabyte Club",
    description: "Cumuler 1 000 000 bytes écrits.",
    type: "total_bytes",
    threshold: 1_000_000,
  },
  {
    id: "first_generator",
    name: "On ne code plus seul",
    description: "Acheter votre premier générateur.",
    type: "generators_owned",
    threshold: 1,
  },
  {
    id: "team_builder",
    name: "Team Builder",
    description: "Posséder 10 générateurs au total.",
    type: "generators_owned",
    threshold: 10,
  },
  {
    id: "toolbox_full",
    name: "Boîte à outils complète",
    description: "Acheter 5 upgrades de compétences.",
    type: "upgrades_bought",
    threshold: 5,
  },
  {
    id: "hyperfocus_used",
    name: "Flow State",
    description: "Activer Hyperfocus au moins une fois.",
    type: "hyperfocus_used",
    threshold: 1,
  },
  {
    id: "click_master",
    name: "Maître du clic",
    description: "Atteindre au moins 100 Bytes par clic.",
    type: "ppc_reached",
    threshold: 100,
  },
  {
    id: "factory_mode",
    name: "Usine à bytes",
    description: "Atteindre au moins 1 000 Bytes par seconde.",
    type: "pps_reached",
    threshold: 1000,
  },
  {
    id: "offline_grinder",
    name: "Grinder hors-ligne",
    description: "Gagner au moins 50 000 bytes en étant hors-ligne.",
    type: "offline_bytes",
    threshold: 50_000,
  },
  {
    id: "collectionneur",
    name: "Collectionneur de badges",
    description: "Débloquer au moins 10 achievements.",
    type: "achievements_unlocked",
    threshold: 10,
  },
  {
    id: "tera_click",
    name: "Frappe Terabit",
    description: "Atteindre 1 000 Bytes par clic.",
    type: "ppc_reached",
    threshold: 1000,
  },
  {
    id: "giga_factory",
    name: "Giga Factory",
    description: "Atteindre 10 000 Bytes par seconde.",
    type: "pps_reached",
    threshold: 10_000,
  },
  {
    id: "legend_of_code",
    name: "Légende du code",
    description: "Cumuler 1 000 000 000 bytes écrits.",
    type: "total_bytes",
    threshold: 1_000_000_000,
  },
  {
    id: "army_of_devs",
    name: "Armée de devs",
    description: "Posséder 50 générateurs au total.",
    type: "generators_owned",
    threshold: 50,
  },
  {
    id: "automation_architect",
    name: "Architecte de l'automatisation",
    description: "Acheter 15 upgrades de compétences.",
    type: "upgrades_bought",
    threshold: 15,
  },
  {
    id: "offline_tycoon",
    name: "Magnat hors-ligne",
    description: "Gagner 1 000 000 bytes en étant hors-ligne.",
    type: "offline_bytes",
    threshold: 1_000_000,
  },
  {
    id: "hyperfocus_master",
    name: "Maître du Flow",
    description: "Activer Hyperfocus 20 fois.",
    type: "hyperfocus_used",
    threshold: 20,
  },
  {
    id: "badge_mythic",
    name: "Collection mythique",
    description: "Débloquer 18 achievements.",
    type: "achievements_unlocked",
    threshold: 18,
  },
];

const QUEST_CATALOG = [
  {
    id: "earn_5k",
    description: "Gagner 5 000 bytes aujourd'hui.",
    type: "earn_bytes",
    target: 5_000,
    reward: 1_000,
  },
  {
    id: "click_marathon",
    description: "Effectuer 150 clics.",
    type: "click_times",
    target: 150,
    reward: 1_200,
  },
  {
    id: "hire_team",
    description: "Acheter 5 générateurs.",
    type: "buy_generators",
    target: 5,
    reward: 2_500,
  },
  {
    id: "upgrade_suite",
    description: "Acheter 3 compétences.",
    type: "buy_upgrades",
    target: 3,
    reward: 2_000,
  },
  {
    id: "spender",
    description: "Dépenser 25 000 bytes.",
    type: "spend_bytes",
    target: 25_000,
    reward: 1_800,
  },
  {
    id: "hyper_master",
    description: "Activer Hyperfocus 3 fois.",
    type: "use_boost",
    target: 3,
    reward: 2_200,
  },
];

const QUEST_SLOTS = 3;
const QUEST_DURATION_MS = 6 * 60 * 60 * 1000; // 6 heures

const EVENT_CATALOG = [
  {
    id: "coffeeRush",
    name: "Rush Caféiné",
    description: "Vos clics valent x2 pendant 60s.",
    duration: 60,
    clickMultiplier: 2,
  },
  {
    id: "serverOverdrive",
    name: "Serveurs en surchauffe",
    description: "Production passive x2 pendant 60s.",
    duration: 60,
    passiveMultiplier: 2,
  },
  {
    id: "cloudDiscount",
    name: "Promo Cloud",
    description: "Générateurs -20% pendant 45s.",
    duration: 45,
    generatorDiscount: 0.8,
  },
  {
    id: "hackathon",
    name: "Hackathon mondial",
    description: "Clics et passif x1.5 pendant 45s.",
    duration: 45,
    clickMultiplier: 1.5,
    passiveMultiplier: 1.5,
  },
];

const EVENT_ROLL_INTERVAL_SECONDS = 90;
const EVENT_TRIGGER_CHANCE = 0.4;

// -----------------------------
//  État du jeu
// -----------------------------

const defaultGameState = {
  bytes: 0,
  productionPerClick: 1,
  productionPerSecond: 0,
  totalBytesEarned: 0, // bytes générés (avant dépenses)
  upgrades: {}, // ex: { commenterCode: true }
  generators: {}, // ex: { juniorDev: { owned: 1, cost: 28 } }
  achievements: {}, // ex: { first_click: true }
  activeBoost: {
    isActive: false,
    multiplier: 3,
    remainingSeconds: 0,
    cooldownSeconds: 60,
    currentCooldown: 0,
    timesUsed: 0,
  },
  offlineBytesEarned: 0,
  stats: {
    totalClicks: 0,
    bytesSpent: 0,
    generatorsBought: 0,
    upgradesBought: 0,
    boostsUsed: 0,
  },
  activeQuests: [],
  questExpiry: 0,
  activeEvent: null,
  eventRollTimer: 0,
  lastSaveTimestamp: Date.now(),
};

let gameState = structuredClone(defaultGameState);

// Buffer pour l'affichage du code "en temps réel" (non sauvegardé)
const MAX_CODE_LINES = 40;
let codeBuffer = [];
let codeSnippetIndex = 0;
let questNeedsRefresh = true;

// Faux fichier de projet pour un rendu plus dense
const CODE_SNIPPETS = [
  "import { createApp } from 'code-clicker';",
  "",
  "const config = {",
  "  title: 'Code Clicker : De Zéro au Mégacorp',",
  "  initialBytes: 0,",
  "  difficulty: 'normal',",
  "};",
  "",
  "const state = {",
  "  bytes: 0,",
  "  perClick: 1,",
  "  perSecond: 0,",
  "};",
  "",
  "function computeBytesPerClick(base, boost) {",
  "  return base * (boost?.multiplier ?? 1);",
  "}",
  "",
  "function handleClick() {",
  "  const gain = computeBytesPerClick(state.perClick, state.boost);",
  "  state.bytes += gain;",
  "  log(`+${gain} bytes`);",
  "}",
  "",
  "async function fetchLeaderboard() {",
  "  try {",
  "    const res = await fetch('/api/leaderboard');",
  "    if (!res.ok) throw new Error('network error');",
  "    return res.json();",
  "  } catch (err) {",
  "    console.error('[leaderboard]', err);",
  "    return [];",
  "  }",
  "}",
  "",
  "class Generator {",
  "  constructor(name, baseCost, baseProduction) {",
  "    this.name = name;",
  "    this.baseCost = baseCost;",
  "    this.baseProduction = baseProduction;",
  "    this.owned = 0;",
  "  }",
  "",
  "  get cost() {",
  "    return Math.floor(this.baseCost * Math.pow(1.15, this.owned));",
  "  }",
  "",
  "  buy(bytes) {",
  "    if (bytes < this.cost) return false;",
  "    this.owned += 1;",
  "    return true;",
  "  }",
  "}",
  "",
  "const junior = new Generator('Junior Dev', 25, 0.5);",
  "const senior = new Generator('Senior Dev', 600, 8);",
  "",
  "function tick(deltaSeconds) {",
  "  const passive =",
  "    junior.owned * junior.baseProduction +",
  "    senior.owned * senior.baseProduction;",
  "  state.bytes += passive * deltaSeconds;",
  "}",
  "",
  "// simplistic event bus",
  "const events = new Map();",
  "",
  "function on(event, cb) {",
  "  if (!events.has(event)) events.set(event, []);",
  "  events.get(event).push(cb);",
  "}",
  "",
  "function emit(event, payload) {",
  "  const listeners = events.get(event) ?? [];",
  "  for (const listener of listeners) {",
  "    try {",
  "      listener(payload);",
  "    } catch (err) {",
  "      console.error('[listener error]', err);",
  "    }",
  "  }",
  "}",
  "",
  "on('achievement:unlock', (a) => {",
  "  console.log('Unlocked', a.id);",
  "});",
  "",
  "export function bootstrap() {",
  "  createApp(config, state).mount('#app');",
  "}",
];

// -----------------------------
//  Utilitaires
// -----------------------------

function formatNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  if (num % 1 !== 0) return num.toFixed(2);
  return num.toString();
}

function formatDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function getGeneratorState(id) {
  if (!gameState.generators[id]) {
    gameState.generators[id] = {
      owned: 0,
      cost: GENERATOR_CATALOG.find((g) => g.id === id)?.baseCost ?? 0,
    };
  }
  return gameState.generators[id];
}

// -----------------------------
//  Calculs de production
// -----------------------------

function recalculateProduction() {
  // Production passive de base via générateurs
  let passive = 0;

  for (const genDef of GENERATOR_CATALOG) {
    const genState = getGeneratorState(genDef.id);
    passive += genState.owned * genDef.baseProduction;
  }

  // Production par clic de base
  let click = defaultGameState.productionPerClick;

  // Appliquer les upgrades
  for (const upgrade of UPGRADE_CATALOG) {
    if (!gameState.upgrades[upgrade.id]) continue;

    switch (upgrade.type) {
      case "multiplier_click":
        click *= upgrade.value;
        break;
      case "flat_click":
        click += upgrade.value;
        break;
      case "multiplier_passive":
        passive *= upgrade.value;
        break;
      case "flat_passive":
        passive += upgrade.value;
        break;
      case "combo":
        if (upgrade.value?.clickMultiplier) {
          click *= upgrade.value.clickMultiplier;
        }
        if (upgrade.value?.passiveMultiplier) {
          passive *= upgrade.value.passiveMultiplier;
        }
        break;
    }
  }

  gameState.productionPerClick = click;
  gameState.productionPerSecond = passive;
}

// -----------------------------
//  Sauvegarde & chargement
// -----------------------------

function saveGame() {
  try {
    gameState.lastSaveTimestamp = Date.now();
    const toSave = JSON.stringify(gameState);
    localStorage.setItem(SAVE_KEY, toSave);
  } catch (err) {
    console.error("Erreur de sauvegarde", err);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      gameState = structuredClone(defaultGameState);
      return;
    }

    const parsed = JSON.parse(raw);
    gameState = {
      ...structuredClone(defaultGameState),
      ...parsed,
      upgrades: { ...defaultGameState.upgrades, ...(parsed.upgrades || {}) },
      generators: { ...defaultGameState.generators, ...(parsed.generators || {}) },
    };
    gameState.stats = {
      ...defaultGameState.stats,
      ...(parsed.stats || {}),
    };
    gameState.activeQuests = parsed.activeQuests || [];
    gameState.activeEvent = parsed.activeEvent || null;
    gameState.questExpiry = parsed.questExpiry || 0;
    gameState.eventRollTimer = parsed.eventRollTimer || 0;

    // Calcul de la production hors-ligne
    const now = Date.now();
    const last = parsed.lastSaveTimestamp ?? now;
    const diffSeconds = Math.max(0, (now - last) / 1000);

    recalculateProduction();
    const offlineGain = gameState.productionPerSecond * diffSeconds;
    if (offlineGain > 0) {
      gameState.bytes += offlineGain;
      gameState.totalBytesEarned += offlineGain;
      gameState.offlineBytesEarned =
        (gameState.offlineBytesEarned || 0) + offlineGain;
      updateQuestProgress("earn_bytes", offlineGain);
      showLog(
        `// Vous revenez après ${diffSeconds.toFixed(
          0
        )}s : +${formatNumber(offlineGain)} bytes hors-ligne`
      );
    }
  } catch (err) {
    console.error("Erreur de chargement, réinitialisation", err);
    gameState = structuredClone(defaultGameState);
  }
}

// -----------------------------
//  Interactions de jeu
// -----------------------------

function getEffectiveClickProduction() {
  let base = gameState.productionPerClick;
  if (gameState.activeBoost.isActive) {
    base *= gameState.activeBoost.multiplier;
  }
  if (gameState.activeEvent?.clickMultiplier) {
    base *= gameState.activeEvent.clickMultiplier;
  }
  return base;
}

function clickCode() {
  const gain = getEffectiveClickProduction();
  gameState.bytes += gain;
  gameState.totalBytesEarned += gain;
  gameState.stats.totalClicks = (gameState.stats.totalClicks || 0) + 1;
  updateQuestProgress("click_times", 1);
  updateQuestProgress("earn_bytes", gain);
  showLog(`// +${formatNumber(gain)} bytes - ligne de code écrite`);
  appendCodeLine();
  checkAchievements();
  updateUI();
}

function buyUpgrade(id) {
  const upgrade = UPGRADE_CATALOG.find((u) => u.id === id);
  if (!upgrade) return;
  if (gameState.upgrades[id]) return; // déjà acheté
  if (gameState.bytes < upgrade.cost) return;

  gameState.bytes -= upgrade.cost;
  gameState.upgrades[id] = true;
  gameState.stats.bytesSpent = (gameState.stats.bytesSpent || 0) + upgrade.cost;
  gameState.stats.upgradesBought =
    (gameState.stats.upgradesBought || 0) + 1;
  updateQuestProgress("buy_upgrades", 1);
  updateQuestProgress("spend_bytes", upgrade.cost);

  recalculateProduction();
  showLog(`// Nouvelle compétence débloquée : ${upgrade.name}`);
  checkAchievements();
  updateUI();
}

function buyGenerator(id) {
  const genDef = GENERATOR_CATALOG.find((g) => g.id === id);
  if (!genDef) return;

  const genState = getGeneratorState(id);
  const cost = genState.cost;
  const discount = gameState.activeEvent?.generatorDiscount ?? 1;
  const effectiveCost = Math.ceil(cost * discount);

  if (gameState.bytes < effectiveCost) return;

  gameState.bytes -= effectiveCost;
  genState.owned += 1;
  genState.cost = Math.ceil(cost * genDef.costMultiplier);
  gameState.stats.bytesSpent = (gameState.stats.bytesSpent || 0) + effectiveCost;
  gameState.stats.generatorsBought =
    (gameState.stats.generatorsBought || 0) + 1;
  updateQuestProgress("buy_generators", 1);
  updateQuestProgress("spend_bytes", effectiveCost);

  recalculateProduction();
  showLog(`// Vous recrutez : ${genDef.name}`);
  checkAchievements();
  updateUI();
}

function activateBoost() {
  const boost = gameState.activeBoost;
  if (boost.isActive || boost.currentCooldown > 0) return;

  boost.isActive = true;
  boost.remainingSeconds = 20;
  boost.currentCooldown = boost.cooldownSeconds;
  boost.timesUsed += 1;
  gameState.stats.boostsUsed = (gameState.stats.boostsUsed || 0) + 1;
  updateQuestProgress("use_boost", 1);

  showLog("// Hyperfocus activé : vos clics sont surchargés !");
  checkAchievements();
  updateUI();
}

function hardReset() {
  if (!window.confirm("Réinitialiser la partie ? Cette action est définitive.")) {
    return;
  }
  gameState = structuredClone(defaultGameState);
  saveGame();
  showLog("// Partie réinitialisée. Nouveau projet, même motivation.");
  updateUI();
}

// -----------------------------
//  Achievements
// -----------------------------

function computeGeneratorsOwned() {
  let total = 0;
  for (const genDef of GENERATOR_CATALOG) {
    const state = getGeneratorState(genDef.id);
    total += state.owned;
  }
  return total;
}

function countUpgradesBought() {
  return Object.values(gameState.upgrades).filter(Boolean).length;
}

function unlockAchievement(achievement) {
  if (gameState.achievements[achievement.id]) return;
  gameState.achievements[achievement.id] = true;
  showLog(`// Badge débloqué : ${achievement.name}`);
}

function checkAchievements() {
  for (const ach of ACHIEVEMENT_CATALOG) {
    if (gameState.achievements[ach.id]) continue;

    let fulfilled = false;
    switch (ach.type) {
      case "total_bytes":
        fulfilled = gameState.totalBytesEarned >= ach.threshold;
        break;
      case "generators_owned":
        fulfilled = computeGeneratorsOwned() >= ach.threshold;
        break;
      case "upgrades_bought":
        fulfilled = countUpgradesBought() >= ach.threshold;
        break;
      case "hyperfocus_used":
        fulfilled = gameState.activeBoost.timesUsed >= ach.threshold;
        break;
      case "ppc_reached":
        fulfilled = gameState.productionPerClick >= ach.threshold;
        break;
      case "pps_reached":
        fulfilled = gameState.productionPerSecond >= ach.threshold;
        break;
      case "offline_bytes":
        fulfilled = (gameState.offlineBytesEarned || 0) >= ach.threshold;
        break;
      case "achievements_unlocked":
        fulfilled =
          Object.values(gameState.achievements).filter(Boolean).length >=
          ach.threshold;
        break;
    }

    if (fulfilled) {
      unlockAchievement(ach);
    }
  }

  updateAchievementsUI();
}

// -----------------------------
//  Quêtes quotidiennes
// -----------------------------

function createQuestInstance(def) {
  return {
    id: def.id,
    description: def.description,
    type: def.type,
    target: def.target,
    reward: def.reward,
    progress: 0,
    completed: false,
  };
}

function hydrateQuestInstance(quest) {
  const def = QUEST_CATALOG.find((q) => q.id === quest.id);
  if (!def) return createQuestInstance(quest);
  return {
    id: def.id,
    description: def.description,
    type: def.type,
    target: def.target,
    reward: def.reward,
    progress: quest.progress ?? 0,
    completed: quest.completed ?? false,
  };
}

function ensureQuestsInitialized() {
  if (!Array.isArray(gameState.activeQuests)) {
    gameState.activeQuests = [];
  }
  if (gameState.activeQuests.length) {
    gameState.activeQuests = gameState.activeQuests.map((quest) =>
      hydrateQuestInstance(quest)
    );
  }
  if (
    gameState.activeQuests.length === 0 ||
    !gameState.questExpiry ||
    Date.now() > gameState.questExpiry
  ) {
    regenerateQuests();
  }
}

function regenerateQuests() {
  const pool = [...QUEST_CATALOG];
  const selected = [];
  while (selected.length < QUEST_SLOTS && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    const def = pool.splice(index, 1)[0];
    selected.push(createQuestInstance(def));
  }
  gameState.activeQuests = selected;
  gameState.questExpiry = Date.now() + QUEST_DURATION_MS;
  questNeedsRefresh = true;
}

function checkQuestExpiry() {
  if (gameState.questExpiry && Date.now() > gameState.questExpiry) {
    regenerateQuests();
  }
}

function updateQuestProgress(type, amount = 1) {
  if (!Array.isArray(gameState.activeQuests)) return;
  if (!amount || amount <= 0) return;
  let changed = false;
  for (const quest of gameState.activeQuests) {
    if (quest.type !== type || quest.completed) continue;
    quest.progress = Math.min(quest.target, quest.progress + amount);
    if (quest.progress >= quest.target && !quest.completed) {
      quest.completed = true;
      grantQuestReward(quest);
    }
    changed = true;
  }
  if (changed) {
    questNeedsRefresh = true;
  }
}

function grantQuestReward(quest) {
  gameState.bytes += quest.reward;
  gameState.totalBytesEarned += quest.reward;
  showLog(
    `// Quête terminée : ${quest.description} (+${formatNumber(
      quest.reward
    )} bytes)`
  );
  questNeedsRefresh = true;
}

// -----------------------------
//  UI
// -----------------------------

function showLog(text) {
  const el = document.getElementById("lastActionLog");
  if (el) {
    el.textContent = text;
  }
}

function getNextCodeLine() {
  if (CODE_SNIPPETS.length === 0) return "// ...";
  const line = CODE_SNIPPETS[codeSnippetIndex % CODE_SNIPPETS.length];
  codeSnippetIndex++;
  return line;
}

function appendCodeLine() {
  const el = document.getElementById("codeStream");
  if (!el) return;

  const line = getNextCodeLine();
  codeBuffer.push(line);
  if (codeBuffer.length > MAX_CODE_LINES) {
    codeBuffer = codeBuffer.slice(-MAX_CODE_LINES);
  }

  el.textContent = codeBuffer.join("\n");
}

function createUpgradeElement(upgrade) {
  const container = document.createElement("button");
  container.className = "shop-item";
  container.dataset.id = upgrade.id;

  const header = document.createElement("div");
  header.className = "shop-item-header";

  const nameSpan = document.createElement("span");
  nameSpan.className = "shop-item-name";
  nameSpan.textContent = upgrade.name;

  const costSpan = document.createElement("span");
  costSpan.className = "shop-item-cost";
  costSpan.textContent = `${formatNumber(upgrade.cost)} bytes`;

  header.appendChild(nameSpan);
  header.appendChild(costSpan);

  const effectSpan = document.createElement("span");
  effectSpan.className = "shop-item-effect";
  effectSpan.textContent = upgrade.description;

  container.appendChild(header);
  container.appendChild(effectSpan);

  container.addEventListener("click", () => buyUpgrade(upgrade.id));

  return container;
}

function createGeneratorElement(genDef) {
  const container = document.createElement("button");
  container.className = "shop-item";
  container.dataset.id = genDef.id;

  const header = document.createElement("div");
  header.className = "shop-item-header";

  const nameSpan = document.createElement("span");
  nameSpan.className = "shop-item-name";
  nameSpan.textContent = genDef.name;

  const costSpan = document.createElement("span");
  costSpan.className = "shop-item-cost";
  costSpan.textContent = `${formatNumber(genDef.baseCost)} bytes`;

  header.appendChild(nameSpan);
  header.appendChild(costSpan);

  const effectSpan = document.createElement("span");
  effectSpan.className = "shop-item-effect";
  effectSpan.textContent = `${genDef.baseProduction} bytes/sec — ${genDef.description}`;

  const ownedSpan = document.createElement("span");
  ownedSpan.className = "shop-item-owned";
  ownedSpan.textContent = "Possédés : 0";

  container.appendChild(header);
  container.appendChild(effectSpan);
  container.appendChild(ownedSpan);

  container.addEventListener("click", () => buyGenerator(genDef.id));

  return container;
}

function createAchievementElement(achievement) {
  const container = document.createElement("div");
  container.className = "shop-item";
  container.dataset.id = achievement.id;

  const header = document.createElement("div");
  header.className = "shop-item-header";

  const title = document.createElement("span");
  title.className = "achievement-item-title";
  title.textContent = achievement.name;

  const badge = document.createElement("span");
  badge.className = "achievement-badge";
  badge.textContent = "LOCKED";

  header.appendChild(title);
  header.appendChild(badge);

  const desc = document.createElement("span");
  desc.className = "achievement-item-status";
  desc.textContent = achievement.description;

  container.appendChild(header);
  container.appendChild(desc);

  return container;
}

function renderShop() {
  const upgradeList = document.getElementById("upgradeList");
  const generatorList = document.getElementById("generatorList");
  const achievementList = document.getElementById("achievementList");
  if (!upgradeList || !generatorList) return;

  upgradeList.innerHTML = "";
  generatorList.innerHTML = "";
  if (achievementList) achievementList.innerHTML = "";

  for (const upgrade of UPGRADE_CATALOG) {
    upgradeList.appendChild(createUpgradeElement(upgrade));
  }

  for (const genDef of GENERATOR_CATALOG) {
    generatorList.appendChild(createGeneratorElement(genDef));
  }

  if (achievementList) {
    for (const ach of ACHIEVEMENT_CATALOG) {
      achievementList.appendChild(createAchievementElement(ach));
    }
  }
}

function updateUI() {
  const bytesEl = document.getElementById("bytesDisplay");
  const ppsEl = document.getElementById("ppsDisplay");
  const ppcEl = document.getElementById("ppcDisplay");

  if (bytesEl) bytesEl.textContent = formatNumber(gameState.bytes);
  if (ppsEl) ppsEl.textContent = formatNumber(gameState.productionPerSecond);
  if (ppcEl) ppcEl.textContent = formatNumber(gameState.productionPerClick);

  // Bouton Hyperfocus
  const boostBtn = document.getElementById("boostButton");
  if (boostBtn) {
    const boost = gameState.activeBoost;
    if (boost.isActive) {
      boostBtn.textContent = `Hyperfocus actif (${boost.remainingSeconds}s)`;
      boostBtn.disabled = true;
    } else if (boost.currentCooldown > 0) {
      boostBtn.textContent = `Hyperfocus en recharge (${boost.currentCooldown}s)`;
      boostBtn.disabled = true;
    } else {
      boostBtn.textContent = "Activer Hyperfocus (x3 clics)";
      boostBtn.disabled = false;
    }
  }

  // Mettre à jour les éléments du shop
  for (const upgrade of UPGRADE_CATALOG) {
    const btn = document.querySelector(
      `.shop-item[data-id="${upgrade.id}"]`
    );
    if (!btn) continue;

    const owned = !!gameState.upgrades[upgrade.id];

    btn.classList.toggle("disabled", gameState.bytes < upgrade.cost || owned);
    btn.classList.toggle("upgrade-owned", owned);

    // mettre à jour texte de prix
    const costSpan = btn.querySelector(".shop-item-cost");
    if (costSpan) {
      costSpan.textContent = owned
        ? "Acheté"
        : `${formatNumber(upgrade.cost)} bytes`;
    }
  }

  for (const genDef of GENERATOR_CATALOG) {
    const btn = document.querySelector(
      `.shop-item[data-id="${genDef.id}"]`
    );
    if (!btn) continue;

    const genState = getGeneratorState(genDef.id);
    const discount = gameState.activeEvent?.generatorDiscount ?? 1;
    const displayCost = Math.ceil(genState.cost * discount);
    btn.classList.toggle("disabled", gameState.bytes < displayCost);

    const costSpan = btn.querySelector(".shop-item-cost");
    if (costSpan) {
      costSpan.textContent = `${formatNumber(displayCost)} bytes`;
    }

    const ownedSpan = btn.querySelector(".shop-item-owned");
    if (ownedSpan) {
      ownedSpan.textContent = `Possédés : ${genState.owned}`;
    }
  }

  if (questNeedsRefresh) {
    updateQuestUI();
    questNeedsRefresh = false;
  } else {
    updateQuestTimerDisplay();
  }

  updateEventUI();
}

function updateAchievementsUI() {
  for (const ach of ACHIEVEMENT_CATALOG) {
    const node = document.querySelector(
      `.achievement-list .shop-item[data-id="${ach.id}"]`
    );
    if (!node) continue;

    const unlocked = !!gameState.achievements[ach.id];
    node.classList.toggle("achievement-unlocked", unlocked);

    const badge = node.querySelector(".achievement-badge");
    if (badge) {
      badge.textContent = unlocked ? "UNLOCKED" : "LOCKED";
    }
  }
}

function updateQuestUI() {
  const questContainer = document.getElementById("questList");
  if (!questContainer) return;
  ensureQuestsInitialized();
  questContainer.innerHTML = "";

  updateQuestTimerDisplay();

  if (!gameState.activeQuests.length) {
    const empty = document.createElement("div");
    empty.className = "quest-card";
    empty.textContent = "// Aucune quête disponible pour le moment.";
    questContainer.appendChild(empty);
    return;
  }

  for (const quest of gameState.activeQuests) {
    const card = document.createElement("div");
    card.className = "quest-card";
    if (quest.completed) {
      card.classList.add("quest-completed");
    }

    const header = document.createElement("div");
    header.className = "quest-header";

    const name = document.createElement("span");
    name.className = "quest-name";
    name.textContent = quest.description;

    const reward = document.createElement("span");
    reward.className = "quest-reward";
    reward.textContent = `+${formatNumber(quest.reward)} bytes`;

    header.appendChild(name);
    header.appendChild(reward);

    const progressBar = document.createElement("div");
    progressBar.className = "quest-progress-bar";
    const fill = document.createElement("div");
    fill.className = "quest-progress-fill";
    const ratio = quest.target > 0 ? quest.progress / quest.target : 1;
    fill.style.width = `${Math.min(1, ratio) * 100}%`;
    progressBar.appendChild(fill);

    const label = document.createElement("div");
    label.className = "quest-progress-label";
    label.textContent = `${formatNumber(quest.progress)} / ${formatNumber(
      quest.target
    )}`;

    card.appendChild(header);
    card.appendChild(progressBar);
    card.appendChild(label);

    questContainer.appendChild(card);
  }
}

function updateQuestTimerDisplay() {
  const timerEl = document.getElementById("questTimer");
  if (!timerEl) return;
  if (!gameState.questExpiry) {
    timerEl.textContent = "--:--:--";
    return;
  }
  const remaining = (gameState.questExpiry - Date.now()) / 1000;
  timerEl.textContent = formatDuration(remaining);
}

// -----------------------------
//  Événements temporaires
// -----------------------------

function startEvent(eventDef) {
  gameState.activeEvent = {
    id: eventDef.id,
    name: eventDef.name,
    description: eventDef.description,
    clickMultiplier: eventDef.clickMultiplier ?? 1,
    passiveMultiplier: eventDef.passiveMultiplier ?? 1,
    generatorDiscount: eventDef.generatorDiscount ?? 1,
    remainingSeconds: eventDef.duration,
  };
  showLog(`// Événement : ${eventDef.name} — ${eventDef.description}`);
  updateEventUI();
}

function maybeTriggerRandomEvent() {
  if (gameState.activeEvent) return;
  if (Math.random() > EVENT_TRIGGER_CHANCE) return;
  const event =
    EVENT_CATALOG[Math.floor(Math.random() * EVENT_CATALOG.length)];
  startEvent(event);
}

function handleEventTimers() {
  if (gameState.activeEvent) {
    gameState.activeEvent.remainingSeconds -= 1;
    if (gameState.activeEvent.remainingSeconds <= 0) {
      showLog("// L'événement spécial est terminé.");
      gameState.activeEvent = null;
    }
    updateEventUI();
    return;
  }

  gameState.eventRollTimer = (gameState.eventRollTimer || 0) + 1;
  if (gameState.eventRollTimer >= EVENT_ROLL_INTERVAL_SECONDS) {
    gameState.eventRollTimer = 0;
    maybeTriggerRandomEvent();
  }
}

function updateEventUI() {
  const banner = document.getElementById("eventBanner");
  if (!banner) return;
  const nameEl = document.getElementById("eventName");
  const timerEl = document.getElementById("eventTimer");
  const descEl = document.getElementById("eventDescription");

  if (gameState.activeEvent) {
    banner.classList.remove("hidden");
    if (nameEl) nameEl.textContent = gameState.activeEvent.name;
    if (descEl) descEl.textContent = gameState.activeEvent.description;
    if (timerEl)
      timerEl.textContent = formatDuration(
        gameState.activeEvent.remainingSeconds
      );
  } else {
    banner.classList.add("hidden");
  }
}

// -----------------------------
//  Boucle de jeu
// -----------------------------

function gameLoopTick() {
  // Production passive
  if (gameState.productionPerSecond > 0) {
    let passiveGain = gameState.productionPerSecond;
    if (gameState.activeEvent?.passiveMultiplier) {
      passiveGain *= gameState.activeEvent.passiveMultiplier;
    }
    gameState.bytes += passiveGain;
    gameState.totalBytesEarned += passiveGain;
    updateQuestProgress("earn_bytes", passiveGain);
    if (passiveGain > 0) {
      appendCodeLine();
    }
  }

  // Gestion du boost actif / cooldown
  const boost = gameState.activeBoost;
  if (boost.isActive) {
    if (boost.remainingSeconds > 0) {
      boost.remainingSeconds -= 1;
    }
    if (boost.remainingSeconds <= 0) {
      boost.isActive = false;
      showLog("// Hyperfocus terminé. Respirez, buvez un café.");
    }
  } else if (boost.currentCooldown > 0) {
    boost.currentCooldown -= 1;
    if (boost.currentCooldown < 0) boost.currentCooldown = 0;
  }

  handleEventTimers();
  checkQuestExpiry();
  checkAchievements();
  updateUI();
}

// -----------------------------
//  Initialisation
// -----------------------------

function initGame() {
  // Lier les boutons principaux
  const clickBtn = document.getElementById("clickButton");
  const resetBtn = document.getElementById("resetButton");
  const boostBtn = document.getElementById("boostButton");
  if (clickBtn) clickBtn.addEventListener("click", clickCode);
  if (resetBtn) resetBtn.addEventListener("click", hardReset);
  if (boostBtn) boostBtn.addEventListener("click", activateBoost);

  // Charger la sauvegarde
  loadGame();
  recalculateProduction();
  ensureQuestsInitialized();

  // Générer le magasin une fois
  renderShop();
  updateUI();
  updateAchievementsUI();
  updateQuestUI();
  updateEventUI();

  // Boucle de jeu passive
  setInterval(gameLoopTick, TICK_INTERVAL_MS);

  // Sauvegarde périodique
  setInterval(saveGame, SAVE_INTERVAL_MS);

  // Sauvegarde à la fermeture
  window.addEventListener("beforeunload", () => {
    saveGame();
  });
}

// Lancement
window.addEventListener("DOMContentLoaded", initGame);


