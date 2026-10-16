import React, { useEffect, useMemo, useState } from 'react';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';
const TODOS_KEY = 'daymark-todos';

function readTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(TODOS_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Those details do not match the demo account.');
      return;
    }
    setError('');
    onLogin();
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Brand />
        <p className="eyebrow">A LITTLE MORE CLARITY</p>
        <h1>Make room for<br />what matters.</h1>
        <p className="login-copy">Sign in to pick up right where you left off.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button login-submit" type="submit">Sign in <span aria-hidden="true">?</span></button>
        </form>
        <div className="demo-hint"><span className="hint-dot" /> Demo access <span className="hint-divider">�</span> student@example.com</div>
      </section>
      <aside className="login-art" aria-label="A calm workspace with a cup of coffee">
        <div className="art-sun" />
        <div className="art-window"><div className="window-light" /><div className="window-shadow" /></div>
        <div className="art-table" />
        <div className="art-vase"><i /><i /><i /></div>
        <div className="art-cup"><span /></div>
        <div className="art-note"><span>�</span><p>Small steps<br />still move you<br />forward.</p><i /></div>
        <div className="art-caption"><span>01 / YOUR DAY, AT A GLANCE</span><span className="caption-line" /></div>
      </aside>
    </main>
  );
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><i /><i /><i /></span><span>daymark</span></div>;
}

function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => localStorage.setItem(TODOS_KEY, JSON.stringify(todos)), [todos]);

  const remaining = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return todos.filter((todo) => {
      const matchesSearch = String(todo.text ?? '').toLocaleLowerCase().includes(query);
      const matchesFilter = filter === 'Active' ? !todo.completed
        : filter === 'Completed' ? todo.completed
          : true;
      return matchesSearch && matchesFilter;
    });
  }, [todos, filter, searchQuery]);

  function addTodo(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((current) => [{ id: `${Date.now()}-${Math.random()}`, text, completed: false }, ...current]);
    setDraft('');
  }

  function toggleTodo(id) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <main className="todo-page">
      <header className="topbar"><Brand /><div className="topbar-right"><span className="signed-in"><span /> Signed in</span><button className="logout-button" onClick={onLogout}>Log out <span aria-hidden="true">?</span></button></div></header>
      <section className="todo-content">
        <div className="greeting-row"><div><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>A clearer day<br /><span>starts here.</span></h1></div><div className="date-card"><span className="date-icon">?</span><span>ONE THING AT A TIME</span></div></div>
        <form className="add-form" onSubmit={addTodo}><span className="add-plus">+</span><input aria-label="New todo" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What needs your attention?" /><button type="submit" className="primary-button">Add task <span aria-hidden="true">?</span></button></form>
        <div className="search-row"><span className="search-icon" aria-hidden="true" /><label className="sr-only" htmlFor="todo-search">Search tasks</label><input id="todo-search" type="search" autoComplete="off" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search your tasks" />{searchQuery && <button className="clear-search" type="button" onClick={() => setSearchQuery('')}>Clear</button>}</div>
        <div className="list-heading"><div><h2>Your tasks <span className="task-count">{todos.length}</span></h2><p>A little progress adds up.</p></div><div className="filters" aria-label="Filter tasks">{['All', 'Active', 'Completed'].map((option) => <button key={option} className={filter === option ? 'filter active-filter' : 'filter'} onClick={() => setFilter(option)} aria-pressed={filter === option}>{option}</button>)}</div></div>
        <section className="task-list" aria-label="Todo list">
          {visibleTodos.length === 0 ? <div className="empty-state"><span className="empty-spark">?</span><h3>{searchQuery.trim() ? 'No matching tasks.' : todos.length === 0 ? 'A fresh start.' : `No ${filter.toLowerCase()} tasks.`}</h3><p>{searchQuery.trim() ? <>No tasks match <strong>{searchQuery.trim()}</strong>. Try another search.</> : todos.length === 0 ? 'Add your first task above and take it one step at a time.' : 'Try another filter to find what you are looking for.'}</p></div> : visibleTodos.map((todo, index) => <article className={`todo-item${todo.completed ? ' is-complete' : ''}`} key={todo.id} style={{ animationDelay: `${index * 45}ms` }}><button className="check-button" onClick={() => toggleTodo(todo.id)} aria-label={todo.completed ? `Mark ${todo.text} as active` : `Mark ${todo.text} as completed`} aria-pressed={todo.completed}>{todo.completed && <span>?</span>}</button><span className="todo-text">{todo.text}</span><button className="delete-button" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.text}`} title="Delete task">�</button></article>)}
        </section>
        <footer className="todo-footer"><span><b>{remaining}</b> {remaining === 1 ? 'task' : 'tasks'} left to do</span><span className="footer-mark">MAKE TODAY COUNT <i>?</i></span></footer>
      </section>
      <div className="bottom-decoration"><span>?</span></div>
    </main>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('daymark-session') === 'active');
  function login() {
    sessionStorage.setItem('daymark-session', 'active');
    setLoggedIn(true);
  }
  function logout() {
    sessionStorage.removeItem('daymark-session');
    setLoggedIn(false);
  }
  return loggedIn ? <TodoPage onLogout={logout} /> : <Login onLogin={login} />;
}

