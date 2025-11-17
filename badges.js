// Page Badges & Achievements pour Code Clicker

const SAVE_KEY = "codeClickerSave_v1";

// Même structure d'achievements que dans script.js
const ACHIEVEMENT_CATALOG = [
  {
    id: "first_click",
    name: "Hello, World",
    description: "Écrire votre première ligne de code.",
  },
  {
    id: "kilobyte_club",
    name: "Kilobyte Club",
    description: "Cumuler 1 000 bytes écrits.",
  },
  {
    id: "megabyte_club",
    name: "Megabyte Club",
    description: "Cumuler 1 000 000 bytes écrits.",
  },
  {
    id: "first_generator",
    name: "On ne code plus seul",
    description: "Acheter votre premier générateur.",
  },
  {
    id: "team_builder",
    name: "Team Builder",
    description: "Posséder 10 générateurs au total.",
  },
  {
    id: "toolbox_full",
    name: "Boîte à outils complète",
    description: "Acheter 5 upgrades de compétences.",
  },
  {
    id: "hyperfocus_used",
    name: "Flow State",
    description: "Activer Hyperfocus au moins une fois.",
  },
  {
    id: "click_master",
    name: "Maître du clic",
    description: "Atteindre au moins 100 Bytes par clic.",
  },
  {
    id: "factory_mode",
    name: "Usine à bytes",
    description: "Atteindre au moins 1 000 Bytes par seconde.",
  },
  {
    id: "offline_grinder",
    name: "Grinder hors-ligne",
    description: "Gagner au moins 50 000 bytes en étant hors-ligne.",
  },
  {
    id: "collectionneur",
    name: "Collectionneur de badges",
    description: "Débloquer au moins 10 achievements.",
  },
  {
    id: "tera_click",
    name: "Frappe Terabit",
    description: "Atteindre 1 000 Bytes par clic.",
  },
  {
    id: "giga_factory",
    name: "Giga Factory",
    description: "Atteindre 10 000 Bytes par seconde.",
  },
  {
    id: "legend_of_code",
    name: "Légende du code",
    description: "Cumuler 1 000 000 000 bytes écrits.",
  },
  {
    id: "army_of_devs",
    name: "Armée de devs",
    description: "Posséder 50 générateurs au total.",
  },
  {
    id: "automation_architect",
    name: "Architecte de l'automatisation",
    description: "Acheter 15 upgrades de compétences.",
  },
  {
    id: "offline_tycoon",
    name: "Magnat hors-ligne",
    description: "Gagner 1 000 000 bytes en étant hors-ligne.",
  },
  {
    id: "hyperfocus_master",
    name: "Maître du Flow",
    description: "Activer Hyperfocus 20 fois.",
  },
  {
    id: "badge_mythic",
    name: "Collection mythique",
    description: "Débloquer 18 achievements.",
  },
];

const BADGE_ICONS = {
  first_click: "💻",
  kilobyte_club: "📦",
  megabyte_club: "🧬",
  first_generator: "👥",
  team_builder: "🧑‍💻",
  toolbox_full: "🧰",
  hyperfocus_used: "⚡",
  click_master: "🖱️",
  factory_mode: "🏭",
  offline_grinder: "🌙",
  collectionneur: "🏆",
  tera_click: "💥",
  giga_factory: "🏗️",
  legend_of_code: "🧠",
  army_of_devs: "👨‍👩‍👧‍👦",
  automation_architect: "🧩",
  offline_tycoon: "🌌",
  hyperfocus_master: "🚀",
  badge_mythic: "💠",
};

function formatNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  if (num % 1 !== 0) return num.toFixed(2);
  return num.toString();
}

function loadBadgesSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur de chargement des badges", err);
    return null;
  }
}

function createBadgeCard(achievement, unlocked) {
  const card = document.createElement("div");
  card.className = "badge-card";
  if (unlocked) card.classList.add("badge-unlocked");

  const icon = document.createElement("div");
  icon.className = "badge-icon";
  icon.textContent = BADGE_ICONS[achievement.id] || "🏅";

  const title = document.createElement("div");
  title.className = "badge-title";
  title.textContent = achievement.name;

  const desc = document.createElement("div");
  desc.className = "badge-desc";
  desc.textContent = achievement.description;

  const status = document.createElement("div");
  status.className = "badge-status";
  status.textContent = unlocked ? "Débloqué" : "Non débloqué";

  card.appendChild(icon);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(status);

  return card;
}

window.addEventListener("DOMContentLoaded", () => {
  const badgeGrid = document.getElementById("badgeGrid");
  const badgeCountEl = document.getElementById("badgeCount");
  const badgeBytesEl = document.getElementById("badgeBytes");
  if (!badgeGrid) return;

  const save = loadBadgesSave() || {};
  const achievements = save.achievements || {};

  let unlockedCount = 0;

  for (const ach of ACHIEVEMENT_CATALOG) {
    const unlocked = !!achievements[ach.id];
    if (unlocked) unlockedCount++;
    badgeGrid.appendChild(createBadgeCard(ach, unlocked));
  }

  if (badgeCountEl) badgeCountEl.textContent = `${unlockedCount} / ${ACHIEVEMENT_CATALOG.length}`;
  if (badgeBytesEl) badgeBytesEl.textContent = formatNumber(save.totalBytesEarned || 0);
});


