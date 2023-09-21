import React, { useContext } from 'react';
import './Container.scss';

// ^ Context Api ^ \\
import GithubContext from '../../context/GithubContext';

// ^ Components ^ \\
import FavoriteTab from '../Favorite/FavoriteTab';
import Search from '../Search/Search';
import Card from '../Card/Card';

const Container = () => {
  const { favoriteTab, setFavoriteTab, notification, error } =
    useContext(GithubContext);

  // * Use object.values to turned an array, sum the array elemenets with reduce
  const totalNotifications = Object.values(notification).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <>
      {/* Search component call with the setSearch prop. */}
      <Search />
      {error && <p className="error">{error}</p>}
      {/* Card component call with dataUsers and dataRepos props. */}
      <Card />
      {/* Access menu for favorite users */}
      {!favoriteTab ? (
        <div className="favoriteMenu" onClick={() => setFavoriteTab(true)}>
          <span>Favorite</span>
          <span className="favoriteMenu_count">{totalNotifications}</span>
        </div>
      ) : (
        <FavoriteTab />
      )}
    </>
  );
};

export default Container;
