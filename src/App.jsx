import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./routes/Actors.jsx"
import Home from "./Pages/Home/Home.jsx"
import Detail from "./Pages/Detail/Detail.jsx"
import MainLayout from './components/Layout/MainLayout.jsx'
import Register from './Pages/Register/Register.jsx'
import 'antd/dist/reset.css'
import MovieCast from "./components/Movie/MovieCast.jsx"
import PopularMovies from "./Pages/PopularMovie/PopularMovie.jsx"
import Profile from "./Pages/Profile/Profile.jsx"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="movie-details/:id" element={<Detail />} /> 
          <Route path="/actor/:actorId" element={<MovieCast />} />
          <Route path="/popular-movies" element={<PopularMovies />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
