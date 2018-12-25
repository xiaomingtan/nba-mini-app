const d = new Date()
const currentMonth = d.getMonth() + 1
let season // Format: 2018-2019
if (currentMonth >= 10) {
    season = d.getFullYear().toString() + '-' + (d.getFullYear() + 1).toString().substring(2, 4)
} else {
    season = (d.getFullYear().toString() - 1) + '-' + d.getFullYear().toString().substring(2, 4)
}

const address = {
    /**
     * 某日所有的比赛
     * @params gameDate: {String} {Format: yearmonthdate}
     * @example gameDate: 20181125
     */
    gameGeneral: (gameDate) => {
        return `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${gameDate}/games.json`
    },
    /**
     * 比赛详情
     * @params gameDate: {String} {Format: yearmonthdate} & gameId: {String}
     * @example gameDate: 20181128 & gameId: 0021500239
     */
    gameDetail: (gameDate, gameId) => {
        return `http://data.nba.com/data/10s/json/cms/noseason/game/${gameDate}/${gameId}/boxscore.json`
    },

    /**
     * Current league standing
     * @params year {String}
     * @example year: 2018
     */
    leagueStanding: (year) => {
        return `https://data.nba.com/data/json/cms/${year}/league/standings.json`
    },
    /**
     * 所有球员列表
     * @returns {string}
     */
    playerList: (season, IsOnlyCurrentSeason) => {
        return `https://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=${IsOnlyCurrentSeason}&LeagueID=00&Season=${season}`
    },

    playerInfo: (id) => {
        return `https://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=${id}&SeasonType=Regular+Season`
    },

    playerLog: (id) => {
        return `https://stats.nba.com/stats/playergamelog?LeagueID=00&PerMode=PerGame&PlayerID=${id}&Season=${season}&SeasonType=Regular+Season`
    },

    /**
     * @params gameDate month/date/year
     */
    teamRank: (gameDate) => {
        return `https://stats.nba.com/stats/scoreboard?DayOffset=0&LeagueID=00&gameDate=${gameDate}`
    },

    teamInfo: (id) => {
        return `https://stats.nba.com/stats/teaminfocommon?LeagueID=00&SeasonType=Regular+Season&TeamID=${id}&season=${season}`
    },

    teamDetail: (id) => {
        return `https://stats.nba.com/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Regular+Season&TeamID=${id}&VsConference=&VsDivision=`
    },

    teamDetailBasic: (id) => {
        return `https://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=${season}&TeamID=${id}`
    }
}

export default address