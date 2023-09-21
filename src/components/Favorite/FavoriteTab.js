import React, { useContext } from 'react';
import './FavoriteTab.scss';

// ^ Context ^ \\
import GithubContext from '../../context/GithubContext';

// ^ Library ^ \\
import Fade from 'react-reveal/Fade';

// ^ Icon ^ \\
import CloseIcon from '@mui/icons-material/Close';

const FavoriteTab = () => {
  const {
    setFavoriteTab,
    favoriteUsers,
    removeToFavorite,
    search,
    setSearch,
    notification,
    setNotification,
  } = useContext(GithubContext);

  // * Function used to remove a user from the favorites list.
  // * stopPropagation is used to prevent the handleUserClick function from executing during this time.
  const handleRemoveUsers = (event, item) => {
    event.stopPropagation();
    removeToFavorite(item);
  };

  // * It provides redirection to the user's card.
  // * It also ensures the notification is dismissed.
  const handleUserClick = (user) => {
    if (search !== user.login) {
      setSearch(user.login);
    } else {
      window.location.reload();
    }

    setNotification((prev) => ({
      ...prev,
      [user.login]: 0,
    }));
  };

  return (
    <Fade right>
      <div className="favoriteTab">
        <h4 className="favoriteTab_title">
          Favorite Users: {favoriteUsers.length}
        </h4>
        <CloseIcon
          className="favoriteTab__removeButton"
          onClick={() => {
            setFavoriteTab(false);
          }}
        />
        <ul className="favoriteTab_container">
          {favoriteUsers.map((fav) => (
            <li
              key={fav.id}
              className="favoriteTab_innerContainer"
              onClick={() => handleUserClick(fav)}
            >
              <img
                src={fav.avatar_url}
                alt="avatar"
                className="favoriteTab_avatar"
              />
              {notification[fav.login] ? (
                <span className="count">{notification[fav.login]}</span>
              ) : (
                ''
              )}

              <span>{fav.name ?? fav.login}</span>
              <CloseIcon
                className="removeUser"
                onClick={(event) => handleRemoveUsers(event, fav.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Fade>
  );
};

export default FavoriteTab;
