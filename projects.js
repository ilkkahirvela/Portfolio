const PROJECTS = [
  {
    id: "kindling",
    title: "Kindling",
    wip: true,
    year: 2026,
    team: 6,
    duration: "10+ weeks",
    image: "media/kindling/kindling-preview.webp",
    preview: "media/kindling/clip-ray-puzzle.webp",
    description:
      "Top-down adventure puzzle game about restoring light to a darkened world, made in Unity with a team of six. A finalist in the Bit1 student game competition. A single lantern is your light, your weapon, your health, and your way through every puzzle. I built the Lantern and its light interactions, the player and Lantern movement, and the camera and cutscene systems.",
    tags: ["Unity", "C#", "2D", "Pixel Art"],
    featured: true,

    detailsUrl: "project.html?id=kindling",

    content: {
      summary: [
        "Top-down adventure puzzle game about restoring light to a darkened world, made in Unity with a team of six. A finalist in the Bit1 student game competition.",
        "A single lantern is your light, your weapon, your health, and your way through every puzzle. I built the Lantern and its light interactions, the player and Lantern movement, and the camera and cutscene systems."
      ],
      sections: [
        {
          h2: "About",
          p: [
            "Carrying a Lantern, the player brings a darkened world back to life by lighting up Kindles: beacons that restore the surroundings, upgrade the Lantern's abilities, and double as respawn and healing points.",
            "The Lantern starts as an orb of light around the player and condenses into a cone, then a ray, as it upgrades, extending its reach and strengthening its light. It is also the player's health: shards orbiting the Lantern and the color it casts show what's left, and running dry sends the player back to the last activated Kindle."
          ]
        },
        {
          h2: "Background",
          p: [
            "Kindling started as a course project: six people over eight weeks. Three of the programmers, myself included, then continued it part-time for the Bit1 Student Video Game Competition, where it reached the finals.",
            "Development is currently on hiatus, with the demo standing as a portfolio piece for the team."
          ]
        },
        {
          h2: "Team",
          ul: [
            "Team size: 6",
            "Programmers: 4",
            "2D Artist: 1",
            "Audio / Music: 1"
          ]
        },
        {
          h2: "My Role & Contributions",
          ul: [
            "Built the Lantern system with its upgradeable light modes: orb, cone, and ray.",
            "Built all player and Lantern movement and controls, including keeping the free-floating Lantern from clipping into walls as it orbits the player.",
            "Implemented the gameplay logic for how the light interacts with enemies, the environment, and the player.",
            "Built the health system shared by both the player and the enemies.",
            "Heavily optimized the performance of the existing enemy behavior and pathfinding systems ahead of the Bit1 competition.",
            "Improved enemy animation handling and hit detection.",
            "Utilized data-driven setups with ScriptableObjects to make balancing and content changes fast.",
            "Developed a multi-camera cinematic system and cutscenes, orchestrating cameras across the game's areas, transitions between them, and scripted sequences.",
            "Set up the game's post-processing.",
            "Added gameplay tooling and debugging helpers to improve testing and iteration speed.",
            "Also made some of the art: the spinning health shards that orbit the Lantern, a bigger, animated asset for the Kindles, and the custom cursor."
          ]
        },
        {
          h2: "Reflection",
          p: [
            "Kindling is where component-based design really clicked for me. With four programmers in the same codebase, systems had to be modular to survive: small components with clear responsibilities, and data kept separate from logic so balancing changes didn't always mean touching code. More than anything, it shaped how I write code that a teammate, or a future me, can pick up and extend.",
            "Kindling also taught me a lot outside my main role: how 2D layers, perspective, lighting, and shadows come together."
          ]
        }
      ],
      gallery: [
        { thumb: "media/kindling/clip-bloom.webp", full: "media/kindling/clip-bloom.mp4", still: "media/kindling/clip-bloom-still.webp" },
        { thumb: "media/kindling/clip-ray-puzzle.webp", full: "media/kindling/clip-ray-puzzle.mp4", still: "media/kindling/clip-ray-puzzle-still.webp" },
        { thumb: "media/kindling/ruins-kindle-thumb.webp", full: "media/kindling/ruins-kindle.webp" },
        { thumb: "media/kindling/ray-puzzle-thumb.webp", full: "media/kindling/ray-puzzle.webp" },
        { thumb: "media/kindling/restored-thumb.webp", full: "media/kindling/restored.webp" },
        { thumb: "media/kindling/encounter-thumb.webp", full: "media/kindling/encounter.webp" }
      ],
      award: {
        image: "media/kindling/bit1-finalist-white.webp",
        alt: "Bit1 Student Video Game Competition Finalist 2026"
      },
      pixelArt: {
        src: "media/kindling/lantern.webp",
        still: "media/kindling/lantern-still.webp",
        alt: "Animated pixel-art Lantern sprite",
        caption: "The Lantern, animated by me in Aseprite (base sprite by our artist)."
      },
      links: {
        itch: "https://ilkkahi.itch.io/kindling",
        trailer: "https://www.youtube.com/watch?v=UE9aJpK1Qm0"
      }
    }
  },

  {
    id: "chessmachine3000",
    title: "ChessMachine3000",
    year: 2025,
    order: 3,
    team: 1,
    duration: "~8 weeks",
    image: "media/chessmachine3000/gameplay.webp",
    preview: "media/chessmachine3000/bot-vs-bot.webp",
    description:
      "Terminal-based chess engine with a minimax AI opponent. Supports human vs bot and bot vs bot modes with full chess rule coverage.",
    tags: ["C++", "Algorithms"],
    featured: false,

    detailsUrl: "project.html?id=chessmachine3000",

    content: {
      summary:
        "A solo C++ project. A terminal-based chess engine featuring a minimax AI with alpha-beta pruning. Supports human vs bot and bot vs bot modes with full chess rule coverage.",
      sections: [
        {
          h2: "About",
          p: [
            "ChessMachine3000 is a terminal-based chess engine built in C++. Players can compete against an AI opponent or watch two bots play each other. The board is rendered in the terminal with colored output and move highlighting.",
            "The AI uses iterative deepening minimax with alpha-beta pruning and parallel root-level search, with move ordering that prioritizes captures and promotions for more efficient pruning."
          ]
        },
        {
          h2: "Background",
          p: "Built for a data structures and algorithms course, where implementing a chess engine was the set task. After the course, additional work went into polishing the engine and making it more presentable."
        },
        {
          h2: "Features",
          ul: [
            "Human vs Bot and Bot vs Bot gameplay modes.",
            "Colored terminal board with move highlighting.",
            "Adjustable AI think time (1–5 seconds).",
            "Full chess rule support: castling, en passant, promotion, 50-move rule, threefold repetition.",
            "Material balance and check status display."
          ]
        },
        {
          h2: "AI Engine",
          p: [
            "The engine uses iterative deepening minimax with alpha-beta pruning. Rather than searching to a fixed depth, it deepens incrementally, completing a full search at each depth before going one level deeper. This means the best move found so far is always available, and the think time can be cut off cleanly at any point.",
            "At the root level, moves are searched in parallel to make better use of available CPU cores. Below the root, move ordering prioritizes captures and promotions, which improves alpha-beta pruning efficiency by increasing the chance of early cutoffs in the sequential search."
          ]
        },
        {
          h2: "Tech Stack",
          ul: [
            "C++",
            "Visual Studio 2022"
          ]
        }
      ],
      gallery: [
        { full: "media/chessmachine3000/bot-vs-bot.webp", still: "media/chessmachine3000/bot-vs-bot-still.webp" },
        "media/chessmachine3000/settings.webp",
        "media/chessmachine3000/gameplay.webp"
      ],
      links: {
        github: "https://github.com/ilkkahirvela/ChessMachine3000",
        docs: "https://ilkkahirvela.github.io/ChessMachine3000"
      }
    }
  },

  {
    id: "y2kentity",
    title: "y2k: Entity",
    year: 2025,
    order: 2,
    team: 9,
    duration: "~8 weeks",
    image: "media/y2kentity/y2kentity-preview.webp",
    preview: "media/y2kentity/clip-purple.webp",
    description:
      "Turn-based tactics RPG made in Unity as a student team project. I built the grid foundation, the camera system, and the combat UI.",
    tags: ["Unity", "C#", "3D"],
    featured: false,

    detailsUrl: "project.html?id=y2kentity",

    content: {
      summary:
        "A turn-based tactics RPG and my first proper Unity 3D game. I built the grid system the gameplay runs on, the camera system, and most of the combat-facing UI.",
      sections: [
        {
          h2: "About",
          p:
            "y2k: Entity is a turn-based tactics RPG made in Unity over eight weeks, inspired by classics like Final Fantasy Tactics and Fire Emblem. Battles play out on a grid: you pick classes for your squad, move the characters across the board one turn at a time, and try to outsmart the enemy with positioning and abilities. Between battles, the story moves forward through dialogue scenes."
        },
        {
          h2: "Team",
          ul: [
            "Team size: 9",
            "Programmers: 4",
            "Artists: 4",
            "Music: 1",
            "A collaboration between Metropolia University of Applied Sciences and Stadin AO."
          ]
        },
        {
          h2: "My Role & Contributions",
          ul: [
            "Built the grid system from the ground up: the foundation that character movement and combat actions run on.",
            "Built the camera system and its movements and animations: WASD panning, mouse-wheel zoom and rotation.",
            "Implemented the tile click-interaction system: selecting tiles, confirming moves and actions, and the visual indication of the selected tile.",
            "Designed and implemented the ability selection UI, and programmed the character portrait UIs used in combat.",
            "Added text animation effects, health bars and damage numbers.",
            "Planned the overall code structure and how the game's systems fit together, in a lightweight code lead role."
          ]
        },
        {
          h2: "Reflection",
          p: [
            "This was my first proper 3D game in Unity, in a genre I had barely played myself, on a team with plenty of differing opinions on design direction. Finding a middle ground everyone could work with was its own exercise, and we still put out a complete, playable prototype.",
            "The biggest lesson was the camera. Building it taught me a lot about how camera systems work, and about the amount of up-front planning an intuitive, good-looking camera actually needs."
          ]
        }
      ],
      gallery: [
        { thumb: "media/y2kentity/clip-purple.webp", full: "media/y2kentity/clip-purple.mp4", still: "media/y2kentity/clip-purple-still.webp" },
        { thumb: "media/y2kentity/clip-forest.webp", full: "media/y2kentity/clip-forest.mp4", still: "media/y2kentity/clip-forest-still.webp" },
        { thumb: "media/y2kentity/targeting-ui-thumb.webp", full: "media/y2kentity/targeting-ui.webp" },
        { thumb: "media/y2kentity/ability-menu-thumb.webp", full: "media/y2kentity/ability-menu.webp" },
        { thumb: "media/y2kentity/gameplay-thumb.webp", full: "media/y2kentity/gameplay.webp" }
      ],
      links: {
        itch: "https://ssntr.itch.io/y2k-entity",
        trailer: "https://www.youtube.com/watch?v=InvGdTT-758"
      }
    }
  },

  {
    id: "mazesolver",
    title: "Maze Solver",
    year: 2025,
    order: 1,
    team: 1,
    duration: "~1 week",
    image: "media/mazesolver/mazesolver-preview.webp",
    preview: "media/mazesolver/maze-solver-demo.webp",
    description:
      "Generates and solves mazes in real time, with animated step-by-step visualization and adjustable settings.",
    tags: ["C++", "SFML", "ImGui", "Algorithms"],
    featured: false,

    detailsUrl: "project.html?id=mazesolver",

    content: {
      summary:
        "A solo C++ project. Generates mazes and solves them with animated step-by-step visualization, showing the shortest path in real time.",
      sections: [
        {
          h2: "About",
          p: [
            "A solo project built in C++. MazeSolver generates mazes and solves them with real-time animated visualization. Mazes are generated using recursive backtracking and solved with breadth-first search, which guarantees the shortest possible path.",
            "Users can configure the maze size and animation speed before generation."
          ]
        },
        {
          h2: "Features",
          ul: [
            "Maze generation using recursive backtracking.",
            "Pathfinding with BFS, guaranteeing the shortest path.",
            "Real-time step-by-step animation.",
            "Separated rendering layers for performance.",
            "Resolution-aware scaling."
          ]
        },
        {
          h2: "Background",
          p: "Built as an exercise in working with external libraries in C++. The algorithms and visualization gave it purpose, but the main goal was getting comfortable integrating unfamiliar tools."
        },
        {
          h2: "Tech Stack",
          ul: [
            "C++17",
            "SFML 3.0",
            "Dear ImGui + ImGui-SFML"
          ]
        }
      ],
      gallery: [
        { full: "media/mazesolver/maze-solver-demo.webp", still: "media/mazesolver/maze-solver-demo-still.webp" },
        "media/mazesolver/settings.webp",
        "media/mazesolver/mazesolver-preview.webp"
      ],
      links: {
        github: "https://github.com/ilkkahirvela/MazeSolver-SFML",
        docs: "https://ilkkahirvela.github.io/MazeSolver-SFML/"
      }
    }
  },

  {
    id: "viridianland",
    title: "Viridianland",
    year: 2024,
    team: 1,
    duration: "~6 weeks",
    image: "media/viridianland/preview.webp",
    preview: "media/viridianland/clip-gameplay.webp",
    description:
      "Top-down shooter built in Unity over six weeks. My first game in the engine, covering gameplay systems and pixel art from scratch.",
    tags: ["Unity", "C#", "2D", "Pixel Art"],
    featured: false,

    detailsUrl: "project.html?id=viridianland",

    content: {
      summary:
        "A top-down shooter made solo over six weeks as a school project and my first Unity game. I handled everything from gameplay systems and pixel art to building the audio system, learning the engine while delivering something complete under a real deadline.",
      sections: [
        {
          h2: "About",
          p: [
            "Viridianland spans three levels, each with a unique music track and a target elimination count required to progress. Two enemy types populate each level: a melee variant that closes in to deal damage, and a ranged type that attacks from a distance.",
          ]
        },
        {
          h2: "Systems",
          p: [
            "The item drop system rewards enemy kills with heal and weapon pickups, with drop rates varying per level. Two weapons are available as pickups, one being a straight upgrade over the starting gun. Grabbing either also reloads your magazine instantly, giving the pickup a secondary tactical use.",

            "The audio system handles per-level music tracks and individual sound effects for weapons and pickups.",

            "All visual assets were hand-made in Aseprite, font aside. Working out what art was actually needed, how to organize it, and getting used to sprite sheet animations was a meaningful part of the process."
          ]
        },
        {
          h2: "Reflection",
          p: [
            "Learning the engine's 2D fundamentals while shipping a finished product taught me a lot about time management and scoping. A few UI elements and a planned endless mode were cut to meet the deadline. Given six weeks and where my skills were at the time, the scope ended up being about right."
          ]
        }
      ],
      gallery: [
        { thumb: "media/viridianland/clip-gameplay.webp", full: "media/viridianland/clip-gameplay.mp4", still: "media/viridianland/clip-gameplay-still.webp" },
        { thumb: "media/viridianland/main-menu-thumb.webp", full: "media/viridianland/main-menu.webp" },
        { thumb: "media/viridianland/gameplay-thumb.webp", full: "media/viridianland/gameplay.webp" },
        { thumb: "media/viridianland/pause-menu-thumb.webp", full: "media/viridianland/pause-menu.webp" }
      ],
      links: {
        itch: "https://ilkkahi.itch.io/viridianland",
        itchPlayable: true
      }
    }
  },

];

// ============================
// Shared helpers
// ============================

// Canonical display order: featured first, then non-WIP before WIP,
// then newest, then manual order. Used by the level strip AND the
// project page (for stable WORLD numbering).
function sortedProjects(list = PROJECTS) {
  return [...list].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    const aw = a.wip ? 1 : 0;
    const bw = b.wip ? 1 : 0;
    if (aw !== bw) return aw - bw;
    const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0);
    if (yearDiff !== 0) return yearDiff;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

// ============================
// Shared UI builders
// ============================

function buildDurationIndicator(duration) {
  if (duration == null) return "";
  const svg = `<svg class="clock-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="6" r="5"/><polyline points="6,3 6,6 8,7.5"/></svg>`;
  return `<span class="duration-indicator" title="${duration}">${svg}<span class="duration-label">${duration}</span></span>`;
}

function buildTeamIndicator(teamSize) {
  if (teamSize == null) return "";
  const icon = (extraClass = "") =>
    `<svg class="person-icon${extraClass}" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><circle cx="5" cy="3.5" r="2.8"/><path d="M0.5 12 C0.5 8.5 9.5 8.5 9.5 12 Z"/></svg>`;
  if (teamSize === 1) {
    return `<span class="team-indicator team-indicator--solo" title="Solo project">${icon()}</span>`;
  }
  const icons = [1, 0.45, 0.15].map((op, i) =>
    `<span style="opacity:${op};line-height:0">${icon(i ? " person-icon--stack" : "")}</span>`
  ).join("");
  return `<span class="team-indicator team-indicator--team" title="Team project · ${teamSize} people">${icons}</span>`;
}
