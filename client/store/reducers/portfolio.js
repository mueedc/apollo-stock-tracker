import axios from 'axios'
import {
  ADD_TO_PORTFOLIO,
  REMOVE_FROM_PORTFOLIO,
  UPDATE_PORTFOLIO,
  SET_SESSION_PORTFOLIO,
  CLEAR_PORTFOLIO,
  addToPortfolio,
  removeFromPortfolio,
  updatePortfolio,
  setSessionPortfolio,
  clearPortfolio
} from '../actions/portfolio'

// Thunk middleware
export const fetchPortfolio = () => dispatch =>
  axios
    .get(`/api/portfolio`)
    .then(stocks => dispatch(setSessionPortfolio(stocks.data)))
    .catch(error => console.error(`Fetching portfolio unsuccessful:`, error))

export const removeStock = stock => dispatch =>
  axios
    .put(`/api/stock`, stock)
    .then(() => dispatch(removeFromPortfolio()))
    .catch(error => console.error(`Removing ${stock} unsuccessful:`, error))

export const addStock = stock => dispatch =>
  axios
    .post(`/api/portfolio`, stock)
    .then(res => {
      dispatch(addToPortfolio(res.data))
    })
    .catch(error => dispatch(addToPortfolio({ error })))

export const changePortfolio = stock => dispatch =>
  axios
    .put(`/api/stock/${stock.symbol}`, stock)
    .then(res => dispatch(updatePortfolio(res.data)))
    .catch(error => updatePortfolio({ error }))

export const logoutPortfolio = () => dispatch =>
  axios
    .delete(`/api/portfolio/session`)
    .then(() => dispatch(clearPortfolio()))
    .catch(() => dispatch(clearPortfolio()))

// Reducer
export default function (state = [], action) {
  switch (action.type) {
    case SET_SESSION_PORTFOLIO:
      return action.stocks
    case ADD_TO_PORTFOLIO:
      return [...state, action.stock]
    case UPDATE_PORTFOLIO:
      return state.map(
        stock => (stock.symbol === action.stock.symbol ? action.stock : stock)
      )
    case REMOVE_FROM_PORTFOLIO:
      return state.filter(stock => stock.symbol !== action.stock.symbol)
    case CLEAR_PORTFOLIO:
      return state
    default:
      return state
  }
}