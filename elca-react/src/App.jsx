import { useState, useEffect, useCallback, useRef } from 'react'

const POLL_MS = 15_000
const API_URL = '/jsonapi/node/article'

function stripHtml(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || ''
}

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const intervalRef = useRef(null)

  const fetchArticles = useCallback(async (isInitial = false) => {
    try {
      const url = API_URL;
      const res = await fetch(url, {
        cache: 'no-store',
      })
      const json = await res.json()
      const sorted = (json.data || []).sort((a, b) =>
        new Date(b.attributes.changed || b.attributes.created) -
        new Date(a.attributes.changed || a.attributes.created)
      )
      setArticles(sorted)
      setLastUpdated(new Date())
    } catch {
      // silently fail on poll errors
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles(true)
    intervalRef.current = setInterval(() => fetchArticles(false), POLL_MS)
    return () => clearInterval(intervalRef.current)
  }, [fetchArticles])

  if (loading) {
    return <p style={{ padding: '1rem', color: '#666' }}>Chargement des articles...</p>
  }

  return (
    <section style={{ padding: '2rem 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #e63946',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.5rem',
          color: '#1a1a2e',
          margin: 0
        }}>
          Fil en direct — Articles en temps réel
        </h2>
        {lastUpdated && (
          <span style={{
            fontSize: '0.75rem',
            color: '#999',
            fontStyle: 'italic'
          }}>
            Mis à jour : {lastUpdated.toLocaleTimeString('fr-FR')}
          </span>
        )}
      </div>

      {articles.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun article pour le moment.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {articles.map(article => {
            const { title, body, created, changed, path, drupal_internal__nid: nid } = article.attributes
            const excerpt = body?.processed
              ? stripHtml(body.processed).substring(0, 120)
              : ''
            const articleUrl = path?.alias || `/node/${nid}`
            const wasEdited = changed && created && changed !== created

            return (
              <a
                key={article.id}
                href={articleUrl}
                style={{
                  background: 'white',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: '#e63946',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    React + JSON:API
                  </span>
                  {wasEdited && (
                    <span style={{
                      fontSize: '0.65rem',
                      color: '#e67e22',
                      fontWeight: '600',
                      padding: '2px 6px',
                      background: '#fef3e2',
                      borderRadius: '3px'
                    }}>
                      Modifié
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.1rem',
                  color: '#1a1a2e',
                  margin: '0.5rem 0'
                }}>
                  {title}
                </h3>
                {excerpt && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#555',
                    margin: '0.5rem 0',
                    lineHeight: '1.4'
                  }}>
                    {excerpt}…
                  </p>
                )}
                <div style={{
                  fontSize: '0.78rem',
                  color: '#666677',
                  marginTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>
                    {new Date(created).toLocaleDateString('fr-FR')}
                  </span>
                  {wasEdited && (
                    <span style={{ fontStyle: 'italic' }}>
                      éd. {new Date(changed).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default App