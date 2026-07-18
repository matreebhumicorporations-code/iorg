import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Service, Booking, Notification, UserRole, Review, PaymentMethod } from '../types';
import { INITIAL_SERVICES, INITIAL_USERS } from '../data';

interface AppContextType {
  currentUser: User | null;
  services: Service[];
  bookings: Booking[];
  notifications: Notification[];
  login: (emailOrMobile: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, emailOrMobile: string, role: UserRole, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (profile: { name: string; mobile: string; email: string; address: string; password?: string; avatar?: string }) => void;
  updateCompanyProfile: (profile: { companyName: string; description: string; experience: number; address: string }) => void;
  toggleSaveService: (serviceId: string) => void;
  createBooking: (service: Service, date: string, guestCount?: number) => Booking;
  payBooking: (bookingId: string, method: PaymentMethod) => void;
  acceptBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  addReview: (serviceId: string, rating: number, comment: string) => void;
  addService: (serviceData: Omit<Service, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'rating' | 'reviews'>) => void;
  editService: (serviceId: string, serviceData: Partial<Service>) => void;
  deleteService: (serviceId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('em_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('em_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('em_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('em_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('em_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('em_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('em_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('em_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Utility to send notifications
  const sendNotification = (userId: string, title: string, message: string, type: 'info' | 'booking' | 'payment') => {
    const newNotif: Notification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      date: new Date().toISOString(),
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Login handler
  const login = (emailOrMobile: string, password?: string) => {
    const trimmed = emailOrMobile.trim().toLowerCase();
    
    // Check initial users & local users list
    const foundUser = INITIAL_USERS.find(
      (u) => u.emailOrMobile.toLowerCase() === trimmed || u.email?.toLowerCase() === trimmed || u.mobile === emailOrMobile
    );

    if (foundUser) {
      // In a real database we check hashed password. For our high-fidelity app:
      setCurrentUser(foundUser);
      sendNotification(foundUser.id, 'Welcome Back!', `Glad to see you again, ${foundUser.name}. Explore event services today.`, 'info');
      return { success: true };
    }

    // Try finding in dynamically registered users
    const registeredUsersSaved = localStorage.getItem('em_registered_users');
    const registeredUsers: User[] = registeredUsersSaved ? JSON.parse(registeredUsersSaved) : [];
    const foundRegUser = registeredUsers.find(
      (u) => u.emailOrMobile.toLowerCase() === trimmed || u.email?.toLowerCase() === trimmed || u.mobile === emailOrMobile
    );

    if (foundRegUser) {
      setCurrentUser(foundRegUser);
      sendNotification(foundRegUser.id, 'Welcome Back!', `Glad to see you again, ${foundRegUser.name}.`, 'info');
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Use customer@gmail.com or organiser@gmail.com for preloaded accounts.' };
  };

  // Register handler
  const register = (name: string, emailOrMobile: string, role: UserRole, password?: string) => {
    const trimmed = emailOrMobile.trim();
    if (!name.trim() || !trimmed) {
      return { success: false, error: 'Please enter name and email/mobile' };
    }

    const registeredUsersSaved = localStorage.getItem('em_registered_users');
    const registeredUsers: User[] = registeredUsersSaved ? JSON.parse(registeredUsersSaved) : [];

    const isDuplicate = 
      INITIAL_USERS.some(u => u.emailOrMobile.toLowerCase() === trimmed.toLowerCase()) ||
      registeredUsers.some(u => u.emailOrMobile.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
      return { success: false, error: 'This email or mobile number is already registered.' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      emailOrMobile: trimmed,
      role,
      savedServices: [],
      email: trimmed.includes('@') ? trimmed : '',
      mobile: !trimmed.includes('@') ? trimmed : '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      ...(role === 'organiser' && {
        companyProfile: {
          companyName: name.trim() + ' Organisers',
          description: 'A newly registered event planning company. Dedicated to premium service execution.',
          experience: 1,
          address: 'Main Street Metro, India',
          logo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          gallery: [],
          reviews: [],
          rating: 5.0
        }
      })
    };

    // Save to dynamic registered users
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem('em_registered_users', JSON.stringify(updatedUsers));

    setCurrentUser(newUser);
    sendNotification(newUser.id, 'Registration Successful', `Welcome to Event Management Portal, ${newUser.name}!`, 'info');
    
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Update profile
  const updateProfile = (profile: { name: string; mobile: string; email: string; address: string; password?: string; avatar?: string }) => {
    if (!currentUser) return;
    
    const updated: User = {
      ...currentUser,
      name: profile.name,
      mobile: profile.mobile,
      email: profile.email,
      address: profile.address,
      avatar: profile.avatar || currentUser.avatar,
    };

    setCurrentUser(updated);
    sendNotification(currentUser.id, 'Profile Updated', 'Your profile settings have been successfully updated.', 'info');
  };

  // Update company profile for organiser
  const updateCompanyProfile = (profile: { companyName: string; description: string; experience: number; address: string }) => {
    if (!currentUser || currentUser.role !== 'organiser') return;

    const currentProfile = currentUser.companyProfile || {
      companyName: currentUser.name,
      description: '',
      experience: 1,
      address: '',
      logo: currentUser.avatar || '',
      gallery: [],
      reviews: [],
      rating: 5.0
    };

    const updatedProfile = {
      ...currentProfile,
      companyName: profile.companyName,
      description: profile.description,
      experience: Number(profile.experience),
      address: profile.address,
    };

    const updated: User = {
      ...currentUser,
      name: profile.companyName, // keep in sync
      companyProfile: updatedProfile
    };

    setCurrentUser(updated);

    // Also update provider details in existing services owned by this user
    setServices((prev) =>
      prev.map((s) =>
        s.providerId === currentUser.id
          ? { ...s, providerName: profile.companyName }
          : s
      )
    );

    sendNotification(currentUser.id, 'Company Profile Updated', 'Your company portfolio and info have been successfully updated.', 'info');
  };

  // Bookmark a service
  const toggleSaveService = (serviceId: string) => {
    if (!currentUser) return;
    
    const index = currentUser.savedServices.indexOf(serviceId);
    let updatedSaved = [...currentUser.savedServices];

    if (index > -1) {
      updatedSaved.splice(index, 1);
    } else {
      updatedSaved.push(serviceId);
    }

    setCurrentUser({
      ...currentUser,
      savedServices: updatedSaved,
    });
  };

  // Create booking
  const createBooking = (service: Service, date: string, guestCount?: number) => {
    if (!currentUser) throw new Error('Must be logged in to book');

    const totalCost = service.category === 'caterer' && guestCount 
      ? service.price * guestCount
      : service.price;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      serviceCategory: service.category,
      coverImage: service.coverImage,
      providerId: service.providerId,
      providerName: service.providerName,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email || currentUser.emailOrMobile,
      customerMobile: currentUser.mobile || currentUser.emailOrMobile,
      date,
      price: totalCost,
      status: 'pending',
      paymentStatus: 'unpaid',
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send notification to customer
    sendNotification(
      currentUser.id,
      'Booking Request Initiated',
      `Your request for "${service.title}" on ${date} is registered. Please proceed to payment or wait for acceptance.`,
      'booking'
    );

    // Send notification to organiser
    sendNotification(
      service.providerId,
      'New Booking Request',
      `${currentUser.name} requested "${service.title}" for ${date}.`,
      'booking'
    );

    return newBooking;
  };

  // Pay booking
  const payBooking = (bookingId: string, method: PaymentMethod) => {
    const txId = `tx-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const invoiceNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = {
            ...b,
            paymentStatus: 'paid' as const,
            paymentMethod: method,
            paymentDetails: {
              txId,
              date: new Date().toISOString().split('T')[0],
              invoiceNo,
            },
          };

          // Notify customer
          sendNotification(
            b.customerId,
            'Payment Successful',
            `Payment of ₹${b.price.toLocaleString()} for "${b.serviceTitle}" is processed successfully. Invoice: ${invoiceNo}`,
            'payment'
          );

          // Notify provider
          sendNotification(
            b.providerId,
            'Payment Received',
            `Received ₹${b.price.toLocaleString()} from ${b.customerName} for "${b.serviceTitle}".`,
            'payment'
          );

          return updated;
        }
        return b;
      })
    );
  };

  // Accept Booking
  const acceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Notify customer
          sendNotification(
            b.customerId,
            'Booking Confirmed',
            `Your booking for "${b.serviceTitle}" on ${b.date} has been ACCEPTED by ${b.providerName}.`,
            'booking'
          );

          return { ...b, status: 'accepted' as const };
        }
        return b;
      })
    );
  };

  // Reject Booking
  const rejectBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Notify customer
          sendNotification(
            b.customerId,
            'Booking Declined',
            `Unfortunately, ${b.providerName} declined your booking for "${b.serviceTitle}" on ${b.date}. Refund will be processed if already paid.`,
            'booking'
          );

          return {
            ...b,
            status: 'rejected' as const,
            paymentStatus: b.paymentStatus === 'paid' ? 'refunded' as const : b.paymentStatus,
          };
        }
        return b;
      })
    );
  };

  // Complete Booking
  const completeBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Notify customer
          sendNotification(
            b.customerId,
            'Service Order Completed',
            `Your event with "${b.serviceTitle}" on ${b.date} is marked as completed! Please write a review for them.`,
            'booking'
          );

          return { ...b, status: 'completed' as const };
        }
        return b;
      })
    );
  };

  // Add review
  const addReview = (serviceId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    setServices((prevServices) =>
      prevServices.map((s) => {
        if (s.id === serviceId) {
          const updatedReviews = [newReview, ...s.reviews];
          const avgRating = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );

          // Send notification to service owner
          sendNotification(
            s.providerId,
            'New Service Review Received',
            `${currentUser.name} gave you a ${rating}★ review on "${s.title}".`,
            'info'
          );

          return {
            ...s,
            reviews: updatedReviews,
            rating: avgRating,
          };
        }
        return s;
      })
    );

    // Set matching bookings to reflect reviewLeft
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        b.serviceId === serviceId && b.customerId === currentUser.id
          ? { ...b, reviewLeft: true }
          : b
      )
    );
  };

  // Add Service (Organizer)
  const addService = (serviceData: Omit<Service, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'rating' | 'reviews'>) => {
    if (!currentUser || currentUser.role !== 'organiser') return;

    const newService: Service = {
      ...serviceData,
      id: `s-${Date.now()}`,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      rating: 5.0,
      reviews: [],
    };

    setServices((prev) => [newService, ...prev]);
    sendNotification(currentUser.id, 'New Service Created', `"${newService.title}" is now live and browsable by customers!`, 'info');
  };

  // Edit Service
  const editService = (serviceId: string, serviceData: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...serviceData } : s))
    );
    if (currentUser) {
      sendNotification(currentUser.id, 'Service Updated', 'Your service portfolio changes have been saved.', 'info');
    }
  };

  // Delete Service
  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    if (currentUser) {
      sendNotification(currentUser.id, 'Service Deleted', 'The service was removed from the active marketplace directory.', 'info');
    }
  };

  // Mark notification as read
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        services,
        bookings,
        notifications,
        login,
        register,
        logout,
        updateProfile,
        updateCompanyProfile,
        toggleSaveService,
        createBooking,
        payBooking,
        acceptBooking,
        rejectBooking,
        completeBooking,
        addReview,
        addService,
        editService,
        deleteService,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
