module.exports = {
  // pathPrefix: '',
  siteUrl: 'https://codejaeger.github.io',
  title: 'Debabrata Mandal',
  description: 'codejaeger ',
  author: 'Debabrata Mandal',
  // authorAlternative: '',
  introduction: [
    'I am first-year Ph.D. student in UNC-CH working with Praneeth Chakravarthula exploring deep-optics and computational image reconstruction. Specifically, I am looking at improving the achievable image quality with meta-lenses, one of the pioneering revolution under Fourier optics. Our research aims to stretch the limits imposed by wave-guided imaging pipelines to open up a diverse range of applications involving meta-lenses.',
    'My primary areas of interest lie in the field of computer graphics and accelerated computing. I am also interested in understanding scene representation through surface and shape modeling. I am drawn towards skeletal-pose and shape estimation models which often intermix physics and kinematics with deep learning. In my spare time I play with vector graphics and 2D visualisations made through programming.',
    'I also have been exposed to industry during my role as an AI engineer at ACL (Advanced Computing Labs, IIT Madras) at KLA-Tencor, Chennai. I spent there time designing some of the most efficient software infrastructures running inference workloads at the speed of light. As an open source enthusiast, I have received both scholarships and sponsoring to support my contributions.',
    'Before that, I was assisting in the research for realistic hand shape modelling with Prof. Parag Chaudhuri and Prateek Kalshetti at ViGIL, IIT Bombay.',
    '\n```markdown\nDoing research may be similar to MCMC sampling, you start at zero knowledge and after a \n burnout may get enlightened with an idea!\n```'
  ],
  avatar: '/2me.jpg',
  professions: [
    'Ph.D. student at UNC-CH'
  ],
  tocMaxDepth: 2,
  excerptMaxLength: 500,
  // birthday: '',
  location: 'North Carolina, USA',
  email: 'debman@cs.unc.edu',
  postsForArchivePage: 3,
  defaultLanguage: 'en',
  disqusScript: process.env.DISQUS_SCRIPT
    || 'https://tc-imba.disqus.com/embed.js',
  pages: {
    home: '/',
    posts: 'posts',
    contact: 'contact',
    resume: 'resume',
    tags: 'tags',
    research: 'research',
  },
  social: [
    {
      url: '/resume.pdf',
      icon: ['ai', 'cv'],
    }, {
      url: 'https://github.com/codejaeger',
      icon: ['fab', 'github'],
    }, {
      url: 'https://scholar.google.com/citations?user=_0p4hC8zf7MC&hl=en',
      icon: ['fa', 'graduation-cap'],
    }, {
      url: 'https://www.linkedin.com/in/debabrata-mandal-0702a0167/',
      icon: ['fab', 'linkedin'],
    },
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  wakatime: {
    username: 'tcimba',
    activity: '7add4047-08f9-4da8-b649-aa114503678f',
    language: '460a84ab-722a-4b80-b896-cabaa13ad7eb',
    editor: 'd851639a-28d8-4884-949f-d338a858f7e9',
    os: 'caf7d0d1-8fd2-4595-a991-363c8583fea9',
  },
  contactFormUrl: process.env.CONTACT_FORM_ENDPOINT
    || 'https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451',
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || '',
  education: [
    {
      date: 'Jul 2023 - Present',
      icon: 'graduation-cap',
      title: 'Ph.D in Computer Science',
      location: 'University of North Carolina, Chapel Hill',
    }, {
      date: 'Aug 2022 - May 2023',
      icon: 'university',
      title: 'Non-degree, part-time',
      location: 'IIT Madras, India',
    }, {
      date: 'Jun 2017 - June 2021',
      icon: 'university',
      content: 'gpa: 4.3',
      title: 'B.Tech in Computer Science',
      location: 'IIT Bombay, India',
    }],
  interests: [
    {
      icon: 'cubes',
      title: 'Distributed Systems',
    }, {
      icon: 'layer-group',
      title: 'Full Stack Development',
    }, {
      icon: ['fab', 'linux'],
      // icon: 'linux',
      title: 'Open Source Community',
    }],
  experience: [
    {
      title: 'Work',
      position: 'left',
      data: [
        {
          date: 'Aug 2019 - Present',
          title: 'Software Engineer',
          location: 'Somewhere',
          description: 'description',
        },
      ],
    }, {
      title: 'Teaching',
      position: 'right',
      data: [
        {
          date: 'Aug 2019',
          title: 'Teaching Assistant of XXX',
          location: 'Somewhere',
        }, {
          date: 'Aug 2018',
          title: 'Teaching Assistant of XXX',
          location: 'Somewhere',
        }, {
          date: 'Aug 2017',
          title: 'Teaching Assistant of XXX',
          location: 'Somewhere',
        }, {
          date: 'Aug 2018',
          title: 'Teaching Assistant of XXX',
          location: 'Somewhere',
        }, {
          date: 'Aug 2017',
          title: 'Teaching Assistant of XXX',
          location: 'Somewhere',
        },
      ],
    }, {
      title: 'Volunteer',
      position: 'left',
      data: [
        {
          date: 'Aug 2019',
          title: '[fxh](https://github.com/Reapor-Yurnero) home visit third time',
          location: 'Somewhere',
        }, {
          date: 'Aug 2018',
          title: '[fxh](https://github.com/Reapor-Yurnero) home visit second time',
          location: 'Somewhere',
        }, {
          date: 'Aug 2017',
          title: '[fxh](https://github.com/Reapor-Yurnero) home visit\n\n111',
          location: 'Somewhere',
        },
      ],
    },
  ],
  awards: [
    {
      date: 'Someday',
      title: 'Some Award',
    }, {
      date: 'Someday',
      title: 'Another Award',
    },
  ],
  tagColors: [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
  ],
  tags: [
    {
      id: 'javascript',
      name: 'javascript',
      description: 'JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.',
      color: '#f0da50',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Node.js is a tool for executing JavaScript in a variety of environments.',
      color: '#90c53f',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'RxJS is a library for reactive programming using Observables, for asynchronous operations.',
      color: '#eb428e',
    },
    {
      id: 'typescript',
      name: 'typescript',
      description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
      color: '#257acc',
    },
    {
      id: 'reactjs',
      name: 'reactjs',
      description: 'React is an open source JavaScript library used for designing user interfaces.',
      color: '#61dbfa',
    },
    {
      id: 'gatsby',
      name: 'Gatsby.js',
      description: 'A framework built over ReactJS to generate static page web application.  ',
      color: '#6f309f',
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'A markup language that powers the web. All websites use HTML for structuring the content.',
      color: '#dd3431',
    },
    {
      id: 'css',
      name: 'css',
      description: 'CSS is used to style the HTML element and to give a very fancy look for the web application.',
      color: '#43ace0',
    },
    {
      id: 'python',
      name: 'python',
      description: 'A general purpose programming language that is widely used for developing various applications.',
      color: '#f9c646',
    },
  ],
};
