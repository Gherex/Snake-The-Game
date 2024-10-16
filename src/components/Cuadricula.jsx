import { useRef, useState, useEffect } from "react";
const ARR_CUADRICULA = new Array(576).fill(null);

function Cuadricula() {
  const [posSnake, setPosSnake] = useState(new Array(576).fill(false));
  const divRef = useRef(null); // Referencia al div
  let [direccion, setDireccion] = useState("right"); // posibles valores: left | right | up | down

  useEffect(() => {
    let newPosSnake = [...posSnake];
    newPosSnake[299] = true;
    newPosSnake[300] = true;
    newPosSnake[301] = true;
    setPosSnake(newPosSnake);

    if (divRef.current) {
      divRef.current.focus(); // Focaliza el div al montarse
    }

    return () => {
      setPosSnake(new Array(576).fill(false));
    };
  }, []);

  function handleKeyDown(event) {
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp")
      setDireccion("up");
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft")
      setDireccion("left");
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown")
      setDireccion("down");
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight")
      setDireccion("right");
  }

  function snakeIsHere(posicion) {
    return posSnake[posicion];
  }

  return (
    <div
      ref={divRef}
      className="grid grid-cols-24 grid-rows-24 gap-1 sm:gap-2 min-w-80"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      style={{ outline: "none" }}
    >
      {ARR_CUADRICULA.map((_, index) => {
        return snakeIsHere(index) ? (
          <div
            key={index}
            className="bg-black w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4"
          ></div>
        ) : (
          <div
            key={index}
            className="bg-cyan-600 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4"
          ></div>
        );
      })}
    </div>
  );
}

export default Cuadricula;
