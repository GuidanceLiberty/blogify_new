import Hero from "../components/Hero"
import MainLayout from "../components/MainLayout"
import Posts from "../components/post/Posts"
import CallToAction from '../components/CallToAction'
import { useState } from "react"
import SearchComponent from "../components/SearchComponent"

const Home = () => {

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
    <MainLayout>
        <Hero />
        
        <SearchComponent headerText={headerText} query={query} setQuery={setQuery} handleSearch={handleSearch} resetSearch={resetSearch} />
        <Posts limit={6} results={results}  />

        <CallToAction />
    </MainLayout>
  )
}

export default Home