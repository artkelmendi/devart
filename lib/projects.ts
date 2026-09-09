export const projects = [
  {
    slug: 'ecoclean',
    name: 'Eco Clean',
    category: 'Frontend engineering',
    sector: 'Industrial services',
    number: '01',
    title: 'Making a service\nsomething you can feel.',
    summary:
      'An industrial services website with a Canvas cleaning interaction, responsive layouts, and coordinated motion.',
    url: 'https://artkelmendi.github.io/ecoclean-v2/',
    image: '/work/ecoclean.webp',
    tone: '#202737',
    technologies: ['Next.js', 'TypeScript', 'React', 'GSAP', 'Canvas'],
    overview:
      'Eco Clean provides industrial laundry and textile care. The website makes an otherwise invisible service tangible, from its process and sector-specific offering to a hands-on cleaning demonstration.',
    challenge:
      'Translate a physical before-and-after action into an interaction that works with a mouse or touch, while keeping the rest of the experience clear and responsive.',
    decisions: [
      {
        title: 'A real interaction layer',
        text: 'The cleaning demonstration uses the Canvas 2D API. A treated version of the image is drawn over the original; pointer strokes remove that surface to reveal the clean image underneath.',
      },
      {
        title: 'State where it belongs',
        text: 'Mutable drawing state lives in React refs. React state handles visible progress and completion feedback, keeping the interactive surface separate from the surrounding interface.',
      },
      {
        title: 'Coordinated presentation',
        text: 'Next.js and TypeScript provide the application structure. GSAP coordinates motion, with dedicated components for the hero, services, process, and interactive demonstration.',
      },
    ],
    flow: [
      'Pointer / touch',
      'Canvas compositing',
      'Progress state',
      'Completion feedback',
    ],
    outcome:
      'A live, responsive website combining service information with a working interactive demonstration.',
    source: 'https://github.com/artkelmendi/ecoclean-v2',
    contribution: 'Website development & interaction engineering',
  },
  {
    slug: 'great-prosperity',
    name: 'Great Prosperity',
    category: 'Web development',
    sector: 'Hospitality supply',
    number: '02',
    title: 'A complex collection.\nA considered experience.',
    summary:
      'A hospitality catalogue with room-based product discovery and context-sensitive hotspots.',
    url: 'https://gphotelsupplies.com/',
    image: '/work/great-prosperity.webp',
    tone: '#9fb7c1',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Responsive UI'],
    overview:
      'Great Prosperity brings hotel furniture, lighting, and room essentials into one collection. The website connects a spatial, editorial introduction with practical catalogue browsing.',
    challenge:
      'Help people explore a broad supply range without making them navigate a dense product grid before they understand what is available.',
    decisions: [
      {
        title: 'Content as structured data',
        text: 'Room scenes are defined with their imagery, captions, image positions, and product hotspots. This lets the same interaction system present different hospitality settings.',
      },
      {
        title: 'Responsive behavior, not just resizing',
        text: 'Hotspots include mobile-specific positions and copy where the composition needs them. Desktop coordinates are not simply squeezed into a narrow screen.',
      },
      {
        title: 'A focused implementation',
        text: 'HTML, CSS, and dedicated JavaScript modules keep page behavior explicit. Scene selection is controlled by the visitor; navigation maintains accessible expanded states.',
      },
    ],
    flow: [
      'Room scene data',
      'Responsive composition',
      'Product hotspot',
      'Relevant collection',
    ],
    outcome:
      'A live catalogue website that connects an editorial hospitality experience with useful product discovery.',
    source: null,
    contribution: 'Website development & responsive interaction',
  },
  {
    slug: 'curri-architect',
    name: 'Curri Architect',
    category: 'Frontend architecture',
    sector: 'Architecture practice',
    number: '03',
    title: 'Space for the work.\nStructure behind it.',
    summary:
      'A bilingual architecture portfolio built around structured project content and dedicated case-study routes.',
    url: 'https://artkelmendi.github.io/curri-architect/',
    image: '/work/curri-architect.webp',
    tone: '#252521',
    technologies: ['Next.js', 'TypeScript', 'React', 'Motion', 'Tailwind CSS'],
    overview:
      'A portfolio for a Prishtina architecture practice, presenting residential, commercial, and cultural work through a distinct visual system and bilingual content.',
    challenge:
      'Give each project its own identity while keeping content, navigation, metadata, and language handling consistent across the site.',
    decisions: [
      {
        title: 'Data-driven project routes',
        text: 'A shared project dataset powers slug-based pages. Static parameters are generated from that dataset, and invalid project slugs resolve to a not-found state.',
      },
      {
        title: 'Metadata follows the content',
        text: 'Project titles and excerpts feed page metadata directly, keeping page presentation and document information aligned.',
      },
      {
        title: 'Presentation separated from routing',
        text: 'Project views receive the selected project and its next neighbor. Route resolution stays separate from the animated client-side presentation.',
      },
    ],
    flow: [
      'Project dataset',
      'Static route',
      'Project view',
      'Adjacent project',
    ],
    outcome:
      'A live bilingual portfolio with dedicated project pages, consistent content structure, and an expressive frontend.',
    source: 'https://github.com/artkelmendi/curri-architect',
    contribution: 'Frontend development & portfolio architecture',
  },
  {
    slug: 'blueberries',
    name: 'Aure Berries',
    category: 'Creative development',
    sector: 'Agriculture & export',
    number: '04',
    title: 'From the ground up.\nWith a little character.',
    summary:
      'A bilingual farm-to-harvest story with scroll-led animation and an interactive location map.',
    url: 'https://artkelmendi.github.io/blueberries/',
    image: '/work/blueberries.webp',
    tone: '#32283e',
    technologies: ['JavaScript', 'GSAP', 'ScrollTrigger', 'Leaflet'],
    overview:
      'Aure Berries introduces a blueberry farm in Pejë, its growing and harvest process, and its wholesale supply. The site balances an expressive brand character with clear information for buyers.',
    challenge:
      'Carry a distinctive visual personality across a long-form story without losing practical product, location, and contact information.',
    decisions: [
      {
        title: 'A focused document architecture',
        text: 'The public implementation is a self-contained HTML experience with JavaScript-driven behavior, keeping the content and its presentation closely connected.',
      },
      {
        title: 'Scroll as a narrative tool',
        text: 'GSAP and ScrollTrigger support the motion system, while Lenis supplies smooth scrolling. Animation provides continuity between the farm, the fruit, and the harvest story.',
      },
      {
        title: 'Location with context',
        text: 'Leaflet provides the interactive mapping layer, connecting the digital story to the farm’s physical location.',
      },
    ],
    flow: [
      'Bilingual content',
      'Scroll timeline',
      'Farm & harvest story',
      'Map & contact',
    ],
    outcome:
      'A live bilingual brand website connecting a distinctive visual story with farm, product, and wholesale information.',
    source: 'https://github.com/artkelmendi/blueberries',
    contribution: 'Website development & creative interaction',
  },
];
export type Project = (typeof projects)[number];
