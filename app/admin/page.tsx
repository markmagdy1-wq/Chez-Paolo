'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ImagePlus, LockKeyhole, Plus, Save, Trash2, UtensilsCrossed } from 'lucide-react'
import { CustomMenuItem, readCustomMenu, writeCustomMenu } from '@/lib/menu-storage'

const ADMIN_SECRET = 'secret-admin'
const categories = {
  Breakfast: ['Oriental', 'English Breakfast', 'Elegant Egg Toast', 'Healthy Choices', 'Savory Croissant', 'Sweet Croissant'],
  Main: ['Appetizers', 'Soups', 'Salads', 'Pasta', 'Pizza', 'Beef Sandwiches', 'Chicken Sandwiches', 'Sandwiches', 'Tasa', 'Chicken Main Course', 'Beef Main Course'],
  Beverage: ['Hot Drinks', 'Fresh Juice', 'Soft Drinks', 'Smoothie', 'Desserts', 'Wine', 'Beer', 'Spirits', 'ID Edge', 'Cocktails', 'Cocktails (Non-Alcoholic)'],
} as const

type Section = keyof typeof categories

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [secret, setSecret] = useState('')
  const [items, setItems] = useState<CustomMenuItem[]>([])
  const [form, setForm] = useState({ name: '', description: '', price: '', section: 'Main' as Section, category: categories.Main[0], image: '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    setItems(readCustomMenu())
    if (new URLSearchParams(window.location.search).get('key') === ADMIN_SECRET) setUnlocked(true)
  }, [])
  const availableCategories = categories[form.section]
  const grouped = useMemo(() => items.reduce<Record<string, CustomMenuItem[]>>((acc, item) => { (acc[item.section] ??= []).push(item); return acc }, {}), [items])

  function unlock(event: FormEvent) {
    event.preventDefault()
    if (secret.trim() !== ADMIN_SECRET) { setError('That admin key is not correct.'); return }
    setUnlocked(true); setError('')
  }

  function changeSection(section: Section) { setForm((current) => ({ ...current, section, category: categories[section][0] })) }
  function updateImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2_500_000) { setError('Please choose an image smaller than 2.5 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) }))
    reader.readAsDataURL(file)
  }
  function saveItem(event: FormEvent) {
    event.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !form.description.trim() || !price || price < 0 || !form.image) { setError('Add a name, description, price, and photo before saving.'); return }
    const next = [...items, { id: crypto.randomUUID(), name: form.name.trim(), description: form.description.trim(), price, section: form.section, category: form.category, image: form.image }]
    setItems(next); writeCustomMenu(next); setForm((current) => ({ ...current, name: '', description: '', price: '', image: '' })); setError(''); setSaved('Item added to the customer menu.'); window.setTimeout(() => setSaved(''), 2600)
  }
  function removeItem(id: string) { const next = items.filter((item) => item.id !== id); setItems(next); writeCustomMenu(next) }

  if (!unlocked) return <main className="admin-shell"><div className="admin-gate"><div className="admin-mark"><LockKeyhole /></div><p className="eyebrow">Chez Paolo · private area</p><h1>Menu <em>studio.</em></h1><p>Enter the admin key to add dishes and drinks to the customer menu.</p><form onSubmit={unlock}><label htmlFor="admin-secret">Admin key</label><input id="admin-secret" type="password" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Enter secret-admin" autoComplete="off" /><button className="admin-primary" type="submit"><LockKeyhole size={16} /> Open admin</button>{error && <span className="admin-error" role="alert">{error}</span>}</form><a className="back-link" href="/"><ArrowLeft size={15} /> Back to customer menu</a></div></main>

  return <main className="admin-shell"><header className="admin-header"><div><p className="eyebrow"><UtensilsCrossed size={14} /> Chez Paolo · menu studio</p><h1>Add a new <em>favorite.</em></h1><p>New items are saved in this browser and appear in the customer menu.</p></div><a className="back-link" href="/"><ArrowLeft size={15} /> Customer menu</a></header><section className="admin-grid"><form className="admin-form" onSubmit={saveItem}><div className="admin-form-heading"><h2>New item</h2><span>Menu details</span></div><label>Photo<input type="file" accept="image/*" onChange={updateImage} /></label>{form.image && <img className="admin-preview" src={form.image} alt="New menu item preview" />}<label>Item name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Truffle Egg Toast" /></label><label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Tell guests what makes it special" rows={3} /></label><div className="admin-two-col"><label>Price (EGP)<input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="185" /></label><label>Menu<select value={form.section} onChange={(event) => changeSection(event.target.value as Section)}><option>Breakfast</option><option>Main</option><option>Beverage</option></select></label></div><label>Subcategory<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{availableCategories.map((category) => <option key={category}>{category}</option>)}</select></label><button className="admin-primary" type="submit"><Save size={16} /> Save item</button>{error && <span className="admin-error" role="alert">{error}</span>}{saved && <span className="admin-success" role="status">{saved}</span>}</form><div className="admin-list"><div className="admin-form-heading"><h2>Added items</h2><span>{items.length} custom</span></div>{items.length === 0 ? <div className="admin-empty"><ImagePlus size={28} /><p>Your added dishes will appear here.</p></div> : Object.entries(grouped).map(([section, sectionItems]) => <div className="admin-group" key={section}><h3>{section}</h3>{sectionItems.map((item) => <article className="admin-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><small>{item.category} · {item.price.toLocaleString()} EGP</small></div><button type="button" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></article>)}</div>)}</div></section><p className="admin-note">Demo mode: items are stored locally in this browser. For real multi-device admin security, connect a database and server-side authentication.</p></main>
}
