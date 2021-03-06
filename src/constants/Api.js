export const API_USER_REQUEST_TOKENS = 'api/user/requestTokens';
// Env vars
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const BACKEND_SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
export const CRASH_GAME_BACKEND_URL = process.env.REACT_APP_CRASH_GAME_BACKEND_URL;
export const CRASH_GAMES_BACKEND_URL = process.env.REACT_APP_CASINO_GAMES_BACKEND_URL;
export const SECOND_CRASH_GAME_BACKEND_URL = process.env.REACT_APP_SECOND_CRASH_GAME_BACKEND_URL;
export const ACCOUNT_MAPPING = process.env.REACT_APP_ACCOUNT_MAPPER_URL;
export const WITHDRAW_SERVICE_URL = process.env.REACT_APP_WITHDRAW_SERVICE_URL;
export const EVENTS_SERVICE_URL = process.env.REACT_APP_EVENTS_SERVICE_URL;

export const NEWS_API_URL = 'https://gnews.io/api/v4/search';
export const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
export const NEWS_API_SSL_MODE = process.env.REACT_APP_NEWS_API_SSL_MODE === 'true';
export const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;

// Services
export const API_AUTHENTICATION_SEND_SMS = 'api/user/send-sms';
export const API_AUTHENTICATION_VERIFY_SMS = 'api/user/verify-sms';
export const API_AUTHENTICATION_SAVE_ADD_INFO_URL =
  'api/user/saveAdditionalInformation';
export const API_AUTHENTICATION_VERIFY_EMAIL =
  'api/user/confirm-email/?userId=:userId&code=:code';
export const API_AUTHENTICATION_RESEND_EMAIL_VERIFICATION =
  'api/user/resend-confirm?userId=:userId';
export const API_BET_CREATE = 'api/event/bet/create';
export const API_EVENT_BET_CREATE = 'api/event/bet/create';
export const API_EVENT_BET_EDIT = '/api/event/bet/:betId'; // or this endpoint /api/event/:id/bet/:betId
export const API_BET_OUTCOMES = 'api/event/bet/:id/outcomes/buy';
export const API_BET_PLACE = 'api/event/bet/:id/place';
export const API_BET_PULL_OUT = 'api/event/bet/:id/pullout';
export const API_BET_SELL_OUTCOMES = 'api/event/bet/:id/outcomes/sell';
export const API_BET_TEMPLATES = 'api/bet-template';
export const API_EVENT_CREATE = 'api/event/create';
export const API_EVENT_EDIT = 'api/event/:id';
export const API_EVENT_DELETE = 'api/event/:id';
export const API_EVENT_BOOKMARK = 'api/event/:id/bookmark';
export const API_EVENT_BOOKMARK_CANCEL = 'api/event/:id/bookmark/cancel';
export const API_EVENT_LIST = 'api/event/list';
export const API_EVENT_LIST_FILTERED =
  'api/event/list/:type/:category/:count/:page/:sortBy/:upcoming/:deactivated/:searchQuery';
export const API_EVENT_CHAT_MESSAGES = 'api/event/chat-messages/:id';
export const API_EVENT_EVALUATE_SEND = 'api/event/evaluate';
export const API_USER = 'api/user/:id';
export const API_USER_PUBLIC_INFO = 'api/user/:id/info';
export const API_USER_PUBLIC_STATS = 'api/user/:id/stats';
export const API_USER_CHECK_USERNAME = 'api/user/check-username';
export const API_USER_PREFERENCES = 'api/user/:id/preferences';
export const API_USER_UPDATE_STATUS = 'api/user/:id/status';
export const API_LEADERBOARD = 'api/user/getLeaderboard/:skip/:limit';
export const API_USER_HISTORY = 'api/user/history';
export const API_USER_OPEN_BETS = 'api/user/open-bets';
export const API_USER_TRADE_HISTORY = 'api/user/trade-history';
export const API_USER_REFERRAL_LIST = 'api/user/refList';
export const API_TAGS_LIST = 'api/event/tags';
export const API_CURRENT_ELON = 'api/elon-game/current';
export const API_CURRENT_BY_GAME_TYPE_SIMPLE_GAMES = 'api/simple-games/current/:gameTypeId';
export const API_CHART_DATA = 'api/event/bet/:betId/history';
export const API_CHAT_MESSAGES =
  'api/chat/chat-messages/:roomId?skip=:skip&limit=:limit';
export const API_USER_MESSAGES = 'api/user-messages?skip=:skip&limit=:limit';
export const API_USER_MESSAGE_SET_READ = 'api/user-messages/:id/read';
export const API_EVENT_CREATE_FROM_TWITCH = 'api/event/extract/twitch';
export const API_EVENT_CREATE_FROM_YOUTUBE = 'api/event/create-from-youtube';
export const API_EVENT_GET_COVER_STREAM = 'api/event/cover/streamed';
export const API_BET_RESOLVE = 'api/event/bet/:id/resolve';
export const API_BET_CANCEL = 'api/event/bet/:id/cancel';
export const API_BET_DELETE = 'api/event/bet/:id/delete';
export const API_SET_SESSION = 'new-session';
export const API_TRADE_CREATE_ELON = 'api/elon-game/trade';
export const API_WHEEL_BET = 'api/simple-games/trade/wheel';
export const API_MINES_BET = '/api/mines-game/trade';
export const API_MINES_CHECK = '/api/mines-game/check';
export const API_MINES_CASHOUT = '/api/mines-game/cashout';
export const API_MINES_CURRENT = '/api/mines-game/current';
export const API_MINES_LAST_CASHOUTS = '/api/mines-game/lastcashouts';
export const API_PLINKO_BET = '/api/simple-games/trade/plinko';
export const API_CANNON_BET = '/api/simple-games/trade/alpacannon';
export const API_CASH_OUT_ELON = 'api/elon-game/cashout';
export const API_TRADE_GET_BY_ID = 'api/event/trade/:id';
export const API_TRADES_LUCKY = 'api/trades/lucky/:gameId';
export const API_TRADES_HIGH = 'api/trades/high/:gameId';
export const API_TRADES_PER_USER = 'api/trades/user/:userId';
export const API_GET_NOTIFICATION_EVENTS =
  'api/notification-events/list?limit=:limit&cat=:category';
export const API_GET_NOTIFICATION_EVENTS_BY_GAME =
  'api/notification-events/list?limit=:limit&cat=:category&gameId=:gameId';
export const API_GET_NOTIFICATION_EVENTS_BY_BET =
  'api/notification-events/list/bets/:betId?limit=:limit';
export const API_GET_NOTIFICATION_EVENTS_BY_USER =
  'api/notification-events/list/users/:userId?limit=:limit';
export const API_AUTH_LOGIN = 'api/auth/login';
export const API_AUTH_SIGNUP = 'api/auth/sign-up';
export const API_AUTH_LOGIN_EXTERNAL = 'api/auth/login/:provider';
export const API_AUTH_FORGOT_PASSWORD = 'api/auth/forgot-password';
export const API_AUTH_RESET_PASSWORD = 'api/auth/reset-password';
export const API_USER_WALLET_TRANSACTIONS = 'api/user/wallet/transactions';
export const API_GETQUOTE = 'getQuote';
export const API_WITHDRAW = 'withdraw';
export const API_WITHDRAW_STATUS = 'withdraw/status/:id';
export const API_SET_EVOPLAY_SESSION = '/api/evoplay/new-session';
export const API_GET_EVOPLAY_URLGAME = '/api/evoplay/urlgame';
export const API_GET_SOFTSWISS_URLGAME = '/api/softswiss/urlgame';
export const API_GET_EVOPLAY_GAMES = '/api/evoplay/listgames';

//3rd parties
export const TINYURL_SHORTENER = 'https://tinyurl.com/api-create.php';
export const CRASH_GAME_API_GET_GAME_DETAILS = 'api/elon-game/match/:gameHash';
export const CRASH_GAME_GET_VOLUME_BETS = 'api/globalstats/:range';
export const CONVERT_CURRENCY = 'api/quote';
export const API_GET_CURRENT_FAIRNESS_SIMPLE_GAMES = 'api/fairness/seeds/:gameTypeId';
export const API_UPDATE_CURRENT_FAIRNESS_SIMPLE_GAMES = 'api/fairness/seeds/:gameTypeId';
export const SINGLE_GAME_API_GET_GAME_DETAILS = 'api/simple-games/details/:gameHash';
export const KYC_START_FOR_USER = 'api/user/:userId/kyc-start';
export const KYC_DATA_FOR_USER = 'api/user/:userId/kyc-data';
export const KYC_REFRESH_STATUS = 'api/user/kyc/refresh';
export const RANDOM_USERNAME = 'api/user/random-username';
export const SEND_BUY_WITH_CRYPTO = 'api/user/buy-with-crypto';
export const SEND_BUY_WITH_FIAT = 'api/user/buy-with-fiat';
export const GENERATE_MOONPAY_URL = 'api/user/moonpay/url';
export const GENERATE_CRYPTOPAY_CHANNEL = 'api/user/cryptopay/channel';
export const ACCEPT_TOS = 'api/user/consent';
export const USER_COUNT = 'api/user/count';
export const BONUS_COUNT = 'api/user/check-bonus/:id';
