import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'student' | 'trainer' | 'admin';
type StudentStatus = 'pending' | 'active' | 'inactive';
type DietaryPreference = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'other';
type PersonalGoal = 'weight-loss' | 'muscle-gain' | 'maintenance' | 'general-health' | 'performance';

interface MacroGoals {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface StudentDetails {
  age?: number;
  dietaryPreference?: DietaryPreference;
  personalGoal?: PersonalGoal;
  macroGoals?: MacroGoals;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firstLogin?: boolean;
  trainer?: string; // Trainer ID who manages this student (for student accounts)
  status?: StudentStatus; // For student accounts
  studentDetails?: StudentDetails; // Additional student details
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  addStudent: (name: string, tempPassword: string, trainerId: string, studentDetails: StudentDetails) => Promise<{ username: string, password: string }>;
  resetStudentPassword: (studentId: string) => Promise<string>;
  toggleStudentStatus: (studentId: string, status: StudentStatus) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  completeFirstLoginSetup: (email: string, newPassword: string) => Promise<void>;
  getAllStudents: (trainerId: string) => User[];
  getAllTrainers: () => User[];
  updateStudentDetails: (studentId: string, details: Partial<StudentDetails>) => Promise<void>;
}

// Define a more comprehensive user type for internal use
interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  firstLogin?: boolean;
  trainer?: string;
  status?: StudentStatus;
  studentDetails?: StudentDetails;
}

// Mock user data for demonstration
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    firstLogin: false,
    trainer: '2',
    status: 'active',
    studentDetails: {
      age: 28,
      dietaryPreference: 'standard',
      personalGoal: 'weight-loss',
      macroGoals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65
      }
    }
  },
  {
    id: '2',
    name: 'Jane Trainer',
    email: 'trainer@example.com',
    password: 'password123',
    role: 'trainer',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'temppass',
    role: 'student',
    firstLogin: true,
    trainer: '2',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Sara Williams',
    email: 'sara@example.com',
    password: 'password123',
    role: 'student',
    firstLogin: false,
    trainer: '2',
    status: 'inactive',
    studentDetails: {
      age: 35,
      dietaryPreference: 'vegetarian',
      personalGoal: 'maintenance',
      macroGoals: {
        calories: 1800,
        protein: 120,
        carbs: 180,
        fat: 60
      }
    }
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
];

// Helper function to generate a username based on the student's name
const generateUsername = (name: string) => {
  const nameParts = name.toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const randomNum = Math.floor(Math.random() * 1000);
  
  if (lastName) {
    return `${firstName.charAt(0)}${lastName}${randomNum}`;
  }
  return `${firstName}${randomNum}`;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockUsers, setMockUsers] = useState<MockUser[]>(MOCK_USERS);
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          try {
            // Get user profile from Supabase
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error || !profile) {
              console.error('Error fetching user profile:', error);
              return;
            }
            
            // Create user object from Supabase data
            const userData: User = {
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              // Other fields would be populated as needed
            };
            
            // If user is a student, fetch additional details
            if (profile.role === 'student') {
              const { data: studentData, error: studentError } = await supabase
                .from('student_details')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (studentData && !studentError) {
                userData.status = studentData.status;
                userData.trainer = studentData.trainer_id;
                userData.studentDetails = {
                  age: studentData.age,
                  dietaryPreference: studentData.dietary_preference,
                  personalGoal: studentData.personal_goal,
                  macroGoals: {
                    calories: studentData.calories_goal || 2000,
                    protein: studentData.protein_goal,
                    carbs: studentData.carbs_goal,
                    fat: studentData.fat_goal
                  }
                };
              }
            }
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (error) {
            console.error('Error processing auth state change:', error);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
        
        setLoading(false);
        setSupabaseInitialized(true);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // For development only - use mock data if Supabase isn't working
  useEffect(() => {
    // Wait a bit to check if Supabase auth initialized
    const timer = setTimeout(() => {
      if (!supabaseInitialized && !user) {
        console.warn('Supabase auth not initialized, falling back to mock data');
        // Use stored user or load demo user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Load demo admin user for easier testing
          const adminUser = MOCK_USERS.find(u => u.role === 'admin');
          if (adminUser) {
            const { password: _, ...userWithoutPassword } = adminUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          }
        }
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [supabaseInitialized, user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fall back to mock users for development
        const mockUser = mockUsers.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (!mockUser) {
          throw new Error('Invalid email or password');
        }
        
        const { password: _, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      // If using Supabase, user will be set by the onAuthStateChange listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Try to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        // Fall back to mock users for development
        if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Email already in use');
        }
        
        const newUser: MockUser = {
          id: `${mockUsers.length + 1}`,
          name,
          email,
          role,
          password,
          firstLogin: false,
          status: role === 'student' ? 'active' as StudentStatus : undefined,
          trainer: role === 'student' ? '' : undefined,
        };
        
        setMockUsers(prev => [...prev, newUser]);
        
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      // If using Supabase, user will be set by the onAuthStateChange listener
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (name: string, tempPassword: string, trainerId: string, studentDetails: StudentDetails) => {
    // Implementation would integrate with Supabase
    const username = generateUsername(name);
    
    const newStudent: MockUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email: username,
      password: tempPassword,
      role: 'student',
      firstLogin: true,
      trainer: trainerId,
      status: 'pending',
      studentDetails
    };
    
    setMockUsers(prev => [...prev, newStudent]);
    
    return { username, password: tempPassword };
  };

  const resetStudentPassword = async (studentId: string) => {
    const tempPassword = `temp${Math.floor(Math.random() * 10000)}`;
    
    setMockUsers(prev => 
      prev.map(user => 
        user.id === studentId 
          ? { ...user, password: tempPassword, firstLogin: true } 
          : user
      )
    );
    
    return tempPassword;
  };

  const toggleStudentStatus = async (studentId: string, status: StudentStatus) => {
    setMockUsers(prev => 
      prev.map(user => 
        user.id === studentId 
          ? { ...user, status } 
          : user
      )
    );
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    const currentUser = mockUsers.find(u => u.id === user.id);
    if (!currentUser || currentUser.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    setMockUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, password: newPassword, firstLogin: false } 
          : u
      )
    );
  };

  const updateEmail = async (email: string) => {
    if (!user) throw new Error('No user logged in');
    
    setMockUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, email } 
          : u
      )
    );
    
    const updatedUser = { ...user, email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const completeFirstLoginSetup = async (email: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    setMockUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, email, password: newPassword, firstLogin: false, status: 'active' as StudentStatus } 
          : u
      )
    );
    
    const updatedUser = { ...user, email, firstLogin: false, status: 'active' as StudentStatus };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getAllStudents = (trainerId: string) => {
    return mockUsers
      .filter(user => user.role === 'student' && (trainerId === 'all' || user.trainer === trainerId))
      .map(({ password: _, ...user }) => user);
  };
  
  const getAllTrainers = () => {
    return mockUsers
      .filter(user => user.role === 'trainer')
      .map(({ password: _, ...user }) => user);
  };
  
  const updateStudentDetails = async (studentId: string, details: Partial<StudentDetails>) => {
    setMockUsers(prev => 
      prev.map(user => 
        user.id === studentId 
          ? { 
              ...user, 
              studentDetails: { 
                ...user.studentDetails || {}, 
                ...details 
              } 
            } 
          : user
      )
    );
  };

  const logout = async () => {
    // Try to sign out with Supabase
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user,
      addStudent,
      resetStudentPassword,
      toggleStudentStatus,
      updatePassword,
      updateEmail,
      completeFirstLoginSetup,
      getAllStudents,
      getAllTrainers,
      updateStudentDetails
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
