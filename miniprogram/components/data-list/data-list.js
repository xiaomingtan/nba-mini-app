// components/data-list/data-list.js
import _ from '../../utils/index'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        aside: {
            type: Array,
            default: []
        },
        standings: {
            type: Object,
            default: null
        },
        itemHeights: {
            type: Array,
            default: []
        }

    },
    ready() {
        this.itemHeights = [0, 36 * 30 + 36, 36 * 45 + 40, 36 * 60 + 36]
    },
    /**
     * 组件的初始数据
     */
    data: {
        currentAsideIndex: 0,
        standingsView: 'standings0'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onMainScroll: _.throttle(function (e) {
            let top = e.detail.scrollTop
            this.setData({
                currentAsideIndex: this._getIndex(top)
            })
        }, 500),
        _getIndex(top) {
            for (let i=0; i<this.properties.itemHeights.length; i++) {
                if (this.properties.itemHeights[i] <= top && top < this.properties.itemHeights[i + 1] ) {
                    return i
                }
            }
            return 0
        },
        onChangeStanding(e) {
            let index = e.currentTarget.dataset['index']
            this.setData({
                currentAsideIndex:index,
                standingsView: 'standings' + index
            })
        }
    }
})
