const PROJECTS = [
  {
    id: "coinflippa",
    title: "Coinflippa",
    showStatusStamp: false,
    year: 2026,
    team: 1,
    duration: "13+ weeks",
    image: "media/coinflippa/coinflippa-preview.webp",
    preview: "media/coinflippa/card-loop.webp",
    description:
      "A 1000-player elimination game built on the simplest game there is: the coin flip. A polished mobile game with a real-time multiplayer stack.",
    tags: ["Unity", "C#", "3D", "Mobile"],
    featured: true,

    detailsUrl: "project.html?id=coinflippa",

    content: {
      summary: [
        // Kept identical to the card `description` above (see Kindling): the card
        // shows the opening, the page lead shows all of it.
        "A 1000-player elimination game built on the simplest game there is: the coin flip. A polished mobile game with a real-time multiplayer stack.",
        "A Unity client talking to a Node.js server over raw WebSockets, wrapped around a single 3D coin that carries the whole visual identity."
      ],
      galleryAspect: "portrait",
      sections: [
        {
          h2: "About",
          p: [
            "The game itself takes a sentence to explain. A lobby fills toward 1000 players, everyone flips at the same time, and every flip is a straight 50/50: no calling heads or tails, no skill, no strategy. Roughly half the field goes out each round, so a full game runs about ten rounds and takes a minute or two. Anyone can win, and surviving ten flips in a row is as absurd as it sounds.",
            "The progression around it is purely visual. Playing pays XP whether you win or not, each level banks a wheelspin, and spins unlock rarity-weighted cosmetics for the coin along four independent axes: its base color, its face shape, and the colors it flashes on a win and on a loss. Nothing is purchasable and no unlock affects the flip."
          ]
        },
        {
          h2: "Background",
          p: [
            "The project ran a little over 375 hours between April and July 2026, self-directed start to finish. Keeping the game itself simple was the point. A coin flip is about the simplest mechanic there is, so the rules cost no design effort and the hours could go into the parts that were new and challenging: real-time multiplayer for up to a thousand concurrent players, shader-heavy visuals kept smooth on mid-range Android, and what polishing to a high standard actually takes. The server stayed deliberately low-level, raw WebSockets rather than a framework, so the networking would be understood rather than abstracted away."
          ]
        },
        {
          h2: "What I Built",
          groups: [
            {
              h3: "Multiplayer & Server",
              ul: [
                "Built the Node.js server on raw WebSockets, with a JSON event protocol covering the whole session and full authority over every flip: no coin result originates on a device.",
                "Designed the round loop around a 10-second flip window. The server rolls every outcome for the round up front, with a guard so a round can never eliminate the entire field, then releases each player's result the moment they commit, auto-flips whoever doesn't, and closes the window early once every survivor is done.",
                "Implemented a lobby manager that spawns lobbies on demand, clusters players into the fullest joinable one, keeps the eliminated in as spectators, and tears a lobby down when its last human leaves.",
                "Handled dropped mobile connections with server-side grace windows and client-side backoff reconnection.",
                "Populated waiting lobbies with bots, tracked as a per-lobby count rather than individual connections, so players are never left waiting on live traffic. Each round's bot eliminations resolve in one binomial draw instead of a flip per bot."
              ]
            },
            {
              h3: "The Coin & Visuals",
              ul: [
                "The coin is one persistent 3D object on a perspective camera, shared across every screen so it carries state through the session and anchors the reward moment. Its mesh is generated procedurally at runtime, and a single custom shader resolves all four customization axes (base color, face shape, win color, lose color) into one coherent surface, carving the equipped shape per fragment instead of swapping assets.",
                "Developed the fullscreen background shader: domain-warped fractal noise with swappable palettes and one-shot trigger effects.",
                "Built the end-of-game XP moment around the coin: a radial ring anchored to its own collider, with sparks sized by the XP earned flying into it."
              ]
            },
            {
              h3: "Progression & Client",
              ul: [
                "Built the XP and leveling economy end to end, then tuned the curve against a simulation harness so the full 40-cosmetic catalog unlocks over roughly 90 games.",
                "Built the customization menu around the coin itself: it is the live preview, and the four axis selectors restyle it in place as the player browses.",
                "Made the spin redeem a multi-phase reveal sequence: it resolves one weighted random un-owned cosmetic from across the four catalogs, builds to the reveal, and leaves the coin already wearing it.",
                "Set up identity without accounts: the server issues a UUID on first launch and holds all progress against it, with no sign-up or login step.",
                "Built the mode select as a coin-edge card carousel: the coin comes forward and carries the per-mode icons in its rim, with the cards paged down the middle of the screen. Building a selection screen for a single playable mode was getting ahead of myself, but a plain list popup would have wasted the one prop the whole game is built around.",
                "Implemented an offline server behind the client's networking seam, speaking the same protocol and simulating a complete game so it demos anywhere with no connection. It keeps a separate profile, since an offline save is untrusted by design."
              ]
            },
          ]
        },
        {
          h2: "Mobile Performance",
          p: [
            "The visuals lean heavily on custom shaders, so the performance work was done on real Android hardware rather than in the editor. An on-device frame-time overlay and a set of live tuning knobs were built first, so every change could be A/B tested where it actually runs, and the frame budget was then traded line by line against measurement instead of intuition. Readings were taken heat-soaked rather than cold, because thermal throttling changes which cost dominates.",
            "The fullscreen background shader is the heaviest thing the game draws, so it took the deepest cuts. It was decoupled from the frame loop entirely: it renders into its own low-resolution target at a fraction of the display's pixels, refreshes every second frame, and is composited back to full resolution by a camera-less blit. The motion is slow and painterly by design, so it absorbs both reductions with minimal visible loss, and on device the difference from full resolution is hard to spot side by side. The rest of the frame is cheap by construction: one 3D coin plus UI.",
            "The largest wins were not where intuition pointed. Replacing the FSR upscaler with plain bilinear gained more than any shader edit. Disabling the physics simulation, which nothing in the game used, removed a recurring frame spike. The coin's engraving lookups were baked offline into a channel map so the shader performs one texture read instead of up to eighteen. Once the background stopped being the bottleneck, post-processing became it, so bloom dropped to quarter resolution and three blur iterations, and render scale now steps down per screen where the coin is small or peripheral, since every render-resolution pass shrinks quadratically with it.",
            "The frame-rate target was the most counterintuitive result. Capping at 60 allowed the device governor to downclock until routine spikes missed vsync, so the shipping default is 120fps on high-refresh panels, where the clocks stay pinned and pacing stays even. The 90fps option was removed outright because the target panels expose only 60 and 120Hz modes, so anything in between presents on an uneven cadence regardless of headroom. The design target remains a 60fps baseline on mid-range hardware, held by trading background fidelity rather than gameplay; on a Galaxy S22 Ultra the build runs at a stable 120."
          ]
        },
      ],
      gallery: [
        { thumb: "media/coinflippa/clip-round.webp", full: "media/coinflippa/clip-round.mp4", still: "media/coinflippa/clip-round-still.webp" },
        { thumb: "media/coinflippa/clip-customize.webp", full: "media/coinflippa/clip-customize.mp4", still: "media/coinflippa/clip-customize-still.webp" },
        { thumb: "media/coinflippa/main-menu-thumb.webp", full: "media/coinflippa/main-menu.webp" },
        { thumb: "media/coinflippa/round-survived-thumb.webp", full: "media/coinflippa/round-survived.webp" },
        { thumb: "media/coinflippa/game-over-thumb.webp", full: "media/coinflippa/game-over.webp" },
        { thumb: "media/coinflippa/customize-thumb.webp", full: "media/coinflippa/customize.webp" }
      ],
      links: {
        itch: "https://ilkkahi.itch.io/coinflippa",
        trailer: "https://www.youtube.com/watch?v=o1o5S7YEmTU"
      }
    }
  },

  {
    id: "kindling",
    title: "Kindling",
    showStatusStamp: false,
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
          groups: [
            {
              h3: "Lantern & Player",
              ul: [
                "Built the Lantern system and its unlockable light modes: orb, cone, and ray.",
                "Built all player and Lantern movement and controls, including keeping the free-floating Lantern from clipping into walls as it orbits the player.",
                "Built all the animation controllers for the Lantern and player (the player's animations were drawn by our artist).",
                "Implemented the gameplay logic for how the light interacts with enemies, the environment, and the player (not the ray's light reflection, which a teammate built).",
                "Built the health system shared by both the player and the enemies."
              ]
            },
            {
              h3: "Cameras & Presentation",
              ul: [
                "Developed a multi-camera cinematic system and cutscenes, orchestrating cameras across the game's areas, transitions between them, and scripted sequences.",
                "Set up the game's post-processing."
              ]
            },
            {
              h3: "Enemies",
              ul: [
                "Heavily optimized the performance of the existing enemy behavior and pathfinding systems ahead of the Bit1 competition.",
                "Improved enemy animation handling and hit detection."
              ]
            },
            {
              h3: "Tooling & Data",
              ul: [
                "Utilized data-driven setups with ScriptableObjects to make balancing and content changes fast.",
                "Added gameplay tooling and debugging helpers to improve testing and iteration speed."
              ]
            },
            {
              h3: "Art",
              ul: [
                "Made some of the game's art: the Lantern's animations (its orbiting health shards and reacting flame), a bigger animated asset for the Kindles, and the custom cursor."
              ]
            }
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
        caption: "The Lantern · animated by me · base sprite by our artist",
        anchor: "art"
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
          groups: [
            {
              h3: "Grid & Interaction",
              ul: [
                "Built the grid system from the ground up: the foundation that character movement and combat actions run on.",
                "Implemented the tile click-interaction system: selecting tiles, confirming moves and actions, and the visual indication of the selected tile."
              ]
            },
            {
              h3: "Camera",
              ul: [
                "Built the camera system and its movements and animations: WASD panning, mouse-wheel zoom and rotation."
              ]
            },
            {
              h3: "Combat UI",
              ul: [
                "Designed and implemented the ability selection UI, and programmed the character portrait UIs used in combat.",
                "Added text animation effects, health bars and damage numbers."
              ]
            },
            {
              h3: "Architecture",
              ul: [
                "Helped plan how parts of the codebase fit together and how the systems I worked on connected to the rest, in a lightweight code lead role."
              ]
            }
          ]
        },
        {
          h2: "Reflection",
          p: [
            "This was my first proper 3D game in Unity, in a genre I had barely played myself, on a team with plenty of differing opinions on design direction. Finding a middle ground everyone could work with was its own exercise, and we still put out a complete, playable prototype.",
            "It was also my first time working alongside a larger art team. With four artists feeding assets into the game, I learned to communicate the technical specifics precisely: giving artists the exact requirements an asset had to meet so it would slot into the project cleanly without complications.",
            "The biggest lesson was the camera. Building it taught me how much up-front planning an intuitive, good-looking camera actually needs. What shipped works well, but it is far from perfect, and I left the project knowing exactly what I would do differently next time."
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
  // Icon + label, same shape as the duration indicator above: the silhouettes
  // alone read as "a team of some size", which the clock beside them never
  // leaves ambiguous about itself.
  if (teamSize === 1) {
    return `<span class="team-indicator team-indicator--solo" title="Solo project">${icon()}<span class="team-label">solo</span></span>`;
  }
  // One glyph, not three overlapping <svg>s in opacity-carrying spans. Visually
  // identical to that old stack (verified by pixel diff: max channel delta 5/255,
  // i.e. antialiasing only) — same three equal-sized figures, same 1/0.45/0.15
  // fade, same overlap — but the offsets now live in the viewBox instead of a
  // margin-left:-4px that any flex change could cancel.
  // Geometry: the old icons were 11x13px boxes on a `0 0 10 12` viewBox, so
  // preserveAspectRatio scaled them by 13/12; a -4px margin on an 11px box put
  // the figures 7px apart, which is 7 / (13/12) = 6.4615 viewBox units.
  const person = `<circle cx="5" cy="3.5" r="2.8"/><path d="M0.5 12 C0.5 8.5 9.5 8.5 9.5 12 Z"/>`;
  const group =
    `<svg class="person-icon person-icon--group" viewBox="0 0 22.9231 12" fill="currentColor" aria-hidden="true">` +
    `<g>${person}</g>` +
    `<g opacity="0.45" transform="translate(6.4615 0)">${person}</g>` +
    `<g opacity="0.15" transform="translate(12.9231 0)">${person}</g>` +
    `</svg>`;
  return `<span class="team-indicator team-indicator--team" title="Team project · ${teamSize} people">${group}<span class="team-label">${teamSize} people</span></span>`;
}
