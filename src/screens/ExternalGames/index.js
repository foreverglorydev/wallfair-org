import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getEvoplaygames } from 'api/casino-games';

const ExternalGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
      getEvoplaygames()
        .then(({data}) => {
          setGames(data?.games)
        })
        .catch(error => {
          console.log("error", error)
        });
    return () => {
      setGames([])
    }
  }, [])
  console.log("Keys: ", Object.keys(games))
  console.log("Entries: ", Object.entries(games))
  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        {Object.values(games).map((game, index) =>{
          const name = game.absolute_name.substring(game.absolute_name.lastIndexOf("\\") + 1)
          return(
            <Link to={`/evoplay-game/${game.name}/${game.game_sub_type}/${Object.keys(games)[index]}`} className={styles.game}>
              <img src={`/images/evoplay/${name}_360x360.jpg`}/>
              <p className={styles.title}>{game.name}</p>
            </Link>
          )}
        )}
      </div>
    </BaseContainerWithNavbar>
  );
};

export default ExternalGames;
