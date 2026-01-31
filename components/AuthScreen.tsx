import React, { useEffect, useState } from "react";
import { UserProgress } from "../types";

interface AuthScreenProps {
  onAuth: (userData: Partial<UserProgress>) => void;
}

type Mode = "login" | "register" | "pin" | "forgot-password";

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<number>(1);
  const [pinInput, setPinInput] = useState<string>("");
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    school: "",
    class: "11",
    electives: "bio-chem",
    pass: "",
    passConfirm: "",
    pin: "",
  });

  useEffect(() => {
    const savedPin = localStorage.getItem("smart_user_pin");
    const savedEmail = localStorage.getItem("smart_last_email");

    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
    if (savedPin) {
      setMode("pin");
    }
  }, []);

  const handleRegisterNext = () => {
    setError("");

    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError("Барлық өрістерді толтырыңыз");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.region.trim() || !formData.school.trim()) {
        setError("Аймақ пен мектепті енгізіңіз");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (formData.pass !== formData.passConfirm) {
        setError("Құпия сөздер сәйкес келмейді");
        return;
      }
      if (!formData.pass || formData.pass.length < 6) {
        setError("Құпия сөз кемі 6 таңбадан тұруы керек");
        return;
      }
      setStep(4);
      return;
    }
  };

  const handleFinalize = () => {
    setError("");

    if (formData.pin.trim().length !== 4) {
      setError("4 таңбалы ПИН-кодты енгізіңіз");
      return;
    }

    const finalData: Partial<UserProgress> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      region: formData.region.trim(),
      school: formData.school.trim(),
      class: formData.class,
      pin: formData.pin.trim(),
      chosenElectives:
        formData.electives === "creative" ? ["creative"] : formData.electives.split("-"),
    };

    localStorage.setItem("smart_user_pin", formData.pin.trim());
    localStorage.setItem("smart_user_name", formData.name.trim());
    localStorage.setItem("smart_last_email", formData.email.trim());
    localStorage.setItem("smart_user_session", JSON.stringify(finalData));

    onAuth(finalData);
  };

  const handleLogin = () => {
    setError("");

    if (!formData.email.trim()) {
      setError("Поштаны енгізіңіз");
      return;
    }

    localStorage.setItem("smart_last_email", formData.email.trim());

    // Сендегі бұрынғы логикаң: email арқылы "Админ/Пайдаланушы" атауы
    const name = formData.email.trim().toLowerCase() === "ernazarnurtay@gmail.com"
      ? "Админ"
      : "Пайдаланушы";

    onAuth({ email: formData.email.trim(), name });
  };

  const handlePinDigit = (digit: string) => {
    setError("");

    if (pinInput.length >= 4) return;

    const next = pinInput + digit;
    setPinInput(next);

    if (next.length === 4) {
      const saved = localStorage.getItem("smart_user_pin");

      if (saved && next === saved) {
        const savedSession = localStorage.getItem("smart_user_session");
        if (savedSession) {
          try {
            const fullUserData = JSON.parse(savedSession);
            onAuth(fullUserData);
            return;
          } catch (e) {
            // fallback
          }
        }
        onAuth({ name: localStorage.getItem("smart_user_name") || "Пайдаланушы" });
        return;
      }

      setError("ПИН-код қате");
      setTimeout(() => {
        setPinInput("");
        setError("");
      }, 600);
    }
  };

  // ===== Forgot password (әзірге UI demo) =====
  if (mode === "forgot-password") {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 bg-[#FDFDFD] dark:bg-slate-900 py-12 animate-in slide-in-from-bottom">
        <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[40px] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white text-3xl mx-auto shadow-xl mb-4">
              <i className="fas fa-key"></i>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">
              Құпия сөзді ұмыттыңыз ба?
            </h1>
            {resetEmailSent && (
              <p className="mt-3 text-emerald-600 font-bold text-sm">Сілтеме жіберілді (демо)</p>
            )}
          </div>

          {error ? (
            <div className="text-red-500 font-bold text-sm text-center mb-4">{error}</div>
          ) : null}

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email пошта"
              className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <button
              onClick={() => setResetEmailSent(true)}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit"
            >
              Сілтемені жіберу
            </button>

            <button
              onClick={() => {
                setError("");
                setResetEmailSent(false);
                setMode("login");
              }}
              className="w-full text-gray-400 font-bold text-xs text-center uppercase"
            >
              Кіруге оралу
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Main =====
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-[#FDFDFD] dark:bg-slate-900 py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-[22px] flex items-center justify-center text-white text-3xl mx-auto shadow-xl mb-4">
            <i className="fas fa-flask"></i>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-outfit">
            Smart App
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Premium Education Platform
          </p>
        </div>

        {error ? (
          <div className="text-red-500 font-bold text-sm text-center mb-4">{error}</div>
        ) : null}

        {/* ===== PIN mode ===== */}
        {mode === "pin" && (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[40px] p-8 shadow-sm space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white font-outfit">ПИН-код</h2>
              <p className="text-gray-400 text-sm font-bold mt-2">4 таңбалы кодты енгізіңіз</p>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${pinInput.length > i ? "bg-emerald-600" : "bg-gray-200"}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["1","2","3","4","5","6","7","8","9","0"].map((d) => (
                <button
                  key={d}
                  onClick={() => handlePinDigit(d)}
                  className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl py-4 font-black text-xl shadow-sm"
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("smart_user_pin");
                setPinInput("");
                setError("");
                setMode("login");
              }}
              className="w-full text-gray-400 font-bold text-xs text-center uppercase"
            >
              Басқа аккаунтпен кіру
            </button>
          </div>
        )}

        {/* ===== Login ===== */}
        {mode === "login" && (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[40px] p-8 shadow-sm space-y-4">
            <input
              type="email"
              placeholder="Email пошта"
              className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Құпия сөз"
              className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold"
              value={formData.pass}
              onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit"
            >
              Кіру
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setError("");
                  setStep(1);
                  setMode("register");
                }}
                className="text-emerald-600 font-black text-xs uppercase tracking-widest"
              >
                Жаңа аккаунт ашу
              </button>

              <button
                onClick={() => {
                  setError("");
                  setResetEmailSent(false);
                  setMode("forgot-password");
                }}
                className="text-gray-400 font-black text-xs uppercase tracking-widest"
              >
                Құпия сөзді ұмыттым
              </button>
            </div>
          </div>
        )}

        {/* ===== Register ===== */}
        {mode === "register" && (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[40px] p-8 shadow-sm space-y-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 mx-1 rounded-full ${step >= i ? "bg-emerald-600" : "bg-gray-100"}`}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input
                  type="text"
                  placeholder="Аты-жөніңіз"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email пошта"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input
                  type="text"
                  placeholder="Аймақ (мыс: Алматы обл.)"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Мектеп атауы"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                />
                <select
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                >
                  <option value="11">11-сынып</option>
                  <option value="10">10-сынып</option>
                  <option value="9">9-сынып</option>
                </select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input
                  type="password"
                  placeholder="Құпия сөз"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.pass}
                  onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Құпия сөзді қайталаңыз"
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.passConfirm}
                  onChange={(e) => setFormData({ ...formData, passConfirm: e.target.value })}
                />
                <select
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm font-bold outline-none"
                  value={formData.electives}
                  onChange={(e) => setFormData({ ...formData, electives: e.target.value })}
                >
                  <option value="bio-chem">Био + Хим</option>
                  <option value="math-phys">Матем + Физ</option>
                  <option value="creative">Шығармашылық</option>
                </select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center animate-in zoom-in">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="0000"
                  className="w-40 mx-auto p-5 bg-emerald-50 rounded-[30px] text-center text-4xl font-black tracking-[0.3em] outline-none text-emerald-700 font-outfit"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                />
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 ? (
                <button
                  onClick={() => {
                    setError("");
                    setStep(step - 1);
                  }}
                  className="flex-1 bg-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500"
                >
                  Артқа
                </button>
              ) : null}

              <button
                onClick={step === 4 ? handleFinalize : handleRegisterNext}
                className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit"
              >
                {step === 4 ? "Аяқтау" : "Келесі"}
              </button>
            </div>

            <button
              onClick={() => {
                setError("");
                setStep(1);
                setMode("login");
              }}
              className="w-full text-gray-400 font-bold text-xs text-center uppercase"
            >
              Кіруге оралу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
