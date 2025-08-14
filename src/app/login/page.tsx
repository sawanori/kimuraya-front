'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  ChefHat,
  Utensils,
  Store,
  AlertCircle,
  Check
} from 'lucide-react'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [validations, setValidations] = useState({
    hasEmail: false,
    hasPassword: false,
    passwordLength: false
  })

  useEffect(() => {
    setMounted(true)
    // Preload the background animation
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    setValidations({
      hasEmail: email.includes('@') && email.includes('.'),
      hasPassword: password.length > 0,
      passwordLength: password.length >= 6
    })
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validations.hasEmail) {
      setError('有効なメールアドレスを入力してください')
      return
    }
    
    if (!validations.passwordLength) {
      setError('パスワードは6文字以上で入力してください')
      return
    }
    
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.user) {
        // Success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/home')
      } else {
        setError(data.errors?.[0]?.message || 'メールアドレスまたはパスワードが正しくありません')
        // Shake animation on error
        const form = document.querySelector('.login-form')
        form?.classList.add('shake')
        setTimeout(() => form?.classList.remove('shake'), 500)
      }
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="gradient-sphere sphere-4"></div>
        
        {/* Floating Icons */}
        <div className="floating-icons">
          <div className="floating-icon icon-1">
            <ChefHat className="w-8 h-8 text-white/20" />
          </div>
          <div className="floating-icon icon-2">
            <Utensils className="w-6 h-6 text-white/15" />
          </div>
          <div className="floating-icon icon-3">
            <Store className="w-10 h-10 text-white/10" />
          </div>
          <div className="floating-icon icon-4">
            <Sparkles className="w-5 h-5 text-white/25" />
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className={`login-card ${mounted ? 'mounted' : ''}`}>
        {/* Logo Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-circle">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div className="logo-glow"></div>
          </div>
          <h1 className="login-title">
            管理システムへようこそ
          </h1>
          <p className="login-subtitle">
            アカウント情報を入力してログイン
          </p>
        </div>

        {/* Form Section */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className={`form-group ${emailFocused ? 'focused' : ''} ${email ? 'has-value' : ''}`}>
            <div className="input-icon">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="email" className="form-label">
              メールアドレス
            </label>
            {email && (
              <div className="input-validation">
                {validations.hasEmail ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className={`form-group ${passwordFocused ? 'focused' : ''} ${password ? 'has-value' : ''}`}>
            <div className="input-icon">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="password-strength">
              <div className="strength-bars">
                <div className={`strength-bar ${password.length >= 1 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${password.length >= 4 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${password.length >= 6 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${password.length >= 8 ? 'active strong' : ''}`}></div>
              </div>
              <span className="strength-text">
                {password.length < 6 ? '弱い' : password.length < 8 ? '普通' : '強い'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !validations.hasEmail || !validations.passwordLength}
            className="submit-button"
          >
            <span className="button-text">
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </span>
            {!isLoading && (
              <ArrowRight className="button-icon" />
            )}
            {isLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <p className="demo-title">デモアカウント</p>
            <div className="credential-item">
              <span className="credential-label">Email:</span>
              <code className="credential-value">admin@example.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-label">Password:</span>
              <code className="credential-value">password123</code>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}