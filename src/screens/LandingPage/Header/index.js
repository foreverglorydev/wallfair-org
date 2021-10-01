import VideoPlayer from 'components/EmbedVideo/VideoPlayer';
import styles from './styles.module.scss';

const LandingPage = () => {
  return (
    <div className={styles.header}>
      <div className={styles.mainHeadline}>
        <h1>Betting Reimagined</h1>
        <div className={styles.slogan}>
          Clear<span>,</span> Social <span>&</span> Fair
          <span>.</span>
        </div>
      </div>
      <div className={styles.video}>
        <VideoPlayer
          video="https://files.wallfair.io/wallfair.mp4"
          controls={true}
          loop={true}
        />
      </div>
    </div>
  );
};

export default LandingPage;
