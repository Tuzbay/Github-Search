import React, { useContext } from 'react';
import './card.scss';

// ^ Icons ^ \\
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

// ^ Context ^ \\
import GithubContext from '../../context/GithubContext';

// ^ Library ^ \\
import { Fade } from 'react-reveal';

function Card() {
  const {
    dataRepos,
    dataUser,
    favoriteUsers,
    addToFavorite,
    removeToFavorite,
  } = useContext(GithubContext);

  // * The current user's ID is being checked to see if it exists in the list of favorite users.
  const isUserFavorite =
    dataUser && favoriteUsers.some((favUser) => favUser.id === dataUser.id);

  return (
    <Fade right>
      <div className="card">
        <div
          className="card__icon"
          onClick={() =>
            isUserFavorite
              ? removeToFavorite(dataUser.id)
              : addToFavorite(dataUser, dataRepos)
          }
        >
          {isUserFavorite ? (
            <FavoriteIcon className="heart" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
        <div className="card__info">
          <img className="avatar" src={dataUser?.avatar_url} alt="name" />
          <div className="card__user-info">
            <h2>
              {dataUser?.name} -
              <span className="card__user-location"> {dataUser?.location}</span>
            </h2>
            <h4>
              Last Bio Update:
              {/* The date is changed according to its common usage.  */}
              {dataUser?.updated_at.slice(0, 10).split('-').reverse().join('-')}
            </h4>
            <p className="card__user-bio">{dataUser?.bio}</p>

            <ul>
              <li>
                {dataUser?.followers}
                <strong>Followers</strong>
              </li>
              <li>
                {dataUser?.following}
                <strong>Following</strong>
              </li>
              <li>
                {dataUser?.public_repos}
                <strong>Repos</strong>
              </li>
            </ul>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Repository Name</th>
              <th>Created Time</th>
              <th>Last Commit</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {dataRepos !== null &&
              dataRepos.map((repo) => (
                <tr key={repo.id}>
                  <td className="project-name">
                    <a href={repo.svn_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </td>
                  <td>
                    {/* The date is changed according to its common usage.  */}
                    {repo.created_at
                      .slice(0, 10)
                      .split('-')
                      .reverse()
                      .join('.')}
                  </td>
                  <td>
                    {/* The date is changed according to its common usage.  */}
                    {repo.pushed_at.slice(0, 10).split('-').reverse().join('.')}
                  </td>
                  <td>{repo.language}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Fade>
  );
}

export default Card;
