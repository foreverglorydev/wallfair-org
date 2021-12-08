import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import styles from './styles.module.scss';
import { EVOPLAY_GAMES } from '../../constants/Games';
import { Link } from 'react-router-dom';

const ExternalGames = () => {
  const showUpcoming = process.env.REACT_APP_SHOW_UPCOMING_FEATURES || 'false';
  console.log("Evoplay Games: ", EVOPLAY_GAMES)
  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        {EVOPLAY_GAMES.map((game) =>
          <Link to={`/evoplay-game/${game.TechnicalName}`} className={styles.game}>
            <img src={`/images/evoplay/${game.TechnicalName}_360x360.jpg`}/>
            <p className={styles.title}>{game.GameName}</p>
          </Link>
        )}
      </div>
    </BaseContainerWithNavbar>
  );
};

export default ExternalGames;
