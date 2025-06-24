import { FaFeatherAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const SearchComponent = ({ headerText, query, setQuery, handleSearch, resetSearch }) => {
    
  


  return (
    <div className="header-div">
        <div className="flex max-md:hidden post-header -mb-2 font-roboto text-xl font-light tracking-medium"> 
            <FaFeatherAlt size={18} className="text-red-400" />
            {headerText} 
        </div>
        
        <form onSubmit={handleSearch} className="post-search !mr-5 max-md:w-full">
            <div className="flex justify-start items-center gap-2 rounded-xl w-full py-1 px-3 shadow-lg" >
                <FiSearch className=" w-6 h-6 text-[#959EAD]" />
                <input type='text' value={query} onChange={(e) => setQuery(e.target.value) } onKeyUp={resetSearch} className='py-2 w-full focus:border-white outline-none placeholder:text-gray-500' placeholder='Search post ... ' />

                <button type='submit' className='bg-red-400 text-white p-1.5 rounded-full hover:bg-red-500' >
                <FiSearch />
                </button>
            </div>
        </form>
    </div>
  )
}

export default SearchComponent