import React, { useState, useContext } from 'react';
import './search.scss';
// ^ Context ^ \\
import GithubContext from '../../context/GithubContext';
// ^ Library ^ \\
import Fade from 'react-reveal/Fade';

function Search() {
  const { setSearch } = useContext(GithubContext);

  const [searchInput, setSearchInput] = useState(''); // * The name of the user entered in the search bar is stored within this state.

  // * The name entered by the user in the search bar is retrieved with below function.
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // * When the user enters a name in the search bar and submits, the information of the entered name is retrieved.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setSearchInput('');
  };
  return (
    <Fade left>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Githup User"
          value={searchInput}
          onChange={handleInputChange}
        />
      </form>
    </Fade>
  );
}

export default Search;
