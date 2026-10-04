// Copy and imagery for the case study pages (/work/<slug>), lifted from the
// standalone HTML exports. Every study shares one layout (CaseStudy), so
// everything that differs between them lives here. Images were embedded as
// base64 in the exports and now sit in assets/images/<slug>-*.jpg.
//
// Optional sections — a study renders only the ones it has:
//   ticker            the red marquee under the hero
//   poster.parallax   drift factor for the hero image
//   strip.variant     'two' | 'three' (default: three-up, first image full width on phones)
//   story.formats     pills under the tag; story.bigword replaces story.image
//   crew              photo section; layout 'one' | 'pair' (default: wide + tall)
//   pillars           three numbered cards
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
    facts: {
      client: 'UAE Ministry of Education — National Science, Technology and Innovation Festival',
      scope: 'Digital Launch, Social Media, PR Coverage, Performance Marketing',
      delivered: 'Designs, real-time posts, press coverage, highlight videos and recap content',
    },
    poster: {
      src: img('nsti', 'poster'),
      alt: 'NSTI Festival 2023 campaign poster for the UAE Ministry of Education – government digital launch campaign Dubai',
    },
    ticker: {
      label: 'What we covered',
      items: ['Pre-event announcements', 'Daily agenda updates', 'Real-time posts', 'Press coverage', 'Highlight videos', 'Recap content'],
    },
    strip: {
      items: [
        { src: img('nsti', 'strip-1'), alt: 'Speaker on stage at the NSTI Festival in front of the Ministry of Education screen – STEM festival marketing UAE' },
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
    facts: {
      client: 'Omnipod — UAE',
      scope: 'Video Campaign Production, Healthcare Social Media Management',
      delivered: 'A five-day production, managed from shoot to final cut',
    },
    poster: {
      src: img('omnipod', 'poster'),
      alt: 'Teen with a paddleboard wearing an Omnipod pod on the beach – Omnipod UAE marketing campaign by Stache DXB Media',
    },
    ticker: {
      label: 'What we delivered',
      items: ['Video campaign', 'Five-day production', 'Shoot to final cut', 'Healthcare brand campaign', 'Medtech lifestyle content', 'Recognized by global HQ'],
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
        alt: 'Mother and two children wearing Omnipod pods by a pool – Omnipod video production UAE',
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
    facts: {
      client: 'SEE Institute — Sustainability through Research & Education',
      scope: 'Event Coverage, Video Production, Content',
      delivered: 'Full event coverage and production, translated into institutional content',
    },
    poster: {
      src: img('see-institute', 'poster'),
      alt: 'SEE Institute building exterior under a clear blue sky – education and sustainability marketing UAE by Stache DXB Media',
      parallax: 0.07,
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
    facts: {
      client: 'Gargash Mercedes-Benz, UAE',
      scope: 'Social Strategy, Content Production, Community Management, Performance Marketing',
      delivered: 'Polished video content, monthly calendars and the launch of the brand’s newest service center',
    },
    poster: {
      src: img('mercedes-benz', 'poster'),
      alt: 'Mercedes-AMG GT3 race car at golden hour during the 24H Dubai – automotive social media management UAE by Stache DXB Media',
      parallax: 0.07,
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
    facts: {
      client: 'Bioderma UAE',
      scope: 'Campaign Development, Cinematic Video Production, Campaign Content',
      delivered: 'A series of lifestyle videos for families, mothers and everyday moments',
    },
    poster: {
      src: img('bioderma', 'poster'),
      alt: 'Child in a sun hat applying sunscreen by the pool – Bioderma UAE campaign by Stache DXB Media',
      parallax: 0.07,
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
    facts: {
      client: 'Mitsubishi Motors UAE',
      scope: 'Video Production, Outdoor Advertising, Social Media Content',
      delivered: 'Video campaigns for the newest models, plus statics for road banners',
    },
    poster: {
      src: img('mitsubishi', 'poster'),
      alt: 'Mitsubishi XFORCE kicking up dust on a dirt track – automotive video production Dubai by Stache DXB Media',
      parallax: 0.07,
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
          alt: 'Mitsubishi XFORCE on a Dubai highway at night with the city skyline – Mitsubishi Motors UAE outdoor campaign key visual',
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
};
