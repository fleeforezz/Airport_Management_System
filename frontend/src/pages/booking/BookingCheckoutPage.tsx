import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import { useBookingDraft } from '../../context/BookingDraftContext';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../hooks/useBookings';
import { formatTime, formatDate } from '../../utils/format';

export const BookingCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    draft, 
    setContactInfo, 
    setSelectedSeats, 
    setBaggagePackage,
    applyCoupon, 
    priceSummary 
  } = useBookingDraft();
  const { createBooking } = useBookings();

  // Form states initialized with auth user info if available
  const [contactName, setContactName] = useState(user?.name || draft.contactName || 'Alex Morgan');
  const [contactEmail, setContactEmail] = useState(user?.email || draft.contactEmail || 'alex.morgan@aeroops.global');
  const [contactPhone, setContactPhone] = useState(user?.phone || draft.contactPhone || '+1 (555) 019-8821');
  const [notes, setNotes] = useState(draft.notes || '');

  // Baggage packages state
  const BAGGAGE_OPTIONS = [
    { id: 'STANDARD', name: 'Standard Allowance', desc: '1× 7kg Cabin + 1× 20kg Checked Included', fee: 0 },
    { id: 'PLUS_10KG', name: 'Extra +10kg Checked', desc: 'Total 30kg Checked Luggage allowance', fee: 25 },
    { id: 'PLUS_20KG', name: 'Extra +20kg Checked', desc: 'Total 40kg Checked Luggage allowance', fee: 45 },
    { id: 'PLUS_30KG', name: 'Extra +30kg Heavy Cargo', desc: 'Total 50kg Checked Luggage allowance', fee: 65 },
    { id: 'SPORTS_EQUIPMENT', name: 'Sports Equipment', desc: 'Golf bag, surfboard, or winter ski gear', fee: 50 },
  ];
  const [selectedBaggage, setSelectedBaggage] = useState<string>(draft.baggagePackage || 'STANDARD');
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [policyError, setPolicyError] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Seat selection state
  const availableSeats = ['12A', '12B', '12C', '14A', '14B', '14C', '15A', '15B', '15C'];
  const [selectedSeatList, setSelectedSeatList] = useState<string[]>(
    draft.selectedSeats.length > 0 ? draft.selectedSeats : ['12A']
  );

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'ZALO_PAY' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'AIRPORT_COUNTER'>('CREDIT_CARD');

  const totalPassengers = draft.adultsCount + draft.childrenCount;

  const handleSelectBaggage = (id: string, fee: number) => {
    setSelectedBaggage(id);
    setBaggagePackage(id, fee);
  };

  const toggleSeat = (seat: string) => {
    if (selectedSeatList.includes(seat)) {
      setSelectedSeatList(selectedSeatList.filter((s) => s !== seat));
    } else {
      if (selectedSeatList.length < totalPassengers) {
        setSelectedSeatList([...selectedSeatList, seat]);
      }
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPolicy) {
      setPolicyError(true);
      return;
    }
    setPolicyError(false);

    setContactInfo({
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      notes,
    });
    setSelectedSeats(selectedSeatList);

    // Create booking record via API with offline fallback
    const newBooking = await createBooking({
      bookingCode: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      tourId: draft.tourId || '1',
      tourTitle: draft.tour?.title || 'Da Nang Coast & Golden Bridge Aviation Tour',
      departureId: draft.departureId || '1',
      departureTime: draft.departure?.departureTime || new Date().toISOString(),
      route: `${draft.departure?.departureAirport || 'SGN'} -> ${draft.departure?.arrivalAirport || 'DAD'}`,
      customerName: contactName,
      customerEmail: contactEmail,
      customerPhone: contactPhone,
      customerZalo: contactPhone,
      adultsCount: draft.adultsCount,
      childrenCount: draft.childrenCount,
      baggagePackage: selectedBaggage,
      baggageFee: priceSummary.baggageFee || 0,
      totalPrice: priceSummary.total,
      discountAmount: priceSummary.discount,
      couponCode: draft.couponCode,
      paymentMethod,
      status: 'PAID',
      passengers: [
        {
          fullName: contactName,
          gender: 'MALE',
          passengerType: 'ADULT',
          selectedSeat: selectedSeatList[0] || '14A',
        },
      ],
      notes,
    });

    navigate(`/booking/success?bookingId=${newBooking.id || newBooking.bookingCode}`);
  };

  const flight = draft.departure;

  return (
    <PageShell
      title="REVIEW PASSENGER MANIFEST & CHECKOUT"
      subtitle="Confirm passenger identity records, designate aircraft seat positions and verify payment clearance"
      badge="STEP_02_CHECKOUT"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Tours', path: '/tours' },
        { label: 'Review & Checkout' },
      ]}
    >
      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Passenger Info, Seat Map, Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* Flight Summary Header Card */}
          {flight && (
            <div className="bg-white border border-[#E5E7EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              <div>
                <div className="text-[10px] text-[#DC2626] font-bold uppercase">
                  SCHEDULED FLIGHT SPECIFICATIONS
                </div>
                <div className="font-bold text-sm text-black">
                  {flight.flightNumber} ({flight.departureAirport} → {flight.arrivalAirport})
                </div>
                <div className="text-xs text-[#4B5563] mt-0.5">
                  Departure: {formatTime(flight.departureTime)} on {formatDate(flight.departureTime)} | Gate: {flight.gate || 'G14'}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase">
                  {flight.aircraftModel || 'Airbus A350'}
                </span>
              </div>
            </div>
          )}

          {/* Passenger & Contact Details */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <h2 className="font-black text-sm uppercase text-black">
                  [ 01 ] PRIMARY CONTACT & PASSENGER MANIFEST
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#4B5563]">MANDATORY ICAO REQUIREMENT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                  FULL NAME (AS IN PASSPORT / CITIZEN ID) *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                  VERIFIED PHONE / SMS ALERT NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                  EMAIL FOR E-TICKET & BOARDING PASS *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                  AIRPORT SPECIAL SERVICE REQUEST (SSR)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Vegetarian meal, wheelchair assistance,..."
                  className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black placeholder-[#9CA3AF]"
                />
              </div>
            </div>
          </div>

          {/* Seat Map Picker Component */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <h2 className="font-black text-sm uppercase text-black">
                  [ 02 ] CABIN SEAT ALLOCATION MATRIX
                </h2>
              </div>
              <span className="font-mono text-[10px] text-black font-bold">
                ASSIGNED: {selectedSeatList.join(', ') || 'None'} ({selectedSeatList.length}/{totalPassengers} passengers)
              </span>
            </div>

            <p className="text-xs text-[#4B5563]">
              Select preferred cabin positions (Window / Aisle / Middle):
            </p>

            <div className="p-4 bg-[#F5F5F5] border border-[#E5E7EB] flex flex-wrap gap-2.5">
              {availableSeats.map((seat) => {
                const isSelected = selectedSeatList.includes(seat);
                return (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    className={`w-14 h-12 flex flex-col items-center justify-center font-mono text-xs font-bold transition-none border ${
                      isSelected
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-white text-black border-[#E5E7EB] hover:border-black'
                    }`}
                  >
                    <span>{seat}</span>
                    <span className="text-[8px] font-normal opacity-80">
                      {seat.endsWith('A') ? 'WINDOW' : seat.endsWith('C') ? 'AISLE' : 'MID'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Baggage Selection Matrix */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <h2 className="font-black text-sm uppercase text-black">
                  [ 03 ] BAGGAGE ALLOWANCE & EXTRA SURCHARGES
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#4B5563]">1× 7KG + 1× 20KG INCLUDED BASE</span>
            </div>

            <p className="text-xs text-[#4B5563]">
              Every ticket includes 7kg cabin baggage and 20kg standard checked luggage. Select additional baggage if required:
            </p>

            <div className="space-y-2.5">
              {BAGGAGE_OPTIONS.map((pkg) => {
                const isSelected = selectedBaggage === pkg.id;
                return (
                  <label
                    key={pkg.id}
                    onClick={() => handleSelectBaggage(pkg.id, pkg.fee)}
                    className={`p-3.5 border cursor-pointer flex items-center justify-between transition-none ${
                      isSelected
                        ? 'border-2 border-black bg-[#F5F5F5]'
                        : 'border-[#E5E7EB] bg-white hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="baggage"
                        checked={isSelected}
                        onChange={() => handleSelectBaggage(pkg.id, pkg.fee)}
                        className="accent-black"
                      />
                      <div>
                        <div className="font-bold text-xs text-black uppercase font-mono">
                          {pkg.name}
                        </div>
                        <div className="text-[10px] text-[#4B5563]">
                          {pkg.desc}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-black">
                      {pkg.fee === 0 ? (
                        <span className="text-[#22C55E]">INCLUDED</span>
                      ) : (
                        <span className="text-[#DC2626]">+${pkg.fee}.00</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cancellation Policy Acknowledgment */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <h2 className="font-black text-sm uppercase text-black">
                  [ 04 ] TOUR CANCELLATION & REFUND POLICY
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#DC2626] font-bold">MANDATORY AGREEMENT</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[10px]">
              <div className="p-2 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[#4B5563]">≥ 15 Days Out</div>
                <div className="font-bold text-[#22C55E] mt-0.5">100% REFUND</div>
              </div>
              <div className="p-2 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[#4B5563]">7 – 14 Days Out</div>
                <div className="font-bold text-black mt-0.5">70% REFUND</div>
              </div>
              <div className="p-2 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[#4B5563]">3 – 6 Days Out</div>
                <div className="font-bold text-[#DC2626] mt-0.5">40% REFUND</div>
              </div>
              <div className="p-2 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[#4B5563]">&lt; 48 Hours Out</div>
                <div className="font-bold text-black mt-0.5">0% REFUND</div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => {
                  setAgreedPolicy(e.target.checked);
                  if (e.target.checked) setPolicyError(false);
                }}
                className="mt-0.5 accent-black w-4 h-4"
              />
              <span className="text-xs text-black leading-relaxed">
                I have reviewed and agree to the <strong>Tour Cancellation Schedule</strong> and acknowledge that aviation seats are released according to Civil Aviation regulations.
              </span>
            </label>
            {policyError && (
              <div className="font-mono text-[10px] text-[#DC2626] font-bold">
                * You must accept the cancellation terms to proceed with booking.
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <h2 className="font-black text-sm uppercase text-black">
                  [ 05 ] PAYMENT SETTLEMENT PROTOCOL
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#22C55E] font-bold">256-BIT SSL ENCRYPTED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 border cursor-pointer flex items-center justify-between transition-none ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-2 border-black bg-[#F5F5F5]'
                    : 'border-[#E5E7EB] bg-white hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="accent-black"
                  />
                  <div>
                    <div className="font-bold text-xs text-black uppercase">
                      CREDIT / DEBIT CARD
                    </div>
                    <div className="font-mono text-[10px] text-[#4B5563]">
                      Visa, MasterCard, American Express
                    </div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[9px] font-bold">
                  CARD
                </span>
              </label>

              <label
                className={`p-3.5 border cursor-pointer flex items-center justify-between transition-none ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-2 border-black bg-[#F5F5F5]'
                    : 'border-[#E5E7EB] bg-white hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    className="accent-black"
                  />
                  <div>
                    <div className="font-bold text-xs text-black uppercase">
                      WIRE TRANSFER / SWIFT
                    </div>
                    <div className="font-mono text-[10px] text-[#4B5563]">
                      Automatic PNR confirmation in 3 seconds
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-[#4B5563]">SWIFT</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Summary & Coupon */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border-2 border-black p-5 sticky top-20 space-y-4">
            {/* Coupon Code Input */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1.5">
                PROMO VOUCHER / CONCESSION:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter SWISS2026 or AERO10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs uppercase text-black"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 bg-black hover:bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-none"
                >
                  APPLY
                </button>
              </div>
              {couponMessage && (
                <div
                  className={`mt-1.5 font-mono text-[10px] ${
                    couponMessage.isError ? 'text-[#DC2626]' : 'text-[#22C55E]'
                  }`}
                >
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Price Breakdown Component */}
            <PriceBreakdown
              basePrice={draft.departure?.price || draft.tour?.price || 320}
              adultsCount={draft.adultsCount}
              childrenCount={draft.childrenCount}
              baggageFee={priceSummary.baggageFee}
              baggagePackage={BAGGAGE_OPTIONS.find((b) => b.id === selectedBaggage)?.name}
              discount={priceSummary.discount}
              couponCode={draft.couponCode}
            />

            {/* Confirm & Pay CTA */}
            <button
              type="submit"
              className="w-full py-3 bg-[#DC2626] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-2 border border-[#DC2626]"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>AUTHORIZE PAYMENT & CONFIRM PNR</span>
            </button>

            <div className="font-mono text-[9px] text-[#4B5563] text-center">
              SUBMITTING AUTHORIZATION CONFIRMS ADHERENCE TO ICAO CARRIAGE CONDITIONS
            </div>
          </div>
        </div>
      </form>
    </PageShell>
  );
};

export default BookingCheckoutPage;
