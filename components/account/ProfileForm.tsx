'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  profile: any;
  session: any;
  fullName: string;
}

export default function ProfileForm({ profile, session, fullName }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Form state - initialize with profile data or metadata fallback
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || session.user.user_metadata?.first_name || '',
    last_name: profile?.last_name || session.user.user_metadata?.last_name || '',
    email: session.user.email || '',
    alternative_email: profile?.alternative_email || '',
    website: profile?.website || '',
    phone_country_code: profile?.phone_country_code || '+31',
    phone_number: profile?.phone_number || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    address_line_1: profile?.address_line_1 || '',
    address_line_2: profile?.address_line_2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    postal_code: profile?.postal_code || '',
    country: profile?.country || 'NL',
    nationality: profile?.nationality || '',
    preferred_language: profile?.preferred_language || 'English',
    company_name: profile?.company_name || '',
    tax_id: profile?.tax_id || '',
    email_notifications: profile?.email_notifications ?? true,
    sms_notifications: profile?.sms_notifications ?? false,
    marketing_emails: profile?.marketing_emails ?? false,
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;

    setIsUploadingAvatar(true);
    try {
      console.log('Starting avatar upload for file:', avatarFile.name);
      
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true,
          contentType: avatarFile.type
        });

      console.log('Upload result:', { error: uploadError, data });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Test if the URL is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        console.log('URL accessibility test:', response.status);
      } catch (error) {
        console.log('URL not yet accessible (normal for new uploads):', error);
      }

      return publicUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload avatar' });
      return null;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Upload avatar if a new one is selected
      let avatarUrl = profile?.avatar_url || '';
      console.log('Initial avatar URL:', avatarUrl);
      
      if (avatarFile) {
        console.log('Avatar file selected, uploading...');
        const uploadedUrl = await uploadAvatar();
        console.log('Upload result:', uploadedUrl);
        
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          console.log('Updated avatar URL:', avatarUrl);
        } else {
          // Avatar upload failed, but continue with profile update
          console.log('Avatar upload failed, continuing with profile update');
        }
      }

      console.log('Final avatar URL to save:', avatarUrl);

      // Update users table
      const updateData = {
        auth_user_id: session.user.id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        alternative_email: formData.alternative_email,
        website: formData.website,
        phone_country_code: formData.phone_country_code,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country || 'NL', // Required field with default
        nationality: formData.nationality,
        preferred_language: formData.preferred_language || 'English', // Required field with default
        company_name: formData.company_name,
        tax_id: formData.tax_id,
        email_notifications: formData.email_notifications,
        sms_notifications: formData.sms_notifications,
        marketing_emails: formData.marketing_emails,
        avatar_url: avatarUrl,
        currency_preference: 'EUR', // Required field with default
        timezone: 'UTC', // Required field with default
        updated_at: new Date().toISOString(),
      };

      console.log('Profile update data:', updateData);

      const { error: profileError } = await supabase
        .from('users')
        .upsert(updateData as any, {
          onConflict: 'auth_user_id'
        });

      console.log('Profile update result:', { error: profileError });

      if (profileError) {
        throw profileError;
      }

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        }
      });

      if (metadataError) {
        throw metadataError;
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error('Profile update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Form data being submitted:', JSON.stringify(formData, null, 2));
      setMessage({ type: 'error', text: error?.message || 'Failed to update profile. Please check the console for details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>
        
        <div className="flex items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white text-2xl font-medium">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Upload Badge */}
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Upload Info */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Update your photo</h3>
            <p className="text-sm text-gray-600 mb-3">
              JPG, GIF or PNG. Max size of 5MB. Recommended: 400x400px
            </p>
            
            {avatarFile && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{avatarFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(profile?.avatar_url || '');
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Email</label>
            <input
              type="email"
              name="alternative_email"
              value={formData.alternative_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="backup@example.com"
            />
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your nationality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Languages</label>
            <div className="space-y-2">
              {['English', 'Dutch', 'German', 'French'].map((language) => (
                <div key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferred_language"
                    value={language}
                    checked={formData.preferred_language.includes(language)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const currentLanguages = formData.preferred_language.split(',').filter((l: string) => l.trim());
                      
                      if (isChecked) {
                        // Add language
                        currentLanguages.push(language);
                      } else {
                        // Remove language, but ensure at least one remains
                        const filteredLanguages = currentLanguages.filter((l: string) => l !== language);
                        if (filteredLanguages.length === 0) {
                          // Don't allow removing the last language
                          return;
                        }
                        currentLanguages.length = 0;
                        currentLanguages.push(...filteredLanguages);
                      }
                      
                      setFormData(prev => ({
                        ...prev,
                        preferred_language: currentLanguages.join(', ')
                      }));
                    }}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
            <select
              name="phone_country_code"
              value={formData.phone_country_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="+31">+31 (Netherlands)</option>
              <option value="+1">+1 (USA/Canada)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+49">+49 (Germany)</option>
              <option value="+33">+33 (France)</option>
              <option value="+91">+91 (India)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="1234567890"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Amsterdam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="State or province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="1000 AA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Netherlands"
            />
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
            <input
              type="text"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your tax identification number"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="email_notifications"
              checked={formData.email_notifications}
              onChange={(e) => setFormData(prev => ({ ...prev, email_notifications: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              Email notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="sms_notifications"
              checked={formData.sms_notifications}
              onChange={(e) => setFormData(prev => ({ ...prev, sms_notifications: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              SMS notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="marketing_emails"
              checked={formData.marketing_emails}
              onChange={(e) => setFormData(prev => ({ ...prev, marketing_emails: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              Marketing emails
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
