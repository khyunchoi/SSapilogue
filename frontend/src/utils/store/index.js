import API from "../../api/API"

const store = {
  setToken(token) {
	  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
	  localStorage.setItem("jwt", `Bearer ${token}`)
  },
  getToken() {
    const token = localStorage.getItem("jwt")
	  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (token) {
      return true;
    }
    return false;
  },
}

export default store;