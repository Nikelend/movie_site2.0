import React, { useState } from 'react'
import { Pagination } from 'antd'

const Home = () => {
  const [current, setCurrent] = useState(1) 

  const onPageChange = (page) => {
    setCurrent(page)
    console.log(`Змінено на сторінку: ${page}`)
    
  }

  return (
    <div>
      <h1>Головна сторінка</h1>
      

      
      <Pagination
        current={current}
        defaultCurrent={1}
        total={50}  
        onChange={onPageChange}  
      />
    </div>
  )
}

export default Home
