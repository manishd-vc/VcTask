import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        <h1 className="text-4xl font-bold">WellnessHub</h1>

        <div className="w-full max-w-md space-y-8">
          <h2 className="text-lg font-bold text-center">Sign In</h2>

          <div className="bg-blue-50 p-4 rounded-md text-center">
            Enter your email address and password to sign in
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="xyz@example.com"
                className="w-full px-4 py-2 rounded-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#45c1b8]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="******"
                className="w-full px-4 py-2 rounded-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#45c1b8]"
              />
            </div>

            <Link href="/" className="block w-full">
              <button
                type="button"
                className="w-full bg-[#45c1b8] text-white font-medium px-4 py-2 rounded-md"
              >
                Login
              </button>
            </Link>
          </form>

          <div className="text-center pt-4">
            <a href="#" className="text-gray-600 hover:text-[#45c1b8]">
              Forgot Email?
            </a>
          </div>

          <div className="text-center pt-2">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="#" className="text-[#45c1b8] font-medium">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
