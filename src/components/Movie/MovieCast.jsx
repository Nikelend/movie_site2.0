import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, Typography, Image, Button } from "antd"
import './MovieCast.css'
import { getActorDetails, getActorMovies } from "../../api" 

const { Title, Paragraph } = Typography

export default function MovieCast() {
  const { actorId } = useParams()
  const navigate = useNavigate()
  const [actor, setActor] = useState(null)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const actorData = await getActorDetails(actorId) 
        setActor(actorData)
      } catch (error) {
        console.error("Failed to fetch actor details:", error)
      }
    }

    const fetchMovies = async () => {
      try {
        const moviesData = await getActorMovies(actorId) 
        setMovies(moviesData)
      } catch (error) {
        console.error("Failed to fetch actor movies:", error)
      }
    }

    fetchActor()
    fetchMovies()
  }, [actorId])

  if (!actor) return <div>Загрузка інформації про акторів...</div>

  return (
    <div className="actor-detail">
      <Button onClick={() => navigate(-1)} className="back-button">
        ← Назад
      </Button>

      <div className="actor-content">
        <div className="actor-photo">
          <Image
            width="100%"
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
          />
        </div>

        <div className="actor-info">
          <Title>{actor.name}</Title>
          <Paragraph>
            <strong>Дата народження:</strong> {actor.birthday}
          </Paragraph>
          <Paragraph>
            <strong>Місце народження:</strong> {actor.place_of_birth}
          </Paragraph>
          <Paragraph>
            <strong>Біографія:</strong><br />{actor.biography}
          </Paragraph>
        </div>
      </div>

      <Title level={4} className="actor-movies-title">Movies</Title>

      <div className="movies-row">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link
              to={`/movie-details/${movie.id}`}
              state={{
                id: movie.id,
                title: movie.title,
                year: movie.release_date?.slice(0, 4),
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                summary: movie.overview,
                genres: movie.genre_ids || [],
                rating: movie.vote_average,
              }}
              className="movie-card-link"
            >
              <Card
                hoverable
                cover={
                  <Image
                    alt={movie.title}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    height={200}
                    preview={false}
                  />
                }
              >
                <Card.Meta
                  title={movie.title}
                  description={`Year: ${movie.release_date?.slice(0, 4)}`}
                />
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
