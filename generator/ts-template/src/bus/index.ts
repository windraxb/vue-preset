import Vue from 'vue'

/**
 * @author windraxb
 * @date 2020-12-20 22:00
 * @description
 * Vue中的EventBus也有生命周期
 * 在使用中经常最容易忽视，又必然不能忘记的东西，那就是:清除事件总线 eventBus。
 *
 * 不手动清除，它是一直会存在，这样当前执行时，会反复进入到接受数据的组件内操作获取数据，原本只执行一次的获取的操作将会有多次操作。本来只会触发并只执行一次，变成了多次，这个问题就非常严重。
 当不断进行操作几分钟后，页面就会卡顿，并占用大量内存。
 所以一般在vue生命周期 beforeDestroy或者 destroyed中，需要用vue实例的 $off方法清除 eventBus
 可当你有多个 eventBus时，就需要重复性劳动 $off销毁这件事儿。这时候封装一个 eventBus就是更佳的解决方案。
 */
class EventBus {
  private handles: any;
  private readonly Vue: any;
  private readonly eventMapUid: object;
  constructor (vue) {
    if (!this.handles) {
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false
      })
    }
    this.Vue = vue
    //  _uid和EventName的映射
    this.eventMapUid = {}
  }

  setEventMapUid (uid, eventName) {
    if (!this.eventMapUid[uid]) this.eventMapUid[uid] = []
    this.eventMapUid[uid].push(eventName)
  }

  $on (eventName, callback, vm) {
    if (!this.handles[eventName]) this.handles[eventName] = []
    this.handles[eventName].push(callback)
    if (vm instanceof this.Vue) this.setEventMapUid(vm._uid, eventName)
  }

  $emit (...args) {
    const eventName = args[0]
    const params = args.slice(1)
    if (this.handles[eventName]) {
      const len = this.handles[eventName].length
      for (let i = 0; i < len; i++) {
        this.handles[eventName][i](...params)
      }
    }
  }

  $offVmEvent (uid) {
    const currentEvents = this.eventMapUid[uid] || []
    currentEvents.forEach((event) => {
      this.$off(event)
    })
    if (currentEvents.length) {
      delete this.eventMapUid[uid]
    }
  }

  $off (eventName) {
    delete this.handles[eventName]
  }
}

const $EventBus: any = {}

$EventBus.install = (Vue) => {
  window.$eventBus = new EventBus(Vue)
  Vue.prototype.$eventBus = new EventBus(Vue)
  Vue.mixin({
    beforeDestroy (): void {
      this.$eventBus.$offVmEvent(this._uid)
    }
  })
}

Vue.use($EventBus)

// 组件中使用
// created () {
//   this.$EventBus.$on('click-img', (...args) => {
//     console.log(...args)
//   })
// }

// handleClickImg () {
//   this.$EventBus.$emit('click-img', this.count++)
// }
