import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: '#2c3e50',
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
      marginTop: '4rem'
    }}>
      <p>
        <a
          href="https://github.com/AaronDiefes"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2E7D32', textDecoration: 'none', margin: '0 1rem' }}
        >
          GitHub
        </a>
        <a
          href="mailto:awdiefes@gmail.com"
          style={{ color: '#2E7D32', textDecoration: 'none', margin: '0 1rem' }}
        >
          Email
        </a>
      </p>
      <p style={{ marginTop: '1rem', opacity: 0.8 }}>
        &copy; {currentYear} Aaron Diefes. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
