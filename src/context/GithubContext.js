import axios from 'axios';
import { useEffect, useState, createContext } from 'react';

const GithubContext = createContext();

const BASE_URL = 'https://api.github.com/users/';

export const GithubProvider = ({ children }) => {
  // ^ States ^ \\
  const [dataUser, setDataUser] = useState(null); // * User's data store within this state.
  const [dataRepos, setDataRepos] = useState(null); // * User's Repository data store within this state.
  const [search, setSearch] = useState('Tuzbay'); // * User name store within this state.
  const [favoriteTab, setFavoriteTab] = useState(false); // * Stores wheather the favorite menu is open or closed.
  const [notification, setNotification] = useState({}); // * Stores the notification.

  const initialFavorites = JSON.parse(localStorage.getItem('users')) || [];

  const [favoriteUsers, setFavoriteUsers] = useState(initialFavorites); // * Store the favorite users.

  const updateRepo = JSON.parse(localStorage.getItem('repos')) || [];

  const [updateRepos, setUpdateRepo] = useState(updateRepo); // * Stores the updates.

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(favoriteUsers));
    localStorage.setItem('repos', JSON.stringify(updateRepos));
  }, [favoriteUsers, updateRepos]);

  // * Add user in favorite list
  const addToFavorite = (user, dataRepos) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const newFavorites = [...storedUsers, user];
    setFavoriteUsers(newFavorites);
    const storedRepos = JSON.parse(localStorage.getItem('repos')) || [];
    const favoriteRepos = [...storedRepos, dataRepos[0]];
    setUpdateRepo(favoriteRepos);
  };

  // * Remove user in favorite list
  const removeToFavorite = (userId) => {
    setFavoriteUsers((prevFavorites) =>
      prevFavorites.filter((favorite) => favorite.id !== userId)
    );
  };
  const [error, setError] = useState(null);
  // * Get user's data with below function.
  useEffect(() => {
    async function getGithupUsers() {
      let users = `${BASE_URL}${search}`;

      try {
        const { data } = await axios.get(users);
        setDataUser(data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Too much request, wait a minute!');
        } else {
          setError('User not found!');
        }
      }
    }
    getGithupUsers();
  }, [search]);

  // * Get user's repository data with below function.
  useEffect(() => {
    async function getGithupUsersRepo() {
      let repos = `${BASE_URL}${search}/repos`;
      try {
        const { data } = await axios.get(repos);
        // * The received data is sorted according to their dates, and the latest 5 repositories are obtained with below function.
        setDataRepos(
          data
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 5)
        );
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Too much request, wait a minute!');
        } else {
          setError('User not found!');
        }
      }
    }
    getGithupUsersRepo();
  }, [search]);

  // * Requests are made every 10 seconds for the users in the favorites list. It is checked whether there is an update or not.
  useEffect(() => {
    const checkRepos = async () => {
      let storedRepos = JSON.parse(localStorage.getItem('repos')) || [];
      let storedUsers = JSON.parse(localStorage.getItem('users')) || [];

      for (const user of storedUsers) {
        const response = await axios.get(`${BASE_URL}${user.login}/repos`);

        const currentRepos = response.data;

        const sortedRepos = currentRepos.sort(
          (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
        );

        const lastPushed =
          sortedRepos.length > 0 ? sortedRepos[0].pushed_at : null;

        const storedRepoIndex = storedRepos.findIndex(
          (repo) => repo?.owner?.login === user.login
        );

        if (
          storedRepoIndex !== -1 &&
          lastPushed &&
          new Date(lastPushed) >
            new Date(storedRepos[storedRepoIndex].pushed_at)
        ) {
          // * Increase the notification
          setNotification((prev) => ({
            ...prev,
            [user.login]: (prev[user.login] || 0) + 1,
          }));

          // * Update storedRepos
          storedRepos[storedRepoIndex].pushed_at = lastPushed;

          // * Save the updates in localStorage
          localStorage.setItem('repos', JSON.stringify(storedRepos));
        }
      }
    };

    const intervalId = setInterval(checkRepos, 10000);
    return () => clearInterval(intervalId);
  }, [notification]);

  const values = {
    dataUser,
    setDataUser,
    dataRepos,
    setDataRepos,
    search,
    setSearch,
    favoriteTab,
    setFavoriteTab,
    favoriteUsers,
    addToFavorite,
    removeToFavorite,
    notification,
    setNotification,
    error,
  };

  return (
    <GithubContext.Provider value={values}>{children}</GithubContext.Provider>
  );
};

export default GithubContext;
