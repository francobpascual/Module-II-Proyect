import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { useGames } from "../../hooks/useGames";
import GameList from "../../components/GameList/GameList";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./HomePage.css";

function HomePage() {
  const { games } = useGames();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = games.filter((game) =>
    game.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <img
          className="home-hero__image"
          src="/images/kratos-hero.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">
            <span aria-hidden="true" />
            Entrá en otro mundo
          </p>
          <h1 id="home-hero-title">
            Tu próxima gran <span>aventura</span>
          </h1>
          <p className="home-hero__description">
            Historias épicas, mundos inmensos y desafíos que dejan huella.
            Encontrá tu próxima experiencia.
          </p>
          <a className="home-hero__button" href="#catalogo">
            Explorar catálogo
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="home-hero__bottom" aria-hidden="true">
          <span>GAMERLIX / EXPERIENCIAS PARA JUGAR</span>
          <span className="home-hero__scroll">DESLIZÁ PARA EXPLORAR</span>
        </div>
      </section>

      <section id="catalogo" className="home-catalog" aria-labelledby="catalog-title">
        <div className="home-catalog__container">
          <header className="home-catalog__header">
            <div>
              <p className="home-catalog__eyebrow">Elegí tu próxima partida</p>
              <h2 id="catalog-title">
                Un catálogo para <span>perderse</span>
              </h2>
              <p className="home-catalog__description">
                Explorá aventuras, encontrá nuevos mundos y elegí cómo sigue
                tu historia.
              </p>
            </div>
            <span className="home-catalog__count">
              <span>{filteredGames.length.toString().padStart(2, "0")}</span>
              JUEGOS
            </span>
          </header>

          <div className="home-catalog__tools">
            <div className="home-catalog__search">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <span className="home-catalog__hint">Encontrá tu próxima obsesión</span>
          </div>

          <GameList games={filteredGames} />
        </div>
      </section>
    </main>
  );
}

export default HomePage;
