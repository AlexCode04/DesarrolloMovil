import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src="/logoapp.png" alt="ConectaFácil" className="loader-logo" />
      <div className="loader"></div>
      <p>Cargando contactos...</p>
    </div>
  );
};

export default Loader;
