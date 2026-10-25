// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/Bikram-Portfolio/";
    },
  },{id: "nav-projects",
          title: "Projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/projects/";
          },
        },{id: "nav-contact",
          title: "Contact",
          description: "Contact details of Bikram Dholey — Research Scholar in Mathematics, Jadavpur University.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/contact/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/cv/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Summary of my academic teaching experience at Brainware University.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/teaching/";
          },
        },{id: "nav-memories",
          title: "Memories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/memories/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Published research papers and featured visuals.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/Bikram-Portfolio/publications/";
          },
        },{id: "projects-morse-theory",
          title: 'Morse Theory',
          description: "A tool to study the topological structure of smooth manifolds.",
          section: "Projects",handler: () => {
              window.location.href = "/Bikram-Portfolio/projects/Morse-theory/";
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
