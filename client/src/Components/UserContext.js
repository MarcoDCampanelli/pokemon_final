import { useState, createContext } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    return user ? user : null;
  });

  // This will capitalize the first word and remove all hypens in a string of words
  const capAndRemoveHyphen = (name) => {
    return name
      .replaceAll("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // This array holds the list of all generations being used in this app
  const generations = [
    { name: "Red/Blue", value: "red-blue" },
    { name: "Yellow", value: "yellow" },
    { name: "Gold/Silver", value: "gold-silver" },
    { name: "Crystal", value: "crystal" },
    { name: "Ruby/Sapphire", value: "ruby-sapphire" },
    { name: "Emerald", value: "emerald" },
    { name: "FireRed/LeafGreen", value: "firered-leafgreen" },
    { name: "Diamond/Pearl", value: "diamond-pearl" },
    { name: "Platinum", value: "platinum" },
    { name: "HeartGold/SoulSilver", value: "heartgold-soulsilver" },
    { name: "Black/White", value: "black-white" },
    { name: "Black2/White2", value: "black-2-white-2" },
    { name: "X/Y", value: "x-y" },
    { name: "OmegaRuby/AlphaSapphire", value: "omega-ruby-alpha-sapphire" },
    { name: "Sun/Moon", value: "sun-moon" },
    { name: "UltraSun/UltraMoon", value: "ultra-sun-ultra-moon" },
    { name: "Sword/Shield", value: "sword-shield" },
    { name: "Scarlet/Violet", value: "scarlet-violet" },
  ];

  // The array that holds all possible Pokemon natures
  const natures = [
    "hardy",
    "lonely",
    "brave",
    "adamant",
    "naughty",
    "bold",
    "docile",
    "relaxed",
    "impish",
    "lax",
    "timid",
    "hasty",
    "serious",
    "jolly",
    "naive",
    "modest",
    "mild",
    "quiet",
    "bashful",
    "rash",
    "calm",
    "gentle",
    "sassy",
    "careful",
    "quirky",
  ];

  // This formula will calculate the pokemon's atk, def, spAtk, spDef and spd stat
  const calculateStat = (stat, iv, ev, level, nature) => {
    return Math.floor(
      (Math.floor(0.01 * (2 * stat + iv + Math.floor(0.25 * ev)) * level) + 5) *
        nature
    );
  };

  // This formula will calculate the pokemon's hp stat
  const calculateHealth = (stat, iv, ev, level) => {
    return (
      Math.floor(0.01 * (2 * stat + iv + Math.floor(0.25 * ev)) * level) +
      level +
      10
    );
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        capAndRemoveHyphen,
        generations,
        natures,
        calculateStat,
        calculateHealth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
