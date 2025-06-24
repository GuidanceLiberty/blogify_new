import React from 'react'
import Posts from './Posts'
import { FiSearch } from 'react-icons/fi'
import { useState } from 'react';
import SearchComponent from '../SearchComponent';

const BlogList = () => {

   const URL = process.env.REACT_APP_BASE_URL;
    const headerText = "Latest post";
  
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
  
    const handleSearch = async (e) => {
        e.preventDefault();
        
        const res = await fetch(`${URL}/posts/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data?.posts);
    };
  
    const resetSearch = async (e) => {   
        if(query.length === 0){    handleSearch(e);    }
    }

  return (
    <section>
      <SearchComponent headerText={headerText} query={query} setQuery={setQuery} handleSearch={handleSearch} resetSearch={resetSearch} />

        <Posts limit={100} results={results}  />

    </section>
  )
}

export default BlogList
