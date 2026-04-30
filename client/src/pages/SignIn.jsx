import { Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard?tab=dash");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#e9e9e9] text-black">
      <img
        src="/highmountains.png"
        alt="Atria mountain background"
        className="absolute inset-0 h-full min-h-screen w-full object-cover object-center"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-white/20" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <form
          className="flex w-full max-w-[380px] flex-col gap-6 rounded-2xl border border-white/70 bg-white/95 px-8 py-10 shadow-2xl shadow-gray-900/10 backdrop-blur-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src="/atria-logo.png"
              alt="Atria Logo"
              className="mb-2 h-16 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold tracking-tight text-black">
              Login to your account
            </h1>
            <p className="text-sm text-gray-500 text-balance">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none text-black"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="m@example.com"
                id="email"
                required
                onChange={handleChange}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-black shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none text-black"
                >
                  Password
                </label>
              </div>
              <input
                type="password"
                id="password"
                required
                onChange={handleChange}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-black shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#2cb8d4] px-4 text-sm font-medium text-white transition hover:bg-[#239eb7] disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        </form>
      </section>
    </main>
  );
}
