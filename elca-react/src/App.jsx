import { useState, useEffect } from 'react'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/jsonapi/node/article')
      .then(res => res.json())
      .then(data => {
        setArticles(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p style={{padding: '1rem', color: '#666'}}>Chargement des articles...</p>

  return (
    <section style={{padding: '2rem 0'}}>
      <h2 style={{
        fontFamily: 'Georgia, serif',
        fontSize: '1.5rem',
        color: '#1a1a2e',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #e63946'
      }}>
        Live Feed — Articles en temps réel
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {articles.map(article => (
          <div key={article.id} style={{
            background: 'white',
            border: '1px solid #e8e8e8',
            borderRadius: '6px',
            padding: '1.5rem',
            transition: 'transform 0.2s',
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#e63946',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              React + JSON:API
            </span>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.1rem',
              color: '#1a1a2e',
              margin: '0.5rem 0'
            }}>
              {article.attributes.title}
            </h3>
            <p style={{
              fontSize: '0.85rem',
              color: '#666677',
              margin: 0
            }}>
              {new Date(article.attributes.created).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default App