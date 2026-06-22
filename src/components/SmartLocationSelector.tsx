import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Compass, Search, Navigation, Home, Briefcase, 
  Map as MapIcon, Plus, Trash2, AlertTriangle, Check, 
  Clock, Truck, Info, X, ChevronDown, CheckCircle, MapPin as TagIcon
} from 'lucide-react';
import { Address } from '../types';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// Supported Bangalore PIN codes with local mocks
const BENGALURU_PIN_MOCKS: Record<string, { area: string; city: string; state: string; lat: number; lng: number }> = {
  '560103': { area: 'Bellandur', city: 'Bengaluru', state: 'Karnataka', lat: 12.9279, lng: 77.6801 },
  '560001': { area: 'MG Road', city: 'Bengaluru', state: 'Karnataka', lat: 12.9756, lng: 77.5964 },
  '560008': { area: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka', lat: 12.9719, lng: 77.6412 },
  '560034': { area: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', lat: 12.9352, lng: 77.6244 },
  '560037': { area: 'Marathahalli', city: 'Bengaluru', state: 'Karnataka', lat: 12.9592, lng: 77.6974 },
  '560076': { area: 'JP Nagar', city: 'Bengaluru', state: 'Karnataka', lat: 12.9105, lng: 77.5857 },
  '560041': { area: 'Jayanagar', city: 'Bengaluru', state: 'Karnataka', lat: 12.9299, lng: 77.5824 },
  '560066': { area: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', lat: 12.9698, lng: 77.7499 },
  '560102': { area: 'HSR Layout', city: 'Bengaluru', state: 'Karnataka', lat: 12.9141, lng: 77.6411 },
};

interface SmartLocationSelectorProps {
  addresses: Address[];
  onAddAddress: (newAddr: Omit<Address, 'id' | 'isDefault'>) => Promise<void>;
  onRemoveAddress: (id: string) => Promise<void>;
  onSelectAddress: (id: string) => void;
  activeAddress: Address | null;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.length > 10;

export default function SmartLocationSelector({
  addresses,
  onAddAddress,
  onRemoveAddress,
  onSelectAddress,
  activeAddress
}: SmartLocationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Form coordinates
  const [selectedLat, setSelectedLat] = useState<number>(12.9352); // Koramangala
  const [selectedLng, setSelectedLng] = useState<number>(77.6244);
  const [selectedArea, setSelectedArea] = useState('Koramangala');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedPincode, setSelectedPincode] = useState('560034');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Delivery estimation calculations based on current selected coordinates
  const [deliveryAssessment, setDeliveryAssessment] = useState({
    eligible: true,
    estimatedTime: '25-35 mins',
    minOrderValue: 99,
    deliveryFee: 40,
    distanceKm: 1.5,
    message: ''
  });

  // Calculate delivery details dynamically based on coordinates (assuming restaurant is in Koramangala: 12.9279, 77.6271)
  const calculateDeliveryEligibility = (lat: number, lng: number) => {
    // Haversine formula
    const rLat1 = (Math.PI * 12.9279) / 180;
    const rLat2 = (Math.PI * lat) / 180;
    const theta = 77.6271 - lng;
    const rTheta = (Math.PI * theta) / 180;
    let dist = Math.sin(rLat1) * Math.sin(rLat2) + Math.cos(rLat1) * Math.cos(rLat2) * Math.cos(rTheta);
    dist = Math.acos(dist > 1 ? 1 : dist);
    dist = (dist * 180) / Math.PI;
    const distKm = parseFloat((dist * 60 * 1.1515 * 1.609344).toFixed(1));

    if (distKm <= 8) {
      setDeliveryAssessment({
        eligible: true,
        estimatedTime: '25-35 mins',
        minOrderValue: 99,
        deliveryFee: 40,
        distanceKm: distKm,
        message: 'Fast express hot delivery is fully operational!'
      });
    } else if (distKm <= 18) {
      setDeliveryAssessment({
        eligible: true,
        estimatedTime: '45-55 mins',
        minOrderValue: 199,
        deliveryFee: 65,
        distanceKm: distKm,
        message: 'Slightly further out. Requires high-temp heat container sealing.'
      });
    } else {
      setDeliveryAssessment({
        eligible: false,
        estimatedTime: '--',
        minOrderValue: 0,
        deliveryFee: 0,
        distanceKm: distKm,
        message: 'Outside our culinary dispatch ring limits. Order table reservation instead!'
      });
    }
  };

  useEffect(() => {
    calculateDeliveryEligibility(selectedLat, selectedLng);
  }, [selectedLat, selectedLng]);

  // Handle free India PIN code automated lookup
  const lookupPincode = async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) {
      setPincodeError('Please enter a valid 6-digit PIN code');
      return;
    }
    setPincodeError('');
    setIsLoading(true);

    // Fallback static lookup first
    if (BENGALURU_PIN_MOCKS[pin]) {
      const mockResult = BENGALURU_PIN_MOCKS[pin];
      setSelectedArea(mockResult.area);
      setSelectedCity(mockResult.city);
      setSelectedState(mockResult.state);
      setSelectedLat(mockResult.lat);
      setSelectedLng(mockResult.lng);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await resp.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const pOffice = data[0].PostOffice[0];
        setSelectedArea(pOffice.Name);
        setSelectedCity(pOffice.District || pOffice.Division || 'Bengaluru');
        setSelectedState(pOffice.State);
        
        // Setup coordinates based on city search fallback
        if (pOffice.District?.toLowerCase().includes('delhi') || pOffice.State?.toLowerCase().includes('delhi')) {
          setSelectedLat(28.6139);
          setSelectedLng(77.2090);
        } else if (pOffice.District?.toLowerCase().includes('mumbai') || pOffice.State?.toLowerCase().includes('maharashtra')) {
          setSelectedLat(19.0760);
          setSelectedLng(72.8777);
        } else {
          // Keep Bengaluru coordinates if unknown to keep it deliverable
          setSelectedLat(12.9716);
          setSelectedLng(77.5946);
        }
      } else {
        setPincodeError('PIN code not found in National Postal register.');
      }
    } catch (e) {
      console.warn('Postcode API failed, using default values', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Autocomplete typing address search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    // Is it a PIN Code?
    if (/^\d{6}$/.test(searchQuery)) {
      lookupPincode(searchQuery);
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(() => {
      // Create intelligent matches
      const query = searchQuery.toLowerCase();
      
      // Look up our static locations
      const areas = Object.entries(BENGALURU_PIN_MOCKS)
        .filter(([pin, detail]) => 
          detail.area.toLowerCase().includes(query) || 
          pin.includes(query) || 
          detail.city.toLowerCase().includes(query)
        )
        .map(([pin, detail]) => ({
          type: 'pincode',
          title: `${detail.area}, ${detail.city}`,
          subtitle: `PIN Code: ${pin}, Karnataka`,
          lat: detail.lat,
          lng: detail.lng,
          pincode: pin,
          area: detail.area,
          city: detail.city,
          state: detail.state
        }));

      // Let's add some landmark list
      const landmarks = [
        { title: 'Prestige Tech Park, Outer Ring Road', subtitle: 'Kadubeesanahalli, Bellandur, Bengaluru', pin: '560103', lat: 12.9437, lng: 77.6974 },
        { title: 'Eco Space Business Park, Bellandur', subtitle: 'Outer Ring Road, Bengaluru', pin: '560103', lat: 12.9247, lng: 77.6791 },
        { title: 'Indiranagar Metro Station, Metro pillar 130', subtitle: '100 Feet Rd, Indiranagar, Bengaluru', pin: '560008', lat: 12.9719, lng: 77.6412 },
        { title: 'Forum Mall, Koramangala', subtitle: 'Hosur Rd, Koramangala 7th Block, Bengaluru', pin: '560034', lat: 12.9344, lng: 77.6111 },
        { title: 'Phoenix Marketcity Mall, Whitefield', subtitle: 'Mahadevapura, Whitefield Road, Bengaluru', pin: '560066', lat: 12.9959, lng: 77.6964 },
        { title: 'Brigade Gateway & Orion Mall', subtitle: 'Rajajinagar, Malleshwaram, Bengaluru', pin: '560055', lat: 13.0112, lng: 77.5550 },
        { title: 'Manyata Tech Park, Outer Ring Road', subtitle: 'Nagawara, Hebbal, Bengaluru', pin: '560045', lat: 13.0451, lng: 77.6266 }
      ].filter(l => l.title.toLowerCase().includes(query) || l.subtitle.toLowerCase().includes(query));

      const landmarkResults = landmarks.map(l => ({
        type: 'landmark',
        title: l.title,
        subtitle: l.subtitle,
        lat: l.lat,
        lng: l.lng,
        pincode: l.pin,
        area: l.title.split(',')[0],
        city: 'Bengaluru',
        state: 'Karnataka'
      }));

      setSearchResults([...areas, ...landmarkResults]);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Geolocation auto detect
  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      alert('Your device browser does not support Geolocation positioning.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedLat(latitude);
        setSelectedLng(longitude);

        // Reverse geocoding fallback calculation based on Bengaluru center bounding box
        // Distance check from Bangalore center: 12.9716, 77.5946
        const latDist = Math.abs(latitude - 12.9716);
        const lngDist = Math.abs(longitude - 77.5946);
        
        if (latDist < 0.3 && lngDist < 0.3) {
          // User is likely in Bangalore! Find closest Mock PIN Code
          let minDistance = Infinity;
          let closestPin = '560034';
          Object.entries(BENGALURU_PIN_MOCKS).forEach(([pin, details]) => {
            const d = Math.pow(latitude - details.lat, 2) + Math.pow(longitude - details.lng, 2);
            if (d < minDistance) {
              minDistance = d;
              closestPin = pin;
            }
          });
          const bestMatch = BENGALURU_PIN_MOCKS[closestPin];
          setSelectedArea(bestMatch.area);
          setSelectedCity(bestMatch.city);
          setSelectedState(bestMatch.state);
          setSelectedPincode(closestPin);
          setAddressLine1(`Live Geolocated Ground Spot ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
        } else {
          // Not in Bangalore. Render generic details
          setSelectedArea('Your Spotted Coordinates');
          setSelectedCity('Detected City');
          setSelectedState('Detected State');
          setSelectedPincode('');
          setAddressLine1(`Geolocated Coordinate: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
        }
        setIsLoading(false);
        setIsSearching(false);
      },
      (err) => {
        console.warn('Geolocation error', err);
        alert(`Location access denied. Please allow GPS permissions to auto detect.`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Drag pin updates (coordinate change simulation or Google map tracking)
  const handleMapCenterChanged = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    
    // Simulate reverse geocoding
    let minDistance = Infinity;
    let closestPin = '560034';
    Object.entries(BENGALURU_PIN_MOCKS).forEach(([pin, details]) => {
      const d = Math.pow(lat - details.lat, 2) + Math.pow(lng - details.lng, 2);
      if (d < minDistance) {
        minDistance = d;
        closestPin = pin;
      }
    });

    const bestMatch = BENGALURU_PIN_MOCKS[closestPin];
    setSelectedArea(bestMatch.area);
    setSelectedCity(bestMatch.city);
    setSelectedState(bestMatch.state);
    if (!selectedPincode || selectedPincode === '560034') {
      setSelectedPincode(closestPin);
    }
  };

  const saveSelectedAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1.trim()) {
      alert('Please fill in a delivery block or street coordinates.');
      return;
    }

    if (!deliveryAssessment.eligible) {
      alert('Warning: Food deliverability is currently out of range. Please choose a Bengaluru coordinate!');
      return;
    }

    // Call callback to save addresses
    await onAddAddress({
      type: addressType,
      addressLine1: `${addressLine1.trim()}, ${selectedArea}`,
      addressLine2: addressLine2.trim() || undefined,
      city: selectedCity,
      zipCode: selectedPincode,
      locality: selectedArea,
      state: selectedState,
      lat: selectedLat,
      lng: selectedLng,
    });

    setIsModalOpen(false);
    // Reset form inputs
    setAddressLine1('');
    setAddressLine2('');
  };

  return (
    <div className="bg-[#0c0c0c] border border-neutral-855 rounded-3xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 select-none text-white">
      {/* LEFT BLOCK: ACTIVE ADDR */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0">
          <MapPin className="h-5 w-5 animate-bounce" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5A1F] font-bold block mb-1">
            Delivering Meal Pack To:
          </span>
          {activeAddress ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white font-sans flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono tracking-wider font-extrabold uppercase bg-neutral-900 border border-neutral-800 text-[#FF8C42]">
                    {activeAddress.type}
                  </span>
                  {activeAddress.locality || activeAddress.city}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-lg truncate font-sans">
                {activeAddress.addressLine1}, {activeAddress.city} - {activeAddress.zipCode}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-sm font-black text-neutral-450 italic font-sans">
                No location set. Select a delivery coordinate.
              </span>
              <p className="text-xs text-neutral-500 mt-1 font-sans">
                Setup your delivery details before placing hot items inside your cart.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT BLOCK: QUICK OPTION CONTROLS */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl border border-neutral-800 bg-[#070707] text-[#FF5A1F] hover:bg-neutral-900 transition flex items-center gap-2 text-xs font-black font-sans uppercase tracking-wider cursor-pointer active:scale-95 shadow-md"
        >
          <Compass className="h-4 w-4" />
          Change Pin / Address
        </button>
      </div>

      {/* THE SMART DELIV LOCATION MODAL ENGINE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 select-none">
            {/* Backdrop filter blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#070707]/95 backdrop-blur-md cursor-pointer"
            />

            {/* Main Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#0d0d0d] border border-neutral-850 rounded-[35px] w-full max-w-5xl h-[88vh] md:h-[80vh] flex flex-col overflow-hidden text-neutral-200 shadow-2xl"
            >
              {/* Header Box */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-[#090909]">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F]">
                    <Navigation className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-sans uppercase tracking-wider">
                      Premium Dispatch Positioner
                    </h2>
                    <p className="text-[9px] font-mono tracking-widest text-[#FF5A1F] uppercase font-bold mt-0.5">
                      Intel-Guided Location & Deliverability Matrix
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 w-9 rounded-xl border border-neutral-850 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-950 transition cursor-pointer active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Grid split screen: Left is Interactive Map, Right is search / form */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* LEFT GRID: INTERACTIVE MAP AND AUTO-DETECTOR */}
                <div className="lg:col-span-6 relative bg-neutral-950 flex flex-col justify-between overflow-hidden border-r border-neutral-900 h-64 lg:h-auto">
                  
                  {/* Real Google Maps API or Beautiful Stylized Vector Fallback */}
                  {hasValidKey ? (
                    <div className="w-full h-full relative" style={{ minHeight: '100%' }}>
                      <APIProvider apiKey={API_KEY} version="weekly">
                        <Map
                          center={{ lat: selectedLat, lng: selectedLng }}
                          zoom={14}
                          mapId="DEMO_MAP_ID"
                          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                          style={{ width: '100%', height: '100%' }}
                          onCenterChanged={(e: any) => {
                            const newCenter = e.detail?.center;
                            if (newCenter) {
                              handleMapCenterChanged(newCenter.lat, newCenter.lng);
                            }
                          }}
                        >
                          <AdvancedMarker 
                            position={{ lat: selectedLat, lng: selectedLng }}
                            draggable
                            onDragEnd={(e: any) => {
                              const pos = e.latLng;
                              if (pos) {
                                handleMapCenterChanged(pos.lat(), pos.lng());
                              }
                            }}
                          >
                            <Pin background="#FF5A1F" glyphColor="#fff" />
                          </AdvancedMarker>
                        </Map>
                      </APIProvider>
                    </div>
                  ) : (
                    // PREMIUM VECTOR INTERACTIVE SIMULATOR FALLBACK
                    <div className="w-full h-full bg-[#050505] relative flex flex-col items-center justify-center p-4">
                      {/* Grid design background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      {/* Compass rings visualization */}
                      <div className="absolute h-48 w-48 rounded-full border border-neutral-900 flex items-center justify-center animate-spin-slow pointer-events-none">
                        <div className="absolute h-36 w-36 rounded-full border border-neutral-900/40" />
                        <div className="absolute h-24 w-24 rounded-full border border-neutral-900/25" />
                      </div>

                      {/* Visual Bengaluru landmark tags */}
                      <div className="absolute text-[9px] font-mono text-neutral-600 top-4 left-6 border border-neutral-900 px-2 py-1 rounded bg-black/45 select-none hover:text-[#FF8C42] cursor-pointer" onClick={() => handleMapCenterChanged(12.9719, 77.6412)}>
                        📍 INDIRANAGAR HQ
                      </div>
                      <div className="absolute text-[9px] font-mono text-neutral-600 bottom-12 right-6 border border-neutral-900 px-2 py-1 rounded bg-black/45 select-none hover:text-[#FF8C42] cursor-pointer" onClick={() => handleMapCenterChanged(12.9279, 77.6801)}>
                        📍 BELLANDUR APARTMENTS
                      </div>
                      <div className="absolute text-[9px] font-mono text-neutral-600 top-24 right-12 border border-neutral-900 px-2 py-1 rounded bg-black/45 select-none hover:text-[#FF8C42] cursor-pointer" onClick={() => handleMapCenterChanged(12.9698, 77.7499)}>
                        📍 WHITEFIELD
                      </div>
                      <div className="absolute text-[9px] font-mono text-neutral-500 bottom-4 left-12 border border-[#FF5A1F]/20 px-2.5 py-1 rounded-full bg-black/80 font-bold select-none cursor-pointer hover:bg-neutral-900" onClick={() => handleMapCenterChanged(12.9352, 77.6244)}>
                        📍 KORAMANGALA HUB (Spex Core)
                      </div>

                      {/* Moving draggable target simulator */}
                      <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                          drag 
                          dragConstraints={{ left: -140, right: 140, top: -140, bottom: 140 }}
                          onDrag={(event, info) => {
                            // Map drag coordinates (px) back to coordinate delta
                            const latOffset = -info.offset.y * 0.0003;
                            const lngOffset = info.offset.x * 0.0003;
                            handleMapCenterChanged(12.92 + latOffset, 77.63 + lngOffset);
                          }}
                          whileDrag={{ scale: 1.15 }}
                          className="cursor-grab active:cursor-grabbing bg-[#FF5A1F] text-white p-3.5 rounded-full shadow-lg shadow-[#FF5A1F]/30 border border-[#FF8C42]/50"
                        >
                          <MapIcon className="h-5 w-5 animate-pulse" />
                        </motion.div>
                        <span className="text-[9px] font-mono text-[#FF5A1F] mt-2 block tracking-widest uppercase font-bold bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded-full">
                          DRAGGABLE DELIV PIN
                        </span>
                        <span className="text-[8px] font-mono text-neutral-600 mt-1">
                          Drag this icon to adjust coordinate position
                        </span>
                      </div>

                      {/* Map coordinate status overlay bar */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/85 border border-neutral-900 p-3 rounded-2xl flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <Compass className="h-3.5 w-3.5 text-[#FF5A1F]" />
                          <div>
                            <span className="text-[8px] font-mono text-neutral-400 block uppercase">Simulator Position:</span>
                            <span className="text-[10px] font-mono text-white tracking-widest font-black">
                              {selectedLat.toFixed(4)}°N, {selectedLng.toFixed(4)}°E
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-[#FFD166] shrink-0 bg-[#FFD166]/10 px-2 py-0.5 rounded border border-[#FFD166]/20">
                          BENGALURU BIO-RING
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Geolocation trigger floating buttons */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <button
                      onClick={handleAutoDetect}
                      disabled={isLoading}
                      className="px-4 py-2.5 rounded-xl border border-neutral-850 bg-black/90 hover:bg-neutral-900 text-[#FF5A1F] transition flex items-center gap-2 text-[10px] font-black font-sans uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {isLoading ? 'Scanning GPS...' : 'Auto Detect GPS'}
                    </button>
                  </div>
                </div>

                {/* RIGHT GRID: SMART ADDRESS SEARCH & FORMS */}
                <div className="lg:col-span-6 flex flex-col h-full overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-none">
                  
                  {/* SEARCH BOX GROUP */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-mono tracking-widest text-neutral-400 font-extrabold uppercase flex items-center gap-1.5">
                      <Search className="h-3 w-3 text-[#FF5A1F]" /> Search Area, Landmark or Pin Code
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Indiranagar, Bellandur, Pincode 560103..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-[#070707] border border-neutral-850 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]/80 transition pl-10"
                      />
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-3 px-1 text-[10px] font-bold text-neutral-500 hover:text-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* SEARCH RESULTS DROPDOWN EXPANSION */}
                    <AnimatePresence>
                      {searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="bg-[#090909] border border-neutral-855 rounded-2xl overflow-hidden max-h-44 overflow-y-auto scrollbar-none shadow-xl divide-y divide-neutral-900"
                        >
                          {searchResults.map((res, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedLat(res.lat);
                                setSelectedLng(res.lng);
                                setSelectedArea(res.area);
                                setSelectedCity(res.city);
                                setSelectedState(res.state);
                                setSelectedPincode(res.pincode);
                                setSearchQuery('');
                                setSearchResults([]);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-neutral-900 transition flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <MapPin className="h-4 w-4 text-[#FF5A1F] shrink-0" />
                                <div>
                                  <span className="font-extrabold text-white block">{res.title}</span>
                                  <span className="text-[10px] text-neutral-500 block mt-0.5">{res.subtitle}</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-[#FFD166] uppercase font-bold shrink-0">
                                Click to pin
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* DELIVERY RANGE AND DISPATCH ASSESSMENT */}
                  <div className={`p-4 rounded-2xl border ${
                    deliveryAssessment.eligible 
                      ? 'bg-emerald-950/10 border-emerald-500/20' 
                      : 'bg-rose-950/10 border-rose-500/20'
                  }`}>
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          deliveryAssessment.eligible ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                        }`} />
                        <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">
                          {deliveryAssessment.eligible ? 'Hot Deliverable' : 'OutOfRange'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400">
                        {deliveryAssessment.distanceKm} km from Spex Kitchen
                      </span>
                    </div>

                    {deliveryAssessment.eligible ? (
                      <div className="grid grid-cols-3 gap-2 mt-3.5 border-t border-neutral-900 pt-3">
                        <div className="bg-neutral-950 border border-neutral-900 p-2 rounded-xl text-center">
                          <span className="text-[8px] font-mono text-neutral-500 block uppercase">ETA</span>
                          <span className="text-[10px] font-bold text-white block mt-0.5 flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-[#FF5A1F]" /> {deliveryAssessment.estimatedTime}
                          </span>
                        </div>
                        <div className="bg-neutral-950 border border-neutral-900 p-2 rounded-xl text-center">
                          <span className="text-[8px] font-mono text-neutral-500 block uppercase">Deliv. Fee</span>
                          <span className="text-[10px] font-bold text-white block mt-0.5 flex items-center justify-center gap-1">
                            <Truck className="h-3 w-3 text-emerald-400" /> ₹{deliveryAssessment.deliveryFee}
                          </span>
                        </div>
                        <div className="bg-neutral-950 border border-neutral-900 p-2 rounded-xl text-center">
                          <span className="text-[8px] font-mono text-neutral-500 block uppercase">Min. Order</span>
                          <span className="text-[10px] font-bold text-white block mt-0.5">
                            ₹{deliveryAssessment.minOrderValue}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-rose-400 mt-2 font-sans flex items-center gap-1.5 leading-relaxed">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                        We currently only dispatch within Bangalore’s culinary bio-ring (Max 18km). Reservations still open!
                      </p>
                    )}
                    <p className="text-[9px] text-[#FFD166] mt-2 block tracking-wide text-center">
                      {deliveryAssessment.message}
                    </p>
                  </div>

                  {/* RECENT / SAVED ADDRESS QUICK SLOTS */}
                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono tracking-widest text-neutral-400 font-extrabold uppercase">
                        Saved Core Coordinates
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-3 bg-neutral-950 border rounded-2xl flex flex-col justify-between gap-1.5 text-left relative transition ${
                              activeAddress?.id === addr.id
                                ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 shadow-sm shadow-[#FF5A1F]/5'
                                : 'border-neutral-900 hover:border-neutral-800'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-black text-white font-sans flex items-center gap-1">
                                {addr.type === 'Home' && <Home className="h-3.5 w-3.5 text-cyan-400" />}
                                {addr.type === 'Work' && <Briefcase className="h-3.5 w-3.5 text-orange-400" />}
                                {addr.type === 'Other' && <TagIcon className="h-3.5 w-3.5 text-amber-400" />}
                                {addr.type}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => onSelectAddress(addr.id)}
                                  className="text-[9px] font-mono uppercase bg-neutral-900 hover:bg-[#FF5A1F] text-neutral-400 hover:text-white px-2 py-0.5 rounded border border-neutral-800 cursor-pointer text-xs"
                                >
                                  {activeAddress?.id === addr.id ? 'Active' : 'Select'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveAddress(addr.id)}
                                  className="h-5 w-5 hover:bg-neutral-900 flex items-center justify-center rounded-md border border-neutral-900 text-neutral-500 hover:text-rose-500 transition cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-neutral-400 font-sans truncate pr-2">
                              {addr.addressLine1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MANUAL COORDINATE INPUT FIELDS & CONFIRMER */}
                  <form onSubmit={saveSelectedAddress} className="space-y-3 pt-2 border-t border-neutral-950">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">PIN Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="6-digit India PIN"
                          value={selectedPincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setSelectedPincode(val);
                            if (val.length === 6) {
                              lookupPincode(val);
                            }
                          }}
                          className="w-full px-3 py-2 bg-[#070707] border border-neutral-850 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF5A1F]/80"
                        />
                        {pincodeError && <p className="text-[8px] text-rose-500 font-mono mt-0.5">{pincodeError}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Sector / Area</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Indiranagar, Bellandur"
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full px-3 py-2 bg-[#070707] border border-neutral-850 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF5A1F]/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Street Address / Block / Apt Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Tower B, Flat 301, Crest Luxury Residences"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#070707] border border-neutral-850 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF5A1F]/80"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Opposite Prestige Tech Park main gate"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070707] border border-neutral-850 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF5A1F]/80"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">Select Tag</label>
                        <div className="flex gap-1.5">
                          {(['Home', 'Work', 'Other'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddressType(type)}
                              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-mono uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                                addressType === type
                                  ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-white'
                                  : 'bg-neutral-950 border-neutral-900 text-neutral-450 hover:border-neutral-850'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 flex flex-col justify-end">
                        <button
                          type="submit"
                          disabled={!deliveryAssessment.eligible}
                          className="w-full py-2 bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] hover:opacity-90 text-white font-extrabold uppercase font-sans tracking-wide text-[10.5px] rounded-xl flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-40"
                        >
                          <CheckCircle className="h-4 w-4" /> Save & Use Pin
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
