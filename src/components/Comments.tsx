'use client';

import { useState, useEffect } from 'react';

type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
};

const MOCK_COMMENTS: Comment[] = [
  { id: '1', author: 'Majaster', text: 'white lemon MUITO abaixo', date: '23 de jul. 15:06' },
  { id: '2', author: 'Darkzinspx', text: 'C ACHA QUE SE EU NÃO TIVESSE XITADO EUAUAHUSHUAHSshuehue NÃO TERIA MIRADO DO OUTRO LADO? IA OU NÃO IA????', date: '23 de jul. 12:27' },
  { id: '3', author: 'colorado', text: 'pacal ta troll', date: '23 de jul. 12:23' },
  { id: '4', author: 'Rodrigold', text: 'Vamo Mengão, Messi > Cr7', date: '23 de jul. 10:21' },
];

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('Anônimo');

  useEffect(() => {
    // Carregar comentários do localStorage ou usar mock inicial
    const stored = localStorage.getItem('gurizada_comments');
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      setComments(MOCK_COMMENTS);
      localStorage.setItem('gurizada_comments', JSON.stringify(MOCK_COMMENTS));
    }
    
    // Gerar um nome aleatório ou pegar do localStorage pro user atual
    const storedAuthor = localStorage.getItem('gurizada_author');
    if (storedAuthor) {
      setAuthorName(storedAuthor);
    } else {
      const randomName = `Visitante ${Math.floor(Math.random() * 1000)}`;
      setAuthorName(randomName);
      localStorage.setItem('gurizada_author', randomName);
    }
  }, []);

  const handlePost = () => {
    if (!newComment.trim()) return;

    const dateObj = new Date();
    const formattedDate = `${dateObj.getDate()} de jul. ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    const newEntry: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: authorName,
      text: newComment,
      date: formattedDate
    };

    const updated = [newEntry, ...comments];
    setComments(updated);
    localStorage.setItem('gurizada_comments', JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h3 className="card-title" style={{ marginBottom: '2rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Mural de Resenha
      </h3>
      
      {/* Input box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#fff' }}>{authorName} (Você)</strong>
              <button 
                onClick={() => {
                  const newName = prompt('Qual o seu nome?', authorName);
                  if (newName) {
                    setAuthorName(newName);
                    localStorage.setItem('gurizada_author', newName);
                  }
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
              >
                Mudar Nome
              </button>
            </div>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Manda a resenha aqui..."
              style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', color: '#fff', outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={handlePost} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Enviar</button>
            </div>
          </div>
        </div>
      </div>

      {/* List of comments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
              {comment.author.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--cyan)', fontSize: '0.95rem' }}>{comment.author}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.date}</span>
              </div>
              <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
