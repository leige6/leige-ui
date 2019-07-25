
const common = {
  state: {
    sidebarFold: false,
    documentClientHeight: 0
  },
  actions: {},
  mutations: {
    SET_SIDEBAR_FOLD: (state, active) => {
      state.sidebarFold = !state.sidebarFold
    },
    SET_DOCUMENT_CLIENT_HEIGHT: (state, value) => {
      state.documentClientHeight = value
    }
  }
}
export default common
