// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-contact",
          title: "Contact",
          description: "Contact details of Bikram Dholey — Research Scholar in Mathematics, Jadavpur University.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/contact/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum vitae, kept up to date from my Overleaf CV. Use the PDF button to download it.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Summary of my academic teaching experience at Brainware University.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-memories",
          title: "Memories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/memories/";
          },
        },{id: "nav-research",
          title: "Research",
          description: "Research specialization, publications and projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-admin",
          title: "Admin",
          description: "Edit the website — sign in with the site owner&#39;s GitHub account.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/admin/";
          },
        },{id: "projects-morse-theory",
          title: 'Morse Theory',
          description: "A tool to study the topological structure of smooth manifolds.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Morse-theory/";
            },},{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-',
        title: '',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
