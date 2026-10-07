/* eslint-disable react/prop-types, no-irregular-whitespace, react/no-unescaped-entities */
import { Component, useEffect, useMemo, useState } from 'react'
import { CalendarDays, CloudSun, Copy, Download, MapPin, Menu, Plus, Receipt, Trash2, Wind, X } from 'lucide-react'
import tripnestBackground from '../assets/tripnest-bg.png'
import tripzyDarkLogo from '../assets/tripzy-dark-mode-logo.png'
import tripzyLightLogo from '../assets/tripzy-light-mode-logo.png'
import coorgImage from '../assets/trip-images/coorg.jpg'
import defaultImage from '../assets/trip-images/default.jpg'
import goaImage from '../assets/trip-images/goa.jpg'
import jaisalmerImage from '../assets/trip-images/jaisalmer.jpg'
import manaliImage from '../assets/trip-images/manali.jpg'
import pondicherryImage from '../assets/trip-images/pondicherry.jpg'
import wayanadImage from '../assets/trip-images/wayanad.jpg'

const STORAGE_KEY = 'tripnest-trips'
const packingDefaults = ['Passport / College ID', 'Phone charger & Power bank', 'Comfortable shoes & sunscreen', 'Sunscreen SPF 50+ & Sunglasses', 'First aid & Motion sickness meds']

const demoTrips = [
  { id: 'coorg-demo', title: 'Weekend in Coorg', destination: 'Coorg, Karnataka', type: 'solo', startDate: '2026-12-12', endDate: '2026-12-14', notes: 'A quiet coffee and nature break.', members: ['Me'], inviteCode: 'COORG26', itinerary: [{ id: 'c1', day: 1, time: '10:00', title: 'Check in and explore Madikeri', notes: 'Start with the local market.' }], expenses: [{ id: 'ce', description: 'Homestay advance', amount: 3200, category: 'Stay', paidBy: 'Me', splitAmong: ['Me'] }], packing: packingDefaults.slice(0, 4).map((item, i) => ({ id: `cp${i}`, item, checked: false })) },
  { id: 'goa-demo', title: 'College Goa Trip', destination: 'North Goa, India', type: 'group', startDate: '2026-11-18', endDate: '2026-11-22', notes: 'Remember to catch the sunrise on Saturday morning at Vagator cliff.', members: ['Me', 'Rahul', 'Priya', 'Alex'], inviteCode: 'K496YS', itinerary: [{ id: 'g1', day: 1, time: '10:30 AM', title: 'Arrive at Dabolim & Check-in at Villa', notes: 'Collect rented scooters near airport gate 2' }, { id: 'g2', day: 1, time: '05:00 PM', title: 'Sunset & Sea Breeze at Anjuna Beach', notes: 'Grab snacks at Curlies' }, { id: 'g3', day: 2, time: '09:00 AM', title: 'Scuba & Watersports at Grand Island', notes: 'Pre-booked boat leaves strictly at 8:30 AM' }], expenses: [{ id: 'ge1', description: 'Beachside Villa 3 Nights', amount: 12000, category: 'Stay', paidBy: 'Rahul', splitAmong: ['Me', 'Rahul', 'Priya', 'Alex'] }, { id: 'ge2', description: 'Seafood Dinner at Thalassa', amount: 4200, category: 'Food', paidBy: 'Me', splitAmong: ['Me', 'Rahul', 'Priya', 'Alex'] }, { id: 'ge3', description: 'Scooter Rentals & Petrol', amount: 2200, category: 'Travel', paidBy: 'Priya', splitAmong: ['Me', 'Rahul', 'Priya', 'Alex'] }], packing: packingDefaults.map((item, i) => ({ id: `gp${i}`, item, checked: i < 3 })) },
  { id: 'manali-demo', title: 'Autumn Trek in Manali', destination: 'Manali, Himachal Pradesh', type: 'solo', startDate: '2026-10-04', endDate: '2026-10-08', notes: 'Pack for changing mountain weather.', members: ['Me'], inviteCode: 'MANALI8', itinerary: [], expenses: [], packing: packingDefaults.map((item, i) => ({ id: `mp${i}`, item, checked: i < 4 })) },
]

const pastTrips = [
  { title: 'Monsoon Retreat in Wayanad', destination: 'Wayanad, Kerala', dates: '14 Jul 2025 – 18 Jul 2025', type: 'SOLO', detail: '5 days · 8 stops · ₹8,450 spent' },
  { title: 'Golden Dunes of Jaisalmer', destination: 'Jaisalmer, Rajasthan', dates: '10 Feb 2025 – 15 Feb 2025', type: 'GROUP', detail: '6 days · 5 friends · ₹32,000 total' },
  { title: 'French Quarters of Pondicherry', destination: 'Puducherry, India', dates: '22 Nov 2024 – 25 Nov 2024', type: 'SOLO', detail: '4 days · 6 stops · ₹6,200 spent' },
]

const destinationImages = {
  goa: goaImage,
  coorg: coorgImage,
  manali: manaliImage,
  wayanad: wayanadImage,
  jaisalmer: jaisalmerImage,
  pondicherry: pondicherryImage,
  puducherry: pondicherryImage,
}

function destinationImage(destination) {
  const key = Object.keys(destinationImages).find((name) => destination.toLowerCase().includes(name))
  return destinationImages[key] || defaultImage
}

const spotGuide = {
  goa: [['Fort Aguada', 'Historic sea fort with sunset views', '₹50'], ['Baga & Anjuna Beach', 'Beach walks, cafés, and nightlife', 'Free'], ['Basilica of Bom Jesus', 'Old Goa heritage landmark', '₹20'], ['Dudhsagar Falls', 'Scenic waterfall day trip', '₹800']],
  coorg: [['Abbey Falls', 'Short rainforest walk to a waterfall', '₹40'], ['Raja’s Seat', 'Sunset viewpoint over the hills', '₹20'], ['Namdroling Monastery', 'Golden temple and peaceful grounds', 'Free'], ['Coffee plantation tour', 'Learn about local coffee and spices', '₹500']],
  manali: [['Solang Valley', 'Mountain views and adventure activities', '₹500'], ['Hadimba Temple', 'Forest temple in Old Manali', 'Free'], ['Mall Road', 'Local shopping and cafés', 'Free'], ['Vashisht Hot Springs', 'Temple village and natural springs', '₹30']],
  default: [['Local viewpoint', 'A scenic place near your destination', 'Free'], ['Heritage market', 'Local food, crafts, and souvenirs', 'Free'], ['Popular landmark', 'A well-known place to start exploring', 'Varies'], ['Nature escape', 'A relaxed outdoor stop nearby', 'Varies']],
}

function destinationSpots(destination) {
  const key = Object.keys(spotGuide).find((name) => destination.toLowerCase().includes(name))
  return spotGuide[key || 'default']
}

function tripDays(trip) {
  return Math.max(1, Math.ceil((new Date(`${trip.endDate}T00:00:00`) - new Date(`${trip.startDate}T00:00:00`)) / 86400000) + 1)
}

function loadTrips() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) && saved.length ? saved : demoTrips } catch { return demoTrips } }
function dateText(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
function daysUntil(value) { return Math.ceil((new Date(`${value}T00:00:00`) - new Date(new Date().toDateString())) / 86400000) }
function past(trip) { return new Date(`${trip.endDate}T23:59:59`) < new Date() }

function Button({ children, onClick, secondary = false, type = 'button' }) { return <button type={type} onClick={onClick} className={`button ${secondary ? 'button-secondary' : ''}`}>{children}</button> }
function Header({ onHome, onCreate, onArchive, archive, darkMode, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className={`topbar ${menuOpen ? 'menu-open' : ''}`}><button className="brand" onClick={() => { closeMenu(); onHome() }}><img src={darkMode ? tripzyDarkLogo : tripzyLightLogo} alt="Tripzy" /></button><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button><nav><button className={!archive ? 'active-nav' : ''} onClick={() => { closeMenu(); onHome() }}>Dashboard</button><button className={archive ? 'active-nav' : ''} onClick={() => { closeMenu(); onArchive() }}>Past trips</button><label className="theme-switch" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}><input className="theme-switch__checkbox" type="checkbox" checked={darkMode} onChange={() => { closeMenu(); onToggleTheme() }} /><span className="theme-switch__container"><span className="theme-switch__circle-container"><span className="theme-switch__sun-moon-container"><span className="theme-switch__moon"><span className="theme-switch__spot" /><span className="theme-switch__spot" /><span className="theme-switch__spot" /></span></span></span><span className="theme-switch__clouds" /><span className="theme-switch__stars-container">✦ ✧</span></span></label><Button onClick={() => { closeMenu(); onCreate() }}><Plus size={16} /> Plan a trip</Button><span className="avatar">K</span></nav></header>
}
function TripCard({ trip, onOpen }) {
  const days = daysUntil(trip.startDate)
  return <button className={`trip-card ${trip.type}`} onClick={() => onOpen(trip.id)}><div className="card-image" style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, #07140dcc), url('${destinationImage(trip.destination)}')` }}><span className="badge">{trip.type === 'group' ? 'GROUP TRIP' : 'SOLO TRIP'}</span><span className="date-badge">◷ {days > 0 ? `${days} days to go` : 'In progress'}</span></div><div className="trip-card-body"><div className="card-heading"><h3>{trip.title}</h3><span className="circle-arrow">→</span></div><p className="meta"><MapPin size={13} /> {trip.destination}</p><p className="meta"><CalendarDays size={13} /> {dateText(trip.startDate)} – {dateText(trip.endDate)}</p><div className="card-strip">{trip.type === 'group' ? `◉ ${trip.members.length} members · Join code ${trip.inviteCode}` : '☷ 4 stays bookmarked · Private'}</div><span className="card-cta">{trip.type === 'group' ? 'Open Group Hub' : 'View Journal & Itinerary'}</span></div></button>
}
function EmptyState({ onCreate }) { return <section className="empty-state"><div className="empty-icon">♧</div><h2>Your next story starts here</h2><p>Create a trip and keep plans, expenses, and packing in one simple place.</p><Button onClick={onCreate}><Plus size={16} /> Create your first trip</Button><small>✓ Split bill calculator　·　✓ Smart packing bins　·　✓ Offline map pins</small></section> }
function weatherDescription(code) {
  if (code === 0) return 'Clear sky'
  if ([1, 2, 3].includes(code)) return 'Partly cloudy'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light drizzle'
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain showers'
  if ([71, 73, 75, 77].includes(code)) return 'Snow showers'
  if ([80, 81, 82].includes(code)) return 'Rain showers'
  if ([95, 96, 99].includes(code)) return 'Thunderstorms'
  return 'Current conditions'
}
const weatherLocations = {
  coorg: { name: 'Coorg', country: 'India', latitude: 12.4244, longitude: 75.7382 },
  goa: { name: 'Goa', country: 'India', latitude: 15.2993, longitude: 74.124 },
  manali: { name: 'Manali', country: 'India', latitude: 32.2396, longitude: 77.1887 },
  wayanad: { name: 'Wayanad', country: 'India', latitude: 11.6854, longitude: 76.132 },
  jaisalmer: { name: 'Jaisalmer', country: 'India', latitude: 26.9157, longitude: 70.9083 },
  pondicherry: { name: 'Puducherry', country: 'India', latitude: 11.9416, longitude: 79.8083 },
  puducherry: { name: 'Puducherry', country: 'India', latitude: 11.9416, longitude: 79.8083 },
}
function knownWeatherLocation(destination) {
  const key = Object.keys(weatherLocations).find((name) => destination.toLowerCase().includes(name))
  return weatherLocations[key]
}
async function findWeatherLocation(destination, signal) {
  const queries = [...new Set([destination.trim(), destination.split(',')[0].trim()].filter(Boolean))]
  for (const query of queries) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json&countryCode=IN`, { signal })
    if (!response.ok) continue
    const data = await response.json()
    const indianResult = data.results?.find((result) => result.country_code === 'IN')
    if (indianResult) return indianResult
    if (data.results?.[0]) return data.results[0]
  }
  return null
}
function WeatherCard({ destination }) {
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    const controller = new AbortController()
    async function loadWeather() {
      try {
        setStatus('loading')
        const location = knownWeatherLocation(destination) || await findWeatherLocation(destination, controller.signal)
        if (!location) throw new Error('Could not find this destination')
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`, { signal: controller.signal })
        if (!weatherResponse.ok) throw new Error('Weather service unavailable')
        const weatherData = await weatherResponse.json()
        if (!weatherData.current) throw new Error('Weather data unavailable')
        setWeather({ ...weatherData.current, place: location.name, country: location.country })
        setStatus('ready')
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('error')
      }
    }
    loadWeather()
    return () => controller.abort()
  }, [destination])
  return <section className="weather-card" aria-live="polite"><div className="weather-heading"><div><p className="eyebrow">LIVE DESTINATION WEATHER</p><h2><CloudSun size={21} /> {destination}</h2></div><span className="weather-source">Open-Meteo API</span></div>{status === 'loading' && <p className="weather-message">Checking the latest conditions...</p>}{status === 'error' && <p className="weather-message">Weather is temporarily unavailable. You can still use the rest of Tripzy normally.</p>}{status === 'ready' && <div className="weather-content"><div className="weather-temperature"><strong>{Math.round(weather.temperature_2m)}°C</strong><span>{weatherDescription(weather.weather_code)}</span></div><div className="weather-stat"><CloudSun size={17} /><span>Humidity<strong>{weather.relative_humidity_2m}%</strong></span></div><div className="weather-stat"><Wind size={17} /><span>Wind<strong>{Math.round(weather.wind_speed_10m)} km/h</strong></span></div></div>}</section>
}
function Dashboard({ trips, onOpen, onCreate, onArchive }) {
  const upcoming = trips.filter((trip) => !past(trip))
  return <main className="page dashboard"><section className="hero" style={{ backgroundImage: `linear-gradient(90deg, #0a2019b8, #0a201966), url('${tripnestBackground}')` }}><span className="hero-status">● LIVE TRAVEL DESK · COORG PASS</span><span className="hero-location">◉ 12° 25' N · 75° 44' E</span><div className="hero-content"><span className="hero-chip">◎ CURATE · EXPLORE · SAFEGUARD</span><h1>Make room for <em>adventure.</em></h1><p>Plan thoughtfully, travel lightly, and enjoy every stop along the way. Curate itineraries, track split expenses, and safeguard memories in one tranquil notebook.</p><Button onClick={onCreate}>✈ Plan your next trip　→</Button><div className="hero-pills"><span>✣ 3 Active Journeys</span><span>♧ 1 Shared Crew</span><span>⌁ Coorg Pass Viewpoint</span></div></div></section>{upcoming.length > 0 && <WeatherCard destination={upcoming[0].destination} />}<div className="section-heading"><div><h2>Upcoming trips <small>3 active journeys</small></h2><p className="muted">Your confirmed and collaborative itineraries.</p></div><Button onClick={onCreate}><Plus size={16} /> New trip</Button></div>{upcoming.length ? <div className="trip-grid">{upcoming.map((trip) => <TripCard key={trip.id} trip={trip} onOpen={onOpen} />)}</div> : <EmptyState onCreate={onCreate} />}<div className="archive-prompt">⌁ Looking for completed expeditions and archival scrapbooks? <button onClick={onArchive}>View your past trips →</button></div></main>
}
function CreateTrip({ onCancel, onSave }) {
  const [form, setForm] = useState({ title: '', destination: '', type: 'solo', startDate: '', endDate: '', notes: '' }); const update = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const submit = (event) => { event.preventDefault(); if (!form.title || !form.destination || !form.startDate || !form.endDate) return; onSave({ ...form, id: crypto.randomUUID(), members: ['Me'], inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(), itinerary: [], expenses: [], packing: packingDefaults.map((item) => ({ id: crypto.randomUUID(), item, checked: false })) }) }
  return <main className="page narrow"><button className="back-link" onClick={onCancel}>← Back to dashboard</button><div className="form-intro"><p className="eyebrow">● NEW ADVENTURE</p><h1>Plan a trip</h1><p className="lead">Start with the basics. You can curate places, split budgets, and invite co-travelers right after.</p></div><form className="form-card" onSubmit={submit}><label>Trip Name<input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Monsoon in Munnar" required /></label><label>Destination<input value={form.destination} onChange={(e) => update('destination', e.target.value)} placeholder="⌖ City, region, or country (e.g. Munnar, Kerala)" required /></label><div className="form-row"><label>Start Date<input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required /></label><label>End Date<input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} required /></label></div><label>Trip Style<div className="choice-row">{['solo', 'group'].map((type) => <button type="button" key={type} className={`choice ${form.type === type ? 'selected' : ''}`} onClick={() => update('type', type)}><span className="choice-icon">{type === 'solo' ? '♙' : '♧'}</span><strong>{type === 'solo' ? 'Solo trip' : 'Group trip'}</strong><small>{type === 'solo' ? 'Personal itinerary, peaceful pace, and private expense ledger.' : 'Collaborative plans, auto-split bills, and live sync with friends.'}</small>{form.type === type && <b>●</b>}</button>)}</div></label><label>Trip Notes & Intent <small className="optional">Optional</small><textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="What memories, tastes, or feelings do you want to chase on this journey?" rows="4" /></label><div className="tip">♧ You can create packing checklists, pin regional coffee spots, and draft day-by-day itineraries right after creating.</div><div className="form-actions"><Button secondary onClick={onCancel}>Cancel</Button><Button type="submit"><Plus size={16} /> Create trip</Button></div></form></main>
}
function Detail({ trip, onBack, onUpdate, onDelete }) {
  const [activity, setActivity] = useState({ title: '', time: '', day: 1 }); const [expense, setExpense] = useState({ description: '', amount: '', category: 'Food' }); const [item, setItem] = useState(''); const patch = (changes) => onUpdate({ ...trip, ...changes }); const total = trip.expenses.reduce((sum, entry) => sum + Number(entry.amount), 0)
  const spots = destinationSpots(trip.destination)
  const travelers = Math.max(1, trip.members.length)
  const dailyEstimate = trip.type === 'group' ? 2200 : 2800
  const estimatedCost = tripDays(trip) * travelers * dailyEstimate
  const remainingBudget = Math.max(0, estimatedCost - total)
  const balances = useMemo(() => trip.members.reduce((out, member) => { out[member] = trip.expenses.reduce((sum, entry) => sum + (entry.paidBy === member ? Number(entry.amount) : 0) - (entry.splitAmong.includes(member) ? Number(entry.amount) / entry.splitAmong.length : 0), 0); return out }, {}), [trip])
  const addActivity = (e) => { e.preventDefault(); if (!activity.title) return; patch({ itinerary: [...trip.itinerary, { ...activity, id: crypto.randomUUID(), day: Number(activity.day) }] }); setActivity({ title: '', time: '', day: 1 }) }
  const addExpense = (e) => { e.preventDefault(); if (!expense.description || !expense.amount) return; patch({ expenses: [...trip.expenses, { ...expense, id: crypto.randomUUID(), amount: Number(expense.amount), paidBy: trip.members[0], splitAmong: trip.members }] }); setExpense({ description: '', amount: '', category: 'Food' }) }
  const addItem = (e) => { e.preventDefault(); if (!item) return; patch({ packing: [...trip.packing, { id: crypto.randomUUID(), item, checked: false }] }); setItem('') }
  return <main className="page detail-page"><div className="detail-top"><button className="back-link" onClick={onBack}>← All trips</button><span className="sync">WORKSPACE SYNC: LIVE</span></div><section className="trip-summary"><div><div className="summary-badges"><span className="badge">{trip.type === 'group' ? '♧ GROUP TRIP' : '♙ SOLO TRIP'}</span><span className="green-pill">◷ {daysUntil(trip.startDate)} DAYS TO GO</span><span className="green-pill">♧ {trip.members.length} COLLABORATORS</span></div><h1>{trip.title}</h1><p className="meta"><MapPin size={14} /> {trip.destination}　·　<CalendarDays size={14} /> {dateText(trip.startDate)} – {dateText(trip.endDate)}　·　☼ 29°C · Warm & Coastal Breeze</p></div><div className="detail-actions"><Button secondary onClick={() => navigator.clipboard?.writeText(trip.inviteCode)}><Copy size={15} /> Invite {trip.inviteCode}</Button><button className="icon-button danger" onClick={() => onDelete(trip.id)}><Trash2 size={16} /></button></div></section><div className="detail-grid"><section className="panel itinerary-panel"><div className="panel-title"><h2>Itinerary <small>{trip.itinerary.length} stops planned</small></h2><span className="green-pill">♧ Chronological</span></div><form className="add-box" onSubmit={addActivity}><strong>⊕ Add to Schedule</strong><input placeholder="Add an activity (e.g. Sunset at Chapora Fort)" value={activity.title} onChange={(e) => setActivity({ ...activity, title: e.target.value })} /><div><input placeholder="◷ 05:30 PM" value={activity.time} onChange={(e) => setActivity({ ...activity, time: e.target.value })} /><input type="number" min="1" placeholder="Day 1" value={activity.day} onChange={(e) => setActivity({ ...activity, day: e.target.value })} /><Button type="submit">+ Add stop</Button></div></form><div className="timeline">{[...trip.itinerary].sort((a, b) => a.day - b.day).map((entry) => <div className="timeline-item" key={entry.id}><span className="timeline-dot" /><div><small>DAY {entry.day} · {entry.time || 'ANY TIME'} <i>Adventure</i></small><strong>{entry.title}</strong><p>{entry.notes || 'A new memory waiting to happen.'}</p></div><button onClick={() => patch({ itinerary: trip.itinerary.filter((item) => item.id !== entry.id) })}>×</button></div>)}</div>{!trip.itinerary.length && <p className="empty-copy">No plans yet. Add your first activity above.</p>}</section><div className="side-stack"><section className="panel"><div className="panel-title"><div><small>TRIP LEDGER</small><h2>Expenses</h2></div><div className="total">₹{total.toLocaleString('en-IN')}<small>Total Group Spend</small></div></div><form className="add-box expense-box" onSubmit={addExpense}><strong>▣ Record Expense</strong><input placeholder="Expense description (e.g. Villa advance)" value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })} /><div><input type="number" placeholder="₹ Amount" value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} /><select value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })}><option>Food</option><option>Travel</option><option>Stay</option><option>Other</option></select></div><Button type="submit">+ Add expense</Button></form>{trip.expenses.map((entry) => <div className="expense-row" key={entry.id}><Receipt size={16} /><div><strong>{entry.description}</strong><small>{entry.category} · Paid by {entry.paidBy}</small></div><b>₹{Number(entry.amount).toLocaleString('en-IN')}</b></div>)}</section>{trip.type === 'group' && <section className="panel balance-panel"><div className="panel-title"><div><h2>Balances & Settlement</h2><small>Split equally among {trip.members.length} members</small></div>◉</div>{Object.entries(balances).map(([member, balance]) => <div className="balance-row" key={member}><span className="member">{member[0]}</span><div><strong>{member}</strong><small>{balance >= 0 ? 'is owed money' : 'owes Rahul'}</small></div><b className={balance >= 0 ? 'positive' : 'negative'}>{balance >= 0 ? '+' : '−'}₹{Math.abs(balance).toFixed(2)}</b></div>)}<small>⟳ All debts can be settled directly via UPI.</small></section>}</div><section className="panel packing-panel"><div className="panel-title"><h2>Packing list <small>{trip.packing.filter((entry) => entry.checked).length}/{trip.packing.length} packed</small></h2><span className="progress"><i style={{ width: `${(trip.packing.filter((entry) => entry.checked).length / Math.max(trip.packing.length, 1)) * 100}%` }} /></span></div><form className="inline-form" onSubmit={addItem}><input placeholder="Add custom item..." value={item} onChange={(e) => setItem(e.target.value)} /><Button type="submit">+ Add</Button></form>{trip.packing.map((entry) => <label className={`packing-item ${entry.checked ? 'checked' : ''}`} key={entry.id}><input type="checkbox" checked={entry.checked} onChange={() => patch({ packing: trip.packing.map((item) => item.id === entry.id ? { ...item, checked: !item.checked } : item) })} /><span>{entry.item}</span></label>)}  </section><section className="panel spots-panel"><div className="panel-title"><div><small>EXPLORE {trip.destination.toUpperCase()}</small><h2>Famous spots nearby</h2></div><span className="green-pill">✦ Curated guide</span></div><p className="muted">Start with these popular places while building your itinerary.</p><div className="spot-grid">{spots.map(([name, description, price]) => <article className="spot-card" key={name}><div className="spot-icon">⌖</div><div><strong>{name}</strong><p>{description}</p></div><span>{price}</span></article>)}</div></section><section className="panel budget-panel"><div className="panel-title"><div><small>SMART TRIP PLANNER</small><h2>Estimated trip cost</h2></div><span className="green-pill">₹ Per person</span></div><div className="budget-total">₹{estimatedCost.toLocaleString('en-IN')}<small>Approx. {tripDays(trip)} days · {travelers} {travelers === 1 ? 'traveller' : 'travellers'}</small></div><div className="budget-bars"><div><span>Stay & food</span><b>₹{Math.round(estimatedCost * .55).toLocaleString('en-IN')}</b></div><div><span>Local travel</span><b>₹{Math.round(estimatedCost * .25).toLocaleString('en-IN')}</b></div><div><span>Activities & buffer</span><b>₹{Math.round(estimatedCost * .2).toLocaleString('en-IN')}</b></div></div><div className="budget-summary"><span>Recorded so far <b>₹{total.toLocaleString('en-IN')}</b></span><span>Remaining estimate <b>₹{remainingBudget.toLocaleString('en-IN')}</b></span></div><small className="budget-note">This is a basic planning estimate, not a booking price. Add expenses above to keep it up to date.</small></section></div><p className="journal-note">“{trip.notes || 'Remember to make space for the moments you did not plan.'}”<small>PRIVATE GROUP NOTE · EDITED JUST NOW</small></p></main>
}
function Archive({ onBack }) { return <main className="page archive-page"><button className="back-link" onClick={onBack}>← Back to upcoming trips</button><div className="archive-heading"><div><p className="eyebrow">YOUR TRAVEL ARCHIVE</p><h1>Your travel archive</h1><p className="lead">Look back at the journeys you've taken, stories lived, and memories logged across roads less traveled.</p></div><span className="green-pill">◫ 3,420 km logged · 3 expeditions</span></div><div className="section-heading"><h2>Completed journeys <small>4 trips archived</small></h2><div className="filters"><span>All past trips</span><span>Solo</span><span>Group</span><span>2025 – 2026</span></div></div><div className="archive-grid">{pastTrips.map((trip) => <article className="archive-card" key={trip.title}><div className="archive-image" style={{ backgroundImage: `linear-gradient(180deg, transparent, #102019c9), url('${destinationImage(trip.destination)}')` }}><span className="badge">● COMPLETED · {trip.type}</span><small>⌖ {trip.destination}</small></div><div><small>{trip.dates}</small><h3>{trip.title}</h3><p>Soaked through garden hills, misty jungle roads, and quiet morning sketches along the way...</p><span className="green-pill">{trip.detail}</span></div></article>)}</div><div className="archive-bottom"><section><small>NOTEBOOK KEEPSAKE</small><h3>“A journey of a thousand miles begins with a single step.”</h3><p>Revisit past itineraries whenever you need travel inspiration.</p></section><section><h3>◉ Archive portability</h3><p>Export all expense logs, receipts, and timeline notes to CSV or printable travel logs.</p><Button secondary><Download size={15} /> Export All Past Records</Button></section></div></main> }
class Footer extends Component { render() { return <footer><b>Tripzy</b> — Solo & Group Travel Organizer <span>♙ Local-first storage & offline ready</span> </footer> } }

export default function App() {
  const [trips, setTrips] = useState(loadTrips); const [view, setView] = useState('dashboard'); const [selectedId, setSelectedId] = useState(null); const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tripzy-theme') === 'night'); const selected = trips.find((trip) => trip.id === selectedId)
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)), [trips])
  useEffect(() => { document.documentElement.dataset.theme = darkMode ? 'night' : 'day'; localStorage.setItem('tripzy-theme', darkMode ? 'night' : 'day') }, [darkMode])
  useEffect(() => { if (view === 'detail') window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [view, selectedId])
  const save = (trip) => { setTrips((old) => [trip, ...old]); setSelectedId(trip.id); setView('detail') }; const update = (trip) => setTrips((old) => old.map((entry) => entry.id === trip.id ? trip : entry)); const remove = (id) => { if (window.confirm('Delete this trip?')) { setTrips((old) => old.filter((trip) => trip.id !== id)); setView('dashboard') } }
  return <div className="app-shell"><Header darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} archive={view === 'archive'} onHome={() => setView('dashboard')} onCreate={() => setView('create')} onArchive={() => setView('archive')} />{view === 'dashboard' && <Dashboard trips={trips} onOpen={(id) => { setSelectedId(id); setView('detail') }} onCreate={() => setView('create')} onArchive={() => setView('archive')} />}{view === 'create' && <CreateTrip onCancel={() => setView('dashboard')} onSave={save} />}{view === 'detail' && selected && <Detail trip={selected} onBack={() => setView('dashboard')} onUpdate={update} onDelete={remove} />}{view === 'archive' && <Archive onBack={() => setView('dashboard')} />}<Footer /></div>
}
