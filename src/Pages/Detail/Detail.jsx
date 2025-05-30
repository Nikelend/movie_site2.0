import React, { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import './Detail.css' 
import { Link } from "react-router-dom"
import { getMovieCredits, getGenres } from "../../api"
import { FaCommentDots } from "react-icons/fa"  

export default function Detail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { title, year, summary, poster, rating } = location.state || {}
  const [cast, setCast] = useState([])
  const [genres, setGenres] = useState([])
  const [comments, setComments] = useState([])  
  const [newComment, setNewComment] = useState("") 

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true })
      return
    }

    const fetchGenres = async () => {
      try {
        const genresData = await getGenres() 
        setGenres(genresData) 
      } catch (error) {
        console.error("Не вдалося отримати жанри:", error)
      }
    }

    const fetchCast = async () => {
      try {
        const castData = await getMovieCredits(id) 
        setCast(castData) 
      } catch (error) {
        console.error("Не вдалося отримати акторів:", error)
      }
    }

    const savedComments = localStorage.getItem(`comments-${id}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    fetchGenres()
    fetchCast()
  }, [id, location, navigate])

  const handleAddComment = () => {
    if (newComment.trim() === "") return
    const comment = {
      id: Date.now(),
      text: newComment,
    }
    const updatedComments = [...comments, comment]
    setComments(updatedComments)
    setNewComment("")
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments))
  }

  const handleDeleteComment = (id) => {
    const updatedComments = comments.filter(comment => comment.id !== id)
    setComments(updatedComments)

    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments))
  }

  if (!location.state) return null

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h2>{title}</h2>
        <p>{year}</p>
      </div>
      <div className="detail-content">
        <div className="movie-poster">
          <img src={poster} alt={title} />
        </div>
        <div className="movie-details">
          <p>{summary}</p>
          <ul>
            {genres.map((genre, i) => (
              <li key={i}>{genre.name}</li>
            ))}
          </ul>
          <h3>Рейтинг: {rating}</h3>
          {cast.length > 0 && (
            <div className="cast-list">
              <strong>Cast:</strong>
              <ul>
                {cast.map((actor, i) => (
                  <li key={i}>
                    <Link to={`/actor/${actor.id}`} className="actor-link">
                      {actor.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>Коментарі</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>
                <FaCommentDots className="comment-icon" /> 
                {comment.text}
              </p>
              <button 
                className="delete-button" 
                onClick={() => handleDeleteComment(comment.id)}>
                Видалити
              </button>
            </li>
          ))}
        </ul>

        <textarea 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Напишіть ваш коментар..."
        />
        <button onClick={handleAddComment}>Додати коментар</button>
      </div>
    </div>
  )
}
