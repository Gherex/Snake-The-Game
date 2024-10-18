import { useRef, useEffect } from "react";
import { useSnakeMovement } from "../hooks/useSnakeMovement";
import JuegoTerminado from "./JuegoTerminado";

const ARR_CUADRICULA = new Array(576).fill(null);

function Cuadricula({ onPlay, onGameOver }) {
  const {
    arraySnake,
    posComida,
    direccion,
    endGame,
    puntos,
    setDireccion,
    startGame,
    resetGame,
  } = useSnakeMovement(onGameOver, onPlay, 400);

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  function handleKeyDown(event) {
    const keyMap = {
      w: "up",
      W: "up",
      ArrowUp: "up",
      a: "left",
      A: "left",
      ArrowLeft: "left",
      s: "down",
      S: "down",
      ArrowDown: "down",
      d: "right",
      D: "right",
      ArrowRight: "right",
    };

    const newDirection = keyMap[event.key];
    if (
      newDirection &&
      newDirection !== direccion &&
      !(
        (direccion === "up" && newDirection === "down") ||
        (direccion === "down" && newDirection === "up") ||
        (direccion === "left" && newDirection === "right") ||
        (direccion === "right" && newDirection === "left")
      )
    ) {
      setDireccion(newDirection);
    }
    startGame();
  }

  return endGame ? (
    <JuegoTerminado puntos={puntos} resetGame={resetGame} />
  ) : (
    <div
      ref={divRef}
      className="grid grid-cols-24 grid-rows-24 gap-1 sm:gap-1 min-w-70"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      style={{ outline: "none" }}
    >
      {ARR_CUADRICULA.map((_, index) => {
        if (index === posComida) {
          return (
            <div
              key={index}
              className="bg-red-900 border-2 border-black w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
            ></div>
          );
        } else if (arraySnake.includes(index)) {
          return (
            <div
              key={index}
              className="bg-black border border-white w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
            ></div>
          );
        } else {
          return (
            <div
              key={index}
              className="bg-cyan-600 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
            ></div>
          );
        }
      })}
    </div>
  );
}

export default Cuadricula;
