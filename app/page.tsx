'use client'

import { useEffect, useMemo, useState } from 'react'
import { CustomMenuItem, readCustomMenu } from '@/lib/menu-storage'
import { ArrowRight, Check, ChevronDown, Clock3, MessageCircle, Share2, MapPin, Minus, Plus, ShoppingBag, Sparkles, Trash2, Utensils, X } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-Lwfj47f583CffMFQcivsJmxslt8pg5.jpg'

const menu = {
  Breakfast: {
    subtitle: 'A slow, beautiful start to your day',
    categories: ['Oriental', 'English Breakfast', 'Elegant Egg Toast', 'Healthy Choices', 'Savory Croissant', 'Sweet Croissant'],
    items: [
      ['Oriental Morning', 'Foul, falafel, eggs, labneh, olives & warm bread.', 145, 'Oriental', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=900&q=80'],
      ['Paolo English Breakfast', 'Eggs, beef sausage, mushrooms, tomatoes and sourdough.', 220, 'English Breakfast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=80'],
      ['Truffle Egg Toast', 'Soft eggs, whipped ricotta, truffle oil and herbs.', 185, 'Elegant Egg Toast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=80'],
      ['Green Garden Bowl', 'Avocado, poached egg, greens, quinoa and lemon dressing.', 165, 'Healthy Choices', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80'],
      ['Savory Croissant', 'Buttery croissant with turkey, gruyere and béchamel.', 135, 'Savory Croissant', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80'],
      ['Berry Cloud Croissant', 'Warm croissant, vanilla cream, berries and honey.', 125, 'Sweet Croissant', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80'],
    ],
  },
  Main: {
    subtitle: 'From our kitchen, with a little jazz',
    categories: ['Appetizers', 'Soups', 'Salads', 'Pasta', 'Pizza', 'Beef Sandwiches', 'Chicken Sandwiches', 'Sandwiches', 'Tasa', 'Chicken Main Course', 'Beef Main Course'],
    items: [
      ['Burrata & Tomatoes', 'Creamy burrata, heirloom tomatoes, basil oil and sea salt.', 240, 'Appetizers', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=900&q=80'],
      ['Velvet Mushroom Soup', 'Roasted mushrooms, thyme cream and toasted brioche.', 135, 'Soups', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80'],
      ['Paolo Caesar Salad', 'Crisp romaine, parmesan, sourdough crunch and classic dressing.', 165, 'Salads', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=900&q=80'],
      ['Prawn Linguine', 'Silky linguine, prawns, cherry tomato, garlic and chili.', 285, 'Pasta', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80'],
      ['Prosciutto Pizza', 'Thin crust, mozzarella, prosciutto, rocket and parmesan.', 260, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=80'],
      ['Steak Frites', 'Grilled beef fillet, pepper jus, fries and herb butter.', 390, 'Beef Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=80'],
    ],
  },
  Beverage: {
    subtitle: 'Raise a glass, stay a while',
    categories: ['Hot Drinks', 'Fresh Juice', 'Soft Drinks', 'Smoothie', 'Desserts', 'Wine', 'Beer', 'Spirits', 'ID Edge', 'Cocktails', 'Cocktails (Non-Alcoholic)'],
    items: [
      ['Paolo Espresso', 'A short, rich roast with notes of dark chocolate.', 70, 'Hot Drinks', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=900&q=80'],
      ['Mango Basil Cooler', 'Fresh mango, basil, lime and sparkling water.', 110, 'Fresh Juice', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=900&q=80'],
      ['Berry Garden', 'Strawberry, blueberry, yogurt and a touch of honey.', 145, 'Smoothie', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900&q=80'],
      ['Aperol Sunset', 'Aperol, prosecco, orange and a soft citrus finish.', 220, 'Cocktails', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80'],
      ['Chocolate Opera', 'Dark chocolate layers, coffee cream and cocoa nibs.', 155, 'Desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80'],
      ['House Red', 'A smooth Egyptian red with berry and spice notes.', 260, 'Wine', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80'],
    ],
  },
} as const

type Section = keyof typeof menu
type Item = { name: string; description: string; price: number; category: string; image: string; quantity: number }

export default function Page() {
  const [section, setSection] = useState<Section>('Main')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<Item[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [fulfillment, setFulfillment] = useState<'Table service' | 'Pickup' | 'Delivery'>('Table service')
  const [arrival, setArrival] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [customItems, setCustomItems] = useState<CustomMenuItem[]>([])

  useEffect(() => {
    const syncItems = () => setCustomItems(readCustomMenu())
    syncItems()
    window.addEventListener('chez-paolo-menu-updated', syncItems)
    return () => window.removeEventListener('chez-paolo-menu-updated', syncItems)
  }, [])

  const current = menu[section]
  const items = [...current.items.map((item) => ({ name: item[0], description: item[1], price: item[2], category: item[3], image: item[4] })), ...customItems.filter((item) => item.section === section)]
    .filter((item) => category === 'All' || item.category === category)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const currency = (value: number) => `${value.toLocaleString()} EGP`

  function selectSection(next: Section) { setSection(next); setCategory('All') }
  function addItem(raw: { name: string; description: string; price: number; category: string; image: string }) {
    const { name, description, price, category: itemCategory, image } = raw
    setCart((existing) => {
      const found = existing.find((item) => item.name === name)
      if (found) return existing.map((item) => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
      return [...existing, { name, description, price, category: itemCategory, image, quantity: 1 }]
    })
    setToastMessage(`${name} added to your order`)
    window.setTimeout(() => setToastMessage(''), 2800)
  }
  function changeQuantity(name: string, delta: number) {
    setCart((existing) => existing.flatMap((item) => item.name === name ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]))
  }
  function sendOrder() {
    const lines = cart.map((item) => `${item.quantity}x ${item.name} - ${currency(item.price * item.quantity)}`).join('\n')
    const details = fulfillment === 'Delivery' ? 'Delivery requested' : `${fulfillment} — arrival at ${arrival}`
    const message = `Hello Chez Paolo, I would like to place an order:\n\n${lines}\n\nTotal: ${currency(total)}\nService: ${details}`
    window.open(`https://wa.me/201214702221?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setConfirmed(true)
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Chez Paolo home"><img src={logo} alt="Chez Paolo Restaurant and Bar" /></a>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open order, ${totalItems} items`}><ShoppingBag size={18} /><span>Order</span>{totalItems > 0 && <b>{totalItems}</b>}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> Restaurant & Bar · Since 1998</p><h1>Good food.<br /><em>Good mood.</em></h1><p className="hero-text">A warm table, a lively glass, and dishes made to linger over.</p><button className="hero-cta" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>Explore the menu <ArrowRight size={17} /></button></div>
        <div className="hero-orb"><div className="orb-inner"><img src={logo} alt="Chez Paolo logo" /></div><span className="orb-note">Taste the moment</span></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading"><div><p className="eyebrow">Made for every mood</p><h2>Choose your<br /><em>moment.</em></h2></div><div className="open-pill"><span /> Open today <small>9am — 1am</small></div></div>
        <div className="section-tabs" role="tablist" aria-label="Menu sections">{(Object.keys(menu) as Section[]).map((name) => <button key={name} className={section === name ? 'active' : ''} onClick={() => selectSection(name)} role="tab" aria-selected={section === name}>{name} <span>{name === 'Main' ? '06' : name === 'Breakfast' ? '06' : '06'}</span></button>)}</div>
        <p className="section-subtitle">{current.subtitle}</p>
        <div className="category-scroll"><button className={category === 'All' ? 'selected' : ''} onClick={() => setCategory('All')}>All</button>{current.categories.map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="menu-grid">{items.map((item) => <article className="menu-card" key={`${item.category}-${item.name}`}><div className="food-image"><img src={item.image} alt={item.name} loading="lazy" /><span>{item.category}</span></div><div className="food-copy"><div className="food-title"><h3>{item.name}</h3><strong>{currency(item.price)}</strong></div><p>{item.description}</p><button className="add-button" onClick={() => addItem(item)}><Plus size={16} /> Add to order</button></div></article>)}</div>
      </section>

      <footer className="footer"><div><img src={logo} alt="Chez Paolo" /><p>Come for the food.<br />Stay for the feeling.</p></div><div className="footer-links"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Share2 size={17} /> Facebook</a><a href="https://instagram.com" target="_blank" rel="noreferrer"><MessageCircle size={17} /> Instagram</a><a href="https://maps.google.com/?q=Chez+Paolo+Restaurant" target="_blank" rel="noreferrer"><MapPin size={17} /> Location</a><a href="https://wa.me/201214702221" target="_blank" rel="noreferrer"><ShoppingBag size={17} /> WhatsApp</a></div><div className="footer-contact"><h3>Contact</h3><p>Hurghada, El Hadaba, In front of Club 61</p><a href="tel:+201018339684">+201018339684</a></div><small>© 2026 Chez Paolo Restaurant & Bar</small></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="order-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">Your table, your way</p><h2>Your order <span>({totalItems})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close order"><X /></button></div>{cart.length === 0 ? <div className="empty-order"><ShoppingBag size={38} /><p>Your order is still a blank page.</p><button className="hero-cta" onClick={() => setCartOpen(false)}>Browse menu</button></div> : <><div className="order-items">{cart.map((item) => <div className="order-line" key={item.name}><img src={item.image} alt="" /><div className="order-line-copy"><h3>{item.name}</h3><strong>{currency(item.price * item.quantity)}</strong><div className="quantity"><button onClick={() => changeQuantity(item.name, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.name, 1)} aria-label={`Add one ${item.name}`}><Plus size={13} /></button><button className="remove" onClick={() => changeQuantity(item.name, -item.quantity)} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button></div></div></div>)}</div><button className="add-more" onClick={() => setCartOpen(false)}><Plus size={16} /> Add more from the menu</button><div className="service-block"><p className="eyebrow">How should we prepare it?</p><div className="service-options">{(['Table service', 'Pickup', 'Delivery'] as const).map((option) => <button key={option} className={fulfillment === option ? 'chosen' : ''} onClick={() => setFulfillment(option)}><Utensils size={15} />{option}{fulfillment === option && <Check size={15} />}</button>)}</div>{fulfillment !== 'Delivery' && <label className="time-field"><Clock3 size={16} /> <span>Arrival time</span><input type="time" value={arrival} onChange={(e) => setArrival(e.target.value)} required /></label>}{fulfillment === 'Delivery' && <p className="delivery-note">We&apos;ll confirm your delivery address on WhatsApp.</p>}</div><div className="total-row"><span>Total</span><strong>{currency(total)}</strong></div><button className="confirm-button" disabled={fulfillment !== 'Delivery' && !arrival} onClick={sendOrder}>Confirm & send on WhatsApp <ArrowRight size={17} /></button></>}</aside></div>}
      {(toastMessage || confirmed) && <div className="toast" role="status" aria-live="polite"><Check size={17} /> {toastMessage || 'Your order is ready to send on WhatsApp.'}</div>}
    </main>
  )
}
