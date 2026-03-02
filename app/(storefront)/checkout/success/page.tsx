"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

const PaymentSuccessPage = () => {
  const router = useRouter()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-12 rounded-xl shadow-2xl text-center max-w-md">
        <CheckCircle2 className="mx-auto w-24 h-24 text-green-600 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. You will be redirected to the home page in 5 seconds.</p>
        <button 
          onClick={() => router.push('/')}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
