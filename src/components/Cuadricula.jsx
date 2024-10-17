import { useRef, useState, useEffect } from "react";
const ARR_CUADRICULA = new Array(576).fill(null);
const ARR_BORDE_SUPERIOR = Array.from({ length: 24 }, (_, index) => index); // de 0 a 23
const ARR_BORDE_INFERIOR = Array.from(
  { length: 24 },
  (_, index) => index + 552
); // de 552 a 575
const ARR_BORDE_IZQUIERDO = Array.from(
  { length: 24 },
  (_, index) => index * 24
); // de 0 a 552 con incremento de 24
const ARR_BORDE_DERECHO = Array.from(
  { length: 24 },
  (_, index) => 23 + index * 24
); // de 23 a 575 con incremento de 24

function Cuadricula({ onPlay, onGameOver }) {
  let [posicionesTablero, setPosicionesTablero] = useState(
    new Array(576).fill(false)
  );
  let [arraySnake, setArraySnake] = useState([250, 251, 252]);
  let [posCabeza, setPosCabeza] = useState(252);
  let [direccion, setDireccion] = useState("right"); // posibles valores: left | right | up | down
  let [posComida, setPosComida] = useState(null); // Inicializa la comida como null
  const divRef = useRef(null); // Referencia al div
  let [iniciarJuego, setIniciarJuego] = useState(false);
  let [endGame, setEndGame] = useState(false);
  let [puntos, setPuntos] = useState(0);

  /* Posicion inicial de la vibora */
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus(); // Focaliza el div al montarse
    }
    return () => {
      setPosicionesTablero(new Array(576).fill(false));
      setDireccion("right");
      setIniciarJuego(false);
    };
  }, []);

  useEffect(() => {
    let newPosTablero = new Array(576).fill(false);
    arraySnake.forEach((pos) => {
      if (pos <= newPosTablero.length) {
        newPosTablero[pos] = true;
      }
    });
    setPosicionesTablero(newPosTablero);
  }, [arraySnake]);

  // efecto para generar la posición aleatoria de la comida
  useEffect(() => {
    function generarPosicionAleatoria() {
      let pos;
      do {
        pos = Math.floor(Math.random() * 576);
      } while (arraySnake.includes(pos)); // para que la comida no aparezca en la vibora
      setPosComida(pos);
    }

    // Generar comida al inicio del juego
    if (posComida === null) {
      generarPosicionAleatoria();
    }
  }, [posComida, arraySnake]);

  function handleKeyDown(event) {
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp")
      if (direccion !== "up" && direccion !== "down") setDireccion("up");
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft")
      if (direccion !== "left" && direccion !== "right") setDireccion("left");
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown")
      if (direccion !== "down" && direccion !== "up") setDireccion("down");
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight")
      if (direccion !== "right" && direccion !== "left") setDireccion("right");

    setIniciarJuego(true);
    onPlay(true);
  }

  useEffect(() => {
    function moverVibora() {
      let newArraySnake = [...arraySnake];
      let newPosCabeza = posCabeza;

      if (direccion === "right") {
        if (ARR_BORDE_DERECHO.includes(newPosCabeza)) {
          newPosCabeza = newPosCabeza - 23;
        } else {
          newPosCabeza = newPosCabeza + 1;
        }
      } else if (direccion === "left") {
        if (ARR_BORDE_IZQUIERDO.includes(newPosCabeza)) {
          newPosCabeza = newPosCabeza + 23;
        } else {
          newPosCabeza = newPosCabeza - 1;
        }
      } else if (direccion === "up") {
        if (ARR_BORDE_SUPERIOR.includes(newPosCabeza)) {
          newPosCabeza = newPosCabeza + 552;
        } else {
          newPosCabeza = newPosCabeza - 24;
        }
      } else if (direccion === "down") {
        if (ARR_BORDE_INFERIOR.includes(newPosCabeza)) {
          newPosCabeza = newPosCabeza - 552;
        } else {
          newPosCabeza = newPosCabeza + 24;
        }
      }

      // Detectar si la vibora toca la comida
      if (newPosCabeza === posComida) {
        setPosComida(null); // Al tocar la comida, reiniciamos su posición
        setPuntos((puntos) => puntos + 10);
      } else {
        newArraySnake.shift();
      }

      // Detectamos si se choca consigo misma
      if (newArraySnake.includes(newPosCabeza)) {
        onGameOver(true);
        setEndGame(true);
        return;
      }

      newArraySnake.push(newPosCabeza);
      setArraySnake(newArraySnake);
      setPosCabeza(newPosCabeza);
    }

    if (iniciarJuego) {
      const intervalID = setInterval(() => {
        moverVibora();
      }, 200);

      return () => clearInterval(intervalID);
    }
  }, [iniciarJuego, direccion, posCabeza, arraySnake, posComida, onGameOver]);

  function snakeIsHere(posicion) {
    return posicionesTablero[posicion];
  }

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
        } else if (snakeIsHere(index)) {
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
