function JuegoTerminado({ puntos, resetGame }) {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-slate-700 text-xl font-bold">
      <p className="mb-4 select-none">¡Juego terminado!</p>
      <p className="mb-4">Puntuación final: {puntos}</p>
      <button
        className="bg-cyan-950 p-4 border border-solid border-white rounded-xl text-white select-none hover:bg-slate-900"
        onClick={resetGame}
      >
        Volver al menú
      </button>
    </div>
  );
}

export default JuegoTerminado;
