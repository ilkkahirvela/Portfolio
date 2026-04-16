const PROJECTS = [
  {
    id: "kindling",
    title: "Kindling",
    wip: true,
    year: 2026,
    team: 6,
    duration: "10+ weeks",
    image: "images/kindling/kindling-preview.webp",
    description:
      "Systems-driven top-down adventure game built around light-based mechanics and modular gameplay architecture. Developed in Unity as a team project, with a strong focus on scalable systems, technical design, and long-term iteration.",
    tags: ["Unity", "C#", "2D", "Pixel Art"],
    featured: true,

    detailsUrl: "project.html?id=kindling",

    content: {
      summary:
        "Systems-driven top-down adventure game built around light-based mechanics and modular gameplay architecture. Developed in Unity as a team project, with a strong focus on scalable systems, technical design, and long-term iteration.",
      sections: [
        {
          h2: "Overview",
          p:
            "Kindling is a top-down adventure game built around a multi-mode lantern mechanic that interacts with enemies, the environment, and the player. The lantern enables exploration, combat, and puzzle-solving through consistent light-based interactions."
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
            "Implementation of key gameplay systems.",
            "Built the lantern system with multiple light modes and behaviors.",
            "Implemented light-driven interactions affecting enemies, the environment, and the player.",
            "Created a data-driven setup using ScriptableObjects to make balancing and content changes fast.",
            "Developed camera and cutscene systems to support gameplay states and transitions.",
            "Added gameplay tooling and debugging helpers to improve testing and iteration speed."
          ]
        },
        {
          h2: "Technical Focus",
          ul: [
            "Modular and maintainable code structure.",
            "Scalable system design suitable for long-term development.",
            "Clear separation of data and logic for rapid tuning and content iteration."
          ]
        },
        {
          h2: "Closing",
          p:
            "Kindling showcases my approach to building reusable gameplay systems in Unity and collaborating within a multi-disciplinary team. It reflects my focus on technical problem-solving, maintainable architecture, and delivering features that support long-term development."
        }
      ]
      ,
      gallery: [],
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
    order: 2,
    team: 1,
    duration: "~8 weeks",
    image: "images/chessmachine3000/gameplay.webp",
    description:
      "Terminal-based chess engine with a minimax AI opponent. Supports human vs bot and bot vs bot modes with full chess rule coverage.",
    tags: ["C++", "Chess", "AI", "Minimax", "Algorithms"],
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
        "images/chessmachine3000/bot-vs-bot.gif",
        "images/chessmachine3000/settings.webp",
        "images/chessmachine3000/gameplay.webp"
      ],
      links: {
        github: "https://github.com/ilkkahirvela/ChessMachine3000",
        docs: "https://ilkkahirvela.github.io/ChessMachine3000"
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
    image: "images/mazesolver/mazesolver-preview.webp",
    description:
      "Generates and solves mazes in real time, with animated step-by-step visualization and adjustable settings.",
    tags: ["C++", "SFML", "ImGui", "Algorithms", "Visualization"],
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
        "images/mazesolver/maze-solver-demo.gif",
        "images/mazesolver/settings.webp",
        "images/mazesolver/mazesolver-preview.webp"
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
    image: "images/viridianland/preview.webp",
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
        "images/viridianland/main-menu.webp",
        "images/viridianland/gameplay.webp",
        "images/viridianland/pause-menu.webp"
      ],
      links: {
        itch: "https://ilkkahi.itch.io/viridianland"
        // github: "https://github.com/...",
        // demo: "https://..."
      }
    }
  },

];

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
