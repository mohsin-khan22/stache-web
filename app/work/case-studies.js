// Copy and imagery for the case study pages (/work/<slug>), lifted from the
// standalone HTML exports. Every study shares one layout (CaseStudy), so
// everything that differs between them lives here. Images were embedded as
// base64 in the exports and now sit in assets/images/<slug>-*.jpg.
//
// hero holds the full-bleed picture plus the crop (pos / posMobile) and title
// sizes (title / titleMobile, one per line) each export tuned by hand.
// facts are [label, text] rows; the first spans the full width.
//
// Optional sections — a study renders only the ones it has:
//   strip.variant     'one' | 'two' | 'three' (default: three-up, first image full width on phones)
//   story.formats     pills under the tag; story.bigword replaces story.image
//   crew              photo section; layout 'one' | 'pair' (default: wide + tall)
//   pillars           numbered cards, [title, body, kicker?]; variant 'two' for two long cards
const img = (slug, name) => `/assets/images/${slug}-${name}.jpg`;

export const CASE_STUDIES = {
  nsti: {
    slug: 'nsti',
    title: 'NSTI Festival UAE Case Study | Government Digital Launch Campaign Dubai',
    description:
      'How Stache DXB Media delivered full-scale content, social and PR coverage for the National Science Technology and Innovation Festival — STEM festival marketing UAE and education sector marketing Dubai for the UAE Ministry of Education.',
    sector: 'Government & public sector',
    heading: 'NSTI Festival UAE — National Science Technology and Innovation Festival',
    lines: ['NSTI', 'Festival'],
    facts: [
      ['Client', 'UAE Ministry of Education — National Science, Technology and Innovation Festival'],
      ['Scope', 'Digital Launch, Social Media, PR Coverage, Performance Marketing'],
      ['Delivered', 'Designs, real-time posts, press coverage, highlight videos and recap content'],
    ],
    hero: {
      src: img('nsti', 'hero'),
      alt: 'Speaker on stage at the NSTI Festival in front of the Ministry of Education screen – government digital launch campaign Dubai by Stache DXB Media',
      pos: '60% 50%',
      posMobile: '70% 50%',
      title: ['clamp(3rem,15.50vw,12rem)', 'clamp(2rem,7.75vw,6.2rem)'],
      titleMobile: ['29.50vw', '14.75vw'],
    },
    strip: {
      items: [
        { src: img('nsti', 'strip-1'), alt: 'NSTI Festival campaign key visual for the UAE Ministry of Education – STEM festival marketing UAE' },
        { src: img('nsti', 'strip-2'), alt: 'Live science show at the NSTI Festival with a young volunteer – education sector marketing Dubai' },
        { src: img('nsti', 'strip-3'), alt: 'Student at a hands-on NSTI Festival activity – National Science Technology and Innovation Festival content' },
      ],
    },
    spread: {
      name: 'NSTI Festival',
      client: 'UAE Ministry of Education',
      body: [
        'Stache DXB Media delivered full-scale content and PR coverage across the multi-week NSTI Festival UAE — the National Science Technology and Innovation Festival — from pre-event announcements to daily agenda and timing updates, through to highlight videos capturing the event’s biggest moments.',
        'As a government digital launch campaign in Dubai, we handled the complete visual, social, and PR output: designs, real-time posts, press coverage, and recap content that kept audiences informed throughout.',
      ],
    },
    flow: {
      heading: 'From first post to final recap',
      intro: 'Every stage of the multi-week festival had content built for it.',
      steps: [
        ['Pre-event announcements', 'Building awareness before the doors opened.'],
        ['Daily agenda & timing', 'Keeping audiences updated on what was on, and when.'],
        ['Real-time posts', 'Designs and social coverage published as it happened.'],
        ['Press coverage', 'PR output that carried the festival beyond social.'],
        ['Highlights & recap', 'Videos capturing the event’s biggest moments.'],
      ],
    },
    story: {
      tag: { n: '360°', w: ['Visual,', 'social', '& PR'] },
      image: {
        src: img('nsti', 'story'),
        alt: 'On site at the NSTI Festival grounds – government digital launch campaign Dubai by Stache DXB Media',
      },
      client: 'UAE Ministry of Education',
      challenge: 'Keep audiences informed and engaged across a multi-week national festival — before, during and after the event.',
      did: [
        'Ran pre-event announcements and daily agenda and timing updates',
        'Handled the complete visual, social, and PR output: designs, real-time posts and press coverage',
        'Produced highlight videos and recap content capturing the event’s biggest moments',
      ],
      result:
        'A model of STEM festival marketing UAE and education sector marketing Dubai, backed by performance marketing government UAE that gave the festival a lasting presence well after it wrapped.',
    },
    crew: {
      heading: ['The crew', 'on the ground'],
      intro: 'Our media team covered the festival on site, from the first announcement through to the final recap.',
      photos: [
        { src: img('nsti', 'crew-wide'), alt: 'Stache DXB Media production team outside the NSTI Festival venue at night', shape: 'wide' },
        { src: img('nsti', 'crew-tall'), alt: 'Stache DXB Media crew celebrating the wrap of NSTI Festival coverage', shape: 'tall' },
      ],
    },
    band: {
      line: 'A lasting presence well after it wrapped.',
      small: 'Content, press and recap videos that kept the National Science Technology and Innovation Festival in the conversation long after the final day.',
    },
  },

  omnipod: {
    slug: 'omnipod',
    title: 'Omnipod UAE Marketing Case Study | Healthcare Video Campaign Dubai',
    description:
      'How Stache DXB Media produced Omnipod’s UAE video campaign in five days — diabetes technology marketing UAE and medtech lifestyle content Dubai, recognized by Omnipod’s global headquarters.',
    sector: 'Healthcare & medtech',
    heading: 'Omnipod UAE marketing campaign — healthcare video production Dubai',
    lines: ['Omnipod', 'Campaign'],
    facts: [
      ['Client', 'Omnipod — UAE'],
      ['Scope', 'Video Campaign Production, Healthcare Social Media Management'],
      ['Delivered', 'A five-day production, managed from shoot to final cut'],
    ],
    hero: {
      src: img('omnipod', 'hero'),
      alt: 'Mother and two children wearing Omnipod pods by a pool – Omnipod UAE marketing campaign by Stache DXB Media',
      pos: '50% 45%',
      posMobile: '50% 40%',
      title: ['clamp(3rem,8.86vw,12rem)', 'clamp(2rem,5.49vw,6.2rem)'],
      titleMobile: ['16.86vw', '10.45vw'],
    },
    strip: {
      items: [
        { src: img('omnipod', 'strip-1'), alt: 'Close-up of an Omnipod pod worn while swimming – diabetes technology marketing UAE' },
        { src: img('omnipod', 'strip-2'), alt: 'Man playing padel by the beach wearing an Omnipod pod – medtech lifestyle content Dubai' },
        { src: img('omnipod', 'strip-3'), alt: 'Grandfather wearing an Omnipod pod reading with his grandson – healthcare brand campaign Dubai' },
      ],
    },
    spread: {
      name: 'Omnipod',
      client: 'Omnipod',
      body: [
        'Stache DXB Media was tasked with producing a video campaign to promote Omnipod’s product line to the region — this Omnipod UAE marketing effort. Over an intensive five-day production, our team managed every detail from shoot to final cut, delivering a healthcare brand campaign Dubai audiences engaged with and Omnipod’s global headquarters recognized for quality and impact.',
        'It’s a strong example of diabetes technology marketing UAE and medtech lifestyle content Dubai, backed by healthcare social media management UAE end to end.',
      ],
    },
    flow: {
      heading: 'From first shot to final cut',
      intro: 'One intensive five-day production, with every detail handled by our team.',
      steps: [
        ['The brief', 'Promote Omnipod’s product line to the region.'],
        ['Five-day shoot', 'An intensive production schedule from day one.'],
        ['Every detail managed', 'Our team ran the production end to end.'],
        ['Final cut', 'A campaign delivered with the polish the brand demanded.'],
        ['Global recognition', 'Recognized by Omnipod’s global headquarters.'],
      ],
    },
    story: {
      tag: { n: '5', w: ['Days', 'shoot to', 'final cut'] },
      image: {
        src: img('omnipod', 'story'),
        alt: 'Teen with a paddleboard wearing an Omnipod pod on the beach – Omnipod video production UAE',
      },
      client: 'Omnipod',
      challenge: 'Produce a video campaign to promote Omnipod’s product line to the region, with the polish and precision the brand demanded.',
      did: [
        'Ran an intensive five-day production',
        'Managed every detail from shoot to final cut',
        'Delivered a healthcare brand campaign built for audiences in Dubai and the UAE',
      ],
      result: 'A healthcare brand campaign Dubai audiences engaged with — recognized by Omnipod’s global headquarters for its quality and impact.',
    },
    crew: {
      heading: ['Real life,', 'on screen'],
      intro: 'Medtech lifestyle content in Dubai, built around the everyday moments the product line is part of.',
      layout: 'one',
      photos: [
        { src: img('omnipod', 'lifestyle'), alt: 'Mother and children sitting poolside wearing Omnipod pods – healthcare social media management UAE', shape: 'wide' },
      ],
    },
    band: {
      line: 'Recognized by Omnipod’s global headquarters.',
      small: 'The campaign resonated well beyond the region — a strong signal of the caliber of work delivered.',
    },
  },

  'see-institute': {
    slug: 'see-institute',
    title: 'SEE Institute Case Study | Sustainability Event Content Dubai',
    description:
      'How Stache DXB Media delivered full event coverage and production for the SEE Institute — education and sustainability marketing UAE and institutional event content Dubai.',
    sector: 'Education & sustainability',
    heading: 'SEE Institute sustainability campaign — institutional event content Dubai',
    lines: ['SEE', 'Institute'],
    facts: [
      ['Client', 'SEE Institute — Sustainability through Research & Education'],
      ['Scope', 'Event Coverage, Video Production, Content'],
      ['Delivered', 'Full event coverage and production, translated into institutional content'],
    ],
    hero: {
      src: img('see-institute', 'hero'),
      alt: 'SEE Institute building exterior under a clear blue sky – education and sustainability marketing UAE by Stache DXB Media',
      pos: '35% 60%',
      posMobile: '35% 60%',
      title: ['clamp(3rem,16.00vw,12rem)', 'clamp(2rem,6.89vw,6.2rem)'],
      titleMobile: ['30.00vw', '13.11vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('see-institute', 'strip-1'), alt: 'Speaker at a podium during the Ministry of Education Ambassadors event – institutional event content Dubai', tagline: 'On stage' },
        { src: img('see-institute', 'strip-2'), alt: 'Audience in an immersive projection room – research and education video production UAE', tagline: 'The experience' },
      ],
    },
    spread: {
      name: 'SEE Institute',
      client: 'SEE Institute',
      body: [
        'Stache DXB Media delivered full event coverage and production for this SEE Institute sustainability campaign, capturing key moments with a professional eye and translating them into institutional event content Dubai that extended the reach and impact of the event.',
        'It’s a solid case in education and sustainability marketing UAE and research and education video production UAE.',
      ],
    },
    flow: {
      heading: 'From the room to the screen',
      intro: 'Full coverage on the day, turned into content that kept working after it.',
      steps: [
        ['Full event coverage', 'On the ground for every part of the event.'],
        ['Production', 'Professional production from start to finish.'],
        ['Key moments', 'Captured with a professional eye.'],
        ['Institutional content', 'Event content built for Dubai audiences.'],
        ['Extended reach', 'Impact that carried beyond the event itself.'],
      ],
    },
    story: {
      tag: { n: '3', w: ['Services,', 'one', 'mission'] },
      formats: ['Event coverage', 'Video production', 'Institutional content'],
      bigword: { words: ['Purpose', 'in', 'focus'] },
      client: 'SEE Institute',
      challenge: 'Capture the SEE Institute’s event and its sustainability mission with the visual clarity it deserves, and extend its reach beyond the day itself.',
      did: [
        'Delivered full event coverage and production',
        'Captured key moments with a professional eye',
        'Translated them into institutional event content',
      ],
      result:
        'Content that extended the reach and impact of the event — a solid case in education and sustainability marketing UAE and research and education video production UAE.',
    },
    pillars: {
      heading: ['Built around', 'the mission'],
      intro: 'Sustainability through research and education, brought to screen.',
      cards: [
        ['Sustainability', 'The mission at the center of every frame.'],
        ['Research', 'Purpose-driven work, given the visual clarity it deserves.'],
        ['Education', 'Content that keeps informing well after the event.'],
      ],
    },
    band: {
      line: 'Reach beyond the room.',
      small: 'Institutional event content that extended the reach and impact of the SEE Institute’s event.',
    },
  },

  'mercedes-benz': {
    slug: 'mercedes-benz',
    title: 'Gargash Mercedes-Benz Case Study | Automotive Social Media Dubai',
    description:
      'How Stache DXB Media led social strategy, content and community management for Gargash Mercedes-Benz — and launched the largest service center of its kind in the Middle East.',
    sector: 'Automotive',
    heading: 'Gargash Mercedes-Benz — Mercedes-Benz Dubai marketing campaign',
    lines: ['Gargash', 'Mercedes-Benz'],
    facts: [
      ['Client', 'Gargash Mercedes-Benz, UAE'],
      ['Scope', 'Social Strategy, Content Production, Community Management, Performance Marketing'],
      ['Delivered', 'Polished video content, monthly calendars and the launch of the brand’s newest service center'],
    ],
    hero: {
      src: img('mercedes-benz', 'hero'),
      alt: 'Mercedes-AMG GT3 race car at golden hour during the 24H Dubai – automotive social media management UAE by Stache DXB Media',
      pos: '45% 75%',
      posMobile: '45% 78%',
      title: ['clamp(3rem,8.86vw,12rem)', 'clamp(2rem,4.77vw,6.2rem)'],
      titleMobile: ['16.86vw', '9.08vw'],
    },
    strip: {
      variant: 'three',
      items: [
        { src: img('mercedes-benz', 'strip-1'), alt: 'Mercedes-Benz Certified vehicles in the Gargash showroom – Mercedes-Benz Dubai marketing campaign', tagline: 'Showroom' },
        { src: img('mercedes-benz', 'strip-2'), alt: 'Mercedes-AMG key handover – luxury car brand campaign in Dubai', tagline: 'Handover' },
        { src: img('mercedes-benz', 'strip-3'), alt: 'Hand on a Mercedes-AMG steering wheel drive-mode dial – polished automotive video content', tagline: 'Behind the wheel' },
      ],
    },
    spread: {
      name: ['Gargash', 'Mercedes-Benz'],
      compact: true,
      client: 'Gargash Mercedes-Benz, UAE',
      body: [
        'As Gargash Mercedes-Benz’s automotive social media management partner in the UAE, we led social strategy, content production, and community management — delivering polished video content and consistent monthly calendars that matched the prestige of the brand.',
        'The highlight of this Mercedes-Benz Dubai marketing campaign: spearheading the launch of the brand’s newest service center, the largest of its kind in the Middle East. As a luxury car brand campaign in Dubai, it brought the scale and significance of the opening to life across social — a case in performance marketing for automotive brands that helped position the launch as a landmark moment for Mercedes-Benz Gargash Dubai and the region.',
      ],
    },
    flow: {
      heading: 'Always on, built to launch',
      intro: 'Month-to-month social that matched the brand, with a landmark launch at its peak.',
      steps: [
        ['Social strategy', 'Leading the direction of the brand’s social presence.'],
        ['Monthly calendars', 'Consistent planning that matched the brand’s prestige.'],
        ['Video content', 'Polished production for every platform.'],
        ['Community management', 'Keeping the conversation with the audience going.'],
        ['The launch', 'The newest service center, largest of its kind in the Middle East.'],
      ],
    },
    story: {
      tag: { n: '#1', w: ['Largest of', 'its kind in the', 'Middle East'] },
      formats: ['Social strategy', 'Content production', 'Community management', 'Performance marketing'],
      bigword: { words: ['Scale', 'meets', 'prestige'], compact: true },
      client: 'Gargash Mercedes-Benz',
      challenge:
        'Launch the brand’s newest service center — the largest of its kind in the Middle East — across social, while keeping everyday content true to the prestige of the brand.',
      did: [
        'Led social strategy, content production, and community management',
        'Delivered polished video content and consistent monthly calendars',
        'Spearheaded the service center launch, bringing its scale and significance to life across social',
      ],
      result:
        'A case in performance marketing for automotive brands that positioned the launch as a landmark moment for Mercedes-Benz Gargash Dubai and the region.',
    },
    crew: {
      heading: ['Creative that', 'matches the badge'],
      intro: 'Social creative built to match the prestige of the Mercedes-Benz name, post after post.',
      layout: 'pair',
      photos: [
        { src: img('mercedes-benz', 'creative-1'), alt: 'Gargash Mercedes-Benz G-Class social creative: Built for the country of dreams', parallax: 0.05 },
        { src: img('mercedes-benz', 'creative-2'), alt: 'Mercedes-Benz social creative: That’s how dreams are born', parallax: 0.05 },
      ],
    },
    band: {
      line: 'A landmark moment for the region.',
      small: 'The launch of the largest service center of its kind in the Middle East, brought to life across social.',
    },
  },

  bioderma: {
    slug: 'bioderma',
    title: 'Bioderma UAE Campaign Case Study | Skincare Brand Marketing Dubai',
    description:
      'How Stache DXB Media led campaign development and cinematic video production for Bioderma UAE — family lifestyle video production Dubai for a dermocosmetics audience across MENA.',
    sector: 'Lifestyle & skincare',
    heading: 'Bioderma UAE campaign — skincare brand marketing Dubai',
    lines: ['Bioderma', 'Campaign'],
    facts: [
      ['Client', 'Bioderma UAE'],
      ['Scope', 'Campaign Development, Cinematic Video Production, Campaign Content'],
      ['Delivered', 'A series of lifestyle videos for families, mothers and everyday moments'],
    ],
    hero: {
      src: img('bioderma', 'hero'),
      alt: 'Child in a sun hat applying sunscreen by the pool – Bioderma UAE campaign by Stache DXB Media',
      pos: '55% 35%',
      posMobile: '55% 35%',
      title: ['clamp(3rem,7.75vw,12rem)', 'clamp(2rem,4.80vw,6.2rem)'],
      titleMobile: ['14.75vw', '9.14vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('bioderma', 'strip-1'), alt: 'Mother applying sunscreen to her smiling son outdoors – family lifestyle video production Dubai', tagline: 'Families' },
        { src: img('bioderma', 'strip-2'), alt: 'Bioderma Photoderm Pediatrics Mineral SPF 50 sunscreen by the pool – skincare brand marketing Dubai', tagline: 'The product' },
      ],
    },
    spread: {
      name: 'Bioderma',
      client: 'Bioderma UAE',
      body: [
        'For this Bioderma UAE campaign, Stache DXB Media led campaign development and cinematic video production, bringing the brand’s story to life through visually rich, high-production-value content.',
        'The work reflects strong skincare brand marketing Dubai instincts and consumer health social content UAE, built for a dermocosmetics marketing MENA audience — grounded in the kind of family lifestyle video production Dubai that makes a brand story land.',
      ],
    },
    flow: {
      heading: 'From concept to screen',
      intro: 'We led the campaign from the first idea to the final cinematic cut.',
      steps: [
        ['Campaign development', 'Shaping the campaign and the story behind it.'],
        ['Cinematic production', 'High-production-value video, shot with care.'],
        ['Family lifestyle', 'Families, mothers and everyday moments on screen.'],
        ['Visually rich content', 'Consumer health social content built for the UAE.'],
        ['A story that lands', 'Made for a dermocosmetics audience across MENA.'],
      ],
    },
    story: {
      tag: { n: '4', w: ['Pieces,', 'one', 'story'] },
      formats: ['Campaign development', 'Cinematic video', 'Lifestyle content', 'Social content'],
      bigword: { words: ['Warm', 'Human', 'Real'] },
      client: 'Bioderma UAE',
      challenge: 'Bring the brand’s story to life for a dermocosmetics audience across MENA, in a way that feels warm, human and real.',
      did: [
        'Led campaign development from concept onwards',
        'Produced cinematic, high-production-value video',
        'Built a series of lifestyle videos around families, mothers and everyday moments',
      ],
      result:
        'Visually rich content that reflects strong skincare brand marketing Dubai instincts — family lifestyle video production Dubai that makes a brand story land.',
    },
    pillars: {
      heading: ['Built around', 'real life'],
      intro: 'The series connected the brand with the people and moments it’s made for.',
      cards: [
        ['Families', 'Shared days in the sun, captured naturally.'],
        ['Mothers', 'Care shown through simple, everyday rituals.'],
        ['Everyday moments', 'Authentic storytelling at its best.'],
      ],
    },
    band: {
      line: 'A brand story that lands.',
      small: 'Family lifestyle video production in Dubai, built for a dermocosmetics audience across MENA.',
    },
  },

  mitsubishi: {
    slug: 'mitsubishi',
    title: 'Mitsubishi Motors UAE Case Study | Automotive Video Production Dubai',
    description:
      'How Stache DXB Media produced video campaigns and outdoor statics for Mitsubishi Motors UAE — campaign-ready automotive content Dubai, from screen to street.',
    sector: 'Automotive',
    heading: 'Mitsubishi Motors UAE campaign — automotive video production Dubai',
    lines: ['Mitsubishi', 'Motors'],
    facts: [
      ['Client', 'Mitsubishi Motors UAE'],
      ['Scope', 'Video Production, Outdoor Advertising, Social Media Content'],
      ['Delivered', 'Video campaigns for the newest models, plus statics for road banners'],
    ],
    hero: {
      src: img('mitsubishi', 'hero'),
      alt: 'Mitsubishi XFORCE on a Dubai highway at night with the city skyline – automotive video production Dubai by Stache DXB Media',
      pos: '25% 60%',
      posMobile: '55% 70%',
      title: ['clamp(3rem,6.20vw,12rem)', 'clamp(2rem,3.84vw,6.2rem)'],
      titleMobile: ['11.80vw', '7.32vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('mitsubishi', 'strip-1'), alt: 'Mitsubishi XFORCE parked on the Dubai Autodrome pit lane – Mitsubishi Motors UAE campaign', tagline: 'On track' },
        { src: img('mitsubishi', 'strip-2'), alt: 'Close-up of the Mitsubishi XFORCE bonnet badge – campaign-ready automotive content Dubai', tagline: 'In detail' },
      ],
    },
    spread: {
      name: 'Mitsubishi Motors',
      client: 'Mitsubishi Motors UAE',
      body: [
        'For this Mitsubishi Motors UAE campaign, Stache DXB Media produced a series of video campaigns spotlighting the brand’s newest models, paired with statics designed for large-scale outdoor advertising — including road banners that put the brand front and center across the city.',
        'As automotive video production Dubai, the work maintained a consistent, premium visual identity: proof of what car brand social media management UAE and campaign-ready automotive content Dubai should look like, from screen to street.',
      ],
    },
    flow: {
      heading: 'Built for every format',
      intro: 'One premium visual identity, carried from video campaigns to the biggest outdoor formats in the city.',
      steps: [
        ['The newest models', 'Every piece built to spotlight the brand’s latest line-up.'],
        ['Video campaigns', 'A series of campaign-ready videos for screen and social.'],
        ['Outdoor statics', 'Designed for large-scale outdoor advertising.'],
        ['Road banners', 'Putting the brand front and center across the city.'],
        ['One identity', 'Consistent and premium across every format.'],
      ],
    },
    story: {
      tag: { n: '4', w: ['Formats,', 'one', 'identity'] },
      formats: ['Video campaigns', 'Social content', 'Outdoor statics', 'Road banners'],
      bigword: { words: ['Screen', 'to', 'Street'], dash: true },
      client: 'Mitsubishi Motors UAE',
      challenge:
        'Spotlight the brand’s newest models with content that works on screen and at city scale, without losing the premium feel of the Mitsubishi name.',
      did: [
        'Produced a series of video campaigns spotlighting the newest models',
        'Designed statics for large-scale outdoor advertising, including road banners',
        'Kept a consistent, premium visual identity across every format',
      ],
      result:
        'Proof of what car brand social media management UAE and campaign-ready automotive content Dubai should look like, with the brand front and center across the city.',
    },
    crew: {
      heading: ['Front and center', 'across the city'],
      intro: 'Statics designed for large-scale outdoor advertising, including road banners that put the brand front and center across the city.',
      layout: 'one',
      photos: [
        {
          src: img('mitsubishi', 'key-visual'),
          alt: 'Mitsubishi XFORCE kicking up dust on a dirt track – campaign-ready automotive content Dubai',
          shape: 'wide',
          parallax: 0.06,
        },
      ],
    },
    band: {
      line: 'From screen to street.',
      small: 'A consistent, premium visual identity that matched the caliber of the Mitsubishi name.',
    },
  },

  adio: {
    slug: 'adio',
    title: 'ADIO Case Study | Event Coverage & Production Abu Dhabi',
    description:
      'How Stache DXB Media delivered production and event coverage for ADIO at the Abu Dhabi-Brazil Partnership Summit, capturing key moments with professional quality content built for impact.',
    sector: 'Government & investment',
    heading: 'ADIO event coverage and production — Abu Dhabi-Brazil Partnership Summit',
    lines: ['ADIO', 'Summit'],
    facts: [
      ['Client', 'ADIO — Abu Dhabi Investment Office'],
      ['Scope', 'Production, Event Coverage'],
      ['Event', 'Gateway to Growth: Abu Dhabi-Brazil Partnership Summit'],
    ],
    hero: {
      src: img('adio', 'hero'),
      alt: 'Abu Dhabi-Brazil Partnership Summit stage with lit podium – ADIO event coverage by Stache DXB Media',
      pos: '55% 55%',
      posMobile: '58% 60%',
      title: ['clamp(3rem,15.50vw,12rem)', 'clamp(2rem,9.61vw,6.2rem)'],
      titleMobile: ['29.50vw', '18.29vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('adio', 'strip-1'), alt: 'ADIO speaker at the podium during the Abu Dhabi-Brazil Partnership Summit – event production Abu Dhabi', tagline: 'On stage' },
        { src: img('adio', 'strip-2'), alt: 'Speaker addressing the Abu Dhabi-Brazil Partnership Summit – professional event coverage', tagline: 'In session' },
      ],
    },
    spread: {
      name: 'ADIO',
      client: 'Abu Dhabi Investment Office',
      body: [
        'Stache DXB Media delivered production and event coverage for ADIO, capturing the brand’s key moments with professional quality content built for impact.',
        'At the Abu Dhabi-Brazil Partnership Summit, our team covered the stage and its speakers, turning key moments into event content built to carry the summit’s message further.',
      ],
    },
    flow: {
      heading: 'From stage to story',
      intro: 'Production and coverage on the day, delivered to the standard the brand expects.',
      steps: [
        ['Production', 'Professional production, on site.'],
        ['Event coverage', 'Covering the summit as it happened.'],
        ['Key moments', 'Every important moment on stage, captured.'],
        ['Professional quality', 'Content held to the brand’s standard.'],
        ['Built for impact', 'Made to work well beyond the room.'],
      ],
    },
    story: {
      tag: { n: '2', w: ['Services,', 'one', 'standard'] },
      formats: ['Production', 'Event coverage'],
      bigword: { words: ['Built', 'for', 'impact'] },
      client: 'ADIO',
      challenge: 'Capture ADIO’s key moments at the summit with content that matches the standard of the brand.',
      did: ['Delivered production on site', 'Provided full event coverage of the summit', 'Captured the brand’s key moments on stage'],
      result: 'Professional quality content built for impact, ready to carry the summit’s message further.',
    },
    pillars: {
      heading: ['Built for', 'the moment'],
      intro: 'Coverage that gave the summit the professional presence it called for.',
      cards: [
        ['The stage', 'A summit setting, captured with care.'],
        ['The speakers', 'Key sessions covered as they happened.'],
        ['The story', 'Content that carries the message further.'],
      ],
    },
    band: {
      line: 'Content built for impact.',
      small: 'Production and event coverage that captured ADIO’s key moments at professional quality.',
    },
  },

  mangrove: {
    slug: 'mangrove',
    title: 'Mangrove Immersive Experience Case Study | World Governments Summit',
    description:
      'How Stache DXB Media developed the campaign concept, cinematic immersive video and seven localized voiceovers for the Among Mangrove Trees experience at the World Governments Summit.',
    sector: 'Government & environment',
    heading: 'Mangrove immersive experience — Among Mangrove Trees at the World Governments Summit',
    lines: ['Mangrove', 'Experience'],
    facts: [
      ['Client', 'UAE Ministry of Climate Change & Environment'],
      ['Scope', 'Campaign Concept, Immersive Video Production, Localization, Experience Design, Event Coverage'],
      ['Event', 'Among Mangrove Trees, World Governments Summit'],
    ],
    hero: {
      src: img('mangrove', 'hero'),
      alt: 'Camera operator filming in the water among Abu Dhabi’s mangroves – cinematic immersive video production by Stache DXB Media',
      pos: '55% 75%',
      posMobile: '60% 72%',
      title: ['clamp(4rem,7.6vw,8rem)', 'clamp(2.2rem,4.3vw,4.4rem)'],
      titleMobile: ['min(13.5vw,8rem)', 'min(9.5vw,4.5rem)'],
    },
    strip: {
      variant: 'three',
      items: [
        { src: img('mangrove', 'strip-1'), alt: 'Visitor at the Among Mangrove Trees experience at the World Governments Summit – immersive video production', tagline: 'At the summit' },
        { src: img('mangrove', 'strip-2'), alt: 'Close-up of mangrove leaves at the Among Mangrove Trees experience', tagline: 'Up close' },
        { src: img('mangrove', 'strip-3'), alt: 'Among Mangrove Trees feature wall at the World Governments Summit', tagline: 'On site' },
      ],
    },
    spread: {
      name: 'Mangrove',
      client: 'Ministry of Climate Change & Environment',
      body: [
        'We developed the campaign concept and delivered cinematic video production alongside full event coverage for Mangrove, capturing the brand’s presence with a polished, premium visual approach.',
        'At the World Governments Summit, we transported visitors into the heart of Abu Dhabi’s mangroves — producing a high-impact immersive video, developing seven localized voiceovers, and optimizing the full experience for an immersive screen environment.',
      ],
    },
    flow: {
      heading: 'From the mangroves to the summit',
      intro: 'One concept, carried from the water’s edge to an immersive screen.',
      steps: [
        ['Campaign concept', 'The idea that shaped the whole experience.'],
        ['In the mangroves', 'Cinematic filming in the heart of Abu Dhabi’s mangroves.'],
        ['Immersive video', 'A high-impact film built for an immersive screen.'],
        ['Seven voiceovers', 'Localized so more visitors could follow the story.'],
        ['At the summit', 'The full experience optimized, with full event coverage.'],
      ],
    },
    story: {
      tag: { n: '7', w: ['Localized', 'voiceovers'] },
      formats: ['Campaign concept', 'Cinematic video', 'Immersive experience', 'Event coverage'],
      image: {
        src: img('mangrove', 'story'),
        alt: 'Visitors in silhouette watching the immersive mangrove video at the World Governments Summit',
      },
      client: 'Ministry of Climate Change & Environment',
      challenge:
        'Bring World Governments Summit visitors into the heart of Abu Dhabi’s mangroves, in an experience built for an immersive screen and audiences from many places.',
      did: [
        'Developed the campaign concept',
        'Produced a high-impact, cinematic immersive video',
        'Developed seven localized voiceovers',
        'Optimized the full experience for the immersive screen and delivered full event coverage',
      ],
      result: 'A polished, premium experience that transported visitors into the mangroves, with the brand’s presence captured across the summit.',
    },
    crew: {
      heading: ['Guardians', 'of the coast'],
      intro: 'Every touchpoint of the experience carried the same polished, premium visual approach.',
      layout: 'pair',
      photos: [
        { src: img('mangrove', 'onsite-1'), alt: 'Visitors at the Experience the Guardians of the Coast entrance – event coverage at the World Governments Summit', parallax: 0.05 },
        { src: img('mangrove', 'onsite-2'), alt: 'Guardians of the Coast gift being handed to a visitor – premium event experience', parallax: 0.05 },
      ],
    },
    band: {
      line: 'Into the heart of the mangroves.',
      small: 'An immersive video in seven localized voiceovers, made for the World Governments Summit.',
    },
  },

  'ministry-of-sports': {
    slug: 'ministry-of-sports',
    title: 'UAE Ministry of Sports Case Study | Sports Video Production UAE',
    description:
      'How Stache DXB Media covered the Minister’s keynote at the World Sports Summit and produced the Elite Sports brand video “Numbers Don’t Lie” for the UAE Ministry of Sports.',
    sector: 'Government & sport',
    heading: 'UAE Ministry of Sports — World Sports Summit keynote and Elite Sports “Numbers Don’t Lie” brand video',
    lines: ['Ministry', 'of Sports'],
    facts: [
      ['Client', 'UAE Ministry of Sports'],
      ['Scope', 'Video Production, Campaign Content, Event Coverage, Presentation Design'],
      ['Projects', 'World Sports Summit Minister’s Keynote and Elite Sports “Numbers Don’t Lie”'],
    ],
    hero: {
      src: img('ministry-of-sports', 'hero'),
      alt: 'UAE cyclist training on a desert road at sunset – sports video production UAE by Stache DXB Media',
      pos: '60% 35%',
      posMobile: '55% 30%',
      title: ['clamp(3rem,7.75vw,12rem)', 'clamp(2rem,4.80vw,6.2rem)'],
      titleMobile: ['14.75vw', '9.14vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('ministry-of-sports', 'strip-1'), alt: 'Equestrian athlete riding under a stormy sky – Elite Sports brand video for the UAE Ministry of Sports', tagline: 'Elite athletes' },
        { src: img('ministry-of-sports', 'strip-2'), alt: 'UAE passport held at an airport arrivals hall – athletes travelling to training camps', tagline: 'On the road' },
      ],
    },
    spread: {
      name: 'Ministry of Sports',
      client: 'UAE Ministry of Sports',
      body: [
        'Telling the story of UAE athletics with the energy and urgency it deserves. For the UAE Ministry of Sports, Stache DXB Media delivered high-impact video content built to inspire and inform.',
        'From covering the Minister’s keynote at the World Sports Summit to producing the Elite Sports brand video “Numbers Don’t Lie,” our team delivered on time, to a high standard, and with work that resonated widely.',
      ],
    },
    flow: {
      heading: 'From the summit stage to the field',
      intro: 'Two projects, both delivered with the energy UAE sport deserves.',
      steps: [
        ['The keynote brief', 'The Minister’s exact requirements, under serious time pressure.'],
        ['Built from the ground up', 'A presentation designed for the World Sports Summit.'],
        ['Summit coverage', 'The Minister’s speech covered on the day.'],
        ['Premier facilities', 'The Elite Sports brand video, shot across the UAE.'],
        ['Numbers Don’t Lie', 'A standout film that drew strong praise across the board.'],
      ],
    },
    story: {
      tag: { n: '2', w: ['Projects,', 'one', 'ministry'] },
      formats: ['Video production', 'Event coverage', 'Presentation design', 'Campaign content'],
      image: {
        src: img('ministry-of-sports', 'story'),
        alt: 'Frame from the Numbers Don’t Lie video: 22 international and domestic training camps',
      },
      client: 'UAE Ministry of Sports',
      challenge:
        'Build the Minister’s World Sports Summit presentation from the ground up, under serious time pressure and to exact requirements, and tell the story of UAE elite sport in a way that proves its impact.',
      did: [
        'Covered the Minister’s speech at the World Sports Summit',
        'Built the accompanying presentation from the ground up',
        'Produced and executed the Elite Sports brand video, shot across premier facilities in the UAE',
      ],
      result:
        'A presentation delivered on time and to a high standard, contributing to a successful summit appearance, and a brand video that resonated widely and drew strong praise across the board.',
    },
    pillars: {
      heading: ['Two projects,', 'one standard'],
      intro: 'High-impact work for the UAE Ministry of Sports, built to inspire and inform.',
      variant: 'two',
      cards: [
        [
          'Minister’s keynote',
          'Stache DXB Media was entrusted with covering the Minister’s speech at the World Sports Summit and building the accompanying presentation from the ground up. Despite the tight turnaround, it was delivered on time and to a high standard.',
          'World Sports Summit',
        ],
        [
          'Numbers Don’t Lie',
          'For the Elite Sports sector under the Ministry of Sports, we produced a professional brand video shot across premier facilities in the UAE — a video that didn’t just promote the brand, but proved its impact.',
          'Elite Sports',
        ],
      ],
    },
    band: {
      line: 'Numbers don’t lie.',
      small: 'A brand video that didn’t just promote Elite Sports, but proved its impact.',
    },
  },

  talabat: {
    slug: 'talabat',
    title: 'Talabat Social Media Campaign Case Study | Food Delivery App Marketing UAE',
    description:
      'How Stache DXB Media took full ownership of Talabat’s digital presence — content strategy, community management, social video and a dedicated Ramadan marketing campaign in the UAE.',
    sector: 'Lifestyle & F&B',
    heading: 'Talabat social media campaign — food delivery app marketing UAE',
    lines: ['Talabat', 'Social Media'],
    facts: [
      ['Client', 'Talabat, UAE'],
      ['Scope', 'Content Strategy, Social Video Production, Community Management, Ramadan Campaign'],
      ['Delivered', 'Structured content calendars and standout social video content'],
    ],
    hero: {
      src: img('talabat', 'hero'),
      alt: 'Talabat delivery rider in branded orange helmet and jersey – Talabat social media campaign by Stache DXB Media',
      pos: '50% 8%',
      posMobile: '45% 20%',
      title: ['clamp(3rem,8.86vw,12rem)', 'clamp(2rem,5.17vw,6.2rem)'],
      titleMobile: ['16.86vw', '9.83vw'],
    },
    strip: {
      variant: 'two',
      items: [
        { src: img('talabat', 'strip-1'), alt: 'Ramadan Combo order screen in the Talabat app over a Dubai street scene – Ramadan marketing campaign UAE', tagline: 'Ramadan' },
        { src: img('talabat', 'strip-2'), alt: 'Hands ordering Chicken Kabsa on the Talabat app – food delivery advertising Dubai', tagline: 'Everyday hunger' },
      ],
    },
    spread: {
      name: 'Talabat',
      client: 'Talabat, UAE',
      body: [
        'As Talabat’s social media partner, Stache DXB Media took full ownership of the brand’s digital presence for this Talabat social media campaign — from content strategy to day-to-day community management.',
        'We built structured content calendars that kept the food delivery app marketing UAE-wide consistent and culturally relevant, including a dedicated Ramadan marketing campaign UAE, and produced standout social video content Dubai audiences responded to. Every touchpoint was managed with care to keep Talabat’s F&B brand content MENA sharp, responsive, and true to the brand — proof of what focused food delivery advertising Dubai can look like.',
      ],
    },
    flow: {
      heading: 'From strategy to every scroll',
      intro: 'Full ownership of the brand’s digital presence, from the plan to the day-to-day.',
      steps: [
        ['Content strategy', 'Setting the direction for the brand’s digital presence.'],
        ['Content calendars', 'Structured, consistent and culturally relevant.'],
        ['Social video', 'Standout content that captured attention.'],
        ['Ramadan campaign', 'A dedicated campaign for the season.'],
        ['Community management', 'Every touchpoint handled with care, every day.'],
      ],
    },
    story: {
      tag: { n: '360°', w: ['Ownership', 'of the brand’s', 'digital presence'] },
      formats: ['Content strategy', 'Social video', 'Community management', 'Ramadan campaign'],
      bigword: { words: ['Fast', 'Fun', 'Sharp'] },
      client: 'Talabat',
      challenge: 'Keep Talabat’s voice sharp, responsive, and true to the brand across every platform, for a diverse audience across the region.',
      did: [
        'Took full ownership of the brand’s digital presence, from content strategy to day-to-day community management',
        'Built structured content calendars, including a dedicated Ramadan campaign',
        'Produced standout social video content that captured attention and drove engagement',
      ],
      result: 'Content that stayed consistent and culturally relevant across the region — proof of what focused food delivery advertising Dubai can look like.',
    },
    pillars: {
      heading: ['Built for', 'every moment'],
      intro: 'Social video content that resonated with a diverse regional audience.',
      cards: [
        ['Ramadan', 'A dedicated campaign, made for the season.'],
        ['Everyday hunger', 'Content for the moments people reach for the app.'],
        ['Every platform', 'One voice, sharp and responsive everywhere.'],
      ],
    },
    band: {
      line: 'Fast, fun, and culturally sharp.',
      small: 'Social content for Talabat that kept the brand consistent and culturally relevant across the region.',
    },
  },

  taqa: {
    slug: 'taqa',
    title: 'TAQA Brand Activation Case Study | Energy Sector Event Marketing UAE',
    description:
      'How Stache DXB Media provided full-scale event coverage, PR, production and social media content for a TAQA brand activation — energy sector event marketing in the UAE.',
    sector: 'Energy & utilities',
    heading: 'TAQA brand activation — energy sector event marketing UAE',
    lines: ['TAQA', 'Activation'],
    facts: [
      ['Client', 'TAQA, UAE'],
      ['Scope', 'Event Coverage, PR, Production, Social Media Content'],
      ['Delivered', 'The brand’s presence managed across every touchpoint, from press to social'],
    ],
    hero: {
      src: img('taqa', 'hero'),
      alt: 'Panel discussion on the TAQA Distribution stage under blue stage lights – energy sector event marketing UAE by Stache DXB Media',
      pos: '50% 40%',
      posMobile: '50% 45%',
      title: ['clamp(3rem,15.50vw,12rem)', 'clamp(2rem,6.20vw,6.2rem)'],
      titleMobile: ['29.50vw', '11.80vw'],
    },
    strip: {
      variant: 'one',
      items: [
        { src: img('taqa', 'strip-1'), alt: 'TAQA Distribution purple pavilion with the line Customer Centricity: Your Needs, Our Priority – TAQA brand activation', tagline: 'The activation' },
      ],
    },
    spread: {
      name: 'TAQA',
      client: 'TAQA, UAE',
      body: [
        'Stache DXB Media provided full-scale event coverage, PR, production, and social media content creation for this TAQA brand activation — managing the brand’s presence across every touchpoint, from press to social.',
        'As energy sector event marketing UAE, the work combined corporate event production Dubai standards with a power and utilities campaign UAE lens, reflecting the kind of government-linked enterprise branding UAE that ensures a cohesive, impactful showing.',
      ],
    },
    flow: {
      heading: 'From press to social',
      intro: 'Every touchpoint of the brand’s presence, managed as one.',
      steps: [
        ['Production', 'Corporate event production, to Dubai standards.'],
        ['Event coverage', 'Full-scale coverage of the activation.'],
        ['PR', 'The brand’s story carried through the press.'],
        ['Social content', 'Content created for every platform.'],
        ['One presence', 'A cohesive, impactful showing.'],
      ],
    },
    story: {
      tag: { n: '4', w: ['Services,', 'every', 'touchpoint'] },
      formats: ['Event coverage', 'PR', 'Production', 'Social content'],
      bigword: { words: ['Press', 'to', 'Social'] },
      client: 'TAQA',
      challenge: 'Give TAQA a cohesive, impactful presence at its brand activation, across press, the event itself and social.',
      did: [
        'Provided full-scale event coverage and production',
        'Handled PR for the activation',
        'Created social media content and managed the brand’s presence across every touchpoint',
      ],
      result: 'A cohesive, impactful showing that combined corporate event production Dubai standards with a power and utilities campaign UAE lens.',
    },
    pillars: {
      heading: ['Every', 'touchpoint'],
      intro: 'Government-linked enterprise branding, carried consistently from the stage to the feed.',
      cards: [
        ['On stage', 'Production and coverage of every session.'],
        ['In the press', 'PR that carried the brand beyond the event.'],
        ['On social', 'Content created to extend the showing online.'],
      ],
    },
    band: {
      line: 'A cohesive, impactful showing.',
      small: 'Event coverage, PR, production and social content for TAQA, managed as one presence.',
    },
  },
};
