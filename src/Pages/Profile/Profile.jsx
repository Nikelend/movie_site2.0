import React, { useEffect, useState, useRef } from "react";
import { getMovieCredits, getMovieById } from "../../api";
import { Card, Rate, Spin, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [ratedMovies, setRatedMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRatedRef = useRef(null);
  const scrollFavoriteRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatedMovies = async () => {
      const ratings = JSON.parse(localStorage.getItem("userRatings")) || {};
      const ratedIds = Object.keys(ratings);

      const rated = await Promise.all(
        ratedIds.map(async (id) => {
          const details = await getMovieById(id);
          const cast = await getMovieCredits(id);
          return {
            ...details,
            userRating: ratings[id],
            cast,
          };
        })
      );

      setRatedMovies(rated);
    };

    const fetchFavoriteMovies = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

      const favorites = await Promise.all(
        favoriteIds.map(async (id) => {
          const details = await getMovieById(id);
          const cast = await getMovieCredits(id);
          return {
            ...details,
            cast,
          };
        })
      );

      setFavoriteMovies(favorites);
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchRatedMovies(), fetchFavoriteMovies()]);
      setLoading(false);
    };

    fetchAll();

    const handleStorageUpdate = () => fetchAll();
    window.addEventListener("storageUpdated", handleStorageUpdate);
    return () => window.removeEventListener("storageUpdated", handleStorageUpdate);
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <Spin tip="Завантаження..." size="large" />
      </div>
    );
  }

  const renderCard = (movie, showRating = false) => (
    <Card
      key={movie.id}
      title={`${movie.title} (${movie.release_date?.slice(0, 4)})`}
      cover={
        <img
          alt={movie.title}
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        />
      }
      className="profile-movie-card"
      onClick={() =>
        navigate(`/movie-details/${movie.id}`, {
          state: {
            title: movie.title,
            year: movie.release_date?.slice(0, 4),
            summary: movie.overview,
            poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
            genres: movie.genres || [],
            rating: movie.vote_average,
            cast: movie.cast,
          },
        })
      }
    >
      <p>{movie.overview}</p>
      {showRating && (
        <div>
          <strong>Моя оцінка:</strong> <Rate disabled value={movie.userRating} allowHalf />
        </div>
      )}
    </Card>
  );

  return (
    <section className="profile-container">
      <h2>Мої оцінені фільми ({ratedMovies.length})</h2>
      {ratedMovies.length === 0 ? (
        <p>Ви ще не оцінили жодного фільму.</p>
      ) : (
        <div className="profile-carousel-wrapper">
          <Button icon={<LeftOutlined />} onClick={() => scroll(scrollRatedRef, "left")} />
          <div className="profile-movies" ref={scrollRatedRef}>
            {ratedMovies.map((movie) => renderCard(movie, true))}
          </div>
          <Button icon={<RightOutlined />} onClick={() => scroll(scrollRatedRef, "right")} />
        </div>
      )}

      <h2>Мої улюблені фільми ({favoriteMovies.length})</h2>
      {favoriteMovies.length === 0 ? (
        <p>Ви ще не додали фільмів в улюблені.</p>
      ) : (
        <div className="profile-carousel-wrapper">
          <Button icon={<LeftOutlined />} onClick={() => scroll(scrollFavoriteRef, "left")} />
          <div className="profile-movies" ref={scrollFavoriteRef}>
            {favoriteMovies.map((movie) => renderCard(movie))}
          </div>
          <Button icon={<RightOutlined />} onClick={() => scroll(scrollFavoriteRef, "right")} />
        </div>
      )}
    </section>
  );
}
