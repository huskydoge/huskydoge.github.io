module.exports = {
  // pathPrefix: "/gatsby-theme-academic",
  siteUrl: "https://huskydoge.github.io",
  title: "HuskyDoge",
  description: "Personal Website of Benhao Huang",
  author: "HuskyDoge",
  authorAlternative: "Benhao Huang",
  introduction: [
    "Hello! Husky here! I'm an incoming student in the CMU MSML program. Throughout my research journey, I've explored a variety of topics. Currently, my primary focus is on generative world modeling, where I have been working with Professor [Zhiting Hu](http://zhiting.ucsd.edu/) on World Model Projects. Prior to this, I collaborated with my amazing supervisor [Jiaqi W. Ma](https://jiaqima.github.io/) at the [TRAIS Lab](https://github.com/TRAIS-Lab), focusing on dataset curation using LLM agents. I also had a valuable research experience in AI interpretability at Professor [Quanshi Zhang](http://qszhang.com/)'s [XAI Lab](https://sjtu-xai-lab.github.io/).",
    
    "Within world modeling, I'm particularly(currently) interested in the following directions: \n - How can we enable world models to operate effectively in **long-sequence scenarios**? This includes both looking ahead (simulating long trajectories) and looking back (designing effective memory mechanisms).\n - How can we make world models **real-time interactive**? This is especially crucial for real world applications, and I find both the mathematical and ML systems perspectives fascinating.\n - How can we make world models more **physically grounded**? I'm excited to explore data-driven approaches, RLHF, and other emerging methods.",
    
    "If you're also passionate about these areas, feel free to reach out! I'm always open to collaborations and eager to gain more experience along the way. "
  ],
  avatar: "/avatar.png",
  professions: [
    {
      name: "MAITRIX",
      url: "https://maitrix.org/" 
    },
    {
      name: "TRAIS",
      url: "https://github.com/TRAIS-Lab"
    },
    {
      name: "SJTU-XAI",
      url: "https://sjtu-xai-lab.github.io/"
    },
  ],
  tocMaxDepth: 2,
  excerptMaxLength: 50,
  // birthday: "xxxx",
  location: "Shanghai, China",
  // email: "huskydogewoof@gmail.com",
  postsForArchivePage: 3,
  defaultLanguage: "en",
  disqusScript:
    process.env.DISQUS_SCRIPT || "https://tc-imba.disqus.com/embed.js",
  pages: {
    home: "/",
    posts: "posts",
    contact: "contact",
    resume: "resume",
    tags: "tags",
    research: "research",
    project: "project",
    contact: "contact",
  },
  social: [
    {
      url: "/resume.pdf",
      icon: ["ai", "cv"],
    },
    {
      url: "https://github.com/huskydoge",
      icon: ["fab", "github"],
    },
    {
      url: "https://x.com/huskydogewoof",
      icon: ["fab", "twitter"],
    },
    {
      url: "https://scholar.google.com/citations?user=SiAFHb8AAAAJ&hl=zh-CN",
      icon: ["fa", "graduation-cap"],
    },
    {
      url: "https://www.linkedin.com/in/benhao-h-6534b629a/",
      icon: ["fab", "linkedin"],
    },
    {
      url: "mailto:hbh001098hbh@sjtu.edu.cn",
      icon: "envelope",
    },
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  wakatime: {
    username: "tcimba",
    activity: "7add4047-08f9-4da8-b649-aa114503678f",
    language: "460a84ab-722a-4b80-b896-cabaa13ad7eb",
    editor: "d851639a-28d8-4884-949f-d338a858f7e9",
    os: "caf7d0d1-8fd2-4595-a991-363c8583fea9",
  },
  contactFormUrl:
    process.env.CONTACT_FORM_ENDPOINT ||
    "https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451",
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || "G-ZK3P43DY6M",
  education: [
    {
      date: "Aug 2025 - Feb 2027 (expected)",
      icon: "university",
      title: "M.S. in Machine Learning",
      location: "Carnegie Mellon University"
    },
    {
      date: "Sept 2021 - July 2025",
      icon: "university",
      title: "B.S.E. in Computer Science",
      location: "Shanghai Jiao Tong University",
    },
    {
      date: "Sept 2018 - June 2021",
      icon: "school",
      title: "High School",
      location: "Zhejiang Ruian High School",
    },
  ],
  interests: [
    {
      icon: "brain",
      title: "World Model, Reasoning and Planning"
    },
    {
      icon: "cubes",
      title: "Data-centric AI, AI Automation",
    },
    {
      icon: "layer-group",
      title: "Efficient ML, Long Sequence Modeling",
    }
  ],
  experience: [
    {
      title: "Internship",
      position: "left",
      data: [
        {
          date: "Mar. 2025 - May. 2025",
          title: "[VCG Group](https://vcg.seas.harvard.edu/), Harvard",
          location: "Cambridge, MA, USA",
        },
        {
          date: "Jun. 2024 - Mar. 2025",
          title: "[Maitrix.org](https://github.com/maitrix-org), UCSD",
          location: "San Diego, CA, USA",
        },
        {
          date: "Mar. 2024 - Jun. 2024",
          title: "Research Intern @ [Moonshot AI](https://www.moonshot.cn/)",
          location: "remote",
        },
        {
          date: "Nov. 2023 - Sept. 2024",
          title: "[TRAIS Lab](https://github.com/TRAIS-Lab), UIUC",
          location: "remote",
        },
        {
          date: "Feb. 2023 - Jan. 2024",
          title: "[XAI Lab](https://sjtu-xai-lab.github.io/), SJTU",
          location: "Shanghai, China",
        },
      ],
    },
    {
      title: "Teaching & Tutoring",
      position: "right",
      data: [
        {
          date: "June 2024",
          title: " Group Tutor of Advanced Mathematics",
          location: "Shanghai Jiao Tong University, China",
        },
        {
          date: "Dec 2023",
          title:
            "Personal Tutor of CS2612, Programming Languages and Compilers ",
          location: "Shanghai Jiao Tong University, China",
        },
      ],
    },
    {
      title: "Volunteer",
      position: "left",
      data: [
        {
          date: "2022 ~ 2024",
          title: "Volunteer of Shanghai Marathon",
          location: "Shanghai, China",
        },
      ],
    },
  ],
  awards: [
    {
      date: "2024",
      title: "National Scholarship (Top 0.2% nationwide)",
    },
    {
      date: "2023",
      title: "Rui Yuan Hong Shan Scholarship (Top 2%, SJTU)",
    },
    {
      date: "2022",
      title: "Shao Qiu Scholarship (Top 4%, SJTU)",
    },
    {
      date: "2022",
      title: "Meritorious Winner of MCM/ICM",
    },
  ],
  tagColors: [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ],
  tags: [
    {
      id: "javascript",
      name: "javascript",
      description:
        "JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.",
      color: "#f0da50",
    },
    {
      id: "nodejs",
      name: "Node.js",
      description:
        "Node.js is a tool for executing JavaScript in a variety of environments.",
      color: "#90c53f",
    },
    {
      id: "rxjs",
      name: "RxJS",
      description:
        "RxJS is a library for reactive programming using Observables, for asynchronous operations.",
      color: "#eb428e",
    },
    {
      id: "typescript",
      name: "typescript",
      description:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
      color: "#257acc",
    },
    {
      id: "reactjs",
      name: "reactjs",
      description:
        "React is an open source JavaScript library used for designing user interfaces.",
      color: "#61dbfa",
    },
    {
      id: "gatsby",
      name: "Gatsby.js",
      description:
        "A framework built over ReactJS to generate static page web application.  ",
      color: "#6f309f",
    },
    {
      id: "html",
      name: "HTML",
      description:
        "A markup language that powers the web. All websites use HTML for structuring the content.",
      color: "#dd3431",
    },
    {
      id: "css",
      name: "css",
      description:
        "CSS is used to style the HTML element and to give a very fancy look for the web application.",
      color: "#43ace0",
    },
    {
      id: "python",
      name: "python",
      description:
        "A general purpose programming language that is widely used for developing various applications.",
      color: "#f9c646",
    },
  ],
};
