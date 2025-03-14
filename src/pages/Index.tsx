
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Activity, Utensils, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const Index = () => {
  const features = [
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: 'Easy Meal Tracking',
      description: 'Log your daily food intake with our intuitive meal tracking interface.'
    },
    {
      icon: <Activity className="h-10 w-10 text-primary" />,
      title: 'Detailed Nutrient Analysis',
      description: 'Get insights into your macro and micronutrient intake with detailed analytics.'
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Trainer Guidance',
      description: 'Connect with trainers who can monitor your progress and provide personalized advice.'
    }
  ];

  const testimonials = [
    {
      quote: "NutriTrack has transformed how I monitor my nutrition. The insights have helped me reach my fitness goals much faster.",
      author: "Alex Johnson",
      role: "Student"
    },
    {
      quote: "As a trainer, this platform has made it so much easier to track my students' nutritional habits and provide targeted advice.",
      author: "Sarah Williams",
      role: "Fitness Trainer"
    },
    {
      quote: "The interface is so intuitive. I've tried many diet apps before, but this one actually makes me want to log my meals.",
      author: "Mike Chen",
      role: "Student"
    }
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-[-1]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="heading-xl text-balance"
            >
              Intelligent <span className="text-primary">Diet Tracking</span> for Students & Trainers
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-xl text-muted-foreground text-balance"
            >
              Track nutrition, monitor progress, and achieve fitness goals with personalized insights and trainer guidance.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="text-base font-medium">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base font-medium">
                <Link to="/login">
                  Log In
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-balance">Powerful Features for Nutrition Management</h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              Everything you need to track, analyze, and improve your dietary habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 p-5 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-balance">How NutriTrack Works</h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              A simple yet powerful approach to nutrition management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an Account', description: 'Sign up as a student or trainer to get started with your nutrition journey.' },
              { step: '02', title: 'Log Your Meals', description: 'Track your daily food intake and get instant nutritional information.' },
              { step: '03', title: 'Get Insights', description: 'Receive personalized recommendations and analysis from your trainer.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-8 border border-border relative"
              >
                <div className="text-7xl font-bold text-primary/10 absolute -top-4 right-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-balance">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              Discover how NutriTrack has helped students and trainers achieve their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-8 border border-border"
              >
                <div className="text-2xl font-serif text-foreground mb-6">
                  "{testimonial.quote}"
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.author.split(' ')[0][0]}{testimonial.author.split(' ')[1][0]}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
            <div className="px-8 py-16 sm:p-16 md:p-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to transform your nutrition?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Join thousands of students and trainers who are already improving their diet and fitness with NutriTrack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-primary text-base font-medium">
                  <Link to="/signup">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
