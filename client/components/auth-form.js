import React from 'react'
import { connect } from 'react-redux'
import { auth } from '../store'

const AuthForm = ({ name, displayName, handleSubmit, error }) => (
  <div>
    <form onSubmit={handleSubmit} name={name}>
      <div>
        <label htmlFor='email'>
          <small>Email</small>
        </label>
        <input name='email' type='text' />
      </div>
      <div>
        <label htmlFor='password'>
          <small>Password</small>
        </label>
        <input name='password' type='password' />
      </div>
      <div>
        <button type='submit'>{displayName}</button>
      </div>
      {error && error.response && <div> {error.response.data} </div>}
    </form>
    <a href='/auth/google'>{displayName} with Google</a>
  </div>
)

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    portfolioId: state.portfolioId,
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    portfolioId: state.portfolioId,
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit (user, formName) {
      dispatch(auth(user, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
