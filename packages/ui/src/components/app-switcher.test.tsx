/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSwitcher, AppLink, getAppUrl } from '../components/app-switcher';

describe('AppSwitcher', () => {
  it('should render switcher button', () => {
    render(<AppSwitcher />);
    
    const button = screen.getByText(/switch app/i);
    expect(button).toBeInTheDocument();
  });
});

describe('AppLink', () => {
  it('should render link with correct href', () => {
    render(
      <AppLink app="boarder" path="/dashboard">
        Go to Boarder Dashboard
      </AppLink>
    );
    
    const link = screen.getByText('Go to Boarder Dashboard');
    expect(link).toHaveAttribute('href', 'http://localhost:3004/dashboard');
  });

  it('should use default path when not provided', () => {
    render(
      <AppLink app="admin">
        Admin
      </AppLink>
    );
    
    const link = screen.getByText('Admin');
    expect(link).toHaveAttribute('href', 'http://localhost:3002/dashboard');
  });
});

describe('getAppUrl', () => {
  it('should return correct URL for public app', () => {
    expect(getAppUrl('public')).toBe('http://localhost:3000');
  });

  it('should return correct URL with path', () => {
    expect(getAppUrl('boarder', '/bookings')).toBe('http://localhost:3004/bookings');
  });

  it('should return correct URL for all apps', () => {
    expect(getAppUrl('api')).toBe('http://localhost:3001');
    expect(getAppUrl('admin')).toBe('http://localhost:3002');
    expect(getAppUrl('auth')).toBe('http://localhost:3003');
    expect(getAppUrl('boarder')).toBe('http://localhost:3004');
    expect(getAppUrl('landlord')).toBe('http://localhost:3005');
  });
});
