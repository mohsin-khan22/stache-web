// Copy and imagery for the case study pages, lifted from the standalone
// NSTI.html / OMNIPOD.html exports. Both pages share one layout (CaseStudy), so
// everything that differs between them lives here. Images were embedded as
// base64 in the exports and now sit in assets/images/<slug>-*.jpg.
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
    tickerLabel: 'What we covered',
    ticker: ['Pre-event announcements', 'Daily agenda updates', 'Real-time posts', 'Press coverage', 'Highlight videos', 'Recap content'],
    strip: [
      { src: img('nsti', 'strip-1'), alt: 'Speaker on stage at the NSTI Festival in front of the Ministry of Education screen – STEM festival marketing UAE' },
      { src: img('nsti', 'strip-2'), alt: 'Live science show at the NSTI Festival with a young volunteer – education sector marketing Dubai' },
      { src: img('nsti', 'strip-3'), alt: 'Student at a hands-on NSTI Festival activity – National Science Technology and Innovation Festival content' },
    ],
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
    tickerLabel: 'What we delivered',
    ticker: ['Video campaign', 'Five-day production', 'Shoot to final cut', 'Healthcare brand campaign', 'Medtech lifestyle content', 'Recognized by global HQ'],
    strip: [
      { src: img('omnipod', 'strip-1'), alt: 'Close-up of an Omnipod pod worn while swimming – diabetes technology marketing UAE' },
      { src: img('omnipod', 'strip-2'), alt: 'Man playing padel by the beach wearing an Omnipod pod – medtech lifestyle content Dubai' },
      { src: img('omnipod', 'strip-3'), alt: 'Grandfather wearing an Omnipod pod reading with his grandson – healthcare brand campaign Dubai' },
    ],
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
      photos: [
        { src: img('omnipod', 'lifestyle'), alt: 'Mother and children sitting poolside wearing Omnipod pods – healthcare social media management UAE', shape: 'wide' },
      ],
    },
    band: {
      line: 'Recognized by Omnipod’s global headquarters.',
      small: 'The campaign resonated well beyond the region — a strong signal of the caliber of work delivered.',
    },
  },
};
