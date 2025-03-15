import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!mockUser) {
      setLoading(false);
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setLoading(false);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setLoading(false);
      throw new Error('Email already in use');
    }
    
    // Create new user (in a real app this would be stored in a database)
    const newUser: MockUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role,
      password,
      firstLogin: false,
      status: role === 'student' ? 'active' as StudentStatus : undefined,
      trainer: role === 'student' ? '' : undefined, // Empty trainer for now
    };
    
    setMockUsers(prev => [...prev, newUser]);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setLoading(false);
  };

  const addStudent = async (name: string, tempPassword: string, trainerId: string, studentDetails: StudentDetails) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const username = generateUsername(name);
    
    // Create new student account
    const newStudent: MockUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email: username, // Using username as temporary email
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
    // Generate a temporary password
    const tempPassword = `temp${Math.floor(Math.random() * 10000)}`;
    
    // Update the student's password
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
    
    // Verify current password
    const currentUser = mockUsers.find(u => u.id === user.id);
    if (!currentUser || currentUser.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
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
    
    // Update email
    setMockUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, email } 
          : u
      )
    );
    
    // Update local user state
    const updatedUser = { ...user, email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const completeFirstLoginSetup = async (email: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    // Update user with new email and password, mark firstLogin as false
    setMockUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, email, password: newPassword, firstLogin: false, status: 'active' as StudentStatus } 
          : u
      )
    );
    
    // Update local user state
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

  const logout = () => {
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
