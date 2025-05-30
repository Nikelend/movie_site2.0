import React, { useEffect, useState } from 'react'
import { getPopularMovies } from '../../api'
import { Card, Col, Row, Pagination } from 'antd'
import { Link } from 'react-router-dom'
import './PopularMovie.css'


const { Meta } = Card

export default function PopularMovies() {
  const [movies, setMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPopularMovies = async (page = 1) => {
    setLoading(true)
    try {
      const data = await getPopularMovies(page) 
      setMovies(data.results) 
      setTotalPages(data.total_pages) 
    } catch (error) {
      console.error("Не вдалося отримати нові фільми:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPopularMovies(currentPage)
  }, [currentPage])

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="popular-movies">
      <h2>Нові фільми</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {Array.isArray(movies) && movies.map((movie) => (
              <Col span={8} key={movie.id}>
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
                      <img
                        alt={movie.title}
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'https://via.placeholder.com/500x750?text=No+Image'
                        }
                      />
                    }
                  >
                    <Meta
                      title={movie.title}
                      description={`Рік: ${movie.release_date?.slice(0, 4) || 'Невідомо'}`}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          <div className="pagination-wrapper">
            <Pagination
              current={currentPage}
              total={totalPages * 20}
              pageSize={20}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  )
}
