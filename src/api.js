import axios from "axios";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWNjZTVjZDI3Zjg4NzcxYzI2ODdmMWE3MDg0M2Q2NyIsIm5iZiI6MTc0MTcxMjI5My40MTEsInN1YiI6IjY3ZDA2YmE1YjVlZTBlMzk3YzYwOTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3vAswWPC61-VKmcm5aAH1WOwWANhCH1rlPyKCQSKeFY";

const headers = {
  Authorization: `Bearer ${API_KEY}`
}

export const getGenres = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
      {headers}
    );
    return response.data.genres;
  } catch (error) {
    console.error("Не вдалося отримати жанри:", error);
    return [];
  }
};

export const getActors = async (page = 1, query = "") => {
  try {
    const url = query
      ? `https://api.themoviedb.org/3/search/person?query=${query}&page=${page}`
      : `https://api.themoviedb.org/3/person/popular?page=${page}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    return response.data;
  } catch (error) {
    console.error("Не вдалося отримати акторів:", error);
    return { results: [], total_pages: 1 };
  }
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?page=${page}`,
      {headers}
    );
    return response.data;
  } catch (error) {
    console.error("Не вдалося отримати популярні фільми:", error);
    return { results: [], total_pages: 1 };
  }
};

export const getMovies = async (page = 1, query = "") => {
  try {
    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    
    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=${page}`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    return response.data;
  } catch (error) {
    console.error("Не вдалося отримати фільми:", error);
    return { results: [], total_pages: 1 };
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
     {headers}
    );
    return response.data.cast.slice(0, 10); 
  } catch (error) {
    console.error(`Не вдалося отримати акторів для фільму ${movieId}:`, error);
    return [];
  }
};

export const getActorDetails = async (actorId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}`,
      {headers}
    );
    return response.data;
  } catch (error) {
    console.error(`Не вдалося отримати дані актора з ID ${actorId}:`, error);
    return null;
  }
};

export const getActorMovies = async (actorId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits`,
     {headers}
    );
    return response.data.cast.slice(0, 10);
  } catch (error) {
    console.error(`Не вдалося отримати фільми актора з ID ${actorId}:`, error);
    return [];
  }
};

export const getMovieById = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Не вдалося отримати фільм з ID ${movieId}:`, error);
    return null;
  }
};

