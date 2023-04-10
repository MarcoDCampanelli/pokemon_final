import { useState, useEffect, createContext } from "react";

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

  // This will fetch a list of all items that can be held as well as all natures
  const [items, setItems] = useState("");
  const [itemType, setItemType] = useState("");
  useEffect(() => {
    if (itemType) {
      fetch(`https://pokeapi.co/api/v2/item-category/${itemType}/`)
        .then((res) => res.json())
        .then((resData) => {
          setItems(resData.items);
        });
    }
  }, [itemType]);

  // This will fetch a list of all natures in the game
  const [natures, setNatures] = useState("");
  useEffect(() => {
    fetch(" https://pokeapi.co/api/v2/nature/?offset=0&limit=25")
      .then((res) => res.json())
      .then((resData) => {
        setNatures(
          resData.results.map((result) => {
            return result.name;
          })
        );
      });
  }, []);

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

  // This array holds the list of all itemCategories being used in this app
  const itemCategories = [
    { value: "held-items", name: "Held Items" },
    { value: "medicine", name: "Medicine" },
    { value: "type-protection", name: "Damage Reduction" },
    { value: "choice", name: "Choice" },
    { value: "bad-held-items", name: "Negative Held Items" },
    { value: "plates", name: "Arceus Plates" },
    { value: "species-specific", name: "Species Specific" },
    { value: "type-enhancement", name: "Type Buff" },
    { value: "jewels", name: "Gems" },
    { value: "mega-stones", name: "Mega Stones" },
    { value: "z-crystals", name: "Z-Crystals" },
  ];

  // !Keeping this just in case!!!!!
  // The array that holds all possible Pokemon natures
  // const natures = [
  //   "hardy",
  //   "lonely",
  //   "brave",
  //   "adamant",
  //   "naughty",
  //   "bold",
  //   "docile",
  //   "relaxed",
  //   "impish",
  //   "lax",
  //   "timid",
  //   "hasty",
  //   "serious",
  //   "jolly",
  //   "naive",
  //   "modest",
  //   "mild",
  //   "quiet",
  //   "bashful",
  //   "rash",
  //   "calm",
  //   "gentle",
  //   "sassy",
  //   "careful",
  //   "quirky",
  // ];

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

  // The next 3 constants are to calculate stats based on natures
  // 1. This is the original object to hold the static nature values
  const natureWorth = {
    atk: 1,
    def: 1,
    spAtk: 1,
    spDef: 1,
    spd: 1,
  };

  // Here is the state that holds them and allows us to change them
  const [natureValues, setNatureValues] = useState(natureWorth);

  // This function will adjust the nature values based on the chosen nature
  const changeNatureValues = (nature) => {
    if (
      nature === "hardy" ||
      nature === "docile" ||
      nature === "serious" ||
      nature === "bashful" ||
      nature === "quirky"
    ) {
      setNatureValues({ ...natureWorth });
    }
    if (nature === "lonely") {
      setNatureValues({ ...natureWorth, atk: 1.1, def: 0.9 });
    }
    if (nature === "brave") {
      setNatureValues({ ...natureWorth, atk: 1.1, spd: 0.9 });
    }
    if (nature === "adamant") {
      setNatureValues({ ...natureWorth, atk: 1.1, spAtk: 0.9 });
    }
    if (nature === "naughty") {
      setNatureValues({ ...natureWorth, atk: 1.1, spDef: 0.9 });
    }
    if (nature === "bold") {
      setNatureValues({ ...natureWorth, def: 1.1, atk: 0.9 });
    }
    if (nature === "relaxed") {
      setNatureValues({ ...natureWorth, def: 1.1, spd: 0.9 });
    }
    if (nature === "impish") {
      setNatureValues({ ...natureWorth, def: 1.1, spAtk: 0.9 });
    }
    if (nature === "lax") {
      setNatureValues({ ...natureWorth, def: 1.1, spDef: 0.9 });
    }
    if (nature === "timid") {
      setNatureValues({ ...natureWorth, spd: 1.1, atk: 0.9 });
    }
    if (nature === "hasty") {
      setNatureValues({ ...natureWorth, spd: 1.1, def: 0.9 });
    }
    if (nature === "jolly") {
      setNatureValues({ ...natureWorth, spd: 1.1, spAtk: 0.9 });
    }
    if (nature === "naive") {
      setNatureValues({ ...natureWorth, spd: 1.1, spDef: 0.9 });
    }
    if (nature === "modest") {
      setNatureValues({ ...natureWorth, spAtk: 1.1, atk: 0.9 });
    }
    if (nature === "mild") {
      setNatureValues({ ...natureWorth, spAtk: 1.1, def: 0.9 });
    }
    if (nature === "quiet") {
      setNatureValues({ ...natureWorth, spAtk: 1.1, spd: 0.9 });
    }
    if (nature === "rash") {
      setNatureValues({ ...natureWorth, spAtk: 1.1, spDef: 0.9 });
    }
    if (nature === "calm") {
      setNatureValues({ ...natureWorth, spDef: 1.1, atk: 0.9 });
    }
    if (nature === "gentle") {
      setNatureValues({ ...natureWorth, spDef: 1.1, def: 0.9 });
    }
    if (nature === "sassy") {
      setNatureValues({ ...natureWorth, spDef: 1.1, spd: 0.9 });
    }
    if (nature === "careful") {
      setNatureValues({ ...natureWorth, spDef: 1.1, spAtk: 0.9 });
    }
  };

  // These are naming exceptions needed since they are added to certain pokemon to specify a type even though all that is needed is the species name and not the specification of the pokemon.
  const nameExceptions = [
    "normal",
    "attack",
    "defense",
    "speed",
    "plant",
    "thrash",
    "sandy",
    "altered",
    "origin",
    "land",
    "sky",
    "red",
    "blue",
    "striped",
    "standard",
    "zen",
    "mode",
    "incarnate",
    "ordinary",
    "aria",
    "pirouette",
    "male",
    "female",
    "shield",
    "blade",
    "small",
    "average",
    "super",
    "large",
    "50",
    "meteor",
    "disguised",
    "amped",
    "ice",
    "therian",
    "black",
    "white",
    "resolute",
    "mega",
    "primal",
    "alola",
    "ash",
    "battle",
    "power",
    "complete",
    "busted",
    "original",
    "dusk",
    "dawn",
    "ultra",
    "galar",
    "10",
    "gulping",
    "gorging",
    "low",
    "noice",
    "crowned",
    "eternamax",
    "dada",
    "ice",
    "shadow",
    "hisui",
    "paldea",
    "hero",
    "segment",
    "family",
    "droopy",
    "stretchy",
    "plumage",
  ];

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        capAndRemoveHyphen,
        generations,
        itemCategories,
        natures,
        calculateStat,
        calculateHealth,
        natureValues,
        changeNatureValues,
        nameExceptions,
        items,
        itemType,
        setItemType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
