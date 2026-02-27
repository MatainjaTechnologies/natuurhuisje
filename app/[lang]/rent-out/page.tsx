"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getRentOutDictionary } from '@/i18n/get-rent-out-dictionary';
import { Wifi, Car, Utensils, Home, Waves, Wind, Tv, Briefcase, Calendar, Users, ChevronDown } from 'lucide-react';

export default function RentOutPage() {
  const params = useParams();
  const lang = params.lang as Locale;
  const [t, setT] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    country: '',
    city: '',
    address: '',
    postcode: '',
    guests: '2',
    bedrooms: '',
    bathrooms: '',
    description: '',
    amenities: [] as string[],
    pricePerNight: '',
    cleaningFee: '',
    minimumStay: '1',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
  });

  const [showIncludedCosts, setShowIncludedCosts] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await getRentOutDictionary(lang);
      setT(translations);
    };
    loadTranslations();
  }, [lang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (!t) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.success.title}</h1>
            <p className="text-gray-600 mb-8">{t.success.message}</p>
            <a
              href={`/${lang}`}
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              {t.success.backHome}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    fireplace: '🔥',
    bbq: '🍖',
    heating: '🔥',
    airConditioning: Wind,
    hotTub: Waves,
    pool: Waves,
    petFriendly: '🐾',
    workspace: Briefcase,
    tv: Tv,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-7xl pt-24 pb-12">
        {/* Progress Indicator - Mobile Only */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-1">
            <span className="text-purple-900 font-medium text-sm">
              {t.steps.step1}
            </span>
            <span className="text-gray-400 text-sm mx-1">›</span>
            <span className="text-gray-400 text-sm font-normal">
              {t.steps.step2}
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">{t.title}</h1>
        </div>

        {/* Property Card - Mobile Only (before form) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Property Image */}
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop"
                alt="Romantic wellness lodge"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Info */}
            <div className="p-4">
              <h3 className="text-base font-bold text-purple-900 mb-1">
                Romantic wellness lodge in Brabant
              </h3>
              <p className="text-sm text-gray-600 mb-2">Uden • Noord-Brabant</p>
              
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded mb-3">
                <span className="text-yellow-600">⭐</span>
                <span className="text-xs font-semibold text-gray-900">Exceptional</span>
                <span className="text-xs font-semibold bg-yellow-400 text-gray-900 px-1.5 rounded">9.8</span>
              </div>

              {/* Dates and Guests */}
              <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">12-03-2026 — 13-03-2026</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">2 guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Booking Style */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="text-sm font-medium text-gray-900 border-none outline-none"
                        placeholder="12-03-2026"
                      />
                      <span className="mx-2 text-gray-400">→</span>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="text-sm font-medium text-gray-900 border-none outline-none"
                        placeholder="13-03-2026"
                      />
                    </div>
                  </div>
                  <button type="button" className="text-sm text-blue-600 hover:underline font-medium">
                    Change
                  </button>
                </div>
              </div>

              {/* Guests Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{formData.guests} guests</span>
                  </div>
                  <button type="button" className="text-sm text-blue-600 hover:underline font-medium">
                    Change
                  </button>
                </div>
              </div>

              {/* Included Costs Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-purple-900 mb-1">Included costs</h3>
                  <p className="text-sm text-gray-600">These costs are included in the price</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">Bedding</span>
                    <span className="text-sm text-gray-600">Included</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">Final cleaning</span>
                    <span className="text-sm text-gray-600">Included</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-900">Towels</span>
                    <span className="text-sm text-gray-600">Included</span>
                  </div>
                  
                  {showIncludedCosts && (
                    <>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-900">Kitchen towels</span>
                        <span className="text-sm text-gray-600">Included</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-900">WiFi</span>
                        <span className="text-sm text-gray-600">Included</span>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowIncludedCosts(!showIncludedCosts)}
                  className="mt-4 text-sm text-purple-900 hover:underline font-medium w-full text-center"
                >
                  {showIncludedCosts ? 'Show less' : 'Show more'}
                </button>
              </div>

              {/* Your Details Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-1">Your details</h3>
                  <p className="text-sm text-gray-600">Enter your details</p>
                </div>

                <div className="space-y-4">
                  {/* First Name & Surname */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Fill in your first name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Surname</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Fill in your surname"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">E-mail address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Telephone number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Fill in your telephone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      <option value="">Select country</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      placeholder="E.g. SW1A 1AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* Address Lines */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Address line 1</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address line 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Address line 2</label>
                      <input
                        type="text"
                        name="address2"
                        placeholder="Address line 2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="px-2">
                <p className="text-sm text-gray-600">
                  By confirming your booking, you agree to Vipio's{' '}
                  <a href="#" className="text-blue-600 hover:underline">general terms and conditions</a>.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-400 hover:bg-teal-500 text-white py-3 px-6 rounded-lg font-semibold text-base transition-colors"
              >
                Confirm and pay
              </button>
            </form>
          </div>

          {/* Right Column - Property Card */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Property Image */}
                <div className="relative h-64">
                  <img
                    src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop"
                    alt="Romantic wellness lodge"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-1">
                    Romantic wellness lodge in Brabant
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Uden • Noord-Brabant</p>
                  
                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded mb-4">
                    <span className="text-yellow-600">⭐</span>
                    <span className="text-xs font-semibold text-gray-900">Exceptional</span>
                    <span className="text-xs font-semibold bg-yellow-400 text-gray-900 px-1.5 rounded">9.8</span>
                  </div>

                  {/* Dates and Guests */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-900">12-03-2026 — 13-03-2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-900">2 guests</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">1 night x €241.11</span>
                      <span className="text-gray-900 font-medium">€241.11</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Bedding</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Final cleaning</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Towels</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Kitchen towels</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Made beds</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">Parking</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">WiFi</span>
                      <span className="text-blue-600">Included</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">1 x Tourist tax for 2 guests</span>
                      <span className="text-gray-900 font-medium">€2.70</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">€343.81</span>
                  </div>

                  {/* Cancellation Info */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <svg className="h-4 w-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-600 font-medium">Flexible cancellation</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Landlord is verified - Vipio Guarantee</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>19,679 reviews on Vipio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Vipio does not charge any booking fees</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%23EB001B'/%3E%3Ccircle cx='15' cy='12.5' r='7' fill='%23FF5F00'/%3E%3Ccircle cx='25' cy='12.5' r='7' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" className="h-6" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%231A1F71'/%3E%3Ccircle cx='13' cy='12.5' r='6' fill='%23fff'/%3E%3Ccircle cx='27' cy='12.5' r='6' fill='%23fff' opacity='0.8'/%3E%3C/svg%3E" alt="Maestro" className="h-6" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%231434CB'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-family='Arial' font-size='10' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" className="h-6" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-family='Arial' font-size='8'%3EPay%3C/text%3E%3C/svg%3E" alt="Apple Pay" className="h-6" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%23fff' stroke='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='8'%3EGPay%3C/text%3E%3C/svg%3E" alt="Google Pay" className="h-6" />
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect width='40' height='25' rx='3' fill='%23fff' stroke='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23000' font-family='Arial' font-size='7'%3EiDEAL%3C/text%3E%3C/svg%3E" alt="iDEAL" className="h-6" />
                  </div>

                  {/* Ask Question Button */}
                  <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    Ask a question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
