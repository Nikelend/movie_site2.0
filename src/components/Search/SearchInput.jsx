import React from "react"
import { Input } from "antd"

const { Search } = Input

const SearchInput = ({ onSearch, value, onChange }) => {
  return (
    <Search
      placeholder="Search movies by title"
      enterButton="Search"
      size="large"
      onSearch={onSearch} 
      onChange={onChange} 
      value={value}
      style={{ width: 400, marginBottom: "20px" }}
    />
  )
}

export default SearchInput