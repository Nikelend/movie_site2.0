import React, { useState, useEffect } from "react"
import { Pagination, Button } from "antd"
import { useNavigate } from "react-router-dom" 
import Movie from "../../components/Movie/Movie.jsx"
import SearchInput from "../../components/Search/SearchInput.jsx"
import { getGenres, getMovies, getMovieCredits } from "../../api.js"
import { UserOutlined } from "@ant-design/icons"
import './Home.css'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate() 

  
  const fetchMovies = async (page = 1, query = "") => {
    setIsLoading(true)
    const movieData = await getMovies(page, query) 
    const moviesWithCast = await Promise.all(
      movieData.results.map(async (movie) => {
        const cast = await getMovieCredits(movie.id)
        return { ...movie, cast }
      })
    )
    setMovies(moviesWithCast)
    setTotalPages(movieData.total_pages)
    setIsLoading(false)
  }

  const fetchGenres = async () => {
    const genreData = await getGenres()
    setGenres(genreData)
  }

  useEffect(() => {
    fetchGenres()
    fetchMovies() 
  }, [])

  
  const handleSearch = (value) => {
    setSearchText(value)
    fetchMovies(1, value) 
  }

  const handleChange = (e) => {
    setSearchText(e.target.value)
  }

  const getMovieGenres = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id))
      .filter((genre) => genre !== undefined)
      .map((genre) => genre.name)
  }

  const sortedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average) 

  return (
    <section className="container">
   <div className="top-right">
  <UserOutlined 
    className="profile-icon"
    onClick={() => navigate("/profile")}
  />
  <Button 
    type="primary" 
    size="small"
    onClick={() => navigate("/register")}
    style={{ width: "120px", height: "35px" }}  
  >
    Зареєструватися
  </Button>
</div>

      <SearchInput
        onSearch={handleSearch}
        value={searchText}
        onChange={handleChange}
      />
      {isLoading ? (
        <div className="loader">
          <span className="loader_text">Завантаження....</span>
        </div>
      ) : (
        <div className="movies">
          {sortedMovies.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              year={movie.release_date?.slice(0, 4)} 
              title={movie.title}
              poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
              summary={movie.overview}
              genres={getMovieGenres(movie.genre_ids)}
              rating={movie.vote_average} 
              cast={movie.cast}
            />
          ))}
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            pageSize={10}
            onChange={(page) => {
              setCurrentPage(page)
              fetchMovies(page, searchText) 
            }}
          />
        </div>
      )}
    </section>
  )
}
