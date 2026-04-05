'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  MapPin, 
  Phone,
  Briefcase,
  DollarSign,
  Timer,
  CheckCircle,
  XCircle,
  Edit2,
  AlertCircle,
  ChevronRight,
  Building2,
  Calendar,
  Tag,
  CreditCard,
  Store,
  Globe
} from 'lucide-react';

export default function BusinessSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [business, setBusiness] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    location: '',
    services: [],
    availability: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '14:00', enabled: true },
      sunday: { start: '09:00', end: '14:00', enabled: false },
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.business) {
      setBusiness(parsedUser.business);
      setFormData({
        name: parsedUser.business.name || '',
        description: parsedUser.business.description || '',
        phone: parsedUser.business.phone || '',
        location: parsedUser.business.location || '',
        services: parsedUser.business.services?.length > 0 ? parsedUser.business.services : [
          { name: 'Consultation', price: 0, duration: 30 }
        ],
        availability: parsedUser.business.availability || formData.availability,
      });
    }
    setLoading(false);
  }, [router]);

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { name: '', price: 0, duration: 60 }
      ]
    });
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = field === 'price' || field === 'duration' ? Number(value) : value;
    setFormData({ ...formData, services: updatedServices });
  };

  const removeService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const updateAvailability = (day, field, value) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          [field]: value
        }
      }
    });
  };

  const toggleDay = (day) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          enabled: !formData.availability[day].enabled
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/businesses/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          phone: formData.phone,
          location: formData.location,
          services: formData.services,
          availability: formData.availability,
        }),
      });

      if (response.ok) {
        const userData = JSON.parse(localStorage.getItem('user'));
        userData.business = {
          ...userData.business,
          ...formData
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save settings');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Store, color: 'from-blue-500 to-blue-600' },
    { id: 'services', label: 'Services', icon: Tag, color: 'from-green-500 to-green-600' },
    { id: 'hours', label: 'Business Hours', icon: Calendar, color: 'from-purple-500 to-purple-600' },
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your business settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header with Gradient */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">Business Setup</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Configure Your Business
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Set up your services, pricing, and availability to start accepting bookings
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:shadow-md border border-gray-200'
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information Section */}
          {activeSection === 'basic' && (
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Label className="text-gray-700 font-semibold mb-2 block">
                      Business Name *
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Kevin's Premium Barbershop"
                      className="h-12 text-lg"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label className="text-gray-700 font-semibold mb-2 block">
                      Description
                    </Label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell customers about your business, your expertise, and what makes you special..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 711 317 540"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Nairobi CBD, along Moi Avenue"
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                      <Tag className="h-5 w-5 text-white" />
                    </div>
                    <span>Services & Pricing</span>
                  </CardTitle>
                  <Button 
                    type="button" 
                    onClick={addService} 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {formData.services.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛠️</div>
                    <p className="text-gray-500 mb-4">No services added yet</p>
                    <Button type="button" onClick={addService} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.services.map((service, index) => (
                      <div key={index} className="group bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-green-200 transition-all">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Label className="text-sm text-gray-600">Service Name</Label>
                            <Input
                              value={service.name}
                              onChange={(e) => updateService(index, 'name', e.target.value)}
                              placeholder="e.g., Haircut"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm text-gray-600 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Price (KES)
                            </Label>
                            <Input
                              type="number"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', e.target.value)}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm text-gray-600 flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              Duration (mins)
                            </Label>
                            <Input
                              type="number"
                              value={service.duration}
                              onChange={(e) => updateService(index, 'duration', e.target.value)}
                              placeholder="60"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Availability Section */}
          {activeSection === 'hours' && (
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="w-28">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.availability[day.key].enabled}
                            onChange={() => toggleDay(day.key)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className={`font-semibold ${!formData.availability[day.key].enabled ? 'text-gray-400' : 'text-gray-700'}`}>
                            {day.label}
                          </span>
                        </div>
                      </div>
                      {formData.availability[day.key].enabled && (
                        <>
                          <div className="flex-1">
                            <select
                              value={formData.availability[day.key].start}
                              onChange={(e) => updateAvailability(day.key, 'start', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                              {generateTimeOptions()}
                            </select>
                          </div>
                          <span className="text-gray-500 font-medium">to</span>
                          <div className="flex-1">
                            <select
                              value={formData.availability[day.key].end}
                              onChange={(e) => updateAvailability(day.key, 'end', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                              {generateTimeOptions()}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 min-w-[140px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function to generate time options
function generateTimeOptions() {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(<option key={time} value={time}>{time}</option>);
    }
  }
  return times;
}