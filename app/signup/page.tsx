'use client'

import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/Login.module.css'; // Adjust the path as necessary
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/auth-helpers-nextjs';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Implement your signup logic here. For example, you might send the email and password to your backend API.
    console.log('Signup with:', email, password, confirmPassword);
    
    const res = await supabase.auth.signUp({
        email,
        password,
        options: {emailRedirectTo: `${location.origin}/auth/callback`}
    })
    setEmail('');
    setPassword('');
    setUser(res.data.user);
    //console.log(user)
    router.refresh()
    // After signup logic, you might want to redirect the user to a different page
  };

  if (user) {
    router.push('/login')
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>Sign Up</button>
        <p className={styles.signupOption}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
