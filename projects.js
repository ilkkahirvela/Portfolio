const PROJECTS = [
  {
    id: "kindling",
    title: "Kindling",
    year: 2026,
    image: "",
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
        trailer: "https://www.youtube.com/watch?v=5APzuSg-J1g&t=1s"
      }
    }
  },

  {
    id: "viridianland",
    title: "Viridianland",
    year: 2024,
    image: "images/viridianland/viridianland1.webp",
    description:
      "Fast-paced top-down shooter built as a school project. Designed and implemented gameplay + visuals (sound externally sourced).",
    tags: ["Unity", "C#", "2D", "Pixel Art"],
    featured: false,

    detailsUrl: "project.html?id=viridianland",

    content: {
      summary:
        "Fast-paced top-down shooter developed in 6 weeks as a school project. I implemented gameplay + core systems and created the visuals (sound externally sourced).",
      sections: [
        {
          h2: "About",
          p: [
            "Viridianland is a fast-paced top-down shooter developed as a school project within a span of six weeks. Using Unity and C#, I was responsible for implementing gameplay mechanics, visual assets, and core systems. Pixel art was created using Aseprite, while sound was sourced externally to support the fast-paced action.",

            "The project focused on delivering a cohesive, playable game under a tight deadline while showcasing my ability to handle both programming and design."
          ]
        }
      ],
      gallery: [
        "images/viridianland/viridianland2.webp",
        "images/viridianland/viridianland3.webp",
        "images/viridianland/viridianland4.webp"
      ],
      links: {
        itch: "https://ilkkahi.itch.io/viridianland"
        // github: "https://github.com/...",
        // demo: "https://..."
      }
    }
  },

];
