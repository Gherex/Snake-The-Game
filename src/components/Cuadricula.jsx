import { useRef, useState, useEffect } from "react";

const ARR_CUADRICULA = new Array(576).fill(null);
const ARR_BORDE_SUPERIOR = Array.from({ length: 24 }, (_, index) => index); // de 0 a 23
const ARR_BORDE_INFERIOR = Array.from({ length: 24 }, (_, index) => index + 552); // de 552 a 575
const ARR_BORDE_IZQUIERDO = Array.from({ length: 24 }, (_, index) => index * 24); // de 0 a 552 con incremento de 24
const ARR_BORDE_DERECHO = Array.from({ length: 24 }, (_, index) => 23 + index * 24); // de 23 a 575 con incremento de 24

function Cuadricula({ onPlay, onGameOver }) {
  const [posicionesTablero, setPosicionesTablero] = useState(
    new Array(576).fill(false)
  );
  const [arraySnake, setArraySnake] = useState([250, 251, 252]);
  const [posCabeza, setPosCabeza] = useState(252);
  const [direccion, setDireccion] = useState("right");
  const [posComida, setPosComida] = useState(null);
  const divRef = useRef(null);
  const [iniciarJuego, setIniciarJuego] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [velVibora, setVelVibora] = useState(400);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
    return () => {
      setPosicionesTablero(new Array(576).fill(false));
      setDireccion("right");
      setIniciarJuego(false);
    };
  }, []);

  useEffect(() => {
    const newPosTablero = new Array(576).fill(false);
    arraySnake.forEach((pos) => {
      if (pos < newPosTablero.length) {
        newPosTablero[pos] = true;
      }
    });
    setPosicionesTablero(newPosTablero);
  }, [arraySnake]);

  useEffect(() => {
    if (posComida === null) {
      let pos;
      do {
        pos = Math.floor(Math.random() * 576);
      } while (arraySnake.includes(pos));
      setPosComida(pos);
    }
  }, [posComida, arraySnake]);

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
    setIniciarJuego(true);
    onPlay(true);
  }

  useEffect(() => {
    let intervalId = null;

    function moverVibora() {
      let newArraySnake = [...arraySnake];
      let newPosCabeza = posCabeza;

      // Lógica de dirección y movimiento
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

      // Detecta si la víbora toca la comida
      if (newPosCabeza === posComida) {
        setPosComida(null);
        setPuntos(puntos + 10);
      } else {
        newArraySnake.shift(); // Quita la cola si no ha comido
      }

      // Detecta colisiones con el cuerpo
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

  function handleMenuClick() {
    setPosicionesTablero(new Array(576).fill(false));
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

  return endGame ? (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-slate-700 text-xl font-bold">
      <p className="mb-4 select-none">¡Juego terminado!</p>
      <p className="mb-4">Puntuación final: {puntos}</p>
      <button
        className="bg-cyan-950 p-4 border border-solid border-white rounded-xl text-white select-none hover:bg-slate-900"
        onClick={handleMenuClick}
      >
        Volver al menú
      </button>
    </div>
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
        } else if (posicionesTablero[index]) {
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
