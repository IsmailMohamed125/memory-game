/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useCharacters } from "./useCharacters";
import "./App.css";

function App() {
  const { characters } = useCharacters("one punch man");
  const [isActive, setIsActive] = useState(false);
  const [numCharacters, setNumCharacters] = useState("");
  const [highscore, setHighscore] = useState(0);

  function setMode(mode) {
    mode === "Easy"
      ? setNumCharacters(5)
      : mode === "Medium"
      ? setNumCharacters(10)
      : mode === "Hard"
      ? setNumCharacters(20)
      : null;

    setIsActive(true);
  }

  return (
    <>
      {!isActive ? (
        <div className="video-container">
          <video autoPlay muted loop id="video-bg">
            <source
              src="images/saitama-stupid-face-onepunch-man-moewalls-com.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="content">
            <div className="content-name">Memory Game</div>
            <div className="buttons-container">
              <Buttons setMode={setMode}>Easy</Buttons>
              <Buttons setMode={setMode}>Medium</Buttons>
              <Buttons setMode={setMode}>Hard</Buttons>
            </div>
          </div>
        </div>
      ) : (
        <div className="game">
          <CharacterList
            characters={characters}
            numCharacters={numCharacters}
            gameState={setIsActive}
            highscore={highscore}
            setHighscore={setHighscore}
          />
        </div>
      )}
    </>
  );
}

export default App;

function CharacterList({
  characters,
  numCharacters,
  gameState,
  highscore,
  setHighscore,
}) {
  const [orderedCharacters, setOrderedCharacters] = useState([]);
  const [clickedCharacters, setClickedCharacters] = useState([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const characterLimit = characters.filter(
      (_, index) => index < numCharacters
    );
    setOrderedCharacters(characterLimit);
  }, [characters, numCharacters]);

  const handleCharacterClick = (name) => {
    if (clickedCharacters.includes(name)) {
      handleRepeatCharacter();
    } else {
      setScore((prevScore) => prevScore + 1);
      setClickedCharacters((prevCharacters) => [...prevCharacters, name]);
    }

    setOrderedCharacters((prevCharacters) => {
      const newOrder = [...prevCharacters];
      for (let i = newOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
      }
      return newOrder;
    });
  };

  function handleRepeatCharacter() {
    setIsActive(false);
  }

  function handlePlayAgain() {
    setScore(0);
    setClickedCharacters([]);
    setIsActive(true);
  }

  function handleQuit() {
    gameState(false);
  }

  useEffect(() => {
    if (score > highscore) {
      setHighscore(score);
    }
  }, [score, highscore, setHighscore]);

  useEffect(() => {
    console.log(score, numCharacters);
    if (score === numCharacters) {
      setWin(true);
      setIsActive(false);
    }
  }, [score, numCharacters]);

  useEffect(() => {
    if (isActive) {
      setWin(false);
    }
  }, [isActive]);

  return (
    <>
      <div className="header">
        <div className="header-logo">
          <img
            src="images/One Punch Man.svg"
            alt="One punch man"
            className="logo"
          />
        </div>
        <div className="header-current-score">Score: {score}</div>
        <div className="header-highscore">Highscore: {highscore}</div>
      </div>
      <div className="characters-container">
        <ul className="characters">
          {orderedCharacters.map((character, index) => (
            <Character
              key={index}
              character={character}
              onClick={() => handleCharacterClick(character)}
            />
          ))}
        </ul>
      </div>
      {isActive ? null : (
        <div className="overlay">
          <div className="message-container">
            <div className="message-content">
              <div className="message-result">
                {win ? "You win" : "You lose"}
              </div>
              <div className="message-score">
                Your score was {score} / {numCharacters}
              </div>
            </div>
            <div className="action-buttons">
              <button className="button" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button className="button" onClick={handleQuit}>
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Character({ character, onClick }) {
  return (
    <li className="character-container" onClick={() => onClick(character.name)}>
      <img
        src={character.image.webp.default.href}
        alt="character"
        className="character-image"
      />
      <p className="character-name">{character.name}</p>
    </li>
  );
}

function Buttons({ children, setMode }) {
  return (
    <button className="button" onClick={() => setMode(children)}>
      {children}
    </button>
  );
}
