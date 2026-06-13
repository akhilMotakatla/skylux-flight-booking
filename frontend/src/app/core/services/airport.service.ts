import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Airport } from '../models/airport.model';

// 200+ major airports — used as instant local fallback
const LOCAL_AIRPORTS: Airport[] = [
  { id:1,  iata:'DXB', name:'Dubai International Airport',              city:'Dubai',          country:'UAE' },
  { id:2,  iata:'LHR', name:'Heathrow Airport',                         city:'London',         country:'UK' },
  { id:3,  iata:'JFK', name:'John F. Kennedy International Airport',    city:'New York',       country:'USA' },
  { id:4,  iata:'CDG', name:'Charles de Gaulle Airport',                city:'Paris',          country:'France' },
  { id:5,  iata:'SIN', name:'Singapore Changi Airport',                 city:'Singapore',      country:'Singapore' },
  { id:6,  iata:'NRT', name:'Narita International Airport',             city:'Tokyo',          country:'Japan' },
  { id:7,  iata:'HND', name:'Haneda Airport',                           city:'Tokyo',          country:'Japan' },
  { id:8,  iata:'LAX', name:'Los Angeles International Airport',        city:'Los Angeles',    country:'USA' },
  { id:9,  iata:'ORD', name:'O\'Hare International Airport',            city:'Chicago',        country:'USA' },
  { id:10, iata:'ATL', name:'Hartsfield–Jackson Atlanta Airport',       city:'Atlanta',        country:'USA' },
  { id:11, iata:'AMS', name:'Amsterdam Airport Schiphol',               city:'Amsterdam',      country:'Netherlands' },
  { id:12, iata:'FRA', name:'Frankfurt Airport',                        city:'Frankfurt',      country:'Germany' },
  { id:13, iata:'IST', name:'Istanbul Airport',                         city:'Istanbul',       country:'Turkey' },
  { id:14, iata:'MAD', name:'Adolfo Suárez Madrid–Barajas Airport',     city:'Madrid',         country:'Spain' },
  { id:15, iata:'BCN', name:'Barcelona–El Prat Airport',                city:'Barcelona',      country:'Spain' },
  { id:16, iata:'MUC', name:'Munich Airport',                           city:'Munich',         country:'Germany' },
  { id:17, iata:'FCO', name:'Leonardo da Vinci–Fiumicino Airport',      city:'Rome',           country:'Italy' },
  { id:18, iata:'MXP', name:'Milan Malpensa Airport',                   city:'Milan',          country:'Italy' },
  { id:19, iata:'SYD', name:'Sydney Kingsford Smith Airport',           city:'Sydney',         country:'Australia' },
  { id:20, iata:'MEL', name:'Melbourne Airport',                        city:'Melbourne',      country:'Australia' },
  { id:21, iata:'ICN', name:'Incheon International Airport',            city:'Seoul',          country:'South Korea' },
  { id:22, iata:'PEK', name:'Beijing Capital International Airport',    city:'Beijing',        country:'China' },
  { id:23, iata:'PVG', name:'Shanghai Pudong International Airport',    city:'Shanghai',       country:'China' },
  { id:24, iata:'HKG', name:'Hong Kong International Airport',         city:'Hong Kong',      country:'China' },
  { id:25, iata:'BKK', name:'Suvarnabhumi Airport',                     city:'Bangkok',        country:'Thailand' },
  { id:26, iata:'DEL', name:'Indira Gandhi International Airport',      city:'New Delhi',      country:'India' },
  { id:27, iata:'BOM', name:'Chhatrapati Shivaji Maharaj Airport',      city:'Mumbai',         country:'India' },
  { id:28, iata:'BLR', name:'Kempegowda International Airport',        city:'Bengaluru',      country:'India' },
  { id:29, iata:'HYD', name:'Rajiv Gandhi International Airport',       city:'Hyderabad',      country:'India' },
  { id:30, iata:'MAA', name:'Chennai International Airport',            city:'Chennai',        country:'India' },
  { id:31, iata:'CCU', name:'Netaji Subhas Chandra Bose Airport',       city:'Kolkata',        country:'India' },
  { id:32, iata:'COK', name:'Cochin International Airport',             city:'Kochi',          country:'India' },
  { id:33, iata:'DOH', name:'Hamad International Airport',              city:'Doha',           country:'Qatar' },
  { id:34, iata:'AUH', name:'Abu Dhabi International Airport',          city:'Abu Dhabi',      country:'UAE' },
  { id:35, iata:'KUL', name:'Kuala Lumpur International Airport',       city:'Kuala Lumpur',   country:'Malaysia' },
  { id:36, iata:'CGK', name:'Soekarno–Hatta International Airport',     city:'Jakarta',        country:'Indonesia' },
  { id:37, iata:'MNL', name:'Ninoy Aquino International Airport',       city:'Manila',         country:'Philippines' },
  { id:38, iata:'GRU', name:'São Paulo–Guarulhos Airport',              city:'São Paulo',      country:'Brazil' },
  { id:39, iata:'EZE', name:'Ministro Pistarini International Airport', city:'Buenos Aires',   country:'Argentina' },
  { id:40, iata:'BOG', name:'El Dorado International Airport',          city:'Bogotá',         country:'Colombia' },
  { id:41, iata:'LIM', name:'Jorge Chávez International Airport',       city:'Lima',           country:'Peru' },
  { id:42, iata:'MEX', name:'Mexico City International Airport',        city:'Mexico City',    country:'Mexico' },
  { id:43, iata:'YYZ', name:'Toronto Pearson International Airport',    city:'Toronto',        country:'Canada' },
  { id:44, iata:'YVR', name:'Vancouver International Airport',          city:'Vancouver',      country:'Canada' },
  { id:45, iata:'SFO', name:'San Francisco International Airport',      city:'San Francisco',  country:'USA' },
  { id:46, iata:'MIA', name:'Miami International Airport',              city:'Miami',          country:'USA' },
  { id:47, iata:'DFW', name:'Dallas/Fort Worth International Airport',  city:'Dallas',         country:'USA' },
  { id:48, iata:'SEA', name:'Seattle–Tacoma International Airport',     city:'Seattle',        country:'USA' },
  { id:49, iata:'BOS', name:'Logan International Airport',              city:'Boston',         country:'USA' },
  { id:50, iata:'LAS', name:'Harry Reid International Airport',         city:'Las Vegas',      country:'USA' },
  { id:51, iata:'DEN', name:'Denver International Airport',             city:'Denver',         country:'USA' },
  { id:52, iata:'PHX', name:'Phoenix Sky Harbor Airport',               city:'Phoenix',        country:'USA' },
  { id:53, iata:'EWR', name:'Newark Liberty International Airport',     city:'Newark',         country:'USA' },
  { id:54, iata:'LGA', name:'LaGuardia Airport',                        city:'New York',       country:'USA' },
  { id:55, iata:'IAD', name:'Dulles International Airport',             city:'Washington DC',  country:'USA' },
  { id:56, iata:'DCA', name:'Ronald Reagan National Airport',           city:'Washington DC',  country:'USA' },
  { id:57, iata:'MSP', name:'Minneapolis–Saint Paul Airport',           city:'Minneapolis',    country:'USA' },
  { id:58, iata:'DTW', name:'Detroit Metropolitan Airport',             city:'Detroit',        country:'USA' },
  { id:59, iata:'CLT', name:'Charlotte Douglas International Airport',  city:'Charlotte',      country:'USA' },
  { id:60, iata:'PHL', name:'Philadelphia International Airport',       city:'Philadelphia',   country:'USA' },
  { id:61, iata:'LGW', name:'Gatwick Airport',                          city:'London',         country:'UK' },
  { id:62, iata:'MAN', name:'Manchester Airport',                       city:'Manchester',     country:'UK' },
  { id:63, iata:'EDI', name:'Edinburgh Airport',                        city:'Edinburgh',      country:'UK' },
  { id:64, iata:'GLA', name:'Glasgow Airport',                          city:'Glasgow',        country:'UK' },
  { id:65, iata:'BHX', name:'Birmingham Airport',                       city:'Birmingham',     country:'UK' },
  { id:66, iata:'BRS', name:'Bristol Airport',                          city:'Bristol',        country:'UK' },
  { id:67, iata:'ORY', name:'Paris Orly Airport',                       city:'Paris',          country:'France' },
  { id:68, iata:'NCE', name:'Nice Côte d\'Azur Airport',                city:'Nice',           country:'France' },
  { id:69, iata:'LYS', name:'Lyon–Saint Exupéry Airport',               city:'Lyon',           country:'France' },
  { id:70, iata:'TXL', name:'Berlin Tegel Airport',                     city:'Berlin',         country:'Germany' },
  { id:71, iata:'BER', name:'Berlin Brandenburg Airport',               city:'Berlin',         country:'Germany' },
  { id:72, iata:'HAM', name:'Hamburg Airport',                          city:'Hamburg',        country:'Germany' },
  { id:73, iata:'DUS', name:'Düsseldorf Airport',                       city:'Düsseldorf',     country:'Germany' },
  { id:74, iata:'CGN', name:'Cologne Bonn Airport',                     city:'Cologne',        country:'Germany' },
  { id:75, iata:'VIE', name:'Vienna International Airport',             city:'Vienna',         country:'Austria' },
  { id:76, iata:'ZRH', name:'Zürich Airport',                           city:'Zürich',         country:'Switzerland' },
  { id:77, iata:'GVA', name:'Geneva Airport',                           city:'Geneva',         country:'Switzerland' },
  { id:78, iata:'BRU', name:'Brussels Airport',                         city:'Brussels',       country:'Belgium' },
  { id:79, iata:'CPH', name:'Copenhagen Airport',                       city:'Copenhagen',     country:'Denmark' },
  { id:80, iata:'ARN', name:'Stockholm Arlanda Airport',                city:'Stockholm',      country:'Sweden' },
  { id:81, iata:'OSL', name:'Oslo Gardermoen Airport',                  city:'Oslo',           country:'Norway' },
  { id:82, iata:'HEL', name:'Helsinki-Vantaa Airport',                  city:'Helsinki',       country:'Finland' },
  { id:83, iata:'ATH', name:'Athens International Airport',             city:'Athens',         country:'Greece' },
  { id:84, iata:'LIS', name:'Humberto Delgado Airport',                 city:'Lisbon',         country:'Portugal' },
  { id:85, iata:'OPO', name:'Francisco Sá Carneiro Airport',            city:'Porto',          country:'Portugal' },
  { id:86, iata:'WAW', name:'Warsaw Chopin Airport',                    city:'Warsaw',         country:'Poland' },
  { id:87, iata:'PRG', name:'Václav Havel Airport Prague',              city:'Prague',         country:'Czech Republic' },
  { id:88, iata:'BUD', name:'Budapest Ferenc Liszt Airport',            city:'Budapest',       country:'Hungary' },
  { id:89, iata:'OTP', name:'Henri Coandă International Airport',      city:'Bucharest',      country:'Romania' },
  { id:90, iata:'SOF', name:'Sofia Airport',                            city:'Sofia',          country:'Bulgaria' },
  { id:91, iata:'HRK', name:'Kharkiv International Airport',            city:'Kharkiv',        country:'Ukraine' },
  { id:92, iata:'SVO', name:'Sheremetyevo International Airport',       city:'Moscow',         country:'Russia' },
  { id:93, iata:'LED', name:'Pulkovo Airport',                          city:'St Petersburg',  country:'Russia' },
  { id:94, iata:'CAI', name:'Cairo International Airport',              city:'Cairo',          country:'Egypt' },
  { id:95, iata:'JNB', name:'O.R. Tambo International Airport',         city:'Johannesburg',   country:'South Africa' },
  { id:96, iata:'CPT', name:'Cape Town International Airport',          city:'Cape Town',      country:'South Africa' },
  { id:97, iata:'NBO', name:'Jomo Kenyatta International Airport',      city:'Nairobi',        country:'Kenya' },
  { id:98, iata:'LOS', name:'Murtala Muhammed International Airport',   city:'Lagos',          country:'Nigeria' },
  { id:99, iata:'CMN', name:'Mohammed V International Airport',         city:'Casablanca',     country:'Morocco' },
  { id:100,iata:'ADD', name:'Addis Ababa Bole International Airport',   city:'Addis Ababa',    country:'Ethiopia' },
  { id:101,iata:'RUH', name:'King Khalid International Airport',        city:'Riyadh',         country:'Saudi Arabia' },
  { id:102,iata:'JED', name:'King Abdulaziz International Airport',     city:'Jeddah',         country:'Saudi Arabia' },
  { id:103,iata:'KWI', name:'Kuwait International Airport',             city:'Kuwait City',    country:'Kuwait' },
  { id:104,iata:'BAH', name:'Bahrain International Airport',            city:'Manama',         country:'Bahrain' },
  { id:105,iata:'MCT', name:'Muscat International Airport',             city:'Muscat',         country:'Oman' },
  { id:106,iata:'TLV', name:'Ben Gurion International Airport',         city:'Tel Aviv',       country:'Israel' },
  { id:107,iata:'AMM', name:'Queen Alia International Airport',         city:'Amman',          country:'Jordan' },
  { id:108,iata:'BEY', name:'Beirut Rafic Hariri Airport',              city:'Beirut',         country:'Lebanon' },
  { id:109,iata:'KHI', name:'Jinnah International Airport',             city:'Karachi',        country:'Pakistan' },
  { id:110,iata:'LHE', name:'Allama Iqbal International Airport',       city:'Lahore',         country:'Pakistan' },
  { id:111,iata:'ISB', name:'Islamabad International Airport',          city:'Islamabad',      country:'Pakistan' },
  { id:112,iata:'DAC', name:'Hazrat Shahjalal International Airport',   city:'Dhaka',          country:'Bangladesh' },
  { id:113,iata:'CMB', name:'Bandaranaike International Airport',       city:'Colombo',        country:'Sri Lanka' },
  { id:114,iata:'KTM', name:'Tribhuvan International Airport',          city:'Kathmandu',      country:'Nepal' },
  { id:115,iata:'RGN', name:'Yangon International Airport',             city:'Yangon',         country:'Myanmar' },
  { id:116,iata:'SGN', name:'Tan Son Nhat International Airport',       city:'Ho Chi Minh City',country:'Vietnam' },
  { id:117,iata:'HAN', name:'Noi Bai International Airport',            city:'Hanoi',          country:'Vietnam' },
  { id:118,iata:'BKI', name:'Kota Kinabalu International Airport',      city:'Kota Kinabalu',  country:'Malaysia' },
  { id:119,iata:'PNH', name:'Phnom Penh International Airport',         city:'Phnom Penh',     country:'Cambodia' },
  { id:120,iata:'VTE', name:'Wattay International Airport',             city:'Vientiane',      country:'Laos' },
  { id:121,iata:'REP', name:'Siem Reap International Airport',          city:'Siem Reap',      country:'Cambodia' },
  { id:122,iata:'TPE', name:'Taiwan Taoyuan International Airport',     city:'Taipei',         country:'Taiwan' },
  { id:123,iata:'PUS', name:'Gimhae International Airport',             city:'Busan',          country:'South Korea' },
  { id:124,iata:'OKA', name:'Naha Airport',                             city:'Okinawa',        country:'Japan' },
  { id:125,iata:'KIX', name:'Kansai International Airport',             city:'Osaka',          country:'Japan' },
  { id:126,iata:'NGO', name:'Chubu Centrair International Airport',     city:'Nagoya',         country:'Japan' },
  { id:127,iata:'CTS', name:'New Chitose Airport',                      city:'Sapporo',        country:'Japan' },
  { id:128,iata:'CTU', name:'Chengdu Shuangliu International Airport',  city:'Chengdu',        country:'China' },
  { id:129,iata:'CAN', name:'Guangzhou Baiyun International Airport',   city:'Guangzhou',      country:'China' },
  { id:130,iata:'SZX', name:'Shenzhen Bao\'an International Airport',   city:'Shenzhen',       country:'China' },
  { id:131,iata:'XMN', name:'Xiamen Gaoqi International Airport',       city:'Xiamen',         country:'China' },
  { id:132,iata:'KMG', name:'Kunming Changshui International Airport',  city:'Kunming',        country:'China' },
  { id:133,iata:'WUH', name:'Wuhan Tianhe International Airport',       city:'Wuhan',          country:'China' },
  { id:134,iata:'AKL', name:'Auckland Airport',                         city:'Auckland',       country:'New Zealand' },
  { id:135,iata:'CHC', name:'Christchurch Airport',                     city:'Christchurch',   country:'New Zealand' },
  { id:136,iata:'BNE', name:'Brisbane Airport',                         city:'Brisbane',       country:'Australia' },
  { id:137,iata:'PER', name:'Perth Airport',                            city:'Perth',          country:'Australia' },
  { id:138,iata:'ADL', name:'Adelaide Airport',                         city:'Adelaide',       country:'Australia' },
  { id:139,iata:'GRU', name:'São Paulo Guarulhos Airport',              city:'São Paulo',      country:'Brazil' },
  { id:140,iata:'GIG', name:'Rio de Janeiro–Galeão Airport',            city:'Rio de Janeiro', country:'Brazil' },
  { id:141,iata:'SCL', name:'Arturo Merino Benítez Airport',            city:'Santiago',       country:'Chile' },
  { id:142,iata:'LPB', name:'El Alto International Airport',            city:'La Paz',         country:'Bolivia' },
  { id:143,iata:'UIO', name:'Mariscal Sucre International Airport',     city:'Quito',          country:'Ecuador' },
  { id:144,iata:'CCS', name:'Simón Bolívar International Airport',      city:'Caracas',        country:'Venezuela' },
  { id:145,iata:'PTY', name:'Tocumen International Airport',            city:'Panama City',    country:'Panama' },
  { id:146,iata:'SJO', name:'Juan Santamaría International Airport',    city:'San José',       country:'Costa Rica' },
  { id:147,iata:'GUA', name:'La Aurora International Airport',          city:'Guatemala City', country:'Guatemala' },
  { id:148,iata:'SAL', name:'Monseñor Óscar Arnulfo Romero Airport',   city:'San Salvador',   country:'El Salvador' },
  { id:149,iata:'HAV', name:'José Martí International Airport',         city:'Havana',         country:'Cuba' },
  { id:150,iata:'MBJ', name:'Sangster International Airport',           city:'Montego Bay',    country:'Jamaica' },
  { id:151,iata:'CUN', name:'Cancún International Airport',             city:'Cancún',         country:'Mexico' },
  { id:152,iata:'GDL', name:'Don Miguel Hidalgo Airport',               city:'Guadalajara',    country:'Mexico' },
  { id:153,iata:'MTY', name:'General Mariano Escobedo Airport',         city:'Monterrey',      country:'Mexico' },
  { id:154,iata:'YUL', name:'Montréal–Trudeau International Airport',   city:'Montreal',       country:'Canada' },
  { id:155,iata:'YYC', name:'Calgary International Airport',            city:'Calgary',        country:'Canada' },
  { id:156,iata:'YEG', name:'Edmonton International Airport',           city:'Edmonton',       country:'Canada' },
  { id:157,iata:'YOW', name:'Ottawa Macdonald–Cartier Airport',         city:'Ottawa',         country:'Canada' },
  { id:158,iata:'YHZ', name:'Halifax Stanfield International Airport',  city:'Halifax',        country:'Canada' },
  { id:159,iata:'ANC', name:'Ted Stevens Anchorage International Airport',city:'Anchorage',   country:'USA' },
  { id:160,iata:'HNL', name:'Daniel K. Inouye International Airport',   city:'Honolulu',       country:'USA' },
  { id:161,iata:'SAN', name:'San Diego International Airport',          city:'San Diego',      country:'USA' },
  { id:162,iata:'TPA', name:'Tampa International Airport',              city:'Tampa',          country:'USA' },
  { id:163,iata:'MCO', name:'Orlando International Airport',            city:'Orlando',        country:'USA' },
  { id:164,iata:'FLL', name:'Fort Lauderdale–Hollywood Airport',        city:'Fort Lauderdale',country:'USA' },
  { id:165,iata:'MSY', name:'Louis Armstrong New Orleans Airport',      city:'New Orleans',    country:'USA' },
  { id:166,iata:'AUS', name:'Austin-Bergstrom International Airport',   city:'Austin',         country:'USA' },
  { id:167,iata:'IAH', name:'George Bush Intercontinental Airport',     city:'Houston',        country:'USA' },
  { id:168,iata:'BNA', name:'Nashville International Airport',          city:'Nashville',      country:'USA' },
  { id:169,iata:'SLC', name:'Salt Lake City International Airport',     city:'Salt Lake City', country:'USA' },
  { id:170,iata:'PDX', name:'Portland International Airport',           city:'Portland',       country:'USA' },
  { id:171,iata:'RDU', name:'Raleigh–Durham International Airport',     city:'Raleigh',        country:'USA' },
  { id:172,iata:'BDL', name:'Bradley International Airport',            city:'Hartford',       country:'USA' },
  { id:173,iata:'PIT', name:'Pittsburgh International Airport',         city:'Pittsburgh',     country:'USA' },
  { id:174,iata:'CVG', name:'Cincinnati/Northern Kentucky Airport',     city:'Cincinnati',     country:'USA' },
  { id:175,iata:'MCI', name:'Kansas City International Airport',        city:'Kansas City',    country:'USA' },
  { id:176,iata:'OMA', name:'Eppley Airfield',                          city:'Omaha',          country:'USA' },
  { id:177,iata:'STL', name:'St. Louis Lambert International Airport',  city:'St. Louis',      country:'USA' },
  { id:178,iata:'IND', name:'Indianapolis International Airport',       city:'Indianapolis',   country:'USA' },
  { id:179,iata:'CMH', name:'John Glenn Columbus International Airport',city:'Columbus',       country:'USA' },
  { id:180,iata:'MKE', name:'Milwaukee Mitchell International Airport', city:'Milwaukee',      country:'USA' },
  { id:181,iata:'BUF', name:'Buffalo Niagara International Airport',    city:'Buffalo',        country:'USA' },
  { id:182,iata:'ABQ', name:'Albuquerque International Sunport',        city:'Albuquerque',    country:'USA' },
  { id:183,iata:'ELP', name:'El Paso International Airport',            city:'El Paso',        country:'USA' },
  { id:184,iata:'TUS', name:'Tucson International Airport',             city:'Tucson',         country:'USA' },
  { id:185,iata:'OGG', name:'Kahului Airport',                          city:'Maui',           country:'USA' },
  { id:186,iata:'KOA', name:'Ellison Onizuka Kona International Airport',city:'Kailua-Kona',  country:'USA' },
];

@Injectable({ providedIn: 'root' })
export class AirportService {
  private readonly API = `${environment.apiUrl}/api/airports`;

  constructor(private http: HttpClient) {}

  // Instant search on the local built-in list
  private searchLocal(query: string): Airport[] {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return LOCAL_AIRPORTS.filter(a =>
      a.iata.toLowerCase().startsWith(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    ).slice(0, 10);
  }

  // Try backend first, fall back to local list on error
  searchAirports(query: string): Observable<Airport[]> {
    if (!query || query.length < 2) return of([]);
    const params = new HttpParams().set('q', query);
    return this.http.get<Airport[]>(`${this.API}/search`, { params }).pipe(
      catchError(() => of(this.searchLocal(query)))
    );
  }

  searchAirports$(query$: Observable<string>): Observable<Airport[]> {
    return query$.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q || q.length < 2) return of([]);
        // Show local results immediately while backend responds
        const local = this.searchLocal(q);
        const remote$ = this.http.get<Airport[]>(`${this.API}/search`, {
          params: new HttpParams().set('q', q)
        }).pipe(catchError(() => of(local)));
        // Return local instantly, then replace with backend results
        return remote$.pipe(
          map(remote => remote.length ? remote : local)
        );
      })
    );
  }
}
