/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors:{
                "D1": "#d1d1d1",
                "29": "#292929",
                "EE": "#EEEEEE",
                "E1": "#E1E1E1",
                "76": "#767676",
                "55": "#555555",
                "12": "#121212",
                "18": "#181818",
                "1E": "#1E1E1E",
                "F5": "#F5F5F5",
                "CE": "#CECECE",
                "2A": "#2A2A2A",
                "E0": "#E0E0E0",
                "F2": "#F2F2F2"
            },
        },
    },
    darkMode: "class",

    plugins: [],
}