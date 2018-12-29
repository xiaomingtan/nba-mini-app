// components/player-data/player-data.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: Array,
            default: []
        },
        teamColor: {
            type: String,
            default: ''
        }
    },
    attached() {

    },
    /**
     * 组件的初始数据
     */
    data: {
        headers: [
            {label: "时间", key: "minutes"},
            {label: "得分", key: "points"},
            {label: "篮板", key: "rebounds"},
            {label: "助攻", key: "assists"},
            {label: "投篮", key: "field_goals"},
            {label: "3分", key: "three_pointers"},
            {label: "罚球", key: "free_throws"},
            {label: "前板", key: "rebounds_offensive"},
            {label: "后板", key: "rebounds_defensive"},
            {label: "抢断", key: "steals"},
            {label: "失误", key: "turnovers"},
            {label: "盖帽", key: "blocks"},
            {label: "犯规", key: "fouls"},
            {label: "+/-", key: "plus_minus"},
        ],
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})
