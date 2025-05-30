import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Rate } from "antd"
import './movie.css'

export default function Movie({ id, year, title, summary, poster, genres, rating }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const savedRating = localStorage.getItem(`movie_rating_${id}`)
    const savedFavorite = localStorage.getItem(`movie_favorite_${id}`)

    if (savedRating) {
      setUserRating(parseFloat(savedRating))
    }
    if (savedFavorite === "true") {
      setIsFavorite(true)
    }
  }, [id])

  const toggleFavorite = (e) => {
    e.stopPropagation()
    const newFavorite = !isFavorite
    setIsFavorite(newFavorite)

    localStorage.setItem(`movie_favorite_${id}`, newFavorite)

    let favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || []

    if (newFavorite) {
      if (!favorites.includes(id)) {
        favorites.push(id)
      }
    } else {
      favorites = favorites.filter(favId => favId !== id)
    }

    localStorage.setItem("favoriteMovies", JSON.stringify(favorites))
  }

  const handleRatingChange = (value) => {
    setUserRating(value)

    const ratings = JSON.parse(localStorage.getItem("userRatings")) || {}
    ratings[id] = value
    localStorage.setItem("userRatings", JSON.stringify(ratings))
    window.dispatchEvent(new Event("storageUpdated"))
  }

  return (
    <div
      className="movie"
      onClick={() =>
        navigate(`/movie-details/${id}`, {
          state: { title, year, summary, poster, genres, rating },
        })
      }
      style={{ cursor: "pointer" }}
    >
      <img src={poster} alt={title} title={title} />
      <div className="movie_column">
        <h3 className="movie_title">{title}</h3>
        <h5 className="movies_year">{year}</h5>
        <ul className="movie_genres">
          {genres.map((genre, index) => (
            <li key={index} className="genres_genre">
              {typeof genre === "string" ? genre : genre.name}
            </li>
          ))}
        </ul>
        <p className="movie_summary">{summary.slice(0, 140)}...</p>
        <p className="movie_rating">Rating: {rating}</p>

        <div onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={toggleFavorite}
            type={isFavorite ? "primary" : "default"}
            style={{ marginRight: "15px" }}
          >
            {isFavorite ? "Улюблений" : "Додати в улюблені"}
          </Button>
          <Rate allowHalf value={userRating} onChange={handleRatingChange} />
        </div>
      </div>
    </div>
  )
}
