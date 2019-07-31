
const common = {
  state: {
    sidebarFold: false,
    documentClientHeight: 0,
    isFullScren: false
  },
  actions: {},
  mutations: {
    SET_SIDEBAR_FOLD: (state, active) => {
      state.sidebarFold = !state.sidebarFold
    },
    SET_DOCUMENT_CLIENT_HEIGHT: (state, value) => {
      state.documentClientHeight = value
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren
    }
  }
}
export default common
