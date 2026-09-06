# DESIGN.md — Mobile Phone Dialer UI Specification

**Project Name**: Echosphere Mobile Dialer  
**Design Reference**: iOS-Inspired Minimalist Mobile Phone Dialer UI  
**Target Device Frame**: iPhone 15 Pro / Dynamic Island Viewport (`393px x 852px`)  
**Description**: Complete UI design system, color palette, typography hierarchy, component breakdown, and interaction specification to build an exact pixel-perfect mobile phone dialer user interface matching the reference design.

---

## 🎨 1. Design Philosophy & Visual Aesthetic

The interface is built around a ultra-clean, minimal, and modern iOS-style mobile dialer aesthetic. It combines a realistic device frame set against a vibrant cyan-to-emerald gradient background with high-contrast typography, soft circular keypads, and intuitive touch feedback.

### Core Visual Pillars
1. **Realistic iPhone Device Canvas**: A rounded smartphone chassis with a subtle metallic bezel, Dynamic Island top notch, and realistic screen ratio (`9:19.5`).
2. **Soft Tactile Keypad Matrix**: 3x4 layout of soft circular buttons (`#F1F5F9`) featuring bold primary digits (`#0F172A`) paired with clean subtext letter labels (`#64748B`).
3. **Vibrant Emerald Accent Focus**: Signature iOS green (`#22C55E` / `#16A34A`) applied to the main Call CTA button, active "Add Number" action link, and the selected Keypad tab badge.
4. **Vibrant Outer Backdrop**: High-energy diagonal background gradient (`from-cyan-300 via-emerald-400 to-teal-500`) providing striking contrast around the device mockup.

---

## 🎨 2. Color Palette & Design Tokens

### Canvas & Surface Elevations
| Token Name | Hex Code | Tailwind Equivalent | UI Application |
| :--- | :--- | :--- | :--- |
| **`bg-outer-gradient`** | `linear-gradient(135deg, #7DD3FC, #34D399, #10B981)` | `from-sky-300 via-emerald-400 to-teal-500` | Outer page backdrop |
| **`bg-phone-screen`** | `#FFFFFF` | `bg-white` | Smartphone screen canvas |
| **`bg-key-default`** | `#F1F5F9` | `bg-slate-100` | Normal state for 3x4 dialpad keys |
| **`bg-key-active`** | `#E2E8F0` | `active:bg-slate-200` | Pressed state for dialpad keys |
| **`border-chassis`** | `#D1D5DB` | `border-slate-300` | Device bezel outer ring |

### Primary Accent Tokens
| Accent Token | Hex Code | Tailwind Class | Purpose / Application |
| :--- | :--- | :--- | :--- |
| **`emerald-call`** | `#22C55E` | `bg-emerald-500` | Primary Call button & active tab badge |
| **`emerald-call-hover`** | `#16A34A` | `hover:bg-emerald-600` | Hover / pressed state for Call button |
| **`emerald-text`** | `#22C55E` | `text-emerald-500` | "Add Number" subtitle link |
| **`text-primary`** | `#0F172A` | `text-slate-900` | Typed phone number & main digit text |
| **`text-secondary`** | `#64748B` | `text-slate-500` | Alphabet labels (ABC, DEF) & inactive icons |
| **`text-muted`** | `#94A3B8` | `text-slate-400` | Status bar elements & subtle icons |

---

## 🔤 3. Typography & Keypad Font Hierarchy

### Font Family
- **Primary Font**: `Outfit` / `Inter` / `-apple-system, BlinkMacSystemFont` (Sans-serif)
- **Monospace Number Font**: `JetBrains Mono` / `SF Pro Display` for clean, un-shifted numeric alignment during fast typing.

### Font Scale Specification
| UI Element | Size | Font Weight | Letter Spacing | Color Token |
| :--- | :--- | :--- | :--- | :--- |
| **Typed Phone Number** | `32px (2rem)` | `700 (Bold)` | `tracking-wide` | `#0F172A` |
| **"Add Number" Link** | `14px (0.875rem)` | `600 (SemiBold)` | `normal` | `#22C55E` |
| **Key Main Digit (1-9, *, #)** | `28px (1.75rem)` | `600 (SemiBold)` | `normal` | `#0F172A` |
| **Key Letter Subtext (ABC, DEF...)** | `10px (0.625rem)` | `700 (Bold)` | `tracking-widest` | `#64748B` |
| **Top Status Bar Time** | `14px (0.875rem)` | `700 (Bold)` | `normal` | `#0F172A` |

---

## 📱 4. Complete Component Breakdown & Layout Structure

The UI layout is structured vertically into 5 modular layers inside the phone screen container:

```
┌──────────────────────────────────────────────┐
│  [9:41]        [ Dynamic Island ]  [📶 📶 🔋] │  <- 1. Top Status Bar
├──────────────────────────────────────────────┤
│                                              │
│               +234 88 549 6549               │  <- 2. Number Display
│                  Add Number                  │     Header
│                                              │
│              [ 1 ]   [ 2 ]   [ 3 ]           │
│                      ABC     DEF             │
│              [ 4 ]   [ 5 ]   [ 6 ]           │  <- 3. 3x4 Dialpad Grid
│              GHI     JKL     MNO             │
│              [ 7 ]   [ 8 ]   [ 9 ]           │
│              PQRS    TUV     WXYZ            │
│              [ * ]   [ 0 ]   [ # ]           │
│                       +                      │
│                                              │
│                     (📞)         [⌫]         │  <- 4. Call Action Bar
│                                              │
├──────────────────────────────────────────────┤
│  [⭐]     [🕒]     [(🟢)]     [👤]     [⚙️]   │  <- 5. Bottom Navigation
└──────────────────────────────────────────────┘
```

---

### Component Details

#### 1. Top Status Bar (`StatusBar.jsx`)
- **Left**: Time indicator (`"9:41"` in bold `#0F172A`).
- **Center**: Dynamic Island pill (`w-28 h-7 bg-black rounded-full`).
- **Right**: Icons for Cellular Signal (4 bars), Wi-Fi, and Battery.

#### 2. Number Display Header (`NumberHeader.jsx`)
- **Phone Number Field**: Displays the formatted active string (e.g., `+234 88 549 6549`).
  - Auto-formats input dynamically (handles international country code prefix `+`).
  - Smooth horizontal scrolling or font size scaling if number exceeds 15 digits.
- **"Add Number" Action**: Clickable button rendered in vibrant green (`#22C55E`), opening a "Create New Contact" modal or prompt.

#### 3. Numeric Keypad 3x4 Grid (`KeypadGrid.jsx`)
3x4 CSS Grid with 12 identical circular key components (`72px x 72px`):

| Key | Primary Digit | Letter Subtext | Action / Character |
| :---: | :---: | :---: | :--- |
| **Row 1** | `1` | *None* | Appends `'1'` |
| | `2` | `ABC` | Appends `'2'` |
| | `3` | `DEF` | Appends `'3'` |
| **Row 2** | `4` | `GHI` | Appends `'4'` |
| | `5` | `JKL` | Appends `'5'` |
| | `6` | `MNO` | Appends `'6'` |
| **Row 3** | `7` | `PQRS` | Appends `'7'` |
| | `8` | `TUV` | Appends `'8'` |
| | `9` | `WXYZ` | Appends `'9'` |
| **Row 4** | `*` | *None* | Appends `'*'` |
| | `0` | `+` | Tap appends `'0'`, Long-press appends `'+'` |
| | `#` | *None* | Appends `'#'` |

- **Key Styling**: `w-18 h-18 sm:w-20 sm:h-20 bg-slate-100 hover:bg-slate-200 active:scale-95 transition rounded-full flex flex-col items-center justify-center cursor-pointer select-none`.

#### 4. Call Action Bar (`CallActionBar.jsx`)
- **Center Call Button**:
  - Dimensions: `72px x 72px` (`w-18 h-18`).
  - Style: `bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white`.
  - Icon: Solid white telephone handset (`lucide-react` `Phone` / `PhoneCall`).
  - Action: Initiates outgoing voice call or triggers WebRTC / Agora audio channel.
- **Right Backspace / Delete Button**:
  - Positioned relative to the Call button on the right side.
  - Icon: Delete key icon (`lucide-react` `Delete` or `Backspace`).
  - Single tap: Deletes last character.
  - Long press: Clears the entire number string.

#### 5. Bottom Navigation Bar (`BottomNavBar.jsx`)
Fixed bottom tab bar containing 5 navigation destinations:

| Position | Tab Name | Icon (`lucide-react`) | State / Appearance |
| :---: | :--- | :--- | :--- |
| **1** | Favorites | `Star` | Outline `#64748B`, hover `#0F172A` |
| **2** | Recents | `Clock` | Outline `#64748B`, hover `#0F172A` |
| **3** | Keypad | `Grid3x3` / `Dialpad` | **ACTIVE**: Solid vibrant green circle (`bg-emerald-500 w-10 h-10 rounded-full text-white shadow-md`) |
| **4** | Contacts | `User` / `Users` | Outline `#64748B`, hover `#0F172A` |
| **5** | Voicemail | `Voicemail` / `Settings` | Outline `#64748B`, hover `#0F172A` |

---

## ⚡ 5. Interactive Behaviors & Micro-Interactions

1. **Dialpad Audio & Haptic Feedback**:
   - Each key press plays a subtle DTMF dual-tone frequency sound effect (`Web Audio API` oscillator) matching standard phone keypad audio frequencies (e.g. Key 1 = 697Hz + 1209Hz).
   - Triggers `navigator.vibrate(15)` on touch devices for realistic haptic feedback.
2. **Key Press Animation**:
   - `transition-transform duration-75 active:scale-90 active:bg-slate-300`.
3. **Long Press '0' for '+'**:
   - Tapping `0` inputs `'0'`. Holding `0` for >500ms replaces `'0'` with `'+'`.
4. **Smart Number Formatting**:
   - Automatically adds spaces after country codes and area codes (e.g., `+234 88 549 6549`).

---

## 🛠️ 6. Implementation Code Blueprint (React + Tailwind CSS)

```jsx
import React, { useState } from 'react';
import { Phone, Delete, Star, Clock, Grid3x3, User, Settings } from 'lucide-react';

const KEYPAD_KEYS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: '' },
  { digit: '0', sub: '+' },
  { digit: '#', sub: '' },
];

export default function PhoneDialerUI() {
  const [phoneNumber, setPhoneNumber] = useState('+234 88 549 6549');

  const handleKeyPress = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-300 via-emerald-400 to-teal-500 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-[380px] h-[800px] bg-white rounded-[50px] shadow-2xl border-[8px] border-slate-200 overflow-hidden flex flex-col relative font-sans">
        
        {/* Status Bar */}
        <div className="pt-3 px-7 flex items-center justify-between text-xs font-bold text-slate-900 z-10">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-slate-900 rounded-sm p-0.5 flex">
              <div className="h-full w-full bg-slate-900 rounded-px"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-between px-6 pt-10 pb-4">
          
          {/* Number Display */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-wide text-slate-900 min-h-[44px]">
              {phoneNumber || ' '}
            </h1>
            {phoneNumber && (
              <button className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition">
                Add Number
              </button>
            )}
          </div>

          {/* 3x4 Keypad Grid */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center max-w-[280px] mx-auto">
            {KEYPAD_KEYS.map(({ digit, sub }) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-95 transition-all flex flex-col items-center justify-center focus:outline-none"
              >
                <span className="text-2xl font-semibold text-slate-900 leading-none">{digit}</span>
                {sub && <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">{sub}</span>}
              </button>
            ))}
          </div>

          {/* Action Call Bar */}
          <div className="relative flex items-center justify-center my-2">
            <button className="w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition">
              <Phone className="w-7 h-7 fill-current" />
            </button>

            {phoneNumber && (
              <button
                onClick={handleDelete}
                className="absolute right-8 p-3 text-slate-400 hover:text-slate-600 active:scale-90 transition"
              >
                <Delete className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-100 py-3 px-6 flex items-center justify-around bg-white">
          <Star className="w-5 h-5 text-slate-400 hover:text-slate-900 cursor-pointer" />
          <Clock className="w-5 h-5 text-slate-400 hover:text-slate-900 cursor-pointer" />
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
            <Grid3x3 className="w-5 h-5" />
          </div>
          <User className="w-5 h-5 text-slate-400 hover:text-slate-900 cursor-pointer" />
          <Settings className="w-5 h-5 text-slate-400 hover:text-slate-900 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
```

---

## 📱 7. Responsive & Platform Compatibility

- **Mobile Viewports (`<640px`)**: Fits 100% full screen without device mockup border if viewed directly on mobile browsers.
- **Desktop / Tablet Viewports (`≥640px`)**: Renders within styled iPhone chassis centered over gradient canvas.
