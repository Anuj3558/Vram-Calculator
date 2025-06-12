"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Calculator,
  Zap,
  Settings,
  BarChart,
  Download,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

// Typewriter Hook
function useTypewriter(texts: string[], speed = 50, delayBetweenTexts = 2000) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentTextIndex]

    if (isDeleting) {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, speed / 2)

        return () => clearTimeout(timeout)
      } else {
        setIsDeleting(false)
        setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        setCurrentIndex(0)
      }
    } else {
      if (currentIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentText.substring(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }, speed)

        return () => clearTimeout(timeout)
      } else if (displayText === currentText) {
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, delayBetweenTexts)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentIndex, currentTextIndex, displayText, isDeleting, speed, texts, delayBetweenTexts])

  return displayText
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, start, duration])

  return { count, ref }
}

// Parallax Hook
function useParallax(ref: React.RefObject<HTMLElement>, intensity = 0.1) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const centerY = window.innerHeight / 2
      const distanceFromCenter = rect.top + rect.height / 2 - centerY
      const translateY = distanceFromCenter * intensity

      element.style.transform = `translateY(${translateY}px)`
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, intensity])
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const heroTexts = [
    "Maximize  GPU Efficiency", 
    "Optimize AI Workloads", 
    "Save Thousands on Costs", 
    "Scale  Models Seamlessly"
  ]
  const typewriterText = useTypewriter(heroTexts, 100, 1500)
  const parallaxRef1 = useRef<HTMLDivElement>(null)
  const parallaxRef2 = useRef<HTMLDivElement>(null)
  
  useParallax(parallaxRef1, 0.05)
  useParallax(parallaxRef2, 0.03)

  const features = [
    {
      icon: Calculator,
      title: "Precise VRAM Calculation",
      description: "Get accurate memory requirements for AI models with support for various quantization methods",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Inference & Fine-tuning",
      description: "Calculate memory for both inference workloads and fine-tuning scenarios",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart,
      title: "Real-time Visualization",
      description: "Interactive charts and breakdowns to understand memory usage patterns",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Settings,
      title: "Hardware Optimization",
      description: "GPU-specific recommendations and multi-GPU configurations",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  const benefits = [
    "Save thousands on GPU costs",
    "Optimize model deployment",
    "Prevent memory overflow",
    "Scale efficiently",
    "Expert recommendations",
    "Real-time calculations",
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "ML Engineer at TechCorp",
      content: "This tool saved us $50K in GPU costs by optimizing our model configurations.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "AI Researcher",
      content: "The accuracy is incredible. It predicted our exact VRAM usage within 2%.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Data Science Lead",
      content: "Essential tool for anyone working with large language models.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Senior DevOps Engineer",
      content: "Streamlined our entire ML pipeline. The optimization suggestions are spot-on.",
      rating: 5,
    },
    {
      name: "Lisa Park",
      role: "AI Product Manager",
      content: "Game-changer for our team. We've reduced infrastructure costs by 40%.",
      rating: 5,
    },
    {
      name: "David Kumar",
      role: "Research Scientist",
      content: "The most accurate VRAM calculator I've used. Highly recommended!",
      rating: 5,
    },
  ]

  const stats = [
    { value: 50, suffix: "+", label: "Supported Models", icon: Calculator },
    { value: 99.9, suffix: "%", label: "Accuracy Rate", icon: TrendingUp },
    { value: 10000, suffix: "+", label: "Calculations Daily", icon: Zap },
    { value: 24, suffix: "/7", label: "Uptime", icon: Shield },
  ]

  return (
    <div  className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="container mx-auto px-4 py-16 relative min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div
          ref={parallaxRef1}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse"
        ></div>
        <div
          ref={parallaxRef2}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"
        ></div>

        <div className="relative z-10 text-center space-y-8 w-full">
          <div className="space-y-4">
            <div className="inline-flex my-14 items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-3 rounded-full text-sm border border-primary/20 backdrop-blur-sm animate-fade-in">
              <Zap className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text text-transparent font-semibold">
                AI-Powered VRAM Optimization
              </span>
            </div>

            <p  style={{ fontFamily: "'Mera Pro', sans" }} className="text-5xl md:text-6xl font-thin leading-tight">
              <span className="bg-gradient-to-r from-blue-300 via-purple-500 to-primary bg-clip-text text-transparent">
                Optimize Your AI
              </span>
              <br />
              <span className="text-foreground min-h-[1.2em] inline-block">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </span>
            </p>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-1000">
              Calculate precise GPU memory requirements for AI models. Save thousands on hardware costs with intelligent
              optimization recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-1500">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-300 to-purple-500 hover:from-purple-500/90 hover:to-purple-600/90 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg group"
            >
              <Calculator className="h-5 w-5 mr-2 group-hover:animate-spin" />
              Start Optimizing Free
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 opacity-60 animate-fade-in-up delay-2000">
            <div className="text-sm text-muted-foreground">Trusted by 10,000+ AI Engineers</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Why Choose Our Calculator?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of AI engineers who've optimized their workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 animate-slide-in-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CheckCircle
                className="h-5 w-5 text-green-500 flex-shrink-0 animate-bounce"
                style={{ animationDelay: `${index * 200}ms` }}
              />
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-6 text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm animate-fade-in-up ${
                isHovered === feature.title ? "shadow-2xl scale-105" : ""
              }`}
              onMouseEnter={() => setIsHovered(feature.title)}
              onMouseLeave={() => setIsHovered(null)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 shadow-lg hover:animate-pulse`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Infinite Marquee Testimonials */}
      <div className="py-16 bg-gradient-to-r from-muted/30 to-muted/10 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground text-lg">Real feedback from AI engineers and researchers</p>
        </div>

        <div className="relative">
          <div className="flex animate-marquee space-x-6">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-80 p-6 border border-border/50 bg-gradient-to-br from-background to-muted/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => {
            const { count, ref } = useAnimatedCounter(stat.value, 2000)

            return (
              <div
                key={index}
                ref={ref}
                className="space-y-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2 hover:animate-spin">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">
                  {count}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your AI Workflow?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of AI engineers who've saved time and money with our precision calculator
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-300 to-purple-500 hover:from-purple-500/90 hover:to-purple-600/90 text-white px-8 py-6 text-lg group"
            >
              <Calculator className="h-5 w-5 mr-2 group-hover:animate-spin" />
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary/5 px-8 py-6 text-lg group"
            >
              <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              View Documentation
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-muted/50 to-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  AI VRAM Calculator
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The most accurate and comprehensive GPU memory calculator for AI workloads. Trusted by engineers
                worldwide.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="hover:text-primary">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-primary">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-primary">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@aivramcalc.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 AI VRAM Calculator. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}