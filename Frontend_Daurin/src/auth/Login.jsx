import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Pridi:wght@400;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate("/");
  };

  return (
    <main
      className="min-h-screen flex justify-center items-center px-4 py-8"
      style={{ fontFamily: "'Pridi', serif" }}
    >

      <Link to="/">
              <div className="absolute top-10 left-10 z-20 text-white flex items-center gap-2 text-2xl">
              <FaArrowLeft />
              <h1 className="hover:underline cursor-pointer">Back</h1>
            </div>
            </Link>
      <img
        src="/img/backround.png"
        className="fixed top-0 left-0 w-screen h-screen -z-50 object-cover"
        alt=""
      />
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-green-500 flex flex-col items-center gap-10 md:gap-16 p-6 md:p-10">
        <div className="flex justify-center items-center gap-3">
          <img src="/img/logo.png" className="w-[50px] h-[50px]" alt="" />
          <h1 className="text-2xl md:text-3xl font-semibold text-[#005048]">DAURIN</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base" htmlFor="">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="daurin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          

          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base" htmlFor="">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-[#005048] mt-6 md:mt-10 w-full h-[48px] md:h-[55px] rounded-xl text-lg md:text-xl disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        <h6 className="text-sm text-black/50 text-center">
          Belum Punya Akun?{" "}
            <Link to="/register">
              <span className="text-[#005048] font-bold hover:underline">Register</span>
            </Link>
        </h6>
      </div>
    </main>
  )
}

export default Login
