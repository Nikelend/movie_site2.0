import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Pagination, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons" 
import { getActors } from "../api" 
import "../components/Actors.css"

export default function About() {
  const [actors, setActors] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchText, setSearchText] = useState("") 

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const data = await getActors(currentPage, searchText) 
        setActors(data.results)
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error("Failed to fetch actors:", error)
      }
    }

    fetchActors()
  }, [currentPage, searchText])

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value) 
  }

  return (
    <div className="actors-page">
      <h2>Актори</h2>
      
     
      <Input
        placeholder="Search actors..."
        value={searchText}
        onChange={handleSearch}
        prefix={<SearchOutlined />} 
        className="search-input" 
      />
      
      <div className="actors-grid">
        {actors.length > 0 ? (
          actors
            .filter((actor) => actor.profile_path)
            .map((actor) => (
              <Link to={`/actor/${actor.id}`} key={actor.id} className="actor-card">
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="actor-image"
                />
                <h3>{actor.name}</h3>
              </Link>
            ))
        ) : (
          <p>Не знайдено акторів</p>
        )}
      </div>
      
      <div className="pagination-wrapper">
        <Pagination
          current={currentPage}
          total={totalPages * 20} 
          pageSize={20}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  )
}
