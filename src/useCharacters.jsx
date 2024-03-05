import { useState, useEffect } from "react";
import Jikan from "jikan4.js";

export function useCharacters(searchAnime) {
  const [characters, setCharacters] = useState([]);
  useEffect(
    function () {
      const client = new Jikan.Client();
      async function getAnimeData() {
        try {
          const result = await client.anime.search(searchAnime);
          // console.log(result);
          const anime = result[0];
          anime
            .getCharacters()
            .then((result) => {
              // Now you can access specific properties, for example:
              const fullCharacterArray = result; // Assuming the result is an array
              const characterArray = fullCharacterArray.map(
                (characters) => characters.character
              );
              console.log(characterArray);
              setCharacters(characterArray); // Accessing the name property of the first character
            })
            .catch((error) => {
              // Handle any errors that occurred during the Promise execution
              console.error(error);
            });

          // console.log(anime);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      getAnimeData();
    },
    [searchAnime]
  );

  return { characters };
}
