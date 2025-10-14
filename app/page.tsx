import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Lightbulb, FileText, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#00BFA5]" />
              <span className="text-xl font-bold text-[#001F3F]">RentIntel</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#00BFA5] hover:bg-[#00A891]">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#001F3F] mb-6">
            Maximize Your Rental
            <br />
            <span className="text-[#00BFA5]">Property Returns</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered insights and market intelligence to help landlords and property managers make
            data-driven decisions and boost portfolio performance.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#00BFA5] hover:bg-[#00A891] text-lg px-8">
                Try RentIntel Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Free plan includes up to 3 properties</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#001F3F] mb-12">
            Everything you need to manage your portfolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>AI Rent Prediction</CardTitle>
                <CardDescription>
                  Get accurate rent predictions based on market data, property features, and regional trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>Smart Insights</CardTitle>
                <CardDescription>
                  Receive AI-powered recommendations for pricing optimization, vacancy reduction, and ROI improvement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <FileText className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>Monthly Reports</CardTitle>
                <CardDescription>
                  Automated portfolio performance reports delivered to your inbox every month
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <Building2 className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Track all your properties, tenants, and leases in one centralized dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>
                  Monitor tenant risk scores and payment status to protect your investment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#00BFA5] transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-[#00BFA5] mb-4" />
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>
                  Access real-time market data for Johannesburg, Cape Town, Durban, and Rosebank
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#001F3F] mb-12">
            Simple, transparent pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold mt-4">R0</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Up to 3 properties
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Basic insights
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Email support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-[#00BFA5] border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#00BFA5] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold mt-4">R499</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Up to 20 properties
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Full AI insights
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Monthly reports
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Priority support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-[#00BFA5] hover:bg-[#00A891]">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold mt-4">R1,999</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Unlimited properties
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Advanced AI features
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    White-label ready
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                    Dedicated support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-[#001F3F] to-[#003A6C]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to optimize your portfolio?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join property managers who use RentIntel to make smarter investment decisions
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[#00BFA5] hover:bg-[#00A891] text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-[#00BFA5]" />
                <span className="text-lg font-bold text-[#001F3F]">RentIntel</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-driven rental property intelligence for South Africa
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#001F3F] mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/signin" className="hover:text-[#00BFA5]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-[#00BFA5]">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#001F3F] mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-[#00BFA5]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#00BFA5]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#001F3F] mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-[#00BFA5]">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#00BFA5]">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 RentIntel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
