const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeInUp2: {
          "0%": {
            opacity: "0",
            transform: "translateY(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(-50px)",
          },
          "100%": {
            opacity: "0.7",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        fadeInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
        },
        zoomInBg: {
          "0%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        zoomInInner: {
          "0%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        fadeInUp2: "fadeInUp2 1s ease forwards",
        fadeInUp: "fadeInUp 1s ease forwards",
        fadeInDown: "fadeInDown 1s ease forwards",
        fadeInLeft: "fadeInLeft 1s ease forwards",
        fadeInRight: "fadeInRight 1s ease forwards",
        zoomInBg: "zoomInBg 1.5s ease forwards",
        zoomInInner: "zoomInInner 1s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
