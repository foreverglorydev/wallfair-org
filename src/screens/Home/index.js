import styles from './styles.module.scss';
import _ from 'lodash';
import { connect, useSelector } from 'react-redux';
import BaseContainerWithNavbar from '../../components/BaseContainerWithNavbar';
import EventsCarouselContainer from '../../components/EventsCarouselContainer';
import Leaderboard from '../../components/Leaderboard';
import { Link, useParams } from 'react-router-dom';
import { LeaderboardActions } from '../../store/actions/leaderboard';
import { EventActions } from 'store/actions/event';
import { useIsMount } from 'components/hoc/useIsMount';
import React, { useEffect } from 'react';
import Routes from 'constants/Routes';
import ContentFooter from '../../components/ContentFooter';
import { PopupActions } from '../../store/actions/popup';
import State from '../../helper/State';
import { getTradeById } from '../../api';
import ActivitiesTracker from '../../components/ActivitiesTracker';
import LandingPage from 'screens/LandingPage';
import classNames from 'classnames';
import checkedIcon from '../../data/icons/checked.svg';

const Home = ({ tags, openDrawer, fetchTags, showPopup, events, users }) => {
  const isMount = useIsMount();
  const { eventId, betId, tradeId } = useParams();
  const userLoggedIn = useSelector(
    state => state.authentication.authState === 'LOGGED_IN'
  );

  const renderBetApprovePopup = async () => {
    if (isMount) {
      if (eventId && betId && tradeId) {
        const event = State.getEventByTrade(betId, events);
        const bet = State.getTradeByEvent(betId, event);
        const tradeResponse = await getTradeById(tradeId).catch(err => {
          console.error("Can't get trade by id:", err);
        });

        const trade = _.get(tradeResponse, 'data', null);

        const options = {
          eventId: eventId,
          betId: betId,
          tradeId: tradeId,
          data: {
            bet: bet,
            trade: trade,
          },
          hideShare: true,
        };

        if (betId && tradeId && eventId) {
          showPopup('betApprove', options);
        }
      }
    }
  };

  useEffect(() => {
    if (isMount) {
      fetchTags();
      renderBetApprovePopup();
    }
  }, []);

  const renderHeadline = () => {
    return (
      <div className={styles.mainHeadline}>
        <h1>Betting Reimagined</h1>

        <div className={styles.slogan}>Clear, Social &amp; Fair</div>
      </div>
    );
  };

  const onSeeLeaderboard = () => {
    window.scrollTo(0, 0);
    openDrawer();
  };

  const renderTags = () => {
    return (
      <div className={styles.tags}>
        {tags &&
          tags.map((tag, index) => {
            return (
              <div key={index} className={styles.tag}>
                #{tag}
              </div>
            );
          })}
      </div>
    );
  };

  const renderBlogBanner = () => {
    return (
      <Link to={Routes.blog}>
        <div className={classNames(styles.banner, styles.blogBanner)}>
          {/* <div className={styles.title}>Blog</div> */}
          <div className={styles.title}>
            {'        '}
            <br />
            {'         '}
          </div>
        </div>
      </Link>
    );
  };

  const RoadmapSection = () => {
    const Item = React.memo(({ status, text, headline }) => {
      return (
        <div className={styles.roadmapEntry}>
          <div className={styles.roadmapHeadBg}>
            <img src={checkedIcon} />
            {headline}

            <div className={styles.itemStatus}>
              <p>[{status}]</p>
            </div>
          </div>

          <p>{text}</p>
        </div>
      );
    });

    return (
      <div className={classNames(styles.roadmapSection)}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>Roadmap</span>
        </div>

        <div className={styles.roadmapContainer}>
          <Item
            status={'in Dev'}
            headline={'Live Events'}
            text={'Live Events enable live streams that users can bet on.'}
          />

          <Item
            status={'in Dev'}
            headline={'Mobile App'}
            text={'Native Apps for ios and Android devices.'}
          />
          <Item
            status={'in Dev'}
            headline={'Real-Money Version'}
            text={
              'Users will be able to trade real wfair tokens instead of play-money tokens.'
            }
          />

          <Item
            status={'in Concept Stage'}
            headline={'More Games'}
            text={
              'We are going to be adding more innovative games so that Elon isnt alone.'
            }
          />
          <Item
            status={'in Concept Stage'}
            headline={'User generated events'}
            text={
              'Users will be able to generate events and take 1% profits from trading volume.'
            }
          />
          <Item
            status={'in Concept Stage'}
            headline={'Private events'}
            text={
              'Stupid, random and other stuff that is only interesting to you and your friends, not the public community.'
            }
          />
          <Item
            status={'Planned'}
            headline={'In game betting'}
            text={
              'This is a biggy:  Open API to allow in game widgets for any kind of games, metaverse and other areas.'
            }
          />
          <Item
            status={'Planned'}
            headline={'Oracle implementation'}
            text={
              'Automated oracles to feed gaming results, sports events, stock prices etc as replacement for decentralized event resolution moderators.'
            }
          />
          <Item
            status={'Planned'}
            headline={'Leveraged bets'}
            text={
              'Allowing for leveraged betting on outcomes, e.g. 10x your originial amount.'
            }
          />
          <Item
            status={'Planned'}
            headline={'Wallfair Livestreams'}
            text={'Wallfair owned live strems from your smartphone or camera.'}
          />
          <Item status={'Planned'} headline={'NFT market place'} text={''} />
        </div>
      </div>
    );
  };

  const renderRosiBanner = () => {
    return (
      <Link to={Routes.rosiGame}>
        <div className={styles.banner}>
          <div className={styles.title}>
            Play the
            <br />
            Elon Game
          </div>
        </div>
      </Link>
    );
  };

  const renderCategoriesAndLeaderboard = () => {
    return (
      <div className={styles.bottomWrapper}>
        <div className={styles.categories}>
          <div className={styles.headline}>
            Activities{' '}
            <Link className={styles.seeAllActivities} to={Routes.activities}>
              See all
            </Link>
          </div>
          <ActivitiesTracker />
          {/*<CategoryList categories={EVENT_CATEGORIES} />*/}
        </div>
        <div className={styles.leaderboard}>
          <div className={styles.headline}>
            Community Leaderboard
            <div className={styles.leaderboardLink} onClick={onSeeLeaderboard}>
              See Leaderboard
            </div>
          </div>
          <Leaderboard fetch={true} small={true} />
        </div>
      </div>
    );
  };

  if (!userLoggedIn) return <LandingPage />;

  return (
    <BaseContainerWithNavbar>
      {renderHeadline()}
      {/* <Header /> */}
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          {renderRosiBanner()}
          <EventsCarouselContainer eventType="non-streamed" />
          <EventsCarouselContainer eventType="streamed" />
          <RoadmapSection />
          {renderBlogBanner()}
          {renderCategoriesAndLeaderboard()}
          <ContentFooter />
        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    tags: state.event.tags,
    events: state.event.events,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openDrawer: () => {
      dispatch(LeaderboardActions.handleDrawer({ open: true }));
    },
    fetchTags: () => {
      dispatch(EventActions.fetchTags());
    },
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
