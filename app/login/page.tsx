'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Login.module.css'; // Assuming you have CSS modules set up
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation';
import { User } from '@supabase/auth-helpers-nextjs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser(){
        const {data: {user}} = await supabase.auth.getUser()
        console.log('inside login', user)
        setUser(user)
        setLoading(false)
    }
    getUser();
  }, [])

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Implement your login logic here. For example, you might send the email and password to your backend API.
    console.log('Login with:', email, password);
    const res = await supabase.auth.signInWithPassword({
        email, 
        password
    })
    setUser(res.data.user)
    setEmail('');
    setPassword('');
    router.refresh()
    // After login logic, you might want to redirect the user to a different page
  };

  if (loading) {
    return (
        <h1>
            loading...
        </h1>
    )
  }

  if (user)  {
    router.push('/dashboard')
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>Login</button>
        <p className={styles.signupOption}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
