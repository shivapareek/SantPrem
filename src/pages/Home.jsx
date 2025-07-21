import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { account } from "../lib/appwrite";

const Home = () => {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        "google",
        "http://localhost:5173/",
        "http://localhost:5173/"
      );
    } catch (error) {
      console.error("OAuth login failed:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await account.get();
      setUser(res);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // fetch user on load
  }, []);

  return (
    <div className="h-full w-full bg-black text-white flex items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-2xl">
        {user ? (
          <>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Welcome, <span className="text-yellow-500">{user.name || "User"}</span>!
            </h1>
            <p className="text-gray-400 text-base">
              You are now signed in through Google. Explore the zones using the sidebar.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Discover the empowering guidance{" "}
              <span className="text-yellow-500">Sant Prem</span> brings to your life
            </h1>
            <p className="text-gray-400 text-base">Let's start by signing in.</p>
            <button
              className="mt-4 bg-transparent border border-neutral-700 hover:border-yellow-500 transition text-white px-6 py-3 rounded-xl flex items-center gap-3 justify-center mx-auto shadow-sm hover:shadow-yellow-500/20"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={24} />
              Continue With Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
