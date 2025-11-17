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
];

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
  lastSaveTimestamp: Date.now(),
};

let gameState = structuredClone(defaultGameState);

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

    // Calcul de la production hors-ligne
    const now = Date.now();
    const last = parsed.lastSaveTimestamp ?? now;
    const diffSeconds = Math.max(0, (now - last) / 1000);

    recalculateProduction();
    const offlineGain = gameState.productionPerSecond * diffSeconds;
    if (offlineGain > 0) {
      gameState.bytes += offlineGain;
      gameState.totalBytesEarned += offlineGain;
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
  return base;
}

function clickCode() {
  const gain = getEffectiveClickProduction();
  gameState.bytes += gain;
  gameState.totalBytesEarned += gain;
  showLog(`// +${formatNumber(gain)} bytes - ligne de code écrite`);
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

  if (gameState.bytes < cost) return;

  gameState.bytes -= cost;
  genState.owned += 1;
  genState.cost = Math.ceil(cost * genDef.costMultiplier);

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
    }

    if (fulfilled) {
      unlockAchievement(ach);
    }
  }

  updateAchievementsUI();
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
    btn.classList.toggle("disabled", gameState.bytes < genState.cost);

    const costSpan = btn.querySelector(".shop-item-cost");
    if (costSpan) {
      costSpan.textContent = `${formatNumber(genState.cost)} bytes`;
    }

    const ownedSpan = btn.querySelector(".shop-item-owned");
    if (ownedSpan) {
      ownedSpan.textContent = `Possédés : ${genState.owned}`;
    }
  }
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

// -----------------------------
//  Boucle de jeu
// -----------------------------

function gameLoopTick() {
  // Production passive
  if (gameState.productionPerSecond > 0) {
    gameState.bytes += gameState.productionPerSecond;
    gameState.totalBytesEarned += gameState.productionPerSecond;
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

  // Générer le magasin une fois
  renderShop();
  updateUI();
  updateAchievementsUI();

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


