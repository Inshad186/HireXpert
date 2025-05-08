import { SignupForm } from '@/components/user/sign-up'

function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <SignupForm/>
        </div>
      </div>
  )
}

export default SignUp
