
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="container max-w-6xl py-12 md:py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            A Better Way to Track Your <span className="text-primary">Nutrition</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
            Personalized diet tracking and management platform where students track their nutrition
            and trainers provide real-time guidance for better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">For Students</h3>
            <p className="text-muted-foreground mb-4">
              Log your meals, track macros, and receive personalized recommendations based on your fitness goals.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Track calorie intake and nutrition</li>
              <li>• Monitor progress over time</li>
              <li>• Access personalized recommendations</li>
              <li>• Receive expert feedback</li>
            </ul>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">For Trainers</h3>
            <p className="text-muted-foreground mb-4">
              Monitor your students' dietary logs, provide feedback, and set custom dietary goals.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• View detailed client nutrition data</li>
              <li>• Provide timely feedback</li>
              <li>• Set custom dietary goals</li>
              <li>• Generate comprehensive reports</li>
            </ul>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Platform Features</h3>
            <p className="text-muted-foreground mb-4">
              Our platform offers powerful tools for both students and trainers.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Intuitive dashboard interface</li>
              <li>• Data visualization tools</li>
              <li>• Secure user accounts</li>
              <li>• Cross-device compatibility</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your nutrition?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of users who are achieving their fitness goals with NutriTrack.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Join NutriTrack Today</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
