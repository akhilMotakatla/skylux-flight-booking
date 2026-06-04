using FlightBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.API.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Airports.Any()) return;

        // ─── AIRPORTS ─────────────────────────────────────────────────────────
        var airports = new List<Airport>
        {
            // ── NORTH AMERICA – USA ──────────────────────────────────────────
            new(){IATA="JFK",Name="John F. Kennedy Intl",City="New York",Country="United States",Latitude=40.6413,Longitude=-73.7781},
            new(){IATA="EWR",Name="Newark Liberty Intl",City="New York",Country="United States",Latitude=40.6895,Longitude=-74.1745},
            new(){IATA="LAX",Name="Los Angeles Intl",City="Los Angeles",Country="United States",Latitude=33.9425,Longitude=-118.4081},
            new(){IATA="ORD",Name="O'Hare Intl",City="Chicago",Country="United States",Latitude=41.9742,Longitude=-87.9073},
            new(){IATA="ATL",Name="Hartsfield-Jackson Atlanta Intl",City="Atlanta",Country="United States",Latitude=33.6407,Longitude=-84.4277},
            new(){IATA="DFW",Name="Dallas/Fort Worth Intl",City="Dallas",Country="United States",Latitude=32.8998,Longitude=-97.0403},
            new(){IATA="DEN",Name="Denver Intl",City="Denver",Country="United States",Latitude=39.8561,Longitude=-104.6737},
            new(){IATA="SFO",Name="San Francisco Intl",City="San Francisco",Country="United States",Latitude=37.6213,Longitude=-122.3790},
            new(){IATA="SEA",Name="Seattle-Tacoma Intl",City="Seattle",Country="United States",Latitude=47.4502,Longitude=-122.3088},
            new(){IATA="MIA",Name="Miami Intl",City="Miami",Country="United States",Latitude=25.7959,Longitude=-80.2870},
            new(){IATA="BOS",Name="Logan Intl",City="Boston",Country="United States",Latitude=42.3656,Longitude=-71.0096},
            new(){IATA="PHX",Name="Phoenix Sky Harbor Intl",City="Phoenix",Country="United States",Latitude=33.4373,Longitude=-112.0078},
            new(){IATA="IAH",Name="George Bush Intercontinental",City="Houston",Country="United States",Latitude=29.9902,Longitude=-95.3368},
            new(){IATA="MCO",Name="Orlando Intl",City="Orlando",Country="United States",Latitude=28.4294,Longitude=-81.3089},
            new(){IATA="LAS",Name="Harry Reid Intl",City="Las Vegas",Country="United States",Latitude=36.0840,Longitude=-115.1537},
            new(){IATA="CLT",Name="Charlotte Douglas Intl",City="Charlotte",Country="United States",Latitude=35.2140,Longitude=-80.9431},
            new(){IATA="DTW",Name="Detroit Metropolitan",City="Detroit",Country="United States",Latitude=42.2162,Longitude=-83.3554},
            new(){IATA="MSP",Name="Minneapolis-Saint Paul Intl",City="Minneapolis",Country="United States",Latitude=44.8820,Longitude=-93.2218},
            new(){IATA="PHL",Name="Philadelphia Intl",City="Philadelphia",Country="United States",Latitude=39.8721,Longitude=-75.2411},
            new(){IATA="SLC",Name="Salt Lake City Intl",City="Salt Lake City",Country="United States",Latitude=40.7884,Longitude=-111.9778},
            new(){IATA="PDX",Name="Portland Intl",City="Portland",Country="United States",Latitude=45.5887,Longitude=-122.5975},
            new(){IATA="SAN",Name="San Diego Intl",City="San Diego",Country="United States",Latitude=32.7338,Longitude=-117.1933},
            new(){IATA="TPA",Name="Tampa Intl",City="Tampa",Country="United States",Latitude=27.9755,Longitude=-82.5332},
            new(){IATA="HNL",Name="Daniel K. Inouye Intl",City="Honolulu",Country="United States",Latitude=21.3245,Longitude=-157.9251},
            new(){IATA="ANC",Name="Ted Stevens Anchorage Intl",City="Anchorage",Country="United States",Latitude=61.1744,Longitude=-149.9982},
            new(){IATA="BNA",Name="Nashville Intl",City="Nashville",Country="United States",Latitude=36.1245,Longitude=-86.6782},
            new(){IATA="AUS",Name="Austin-Bergstrom Intl",City="Austin",Country="United States",Latitude=30.1975,Longitude=-97.6664},
            new(){IATA="DAL",Name="Dallas Love Field",City="Dallas",Country="United States",Latitude=32.8471,Longitude=-96.8518},
            new(){IATA="BWI",Name="Baltimore/Washington Intl",City="Baltimore",Country="United States",Latitude=39.1754,Longitude=-76.6683},
            new(){IATA="IAD",Name="Dulles Intl",City="Washington D.C.",Country="United States",Latitude=38.9531,Longitude=-77.4565},
            new(){IATA="DCA",Name="Ronald Reagan National",City="Washington D.C.",Country="United States",Latitude=38.8521,Longitude=-77.0377},
            new(){IATA="MCI",Name="Kansas City Intl",City="Kansas City",Country="United States",Latitude=39.2976,Longitude=-94.7139},
            new(){IATA="STL",Name="St. Louis Lambert Intl",City="St. Louis",Country="United States",Latitude=38.7487,Longitude=-90.3700},
            new(){IATA="RDU",Name="Raleigh-Durham Intl",City="Raleigh",Country="United States",Latitude=35.8776,Longitude=-78.7875},
            new(){IATA="PIT",Name="Pittsburgh Intl",City="Pittsburgh",Country="United States",Latitude=40.4915,Longitude=-80.2329},
            // ── NORTH AMERICA – CANADA ───────────────────────────────────────
            new(){IATA="YYZ",Name="Toronto Pearson Intl",City="Toronto",Country="Canada",Latitude=43.6777,Longitude=-79.6248},
            new(){IATA="YVR",Name="Vancouver Intl",City="Vancouver",Country="Canada",Latitude=49.1967,Longitude=-123.1815},
            new(){IATA="YUL",Name="Montreal-Trudeau Intl",City="Montreal",Country="Canada",Latitude=45.4706,Longitude=-73.7408},
            new(){IATA="YYC",Name="Calgary Intl",City="Calgary",Country="Canada",Latitude=51.1215,Longitude=-114.0076},
            new(){IATA="YEG",Name="Edmonton Intl",City="Edmonton",Country="Canada",Latitude=53.3097,Longitude=-113.5800},
            new(){IATA="YOW",Name="Ottawa Macdonald-Cartier Intl",City="Ottawa",Country="Canada",Latitude=45.3225,Longitude=-75.6692},
            new(){IATA="YHZ",Name="Halifax Stanfield Intl",City="Halifax",Country="Canada",Latitude=44.8808,Longitude=-63.5086},
            // ── NORTH AMERICA – MEXICO & CENTRAL AMERICA ────────────────────
            new(){IATA="MEX",Name="Benito Juárez Intl",City="Mexico City",Country="Mexico",Latitude=19.4363,Longitude=-99.0721},
            new(){IATA="CUN",Name="Cancún Intl",City="Cancún",Country="Mexico",Latitude=21.0365,Longitude=-86.8770},
            new(){IATA="GDL",Name="Miguel Hidalgo Intl",City="Guadalajara",Country="Mexico",Latitude=20.5218,Longitude=-103.3111},
            new(){IATA="MTY",Name="Monterrey Intl",City="Monterrey",Country="Mexico",Latitude=25.7749,Longitude=-100.1069},
            new(){IATA="PTY",Name="Tocumen Intl",City="Panama City",Country="Panama",Latitude=9.0714,Longitude=-79.3835},
            new(){IATA="SJO",Name="Juan Santamaría Intl",City="San José",Country="Costa Rica",Latitude=9.9939,Longitude=-84.2088},
            new(){IATA="GUA",Name="La Aurora Intl",City="Guatemala City",Country="Guatemala",Latitude=14.5833,Longitude=-90.5275},
            new(){IATA="SAL",Name="Óscar Romero Intl",City="San Salvador",Country="El Salvador",Latitude=13.4409,Longitude=-89.0557},
            // ── CARIBBEAN ────────────────────────────────────────────────────
            new(){IATA="NAS",Name="Lynden Pindling Intl",City="Nassau",Country="Bahamas",Latitude=25.0390,Longitude=-77.4662},
            new(){IATA="MBJ",Name="Sangster Intl",City="Montego Bay",Country="Jamaica",Latitude=18.5037,Longitude=-77.9133},
            new(){IATA="KIN",Name="Norman Manley Intl",City="Kingston",Country="Jamaica",Latitude=17.9357,Longitude=-76.7875},
            new(){IATA="SDQ",Name="Las Américas Intl",City="Santo Domingo",Country="Dominican Republic",Latitude=18.4297,Longitude=-69.6689},
            new(){IATA="SJU",Name="Luis Muñoz Marín Intl",City="San Juan",Country="Puerto Rico",Latitude=18.4394,Longitude=-66.0018},
            new(){IATA="HAV",Name="José Martí Intl",City="Havana",Country="Cuba",Latitude=22.9892,Longitude=-82.4091},
            // ── SOUTH AMERICA ─────────────────────────────────────────────────
            new(){IATA="GRU",Name="São Paulo Guarulhos Intl",City="São Paulo",Country="Brazil",Latitude=-23.4356,Longitude=-46.4731},
            new(){IATA="GIG",Name="Rio de Janeiro Galeão Intl",City="Rio de Janeiro",Country="Brazil",Latitude=-22.8099,Longitude=-43.2505},
            new(){IATA="BSB",Name="Brasília Intl",City="Brasília",Country="Brazil",Latitude=-15.8711,Longitude=-47.9186},
            new(){IATA="CNF",Name="Belo Horizonte Intl",City="Belo Horizonte",Country="Brazil",Latitude=-19.6244,Longitude=-43.9719},
            new(){IATA="FOR",Name="Pinto Martins Intl",City="Fortaleza",Country="Brazil",Latitude=-3.7763,Longitude=-38.5326},
            new(){IATA="REC",Name="Guararapes Intl",City="Recife",Country="Brazil",Latitude=-8.1265,Longitude=-34.9236},
            new(){IATA="EZE",Name="Ministro Pistarini Intl",City="Buenos Aires",Country="Argentina",Latitude=-34.8222,Longitude=-58.5358},
            new(){IATA="AEP",Name="Jorge Newbery Airfield",City="Buenos Aires",Country="Argentina",Latitude=-34.5592,Longitude=-58.4156},
            new(){IATA="COR",Name="Ingeniero Ambrosio Taravella Intl",City="Córdoba",Country="Argentina",Latitude=-31.3236,Longitude=-64.2080},
            new(){IATA="BOG",Name="El Dorado Intl",City="Bogotá",Country="Colombia",Latitude=4.7016,Longitude=-74.1469},
            new(){IATA="MDE",Name="José María Córdova Intl",City="Medellín",Country="Colombia",Latitude=6.1645,Longitude=-75.4231},
            new(){IATA="CTG",Name="Rafael Núñez Intl",City="Cartagena",Country="Colombia",Latitude=10.4424,Longitude=-75.5130},
            new(){IATA="LIM",Name="Jorge Chávez Intl",City="Lima",Country="Peru",Latitude=-12.0219,Longitude=-77.1143},
            new(){IATA="SCL",Name="Arturo Merino Benítez Intl",City="Santiago",Country="Chile",Latitude=-33.3930,Longitude=-70.7858},
            new(){IATA="PMC",Name="El Tepual Intl",City="Puerto Montt",Country="Chile",Latitude=-41.4389,Longitude=-73.0940},
            new(){IATA="UIO",Name="Mariscal Sucre Intl",City="Quito",Country="Ecuador",Latitude=-0.1292,Longitude=-78.3576},
            new(){IATA="GYE",Name="José Joaquín de Olmedo Intl",City="Guayaquil",Country="Ecuador",Latitude=-2.1574,Longitude=-79.8836},
            new(){IATA="CCS",Name="Simón Bolívar Intl",City="Caracas",Country="Venezuela",Latitude=10.6031,Longitude=-66.9909},
            new(){IATA="MVD",Name="Carrasco Intl",City="Montevideo",Country="Uruguay",Latitude=-34.8384,Longitude=-56.0308},
            new(){IATA="ASU",Name="Silvio Pettirossi Intl",City="Asunción",Country="Paraguay",Latitude=-25.2400,Longitude=-57.5193},
            new(){IATA="VVI",Name="Viru Viru Intl",City="Santa Cruz",Country="Bolivia",Latitude=-17.6448,Longitude=-63.1354},
            new(){IATA="LPB",Name="El Alto Intl",City="La Paz",Country="Bolivia",Latitude=-16.5133,Longitude=-68.1922},
            // ── EUROPE – UK & IRELAND ────────────────────────────────────────
            new(){IATA="LHR",Name="Heathrow Airport",City="London",Country="United Kingdom",Latitude=51.4700,Longitude=-0.4543},
            new(){IATA="LGW",Name="Gatwick Airport",City="London",Country="United Kingdom",Latitude=51.1537,Longitude=-0.1821},
            new(){IATA="STN",Name="Stansted Airport",City="London",Country="United Kingdom",Latitude=51.8850,Longitude=0.2350},
            new(){IATA="MAN",Name="Manchester Airport",City="Manchester",Country="United Kingdom",Latitude=53.3537,Longitude=-2.2750},
            new(){IATA="EDI",Name="Edinburgh Airport",City="Edinburgh",Country="United Kingdom",Latitude=55.9500,Longitude=-3.3725},
            new(){IATA="BHX",Name="Birmingham Airport",City="Birmingham",Country="United Kingdom",Latitude=52.4539,Longitude=-1.7480},
            new(){IATA="GLA",Name="Glasgow Airport",City="Glasgow",Country="United Kingdom",Latitude=55.8719,Longitude=-4.4330},
            new(){IATA="DUB",Name="Dublin Airport",City="Dublin",Country="Ireland",Latitude=53.4213,Longitude=-6.2700},
            new(){IATA="SNN",Name="Shannon Airport",City="Shannon",Country="Ireland",Latitude=52.7020,Longitude=-8.9248},
            // ── EUROPE – WESTERN ─────────────────────────────────────────────
            new(){IATA="CDG",Name="Charles de Gaulle Airport",City="Paris",Country="France",Latitude=49.0097,Longitude=2.5479},
            new(){IATA="ORY",Name="Paris Orly Airport",City="Paris",Country="France",Latitude=48.7233,Longitude=2.3794},
            new(){IATA="NCE",Name="Nice Côte d'Azur Airport",City="Nice",Country="France",Latitude=43.6584,Longitude=7.2159},
            new(){IATA="LYS",Name="Lyon-Saint Exupéry Airport",City="Lyon",Country="France",Latitude=45.7256,Longitude=5.0811},
            new(){IATA="MRS",Name="Marseille Provence Airport",City="Marseille",Country="France",Latitude=43.4393,Longitude=5.2214},
            new(){IATA="AMS",Name="Amsterdam Schiphol",City="Amsterdam",Country="Netherlands",Latitude=52.3105,Longitude=4.7683},
            new(){IATA="BRU",Name="Brussels Airport",City="Brussels",Country="Belgium",Latitude=50.9010,Longitude=4.4844},
            new(){IATA="LIS",Name="Humberto Delgado Airport",City="Lisbon",Country="Portugal",Latitude=38.7742,Longitude=-9.1342},
            new(){IATA="OPO",Name="Francisco Sá Carneiro Airport",City="Porto",Country="Portugal",Latitude=41.2481,Longitude=-8.6814},
            new(){IATA="MAD",Name="Adolfo Suárez Madrid-Barajas",City="Madrid",Country="Spain",Latitude=40.4936,Longitude=-3.5668},
            new(){IATA="BCN",Name="Barcelona El Prat",City="Barcelona",Country="Spain",Latitude=41.2971,Longitude=2.0785},
            new(){IATA="PMI",Name="Palma de Mallorca Airport",City="Palma",Country="Spain",Latitude=39.5517,Longitude=2.7388},
            new(){IATA="AGP",Name="Málaga Airport",City="Málaga",Country="Spain",Latitude=36.6749,Longitude=-4.4991},
            new(){IATA="ALC",Name="Alicante-Elche Airport",City="Alicante",Country="Spain",Latitude=38.2822,Longitude=-0.5582},
            new(){IATA="ZRH",Name="Zurich Airport",City="Zurich",Country="Switzerland",Latitude=47.4647,Longitude=8.5492},
            new(){IATA="GVA",Name="Geneva Airport",City="Geneva",Country="Switzerland",Latitude=46.2381,Longitude=6.1089},
            new(){IATA="BSL",Name="EuroAirport Basel",City="Basel",Country="Switzerland",Latitude=47.5896,Longitude=7.5299},
            // ── EUROPE – GERMANY ─────────────────────────────────────────────
            new(){IATA="FRA",Name="Frankfurt Airport",City="Frankfurt",Country="Germany",Latitude=50.0379,Longitude=8.5622},
            new(){IATA="MUC",Name="Munich Airport",City="Munich",Country="Germany",Latitude=48.3537,Longitude=11.7750},
            new(){IATA="BER",Name="Berlin Brandenburg Airport",City="Berlin",Country="Germany",Latitude=52.3667,Longitude=13.5033},
            new(){IATA="DUS",Name="Düsseldorf Airport",City="Düsseldorf",Country="Germany",Latitude=51.2895,Longitude=6.7668},
            new(){IATA="HAM",Name="Hamburg Airport",City="Hamburg",Country="Germany",Latitude=53.6304,Longitude=9.9882},
            new(){IATA="CGN",Name="Cologne Bonn Airport",City="Cologne",Country="Germany",Latitude=50.8659,Longitude=7.1427},
            new(){IATA="STR",Name="Stuttgart Airport",City="Stuttgart",Country="Germany",Latitude=48.6900,Longitude=9.2218},
            new(){IATA="NUE",Name="Nuremberg Airport",City="Nuremberg",Country="Germany",Latitude=49.4987,Longitude=11.0669},
            // ── EUROPE – SCANDINAVIA ─────────────────────────────────────────
            new(){IATA="ARN",Name="Stockholm Arlanda",City="Stockholm",Country="Sweden",Latitude=59.6519,Longitude=17.9186},
            new(){IATA="GOT",Name="Göteborg Landvetter",City="Gothenburg",Country="Sweden",Latitude=57.6628,Longitude=12.2798},
            new(){IATA="CPH",Name="Copenhagen Airport",City="Copenhagen",Country="Denmark",Latitude=55.6180,Longitude=12.6508},
            new(){IATA="OSL",Name="Oslo Gardermoen",City="Oslo",Country="Norway",Latitude=60.1939,Longitude=11.1004},
            new(){IATA="BGO",Name="Bergen Airport",City="Bergen",Country="Norway",Latitude=60.2934,Longitude=5.2181},
            new(){IATA="HEL",Name="Helsinki-Vantaa Airport",City="Helsinki",Country="Finland",Latitude=60.3172,Longitude=24.9633},
            new(){IATA="RVN",Name="Rovaniemi Airport",City="Rovaniemi",Country="Finland",Latitude=66.5648,Longitude=25.8304},
            new(){IATA="REY",Name="Reykjavík Airport",City="Reykjavík",Country="Iceland",Latitude=64.1300,Longitude=-21.9405},
            new(){IATA="KEF",Name="Keflavík Intl",City="Keflavík",Country="Iceland",Latitude=63.9850,Longitude=-22.6056},
            // ── EUROPE – SOUTHERN ────────────────────────────────────────────
            new(){IATA="FCO",Name="Leonardo da Vinci–Fiumicino",City="Rome",Country="Italy",Latitude=41.7999,Longitude=12.2462},
            new(){IATA="MXP",Name="Milan Malpensa Airport",City="Milan",Country="Italy",Latitude=45.6306,Longitude=8.7281},
            new(){IATA="LIN",Name="Milan Linate Airport",City="Milan",Country="Italy",Latitude=45.4454,Longitude=9.2767},
            new(){IATA="NAP",Name="Naples Intl Airport",City="Naples",Country="Italy",Latitude=40.8860,Longitude=14.2908},
            new(){IATA="VCE",Name="Venice Marco Polo Airport",City="Venice",Country="Italy",Latitude=45.5053,Longitude=12.3519},
            new(){IATA="ATH",Name="Athens Intl Airport",City="Athens",Country="Greece",Latitude=37.9364,Longitude=23.9445},
            new(){IATA="SKG",Name="Thessaloniki Airport",City="Thessaloniki",Country="Greece",Latitude=40.5197,Longitude=22.9709},
            new(){IATA="HER",Name="Heraklion Intl Airport",City="Heraklion",Country="Greece",Latitude=35.3397,Longitude=25.1803},
            // ── EUROPE – EASTERN ─────────────────────────────────────────────
            new(){IATA="VIE",Name="Vienna Intl Airport",City="Vienna",Country="Austria",Latitude=48.1102,Longitude=16.5697},
            new(){IATA="PRG",Name="Václav Havel Prague Airport",City="Prague",Country="Czech Republic",Latitude=50.1008,Longitude=14.2600},
            new(){IATA="BUD",Name="Budapest Ferenc Liszt Intl",City="Budapest",Country="Hungary",Latitude=47.4298,Longitude=19.2611},
            new(){IATA="WAW",Name="Warsaw Chopin Airport",City="Warsaw",Country="Poland",Latitude=52.1657,Longitude=20.9671},
            new(){IATA="KRK",Name="Kraków John Paul II Intl",City="Kraków",Country="Poland",Latitude=50.0777,Longitude=19.7848},
            new(){IATA="BEG",Name="Belgrade Nikola Tesla Airport",City="Belgrade",Country="Serbia",Latitude=44.8184,Longitude=20.3091},
            new(){IATA="SOF",Name="Sofia Airport",City="Sofia",Country="Bulgaria",Latitude=42.6952,Longitude=23.4114},
            new(){IATA="OTP",Name="Henri Coandă Intl",City="Bucharest",Country="Romania",Latitude=44.5722,Longitude=26.1020},
            new(){IATA="KBP",Name="Boryspil Intl",City="Kyiv",Country="Ukraine",Latitude=50.3450,Longitude=30.8947},
            new(){IATA="RIX",Name="Riga Intl Airport",City="Riga",Country="Latvia",Latitude=56.9236,Longitude=23.9711},
            new(){IATA="TLL",Name="Tallinn Airport",City="Tallinn",Country="Estonia",Latitude=59.4133,Longitude=24.8328},
            new(){IATA="VNO",Name="Vilnius Airport",City="Vilnius",Country="Lithuania",Latitude=54.6341,Longitude=25.2858},
            new(){IATA="SVO",Name="Sheremetyevo Intl",City="Moscow",Country="Russia",Latitude=55.9726,Longitude=37.4146},
            new(){IATA="DME",Name="Domodedovo Intl",City="Moscow",Country="Russia",Latitude=55.4087,Longitude=37.9063},
            new(){IATA="LED",Name="Pulkovo Airport",City="St. Petersburg",Country="Russia",Latitude=59.8003,Longitude=30.2625},
            new(){IATA="KZN",Name="Kazan Intl Airport",City="Kazan",Country="Russia",Latitude=55.6062,Longitude=49.2787},
            // ── MIDDLE EAST ──────────────────────────────────────────────────
            new(){IATA="DXB",Name="Dubai Intl Airport",City="Dubai",Country="UAE",Latitude=25.2532,Longitude=55.3657},
            new(){IATA="DWC",Name="Al Maktoum Intl Airport",City="Dubai",Country="UAE",Latitude=24.8963,Longitude=55.1612},
            new(){IATA="AUH",Name="Abu Dhabi Intl Airport",City="Abu Dhabi",Country="UAE",Latitude=24.4330,Longitude=54.6511},
            new(){IATA="DOH",Name="Hamad Intl Airport",City="Doha",Country="Qatar",Latitude=25.2731,Longitude=51.6080},
            new(){IATA="KWI",Name="Kuwait Intl Airport",City="Kuwait City",Country="Kuwait",Latitude=29.2267,Longitude=47.9689},
            new(){IATA="BAH",Name="Bahrain Intl Airport",City="Manama",Country="Bahrain",Latitude=26.2708,Longitude=50.6336},
            new(){IATA="MCT",Name="Muscat Intl Airport",City="Muscat",Country="Oman",Latitude=23.5933,Longitude=58.2844},
            new(){IATA="RUH",Name="King Khalid Intl Airport",City="Riyadh",Country="Saudi Arabia",Latitude=24.9578,Longitude=46.6989},
            new(){IATA="JED",Name="King Abdulaziz Intl Airport",City="Jeddah",Country="Saudi Arabia",Latitude=21.6805,Longitude=39.1565},
            new(){IATA="MED",Name="Prince Mohammad Bin Abdulaziz Intl",City="Medina",Country="Saudi Arabia",Latitude=24.5534,Longitude=39.7051},
            new(){IATA="AMM",Name="Queen Alia Intl Airport",City="Amman",Country="Jordan",Latitude=31.7226,Longitude=35.9932},
            new(){IATA="BEY",Name="Beirut-Rafic Hariri Intl",City="Beirut",Country="Lebanon",Latitude=33.8209,Longitude=35.4884},
            new(){IATA="TLV",Name="Ben Gurion Intl Airport",City="Tel Aviv",Country="Israel",Latitude=32.0114,Longitude=34.8867},
            new(){IATA="BGW",Name="Baghdad Intl Airport",City="Baghdad",Country="Iraq",Latitude=33.2625,Longitude=44.2346},
            new(){IATA="IKA",Name="Imam Khomeini Intl Airport",City="Tehran",Country="Iran",Latitude=35.4161,Longitude=51.1522},
            new(){IATA="IST",Name="Istanbul Airport",City="Istanbul",Country="Turkey",Latitude=41.2753,Longitude=28.7519},
            new(){IATA="SAW",Name="Sabiha Gökçen Intl",City="Istanbul",Country="Turkey",Latitude=40.8986,Longitude=29.3092},
            new(){IATA="ADB",Name="Adnan Menderes Airport",City="Izmir",Country="Turkey",Latitude=38.2924,Longitude=27.1570},
            new(){IATA="AYT",Name="Antalya Airport",City="Antalya",Country="Turkey",Latitude=36.8987,Longitude=30.8005},
            // ── AFRICA – NORTH ───────────────────────────────────────────────
            new(){IATA="CAI",Name="Cairo Intl Airport",City="Cairo",Country="Egypt",Latitude=30.1219,Longitude=31.4056},
            new(){IATA="HRG",Name="Hurghada Intl Airport",City="Hurghada",Country="Egypt",Latitude=27.1783,Longitude=33.7994},
            new(){IATA="TUN",Name="Tunis-Carthage Intl Airport",City="Tunis",Country="Tunisia",Latitude=36.8510,Longitude=10.2272},
            new(){IATA="ALG",Name="Houari Boumediene Airport",City="Algiers",Country="Algeria",Latitude=36.6910,Longitude=3.2154},
            new(){IATA="CMN",Name="Mohammed V Intl Airport",City="Casablanca",Country="Morocco",Latitude=33.3675,Longitude=-7.5898},
            new(){IATA="RAK",Name="Marrakesh Menara Airport",City="Marrakesh",Country="Morocco",Latitude=31.6069,Longitude=-8.0363},
            new(){IATA="TNG",Name="Ibn Batouta Airport",City="Tangier",Country="Morocco",Latitude=35.7269,Longitude=-5.9169},
            new(){IATA="TRP",Name="Mitiga Intl Airport",City="Tripoli",Country="Libya",Latitude=32.8943,Longitude=13.2760},
            // ── AFRICA – WEST ────────────────────────────────────────────────
            new(){IATA="LOS",Name="Murtala Muhammed Intl",City="Lagos",Country="Nigeria",Latitude=6.5774,Longitude=3.3212},
            new(){IATA="ABV",Name="Nnamdi Azikiwe Intl",City="Abuja",Country="Nigeria",Latitude=9.0068,Longitude=7.2632},
            new(){IATA="KAN",Name="Mallam Aminu Kano Intl",City="Kano",Country="Nigeria",Latitude=12.0476,Longitude=8.5242},
            new(){IATA="ACC",Name="Kotoka Intl Airport",City="Accra",Country="Ghana",Latitude=5.6052,Longitude=-0.1669},
            new(){IATA="ABJ",Name="Félix-Houphouët-Boigny Intl",City="Abidjan",Country="Ivory Coast",Latitude=5.2614,Longitude=-3.9263},
            new(){IATA="DKR",Name="Blaise Diagne Intl Airport",City="Dakar",Country="Senegal",Latitude=14.7397,Longitude=-17.4902},
            new(){IATA="CMQ",Name="Conakry Airport",City="Conakry",Country="Guinea",Latitude=9.5769,Longitude=-13.6120},
            // ── AFRICA – EAST ────────────────────────────────────────────────
            new(){IATA="NBO",Name="Jomo Kenyatta Intl",City="Nairobi",Country="Kenya",Latitude=-1.3192,Longitude=36.9275},
            new(){IATA="MBA",Name="Moi Intl Airport",City="Mombasa",Country="Kenya",Latitude=-4.0348,Longitude=39.5942},
            new(){IATA="ADD",Name="Bole Intl Airport",City="Addis Ababa",Country="Ethiopia",Latitude=8.9779,Longitude=38.7993},
            new(){IATA="DAR",Name="Julius Nyerere Intl",City="Dar es Salaam",Country="Tanzania",Latitude=-6.8781,Longitude=39.2026},
            new(){IATA="JIB",Name="Djibouti-Ambouli Intl",City="Djibouti",Country="Djibouti",Latitude=11.5473,Longitude=43.1595},
            new(){IATA="KGL",Name="Kigali Intl Airport",City="Kigali",Country="Rwanda",Latitude=-1.9686,Longitude=30.1395},
            new(){IATA="EBB",Name="Entebbe Intl Airport",City="Entebbe",Country="Uganda",Latitude=0.0424,Longitude=32.4435},
            new(){IATA="MGQ",Name="Aden Abdulle Intl Airport",City="Mogadishu",Country="Somalia",Latitude=2.0144,Longitude=45.3047},
            // ── AFRICA – SOUTHERN & CENTRAL ─────────────────────────────────
            new(){IATA="JNB",Name="OR Tambo Intl Airport",City="Johannesburg",Country="South Africa",Latitude=-26.1367,Longitude=28.2411},
            new(){IATA="CPT",Name="Cape Town Intl Airport",City="Cape Town",Country="South Africa",Latitude=-33.9648,Longitude=18.6017},
            new(){IATA="DUR",Name="King Shaka Intl Airport",City="Durban",Country="South Africa",Latitude=-29.6144,Longitude=31.1197},
            new(){IATA="HRE",Name="Robert Gabriel Mugabe Intl",City="Harare",Country="Zimbabwe",Latitude=-17.9318,Longitude=31.0929},
            new(){IATA="LUN",Name="Kenneth Kaunda Intl",City="Lusaka",Country="Zambia",Latitude=-15.3308,Longitude=28.4526},
            new(){IATA="WDH",Name="Hosea Kutako Intl Airport",City="Windhoek",Country="Namibia",Latitude=-22.4799,Longitude=17.4709},
            new(){IATA="GBE",Name="Sir Seretse Khama Intl",City="Gaborone",Country="Botswana",Latitude=-24.5552,Longitude=25.9182},
            new(){IATA="TNR",Name="Ivato Intl Airport",City="Antananarivo",Country="Madagascar",Latitude=-18.7969,Longitude=47.4788},
            new(){IATA="MRU",Name="Sir Seewoosagur Ramgoolam Intl",City="Mauritius",Country="Mauritius",Latitude=-20.4302,Longitude=57.6836},
            new(){IATA="SEZ",Name="Seychelles Intl Airport",City="Mahé",Country="Seychelles",Latitude=-4.6743,Longitude=55.5218},
            // ── SOUTH ASIA ────────────────────────────────────────────────────
            new(){IATA="DEL",Name="Indira Gandhi Intl",City="New Delhi",Country="India",Latitude=28.5665,Longitude=77.1031},
            new(){IATA="BOM",Name="Chhatrapati Shivaji Maharaj Intl",City="Mumbai",Country="India",Latitude=19.0896,Longitude=72.8656},
            new(){IATA="MAA",Name="Chennai Intl Airport",City="Chennai",Country="India",Latitude=12.9941,Longitude=80.1709},
            new(){IATA="BLR",Name="Kempegowda Intl Airport",City="Bengaluru",Country="India",Latitude=13.1979,Longitude=77.7063},
            new(){IATA="HYD",Name="Rajiv Gandhi Intl Airport",City="Hyderabad",Country="India",Latitude=17.2403,Longitude=78.4294},
            new(){IATA="CCU",Name="Netaji Subhas Chandra Bose Intl",City="Kolkata",Country="India",Latitude=22.6520,Longitude=88.4463},
            new(){IATA="AMD",Name="Sardar Vallabhbhai Patel Intl",City="Ahmedabad",Country="India",Latitude=23.0772,Longitude=72.6347},
            new(){IATA="PNQ",Name="Pune Airport",City="Pune",Country="India",Latitude=18.5822,Longitude=73.9197},
            new(){IATA="GOI",Name="Goa Intl Airport",City="Goa",Country="India",Latitude=15.3808,Longitude=73.8314},
            new(){IATA="COK",Name="Cochin Intl Airport",City="Kochi",Country="India",Latitude=10.1520,Longitude=76.4019},
            new(){IATA="TRV",Name="Trivandrum Intl Airport",City="Thiruvananthapuram",Country="India",Latitude=8.4821,Longitude=76.9201},
            new(){IATA="CMB",Name="Bandaranaike Intl Airport",City="Colombo",Country="Sri Lanka",Latitude=7.1808,Longitude=79.8841},
            new(){IATA="DAC",Name="Hazrat Shahjalal Intl",City="Dhaka",Country="Bangladesh",Latitude=23.8433,Longitude=90.3978},
            new(){IATA="KTM",Name="Tribhuvan Intl Airport",City="Kathmandu",Country="Nepal",Latitude=27.6966,Longitude=85.3591},
            new(){IATA="MLE",Name="Velana Intl Airport",City="Malé",Country="Maldives",Latitude=4.1918,Longitude=73.5290},
            new(){IATA="KHI",Name="Jinnah Intl Airport",City="Karachi",Country="Pakistan",Latitude=24.9065,Longitude=67.1608},
            new(){IATA="LHE",Name="Allama Iqbal Intl Airport",City="Lahore",Country="Pakistan",Latitude=31.5216,Longitude=74.4036},
            new(){IATA="ISB",Name="Islamabad Intl Airport",City="Islamabad",Country="Pakistan",Latitude=33.5607,Longitude=72.8516},
            new(){IATA="KBL",Name="Hamid Karzai Intl Airport",City="Kabul",Country="Afghanistan",Latitude=34.5659,Longitude=69.2123},
            // ── CENTRAL ASIA ─────────────────────────────────────────────────
            new(){IATA="ALA",Name="Almaty Intl Airport",City="Almaty",Country="Kazakhstan",Latitude=43.3521,Longitude=77.0405},
            new(){IATA="NQZ",Name="Nursultan Nazarbayev Intl",City="Nur-Sultan",Country="Kazakhstan",Latitude=51.0228,Longitude=71.4669},
            new(){IATA="TAS",Name="Islam Karimov Tashkent Intl",City="Tashkent",Country="Uzbekistan",Latitude=41.2579,Longitude=69.2812},
            new(){IATA="FRU",Name="Manas Intl Airport",City="Bishkek",Country="Kyrgyzstan",Latitude=43.0613,Longitude=74.4776},
            new(){IATA="DYU",Name="Dushanbe Airport",City="Dushanbe",Country="Tajikistan",Latitude=38.5433,Longitude=68.8249},
            new(){IATA="ASB",Name="Ashgabat Intl Airport",City="Ashgabat",Country="Turkmenistan",Latitude=37.9868,Longitude=58.3610},
            // ── SOUTHEAST ASIA ────────────────────────────────────────────────
            new(){IATA="SIN",Name="Singapore Changi Airport",City="Singapore",Country="Singapore",Latitude=1.3644,Longitude=103.9915},
            new(){IATA="KUL",Name="Kuala Lumpur Intl",City="Kuala Lumpur",Country="Malaysia",Latitude=2.7456,Longitude=101.7099},
            new(){IATA="PEN",Name="Penang Intl Airport",City="Penang",Country="Malaysia",Latitude=5.2971,Longitude=100.2769},
            new(){IATA="BKK",Name="Suvarnabhumi Airport",City="Bangkok",Country="Thailand",Latitude=13.6900,Longitude=100.7501},
            new(){IATA="DMK",Name="Don Mueang Intl Airport",City="Bangkok",Country="Thailand",Latitude=13.9126,Longitude=100.6072},
            new(){IATA="HKT",Name="Phuket Intl Airport",City="Phuket",Country="Thailand",Latitude=8.1132,Longitude=98.3167},
            new(){IATA="CNX",Name="Chiang Mai Intl Airport",City="Chiang Mai",Country="Thailand",Latitude=18.7668,Longitude=98.9628},
            new(){IATA="CGK",Name="Soekarno-Hatta Intl",City="Jakarta",Country="Indonesia",Latitude=-6.1256,Longitude=106.6559},
            new(){IATA="DPS",Name="Ngurah Rai Intl Airport",City="Bali",Country="Indonesia",Latitude=-8.7482,Longitude=115.1670},
            new(){IATA="SUB",Name="Juanda Intl Airport",City="Surabaya",Country="Indonesia",Latitude=-7.3798,Longitude=112.7872},
            new(){IATA="UPG",Name="Hasanuddin Intl Airport",City="Makassar",Country="Indonesia",Latitude=-5.0616,Longitude=119.5540},
            new(){IATA="MNL",Name="Ninoy Aquino Intl",City="Manila",Country="Philippines",Latitude=14.5086,Longitude=121.0198},
            new(){IATA="CEB",Name="Mactan-Cebu Intl Airport",City="Cebu",Country="Philippines",Latitude=10.3075,Longitude=123.9791},
            new(){IATA="SGN",Name="Tan Son Nhat Intl Airport",City="Ho Chi Minh City",Country="Vietnam",Latitude=10.8188,Longitude=106.6520},
            new(){IATA="HAN",Name="Noi Bai Intl Airport",City="Hanoi",Country="Vietnam",Latitude=21.2211,Longitude=105.8072},
            new(){IATA="DAD",Name="Da Nang Intl Airport",City="Da Nang",Country="Vietnam",Latitude=16.0439,Longitude=108.1993},
            new(){IATA="REP",Name="Siem Reap Intl Airport",City="Siem Reap",Country="Cambodia",Latitude=13.4107,Longitude=103.8129},
            new(){IATA="PNH",Name="Phnom Penh Intl Airport",City="Phnom Penh",Country="Cambodia",Latitude=11.5466,Longitude=104.8440},
            new(){IATA="VTE",Name="Wattay Intl Airport",City="Vientiane",Country="Laos",Latitude=17.9883,Longitude=102.5633},
            new(){IATA="RGN",Name="Yangon Intl Airport",City="Yangon",Country="Myanmar",Latitude=16.9073,Longitude=96.1332},
            new(){IATA="BWN",Name="Brunei Intl Airport",City="Bandar Seri Begawan",Country="Brunei",Latitude=4.9442,Longitude=114.9283},
            // ── EAST ASIA ─────────────────────────────────────────────────────
            new(){IATA="HKG",Name="Hong Kong Intl Airport",City="Hong Kong",Country="China",Latitude=22.3080,Longitude=113.9185},
            new(){IATA="PEK",Name="Beijing Capital Intl",City="Beijing",Country="China",Latitude=40.0799,Longitude=116.6031},
            new(){IATA="PKX",Name="Beijing Daxing Intl",City="Beijing",Country="China",Latitude=39.5090,Longitude=116.4100},
            new(){IATA="PVG",Name="Shanghai Pudong Intl",City="Shanghai",Country="China",Latitude=31.1443,Longitude=121.8083},
            new(){IATA="SHA",Name="Shanghai Hongqiao Intl",City="Shanghai",Country="China",Latitude=31.1979,Longitude=121.3366},
            new(){IATA="CAN",Name="Guangzhou Baiyun Intl",City="Guangzhou",Country="China",Latitude=23.3924,Longitude=113.2990},
            new(){IATA="SZX",Name="Shenzhen Bao'an Intl",City="Shenzhen",Country="China",Latitude=22.6393,Longitude=113.8107},
            new(){IATA="CTU",Name="Chengdu Tianfu Intl",City="Chengdu",Country="China",Latitude=30.3123,Longitude=104.4440},
            new(){IATA="KMG",Name="Kunming Changshui Intl",City="Kunming",Country="China",Latitude=24.9920,Longitude=102.7441},
            new(){IATA="XIY",Name="Xi'an Xianyang Intl",City="Xi'an",Country="China",Latitude=34.4471,Longitude=108.7516},
            new(){IATA="WUH",Name="Wuhan Tianhe Intl",City="Wuhan",Country="China",Latitude=30.7838,Longitude=114.2081},
            new(){IATA="CSX",Name="Changsha Huanghua Intl",City="Changsha",Country="China",Latitude=28.1892,Longitude=113.2196},
            new(){IATA="URC",Name="Ürümqi Diwopu Intl",City="Ürümqi",Country="China",Latitude=43.9071,Longitude=87.4742},
            new(){IATA="MFM",Name="Macau Intl Airport",City="Macau",Country="China",Latitude=22.1496,Longitude=113.5916},
            new(){IATA="TPE",Name="Taiwan Taoyuan Intl",City="Taipei",Country="Taiwan",Latitude=25.0777,Longitude=121.2327},
            new(){IATA="TSA",Name="Taipei Songshan Airport",City="Taipei",Country="Taiwan",Latitude=25.0694,Longitude=121.5525},
            new(){IATA="KHH",Name="Kaohsiung Intl Airport",City="Kaohsiung",Country="Taiwan",Latitude=22.5771,Longitude=120.3499},
            new(){IATA="NRT",Name="Narita Intl Airport",City="Tokyo",Country="Japan",Latitude=35.7720,Longitude=140.3929},
            new(){IATA="HND",Name="Haneda Airport",City="Tokyo",Country="Japan",Latitude=35.5523,Longitude=139.7799},
            new(){IATA="KIX",Name="Kansai Intl Airport",City="Osaka",Country="Japan",Latitude=34.4272,Longitude=135.2440},
            new(){IATA="ITM",Name="Osaka Itami Airport",City="Osaka",Country="Japan",Latitude=34.7849,Longitude=135.4380},
            new(){IATA="NGO",Name="Chubu Centrair Intl",City="Nagoya",Country="Japan",Latitude=34.8583,Longitude=136.8054},
            new(){IATA="CTS",Name="New Chitose Airport",City="Sapporo",Country="Japan",Latitude=42.7752,Longitude=141.6922},
            new(){IATA="FUK",Name="Fukuoka Airport",City="Fukuoka",Country="Japan",Latitude=33.5859,Longitude=130.4511},
            new(){IATA="OKA",Name="Naha Airport",City="Naha (Okinawa)",Country="Japan",Latitude=26.1958,Longitude=127.6456},
            new(){IATA="ICN",Name="Incheon Intl Airport",City="Seoul",Country="South Korea",Latitude=37.4602,Longitude=126.4407},
            new(){IATA="GMP",Name="Gimpo Intl Airport",City="Seoul",Country="South Korea",Latitude=37.5583,Longitude=126.7906},
            new(){IATA="PUS",Name="Gimhae Intl Airport",City="Busan",Country="South Korea",Latitude=35.1795,Longitude=128.9382},
            new(){IATA="CJU",Name="Jeju Intl Airport",City="Jeju",Country="South Korea",Latitude=33.5113,Longitude=126.4930},
            new(){IATA="MNG",Name="Mango Airport (placeholder)",City="Ulaanbaatar",Country="Mongolia",Latitude=47.8431,Longitude=106.7661},
            new(){IATA="ULN",Name="Chinggis Khaan Intl",City="Ulaanbaatar",Country="Mongolia",Latitude=47.8431,Longitude=106.7661},
            // ── OCEANIA ───────────────────────────────────────────────────────
            new(){IATA="SYD",Name="Sydney Kingsford Smith Airport",City="Sydney",Country="Australia",Latitude=-33.9399,Longitude=151.1753},
            new(){IATA="MEL",Name="Melbourne Airport",City="Melbourne",Country="Australia",Latitude=-37.6690,Longitude=144.8410},
            new(){IATA="BNE",Name="Brisbane Airport",City="Brisbane",Country="Australia",Latitude=-27.3842,Longitude=153.1175},
            new(){IATA="PER",Name="Perth Airport",City="Perth",Country="Australia",Latitude=-31.9403,Longitude=115.9670},
            new(){IATA="ADL",Name="Adelaide Airport",City="Adelaide",Country="Australia",Latitude=-34.9450,Longitude=138.5308},
            new(){IATA="CBR",Name="Canberra Airport",City="Canberra",Country="Australia",Latitude=-35.3069,Longitude=149.1950},
            new(){IATA="CNS",Name="Cairns Airport",City="Cairns",Country="Australia",Latitude=-16.8858,Longitude=145.7552},
            new(){IATA="DRW",Name="Darwin Airport",City="Darwin",Country="Australia",Latitude=-12.4148,Longitude=130.8765},
            new(){IATA="HBA",Name="Hobart Airport",City="Hobart",Country="Australia",Latitude=-42.8361,Longitude=147.5103},
            new(){IATA="OOL",Name="Gold Coast Airport",City="Gold Coast",Country="Australia",Latitude=-28.1644,Longitude=153.5047},
            new(){IATA="AKL",Name="Auckland Airport",City="Auckland",Country="New Zealand",Latitude=-37.0082,Longitude=174.7917},
            new(){IATA="WLG",Name="Wellington Airport",City="Wellington",Country="New Zealand",Latitude=-41.3272,Longitude=174.8050},
            new(){IATA="CHC",Name="Christchurch Airport",City="Christchurch",Country="New Zealand",Latitude=-43.4894,Longitude=172.5322},
            new(){IATA="NAN",Name="Nadi Airport",City="Nadi",Country="Fiji",Latitude=-17.7554,Longitude=177.4430},
            new(){IATA="APW",Name="Faleolo Intl Airport",City="Apia",Country="Samoa",Latitude=-13.8300,Longitude=-172.0083},
            new(){IATA="PPT",Name="Faa'a Intl Airport",City="Papeete",Country="French Polynesia",Latitude=-17.5534,Longitude=-149.6063},
            new(){IATA="GUM",Name="Antonio B. Won Pat Intl",City="Hagåtña",Country="Guam",Latitude=13.4834,Longitude=144.7980},

            // ── MORE USA ──────────────────────────────────────────────────────
            new(){IATA="ABQ",Name="Albuquerque Intl",City="Albuquerque",Country="United States",Latitude=35.0402,Longitude=-106.6091},
            new(){IATA="BDL",Name="Bradley Intl",City="Hartford",Country="United States",Latitude=41.9389,Longitude=-72.6832},
            new(){IATA="BUF",Name="Buffalo Niagara Intl",City="Buffalo",Country="United States",Latitude=42.9405,Longitude=-78.7322},
            new(){IATA="CHS",Name="Charleston Intl",City="Charleston",Country="United States",Latitude=32.8987,Longitude=-80.0405},
            new(){IATA="DAY",Name="Dayton Intl Airport",City="Dayton",Country="United States",Latitude=39.9024,Longitude=-84.2194},
            new(){IATA="ELP",Name="El Paso Intl",City="El Paso",Country="United States",Latitude=31.8072,Longitude=-106.3779},
            new(){IATA="FAT",Name="Fresno Yosemite Intl",City="Fresno",Country="United States",Latitude=36.7762,Longitude=-119.7182},
            new(){IATA="FLL",Name="Fort Lauderdale-Hollywood Intl",City="Fort Lauderdale",Country="United States",Latitude=26.0726,Longitude=-80.1527},
            new(){IATA="GEG",Name="Spokane Intl",City="Spokane",Country="United States",Latitude=47.6199,Longitude=-117.5338},
            new(){IATA="GRR",Name="Gerald R. Ford Intl",City="Grand Rapids",Country="United States",Latitude=42.8808,Longitude=-85.5228},
            new(){IATA="ICT",Name="Wichita Eisenhower National",City="Wichita",Country="United States",Latitude=37.6499,Longitude=-97.4331},
            new(){IATA="JAX",Name="Jacksonville Intl",City="Jacksonville",Country="United States",Latitude=30.4941,Longitude=-81.6879},
            new(){IATA="LEX",Name="Blue Grass Airport",City="Lexington",Country="United States",Latitude=38.0365,Longitude=-84.6059},
            new(){IATA="MEM",Name="Memphis Intl",City="Memphis",Country="United States",Latitude=35.0424,Longitude=-89.9767},
            new(){IATA="OKC",Name="Will Rogers World Airport",City="Oklahoma City",Country="United States",Latitude=35.3931,Longitude=-97.6007},
            new(){IATA="OMA",Name="Eppley Airfield",City="Omaha",Country="United States",Latitude=41.3032,Longitude=-95.8941},
            new(){IATA="PBI",Name="Palm Beach Intl",City="West Palm Beach",Country="United States",Latitude=26.6832,Longitude=-80.0956},
            new(){IATA="RNO",Name="Reno-Tahoe Intl",City="Reno",Country="United States",Latitude=39.4991,Longitude=-119.7681},
            new(){IATA="SAT",Name="San Antonio Intl",City="San Antonio",Country="United States",Latitude=29.5337,Longitude=-98.4698},
            new(){IATA="SAV",Name="Savannah/Hilton Head Intl",City="Savannah",Country="United States",Latitude=32.1276,Longitude=-81.2021},
            new(){IATA="SNA",Name="John Wayne Airport",City="Orange County",Country="United States",Latitude=33.6762,Longitude=-117.8682},
            new(){IATA="TUS",Name="Tucson Intl",City="Tucson",Country="United States",Latitude=32.1161,Longitude=-110.9410},
            new(){IATA="TYS",Name="McGhee Tyson Airport",City="Knoxville",Country="United States",Latitude=35.8110,Longitude=-83.9940},
            new(){IATA="XNA",Name="Northwest Arkansas National",City="Fayetteville",Country="United States",Latitude=36.2819,Longitude=-94.3068},
            new(){IATA="BHM",Name="Birmingham-Shuttlesworth Intl",City="Birmingham",Country="United States",Latitude=33.5629,Longitude=-86.7535},
            new(){IATA="BOI",Name="Boise Airport",City="Boise",Country="United States",Latitude=43.5644,Longitude=-116.2228},
            new(){IATA="CID",Name="The Eastern Iowa Airport",City="Cedar Rapids",Country="United States",Latitude=41.8847,Longitude=-91.7108},
            new(){IATA="COS",Name="Colorado Springs Airport",City="Colorado Springs",Country="United States",Latitude=38.8058,Longitude=-104.7008},
            new(){IATA="DSM",Name="Des Moines Intl",City="Des Moines",Country="United States",Latitude=41.5340,Longitude=-93.6631},
            new(){IATA="GRB",Name="Green Bay Austin Straubel Intl",City="Green Bay",Country="United States",Latitude=44.4851,Longitude=-88.1296},
            new(){IATA="GSP",Name="Greenville-Spartanburg Intl",City="Greenville",Country="United States",Latitude=34.8957,Longitude=-82.2190},
            new(){IATA="HSV",Name="Huntsville Intl",City="Huntsville",Country="United States",Latitude=34.6372,Longitude=-86.7751},
            new(){IATA="LFT",Name="Lafayette Regional",City="Lafayette",Country="United States",Latitude=30.2053,Longitude=-91.9876},
            new(){IATA="LGB",Name="Long Beach Airport",City="Long Beach",Country="United States",Latitude=33.8177,Longitude=-118.1516},
            new(){IATA="MHT",Name="Manchester-Boston Regional",City="Manchester",Country="United States",Latitude=42.9326,Longitude=-71.4357},
            new(){IATA="MKE",Name="Milwaukee Mitchell Intl",City="Milwaukee",Country="United States",Latitude=42.9472,Longitude=-87.8966},
            new(){IATA="MOB",Name="Mobile Regional Airport",City="Mobile",Country="United States",Latitude=30.6913,Longitude=-88.2428},
            new(){IATA="MSN",Name="Dane County Regional",City="Madison",Country="United States",Latitude=43.1399,Longitude=-89.3375},
            new(){IATA="MTJ",Name="Montrose Regional Airport",City="Montrose",Country="United States",Latitude=38.5098,Longitude=-107.8938},
            new(){IATA="PFN",Name="Panama City-Bay County Intl",City="Panama City",Country="United States",Latitude=30.2121,Longitude=-85.6828},
            new(){IATA="ROC",Name="Greater Rochester Intl",City="Rochester",Country="United States",Latitude=43.1189,Longitude=-77.6724},
            new(){IATA="SBN",Name="South Bend Intl",City="South Bend",Country="United States",Latitude=41.7087,Longitude=-86.3173},
            new(){IATA="SGF",Name="Springfield-Branson National",City="Springfield",Country="United States",Latitude=37.2457,Longitude=-93.3886},
            new(){IATA="SYR",Name="Syracuse Hancock Intl",City="Syracuse",Country="United States",Latitude=43.1112,Longitude=-76.1062},

            // ── MORE CANADA ───────────────────────────────────────────────────
            new(){IATA="YQB",Name="Quebec City Jean Lesage Intl",City="Quebec City",Country="Canada",Latitude=46.7911,Longitude=-71.3933},
            new(){IATA="YWG",Name="Winnipeg James Armstrong Richardson Intl",City="Winnipeg",Country="Canada",Latitude=49.9100,Longitude=-97.2399},
            new(){IATA="YXE",Name="Saskatoon John G. Diefenbaker Intl",City="Saskatoon",Country="Canada",Latitude=52.1708,Longitude=-106.6997},
            new(){IATA="YXU",Name="London International Airport",City="London",Country="Canada",Latitude=43.0356,Longitude=-81.1531},
            new(){IATA="YQR",Name="Regina International Airport",City="Regina",Country="Canada",Latitude=50.4319,Longitude=-104.6658},
            new(){IATA="YKF",Name="Region of Waterloo International Airport",City="Waterloo",Country="Canada",Latitude=43.4608,Longitude=-80.3786},
            new(){IATA="YXY",Name="Erik Nielsen Whitehorse Intl",City="Whitehorse",Country="Canada",Latitude=60.7096,Longitude=-135.0674},
            new(){IATA="YZF",Name="Yellowknife Airport",City="Yellowknife",Country="Canada",Latitude=62.4628,Longitude=-114.4403},
            new(){IATA="YFC",Name="Fredericton International Airport",City="Fredericton",Country="Canada",Latitude=45.8689,Longitude=-66.5372},
            new(){IATA="YQM",Name="Greater Moncton Roméo LeBlanc Intl",City="Moncton",Country="Canada",Latitude=46.1122,Longitude=-64.6786},

            // ── CARIBBEAN EXTRA ───────────────────────────────────────────────
            new(){IATA="ANU",Name="V.C. Bird Intl Airport",City="Antigua",Country="Antigua and Barbuda",Latitude=17.1367,Longitude=-61.7927},
            new(){IATA="BGI",Name="Grantley Adams Intl Airport",City="Bridgetown",Country="Barbados",Latitude=13.0746,Longitude=-59.4925},
            new(){IATA="GEO",Name="Cheddi Jagan Intl Airport",City="Georgetown",Country="Guyana",Latitude=6.4985,Longitude=-58.2541},
            new(){IATA="POS",Name="Piarco Intl Airport",City="Port of Spain",Country="Trinidad and Tobago",Latitude=10.5954,Longitude=-61.3372},
            new(){IATA="PTP",Name="Pointe-à-Pitre Le Raizet",City="Pointe-à-Pitre",Country="Guadeloupe",Latitude=16.2653,Longitude=-61.5318},
            new(){IATA="SXM",Name="Princess Juliana Intl Airport",City="Saint Martin",Country="Sint Maarten",Latitude=18.0410,Longitude=-63.1089},
            new(){IATA="UVF",Name="Hewanorra Intl Airport",City="Vieux Fort",Country="Saint Lucia",Latitude=13.7332,Longitude=-60.9526},
            new(){IATA="AUA",Name="Queen Beatrix Intl Airport",City="Oranjestad",Country="Aruba",Latitude=12.5014,Longitude=-70.0152},
            new(){IATA="CUR",Name="Hato Intl Airport",City="Willemstad",Country="Curaçao",Latitude=12.1889,Longitude=-68.9598},

            // ── MORE SOUTH AMERICA ────────────────────────────────────────────
            new(){IATA="BEL",Name="Val de Cans Intl Airport",City="Belém",Country="Brazil",Latitude=-1.3792,Longitude=-48.4763},
            new(){IATA="CWB",Name="Afonso Pena Intl Airport",City="Curitiba",Country="Brazil",Latitude=-25.5285,Longitude=-49.1758},
            new(){IATA="FLN",Name="Hercílio Luz Intl Airport",City="Florianópolis",Country="Brazil",Latitude=-27.6703,Longitude=-48.5525},
            new(){IATA="MAO",Name="Eduardo Gomes Intl Airport",City="Manaus",Country="Brazil",Latitude=-3.0386,Longitude=-60.0497},
            new(){IATA="NAT",Name="Governador Aluízio Alves Intl",City="Natal",Country="Brazil",Latitude=-5.9111,Longitude=-35.2478},
            new(){IATA="POA",Name="Salgado Filho Intl Airport",City="Porto Alegre",Country="Brazil",Latitude=-29.9944,Longitude=-51.1714},
            new(){IATA="SSA",Name="Deputado Luís Eduardo Magalhães Intl",City="Salvador",Country="Brazil",Latitude=-12.9086,Longitude=-38.3225},
            new(){IATA="PMW",Name="Brigadeiro Lysias Rodrigues Airport",City="Palmas",Country="Brazil",Latitude=-10.2913,Longitude=-48.3569},
            new(){IATA="BGF",Name="Bangui M'Poko Intl Airport",City="Bogotá",Country="Colombia",Latitude=4.4919,Longitude=-74.1469},
            new(){IATA="CLO",Name="Alfonso Bonilla Aragón Intl",City="Cali",Country="Colombia",Latitude=3.5432,Longitude=-76.3816},
            new(){IATA="BAQ",Name="Ernesto Cortissoz Intl",City="Barranquilla",Country="Colombia",Latitude=10.8896,Longitude=-74.7808},
            new(){IATA="AQP",Name="Rodríguez Ballón Intl",City="Arequipa",Country="Peru",Latitude=-16.3411,Longitude=-71.5830},
            new(){IATA="CUZ",Name="Alejandro Velasco Astete Intl",City="Cusco",Country="Peru",Latitude=-13.5357,Longitude=-71.9388},
            new(){IATA="IQT",Name="Coronel Francisco Secada Vignetta Intl",City="Iquitos",Country="Peru",Latitude=-3.7847,Longitude=-73.3088},
            new(){IATA="MHC",Name="Mocopulli Airport",City="Castro",Country="Chile",Latitude=-42.3408,Longitude=-73.7159},
            new(){IATA="IQQ",Name="Diego Aracena Intl Airport",City="Iquique",Country="Chile",Latitude=-20.5352,Longitude=-70.1813},
            new(){IATA="ANF",Name="Cerro Moreno Intl Airport",City="Antofagasta",Country="Chile",Latitude=-23.4445,Longitude=-70.4451},
            new(){IATA="CBB",Name="Jorge Wilstermann Intl",City="Cochabamba",Country="Bolivia",Latitude=-17.4211,Longitude=-66.1771},
            new(){IATA="SUC",Name="Sucre Airport",City="Sucre",Country="Bolivia",Latitude=-19.0071,Longitude=-65.2885},
            new(){IATA="VCP",Name="Campinas Viracopos Intl",City="Campinas",Country="Brazil",Latitude=-23.0074,Longitude=-47.1345},

            // ── MORE EUROPE ───────────────────────────────────────────────────
            new(){IATA="AGP",Name="Málaga-Costa del Sol Airport",City="Málaga",Country="Spain",Latitude=36.6749,Longitude=-4.4991},
            new(){IATA="ALC",Name="Alicante-Elche Miguel Hernández",City="Alicante",Country="Spain",Latitude=38.2822,Longitude=-0.5582},
            new(){IATA="PMI",Name="Palma de Mallorca Airport",City="Palma",Country="Spain",Latitude=39.5517,Longitude=2.7388},
            new(){IATA="IBZ",Name="Ibiza Airport",City="Ibiza",Country="Spain",Latitude=38.8729,Longitude=1.3733},
            new(){IATA="TFS",Name="Tenerife South Airport",City="Tenerife",Country="Spain",Latitude=28.0445,Longitude=-16.5725},
            new(){IATA="LPA",Name="Gran Canaria Airport",City="Las Palmas",Country="Spain",Latitude=27.9319,Longitude=-15.3866},
            new(){IATA="FUE",Name="Fuerteventura Airport",City="Fuerteventura",Country="Spain",Latitude=28.4527,Longitude=-13.8638},
            new(){IATA="ACE",Name="Lanzarote Airport",City="Lanzarote",Country="Spain",Latitude=28.9455,Longitude=-13.6052},
            new(){IATA="SVQ",Name="Seville Airport",City="Seville",Country="Spain",Latitude=37.4180,Longitude=-5.8931},
            new(){IATA="VLC",Name="Valencia Airport",City="Valencia",Country="Spain",Latitude=39.4893,Longitude=-0.4816},
            new(){IATA="BIO",Name="Bilbao Airport",City="Bilbao",Country="Spain",Latitude=43.3011,Longitude=-2.9106},
            new(){IATA="SDR",Name="Santander Airport",City="Santander",Country="Spain",Latitude=43.4272,Longitude=-3.8200},
            new(){IATA="FAO",Name="Faro Airport",City="Faro",Country="Portugal",Latitude=37.0144,Longitude=-7.9659},
            new(){IATA="FNC",Name="Madeira Airport",City="Funchal",Country="Portugal",Latitude=32.6979,Longitude=-16.7745},
            new(){IATA="PDL",Name="João Paulo II Airport",City="Ponta Delgada",Country="Portugal",Latitude=37.7412,Longitude=-25.6979},
            new(){IATA="TER",Name="Lajes Airport",City="Terceira",Country="Portugal",Latitude=38.7620,Longitude=-27.0908},
            new(){IATA="CFU",Name="Ioannis Kapodistrias Intl",City="Corfu",Country="Greece",Latitude=39.6019,Longitude=19.9117},
            new(){IATA="RHO",Name="Diagoras Airport",City="Rhodes",Country="Greece",Latitude=36.4054,Longitude=28.0862},
            new(){IATA="KGS",Name="Kos Island Intl Airport",City="Kos",Country="Greece",Latitude=36.7933,Longitude=27.0917},
            new(){IATA="MJT",Name="Mytilene Intl Airport",City="Mytilene",Country="Greece",Latitude=39.0567,Longitude=26.5983},
            new(){IATA="JMK",Name="Mikonos Airport",City="Mykonos",Country="Greece",Latitude=37.4351,Longitude=25.3481},
            new(){IATA="JTR",Name="Thira Airport",City="Santorini",Country="Greece",Latitude=36.3992,Longitude=25.4793},
            new(){IATA="CHQ",Name="Chania Intl Airport",City="Chania",Country="Greece",Latitude=35.5317,Longitude=24.1497},
            new(){IATA="MLA",Name="Malta Intl Airport",City="Valletta",Country="Malta",Latitude=35.8574,Longitude=14.4775},
            new(){IATA="LCA",Name="Larnaca Intl Airport",City="Larnaca",Country="Cyprus",Latitude=34.8751,Longitude=33.6249},
            new(){IATA="PFO",Name="Paphos Intl Airport",City="Paphos",Country="Cyprus",Latitude=34.7180,Longitude=32.4857},
            new(){IATA="TGD",Name="Podgorica Airport",City="Podgorica",Country="Montenegro",Latitude=42.3594,Longitude=19.2519},
            new(){IATA="TIV",Name="Tivat Airport",City="Tivat",Country="Montenegro",Latitude=42.4047,Longitude=18.7233},
            new(){IATA="DBV",Name="Dubrovnik Airport",City="Dubrovnik",Country="Croatia",Latitude=42.5614,Longitude=18.2682},
            new(){IATA="SPU",Name="Split Airport",City="Split",Country="Croatia",Latitude=43.5389,Longitude=16.2980},
            new(){IATA="ZAG",Name="Zagreb Airport",City="Zagreb",Country="Croatia",Latitude=45.7429,Longitude=16.0688},
            new(){IATA="LJU",Name="Ljubljana Jože Pučnik Airport",City="Ljubljana",Country="Slovenia",Latitude=46.2237,Longitude=14.4576},
            new(){IATA="BTS",Name="Bratislava Airport",City="Bratislava",Country="Slovakia",Latitude=48.1702,Longitude=17.2127},
            new(){IATA="KSC",Name="Kosice Airport",City="Kosice",Country="Slovakia",Latitude=48.6631,Longitude=21.2411},
            new(){IATA="CLJ",Name="Cluj-Napoca International Airport",City="Cluj-Napoca",Country="Romania",Latitude=46.7852,Longitude=23.6862},
            new(){IATA="TSR",Name="Timisoara Traian Vuia Intl",City="Timisoara",Country="Romania",Latitude=45.8099,Longitude=21.3379},
            new(){IATA="IAS",Name="Iasi Intl Airport",City="Iași",Country="Romania",Latitude=47.1783,Longitude=27.6206},
            new(){IATA="VAR",Name="Varna Airport",City="Varna",Country="Bulgaria",Latitude=43.2321,Longitude=27.8251},
            new(){IATA="BOJ",Name="Burgas Airport",City="Burgas",Country="Bulgaria",Latitude=42.5696,Longitude=27.5152},
            new(){IATA="LWO",Name="Lviv Danylo Halytskyi Intl",City="Lviv",Country="Ukraine",Latitude=49.8125,Longitude=23.9561},
            new(){IATA="ODS",Name="Odessa Intl Airport",City="Odessa",Country="Ukraine",Latitude=46.4268,Longitude=30.6765},
            new(){IATA="HRK",Name="Kharkiv Intl Airport",City="Kharkiv",Country="Ukraine",Latitude=49.9248,Longitude=36.2900},
            new(){IATA="GYD",Name="Heydar Aliyev Intl Airport",City="Baku",Country="Azerbaijan",Latitude=40.4675,Longitude=50.0467},
            new(){IATA="EVN",Name="Zvartnots Intl Airport",City="Yerevan",Country="Armenia",Latitude=40.1473,Longitude=44.3959},
            new(){IATA="TBS",Name="Tbilisi Intl Airport",City="Tbilisi",Country="Georgia",Latitude=41.6693,Longitude=44.9547},
            new(){IATA="MSQ",Name="Minsk Intl Airport 2",City="Minsk",Country="Belarus",Latitude=53.8825,Longitude=28.0307},
            new(){IATA="RIX",Name="Riga Intl Airport",City="Riga",Country="Latvia",Latitude=56.9236,Longitude=23.9711},
            new(){IATA="KUN",Name="Kaunas Airport",City="Kaunas",Country="Lithuania",Latitude=54.9639,Longitude=24.0848},
            new(){IATA="PLQ",Name="Palanga Intl Airport",City="Palanga",Country="Lithuania",Latitude=55.9733,Longitude=21.0939},
            new(){IATA="TLL",Name="Tallinn Airport",City="Tallinn",Country="Estonia",Latitude=59.4133,Longitude=24.8328},
            new(){IATA="TMP",Name="Tampere-Pirkkala Airport",City="Tampere",Country="Finland",Latitude=61.4141,Longitude=23.6044},
            new(){IATA="OUL",Name="Oulu Airport",City="Oulu",Country="Finland",Latitude=64.9301,Longitude=25.3546},
            new(){IATA="TRD",Name="Trondheim Vaernes Airport",City="Trondheim",Country="Norway",Latitude=63.4578,Longitude=10.9239},
            new(){IATA="TRF",Name="Oslo Torp Sandefjord Airport",City="Tønsberg",Country="Norway",Latitude=59.1867,Longitude=10.2586},
            new(){IATA="SVG",Name="Stavanger Airport",City="Stavanger",Country="Norway",Latitude=58.8768,Longitude=5.6378},
            new(){IATA="MMX",Name="Malmö Airport",City="Malmö",Country="Sweden",Latitude=55.5363,Longitude=13.3762},
            new(){IATA="LLA",Name="Luleå Airport",City="Luleå",Country="Sweden",Latitude=65.5438,Longitude=22.1220},

            // ── MORE MIDDLE EAST ──────────────────────────────────────────────
            new(){IATA="SHJ",Name="Sharjah Intl Airport",City="Sharjah",Country="UAE",Latitude=25.3286,Longitude=55.5172},
            new(){IATA="AAN",Name="Al Ain Intl Airport",City="Al Ain",Country="UAE",Latitude=24.2617,Longitude=55.6092},
            new(){IATA="GWD",Name="Gwadar Intl Airport",City="Gwadar",Country="Pakistan",Latitude=25.2333,Longitude=62.3295},
            new(){IATA="NJF",Name="Al Najaf Intl Airport",City="Najaf",Country="Iraq",Latitude=31.9891,Longitude=44.3966},
            new(){IATA="BSR",Name="Basra Intl Airport",City="Basra",Country="Iraq",Latitude=30.5491,Longitude=47.6621},
            new(){IATA="ERB",Name="Erbil Intl Airport",City="Erbil",Country="Iraq",Latitude=36.2376,Longitude=43.9632},
            new(){IATA="ALP",Name="Aleppo Intl Airport",City="Aleppo",Country="Syria",Latitude=36.1807,Longitude=37.2244},
            new(){IATA="MHD",Name="Mashhad Intl Airport",City="Mashhad",Country="Iran",Latitude=36.2352,Longitude=59.6410},
            new(){IATA="SYZ",Name="Shiraz Intl Airport",City="Shiraz",Country="Iran",Latitude=29.5392,Longitude=52.5898},
            new(){IATA="AWZ",Name="Ahvaz Intl Airport",City="Ahvaz",Country="Iran",Latitude=31.3374,Longitude=48.7620},
            new(){IATA="GYD",Name="Heydar Aliyev Intl Airport",City="Baku",Country="Azerbaijan",Latitude=40.4675,Longitude=50.0467},
            new(){IATA="SAH",Name="Sana'a Intl Airport",City="Sana'a",Country="Yemen",Latitude=15.4763,Longitude=44.2197},
            new(){IATA="ADE",Name="Aden Intl Airport",City="Aden",Country="Yemen",Latitude=12.8295,Longitude=45.0288},

            // ── MORE AFRICA ───────────────────────────────────────────────────
            new(){IATA="ABM",Name="Bamako-Sénou Intl Airport",City="Bamako",Country="Mali",Latitude=12.5335,Longitude=-7.9499},
            new(){IATA="OUA",Name="Ouagadougou Airport",City="Ouagadougou",Country="Burkina Faso",Latitude=12.3532,Longitude=-1.5124},
            new(){IATA="MLW",Name="Spriggs Payne Airport",City="Monrovia",Country="Liberia",Latitude=6.2890,Longitude=-10.7587},
            new(){IATA="FNA",Name="Lungi Intl Airport",City="Freetown",Country="Sierra Leone",Latitude=8.6164,Longitude=-13.1956},
            new(){IATA="ROB",Name="Roberts Intl Airport",City="Monrovia",Country="Liberia",Latitude=6.2338,Longitude=-10.3623},
            new(){IATA="SSG",Name="Santa Isabel Airport",City="Malabo",Country="Equatorial Guinea",Latitude=3.7553,Longitude=8.7087},
            new(){IATA="LBV",Name="Libreville Intl Airport",City="Libreville",Country="Gabon",Latitude=0.4586,Longitude=9.4123},
            new(){IATA="BZV",Name="Maya-Maya Airport",City="Brazzaville",Country="Republic of the Congo",Latitude=-4.2517,Longitude=15.2531},
            new(){IATA="FIH",Name="N'Djili Intl Airport",City="Kinshasa",Country="DR Congo",Latitude=-4.3857,Longitude=15.4446},
            new(){IATA="FBM",Name="Lubumbashi Intl Airport",City="Lubumbashi",Country="DR Congo",Latitude=-11.5913,Longitude=27.5308},
            new(){IATA="BGF",Name="Bangui M'Poko Intl Airport",City="Bangui",Country="Central African Republic",Latitude=4.3985,Longitude=18.5188},
            new(){IATA="NDJ",Name="Hassan Djamous Intl Airport",City="N'Djamena",Country="Chad",Latitude=12.1337,Longitude=15.0340},
            new(){IATA="NIM",Name="Diori Hamani Intl Airport",City="Niamey",Country="Niger",Latitude=13.4815,Longitude=2.1836},
            new(){IATA="BKO",Name="Modibo Keïta Intl Airport",City="Bamako",Country="Mali",Latitude=12.5335,Longitude=-7.9499},
            new(){IATA="CKY",Name="Conakry Intl Airport",City="Conakry",Country="Guinea",Latitude=9.5769,Longitude=-13.6120},
            new(){IATA="BXO",Name="Burao Airport",City="Burao",Country="Somalia",Latitude=9.5253,Longitude=45.5550},
            new(){IATA="BBO",Name="Berbera Airport",City="Berbera",Country="Somalia",Latitude=10.3892,Longitude=44.9411},
            new(){IATA="BJL",Name="Banjul Intl Airport",City="Banjul",Country="Gambia",Latitude=13.3380,Longitude=-16.6522},
            new(){IATA="OXB",Name="Osvaldo Vieira Intl Airport",City="Bissau",Country="Guinea-Bissau",Latitude=11.8948,Longitude=-15.6536},
            new(){IATA="ISL",Name="Sal Intl Airport",City="Espargos",Country="Cape Verde",Latitude=16.7415,Longitude=-22.9495},
            new(){IATA="RAI",Name="Francisco Mendes Intl Airport",City="Praia",Country="Cape Verde",Latitude=14.9245,Longitude=-23.4935},
            new(){IATA="SID",Name="Amílcar Cabral Intl Airport",City="Sal",Country="Cape Verde",Latitude=16.7415,Longitude=-22.9495},
            new(){IATA="ARE",Name="Antisiranana Airport",City="Antsiranana",Country="Madagascar",Latitude=-12.3532,Longitude=49.2916},
            new(){IATA="RUN",Name="Roland Garros Airport",City="Saint-Denis",Country="Réunion",Latitude=-20.8871,Longitude=55.5103},
            new(){IATA="ETA",Name="Eldoret International Airport",City="Eldoret",Country="Kenya",Latitude=0.4045,Longitude=35.2389},
            new(){IATA="KIS",Name="Kisumu Intl Airport",City="Kisumu",Country="Kenya",Latitude=-0.0861,Longitude=34.7289},
            new(){IATA="LKO",Name="Chaudhary Charan Singh Intl",City="Lucknow",Country="India",Latitude=26.7606,Longitude=80.8893},
            new(){IATA="BDQ",Name="Vadodara Airport",City="Vadodara",Country="India",Latitude=22.3362,Longitude=73.2263},
            new(){IATA="IXC",Name="Shaheed Bhagat Singh Intl",City="Chandigarh",Country="India",Latitude=30.6735,Longitude=76.7885},
            new(){IATA="JAI",Name="Jaipur Intl Airport",City="Jaipur",Country="India",Latitude=26.8242,Longitude=75.8122},
            new(){IATA="NAG",Name="Dr. Babasaheb Ambedkar Intl",City="Nagpur",Country="India",Latitude=21.0922,Longitude=79.0472},
            new(){IATA="PAT",Name="Jay Prakash Narayan Intl Airport",City="Patna",Country="India",Latitude=25.5913,Longitude=85.0880},
            new(){IATA="BHO",Name="Raja Bhoj Airport",City="Bhopal",Country="India",Latitude=23.2875,Longitude=77.3374},
            new(){IATA="GAU",Name="Lokpriya Gopinath Bordoloi Intl",City="Guwahati",Country="India",Latitude=26.1061,Longitude=91.5859},
            new(){IATA="IXJ",Name="Jammu Airport",City="Jammu",Country="India",Latitude=32.6891,Longitude=74.8374},
            new(){IATA="SXR",Name="Sheikh ul-Alam Intl Airport",City="Srinagar",Country="India",Latitude=33.9871,Longitude=74.7742},
            new(){IATA="IXB",Name="Bagdogra Airport",City="Siliguri",Country="India",Latitude=26.6812,Longitude=88.3286},
            new(){IATA="VNS",Name="Lal Bahadur Shastri Intl Airport",City="Varanasi",Country="India",Latitude=25.4524,Longitude=82.8593},
            new(){IATA="VGA",Name="Vijayawada Airport",City="Vijayawada",Country="India",Latitude=16.5303,Longitude=80.7968},
            new(){IATA="TRZ",Name="Tiruchirappalli Intl Airport",City="Tiruchirappalli",Country="India",Latitude=10.7654,Longitude=78.7097},
            new(){IATA="IXZ",Name="Veer Savarkar Intl Airport",City="Port Blair",Country="India",Latitude=11.6412,Longitude=92.7296},
            new(){IATA="UDR",Name="Maharana Pratap Airport",City="Udaipur",Country="India",Latitude=24.6177,Longitude=73.8961},

            // ── MORE SOUTHEAST ASIA ───────────────────────────────────────────
            new(){IATA="LGK",Name="Langkawi Intl Airport",City="Langkawi",Country="Malaysia",Latitude=6.3296,Longitude=99.7287},
            new(){IATA="JHB",Name="Senai Intl Airport",City="Johor Bahru",Country="Malaysia",Latitude=1.6413,Longitude=103.6698},
            new(){IATA="BKI",Name="Kota Kinabalu Intl Airport",City="Kota Kinabalu",Country="Malaysia",Latitude=5.9372,Longitude=116.0512},
            new(){IATA="KCH",Name="Kuching Intl Airport",City="Kuching",Country="Malaysia",Latitude=1.4847,Longitude=110.3469},
            new(){IATA="MYY",Name="Miri Airport",City="Miri",Country="Malaysia",Latitude=4.3220,Longitude=113.9869},
            new(){IATA="TGG",Name="Sultan Mahmud Airport",City="Kuala Terengganu",Country="Malaysia",Latitude=5.3826,Longitude=103.1034},
            new(){IATA="UTH",Name="Udon Thani Intl Airport",City="Udon Thani",Country="Thailand",Latitude=17.3864,Longitude=102.7883},
            new(){IATA="KKC",Name="Khon Kaen Airport",City="Khon Kaen",Country="Thailand",Latitude=16.4666,Longitude=102.7836},
            new(){IATA="USM",Name="Samui Airport",City="Koh Samui",Country="Thailand",Latitude=9.5479,Longitude=100.0629},
            new(){IATA="KBV",Name="Krabi Airport",City="Krabi",Country="Thailand",Latitude=8.0992,Longitude=98.9862},
            new(){IATA="NAW",Name="Narathiwat Airport",City="Narathiwat",Country="Thailand",Latitude=6.5199,Longitude=101.7432},
            new(){IATA="BPN",Name="Sultan Aji Muhammad Sulaiman Sepinggan",City="Balikpapan",Country="Indonesia",Latitude=-1.2683,Longitude=116.8942},
            new(){IATA="MDC",Name="Sam Ratulangi Intl Airport",City="Manado",Country="Indonesia",Latitude=1.5493,Longitude=124.9260},
            new(){IATA="AMQ",Name="Pattimura Airport",City="Ambon",Country="Indonesia",Latitude=-3.7103,Longitude=128.0890},
            new(){IATA="TIM",Name="Moses Kilangin Airport",City="Timika",Country="Indonesia",Latitude=-4.5283,Longitude=136.8870},
            new(){IATA="DJJ",Name="Sentani Airport",City="Jayapura",Country="Indonesia",Latitude=-2.5769,Longitude=140.5163},
            new(){IATA="PKU",Name="Sultan Syarif Kasim II Intl",City="Pekanbaru",Country="Indonesia",Latitude=0.4608,Longitude=101.4449},
            new(){IATA="PLM",Name="Sultan Mahmud Badaruddin II Intl",City="Palembang",Country="Indonesia",Latitude=-2.8983,Longitude=104.6999},
            new(){IATA="PDG",Name="Minangkabau Intl Airport",City="Padang",Country="Indonesia",Latitude=-0.7869,Longitude=100.2808},
            new(){IATA="GTO",Name="Jalaluddin Airport",City="Gorontalo",Country="Indonesia",Latitude=0.6372,Longitude=122.8498},
            new(){IATA="CXB",Name="Cox's Bazar Airport",City="Cox's Bazar",Country="Bangladesh",Latitude=21.4522,Longitude=91.9639},
            new(){IATA="ZYL",Name="Sylhet Osmani Intl Airport",City="Sylhet",Country="Bangladesh",Latitude=24.9632,Longitude=91.8676},
            new(){IATA="CGP",Name="Shah Amanat Intl Airport",City="Chittagong",Country="Bangladesh",Latitude=22.2496,Longitude=91.8133},
            new(){IATA="RJH",Name="Shah Makhdum Airport",City="Rajshahi",Country="Bangladesh",Latitude=24.4372,Longitude=88.6165},
            new(){IATA="VCA",Name="Can Tho Intl Airport",City="Cần Thơ",Country="Vietnam",Latitude=10.0851,Longitude=105.7119},
            new(){IATA="HPH",Name="Cat Bi Intl Airport",City="Hai Phong",Country="Vietnam",Latitude=20.8194,Longitude=106.7249},
            new(){IATA="PQC",Name="Phu Quoc Intl Airport",City="Phú Quốc",Country="Vietnam",Latitude=10.2270,Longitude=103.9669},
            new(){IATA="CXR",Name="Cam Ranh Intl Airport",City="Nha Trang",Country="Vietnam",Latitude=11.9982,Longitude=109.2194},

            // ── MORE EAST ASIA ────────────────────────────────────────────────
            new(){IATA="TAO",Name="Qingdao Jiaodong Intl Airport",City="Qingdao",Country="China",Latitude=36.3661,Longitude=120.0882},
            new(){IATA="HGH",Name="Hangzhou Xiaoshan Intl Airport",City="Hangzhou",Country="China",Latitude=30.2295,Longitude=120.4340},
            new(){IATA="XMN",Name="Xiamen Gaoqi Intl Airport",City="Xiamen",Country="China",Latitude=24.5440,Longitude=118.1277},
            new(){IATA="SHE",Name="Shenyang Taoxian Intl Airport",City="Shenyang",Country="China",Latitude=41.6398,Longitude=123.4832},
            new(){IATA="DLC",Name="Dalian Zhoushuizi Intl Airport",City="Dalian",Country="China",Latitude=38.9657,Longitude=121.5386},
            new(){IATA="HRB",Name="Harbin Taiping Intl Airport",City="Harbin",Country="China",Latitude=45.6234,Longitude=126.2501},
            new(){IATA="CGQ",Name="Changchun Longjia Intl Airport",City="Changchun",Country="China",Latitude=43.9962,Longitude=125.6845},
            new(){IATA="TNA",Name="Jinan Yaoqiang Intl Airport",City="Jinan",Country="China",Latitude=36.8572,Longitude=117.2158},
            new(){IATA="CGO",Name="Zhengzhou Xinzheng Intl Airport",City="Zhengzhou",Country="China",Latitude=34.5197,Longitude=113.8409},
            new(){IATA="NKG",Name="Nanjing Lukou Intl Airport",City="Nanjing",Country="China",Latitude=31.7420,Longitude=118.8620},
            new(){IATA="NNG",Name="Nanning Wuxu Intl Airport",City="Nanning",Country="China",Latitude=22.6083,Longitude=108.1722},
            new(){IATA="HAK",Name="Haikou Meilan Intl Airport",City="Haikou",Country="China",Latitude=19.9349,Longitude=110.4589},
            new(){IATA="SYX",Name="Sanya Phoenix Intl Airport",City="Sanya",Country="China",Latitude=18.3029,Longitude=109.4122},
            new(){IATA="LHW",Name="Lanzhou Zhongchuan Intl Airport",City="Lanzhou",Country="China",Latitude=36.5152,Longitude=103.6204},
            new(){IATA="XNN",Name="Xining Caojiabu Airport",City="Xining",Country="China",Latitude=36.5275,Longitude=102.0430},
            new(){IATA="INC",Name="Yinchuan Hedong Intl Airport",City="Yinchuan",Country="China",Latitude=38.3228,Longitude=106.0093},
            new(){IATA="HFE",Name="Hefei Xinqiao Intl Airport",City="Hefei",Country="China",Latitude=31.9799,Longitude=116.9968},
            new(){IATA="KWE",Name="Guiyang Longdongbao Intl Airport",City="Guiyang",Country="China",Latitude=26.5385,Longitude=106.8010},
            new(){IATA="KWL",Name="Guilin Liangjiang Intl Airport",City="Guilin",Country="China",Latitude=25.2181,Longitude=110.0391},
            new(){IATA="WNZ",Name="Wenzhou Longwan Intl Airport",City="Wenzhou",Country="China",Latitude=27.9122,Longitude=120.8522},
            new(){IATA="TXN",Name="Huangshan Tunxi Intl Airport",City="Huangshan",Country="China",Latitude=29.7333,Longitude=118.2556},
            new(){IATA="MXZ",Name="Meizhou Airport",City="Meizhou",Country="China",Latitude=24.3500,Longitude=116.1333},
            new(){IATA="OKJ",Name="Okayama Airport",City="Okayama",Country="Japan",Latitude=34.7569,Longitude=133.8551},
            new(){IATA="HIJ",Name="Hiroshima Airport",City="Hiroshima",Country="Japan",Latitude=34.4361,Longitude=132.9192},
            new(){IATA="MYJ",Name="Matsuyama Airport",City="Matsuyama",Country="Japan",Latitude=33.8272,Longitude=132.7000},
            new(){IATA="KMQ",Name="Komatsu Airport",City="Komatsu",Country="Japan",Latitude=36.3946,Longitude=136.4066},
            new(){IATA="AOJ",Name="Aomori Airport",City="Aomori",Country="Japan",Latitude=40.7347,Longitude=140.6909},
            new(){IATA="KOJ",Name="Kagoshima Airport",City="Kagoshima",Country="Japan",Latitude=31.8034,Longitude=130.7194},
            new(){IATA="KMI",Name="Miyazaki Airport",City="Miyazaki",Country="Japan",Latitude=31.8772,Longitude=131.4493},
            new(){IATA="TYO",Name="Tokyo (all airports)",City="Tokyo",Country="Japan",Latitude=35.6762,Longitude=139.6503},
            new(){IATA="WUX",Name="Wuxi Sunan Shuofang Intl Airport",City="Wuxi",Country="China",Latitude=31.4944,Longitude=120.4291},
            new(){IATA="YNJ",Name="Yanji Chaoyangchuan Intl Airport",City="Yanji",Country="China",Latitude=42.8828,Longitude=129.4512},
            new(){IATA="KHN",Name="Nanchang Changbei Intl Airport",City="Nanchang",Country="China",Latitude=28.8650,Longitude=115.9000},

            // ── MORE PACIFIC & OCEANIA ────────────────────────────────────────
            new(){IATA="INU",Name="Nauru Intl Airport",City="Yaren",Country="Nauru",Latitude=-0.5470,Longitude=166.9191},
            new(){IATA="MNI",Name="John A. Osborne Airport",City="Brades",Country="Montserrat",Latitude=16.7914,Longitude=-62.1933},
            new(){IATA="RAR",Name="Rarotonga Intl Airport",City="Avarua",Country="Cook Islands",Latitude=-21.2026,Longitude=-159.8056},
            new(){IATA="TBU",Name="Fua'amotu Intl Airport",City="Nukuʻalofa",Country="Tonga",Latitude=-21.2412,Longitude=-175.1496},
            new(){IATA="VLI",Name="Bauerfield Intl Airport",City="Port Vila",Country="Vanuatu",Latitude=-17.6993,Longitude=168.3201},
            new(){IATA="HIR",Name="Honiara Intl Airport",City="Honiara",Country="Solomon Islands",Latitude=-9.4280,Longitude=160.0548},
            new(){IATA="POM",Name="Port Moresby Jackson Intl",City="Port Moresby",Country="Papua New Guinea",Latitude=-9.4434,Longitude=147.2200},
            new(){IATA="LAE",Name="Nadzab Airport",City="Lae",Country="Papua New Guinea",Latitude=-6.5699,Longitude=146.7260},
            new(){IATA="MAJ",Name="Marshall Islands Intl Airport",City="Majuro",Country="Marshall Islands",Latitude=7.0648,Longitude=171.2723},
            new(){IATA="TRW",Name="Bonriki Intl Airport",City="Tarawa",Country="Kiribati",Latitude=1.3816,Longitude=173.1468},
            new(){IATA="FUN",Name="Funafuti Intl Airport",City="Funafuti",Country="Tuvalu",Latitude=-8.5250,Longitude=179.1960},
            new(){IATA="SUV",Name="Nausori Intl Airport",City="Suva",Country="Fiji",Latitude=-18.0433,Longitude=178.5590},
            new(){IATA="CXI",Name="Cassidy Intl Airport",City="Kiritimati",Country="Kiribati",Latitude=1.9861,Longitude=-157.3500},
            new(){IATA="PHO",Name="Point Hope Airport",City="Point Hope",Country="United States",Latitude=68.3488,Longitude=-166.7987},
        };

        await db.Airports.AddRangeAsync(airports);
        await db.SaveChangesAsync();

        // ─── AIRLINES ─────────────────────────────────────────────────────────
        var airlines = new List<Airline>
        {
            new(){Code="EK",Name="Emirates",             Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/160px-Emirates_logo.svg.png"},
            new(){Code="QR",Name="Qatar Airways",        Logo="https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/160px-Qatar_Airways_Logo.svg.png"},
            new(){Code="SQ",Name="Singapore Airlines",   Logo="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/160px-Singapore_Airlines_Logo_2.svg.png"},
            new(){Code="LH",Name="Lufthansa",            Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lufthansa_Logo_2018.svg/160px-Lufthansa_Logo_2018.svg.png"},
            new(){Code="BA",Name="British Airways",      Logo="https://upload.wikimedia.org/wikipedia/en/thumb/4/42/British_Airways_Logo.svg/160px-British_Airways_Logo.svg.png"},
            new(){Code="UA",Name="United Airlines",      Logo="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/United_Airlines_Logo.svg/160px-United_Airlines_Logo.svg.png"},
            new(){Code="AA",Name="American Airlines",    Logo="https://upload.wikimedia.org/wikipedia/en/thumb/2/23/American_Airlines_logo_2013.svg/160px-American_Airlines_logo_2013.svg.png"},
            new(){Code="AF",Name="Air France",           Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/160px-Air_France_Logo.svg.png"},
            new(){Code="CX",Name="Cathay Pacific",       Logo="https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Cathay_Pacific_logo.svg/160px-Cathay_Pacific_logo.svg.png"},
            new(){Code="TK",Name="Turkish Airlines",     Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Turkish_Airlines_logo_2019_compact.svg/160px-Turkish_Airlines_logo_2019_compact.svg.png"},
            new(){Code="DL",Name="Delta Air Lines",      Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/160px-Delta_logo.svg.png"},
            new(){Code="EY",Name="Etihad Airways",       Logo="https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Etihad_Airways_Logo.svg/160px-Etihad_Airways_Logo.svg.png"},
            new(){Code="KE",Name="Korean Air",           Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Korean_Air_Logo.svg/160px-Korean_Air_Logo.svg.png"},
            new(){Code="NH",Name="ANA All Nippon Airways",Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/All_Nippon_Airways_Logo.svg/160px-All_Nippon_Airways_Logo.svg.png"},
            new(){Code="JL",Name="Japan Airlines",       Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Japan_Airlines_logo_%282011%29.svg/160px-Japan_Airlines_logo_%282011%29.svg.png"},
            new(){Code="MH",Name="Malaysia Airlines",    Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Malaysia_Airlines_Logo.svg/160px-Malaysia_Airlines_Logo.svg.png"},
            new(){Code="GA",Name="Garuda Indonesia",     Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Garuda_Indonesia_Logo.svg/160px-Garuda_Indonesia_Logo.svg.png"},
            new(){Code="FZ",Name="flydubai",             Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Flydubai_logo.svg/160px-Flydubai_logo.svg.png"},
            new(){Code="G8",Name="Air Arabia",           Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Air_Arabia_Logo.svg/160px-Air_Arabia_Logo.svg.png"},
            new(){Code="ET",Name="Ethiopian Airlines",   Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ethiopian_Airlines_Logo.svg/160px-Ethiopian_Airlines_Logo.svg.png"},
            new(){Code="KQ",Name="Kenya Airways",        Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kenya_Airways_Logo.svg/160px-Kenya_Airways_Logo.svg.png"},
            new(){Code="WS",Name="WestJet",              Logo="https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/WestJet_Airlines_logo.svg/160px-WestJet_Airlines_logo.svg.png"},
            new(){Code="AC",Name="Air Canada",           Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Air_Canada_Logo.svg/160px-Air_Canada_Logo.svg.png"},
            new(){Code="LA",Name="LATAM Airlines",       Logo="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/LATAM_Airlines_logo.svg/160px-LATAM_Airlines_logo.svg.png"},
        };

        await db.Airlines.AddRangeAsync(airlines);
        await db.SaveChangesAsync();

        // ─── DEFAULT USERS ────────────────────────────────────────────────────
        if (!db.Users.Any())
        {
            await db.Users.AddRangeAsync(
                new User { Name="Admin", Email="admin@skylux.com", PasswordHash=BCrypt.Net.BCrypt.HashPassword("Admin@123"), Role="Admin" },
                new User { Name="Demo User", Email="demo@skylux.com", PasswordHash=BCrypt.Net.BCrypt.HashPassword("Demo@123"), Role="User" }
            );
            await db.SaveChangesAsync();
        }

        // ─── GENERATE FLIGHTS ─────────────────────────────────────────────────
        var allAirports = await db.Airports.ToListAsync();

        // ─── ROUTES ───────────────────────────────────────────────────────────
        var routes = BuildRoutes();
        // Add hub-spoke routes for every airport not already covered
        var hubRoutes = BuildHubRoutes(allAirports);
        var existingSet = new HashSet<string>(routes.Select(r => $"{r.Item1}|{r.Item2}"));
        foreach (var hr in hubRoutes)
        {
            var key = $"{hr.Item1}|{hr.Item2}";
            if (!existingSet.Contains(key)) { routes.Add(hr); existingSet.Add(key); }
        }
        var allAirlines = await db.Airlines.ToListAsync();
        var rng = new Random(42);
        var airportMap = allAirports.ToDictionary(a => a.IATA);

        var classes     = new[] { "Economy", "Business", "First" };
        var classMul    = new Dictionary<string, decimal> { ["Economy"]=1m, ["Business"]=3.2m, ["First"]=5.5m };
        var flights     = new List<Flight>();

        foreach (var (fromIata, toIata) in routes)
        {
            if (!airportMap.TryGetValue(fromIata, out var dep)) continue;
            if (!airportMap.TryGetValue(toIata,   out var arr)) continue;

            double distKm   = Haversine(dep.Latitude, dep.Longitude, arr.Latitude, arr.Longitude);
            decimal basePx  = (decimal)(distKm * 0.06 + 90);
            int flightMins  = (int)(distKm / 820 * 60) + 55;

            // 5 flights per route per day  (3 classes distributed)
            for (int day = 1; day <= 14; day++)
            {
                var depDate = DateTime.UtcNow.Date.AddDays(day);
                for (int slot = 0; slot < 5; slot++)
                {
                    var flightClass = classes[slot % 3];
                    var airline     = allAirlines[rng.Next(allAirlines.Count)];
                    var depHour     = new[] { 0, 4, 8, 13, 18, 21 }[slot % 6];
                    var depTime     = depDate.AddHours(depHour).AddMinutes(rng.Next(0, 4) * 15);
                    var arrTime     = depTime.AddMinutes(flightMins + rng.Next(-15, 30));
                    int seats       = new[] { 150, 180, 220, 300 }[rng.Next(4)];
                    int avail       = rng.Next(seats / 4, seats);
                    decimal priceMul= 0.80m + (decimal)(rng.NextDouble() * 0.40);

                    flights.Add(new Flight
                    {
                        FlightNumber     = $"{airline.Code}{rng.Next(100, 9999)}",
                        AirlineId        = airline.Id,
                        DepartureAirportId = dep.Id,
                        ArrivalAirportId   = arr.Id,
                        DepartureTime    = depTime,
                        ArrivalTime      = arrTime,
                        Price            = Math.Round(basePx * classMul[flightClass] * priceMul, 2),
                        TotalSeats       = seats,
                        AvailableSeats   = avail,
                        Class            = flightClass
                    });
                }
            }
        }

        // Insert in batches to avoid SQLite locking
        const int batchSize = 500;
        for (int i = 0; i < flights.Count; i += batchSize)
        {
            await db.Flights.AddRangeAsync(flights.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }
    }

    // ─── ROUTE TABLE ──────────────────────────────────────────────────────────
    private static List<(string, string)> BuildRoutes()
    {
        var r = new List<(string, string)>();

        void Add(string a, string b) { r.Add((a,b)); r.Add((b,a)); }

        // ── Top 30 global hubs — all pairs ─────────────────────────────────
        var topHubs = new[]{ "JFK","LAX","ORD","ATL","DFW","MIA","SFO","LHR","CDG","AMS",
                             "FRA","MUC","MAD","FCO","ZRH","IST","DXB","DOH","AUH","SIN",
                             "HKG","NRT","ICN","PEK","BKK","KUL","SYD","JNB","DEL","GRU" };
        for (int i = 0; i < topHubs.Length; i++)
            for (int j = i + 1; j < topHubs.Length; j++)
                Add(topHubs[i], topHubs[j]);

        // ── US Domestic ────────────────────────────────────────────────────
        var usDomestic = new[]{
            ("JFK","BOS"),("JFK","DCA"),("JFK","MCO"),("JFK","MIA"),("JFK","ORD"),("JFK","ATL"),
            ("JFK","DFW"),("JFK","LAX"),("JFK","SFO"),("JFK","SEA"),("JFK","DEN"),("JFK","LAS"),
            ("JFK","PHX"),("JFK","HNL"),("LAX","SFO"),("LAX","SEA"),("LAX","DEN"),("LAX","LAS"),
            ("LAX","PHX"),("LAX","HNL"),("LAX","ORD"),("LAX","ATL"),("LAX","DFW"),("LAX","MIA"),
            ("ORD","ATL"),("ORD","DFW"),("ORD","DEN"),("ORD","PHX"),("ORD","SEA"),("ORD","LAS"),
            ("ORD","BOS"),("ORD","DCA"),("ORD","MIA"),("ATL","DFW"),("ATL","MIA"),("ATL","CLT"),
            ("ATL","BOS"),("ATL","DCA"),("ATL","PHX"),("DFW","DEN"),("DFW","PHX"),("DFW","LAS"),
            ("DFW","SEA"),("DFW","HNL"),("DFW","BOS"),("DFW","MIA"),("DFW","SFO"),("SFO","SEA"),
            ("SFO","DEN"),("SFO","LAS"),("SFO","PHX"),("SFO","HNL"),("SEA","DEN"),("SEA","LAS"),
            ("DEN","LAS"),("DEN","PHX"),("LAS","PHX"),("MIA","DCA"),("MIA","BOS"),("BOS","DCA"),
            ("EWR","BOS"),("EWR","ATL"),("EWR","LAX"),("IAH","LAX"),("IAH","DFW"),("IAH","MIA"),
            ("CLT","BOS"),("CLT","DCA"),("CLT","MIA"),("DTW","BOS"),("DTW","DCA"),("DTW","MIA"),
            ("MSP","DFW"),("MSP","DEN"),("MSP","PHX"),("PHL","MIA"),("PHL","ATL"),("MCO","BOS"),
            ("MCO","DFW"),("TPA","ATL"),("TPA","DFW"),("AUS","DFW"),("AUS","LAX"),("BNA","DFW"),
            ("PDX","SFO"),("PDX","LAX"),("SAN","LAX"),("SAN","SFO"),("SAN","DFW"),
        };
        foreach (var (a,b) in usDomestic) Add(a,b);

        // ── Canada domestic & transatlantic ────────────────────────────────
        var canada = new[]{
            ("YYZ","YVR"),("YYZ","YUL"),("YYZ","YYC"),("YYZ","YEG"),("YVR","YYC"),
            ("YYZ","LHR"),("YYZ","CDG"),("YYZ","AMS"),("YYZ","FRA"),("YYZ","DXB"),
            ("YVR","NRT"),("YVR","HKG"),("YVR","SIN"),("YUL","LHR"),("YUL","CDG"),
        };
        foreach (var (a,b) in canada) Add(a,b);

        // ── Latin America ──────────────────────────────────────────────────
        var latam = new[]{
            ("GRU","EZE"),("GRU","BOG"),("GRU","LIM"),("GRU","SCL"),("GRU","MIA"),
            ("GRU","LHR"),("GRU","CDG"),("EZE","SCL"),("EZE","BOG"),("EZE","LIM"),
            ("EZE","MAD"),("EZE","LHR"),("BOG","LIM"),("BOG","MDE"),("BOG","MEX"),
            ("LIM","SCL"),("LIM","UIO"),("SCL","LIM"),("MEX","GDL"),("MEX","MTY"),
            ("MEX","CUN"),("MEX","BOG"),("MEX","LIM"),("PTY","BOG"),("PTY","MIA"),
            ("GIG","EZE"),("GIG","BOG"),("GIG","LIS"),("BSB","GRU"),("BSB","EZE"),
        };
        foreach (var (a,b) in latam) Add(a,b);

        // ── European intra ─────────────────────────────────────────────────
        var europe = new[]{
            ("LHR","CDG"),("LHR","AMS"),("LHR","FRA"),("LHR","MUC"),("LHR","MAD"),
            ("LHR","FCO"),("LHR","ZRH"),("LHR","VIE"),("LHR","ARN"),("LHR","CPH"),
            ("LHR","OSL"),("LHR","DUB"),("LHR","ATH"),("LHR","IST"),("CDG","AMS"),
            ("CDG","FRA"),("CDG","MUC"),("CDG","MAD"),("CDG","FCO"),("CDG","ZRH"),
            ("CDG","BCN"),("CDG","VIE"),("CDG","ARN"),("CDG","ATH"),("AMS","FRA"),
            ("AMS","MUC"),("AMS","MAD"),("AMS","FCO"),("AMS","VIE"),("AMS","ATH"),
            ("FRA","MUC"),("FRA","MAD"),("FRA","FCO"),("FRA","ZRH"),("FRA","VIE"),
            ("FRA","ATH"),("FRA","PRG"),("FRA","BUD"),("FRA","WAW"),("MUC","VIE"),
            ("MUC","ZRH"),("MUC","FCO"),("MUC","ATH"),("MAD","BCN"),("MAD","FCO"),
            ("MAD","LIS"),("MAD","ATH"),("FCO","ATH"),("FCO","VIE"),("ZRH","VIE"),
            ("VIE","ATH"),("VIE","PRG"),("VIE","BUD"),("VIE","WAW"),("ARN","CPH"),
            ("ARN","OSL"),("ARN","HEL"),("CPH","OSL"),("CPH","HEL"),("OSL","HEL"),
            ("BER","MUC"),("BER","FRA"),("BER","LHR"),("BER","CDG"),("BER","AMS"),
            ("LHR","LIS"),("LHR","OPO"),("MAD","OPO"),("LIS","CDG"),("LIS","FRA"),
            ("ATH","IST"),("IST","SAW"),
        };
        foreach (var (a,b) in europe) Add(a,b);

        // ── Middle East ────────────────────────────────────────────────────
        var me = new[]{
            ("DXB","DOH"),("DXB","AUH"),("DXB","RUH"),("DXB","JED"),("DXB","AMM"),
            ("DXB","BEY"),("DXB","TLV"),("DXB","CAI"),("DXB","KWI"),("DXB","BAH"),
            ("DXB","MCT"),("DOH","AUH"),("DOH","RUH"),("DOH","JED"),("DOH","AMM"),
            ("DOH","CAI"),("DOH","TLV"),("AUH","RUH"),("AUH","JED"),("IST","AMM"),
            ("IST","BEY"),("IST","TLV"),("IST","BAH"),("IST","MCT"),("CAI","AMM"),
            ("CAI","BEY"),("CAI","RUH"),("DXB","IKA"),("IST","IKA"),
        };
        foreach (var (a,b) in me) Add(a,b);

        // ── Africa ─────────────────────────────────────────────────────────
        var africa = new[]{
            ("JNB","CPT"),("JNB","DUR"),("JNB","NBO"),("JNB","ADD"),("JNB","LOS"),
            ("JNB","CAI"),("JNB","DXB"),("JNB","LHR"),("JNB","AMS"),("JNB","FRA"),
            ("NBO","ADD"),("NBO","DAR"),("NBO","LOS"),("NBO","DXB"),("NBO","LHR"),
            ("ADD","DAR"),("ADD","DXB"),("ADD","LHR"),("ADD","CDG"),("LOS","ACC"),
            ("LOS","ABJ"),("LOS","DKR"),("LOS","CMN"),("LOS","CAI"),("LOS","LHR"),
            ("LOS","ABV"),("ACC","ABJ"),("ACC","DKR"),("CMN","LHR"),("CMN","MAD"),
            ("CMN","CDG"),("CMN","AMS"),("TUN","LHR"),("TUN","CDG"),("TUN","FRA"),
            ("ALG","CDG"),("ALG","MAD"),("CAI","LHR"),("CAI","CDG"),("CAI","FRA"),
            ("DAR","NBO"),("DAR","MBA"),
        };
        foreach (var (a,b) in africa) Add(a,b);

        // ── South Asia ─────────────────────────────────────────────────────
        var southAsia = new[]{
            ("DEL","BOM"),("DEL","MAA"),("DEL","BLR"),("DEL","HYD"),("DEL","CCU"),
            ("DEL","AMD"),("DEL","GOI"),("DEL","CMB"),("DEL","DAC"),("DEL","KTM"),
            ("BOM","MAA"),("BOM","BLR"),("BOM","HYD"),("BOM","CCU"),("BOM","GOI"),
            ("BOM","CMB"),("MAA","BLR"),("MAA","HYD"),("BLR","HYD"),("BLR","GOI"),
            ("DEL","KHI"),("DEL","LHE"),("DEL","ISB"),("BOM","KHI"),("CMB","SIN"),
            ("CMB","BKK"),("DAC","SIN"),("KTM","DEL"),("MLE","SIN"),("MLE","DXB"),
            ("KHI","DXB"),("LHE","DXB"),("ISB","DXB"),
        };
        foreach (var (a,b) in southAsia) Add(a,b);

        // ── Southeast Asia ─────────────────────────────────────────────────
        var sea = new[]{
            ("SIN","KUL"),("SIN","BKK"),("SIN","CGK"),("SIN","MNL"),("SIN","SGN"),
            ("SIN","HAN"),("SIN","REP"),("SIN","DPS"),("SIN","DAD"),("SIN","PNH"),
            ("KUL","BKK"),("KUL","CGK"),("KUL","MNL"),("KUL","SGN"),("KUL","DPS"),
            ("KUL","HKT"),("BKK","HKT"),("BKK","CNX"),("BKK","SGN"),("BKK","HAN"),
            ("BKK","MNL"),("BKK","CGK"),("BKK","DPS"),("BKK","REP"),("BKK","PNH"),
            ("CGK","DPS"),("CGK","SUB"),("MNL","CEB"),("SGN","HAN"),("SGN","DAD"),
            ("HKT","SIN"),("HKT","KUL"),("SIN","RGN"),("KUL","RGN"),
        };
        foreach (var (a,b) in sea) Add(a,b);

        // ── East Asia ──────────────────────────────────────────────────────
        var eastAsia = new[]{
            ("NRT","HND"),("NRT","KIX"),("NRT","NGO"),("NRT","CTS"),("NRT","FUK"),
            ("HND","KIX"),("HND","FUK"),("HND","CTS"),("NRT","ICN"),("NRT","PEK"),
            ("NRT","PVG"),("NRT","HKG"),("NRT","TPE"),("NRT","BKK"),("NRT","SIN"),
            ("ICN","PEK"),("ICN","PVG"),("ICN","HKG"),("ICN","TPE"),("ICN","BKK"),
            ("ICN","SIN"),("ICN","NRT"),("PEK","PVG"),("PEK","HKG"),("PEK","CAN"),
            ("PEK","CTU"),("PEK","SZX"),("PVG","HKG"),("PVG","CAN"),("PVG","CTU"),
            ("PVG","SZX"),("HKG","TPE"),("HKG","BKK"),("HKG","SIN"),("HKG","KUL"),
            ("HKG","MNL"),("TPE","TSA"),("KIX","ITM"),("GMP","CJU"),("GMP","PUS"),
            ("PEK","NRT"),("PEK","SIN"),("CTU","BKK"),("KMG","BKK"),("KMG","SIN"),
            ("CAN","BKK"),("CAN","SIN"),("SZX","SIN"),("SZX","BKK"),
        };
        foreach (var (a,b) in eastAsia) Add(a,b);

        // ── Oceania ────────────────────────────────────────────────────────
        var oceania = new[]{
            ("SYD","MEL"),("SYD","BNE"),("SYD","PER"),("SYD","ADL"),("SYD","CBR"),
            ("SYD","CNS"),("SYD","DRW"),("SYD","OOL"),("MEL","BNE"),("MEL","PER"),
            ("MEL","ADL"),("BNE","PER"),("BNE","CNS"),("SYD","AKL"),("MEL","AKL"),
            ("BNE","AKL"),("PER","AKL"),("AKL","WLG"),("AKL","CHC"),("WLG","CHC"),
            ("SYD","NAN"),("SYD","PPT"),("MEL","NAN"),("AKL","NAN"),("AKL","APW"),
            ("SYD","SIN"),("SYD","KUL"),("SYD","BKK"),("SYD","HKG"),("SYD","NRT"),
            ("MEL","SIN"),("MEL","KUL"),("MEL","BKK"),("PER","SIN"),("PER","DXB"),
            ("BNE","NRT"),("BNE","HKG"),
        };
        foreach (var (a,b) in oceania) Add(a,b);

        // ── Central Asia ───────────────────────────────────────────────────
        var centralAsia = new[]{
            ("ALA","TAS"),("ALA","FRU"),("ALA","DYU"),("ALA","DXB"),("ALA","IST"),
            ("ALA","SVO"),("TAS","DXB"),("TAS","IST"),("TAS","SVO"),
            ("NQZ","SVO"),("NQZ","FRA"),("NQZ","DXB"),
        };
        foreach (var (a,b) in centralAsia) Add(a,b);

        // ── Transatlantic & Transpacific extras ────────────────────────────
        var longHaul = new[]{
            ("BOS","LHR"),("BOS","CDG"),("BOS","AMS"),("BOS","DXB"),
            ("MIA","LHR"),("MIA","MAD"),("MIA","CDG"),("MIA","GRU"),
            ("EWR","LHR"),("EWR","CDG"),("EWR","FRA"),("EWR","AMS"),
            ("PHX","LHR"),("SEA","NRT"),("SEA","ICN"),("SEA","LHR"),
            ("HNL","NRT"),("HNL","SYD"),("HNL","ICN"),
            ("DEN","LHR"),("DEN","CDG"),("DEN","FRA"),
            ("IAH","LHR"),("IAH","CDG"),("IAH","FRA"),("IAH","GRU"),
            ("CLT","LHR"),("CLT","CDG"),("DTW","LHR"),("DTW","CDG"),
            ("MSP","LHR"),("PHL","LHR"),("PHL","CDG"),
            ("LHR","DEL"),("LHR","BOM"),("LHR","CMB"),("LHR","DAC"),
            ("LHR","ICN"),("LHR","PEK"),("LHR","PVG"),("LHR","SYD"),
            ("LHR","JNB"),("LHR","NBO"),("LHR","ADD"),("LHR","LOS"),
            ("CDG","DEL"),("CDG","BOM"),("CDG","NRT"),("CDG","ICN"),
            ("CDG","SYD"),("CDG","JNB"),("FRA","DEL"),("FRA","BOM"),
            ("FRA","SIN"),("FRA","NRT"),("FRA","ICN"),("FRA","SYD"),
            ("FRA","JNB"),("AMS","DEL"),("AMS","BOM"),("AMS","SIN"),
            ("AMS","NRT"),("AMS","ICN"),("AMS","SYD"),("AMS","JNB"),
            ("DXB","NRT"),("DXB","ICN"),("DXB","SYD"),("DXB","DEL"),
            ("DXB","BOM"),("DXB","PEK"),("DXB","PVG"),("DXB","JNB"),
            ("DXB","NBO"),("DXB","ADD"),("DXB","LOS"),("DXB","CMN"),
            ("SIN","NRT"),("SIN","ICN"),("SIN","SYD"),("SIN","DEL"),
            ("SIN","BOM"),("SIN","LHR"),("SIN","FRA"),("SIN","AMS"),
            ("HKG","NRT"),("HKG","ICN"),("HKG","SYD"),("HKG","DEL"),
            ("HKG","LHR"),("HKG","JFK"),("ICN","SYD"),("ICN","DEL"),
            ("ICN","BOM"),("ICN","LAX"),("NRT","SYD"),("NRT","LAX"),
            ("NRT","DEL"),("NRT","LHR"),("PEK","LAX"),("PEK","SFO"),
            ("PVG","LAX"),("PVG","SFO"),("CAN","SYD"),("GRU","LIS"),
            ("GRU","MAD"),("EZE","MAD"),("EZE","LHR"),("LIM","MAD"),
            ("BOG","MAD"),("BOG","LHR"),
        };
        foreach (var (a,b) in longHaul) Add(a,b);

        return r;
    }

    // ── Algorithmic hub routing: every airport → nearest 3 mega-hubs ──────────
    public static List<(string, string)> BuildHubRoutes(List<Airport> airports)
    {
        var megaHubs = new Dictionary<string, (double lat, double lon)>
        {
            ["JFK"]=(40.64,-73.78), ["LAX"]=(33.94,-118.41), ["ORD"]=(41.97,-87.91),
            ["ATL"]=(33.64,-84.43), ["DFW"]=(32.90,-97.04),  ["MIA"]=(25.80,-80.29),
            ["SFO"]=(37.62,-122.38),["LHR"]=(51.47,-0.45),   ["CDG"]=(49.01,2.55),
            ["AMS"]=(52.31,4.77),   ["FRA"]=(50.04,8.56),    ["MUC"]=(48.35,11.78),
            ["MAD"]=(40.49,-3.57),  ["IST"]=(41.28,28.75),   ["DXB"]=(25.25,55.37),
            ["DOH"]=(25.27,51.61),  ["SIN"]=(1.36,103.99),   ["HKG"]=(22.31,113.92),
            ["NRT"]=(35.77,140.39), ["ICN"]=(37.46,126.44),  ["PEK"]=(40.08,116.60),
            ["BKK"]=(13.69,100.75), ["SYD"]=(-33.94,151.18), ["JNB"]=(-26.14,28.24),
            ["NBO"]=(-1.32,36.93),  ["ADD"]=(8.98,38.80),    ["GRU"]=(-23.44,-46.47),
            ["DEL"]=(28.57,77.10),  ["BOM"]=(19.09,72.87),   ["AUH"]=(24.43,54.65),
            ["KUL"]=(2.75,101.71),  ["YYZ"]=(43.68,-79.62),  ["LIM"]=(-12.02,-77.11),
            ["BOG"]=(4.70,-74.15),  ["EZE"]=(-34.82,-58.54), ["CAI"]=(30.12,31.41),
            ["FCO"]=(41.80,12.25),  ["ZRH"]=(47.46,8.55),    ["VIE"]=(48.11,16.57),
        };

        var r = new List<(string, string)>();
        var existing = new HashSet<string>();
        void SafeAdd(string a, string b) {
            var key1 = $"{a}|{b}"; var key2 = $"{b}|{a}";
            if (!existing.Contains(key1) && !existing.Contains(key2)) {
                existing.Add(key1); r.Add((a,b)); r.Add((b,a));
            }
        }

        foreach (var ap in airports)
        {
            if (megaHubs.ContainsKey(ap.IATA)) continue;
            var nearest = megaHubs
                .OrderBy(h => Haversine(ap.Latitude, ap.Longitude, h.Value.lat, h.Value.lon))
                .Take(3)
                .Select(h => h.Key)
                .ToList();
            foreach (var hub in nearest) SafeAdd(ap.IATA, hub);
        }
        return r;
    }

    private static double Haversine(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        var dLat = ToRad(lat2 - lat1);
        var dLon = ToRad(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2))
              * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
    private static double ToRad(double deg) => deg * Math.PI / 180;
}
