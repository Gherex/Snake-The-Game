import { useState } from "react";
import Cuadricula from "./Cuadricula";

function Game() {
  const [playing, setPlaying] = useState(false);
  const [endGame, setEndGame] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center">
      {!endGame && (
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white animate-bounce">
          Snake The Game
        </h1>
      )}
      <Cuadricula onGameOver={setEndGame} onPlay={setPlaying} />
      {!playing && (
        <p className="text-sm sm:text-base md:text-lg mt-1 text-white select-none animate-pulse">
          Haz click dentro del tablero y toca una tecla para comenzar...
        </p>
      )}
    </div>
  );
}

export default Game;
