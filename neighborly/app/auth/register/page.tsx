'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword,setShowPassowrd] = useState(false)

  // Auto-fetch city from pincode using OpenStreetMap API
  useEffect(() => {
    const fetchCity = async () => {
      if (pincode.length < 5) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
        );
        const data = await res.json();
        if (data.length > 0) {
          setCity(data[0].display_name);
        }
      } catch (err) {
        console.error('City lookup failed', err);
      }
    };
    fetchCity();
  }, [pincode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, pincode, city }),
    });

    if (res.ok) {
      router.push('/auth/login');
    } else {
      const err = await res.json();
      alert(err.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center  px-4">
      <div className="w-full max-w-md  p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            autoComplete="name"
          />

          <input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            autoComplete="email"
          />
<div className="relative">

    <input
            placeholder="Password"
            type={showPassword? "text":"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            autoComplete="new-password"
          />

          <button className="absolute inset-y-0 right-3 flex items-center" 
          onClick={()=>setShowPassowrd(!showPassword)}
          type="button">

               {showPassword?<svg data-state="main" data-version="v1" width="24" height="24" fill="none" viewBox="0 0 24 24" data-icon="eye" aria-hidden="true" className="blocks-1avyp1d"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" d="M8.75 13a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0ZM12 11.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" clip-rule="evenodd"></path><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" d="M12 3a1 1 0 0 1 1 1v2.045a10.76 10.76 0 0 1 3.415.89l.69-1.382a1 1 0 0 1 1.79.894l-.736 1.47c.686.476 1.31 1.029 1.863 1.647l.77-.771a1 1 0 1 1 1.415 1.414l-.987.987c.342.577.608 1.185.857 1.806-1.67 4.164-5.52 7-10.077 7-4.558 0-8.408-2.836-10.077-7 .248-.62.515-1.23.857-1.805l-.987-.988a1 1 0 0 1 1.414-1.414l.77.77a10.646 10.646 0 0 1 1.864-1.646l-.735-1.47a1 1 0 0 1 1.788-.894l.691 1.381A10.77 10.77 0 0 1 11 6.045V4a1 1 0 0 1 1-1ZM4.088 13c1.348 2.938 4.373 5 7.912 5 3.539 0 6.563-2.062 7.912-5C18.41 9.728 15.205 8 12 8c-3.206 0-6.412 1.733-7.912 5Z" clipRule="evenodd"></path></svg>:
               <svg data-state="main" data-version="v1" width="24" height="24" fill="none" viewBox="0 0 24 24" data-icon="eye-closed" aria-hidden="true" className="blocks-1avyp1d"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M11 20a1 1 0 0 0 2 0v-2.045a10.77 10.77 0 0 0 3.415-.89l.69 1.382a1 1 0 1 0 1.79-.894l-.736-1.47a10.644 10.644 0 0 0 1.863-1.647l.77.771a1 1 0 0 0 1.415-1.414l-.988-.988c.272-.456.51-.935.709-1.433a1 1 0 1 0-1.856-.744C18.814 13.762 15.686 16 12 16c-3.687 0-6.816-2.238-8.072-5.372a1 1 0 0 0-1.856.744c.2.498.437.977.708 1.434l-.987.987a1 1 0 1 0 1.414 1.414l.77-.77c.553.617 1.178 1.17 1.864 1.646l-.735 1.47a1 1 0 1 0 1.788.894l.691-1.381a10.76 10.76 0 0 0 3.415.889V20Z"></path></svg> }
               
          </button>

</div>
        

          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            autoComplete="postal-code"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            autoComplete="address-level2"
          />

          <button
            disabled={loading}
            className="w-full rounded-full bg-[#0D1164] text-white py-3 font-semibold hover:bg-opacity-90 transition"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-[#0D1164] font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
