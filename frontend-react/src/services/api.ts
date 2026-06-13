import axios from 'axios'
import type { Flight, Airport, User } from '../types'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('skylux_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const searchFlights = (params: {
  from: string; to: string; date: string; passengers: number; class: string
}) => API.get<Flight[]>('/flights/search', { params }).then(r => r.data)

export const searchAirports = (query: string): Airport[] => {
  const LOCAL: Airport[] = [
    { id:1,iata:'DXB',name:'Dubai Intl',city:'Dubai',country:'UAE' },
    { id:2,iata:'LHR',name:'Heathrow',city:'London',country:'UK' },
    { id:3,iata:'JFK',name:'John F. Kennedy',city:'New York',country:'USA' },
    { id:4,iata:'CDG',name:'Charles de Gaulle',city:'Paris',country:'France' },
    { id:5,iata:'SIN',name:'Changi',city:'Singapore',country:'Singapore' },
    { id:6,iata:'NRT',name:'Narita',city:'Tokyo',country:'Japan' },
    { id:7,iata:'LAX',name:'Los Angeles Intl',city:'Los Angeles',country:'USA' },
    { id:8,iata:'ORD',name:"O'Hare Intl",city:'Chicago',country:'USA' },
    { id:9,iata:'AMS',name:'Amsterdam Schiphol',city:'Amsterdam',country:'Netherlands' },
    { id:10,iata:'FRA',name:'Frankfurt Intl',city:'Frankfurt',country:'Germany' },
    { id:11,iata:'DOH',name:'Hamad Intl',city:'Doha',country:'Qatar' },
    { id:12,iata:'HKG',name:'Hong Kong Intl',city:'Hong Kong',country:'China' },
    { id:13,iata:'ICN',name:'Incheon Intl',city:'Seoul',country:'South Korea' },
    { id:14,iata:'SYD',name:'Kingsford Smith',city:'Sydney',country:'Australia' },
    { id:15,iata:'ATL',name:'Hartsfield-Jackson',city:'Atlanta',country:'USA' },
    { id:16,iata:'DFW',name:'Dallas/Fort Worth',city:'Dallas',country:'USA' },
    { id:17,iata:'IST',name:'Istanbul Airport',city:'Istanbul',country:'Turkey' },
    { id:18,iata:'MUC',name:'Munich Intl',city:'Munich',country:'Germany' },
    { id:19,iata:'MAD',name:'Barajas',city:'Madrid',country:'Spain' },
    { id:20,iata:'BCN',name:'El Prat',city:'Barcelona',country:'Spain' },
    { id:21,iata:'DEL',name:'Indira Gandhi Intl',city:'New Delhi',country:'India' },
    { id:22,iata:'BOM',name:'Chhatrapati Shivaji',city:'Mumbai',country:'India' },
    { id:23,iata:'KUL',name:'Kuala Lumpur Intl',city:'Kuala Lumpur',country:'Malaysia' },
    { id:24,iata:'BKK',name:'Suvarnabhumi',city:'Bangkok',country:'Thailand' },
    { id:25,iata:'GRU',name:'Guarulhos Intl',city:'São Paulo',country:'Brazil' },
    { id:26,iata:'SFO',name:'San Francisco Intl',city:'San Francisco',country:'USA' },
    { id:27,iata:'MIA',name:'Miami Intl',city:'Miami',country:'USA' },
    { id:28,iata:'YYZ',name:'Toronto Pearson',city:'Toronto',country:'Canada' },
    { id:29,iata:'MEX',name:'Benito Juárez Intl',city:'Mexico City',country:'Mexico' },
    { id:30,iata:'ZRH',name:'Zurich Airport',city:'Zurich',country:'Switzerland' },
    { id:31,iata:'FCO',name:'Fiumicino',city:'Rome',country:'Italy' },
    { id:32,iata:'PEK',name:'Capital Intl',city:'Beijing',country:'China' },
    { id:33,iata:'PVG',name:'Pudong Intl',city:'Shanghai',country:'China' },
    { id:34,iata:'DEN',name:'Denver Intl',city:'Denver',country:'USA' },
    { id:35,iata:'SEA',name:'Seattle-Tacoma',city:'Seattle',country:'USA' },
    { id:36,iata:'LAS',name:'Harry Reid Intl',city:'Las Vegas',country:'USA' },
    { id:37,iata:'AUH',name:'Abu Dhabi Intl',city:'Abu Dhabi',country:'UAE' },
    { id:38,iata:'JNB',name:'OR Tambo Intl',city:'Johannesburg',country:'S. Africa' },
    { id:39,iata:'NBO',name:'Jomo Kenyatta',city:'Nairobi',country:'Kenya' },
    { id:40,iata:'CAI',name:'Cairo Intl',city:'Cairo',country:'Egypt' },
  ]
  const q = query.toLowerCase()
  return LOCAL.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q)
  ).slice(0, 6)
}

export const login = (email: string, password: string) =>
  API.post<User>('/auth/login', { email, password }).then(r => r.data)

export const register = (name: string, email: string, password: string) =>
  API.post<User>('/auth/register', { name, email, password }).then(r => r.data)
