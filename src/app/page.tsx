import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Icon */}
        <div className="mb-8 p-6 bg-black rounded-full">
          <Shield size={48} className="text-white" />
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl font-black text-black text-center mb-4 leading-tight">
          CANTOR
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-600 text-center mb-2 font-semibold">
          Secure Authentication
        </p>

        {/* Description */}
        <p className="text-lg text-gray-600 text-center mb-12 max-w-xl">
          Welcome to your secure dashboard. Please login to continue.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
          <Link href="/login" className="flex-1">
            <Button 
              size="lg" 
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-6 rounded-lg border-2 border-black text-base flex items-center justify-center gap-2 transition-all"
            >
              Login
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/register" className="flex-1">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-bold py-6 rounded-lg text-base transition-all"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}