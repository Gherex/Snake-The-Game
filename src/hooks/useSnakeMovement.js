import { useEffect, useState } from "react";

const ARR_BORDE_SUPERIOR = Array.from({ length: 24 }, (_, index) => index);
const ARR_BORDE_INFERIOR = Array.from({ length: 24 }, (_, index) => index + 552);
const ARR_BORDE_IZQUIERDO = Array.from({ length: 24 }, (_, index) => index * 24);
const ARR_BORDE_DERECHO = Array.from({ length: 24 }, (_, index) => 23 + index * 24);

export function useSnakeMovement(onGameOver, onPlay, velViboraInicial) {
  const [arraySnake, setArraySnake] = useState([250, 251, 252]);
  const [posCabeza, setPosCabeza] = useState(252);
  const [direccion, setDireccion] = useState("right");
  const [posComida, setPosComida] = useState(null);
  const [iniciarJuego, setIniciarJuego] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [velVibora, setVelVibora] = useState(velViboraInicial);

  // Función para generar nueva posición de comida
  useEffect(() => {
    if (posComida === null) {
      let pos;
      do {
        pos = Math.floor(Math.random() * 576);
      } while (arraySnake.includes(pos));
      setPosComida(pos);
    }
  }, [posComida, arraySnake]);

  useEffect(() => {
    let intervalId = null;

    function moverVibora() {
      let newArraySnake = [...arraySnake];
      let newPosCabeza = posCabeza;

      if (direccion === "right") {
        newPosCabeza = ARR_BORDE_DERECHO.includes(newPosCabeza)
          ? newPosCabeza - 23
          : newPosCabeza + 1;
      } else if (direccion === "left") {
        newPosCabeza = ARR_BORDE_IZQUIERDO.includes(newPosCabeza)
          ? newPosCabeza + 23
          : newPosCabeza - 1;
      } else if (direccion === "up") {
        newPosCabeza = ARR_BORDE_SUPERIOR.includes(newPosCabeza)
          ? newPosCabeza + 552
          : newPosCabeza - 24;
      } else if (direccion === "down") {
        newPosCabeza = ARR_BORDE_INFERIOR.includes(newPosCabeza)
          ? newPosCabeza - 552
          : newPosCabeza + 24;
      }

      if (newPosCabeza === posComida) {
        setPosComida(null);
        setPuntos(puntos + 10);
      } else {
        newArraySnake.shift(); // Quita la cola si no ha comido, para simular movimiento hacia adelante
      }

      if (newArraySnake.includes(newPosCabeza)) {
        onGameOver(true);
        setEndGame(true);
        clearInterval(intervalId);
        return;
      }

      newArraySnake.push(newPosCabeza);
      setArraySnake(newArraySnake);
      setPosCabeza(newPosCabeza);
      setVelVibora((prevVel) => (prevVel > 50 ? prevVel - 1 : prevVel));
    }

    if (iniciarJuego) {
      intervalId = setInterval(moverVibora, velVibora);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    iniciarJuego,
    direccion,
    posCabeza,
    arraySnake,
    posComida,
    onGameOver,
    velVibora,
    puntos,
  ]);

  function startGame() {
    setIniciarJuego(true);
    onPlay(true);
  }

  function resetGame() {
    setArraySnake([250, 251, 252]);
    setPosCabeza(252);
    setDireccion("right");
    setPosComida(null);
    setIniciarJuego(false);
    setEndGame(false);
    setPuntos(0);
    onGameOver(false);
    onPlay(false);
  }

  return {
    arraySnake,
    posCabeza,
    posComida,
    direccion,
    iniciarJuego,
    endGame,
    puntos,
    velVibora,
    setDireccion,
    startGame,
    resetGame,
  };
}
