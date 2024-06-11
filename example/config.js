module.exports = {
  // pathPrefix: "/gatsby-theme-academic",
  siteUrl: "https://huskydoge.github.io",
  title: "HuskyDoge",
  description: "Personal Website of Benhao Huang",
  author: "HuskyDoge",
  authorAlternative: "Benhao Huang",
  introduction: [
    "Hello! Husky Here! I'm a junior student at [Shanghai Jiao Tong University](https://en.sjtu.edu.cn/)(SJTU), majoring in Computer Science. I'm currently collaborating with Professor [Jiaqi Ma](https://jiaqima.github.io/) at UIUC; before this, I had a wonderful research experience at Professor [Quanshi Zhang](http://qszhang.com/)'s [XAI Lab](https://sjtu-xai-lab.github.io/).",
    "My research interests include Instruction Following, RLHF, AI explainability, and interesting applications of LLMs, and I warmly welcome any invitations to further discussions!",
    "I am now preparing my MS/PhD applications for Fall 2025, so if interested, please drop me an email!",
    "### 📅 News \n * I will be visiting UCSD as an intern supervised by [Zhiting Hu](http://zhiting.ucsd.edu/) this summer!",
  ],
  avatar: "/avatar.png",
  professions: ["Junior Student"],
  tocMaxDepth: 2,
  excerptMaxLength: 500,
  // birthday: "Some day",
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
      icon: "google-scholar",
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
      date: "Sept 2021 - Current",
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
      icon: "cubes",
      title: "LLM",
    },
    {
      icon: "layer-group",
      title: "Explainability",
    },
    {
      icon: "user",
      title: "RLHF",
    },
  ],
  experience: [
    {
      title: "Internship",
      position: "left",
      data: [
        {
          date: "March 2024 - June 2024",
          title: "Research Intern @ Moonshot AI",
          location: "Somewhere",
          description:
            "Experimented and validated the LLM's ability on responding to contrafactual instructions, explored the possiblity of MindSteal of LLMs.",
        },
      ],
    },
    {
      title: "Teaching",
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
      date: "2023",
      title: "Rui Yuan Hong Shan Scholarship (20000¥, rank 3/129)",
    },
    {
      date: "2022",
      title: "Shao Qiu Scholarship (10000 ¥, rank 5/129)",
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
