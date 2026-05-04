"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Target } from "lucide-react"
import Link from "next/link"

function ResetForm() {
  const params = useSearchParams()
  const token = params.get("token")
  const router = useRouter()

  const [phase, setPhase] = useState<"request" | "reset" | "done">(token ? "reset" : "request")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function sendResetEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setMessage(`Link do resetowania hasła został wysłany na adres ${email}.`)
    } catch {
      setError("Nie udało się wysłać emaila. Sprawdź konfigurację Resend.")
    } finally {
      setLoading(false)
    }
  }

  async function submitNewPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError("Hasło musi mieć co najmniej 8 znaków."); return }
    if (password !== confirm) { setError("Hasła nie są takie same."); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/password-reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Błąd")
      }
      setPhase("done")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd zmiany hasła.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gold-500 rounded-2xl mb-4">
            <Target className="w-7 h-7 text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset hasła</h1>
          <p className="text-navy-100/60 text-sm mt-1">KTS Admin</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
          {phase === "done" ? (
            <div className="text-center space-y-4">
              <p className="text-emerald-600 font-semibold">Hasło zostało zmienione!</p>
              <Link href="/admin/login" className="block w-full bg-navy-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-700 transition-colors text-center">
                Zaloguj się
              </Link>
            </div>
          ) : phase === "reset" ? (
            <form onSubmit={submitNewPassword} className="space-y-4">
              <p className="text-sm text-neutral-600">Wprowadź nowe hasło.</p>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nowe hasło</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Potwierdź hasło</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-navy-900 text-white font-semibold py-2.5 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-60">
                {loading ? "Zapisywanie…" : "Zmień hasło"}
              </button>
            </form>
          ) : (
            <form onSubmit={sendResetEmail} className="space-y-4">
              <p className="text-sm text-neutral-600">
                Podaj swój adres email — wyślemy link do ustawienia hasła.
              </p>
              {message && <p className="text-sm text-emerald-600 font-medium">{message}</p>}
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}
              {!message && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Adres e-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600"
                      placeholder="admin@kts.org.pl"
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-navy-900 text-white font-semibold py-2.5 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-60">
                    {loading ? "Wysyłanie…" : "Wyślij link resetujący"}
                  </button>
                </>
              )}
              <Link href="/admin/login" className="block text-center text-sm text-neutral-500 hover:text-neutral-700">
                Wróć do logowania
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
