"use client";

import React, { useState, useRef, useCallback } from 'react';
import { 
  LayoutList, 
  MapPin, 
  Camera, 
  Euro, 
  CalendarCheck, 
  Calendar, 
  BedDouble, 
  AlignLeft, 
  Bike, 
  Leaf, 
  ClipboardList,
  ChevronRight,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Step definitions
const STEPS = [
  { id: 'general', label: 'General', icon: LayoutList },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'pricing', label: 'Pricing', icon: Euro },
  { id: 'availability', label: 'Availability', icon: CalendarCheck },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'bedrooms', label: 'Bedrooms', icon: BedDouble },
  { id: 'description', label: 'Description', icon: AlignLeft },
  { id: 'stay_details', label: 'Stay details', icon: Bike },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'house_rules', label: 'House rules', icon: ClipboardList },
];

export function NewListingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('general');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    // General
    accommodationName: '',
    type: 'Cottage',
    maxPerson: 1,
    livingSituation: 'Detached',
    location: '',
    plotSize: '',
    isNearNeighbors: null as boolean | null,
    registrationNumberOption: 'I don\'t have a registration number',
    registrationNumber: '',
    hasPublicTransport: false,

    // Location
    country: 'Netherlands',
    region: 'Drenthe',
    street: '',
    number: '',
    postalCode: '',
    place: '',
    landRegistrationOption: '',

    // Photos
    images: [] as string[],

    // Pricing
    pricePerNight: '',
    includedFacilities: ['Final cleaning', 'Bed linen', 'Bath towels', 'Kitchen linen', 'Water', 'Electricity'] as string[],
    safetyDeposit: 'no_deposit',
    safetyDepositAmount: '',
    longerStayPricing: {
      weeklyPrice: '',
      monthlyPrice: '',
      weekendPrice: '',
      longWeekendPrice: '',
      weekdayPrice: '',
      weekPrice: ''
    },
    personPricing: {
      basePersons: 0,
      additionalPersonPrice: ''
    },
    extraCosts: [] as string[],
    
    // Availability
    minNights: 1,
    
    // Description
    description: '',
    surroundings: '',
    
    // Stay Details
    amenities: [] as string[],
    
    // Sustainability
    energyLabel: '',
    sustainability: {} as Record<string, string>,
    
    // House Rules
    houseRules: {
      babies: 0,
      pets: 0,
      childAge: 0,
      bookingAge: 18,
      parties: null,
      smoking: null,
      fireworks: null,
      groups: null,
      waste: null,
      silenceStart: '',
      silenceEnd: '',
      customRules: [] as string[]
    }
  });

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'general':
        return <GeneralStep data={formData} updateData={setFormData} onNext={() => handleNext('general')} />;
      case 'location':
        return <LocationStep data={formData} updateData={setFormData} onNext={() => handleNext('location')} />;
      case 'photos':
        return <PhotosStep data={formData} updateData={setFormData} onNext={() => handleNext('photos')} />;
      case 'pricing':
        return <PricingStep data={formData} updateData={setFormData} onNext={() => handleNext('pricing')} />;
      case 'availability':
        return <AvailabilityStep data={formData} updateData={setFormData} onNext={() => handleNext('availability')} />;
      case 'calendar':
        return <CalendarStep data={formData} updateData={setFormData} onNext={() => handleNext('calendar')} />;
      case 'bedrooms':
        return <BedroomsStep data={formData} updateData={setFormData} onNext={() => handleNext('bedrooms')} />;
      case 'description':
        return <DescriptionStep data={formData} updateData={setFormData} onNext={() => handleNext('description')} />;
      case 'stay_details':
        return <StayDetailsStep data={formData} updateData={setFormData} onNext={() => handleNext('stay_details')} />;
      case 'sustainability':
        return <SustainabilityStep data={formData} updateData={setFormData} onNext={() => handleNext('sustainability')} />;
      case 'house_rules':
        return <HouseRulesStep data={formData} updateData={setFormData} onNext={() => handleNext('house_rules')} />;
      default:
        return <div>Step content for {currentStep} coming soon...</div>;
    }
  };

  const handleNext = (currentStepId: string) => {
    markStepComplete(currentStepId);
    const currentIndex = STEPS.findIndex(s => s.id === currentStepId);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4E3]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F8F4E3] border-r border-[#E5E5E5] sticky h-full overflow-y-auto hidden md:block">
        <div className="p-6">
          <div className="w-8 h-1 bg-[#244224] mb-8 rounded-full"></div>
          <nav className="space-y-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive ? 'text-[#244224] bg-white shadow-sm' : 'text-gray-500 hover:text-[#244224] hover:bg-white/50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#244224]' : 'text-gray-400'} />
                    <span>{step.label}</span>
                  </div>
                  {isCompleted && !isActive && (
                    <CheckCircle size={14} className="text-green-600" />
                  )}
                  {!isCompleted && !isActive && (
                    <span className="text-rose-500 text-xs font-bold">⚠</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] p-8">
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
}

// Temporary placeholder components for steps
function GeneralStep({ data, updateData, onNext }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">General</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Accommodation name</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.accommodationName}
            onChange={(e) => updateData({...data, accommodationName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Type</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
            value={data.type}
            onChange={(e) => updateData({...data, type: e.target.value})}
          >
            <option>Cottage</option>
            <option>Accommodation</option>
            <option>Bungalow</option>
            <option>Apartment</option>
            <option>Group accommodation</option>
            <option>Farm</option>
            <option>Country house</option>
            <option>Boat</option>
            <option>Villa</option>
            <option>Yurt</option>
            <option>Caravan</option>
            <option>Log cabin</option>
            <option>Tree house</option>
            <option>B&B</option>
            <option>Safaritent</option>
            <option>Tiny house</option>
            <option>Cabin</option>
            <option>Glamping</option>
            <option>Chalet</option>
            <option>Camping spot</option>
            <option>Wikkelhouse</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Max. person</label>
          <input 
            type="number" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.maxPerson}
            onChange={(e) => updateData({...data, maxPerson: parseInt(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Living situation</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
            value={data.livingSituation}
            onChange={(e) => updateData({...data, livingSituation: e.target.value})}
          >
            <option>Detached</option>
            <option>Semi-detached</option>
            <option>Part of house, no other guests</option>
            <option>Part of house, other guests possible</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">Location</label>
        <select 
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
          value={data.location}
          onChange={(e) => updateData({...data, location: e.target.value})}
        >
          <option value="">-- Select location --</option>
          <option value="isolated">Isolated</option>
          <option value="yard">On a yard</option>
          <option value="holiday_park">Small holiday park</option>
          <option value="estate">On an estate</option>
          <option value="island">On an island</option>
          <option value="village_center">Near the center of a village</option>
          <option value="village_edge">At the edge of a village</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D] flex items-center gap-2">
            Plot size around accommodation <span className="text-gray-400">ⓘ</span>
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.plotSize}
            onChange={(e) => updateData({...data, plotSize: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">
            Is your house closer than 10m from the nearest neighbour? (Door to door)
          </label>
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="neighbors"
                checked={data.isNearNeighbors === true}
                onChange={() => updateData({...data, isNearNeighbors: true})}
                className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="neighbors"
                checked={data.isNearNeighbors === false}
                onChange={() => updateData({...data, isNearNeighbors: false})}
                className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D] flex items-center gap-2">
            Registration number <span className="text-gray-400">ⓘ</span>
          </label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
            value={data.registrationNumberOption}
            onChange={(e) => updateData({...data, registrationNumberOption: e.target.value})}
          >
            <option>I don't have a registration number</option>
            <option>I have a registration number</option>
            <option>I have an exemption for the registration number</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Registration number</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-gray-50"
            disabled={data.registrationNumberOption !== 'I have a registration number'}
            value={data.registrationNumber}
            onChange={(e) => updateData({...data, registrationNumber: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#59A559] focus:ring-[#59A559]"
            checked={data.hasPublicTransport}
            onChange={(e) => updateData({...data, hasPublicTransport: e.target.checked})}
          />
          <span className="text-gray-700">There is a public transport opportunity at a maximum of one km from the naturehouse</span>
        </label>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors flex items-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function LocationStep({ data, updateData, onNext }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">Location</h2>
      <p className="text-xl font-serif text-[#1D331D] italic">Where is your nature house located?</p>
      
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">Country</label>
        <select 
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
          value={data.country}
          onChange={(e) => updateData({...data, country: e.target.value})}
        >
          <option>Netherlands</option>
          <option>Belgium</option>
          <option>Germany</option>
          <option>France</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">Region</label>
        <select 
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
          value={data.region}
          onChange={(e) => updateData({...data, region: e.target.value})}
        >
          <option>Drenthe</option>
          <option>Friesland</option>
          <option>Groningen</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Street</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.street}
            onChange={(e) => updateData({...data, street: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Number</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.number}
            onChange={(e) => updateData({...data, number: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Postal code</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.postalCode}
            onChange={(e) => updateData({...data, postalCode: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1D331D]">Place</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.place}
            onChange={(e) => updateData({...data, place: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#1D331D] flex items-center gap-2">
          Land registration number <span className="text-gray-400">ⓘ</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="landRegistration"
              className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
              value="available"
              checked={data.landRegistrationOption === 'available'}
              onChange={(e) => updateData({...data, landRegistrationOption: e.target.value})}
            />
            <span>Number is available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="landRegistration"
              className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
              value="not_applicable"
              checked={data.landRegistrationOption === 'not_applicable'}
              onChange={(e) => updateData({...data, landRegistrationOption: e.target.value})}
            />
            <span>Number not applicable</span>
          </label>
        </div>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors flex items-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

const FACILITIES_DATA = {
  'Basic facilities': ['Final cleaning', 'Bed linen', 'Bath towels', 'Kitchen linen', 'Tourist tax'],
  'Utilities': ['Electricity', 'Gas', 'Water', 'Energy costs', 'Wood', 'Internet'],
  'Services': ['Pet', 'Bicycle rental', 'Breakfast', 'Meal service', "Children's cot", 'High chair', 'Washing machine', 'Tumble dryer', 'Hot tub', 'Jacuzzi', 'Sauna', 'Luxury check-in wellness', 'Other costs'],
};

function FacilitiesModal({ isOpen, onClose, selected, onUpdate }: any) {
  const [localSelected, setLocalSelected] = useState(selected);
  const [prices, setPrices] = useState<{ [key: string]: string }>({});

  // Sync with parent state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalSelected(selected);
    }
  }, [isOpen, selected]);

  if (!isOpen) return null;

  const handleToggle = (facility: string) => {
    if (localSelected.includes(facility)) {
      setLocalSelected(localSelected.filter((f: string) => f !== facility));
      // Clear price when deselected
      setPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[facility];
        return newPrices;
      });
    } else {
      setLocalSelected([...localSelected, facility]);
    }
  };

  const handlePriceChange = (facility: string, price: string) => {
    setPrices(prev => ({ ...prev, [facility]: price }));
  };

  const handleSave = () => {
    onUpdate(localSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-serif text-[#1D331D]">Included in the price</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          {Object.entries(FACILITIES_DATA).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-lg text-[#1D331D] mb-3">{category}</h4>
              <div className="space-y-3">
                {items.map((item) => {
                  const needsPrice = item === 'Pet' || item === "Children's cot";
                  const isSelected = localSelected.includes(item);
                  
                  return (
                    <div key={item} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-[#59A559] focus:ring-[#59A559]"
                            checked={isSelected}
                            onChange={() => handleToggle(item)}
                          />
                          <span>{item}</span>
                        </label>
                        {needsPrice && isSelected && (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="text-sm text-gray-600">Price:</span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                              <input 
                                type="number" 
                                placeholder="0.00"
                                className="w-24 pl-7 pr-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
                                value={prices[item] || ''}
                                onChange={(e) => handlePriceChange(item, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <span className="text-sm text-gray-600">per stay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#5b2d8e] text-white font-medium hover:bg-[#4a2475]">Add</button>
        </div>
      </div>
    </div>
  );
}

function ExtraCostsModal({ isOpen, onClose, selected, onUpdate }: any) {
  const [localSelected, setLocalSelected] = useState(selected);

  // Sync with parent state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalSelected(selected);
    }
  }, [isOpen, selected]);

  if (!isOpen) return null;

  const handleToggle = (cost: string) => {
    if (localSelected.includes(cost)) {
      setLocalSelected(localSelected.filter((c: string) => c !== cost));
    } else {
      setLocalSelected([...localSelected, cost]);
    }
  };

  const handleSave = () => {
    onUpdate(localSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-serif text-[#1D331D]">Add extra costs</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          {Object.entries(FACILITIES_DATA).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-lg text-[#1D331D] mb-3">{category}</h4>
              <div className="space-y-3">
                {items.map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-[#59A559] focus:ring-[#59A559]"
                      checked={localSelected.includes(item)}
                      onChange={() => handleToggle(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[#5b2d8e] text-white font-medium hover:bg-[#4a2475]">Add</button>
        </div>
      </div>
    </div>
  );
}

function PhotosStep({ data, updateData, onNext }: any) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">Photos</h2>
      <p className="text-xl font-serif text-[#1D331D] italic">Add photos of your nature house</p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900">Photo requirements:</p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Include at least 10 photos</li>
          <li>Show the exterior of the nature cottage</li>
          <li>Display interior rooms and amenities</li>
          <li>Include surroundings and nature areas</li>
          <li>No logos or watermarks on photos</li>
        </ul>
        <a href="#" className="text-sm text-blue-600 underline hover:text-blue-800">Read more tips on adding photos here</a>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#1D331D]">
          Photos ({selectedFiles.length} selected)
        </label>
        
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-gray-500">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">Click to upload or drag and drop</p>
            <p className="text-sm mt-2">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Selected Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
              
              {/* Add More Photos Button */}
              <div 
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleClickUpload}
              >
                <div className="text-center">
                  <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Add more</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors flex items-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PricingStep({ data, updateData, onNext }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isExtraCostsModalOpen, setIsExtraCostsModalOpen] = useState(false);

  const handleRemoveFacility = (facility: string) => {
    updateData({ ...data, includedFacilities: data.includedFacilities.filter((f: string) => f !== facility) });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">Base price</h2>
      
      <div className="text-gray-600">
        <p>In the rates, you set the base price and extra costs for a stay. Later, you can set prices for specific periods in the calendar. <a href="#" className="text-[#5b2d8e] underline">Learn more about setting your prices.</a></p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">Price per night</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
            value={data.pricePerNight}
            onChange={(e) => updateData({...data, pricePerNight: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#1D331D]">Included in the price</label>
        <div className="flex flex-wrap gap-3">
          {data.includedFacilities.map((item: string, idx: number) => (
            <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700">
              {item}
              <button onClick={() => handleRemoveFacility(item)} className="text-gray-400 hover:text-gray-600">×</button>
            </span>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#EFEFEF] text-[#1D331D] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          + Add facilities
        </button>
        <FacilitiesModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          selected={data.includedFacilities}
          onUpdate={(newFacilities: string[]) => updateData({...data, includedFacilities: newFacilities})}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-bold text-[#1D331D] mb-2">Safety deposit</label>
          <p className="text-sm text-gray-600 mb-6">Choose how you'd like to handle security deposits for your property</p>
        </div>
        
        <div className="space-y-4">
          {/* No Deposit Option */}
          <div className={`relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
            data.safetyDeposit === 'no_deposit' 
              ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="radio" 
                  name="safetyDeposit"
                  value="no_deposit"
                  checked={data.safetyDeposit === 'no_deposit'}
                  onChange={(e) => updateData({...data, safetyDeposit: e.target.value})}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                  data.safetyDeposit === 'no_deposit' 
                    ? 'border-[#59A559] bg-[#59A559]' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {data.safetyDeposit === 'no_deposit' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-[#1D331D] text-base">No deposit</span>
                <p className="text-sm text-gray-600 mt-1">Guests don't need to pay a security deposit</p>
              </div>
            </label>
          </div>

          {/* Pay Upon Booking Option */}
          <div className={`relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
            data.safetyDeposit === 'pay_upon_booking' 
              ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="radio" 
                  name="safetyDeposit"
                  value="pay_upon_booking"
                  checked={data.safetyDeposit === 'pay_upon_booking'}
                  onChange={(e) => updateData({...data, safetyDeposit: e.target.value})}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                  data.safetyDeposit === 'pay_upon_booking' 
                    ? 'border-[#59A559] bg-[#59A559]' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {data.safetyDeposit === 'pay_upon_booking' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-[#1D331D] text-base">Pay upon booking</span>
                <p className="text-sm text-gray-600 mt-1">Guests pay the deposit when they make their reservation</p>
              </div>
            </label>
            
            {data.safetyDeposit === 'pay_upon_booking' && (
              <div className="mt-4 pl-10">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Deposit amount:</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-32 pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white shadow-sm"
                      value={data.safetyDepositAmount}
                      onChange={(e) => updateData({...data, safetyDepositAmount: e.target.value})}
                    />
                  </div>
                  <span className="text-sm text-gray-500">per stay</span>
                </div>
              </div>
            )}
          </div>

          {/* Pay On Site Option */}
          <div className={`relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
            data.safetyDeposit === 'pay_on_site' 
              ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="radio" 
                  name="safetyDeposit"
                  value="pay_on_site"
                  checked={data.safetyDeposit === 'pay_on_site'}
                  onChange={(e) => updateData({...data, safetyDeposit: e.target.value})}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                  data.safetyDeposit === 'pay_on_site' 
                    ? 'border-[#59A559] bg-[#59A559]' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {data.safetyDeposit === 'pay_on_site' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-[#1D331D] text-base">Pay on site</span>
                <p className="text-sm text-gray-600 mt-1">Guests pay the deposit when they arrive at your property</p>
              </div>
            </label>
            
            {data.safetyDeposit === 'pay_on_site' && (
              <div className="mt-4 pl-10">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Deposit amount:</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-32 pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white shadow-sm"
                      value={data.safetyDepositAmount}
                      onChange={(e) => updateData({...data, safetyDepositAmount: e.target.value})}
                    />
                  </div>
                  <span className="text-sm text-gray-500">per stay</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Different prices for longer stays */}
        <div className={`border-2 rounded-xl transition-all ${
          expandedSection === 'longer_stays' 
            ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}>
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('longer_stays')}
          >
            <div>
              <h3 className="font-serif text-xl text-[#1D331D]">Different prices for longer stays</h3>
              <p className="text-sm text-gray-500 mt-1">For certain periods you can set different rates. The rate for a week will also apply to multiple weeks.</p>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${
              expandedSection === 'longer_stays' ? 'rotate-90' : ''
            }`} />
          </div>
          
          {expandedSection === 'longer_stays' && (
            <div className="px-4 pb-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Total price weekend</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
                      value={data.longerStayPricing.weekendPrice}
                      onChange={(e) => updateData({
                        ...data, 
                        longerStayPricing: {
                          ...data.longerStayPricing, 
                          weekendPrice: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Total price long weekend</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
                      value={data.longerStayPricing.longWeekendPrice}
                      onChange={(e) => updateData({
                        ...data, 
                        longerStayPricing: {
                          ...data.longerStayPricing, 
                          longWeekendPrice: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Total price during the week</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
                      value={data.longerStayPricing.weekdayPrice}
                      onChange={(e) => updateData({
                        ...data, 
                        longerStayPricing: {
                          ...data.longerStayPricing, 
                          weekdayPrice: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Total price week</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
                      value={data.longerStayPricing.weekPrice}
                      onChange={(e) => updateData({
                        ...data, 
                        longerStayPricing: {
                          ...data.longerStayPricing, 
                          weekPrice: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Different price for number of people */}
        <div className={`border-2 rounded-xl transition-all ${
          expandedSection === 'person_pricing' 
            ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}>
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('person_pricing')}
          >
            <div>
              <h3 className="font-serif text-xl text-[#1D331D]">Different price for number of people</h3>
              <p className="text-sm text-gray-500 mt-1">Enter a different price for extra persons</p>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${
              expandedSection === 'person_pricing' ? 'rotate-90' : ''
            }`} />
          </div>
          
          {expandedSection === 'person_pricing' && (
            <div className="px-4 pb-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Number of persons within the base price</label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                    <button 
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#5b2d8e]"
                      onClick={() => updateData({
                        ...data, 
                        personPricing: {
                          ...data.personPricing, 
                          basePersons: Math.max(0, data.personPricing.basePersons - 1)
                        }
                      })}
                    >-</button>
                    <span className="w-8 text-center font-medium">{data.personPricing.basePersons}</span>
                    <button 
                      className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5b2d8e] hover:bg-[#e0d0f0]"
                      onClick={() => updateData({
                        ...data, 
                        personPricing: {
                          ...data.personPricing, 
                          basePersons: data.personPricing.basePersons + 1
                        }
                      })}
                    >+</button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1D331D]">Price per additional person per night</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
                      value={data.personPricing.additionalPersonPrice}
                      onChange={(e) => updateData({
                        ...data, 
                        personPricing: {
                          ...data.personPricing, 
                          additionalPersonPrice: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Extra costs */}
        <div className={`border-2 rounded-xl transition-all ${
          expandedSection === 'extra_costs' 
            ? 'border-[#59A559] bg-[#59A559]/5 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}>
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('extra_costs')}
          >
            <div>
              <h3 className="font-serif text-xl text-[#1D331D]">Extra costs</h3>
              <p className="text-sm text-gray-500 mt-1">Indicate below, which additional costs you charge for a stay in your nature house.</p>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${
              expandedSection === 'extra_costs' ? 'rotate-90' : ''
            }`} />
          </div>
          
          {expandedSection === 'extra_costs' && (
            <div className="px-4 pb-4 border-t border-gray-200">
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.extraCosts.map((cost: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm">
                      {cost}
                      <button 
                        onClick={() => updateData({ 
                          ...data, 
                          extraCosts: data.extraCosts.filter((c: string) => c !== cost) 
                        })}
                        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setIsExtraCostsModalOpen(true)}
                  className="bg-[#EFEFEF] text-[#1D331D] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  + Add amenities
                </button>
                <ExtraCostsModal 
                  isOpen={isExtraCostsModalOpen} 
                  onClose={() => setIsExtraCostsModalOpen(false)} 
                  selected={data.extraCosts}
                  onUpdate={(newCosts: string[]) => updateData({...data, extraCosts: newCosts})}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function AvailabilityStep({ data, updateData, onNext }: any) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#1D331D]">Length of stay</h2>
        <p className="text-gray-600">What is the minimum and maximum number of nights of a stay?</p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
              <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#5b2d8e]">-</button>
              <span className="w-8 text-center font-medium">{data.minNights}</span>
              <button 
                className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5b2d8e] hover:bg-[#e0d0f0]"
                onClick={() => updateData({...data, minNights: data.minNights + 1})}
              >+</button>
            </div>
            <span className="text-gray-700">night minimal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
              <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#5b2d8e]">-</button>
              <span className="w-8 text-center font-medium">364</span>
              <button className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5b2d8e] hover:bg-[#e0d0f0]">+</button>
            </div>
            <span className="text-gray-700">nights maximum</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#1D331D]">Arrival days</h2>
        <p className="text-gray-600">On which days and times can guests arrive and depart?</p>

        <div className="space-y-4">
          <h3 className="font-bold text-[#1D331D]">Arrival days</h3>
          <div className="flex flex-wrap gap-3">
            {days.map(day => (
              <label key={`arr-${day}`} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100">
                <div className="w-5 h-5 bg-[#244224] rounded flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-sm font-medium text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-[#1D331D]">Departure days</h3>
          <div className="flex flex-wrap gap-3">
            {days.map(day => (
              <label key={`dep-${day}`} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100">
                <div className="w-5 h-5 bg-[#244224] rounded flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-sm font-medium text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-[#1D331D]">Check in</h3>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">From</label>
                <div className="relative">
                  <input type="text" value="15:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" readOnly />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🕒</span>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">Until</label>
                <div className="relative">
                  <input type="text" value="22:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" readOnly />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🕒</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-[#1D331D]">Check out</h3>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">From</label>
                <div className="relative">
                  <input type="text" value="07:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" readOnly />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🕒</span>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">Until</label>
                <div className="relative">
                  <input type="text" value="11:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" readOnly />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🕒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#1D331D]">Bookings</h2>
        <div>
          <h3 className="font-bold text-[#1D331D] mb-2">Minimum number of days between booking and arrival</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
              <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#5b2d8e]">-</button>
              <span className="w-8 text-center font-medium">0</span>
              <button className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5b2d8e] hover:bg-[#e0d0f0]">+</button>
            </div>
            <span className="text-gray-700">days before arrival</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">How many days prior to arrival can a guest make a booking?</p>
        </div>

        <div className="space-y-3 pt-4">
          <h3 className="font-bold text-[#1D331D]">Availability limit</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[#244224] flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-[#1D331D]">2 years</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-6 h-6 rounded-full border border-gray-300"></div>
              <span className="text-gray-700">1 year</span>
            </label>
          </div>
          <p className="text-sm text-gray-500">How far into the future do you want to receive bookings? Availability is based on this setting and is relative to the current date.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#1D331D]">Automatically approve bookings</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-[#59A559] focus:ring-[#59A559]" />
          <span className="text-gray-700 font-medium">Automatically approve new bookings</span>
        </label>
        
        <div className="bg-[#EAF6FA] border border-[#BDE0EF] rounded-lg p-4 flex gap-3">
          <div className="text-[#0099CC] mt-0.5">ⓘ</div>
          <div className="text-sm text-[#006688]">
            <p className="font-bold mb-1">Automatically approve bookings</p>
            <p>Please note: when you turn on direct booking, bookings are automatically approved immediately. This way guests get a fast reply on their booking. Make sure that the rates, availability and other settings are correct, otherwise this will be at the expense of the guest experience and your visibility on the platform.</p>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CalendarStep({ data, updateData, onNext }: any) {
  // Calendar implementation would go here - using a placeholder for now as it requires complex date logic
  // In a real app, this would use a library like react-day-picker or similar
  const months = [
    { name: 'February 2026', days: 28, startDay: 0 },
    { name: 'March 2026', days: 31, startDay: 0 },
    { name: 'April 2026', days: 30, startDay: 3 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">Custom settings</h2>
      
      <div className="prose text-gray-600">
        <p>In the calendar, you can block periods and enter custom settings via 'configuration'. Always keep your availability up to date to avoid double bookings. Via 'more' you can link your availability to other ICAL calendars for automatic synchronisation. Blocking or unblocking can be done via 'availability', adjusted prices can be set via 'configuration'. <a href="#" className="text-[#5b2d8e] underline">More information on using the calendar</a></p>
      </div>

      <div className="flex gap-4">
        <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">Availability</button>
        <button className="bg-[#5b2d8e] text-white px-6 py-2 rounded-lg font-medium">Configuration</button>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-300 bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#244224] text-white text-[10px] flex items-center justify-center">▼</div>
          <span>Custom settings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#BDDBBD]"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 flex items-center justify-center">
            <div className="w-full h-[1px] bg-white rotate-45"></div>
          </div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-blue-300 bg-blue-50"></div>
          <span>Synced block</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {months.map((month, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-[#1D331D] mb-4">{month.name}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: month.days }).map((_, i) => (
                <div key={i} className="p-1 hover:bg-gray-100 cursor-pointer rounded">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-[#EFEFEF] text-[#1D331D] px-6 py-2 rounded-lg font-medium hover:bg-gray-200">
          Show more months
        </button>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function BedroomsStep({ data, updateData, onNext }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[#1D331D]">Bedrooms</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-serif text-[#1D331D]">Number of bedrooms</h3>
        
        <button className="bg-[#EFEFEF] text-[#5b2d8e] px-6 py-3 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors">
          <span className="text-xl">+</span> Add a bedroom
        </button>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function DescriptionStep({ data, updateData, onNext }: any) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-[#1D331D]">Description</h2>
        <p className="text-gray-600">
          Add a description of you nature house, the nature and the surroundings. <a href="#" className="text-[#5b2d8e] underline">Read some tips on how to write a good advertisement.</a> Note: write the description in the following language: English.
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">About your nature house</label>
        <div className="relative">
          <textarea 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] min-h-[150px]"
            placeholder="Add your text of up to 1000 characters here."
            maxLength={1000}
            value={data.description}
            onChange={(e) => updateData({...data, description: e.target.value})}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {data.description.length} / 1000
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1D331D]">Nature and surroundings</label>
        <div className="relative">
          <textarea 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] min-h-[150px]"
            placeholder="Add your text of up to 1000 characters here."
            maxLength={1000}
            value={data.surroundings}
            onChange={(e) => updateData({...data, surroundings: e.target.value})}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {data.surroundings.length} / 1000
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        In order to give you the best chance to get booked in other countries, your description will be automatically translated into German, Dutch, French and Italian by our translation machine.
      </p>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StayDetailsStep({ data, updateData, onNext }: any) {
  const categories = [
    {
      title: "Peace and Quiet",
      items: ["Contactless stay", "Firework-free area"]
    },
    {
      title: "Accessibility",
      items: ["Wheelchair accessible", "Parking"]
    },
    {
      title: "Utilities",
      items: [
        "Internet access (WiFi)", "Internet", "Fire place", "Pellet stove", "Wood stove", 
        "Gas heater", "Central heating", "Heating (electric, central heating)", "Heating (electric)", 
        "Air conditioning", "Car charging station", "RV hookup", "Drinking water", "Hot water", "Electricity"
      ]
    },
    {
      title: "Outdoor",
      items: [
        "Garden", "Garden (fenced)", "Garden (shared)", "BBQ", "Garden furniture", 
        "Terrace", "Terrace (shared)", "Terrace (covered)", "Balcony", "Patio (shared)", 
        "Small lake", "Garden doors", "Storage"
      ]
    },
    {
      title: "Entertainment",
      items: [
        "TV", "Swimming pool (shared)", "Swimming pool (private)", "Jacuzzi / hot tub", 
        "Sauna", "Infrared sauna", "Tanning bed", "Bicycles available (free)", 
        "Bicycles available (extra charge)", "Table tennis table", "Table football", 
        "Pétanque court", "Pinball machine"
      ]
    },
    {
      title: "Business meetings",
      items: ["Whiteboard", "Projector", "Flip chart"]
    },
    {
      title: "Children",
      items: ["Cot", "High chair", "Baby bath", "Playpen", "Playground equipment", "Sandbox", "Playground", "Trampoline"]
    },
    {
      title: "Pets",
      items: ["Dog bed", "Dog bowl"]
    },
    {
      title: "Kitchen",
      items: ["Kitchen", "Kitchen (shared)", "Dishwasher", "Fridge/freezer", "Oven", "Gas stove"]
    },
    {
      title: "Bathroom",
      items: ["Sanitary facilities", "Bathroom", "Bathroom (shared)", "Bath", "Shower", "Toilet"]
    },
    {
      title: "Laundry",
      items: ["Washing machine", "Washing machine (shared)", "Dryer", "Dryer (shared)"]
    }
  ];

  const handleToggle = (item: string) => {
    const newAmenities = data.amenities.includes(item)
      ? data.amenities.filter((i: string) => i !== item)
      : [...data.amenities, item];
    updateData({...data, amenities: newAmenities});
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-[#1D331D]">Stay details</h2>
        <p className="text-gray-600">Indicate what applies to your nature house</p>
      </div>

      <div className="space-y-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="font-bold text-[#1D331D] text-lg">{cat.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.items.map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${data.amenities.includes(item) 
                      ? 'bg-[#244224] border-[#244224] text-white' 
                      : 'border-gray-300 bg-white group-hover:border-[#59A559]'
                    }
                  `}>
                    {data.amenities.includes(item) && <span className="text-xs">✓</span>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={data.amenities.includes(item)}
                    onChange={() => handleToggle(item)}
                  />
                  <span className="text-gray-700 group-hover:text-[#1D331D] transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SustainabilityStep({ data, updateData, onNext }: any) {
  const sections = [
    {
      title: "Energy",
      questions: [
        { id: "off_grid", text: "Is your nature house off grid or supplied with 100% renewable energy?" },
        { id: "natural_insulation", text: "Is your nature house insulated with natural isolation materials?" },
        { id: "natural_materials", text: "Is your nature house build with natural/sustainable materials?" }
      ]
    },
    {
      title: "Waste",
      questions: [
        { id: "waste_food", text: "Do you minimize food waste (pre-ordered or fixed portion size)?" },
        { id: "waste_inventory", text: "The use of sustainable materials has been conciously considered when compiling the inventory?" },
        { id: "waste_separation", text: "Are guest informed about the way they can reduce and/or separate waste following the local guidelines?" },
        { id: "waste_plastic", text: "Have single-use plastic amenities/supplies been replaced into reusable amenities/supplies?" },
        { id: "waste_water", text: "Do you encourage guests to use tap water or water from an installed water refill station instead of single-use plastic water bottles?" },
        { id: "waste_organic", text: "Do you reuse organic waste in your operations?" }
      ]
    },
    {
      title: "Water",
      questions: [
        { id: "water_toilet", text: "Does your nature house have (a) water-efficient toilet(s)?" },
        { id: "water_shower", text: "Does your nature house have (a) water-efficient shower(s)?" },
        { id: "water_cleaning", text: "Do you clean your nature house with 100% natural cleaning products?" },
        { id: "water_rain", text: "Do you collect rainwater for your garden, toilet, cleaning or more?" },
        { id: "water_min", text: "Do you stimulate guests to minimize water use?" },
        { id: "water_filter", text: "Does your nature house have a eco-friendly waste water filtering system (if not connected to sewage system)?" },
        { id: "water_pond", text: "Does your garden / grounds have a pond or other natural water facility?" }
      ]
    },
    {
      title: "Biodiversity",
      questions: [
        { id: "bio_grow", text: "Do you grow (ecological / organic) food products that are available to guests?" },
        { id: "bio_garden", text: "Do you have a biodiversity-friendly garden (flowers, trees, hedges,..)?" },
        { id: "bio_manage", text: "Do you manage your garden in a sustainable way?" },
        { id: "bio_local", text: "Do you contribute to local biodiversity beyond your property? (for instance by planting, sowing indigenous plants, herbs)" },
        { id: "bio_invest", text: "Do you reinvest a % of your revenue in local biodiversity (e.g. donation to regional parc)?" },
        { id: "bio_rules", text: "Do you have a have specific house rules on darkness and silence after certain hours to stimulate guests to respect the biorhythm of local species?" },
        { id: "bio_home", text: "Does your nature house also provide a home for birds, insects or bats?" }
      ]
    },
    {
      title: "Destination",
      questions: [
        { id: "dest_bike", text: "Do you stimulate guests to use a bike by offering bicycle rental or bicycle rental nearby?" },
        { id: "dest_sust", text: "Do you stimulate guests to come to your nature house in a sustainable way?" },
        { id: "dest_tours", text: "Do you offer guests tours and activities organised by local guides and businesses?" },
        { id: "dest_info", text: "Do you provide guests with information on local biodiversity and ecosystems and (seasonal) visitor etiquette?" },
        { id: "dest_food", text: "Do you offer locally produced (organic) food & goods in your nature house?" },
        { id: "dest_culture", text: "Do you provide guests with information regarding local heritage and culture as well as visitor etiquette?" },
        { id: "dest_heritage", text: "Is your nature house (protected) cultural heritage?" },
        { id: "dest_charge", text: "Do you offer electric charging for cars and bikes or other types of mobility?" }
      ]
    }
  ];

  const handleSustainabilityChange = (id: string, value: string) => {
    updateData({
      ...data,
      sustainability: { ...data.sustainability, [id]: value }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-[#1D331D]">Sustainability</h2>
        <p className="text-gray-600">Below you can indicate which sustainable aspects your nature house meets.</p>
      </div>

      <div className="space-y-8">
        {/* Energy Label */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#1D331D] text-lg">Energy</h3>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1D331D]">What is your energy label?</label>
            <select 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559] bg-white"
              value={data.energyLabel}
              onChange={(e) => updateData({...data, energyLabel: e.target.value})}
            >
              <option value="">Select an energy label</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>
          </div>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="font-bold text-[#1D331D] text-lg">{section.title}</h3>
            <div className="space-y-6">
              {section.questions.map((q) => (
                <div key={q.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-0">
                  <p className="text-gray-800">{q.text}</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`sust_${q.id}`}
                        className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
                        checked={data.sustainability[q.id] === 'yes'}
                        onChange={() => handleSustainabilityChange(q.id, 'yes')}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`sust_${q.id}`}
                        className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
                        checked={data.sustainability[q.id] === 'no'}
                        onChange={() => handleSustainabilityChange(q.id, 'no')}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={onNext}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function HouseRulesStep({ data, updateData, onNext }: any) {
  const [showMore, setShowMore] = useState(false);

  const updateRule = (field: string, value: any) => {
    updateData({
      ...data,
      houseRules: { ...data.houseRules, [field]: value }
    });
  };

  const addCustomRule = () => {
    updateRule('customRules', [...data.houseRules.customRules, '']);
  };

  const removeCustomRule = (idx: number) => {
    const newRules = data.houseRules.customRules.filter((_: string, i: number) => i !== idx);
    updateRule('customRules', newRules);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-3xl font-serif text-[#1D331D]">We would like to draw your attention to the following points.</h2>
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p>1. We agree, and you hereby declare, that you will personally occupy the nature house. You also declare that you will occupy the house and the surrounding grounds in a neat and correct manner and that no inconvenience will be caused during your stay. If you cause unexpected damage to the grounds / cottage or if there is negligent use, then the costs may be claimed from you by the landlord.</p>
          
          {showMore && (
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>2. The nature house is rented furnished (unless otherwise stated) and is equipped with enough kitchen utensils, dishes, glassware, blankets and pillows for the entire group of guests. Upon arrival, all appliances are in working order. If this is not the case, please inform the landlord or case manager as soon as possible. They will then try to solve the problem as soon as possible. As a guest you are also required to notify the landlord of the nature house within 24 hours after arrival in case of damage in the building and outbuildings or associated buildings.</p>
              
              <p>3. Of course we assume that you will have a carefree stay, but should something unexpected happen, it is important that you as a guest are insured for the civil liability associated with the rental of a natural house (fire and water damage). If you are not insured, you can be held personally liable for these damage costs and for the interest on these costs. The landlord himself has also insured the rented nature house and outbuildings (building and contents insurance). There is an obligation to do so.</p>
              
              <p>4. Furthermore, it is important to know that as a guest you may never deny the landlord or his/her representative access to the nature house if asked.</p>
            </div>
          )}
          
          <button 
            onClick={() => setShowMore(!showMore)}
            className="text-[#5b2d8e] font-medium mt-2 flex items-center gap-1"
          >
            {showMore ? 'Show less' : 'Show more'} <span>{showMore ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#1D331D]">Compose your own house rules</h2>
        
        {/* Counters */}
        <div className="space-y-6">
          {[
            { label: "How many babies are allowed in your nature house?", field: "babies" },
            { label: "How many pets are allowed at your nature house?", field: "pets" },
            { label: "Minimum age for children at your nature house", field: "childAge" },
            { label: "Minimum age for the booking person", field: "bookingAge" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="font-medium text-[#1D331D]">{item.label}</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                <button 
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#5b2d8e]"
                  onClick={() => updateRule(item.field, Math.max(0, data.houseRules[item.field] - 1))}
                >-</button>
                <span className="w-8 text-center font-medium">{data.houseRules[item.field]}</span>
                <button 
                  className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5b2d8e] hover:bg-[#e0d0f0]"
                  onClick={() => updateRule(item.field, data.houseRules[item.field] + 1)}
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Yes/No Questions */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          {[
            { label: "Are parties and events allowed in your nature house?", field: "parties" },
            { label: "Is smoking allowed in your nature house?", field: "smoking" },
            { label: "Are fireworks allowed in your nature house?", field: "fireworks" },
            { label: "Are groups of young people, students or sports teams allowed in your nature house?", field: "groups" },
            { label: "Is it mandatory to separate waste at your nature house?", field: "waste" }
          ].map((item, idx) => (
            <div key={idx} className="space-y-3">
              <span className="font-medium text-[#1D331D]">{item.label}</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`rule_${item.field}`}
                    className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
                    checked={data.houseRules[item.field] === true}
                    onChange={() => updateRule(item.field, true)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name={`rule_${item.field}`}
                    className="w-5 h-5 text-[#59A559] focus:ring-[#59A559]"
                    checked={data.houseRules[item.field] === false}
                    onChange={() => updateRule(item.field, false)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h2 className="text-2xl font-serif text-[#1D331D]">Respect for nature</h2>
        <p className="text-gray-600">Out of respect for nature you can set times of the day where silence is required around your nature house.</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1D331D]">Start time</label>
            <div className="relative">
              <input 
                type="time" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
                value={data.houseRules.silenceStart}
                onChange={(e) => updateRule('silenceStart', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1D331D]">End time</label>
            <div className="relative">
              <input 
                type="time" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
                value={data.houseRules.silenceEnd}
                onChange={(e) => updateRule('silenceEnd', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h2 className="text-2xl font-serif text-[#1D331D]">Other house rules</h2>
        <p className="text-gray-600">State your specific house rules here.</p>
        
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Parties or events are not allowed in this nature house</li>
          <li>Smoking is not allowed in this nature house</li>
          <li>Fireworks are not allowed around this nature house</li>
          <li>Groups of young people, students and sports teams are not allowed in this nature house</li>
        </ul>

        {data.houseRules.customRules.map((rule: string, idx: number) => (
          <div key={idx} className="flex gap-2 mt-2">
            <input 
              type="text"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#59A559]/20 focus:border-[#59A559]"
              placeholder="Add a rule..."
              value={rule}
              onChange={(e) => {
                const newRules = [...data.houseRules.customRules];
                newRules[idx] = e.target.value;
                updateRule('customRules', newRules);
              }}
            />
            <button 
              onClick={() => removeCustomRule(idx)}
              className="px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Remove rule"
            >
              ×
            </button>
          </div>
        ))}

        <button 
          onClick={addCustomRule}
          className="bg-[#EFEFEF] text-[#1D331D] px-6 py-3 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors mt-4"
        >
          <span className="text-xl">+</span> Add a house rule
        </button>
      </div>

      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button 
          onClick={() => {
            // Here you would typically submit the form to the backend
            alert('Listing created successfully!');
            onNext();
          }}
          className="bg-[#5b2d8e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a2475] transition-colors"
        >
          Create Listing
        </button>
      </div>
    </div>
  );
}
