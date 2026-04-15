import { UserStats, ActionLog, Mission, EducationModule } from './types';

export const INITIAL_USER_STATS: UserStats = {
  xp: 0,
  level: 1,
  co2Saved: 0,
  streak: 0,
  badges: [],
  completedModules: [],
  completedMissions: []
};

export const RECENT_LOGS: ActionLog[] = [];

export const MISSIONS: Mission[] = [
  { id: 'm1', title: 'Plastic-Free Week', description: 'Avoid single-use plastics for 7 days.', rewardXP: 500, completed: false, type: 'weekly' },
  { id: 'm2', title: 'Zero Waste Day', description: 'Produce no landfill trash today.', rewardXP: 200, completed: false, type: 'daily' },
  { id: 'm3', title: 'Save 10 Litres', description: 'Take a shorter shower or fix a leak.', rewardXP: 100, completed: false, type: 'daily' },
  { id: 'm4', title: 'Plant a Tree', description: 'Plant a local species or donate to a planting org.', rewardXP: 1000, completed: false, type: 'weekly' },
  { id: 'm5', title: 'Composting Pro', description: 'Start a compost bin for your food scraps.', rewardXP: 400, completed: false, type: 'weekly' },
  { id: 'm6', title: 'Meat-free Monday', description: 'Go entirely meat-free for 24 hours.', rewardXP: 150, completed: false, type: 'daily' },
];

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'e1',
    title: 'The Greenhouse Effect',
    description: 'Understand how gases trap heat.',
    readTime: '3 min',
    category: 'Climate',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/SN5-Da76vLg',
    fact: 'The primary greenhouse gases in Earth\'s atmosphere are water vapor, carbon dioxide, methane, nitrous oxide, and ozone.',
    content: `
      **What is it?**
      Imagine Earth wrapped in a blanket. Sunlight hits the Earth, warms it up, and then that heat tries to escape back into space. Greenhouse gases (like CO2 and Methane) act like that blanket.

      **The Problem:**
      We are making the blanket too thick! Burning fossil fuels adds massive amounts of CO2. This leads to global warming, melting ice caps, and extreme weather.

      **Key Takeaway:**
      It's not that the greenhouse effect is "bad" (we need it to survive!), but we are supercharging it way beyond natural levels.
    `
  },
  {
    id: 'e2',
    title: 'Ocean Acidification',
    description: 'Why our oceans are changing pH.',
    readTime: '5 min',
    category: 'Climate',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/fgBozLCGUHY',
    fact: 'The ocean has absorbed about 525 billion tons of CO2 since the beginning of the Industrial Revolution.',
    content: `
      **The Evil Twin of Climate Change**
      While global warming gets all the attention, ocean acidification is just as scary. The ocean absorbs about 30% of the CO2 we release.

      **The Chemistry:**
      When CO2 dissolves in seawater, it forms carbonic acid. This lowers the pH of the ocean, making it more acidic.

      **Why it matters:**
      Shellfish, coral, and plankton rely on carbonate ions to build their shells. Acidic water steals these ions, causing shells to dissolve. This threatens the entire marine food web!
    `
  },
  {
    id: 'e3',
    title: 'Recycling 101',
    description: 'What actually happens to your plastic?',
    readTime: '4 min',
    category: 'Waste',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/6jQ7y_qQYUA',
    fact: 'Glass and aluminum can be recycled infinitely without losing quality.',
    content: `
      **The Hard Truth**
      Only about 9% of plastic ever produced has been recycled. Most ends up in landfills.

      **Wish-cycling:**
      This is when you throw something in the bin *hoping* it's recyclable (like a greasy pizza box). This contaminates the batch!

      **Rule of Thumb:**
      1. **Reduce** first (buy less).
      2. **Reuse** second (jars, bags).
      3. **Recycle** last.
    `
  },
  {
    id: 'e4',
    title: 'Renewable Energy',
    description: 'Solar, Wind, and Hydro explained.',
    readTime: '6 min',
    category: 'Energy',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/Gliez879f-4',
    fact: 'Solar energy is the most abundant energy resource on earth - 173,000 terawatts of solar energy strike the Earth continuously.',
    content: `
      **Solar Power ☀️**
      Photovoltaic cells convert sunlight directly into electricity. Costs have dropped 89%!

      **Wind Power 🌬️**
      Turbines capture kinetic energy from wind. One rotation can power a home for a day.

      **The Grid Challenge:**
      The sun doesn't always shine. That's why we need better **battery storage** and a "smart grid".
    `
  },
  {
      id: 'e5',
      title: 'Sustainable Fashion',
      description: 'The hidden cost of fast fashion.',
      readTime: '5 min',
      category: 'Waste',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/ZoiU8rqp9tk',
      fact: 'It takes 700 gallons of water to produce one cotton shirt.',
      content: `
        **The High Cost of Cheap Clothing**
        Fast fashion is responsible for 10% of global carbon emissions—more than all international flights and maritime shipping combined!

        **Water Waste:**
        It takes **2,700 liters of water** to make one cotton t-shirt. That's enough for one person to drink for 2.5 years.

        **What you can do:**
        1. **Buy less** and choose quality over quantity.
        2. **Thrift** and buy second-hand.
        3. **Repair** your clothes instead of throwing them away.
      `
  },
  {
      id: 'e6',
      title: 'The Problem with E-Waste',
      description: 'Where do your old gadgets go?',
      readTime: '4 min',
      category: 'Waste',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/I7AnXvN5o1I',
      fact: 'For every million mobile phones that are recycled, 35,274 lbs of copper and 772 lbs of silver can be recovered.',
      content: `
        **Gold in your Garbage**
        Electronic waste (e-waste) is the fastest-growing waste stream in the world. Old phones and laptops contain precious metals like gold, silver, and copper.

        **Toxic Leaks:**
        When e-waste is dumped, toxic chemicals like lead and mercury can leak into the ground, poisoning water and soil.

        **Circular Solution:**
        Don't throw them in the trash! Look for certified e-waste recycling centers that "mine" these metals from old gadgets to make new ones.
      `
  },
  {
      id: 'e7',
      title: 'Regenerative Farming',
      description: 'Healing the soil to save the planet.',
      readTime: '6 min',
      category: 'Climate',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/6vQW7ZInBfU',
      fact: 'A 1% increase in soil organic matter allows an acre of land to hold an additional 20,000 gallons of water.',
      content: `
        **Beyond Sustainability**
        Sustainability is about maintaining; regeneration is about **improving**. Regenerative agriculture focuses on restoring soil health.

        **Carbon Sequestration:**
        Healthy soil can act as a massive carbon sink, pulling CO2 out of the atmosphere and storing it in the ground.

        **Key Practices:**
        - **No-till farming**: Don't disturb the soil.
        - **Cover crops**: Keep the soil covered year-round.
        - **Diversity**: Rotate many types of crops.
      `
  },
  {
      id: 'e8',
      title: 'Microplastics Everywhere',
      description: 'How small bits of plastic enter our food.',
      readTime: '5 min',
      category: 'Waste',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/aiEab9pY-zE',
      fact: 'An average person might be eating 5 grams of plastic every week - that\'s the weight of a credit card.',
      content: `
        **The Invisible Threat**
        Microplastics are tiny pieces of plastic less than 5mm long. They come from breaking down large items or even from your synthetic clothes in the laundry.

        **The Food Chain:**
        Plankton eat microplastics, fish eat plankton, and we eat the fish. We are literally eating plastic!

        **Reduction Tips:**
        - Use a **laundry filter** for synthetic clothes.
        - Avoid single-use plastics.
        - Choose natural fabrics like cotton or wool.
      `
  },
  {
      id: 'e9',
      title: 'The Circular Economy',
      description: 'Designing out waste and pollution.',
      readTime: '7 min',
      category: 'Waste',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/zCRKvDyyHmI',
      fact: 'Only 8.6% of the world is currently circular, meaning over 90% of resources are being wasted.',
      content: `
        **Linear vs Circular**
        Our current "Linear" economy is **Take -> Make -> Waste**. A "Circular" economy aims to keep products and materials in use forever.

        **The 3 Principles:**
        1. Design out waste and pollution.
        2. Keep products and materials in use.
        3. Regenerate natural systems.

        **Example:**
        Instead of buying a lightbulb, imagine a service where you pay for "light," and the company retains ownership of the bulbs, ensuring they are repaired and recycled.
      `
  },
  {
      id: 'e10',
      title: 'Green Building Design',
      description: 'Buildings that breathe and save.',
      readTime: '6 min',
      category: 'Energy',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/j_1vV6OitXg',
      fact: 'A large oak tree can provide the cooling effect of 10 room-size air conditioners operating 20 hours a day.',
      content: `
        **Passive House Standard**
        Buildings consume 40% of global energy. Passive houses use smart design to maintain comfort with almost zero heating or cooling.

        **Key Features:**
        - **High Insulation**: Like a high-quality thermos.
        - **Airtightness**: Prevents heat loss through gaps.
        - **Solar Orientation**: Uses the sun for heat in winter.

        **Nature-Based:**
        Vertical gardens and "green roofs" help cool buildings and provide habitats for urban wildlife.
      `
  },
  {
      id: 'e11',
      title: 'The Paris Agreement',
      description: 'International goals for a cooler Earth.',
      readTime: '5 min',
      category: 'Climate',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/5GvY79_R08A',
      fact: 'The Paris Agreement is the first-ever universal, legally binding global climate change agreement.',
      content: `
        **The 1.5°C Goal**
        In 2015, 196 parties agreed to limit global warming to well below 2°C, preferably to **1.5°C**, compared to pre-industrial levels.

        **Nationally Determined Contributions (NDCs):**
        Each country sets its own targets for reducing emissions.

        **Why 1.5 Matters:**
        Every fraction of a degree saves millions of people from extreme heat, floods, and poverty. It's the difference between a struggling planet and a thriving one.
      `
  },
  {
      id: 'e12',
      title: 'Electric Vehicles (EVs)',
      description: 'Are they truly better for Earth?',
      readTime: '6 min',
      category: 'Energy',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/1vR2VpP9K-M',
      fact: 'The first electric carriage was built by Robert Anderson in Scotland around 1832.',
      content: `
        **Efficiency over Combustion**
        Standard cars waste 80% of their energy as heat. EVs convert over 85% of their energy into motion.

        **The Battery Debate:**
        Mining lithium and cobalt has environmental costs, but over its lifetime, an EV produces significantly less CO2 than a gas car, even if powered by coal.

        **The Future:**
        As the electrical grid gets greener (more solar/wind), EVs get cleaner every single day!
      `
  },
  {
      id: 'e13',
      title: 'Rewilding Nature',
      description: 'Letting nature lead the way.',
      readTime: '5 min',
      category: 'Climate',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/8rZzHkpy_Uo',
      fact: 'Restoring seagrass, salt marshes, and mangroves could account for up to 14% of the carbon mitigation needed by 2050.',
      content: `
        **Natural Climate Solutions**
        Rewilding is about restoring natural processes and letting ecosystems manage themselves.

        **Keystone Species:**
        Reintroducing wolves to Yellowstone or beavers to the UK restored entire river systems and increased biodiversity.

        **Trophic Cascades:**
        One change at the top of the food chain can cause a positive ripple effect all the way to the plants and soil.
      `
  },
  {
      id: 'e14',
      title: 'Composting at Home',
      description: 'Turning scraps into black gold.',
      readTime: '4 min',
      category: 'Waste',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/M1k8vH-l0I4',
      fact: 'Composting can divert as much as 30% of household waste from the garbage can.',
      content: `
        **Waste is a Resource**
        When food scraps rot in a landfill, they produce **Methane**, a greenhouse gas 25x more powerful than CO2.

        **The Recipe:**
        - **Greens**: Food scraps, grass (Nitrogen).
        - **Browns**: Leaves, cardboard, paper (Carbon).
        - **Air & Water**: Keep it damp and aerated.

        **The Result:**
        Rich, dark soil that saves you money and helps your plants thrive!
      `
  },
  {
      id: 'e15',
      title: 'Air Pollution & Health',
      description: 'Understanding PM2.5 and your lungs.',
      readTime: '5 min',
      category: 'Climate',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/7X87_S1W_t0',
      fact: 'Air pollution is the second leading cause of noncommunicable disease deaths, after tobacco.',
      content: `
        **Small but Deadly**
        PM2.5 particles are less than 2.5 micrometers wide—small enough to enter your bloodstream from your lungs.

        **Sources:**
        Vehicle exhaust, industrial smoke, and wildfires are the leading causes.

        **The Link:**
        Climate change creates longer wildfire seasons and stagnant air, making air pollution more frequent and dangerous for everyone.
      `
  }
];