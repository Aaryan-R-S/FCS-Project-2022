import React from 'react'
import '../App.css';
const logo = '../cardiogram.png'

export default function Home() {
  return (
    <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Welcome to <code>eCare</code> health portal.
      </p>
    </header>
  </div>
  )
}
