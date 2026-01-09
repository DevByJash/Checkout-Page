
import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { 
  ChevronLeft, 
  ShoppingCart, 
  ShieldCheck, 
  ChevronRight,
  Home,
  CreditCard,
  CheckCircle2,
  Delete,
  X
} from 'lucide-react';

const html = htm.bind(React.createElement);

const Logo = () => html`
  <div className="flex items-center gap-2 md:gap-3">
    <div className="w-5 h-5 md:w-7 md:h-7 rounded-full border-[3.5px] md:border-[4.5px] border-[#1A1A1A]"></div>
    <span className="font-extrabold text-xl md:text-2xl tracking-tight text-[#1A1A1A]">Coht</span>
  </div>
`;

const App = () => {
  const [paymentMethod, setPaymentMethod] = useState('e-transfer');
  const [step, setStep] = useState('initial');
  const [focusedField, setFocusedField] = useState('cardNumber');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [amount, setAmount] = useState('150.69');
  const [userData, setUserData] = useState({ name: 'Melissa Thornton',
  address: '7812 Pine Ridge Dr, Austin, Texas, United States',
  contact: 'melissa.thornton@example.com, (+1) 512 774 2389'
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [tempAmount, setTempAmount] = useState(amount);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    if (paymentMethod === 'online') {
      const timer = setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod]);

  const handleKeypadPress = (val) => {
    if (val === 'delete') {
      setCardData(prev => ({
        ...prev,
        [focusedField]: prev[focusedField].slice(0, -1)
      }));
      return;
    }

    setCardData(prev => {
      const currentVal = prev[focusedField];
      let newVal = currentVal + val;
      if (focusedField === 'cardNumber' && newVal.length > 16) return prev;
      if (focusedField === 'expiry' && newVal.length > 4) return prev;
      if (focusedField === 'cvc' && newVal.length > 3) return prev;
      return { ...prev, [focusedField]: newVal };
    });
  };

  const formatCardNumber = (num) => num.replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (exp) => exp.length > 2 ? exp.slice(0, 2) + ' / ' + exp.slice(2) : exp;
  const isFormComplete = cardData.cardNumber.length === 16 && cardData.expiry.length === 4 && cardData.cvc.length === 3;

  const handleAction = () => {
    setStep('processing');
    setTimeout(() => {
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (step === 'processing') {
    return html`
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F6F9] px-6 text-center animate-fade-in">
        <div className="w-16 h-16 md:w-24 md:h-24 border-4 md:border-8 border-gray-200 border-t-[#1A1A1A] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Completing your payment</h2>
        <p className="text-gray-500 max-w-xs md:max-w-md text-sm md:text-lg">Please wait while we connect with your bank for the transaction.</p>
      </div>
    `;
  }

  if (step === 'success') {
    return html`
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F6F9] px-6 text-center relative overflow-hidden animate-fade-in">
        <div className="w-20 h-20 md:w-32 md:h-32 bg-[#2EB67D] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#2EB67D]/20 animate-zoom-in">
          <${CheckCircle2} size=${40} className="text-white md:scale-150" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Payment successful!</h2>
        <p className="text-gray-500 mb-10 text-sm md:text-lg">Your transaction has been successfully completed</p>
        <button 
          onClick=${() => setStep('initial')}
          className="max-w-fit bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-semibold text-[15px] transition-all active:scale-95 shadow-md"
>
          Done
        </button>
      </div>
    `;
  }

  return html`
    <div className="min-h-screen w-full flex flex-col bg-[#F4F6F9] animate-fade-in">
      
      <!-- Fixed Header: Scaled for Desktop -->
      <div className="w-full fixed top-0 left-0 z-50 flex justify-center px-4 pt-6 md:pt-8">
        <header className="w-full max-w-3xl bg-white rounded-full px-6 py-3 md:px-10 md:py-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white">
          <button className="p-1.5 md:p-2.5 hover:bg-gray-50 rounded-full transition-colors active:scale-90">
            <${ChevronLeft} size=${22} className="text-gray-800" />
          </button>
          <${Logo} />
          <div className="relative">
            <button className="p-1.5 md:p-2.5 hover:bg-gray-50 rounded-full transition-colors active:scale-90">
              <${ShoppingCart} size=${24} className="text-gray-800" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 bg-[#1A1A1A] text-white text-[8px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">1</span>
          </div>
        </header>
      </div>

      <!-- Hero Amount: Responsive Sizing -->
      <main className="flex-shrink-0 min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${paymentMethod === 'online' ? 'opacity-40 blur-[1px] scale-75' : 'opacity-100 blur-0 scale-100'}">
        <div 
          onClick=${() => { setTempAmount(amount); setIsEditingAmount(true); }}
          className="flex flex-col items-center text-center cursor-pointer active:scale-[0.98] transition-all duration-700"
        >
          <p className="text-gray-400 font-bold mb-1 text-[10px] md:text-[14px] uppercase tracking-widest">Total amount</p>
          <h1 className="text-[72px] md:text-[100px] lg:text-[120px] font-black tracking-tighter text-[#1A1A1A] leading-none mb-4 md:mb-6">$${amount}</h1>
          <div className="flex items-center gap-1.5 text-[#2EB67D] font-bold text-[12px] md:text-[16px] bg-[#E9FBF3] px-3.5 py-1 md:px-6 md:py-2 rounded-full">
            <${ShieldCheck} size=${14} className="md:scale-125" />
            <span>Secure Payment</span>
          </div>
        </div>
      </main>

      <!-- Bottom Sheet: Stretched and Scaled for Desktop -->
      <section className="flex-grow w-full bg-white rounded-t-[48px] md:rounded-t-[64px] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 md:px-12 pt-8 md:pt-14 pb-10 flex flex-col flex-grow">
          
          <!-- Compact Address Section: Responsive sizing -->
          <div className="flex justify-between items-start mb-6 md:mb-10 transition-all duration-500 ${paymentMethod === 'online' ? 'opacity-30' : 'opacity-100'}">
            <div className="space-y-0.5 md:space-y-2">
              <h3 className="text-[17px] md:text-[24px] font-bold text-gray-900">${userData.name}</h3>
              <div className="text-gray-400 text-[13px] md:text-[18px] font-medium leading-tight">
                <p>${userData.address}</p>
                <p className="mt-0.5">${userData.contact}</p>
              </div>
            </div>
            <button 
              onClick=${() => { setTempUserData({ ...userData }); setIsEditingAddress(true); }}
              className="bg-[#F1F3F6] text-gray-800 text-[11px] md:text-[14px] font-black px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 shrink-0"
            >
              Edit
            </button>
          </div>

          <!-- Payment Methods -->
          <div className="mb-4 md:mb-8">
            <h4 className="text-gray-900 font-black mb-3 md:mb-6 text-[14px] md:text-[18px] uppercase tracking-wider">Payment method</h4>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-5 mb-4">
              <button 
                onClick=${() => setPaymentMethod('e-transfer')}
                className="relative h-[88px] md:h-[90px] rounded-[24px] md:rounded-[32px] flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-6 border-[3px] md:border-[4px] transition-all duration-300 active:scale-[0.97] ${paymentMethod === 'e-transfer' ? 'border-[#2EB67D] bg-[#E9FBF3]' : 'border-transparent bg-[#F7F8FA]'}"
              >
                ${paymentMethod === 'e-transfer' && html`
                  <div className="absolute top-2.5 right-2.5 md:right-8 text-[#2EB67D] animate-zoom-in">
                    <${CheckCircle2} size=${18} className="md:scale-125" fill="currentColor" stroke="white" />
                  </div>
                `}
                <div className="${paymentMethod === 'e-transfer' ? 'text-[#2EB67D]' : 'text-gray-400'}">
                  <${Home} size=${24} className="md:scale-125" />
                </div>
                <span className="text-[13px] md:text-[18px] font-black ${paymentMethod === 'e-transfer' ? 'text-[#2EB67D]' : 'text-gray-500'}">e-Transfer</span>
              </button>

              <button 
                onClick=${() => setPaymentMethod('online')}
                className="relative h-[88px] md:h-[90px] rounded-[24px] md:rounded-[32px] flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-6 border-[3px] md:border-[4px] transition-all duration-300 active:scale-[0.97] ${paymentMethod === 'online' ? 'border-[#2EB67D] bg-[#E9FBF3]' : 'border-transparent bg-[#F7F8FA]'}"
              >
                ${paymentMethod === 'online' && html`
                  <div className="absolute top-2.5 right-2.5 md:right-8 text-[#2EB67D] animate-zoom-in">
                    <${CheckCircle2} size=${18} className="md:scale-125" fill="currentColor" stroke="white" />
                  </div>
                `}
                <div className="${paymentMethod === 'online' ? 'text-[#2EB67D]' : 'text-gray-400'}">
                  <${CreditCard} size=${24} className="md:scale-125" />
                </div>
                <span className="text-[13px] md:text-[18px] font-black ${paymentMethod === 'online' ? 'text-[#2EB67D]' : 'text-gray-500'}">OnLine</span>
              </button>
            </div>

            <!-- Card Entry Section -->
            <div className="overflow-hidden transition-all duration-500 ease-in-out ${paymentMethod === 'online' ? 'max-h-[800px] opacity-100 mt-2 md:mt-6' : 'max-h-0 opacity-0 pointer-events-none'}">
              <div className="space-y-4 md:space-y-6 animate-slide-up flex flex-col items-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                  <div onClick=${() => setFocusedField('cardNumber')} className="md:col-span-2 p-3 md:p-5 bg-[#F7F8FA] rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer ${focusedField === 'cardNumber' ? 'border-[#2EB67D] bg-white ring-4 ring-[#2EB67D]/5' : 'border-transparent'}">
                    <div className="text-[8px] md:text-[10px] uppercase font-black text-gray-400 mb-0.5 tracking-widest">Card number</div>
                    <div className="text-gray-900 font-bold text-sm md:text-xl tracking-[0.1em] truncate">${formatCardNumber(cardData.cardNumber) || '0000 0000 0000 0000'}</div>
                  </div>
                  <div onClick=${() => setFocusedField('expiry')} className="p-3 md:p-5 bg-[#F7F8FA] rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer ${focusedField === 'expiry' ? 'border-[#2EB67D] bg-white ring-4 ring-[#2EB67D]/5' : 'border-transparent'}">
                    <div className="text-[8px] md:text-[10px] uppercase font-black text-gray-400 mb-0.5 tracking-widest">MM/YY</div>
                    <div className="text-gray-900 font-bold text-sm md:text-xl">${formatExpiry(cardData.expiry) || 'MM/YY'}</div>
                  </div>
                  <div onClick=${() => setFocusedField('cvc')} className="p-3 md:p-5 bg-[#F7F8FA] rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer ${focusedField === 'cvc' ? 'border-[#2EB67D] bg-white ring-4 ring-[#2EB67D]/5' : 'border-transparent'}">
                    <div className="text-[8px] md:text-[10px] uppercase font-black text-gray-400 mb-0.5 tracking-widest">CVC</div>
                    <div className="text-gray-900 font-bold text-sm md:text-xl">${cardData.cvc || 'CVC'}</div>
                  </div>
                </div>

                <!-- Scaled Keypad -->
                <div className="w-full max-w-sm md:max-w-md grid grid-cols-3 gap-2 md:gap-3 pt-2">
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((key, i) => html`
                    <button
                      key=${i}
                      onClick=${() => key !== '' && handleKeypadPress(key)}
                      className="h-11 md:h-16 rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 ${key === '' ? 'pointer-events-none opacity-0' : 'bg-[#F1F3F6] hover:bg-gray-200'}"
                    >
                      ${key === 'delete' ? html`<${Delete} size=${22} className="text-gray-800" />` : html`
                        <span className="text-[16px] md:text-[22px] font-black text-gray-900 leading-none">${key}</span>
                        ${key !== '' && typeof key === 'number' && key !== 0 && html`
                          <span className="text-[7px] md:text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">${['','','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ'][key]}</span>
                        `}
                      `}
                    </button>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom CTA Button: Scaled and Responsive -->
          <div className="mt-auto pt-4 md:pt-10" ref=${bottomRef}>
            <button 
              onClick=${handleAction}
              disabled=${paymentMethod === 'online' && !isFormComplete}
              className="w-full rounded-[24px] md:rounded-[32px] py-4.5 md:py-6 px-8 flex items-center justify-center relative font-black text-[16px] md:text-[20px] transition-all duration-300 h-[64px] md:h-[84px] active:scale-[0.98] ${paymentMethod === 'online' && !isFormComplete ? 'bg-[#F1F3F6] text-gray-400 cursor-not-allowed' : 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10 hover:bg-black'}"
            >
              <span>${paymentMethod === 'online' ? (isFormComplete ? 'Make Payment' : 'Enter card details') : 'Choose Bank'}</span>
              ${(paymentMethod === 'e-transfer' || (paymentMethod === 'online' && isFormComplete)) && html`
                <div className="absolute right-8 md:right-12 animate-fade-in"><${ChevronRight} size=${24} className="md:scale-125" /></div>
              `}
            </button>
          </div>
        </div>
      </section>

      <!-- Overlay Modals: Centered to stay above keyboard -->
      ${(isEditingAddress || isEditingAmount) && html`
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick=${() => { setIsEditingAddress(false); setIsEditingAmount(false); }}></div>
          <div className="relative w-full max-w-[440px] md:max-w-[550px] bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-2xl animate-zoom-in">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-lg md:text-2xl font-black text-gray-900">${isEditingAddress ? 'Change address' : 'Enter amount'}</h2>
              <button onClick=${() => { setIsEditingAddress(false); setIsEditingAmount(false); }} className="p-2 md:p-3 bg-[#F1F3F6] rounded-full hover:bg-gray-200 transition-colors"><${X} size=${20} className="md:scale-125" /></button>
            </div>
            ${isEditingAddress ? html`
              <div className="space-y-3 md:space-y-5 mb-8 md:mb-12">
                <input type="text" value=${tempUserData.name} onChange=${(e) => setTempUserData({...tempUserData, name: e.target.value})} className="w-full bg-[#F7F8FA] border-none rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 font-bold text-gray-900 md:text-xl focus:ring-2 focus:ring-[#2EB67D]/10" placeholder="Full Name" />
                <input type="text" value=${tempUserData.address} onChange=${(e) => setTempUserData({...tempUserData, address: e.target.value})} className="w-full bg-[#F7F8FA] border-none rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 font-bold text-gray-900 md:text-xl focus:ring-2 focus:ring-[#2EB67D]/10" placeholder="Address" />
                <input type="text" value=${tempUserData.contact} onChange=${(e) => setTempUserData({...tempUserData, contact: e.target.value})} className="w-full bg-[#F7F8FA] border-none rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 font-bold text-gray-900 md:text-xl focus:ring-2 focus:ring-[#2EB67D]/10" placeholder="Contact Info" />
              </div>
            ` : html`
              <div className="mb-10 md:mb-14 text-center">
                <input type="number" autoFocus value=${tempAmount} onChange=${(e) => setTempAmount(e.target.value)} className="w-full bg-[#F7F8FA] border-none rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-[40px] md:text-[60px] font-black text-gray-900 text-center focus:ring-2 focus:ring-[#2EB67D]/10" />
              </div>
            `}
            <button onClick=${() => { if(isEditingAddress) setUserData({...tempUserData}); else if(tempAmount) setAmount(parseFloat(tempAmount).toFixed(2)); setIsEditingAddress(false); setIsEditingAmount(false); }} className="w-full py-5 md:py-7 rounded-2xl md:rounded-3xl font-black text-white bg-[#1A1A1A] md:text-2xl hover:bg-black transition-all active:scale-[0.98]">Save Changes</button>
          </div>
        </div>
      `}
    </div>
  `;
};

export default App;
