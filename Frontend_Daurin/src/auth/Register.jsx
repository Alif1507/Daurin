import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirm: "" });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Pridi:wght@400;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Password dan konfirmasi tidak sama");
      return;
    }
    const ok = await register({
      email: form.email,
      username: form.username,
      password: form.password,
    });
    if (ok) navigate("/login");
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
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base" htmlFor="">
              Username
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="daurin"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
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
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base" htmlFor="">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder=""
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-[#005048] mt-6 md:mt-10 w-full h-[48px] md:h-[55px] rounded-xl text-lg md:text-xl disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Register"}
          </button>
        </form>
        <h6 className="text-sm text-black/50 text-center">
          Sudah Punya Akun?{" "}
          <Link to='/login'>
            <span className="text-[#005048] font-bold hover:underline">Login</span>
          </Link>
        </h6>
      </div>
    </main>
  )
}

export default Register
