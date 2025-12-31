'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    if (res?.ok) router.push('/home');
    else alert('Invalid credentials');
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="w-full max-w-md  p-8 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome back</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <input
            type="text"
            placeholder="Email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword?<svg data-state="main" data-version="v1" width="24" height="24" fill="none" viewBox="0 0 24 24" data-icon="eye" aria-hidden="true" className="blocks-1avyp1d"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" d="M8.75 13a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM12 11.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" clipRule="evenodd"></path><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" d="M12 3a1 1 0 0 1 1 1v2.045a10.76 10.76 0 0 1 3.415.89l.69-1.382a1 1 0 0 1 1.79.894l-.736 1.47c.686.476 1.31 1.029 1.863 1.647l.77-.771a1 1 0 1 1 1.415 1.414l-.987.987c.342.577.608 1.185.857 1.806-1.67 4.164-5.52 7-10.077 7-4.558 0-8.408-2.836-10.077-7 .248-.62.515-1.23.857-1.805l-.987-.988a1 1 0 0 1 1.414-1.414l.77.77a10.646 10.646 0 0 1 1.864-1.646l-.735-1.47a1 1 0 0 1 1.788-.894l.691 1.381A10.77 10.77 0 0 1 11 6.045V4a1 1 0 0 1 1-1ZM4.088 13c1.348 2.938 4.373 5 7.912 5 3.539 0 6.563-2.062 7.912-5C18.41 9.728 15.205 8 12 8c-3.206 0-6.412 1.733-7.912 5Z" clipRule="evenodd"></path></svg>:
               <svg data-state="main" data-version="v1" width="24" height="24" fill="none" viewBox="0 0 24 24" data-icon="eye-closed" aria-hidden="true" className="blocks-1avyp1d"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M11 20a1 1 0 0 0 2 0v-2.045a10.77 10.77 0 0 0 3.415-.89l.69 1.382a1 1 0 1 0 1.79-.894l-.736-1.47a10.644 10.644 0 0 0 1.863-1.647l.77.771a1 1 0 0 0 1.415-1.414l-.988-.988c.272-.456.51-.935.709-1.433a1 1 0 1 0-1.856-.744C18.814 13.762 15.686 16 12 16c-3.687 0-6.816-2.238-8.072-5.372a1 1 0 0 0-1.856.744c.2.498.437.977.708 1.434l-.987.987a1 1 0 1 0 1.414 1.414l.77-.77c.553.617 1.178 1.17 1.864 1.646l-.735 1.47a1 1 0 1 0 1.788.894l.691-1.381a10.76 10.76 0 0 0 3.415.889V20Z"></path></svg> }
         
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-sm">
            <Link href="/auth/forgot" className="text-[#0D1164] font-medium underline cursor-not-allowed">
              Forgot my password
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-full bg-[#0D1164] text-white py-3 font-semibold hover:bg-opacity-90 transition"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Don’t have an account? </span>
          <Link href="/auth/register" className="text-[#0D1164] font-medium underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
