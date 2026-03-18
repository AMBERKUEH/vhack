import { cleanText, chunkText, embedInBatches, insertToSupabase, printSummary, type IngestionSummaryRow } from "./rag-utils";

const DOCUMENTS = [
  {
    source: "ssm",
    doc_title: "GUIDELINE FOR REGISTATION OF NEW BUSINESS",
    approx_pages: 3,
    text: `

GUIDELINE FOR REGISTATION OF NEW BUSINESS 
 
 
New business registration conditions 
1. Under the provisions of Section 5 of Registration of Businesses Act 
1956 (ROBA 1956) stipulates that a business must be registered not later 
than 30 days from the business starts. Registration must be submitted to 
the Registrar/SSM. 
2. The  registered  business  must  comply  with  Section  2  (Business 
Interpretation) ROBA 1956 and must not be involve in any charity/welfare 
activities and any work specified in Schedule (Section 2) 
3. The  owner  or  partner must  be a Malaysian citizen  (MyKad)  or 
permanent resident (MyPR) and must be at least 18 years old. 
4. The  business  must operate in Peninsular  Malaysia  and  Federal 
Territory of Labuan. 
 
 
New business registration procedure 
5. Applicants can submit their application online via 
ezbiz.ssm.com.my. Applicants must be registered as an Ezbiz Online user 
first. Please  refer  to  the Ezbiz  User  Guideline  User  Account  Registration 
and Ezbiz User Guideline New Business Registration. 
6. Please attach / upload relevant supporting documents as follows: 
6.1 A copy of partnership agreement (if any) 
6.2 Agency  permission/confirmation  letter (if  any), in case if  the 
business activity requires approval from the relevant agency. 
7. Businesses can be registered using the following business names: 
7.1 Trade   Name - Business   name   created for   commercial 
purposes (example Indah Maju Construction, Restoran Seri Nelayan, 
Nirmala Trading & Services); and

7.2 Personal Name – Business name that uses the same name as 
stated on the identity card (Example Ali Bin Ahmad) 
8. The type / activity of the registered business must be appropriate to 
the  business  name,  must not be illegal, comply with  federal  security, 
public order or moral principles. 
9. Registered business  branches (if  any) must  not be  the  same  as 
the principal business address and any other branches. 
10. For business ownership, there are several scenarios that need to be 
adhered to: 
10.1 Businesses registered using "Trade  Name"  can be registered 
either as a Sole Proprietorship or Partnership ( not exceeding 
twenty 20 people). 
10.2 Businesses registered   under “Personal  Name”  cannot  be 
registered as partnerships 
 
11. For Partnership,  all  partners  will  receive email notification  related 
to  new business  registration.  Partners  need  to verify the  business 
registration application on the Ezbiz Online portal. After the verification is 
made by the partner, the payment can be made and sent for processing. 
12. Referring  to  point  11, if  there  is  a  partner  who  wants  to  be 
registered in partnership, but not yet an active Ezbiz Online user (please 
refer  to  point  5),  the  registration  of  a partnership business  cannot  be 
done. 
 
 
Registration Fee 
13. Fees for business registration are as follows: 
 
13.1 RM 60 per year Sole Proprietorship or Partnership using 
Trade Name 
 
13.2 RM 30 per year A sole proprietorship uses its own name 
as stated on the identity card (Personal 
Name) 
 
13.3 RM 5 per year Every branch (if any) 
 
13.4 RM 10 Business Information 

Note: Registration can be made within one (1) year and up to 
five (5) years 
 
General Guidance 
14. Any  person who conducts on a  business  without  registering  the 
business  commits  an  offense  under  the ROBA  1956 and shall upon 
conviction be liable to a fine not exceeding RM 50,000 or to imprisonment 
for a term not exceeding two (2) years or both. 
15. The   business   owner   is   responsible   for   obtaining   a   business 
license/permit, permit or letter of authorisation from the local authority or 
relevant  agency  related  to  the  type/activity  of  the  business conducted 
even if it has been registered at SSM. 
16. For  further  information,  please  contact  SSM Contact  Centre  at  03-
7721 4000 or by email at enquiry@ssm.com.my. `,
  },
  {
    source: "jakim",
    doc_title: "Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020",
    approx_pages: 119,
    text: `

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
i 
 
MANUAL PROSEDUR PENSIJILAN HALAL MALAYSIA (DOMESTIK) 2020 
_____________________________________ 
SUSUNAN PROSEDUR 
_____________________________________ 
 
BAHAGIAN I 
PERMULAAN 
 
Prosedur                Muka surat 
1.  Tajuk ringkas dan pemakaian        1 
2.     Singkatan          1 
3.     Tafsiran           2 
 
 BAHAGIAN II  
PERMOHONAN 
 
4.     Skim pensijilan          10 
5.     Syarat dan kriteria permohonan      10 
6.     Tidak layak memohon         11 
 
BAHAGIAN III 
FI 
 
7.  Pemprosesan            13 
8.  Pensijilan produk dan perkhidmatan       13 
9.     Pensijilan premis makanan       14 
10.   Penambahan menu         15 
11.   Cetakan poster logo halal       15 
12.   Pensijilan rumah sembelihan        15 
13.    Cetakan semula sijil        16 
14.   Nota konsainan         16 
15.   Pembayaran         16 
16.   Pengecualian         17 
         
BAHAGIAN IV 
KEPERLUAN PENSIJILAN 
 
17.   Keperluan umum        18  
18.   Keperluan khusus        30 
19.   Sistem Kawalan Halal Dalaman      54 
20.   Sistem Jaminan Halal         55 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
ii 
 
BAHAGIAN V 
PROSEDUR PERMOHONAN 
 
21.   Baharu             56 
22.   Pembaharuan            60 
23.   Penambahan         62 
24. Penggabungan          63 
 
BAHAGIAN VI 
PENGAUDITAN 
 
25.   Pemakluman         64 
26.   Skop          64 
27.   Pengauditan kecukupan       65 
28.   Pengauditan lapangan        66 
29.   Pengauditan susulan          68 
30.   Ketidakakuran           68 
 
BAHAGIAN VII 
PEMANTAUAN 
 
31.   Jenis pemantauan         70 
32.   Kategori ketidakakuran        71 
33.   Tindakan          76 
 
BAHAGIAN VIII 
SIJIL PENGESAHAN HALAL MALAYSIA 
 
34.  Pengeluaran sijil        79 
35. Tempoh sah laku        79 
36.   Syarat penggunaan        80 
37.   Pindaan maklumat        81 
38.   Hilang atau rosak        81  
39. Pembatalan         82 
 
BAHAGIAN IX 
LOGO HALAL MALAYSIA 
 
40.  Bentuk dan ciri-ciri        83 
41.   Syarat penggunaan        83 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
iii 
 
BAHAGIAN X 
PEGAWAI PEMERIKSA 
 
42.   Pelantikan         86 
43.   Bidang kuasa         86 
44.   Nilai dan etika            87 
 
BAHAGIAN XI 
PANEL PENGESAHAN HALAL MALAYSIA 
 
45.   Pelantikan         88 
46.   Keahlian           88 
47.   Kuorum            89 
48.   Bidang kuasa            89 
49.   Penamatan         90 
50.   Jawatankuasa kecil        90 
51.   Panel rayuan         91 
 
BAHAGIAN XII 
PENSAMPELAN 
 
52.   Jenis sampel         93 
53.   Prosedur          93 
54.   Kos          94 
55.   Makmal analisis         94 
 
BAHAGIAN XIII 
TANGGUNGJAWAB PEMEGANG SIJIL 
 
56.   Pematuhan undang-undang dan peraturan      95 
 
BAHAGIAN XIV 
PELBAGAI 
 
57.   Inisiatif Segera Pensijilan Halal Malaysia (ISPHM)    96 
58.   Sertu          97 
59.   Tauliah penyembelih           98 
60.   Pengemaskinian maklumat sistem MYeHALAL    99 
61.   Nota Konsainan         99 
62.   Kuasa membuat prosedur        99 
63.   Kewangan Islam         100 
64.   Kerahsiaan         100 
65.   Berkecuali         100 
66.   Aduan              101 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
iv 
 
67.   Bantahan         101 
68.   Rayuan          101 
69.   Pengecualian         102 
70.   Naskhah sahih          102 
71.   Pembatalan         102 
   
BAHAGIAN XV 
LAMPIRAN 
 
LAMPIRAN A -    Nama dan jenama tidak halal atau sinonim produk tidak   103 
halal atau mengelirukan 
LAMPIRAN B -    Ciri-ciri penentuan dapur hotel     105 
LAMPIRAN C -    Garis panduan parameter pelalian (stunning)   106 
LAMPIRAN D -    Carta alir Pensijilan Halal Malaysia    107 
LAMPIRAN E -    Alamat perhubungan pihak berkuasa berwibawa  108 
LAMPIRAN F -    Ringkasan bahan mentah atau ramuan      110 
LAMPIRAN G -    Sijil Pengesahan Halal Malaysia     111 
LAMPIRAN H -    Templat nota konsainan      112 
LAMPIRAN I  - Produk dan perkhidmatan kewangan Islam   113 
 
Jawatankuasa Kerja Pembangunan Manual Prosedur     114 
Pensijilan Halal Malaysia (Domestik) 2020 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
1 
 
MANUAL PROSEDUR PENSIJILAN HALAL MALAYSIA (DOMESTIK) 2020 
 
 
BAHAGIAN I 
PERMULAAN 
  
 
1. TAJUK RINGKAS DAN PEMAKAIAN 
 
(1) Dokumen ini hendaklah   dinamakan   Manual   Prosedur   Pensijilan   Halal   
Malaysia  (Domestik)  2020 (kemudian  daripada ini  disebut  sebagai  “Manual 
Prosedur”;  
 
(2) Manual  Prosedur ini  diterbit  berdasarkan  APD 2011 [Akta  730]  melalui  
subperenggan 7(2),  Perintah  Perihal  Dagangan  (Perakuan  dan  Penandaan  
Halal) 2011; 
 
(3) Manual  Prosedur  ini  hendaklah  dirujuk  dan  diguna  pakai  kepada  syarikat  
dan/ atau pemohon Pensijilan Halal Malaysia yang: 
 
(a) berdaftar di dalam negara atau di luar negara; dan 
 
(b) menjalankan   perusahaan   atau   pengeluaran   produk   dan/   atau   
perkhidmatan di dalam negara. 
 
(4) Manual Prosedur ini hendaklah dirujuk dan dibaca bersama dengan Manual 
MHMS  2020, MS,  fatwa,  perundangan  atau peraturan  yang  berkaitan  dan  
pekeliling  yang diguna pakai dalam Pensijilan Halal Malaysia; 
 
(5) Manual  Prosedur  ini  hendaklah  mula  berkuat  kuasa  pada  tarikh  yang  
ditetapkan oleh pihak   berkuasa   berwibawa dalam Pensijilan   Halal   
Malaysia; dan 
 
(6) Semua   pihak   yang   terlibat   dalam   Pensijilan   Halal   Malaysia   hendaklah 
mematuhi Manual Prosedur ini. 
 
 
2. SINGKATAN 
 
Bagi maksud Manual   Prosedur   ini,   singkatan   yang berikut hendaklah 
digunakan: 
 
APD 2011 - Akta Perihal Dagangan 2011 
ASEAN - Persatuan Negara-Negara Asia Tenggara 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
2 
 
BKKM  - Bahagian Keselamatan dan Kualiti Makanan 
HACCP - Hazard Analysis Critical Control Point 
HAS    -  Halal Assurance System  
   (Sistem Jaminan Halal) 
HPB    - Halal Professional Board 
  (Majlis Profesional Halal) 
GHP    - Good Hygiene Practices 
GMP    - Good Manufacturing Practices 
GVHP  - Good Veterinary Hygiene Practice 
IHCS   - Internal Halal Control System    
   (Sistem Kawalan Halal Dalaman) 
ISPHM - Inisiatif Segera Pensijilan Halal Malaysia 
JAIN    - Jabatan Agama Islam Negeri 
JAKIM  - Jabatan Kemajuan Islam Malaysia 
JPV  -  Jabatan Perkhidmatan Veterinar 
KKM    - Kementerian Kesihatan Malaysia 
MAIN   - Majlis Agama Islam Negeri 
MDA             - Medical Device Authority  
   (Pihak Berkuasa Peranti Perubatan) 
MHMS - Malaysian Halal Management System  
   (Sistem Pengurusan Halal Malaysia) 
MS  - Malaysian Standard 
NCR    -  Non Conformance Report 
NPRA  - National Pharmaceutical Regulatory Agency  
   (Bahagian Regulatori Farmasi Negara) 
OEM    - Original Equipment Manufacturer 
PBKD  - Pihak Berkuasa Kawalan Dadah 
PBT     -  Pihak Berkuasa Tempatan 
QAP    - Quality Assurance Programme 
R&D  - Research and Development 
SPHM  -  Sijil Pengesahan Halal Malaysia 
VHM    - Veterinary Health Mark   
  
 
3. TAFSIRAN 
 
Dalam Manual Prosedur ini, melainkan jika konteksnya menghendaki makna 
yang lain: 
 
“Air  mutlak”  ertinya  air yang suci dan  dapat  menyucikan  benda  lain  serta  
boleh  digunakan  untuk  wuduk,  mandi  wajib  dan  membersihkan  najis.  Air 
yang  tidak  dicemari  oleh  sesuatu  yang  najis  sehingga  mengubah  bau,  
warna, dan rasa air tersebut. Contohnya air perigi, air sungai dan air laut. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
3 
 
“ASEAN” ertinya pertubuhan antara Kerajaan serantau yang terdiri daripada 
sepuluh  (10)  negara  di  Asia  Tenggara iaitu  Malaysia,  Brunei,  Kemboja,  
Indonesia,   Laos,   Myanmar,   Filipina,   Singapura,  Thailand dan   Vietnam. 
Matlamat penubuhan  ASEAN  ialah  untuk  mempercepatkan  pertumbuhan  
ekonomi,  kemajuan  sosial,  pembangunan  budaya serta  mempromosikan 
keamanan serantau dan bantuan mengenai hal-hal kepentingan bersama di 
rantau ini. 
 
“Bahan  bantuan  pemprosesan” juga  dikenali  sebagai  processing  aids. 
Ertinya  apa-apa  bahan  sampingan  atau  tambahan  yang  digunakan  secara  
langsung  dan/  atau  tidak  langsung  dalam  pemprosesan  produk.  Contohnya  
media pembiakan mikroorganisma, pelarut dan bleaching earth. 
 
“Bahan  mentah”  ertinya  ramuan  atau  sebarang bahan  primer  dan/  atau  
sekunder (termasuklah bahan bantuan pemprosesan) yang digunakan untuk 
menghasilkan produk.  
 
“Dapur  berpusat”  ertinya  tempat  pemprosesan  dan  penyediaan  makanan  
dan/  atau  minuman  halal  untuk  dibekal  dan  diedarkan  kepada  premis  
makanan seperti premis makanan berangkai dan premis bergerak. Lazimnya 
dapur berpusat akan menyediakan hidangan siap atau separa siap. 
 
“Dapur  hotel” ertinya tempat  pemprosesan  dan  penyediaan  makanan  dan/ 
atau minuman  halal  di  sesebuah  hotel  termasuklah  dapur  terbuka  (open 
kitchen).  Bilangan  dapur  hotel  ditentukan  berdasarkan  kawasan  atau  ruang  
dapur  yang  memiliki laluan  keluar  masuk  (entry  access)  yang  khusus  atau  
spesifik. 
 
“Eksekutif    Halal”    ertinya    individu    yang    bertanggungjawab    dalam    
memastikan  pematuhan  halal  di  sesebuah  syarikat  atau  premis.  Eksekutif 
Halal hendaklah memenuhi syarat-syarat yang ditetapkan berikut: 
 
(1) Beragama Islam; 
 
(2) Warganegara Malaysia; 
 
(3) Berjawatan tetap; 
 
(4) Berkelulusan minimum  Diploma  Pengurusan  Halal  atau  mana-mana 
kelulusan   yang   setaraf   dengannya   atau   berpengalaman   dalam   
pengurusan halal sekurang-kurangnya lima (5) tahun; dan  
 
(5) Memiliki Sijil  Eksekutif  Halal  daripada Penyedia  Latihan  Halal  yang  
berdaftar di bawah HPB JAKIM.  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
4 
 
 
“Fatwa”  ertinya  apa-apa  ketetapan  hukum  yang  disahkan  oleh  pihak  yang  
berkuasa mengenai agama Islam.  
 
“Halal” ertinya perkara-perkara yang dibolehkan dan dibenarkan dalam Islam 
berdasarkan Hukum Syarak dan fatwa.  
 
“Hayah  al-mustaqirrah”  ertinya  keadaan  haiwan  sembelihan  yang  diyakini 
masih  bernyawa.  Hayah  al-mustaqirrah boleh  dikenal  pasti  apabila  darah  
haiwan   terpancut   semasa   disembelih   atau   adanya   pergerakan   haiwan   
tersebut. 
 
“Inisiatif  Segera  Pensijilan  Halal  Malaysia” ertinya prosedur pengurusan 
permohonan dan    pengeluaran    SPHM    dalam    tempoh    yang    singkat    
berdasarkan  kepada  kriteria-kriteria  yang  ditetapkan  oleh  pihak  berkuasa  
berwibawa.  
 
“Jawatankuasa  Halal  Dalaman” ertinya  komiti  yang  dilantik  secara  rasmi 
dan  bertulis  oleh  pengurusan  tertinggi  syarikat  yang  bertanggungjawab  
membangun,    melaksana,    memantau dan mengawal keberkesanan 
pelaksanaan  HAS  serta  pematuhan  terhadap  keperluan  Pensijilan  Halal  
Malaysia. 
 
“Kawasan   pemprosesan” ertinya meliputi kawasan   penerimaan   bahan   
mentah   sehinggalah   kawasan   produk   siap.   Ini   termasuklah   kawasan 
penyimpanan  bahan  mentah  dan  produk  siap,  penampan,  penimbangan,  
penyediaan,     pembuatan,     pengilangan,     pengeluaran,     pemprosesan,     
pengendalian, pembungkusan,  pengedaran,  penyajian,  penjualan  dan  lain  
lain   proses   berkaitan   di   sepanjang   rantaian   penghasilan produk   dan 
perkhidmatan. 
 
“Lot” ertinya kawasan,   blok   atau   bangunan yang   dikhususkan   untuk   
penggudangan halal sahaja. Lot tersebut hendaklah diasingkan secara fizikal 
dan ditandakan dengan jelas. 
 
“Manual  Prosedur”  ertinya  Manual  Prosedur  Pensijilan  Halal  Malaysia 
(Domestik) 2020. 
 
“Najis” ertinya   benda   kotor   seperti   darah,   air   kencing   dan   tahi.   
Manakala  dari  segi  Syarak  bermaksud  segala  kekotoran  yang  menghalang  
sahnya  solat.  Najis  juga  dihuraikan  sebagai  bahan  cemar  yang  menggugat  
kesihatan  diri  manusia  dan  alam  sekitar.  Pembahagian  najis  adalah  seperti  
yang berikut: 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
5 
 
(1) Najis mughallazah (berat) iaitu anjing, babi termasuk sebarang cecair 
dan objek  yang  keluar  dari  rongga,  keturunan dan sebarang  jenis  
terbitan atau derivatif daripada keduanya; 
 
(2) Najis mutawassitah    (pertengahan)    iaitu    selain    daripada    najis    
mughallazah dan  najis  mukhaffafah seperti muntah,  nanah,  darah, 
arak, bangkai, tahi dan sebagainya; dan 
 
(3) Najis mukhaffafah (ringan)  iaitu  air  kencing  kanak-kanak  lelaki yang 
berumur dua (2) tahun dan ke bawah yang hanya menyusu susu ibu 
tanpa makanan lain.  
 
“Nota  konsainan”  ertinya  dokumen  kontrak  pengiriman  antara  pengeksport 
barangan dengan  agensi  pengangkutan (sama  ada  melalui darat,  laut  dan  
udara). Nota konsainan mempunyai maklumat terperinci berkenaan pengirim, 
pengangkutan, konsainan, bilangan bungkusan, berat, fizikal barang, arahan 
tertentu dan lain-lain.  
 
“Open  kitchen” juga dikenali sebagai display  kitchen/  show  kitchen. Ertinya 
ruang  yang  dikhususkan  dan  ditentukan  untuk  penyediaan  makanan  dan  
minuman halal secara terbuka di hadapan pelanggan seperti di restoran dan 
coffee house. 
 
“Pegawai pemeriksa” ertinya individu yang kompeten dan dilantik oleh pihak 
berkuasa    berwibawa    untuk    menjalankan    proses    pengauditan    atau 
pemantauan Pensijilan Halal Malaysia. 
 
“Pekerja Muslim” ertinya individu Muslim warganegara Malaysia atau bukan 
warganegara   selain   daripada   Eksekutif   Halal   dan   Penyelia   Halal   yang   
diambil  bekerja  oleh  majikan  di  bawah  suatu  kontrak  perkhidmatan  dan 
jumlahnya tertakluk   kepada   kategori   industri   dan   skim   Pensijilan   Halal   
Malaysia.  
 
“Pembelian  berpusat”  ertinya  aktiviti  perolehan  dan  pembelian  secara  
berpusat  untuk  mengawal  dan  menyemak  perbelanjaan syarikat  di  suatu  
lokasi (lazimnya terletak di ibu pejabat).    
 
“Pengendali makanan” ertinya termasuklah mana-mana orang yang terlibat 
secara  langsung  dalam  penyediaan  makanan dan  minuman;  menyentuh  
makanan  atau  permukaan  yang  menyentuh  makanan;  dan  mengendalikan  
makanan  yang  berbungkus  atau  tidak  dibungkus,  atau  perkakas  dalam  
mana-mana   premis   pemprosesan atau   penyediaan   atau   pengendalian 
makanan; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
6 
 
“Pengusaha atau  pengeluar”  ertinya  pihak yang  menjalankan  perusahaan 
dan pengeluaran  termasuklah  pembuat, penghasil,  pengilang,  peniaga bagi 
sesuatu produk dan/ atau perkhidmatan. 
 
“Penyelia  Halal”  ertinya individu Muslim  warganegara  Malaysia,  berjawatan  
tetap   dan   bertugas   untuk   menyelia   di kawasan pemprosesan   produk,   
perkhidmatan dan/ atau di bahagian pengurusan yang memenuhi keperluan 
yang ditetapkan oleh pihak berkuasa berwibawa. 
 
“Penyembelihan”  ertinya
 perbuatan  menghilangkan  nyawa  haiwan  yang  
halal   dimakan   oleh   Muslim   dengan   memutuskan   saluran   pernafasan   
(halkum)  dan  saluran  makanan  (merih)  serta  kedua-dua carotid  artery  dan 
jugular  vein (wadajain)  menggunakan  alat  yang  tajam  dengan  niat  kerana  
Allah. 
 
“Perkhidmatan   logistik   bersepadu”   juga   dikenali   sebagai   integrated 
logistics    services.    Ertinya    syarikat    yang    menyediakan    perkhidmatan    
pengangkutan,   penggudangan,   dan   perkhidmatan   tambah   nilai   yang   
berkaitan  seperti  pengedaran,  perolehan  dan  pengurusan  rantaian  bekalan  
secara bersepadu. 
 
“Peruncitan”  ertinya  pembelian  dan/  atau  penjualan  produk  dan/  atau  
barangan  terus  kepada  pengguna.  Pengedar  (distributor)  dan  pedagang 
(trader) produk dan/ atau barangan juga dikategorikan sebagai peruncit.  
 
“Pihak  berkuasa  berwibawa”  ertinya  pihak  berkuasa  JAKIM,  MAIN/  JAIN  
atau  mana  satu  yang  berkenaan  untuk  memperaku  bahawa  mana-mana 
makanan,   barang-barang   atau   perkhidmatan   yang   berhubung   dengan   
makanan   atau   barang-barang   itu   adalah   halal   mengikut   Akta   Perihal   
Dagangan 2011 [Akta 730] melalui Perintah Perihal Dagangan (Takrif Halal) 
2011.  
  
“Polisi  halal”  ertinya  pernyataan  komitmen  jaminan  halal  dan  hala  tuju  
sesebuah organisasi/ syarikat yang didokumenkan sebagai panduan kepada 
semua pihak dalam mematuhi keperluan Pensijilan Halal Malaysia. 
  
“Premis”  ertinya  keseluruhan kawasan,  bangunan  atau  struktur  kekal  atau  
sebaliknya     untuk     tujuan     pengilangan, penyediaan,     pemprosesan,     
pengendalian,    pembungkusan,    penyimpanan,    pengedaran,    penyajian,    
penjualan  dan/  atau  sebarang  aktiviti  yang  berkaitan  dengan  pengeluaran  
produk dan perkhidmatan halal. 
 
“Premis  bergerak”  ertinya  outlet  makanan  dan  minuman  yang beroperasi 
secara bergerak di lokasi yang ditetapkan oleh pihak berkuasa. Penyediaan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
7 
 
dan pemprosesan makanan dan minuman disediakan di dapur berpusat atau 
sepenuhnya di premis bergerak tersebut. 
 
“Premis  makanan”  ertinya  bangunan  atau  apa-apa  struktur,  kekal  atau  
sebaliknya  bagi  penyediaan,  penyajian  dan  penjualan  sebarang  makanan  
seperti   restoran atau   kafe,   medan   selera,   kedai   bakeri,   kantin,   kiosk,   
katering, dapur hotel, premis bergerak seperti trak makanan dan lain-lain. 
 
“Produk  dagangan”  juga  dikenali  sebagai  trading  product.  Ertinya  produk  
luar  yang  dibawa  masuk  ke  dalam  premis  untuk  tujuan  penyimpanan,  
pelabelan, pengedaran dan penjualan.  
 
“Produk halal” ertinya sebarang produk yang diketahui status halalnya sama 
ada dipersijilkan halal atau tidak. 
 
“Premis makanan berangkai” ertinya premis makanan yang terdiri daripada 
tiga (3) outlet atau lebih, menggunakan jenama yang sama dan mempunyai 
amalan perniagaan yang standard berkonsepkan dapur berpusat, pembelian 
berpusat atau lain-lain amalan perniagaan.  
 
“Senarai  putih” juga  dikenali  sebagai  whitelist.  Ertinya senarai syarikat 
pemegang  SPHM  yang  komited  mematuhi  segala  prosedur  Pensijilan  Halal  
Malaysia dan memenuhi kriteria-kriteria yang ditetapkan oleh pihak berkuasa 
berwibawa. 
 
“Sertu”  ertinya  menyucikan  anggota  badan,  pakaian,  tempat,  perkakasan  
dan peralatan yang bersentuhan dengan najis mughallazah iaitu anjing, babi 
dan  keturunannya  dengan  membasuhnya  sebanyak  tujuh  (7)  kali,  salah 
satunya  dengan  air  yang  bercampur  tanah.  Basuhan  air  yang  pertama  
hendaklah dicampur  dengan  tanah  kemudian  diikuti  dengan  enam  (6)  kali  
basuhan menggunakan air mutlak atau bersih yang lain.  
 
“Sijil  Pengesahan  Halal  Malaysia”  ertinya  dokumen  rasmi  pengesahan 
status  halal  berdasarkan  skim  Pensijilan  Halal  Malaysia  yang  dikeluarkan  
oleh pihak berkuasa berwibawa kepada pemohon SPHM. 
  
“Sistem  Jaminan  Halal”  juga  dikenali  sebagai  Halal  Assurance  System 
(HAS). Ertinya satu set prosedur yang digunakan oleh sesebuah organisasi/ 
syarikat untuk mencapai  objektif  dalam  mengekalkan  jaminan  halal  secara  
menyeluruh. 
 
“Sistem  Kawalan  Halal  Dalaman”  juga  dikenali  sebagai  Internal  Halal  
Control   System   (IHCS).   Ertinya   prosedur   kawalan   halal   dalaman   bagi   
sesebuah  organisasi/  syarikat  yang  terdiri  daripada  polisi  halal,  prosedur  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
8 
 
kawalan  bahan  mentah atau prosedur kawalan  risiko  halal  dan  prosedur  
kebolehkesanan sebagai  langkah  kawalan  minimum  untuk  mengekalkan  
jaminan halal. 
 
“Sistem Pengurusan Halal Malaysia” juga dikenali sebagai Malaysian Halal 
Management  System  (MHMS).  Ertinya  sistem  pengurusan  bersepadu  yang  
dibangun,  dilaksana  dan  dikekalkan  oleh  sesebuah  organisasi/  syarikat  
untuk  menguruskan  produk  dan  perkhidmatan  bagi  mengekalkan  jaminan  
halal melalui IHCS atau HAS. 
 
“Skim produk barang gunaan” ertinya skim pensijilan produk siap dan/ atau 
separa  siap yang memberi  manfaat  kepada  pengguna  selain  daripada  
produk   makanan   dan   minuman,   kosmetik,   farmaseutikal   atau   peranti 
perubatan dan memenuhi kriteria ditetapkan oleh pihak berkuasa berwibawa. 
 
“Skim produk farmaseutikal”  ertinya  skim  pensijilan  produk  farmaseutikal  
yang berdaftar dengan PBKD, KKM dalam bentuk dos siap termasuk produk 
ubat-ubatan preskripsi dan bukan preskripsi untuk kegunaan manusia.  
 
“Skim produk kosmetik” ertinya
 skim    pensijilan    produk    kosmetik    
bernotifikasi  dengan  NPRA,  KKM  yang  dihasilkan  untuk  digunakan  pada  
bahagian  luaran  tubuh  badan  manusia  (kulit,  rambut,  kuku,  bibir,  organ  
genital luaran,  gigi  dan  rongga  mulut)  bagi  tujuan  membersih,  mewangikan,  
memperbaiki  atau  merubah  penampilan  atau  mencantikkan,  menghilangkan  
bau badan dan memelihara atau menjaga dalam keadaan yang baik. 
 
“Skim perkhidmatan logistik”   ertinya   skim   pensijilan   yang   meliputi 
perkhidmatan  pengangkutan,  penggudangan dan  peruncitan termasuklah 
perkhidmatan penghantaran makanan. 
 
“Skim pengilangan  kontrak/  OEM”  ertinya
 skim  pensijilan  kepada  syarikat  
yang   menyediakan   sebarang   bentuk   perkhidmatan   pengilangan   produk 
kepada syarikat lain secara persetujuan bersama melalui kontrak bertulis.  
 
“Skim produk peranti  perubatan”  ertinya  skim  pensijilan  produk  peranti  
perubatan  yang  berdaftar  dengan  MDA,  KKM  meliputi  apa-apa  peralatan,  
radas,  perkakas,  alat,  implan,  reagen  atau  kalibrator in  vitro,    bahan  atau  
barang  lain  seumpamanya  yang  menepati  definisi  peranti  perubatan  di  
dalam  Akta  Peranti  Perubatan  (Akta  737)  dan
 memenuhi  kriteria  ditetapkan  
oleh pihak berkuasa berwibawa.  
 
“Skim   Pensijilan   Veterinar”   ertinya   skim   jaminan   kesihatan   haiwan,   
keselamatan  makanan,  jaminan  kualiti  yang  diperkenalkan  JPV  berasaskan 
prinsip HACCP, GMP dan QAP seperti VHM dan GVHP. 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
9 
 
 
“Skim rumah  sembelihan”  ertinya  skim  pensijilan  kepada  syarikat  atau  
pengusaha premis untuk menyembelih dan memproses haiwan halal secara 
komersial bagi kegunaan manusia.   
 
“Tauliah Penyembelih” ertinya dokumen rasmi yang dikeluarkan oleh pihak 
berkuasa  berwibawa  sebagai  perakuan  kompetensi  penyembelih  dan/  atau  
pemeriksa halal yang bekerja di rumah sembelihan. 
 
“Tidak  halal” juga  dikenali  sebagai  haram.  Ertinya  perkara-perkara  yang  
dilarang dan tidak dibenarkan dalam Islam berdasarkan Hukum Syarak dan 
fatwa. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
10 
 
BAHAGIAN II 
PERMOHONAN 
 
 
4. SKIM PENSIJILAN 
 
Pensijilan Halal Malaysia (Domestik) terbuka kepada permohonan bagi skim-
skim yang berikut: 
 
(1) Produk makanan dan minuman; 
 
(2) Produk kosmetik; 
 
(3) Produk farmaseutikal; 
 
(4) Premis makanan; 
 
(5) Produk barang gunaan; 
 
(6) Perkhidmatan logistik; 
 
(7) Rumah sembelihan; 
 
(8) Pengilangan kontrak/ OEM; dan 
 
(9) Produk peranti perubatan. 
 
 
5. SYARAT DAN KRITERIA PERMOHONAN 
 
Setiap permohonan hendaklah memenuhi syarat dan kriteria yang berikut: 
 
(1) Memiliki Perakuan Pendaftaran Perniagaan yang masih sah daripada 
Suruhanjaya Syarikat Malaysia  atau Perakuan  Pendaftaran  Koperasi  
di  bawah  Suruhanjaya  Koperasi  Malaysia atau Dokumen  Penubuhan  
di  bawah  Akta  Parlimen  atau  Kementerian  masing-masing  dan  lain-
lain agensi Kerajaan (yang mana berkaitan); 
  
(2) Memiliki  lesen  atau  kelulusan  daripada PBT  atau  surat  pengesahan 
atau surat so  kongan yang  masih  sah  daripada mana-mana  agensi 
Kerajaan; 
 
(3) Memiliki  Perakuan  Pendaftaran  Premis  Makanan  yang  masih  sah  
daripada BKKM (jika berkaitan); 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
11 
 
 
(4) Memiliki Skim  Pensijilan  Veterinar  atau  surat  perakuan  atau surat 
sokongan yang masih sah daripada JPV (jika berkaitan); 
 
(5) Memiliki  Lesen  Pengilang  yang  masih  sah  daripada  NPRA  (jika  
berkaitan);  
 
(6) Memiliki  Lesen  Establismen  yang  masih  sah  daripada MDA  (jika  
berkaitan); 
 
(7) Beroperasi   sepenuhnya   sekurang-kurang   tiga   (3)   bulan   sebelum 
membuat permohonan SPHM bagi permohonan baharu; 
 
(8) Beroperasi sepenuhnya sekurang-kurangnya satu (1) bulan di premis 
baharu bagi syarikat yang berpindah lokasi;   
 
(9) Mengeluar dan/ atau mengendalikan produk halal sahaja termasuklah 
produk  dagangan  (trading  product)  serta  mematuhi  piawaian halal 
yang ditetapkan; 
 
(10) Membuat permohonan SPHM ke atas semua jenis produk atau menu 
yang masih dihasilkan di premis berkenaan;  
 
(11) Mengemukakan  sijil  halal  yang  diiktiraf  dan  masih  sah  laku  bagi 
permohonan  pembungkusan  semula  produk;  atau  mengemukakan  
dokumen  sokongan  yang jelas  menyatakan  sumber  bahan (bagi 
bahan semula jadi sahaja); dan 
 
(12) Nama  syarikat, produk,  menu,  ramuan  dan  jenama  produk  yang  
dimohon hendaklah   tidak   menggunakan   pernyataan ‘halal’ atau 
sebarang  representasi  atau  diperihalkan  dengan  cara  lain  untuk  
menunjukkan ia boleh digunakan oleh orang Islam. 
 
 
6. TIDAK LAYAK MEMOHON 
 
Mana-mana permohonan yang berikut adalah TIDAK LAYAK: 
 
(1) Produk dan menu yang tidak halal; 
 
(2) Syarikat  yang  mengeluar  dan/ atau mengedar produk  halal  dan  tidak  
halal (termasuklah perkhidmatan penghantaran makanan); 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
12 
 
(3) Penggunaan jenama yang sama bagi produk atau perkhidmatan halal 
dan tidak halal (tertakluk kepada pemakaian di Malaysia); 
 
(4) Produk  atau  perkhidmatan  yang  tidak  memiliki  standard  atau  garis  
panduan untuk dijadikan rujukan; 
 
(5) Produk   atau premis   makanan   yang   memberi   implikasi   negatif   
terhadap  agama  dan  sosial  seperti dadah, shisha, rokok,  pewarna 
rambut, pewarna kuku, pusat karaoke, pusat hiburan dan lain-lain; 
 
(6) Produk  semulajadi  yang  tidak  diproses, tidak diubahsuai serta  tiada 
pembungkusan dan  pelabelan  digunakan seperti  ikan  segar,  sayur-
sayuran segar, telur segar dan seumpama dengannya; 
 
(7) Penggunaan nama syarikat, produk, menu dan jenama yang merujuk 
kepada  produk  tidak  halal  atau  sinonim  atau  menyerupai  dengan 
produk tidak halal atau apa-apa istilah mengelirukan seperti ham, bak 
kut   teh, bacon, beer, rum, hot   dog, char   siew   dan   seumpama   
dengannya; (Rujuk LAMPIRAN A) 
 
(8) Produk  siap  dalam  dan  luar  negara  yang  dilabel  semula  tanpa  
menjalani sebarang proses di Malaysia; 
 
(9) Premis makanan yang menyediakan menu yang tidak halal; 
 
(10) Produk di peringkat awal penyelidikan dan pembangunan (R&D) yang 
masih belum sedia dikomersialkan; 
 
(11) Produk,   menu   dan perkhidmatan yang   boleh   membawa   kepada   
penyelewengan akidah, perkara khurafat dan penipuan; 
 
(12) Hotel  yang  mempunyai  dapur  yang  menyediakan atau  menyajikan 
menu berasaskan babi; dan 
 
(13) Produk yang tiada keperluan untuk dipersijilkan halal dan/ atau boleh 
menimbulkan  kekeliruan  sekiranya  dipersijilkan  halal  seperti  baja,  
kertas, simen, jubin, racun serangga, permaidani dan lain-lain. 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
13 
 
BAHAGIAN III 
FI 
 
 
7. PEMPROSESAN 
 
(1) Setiap   permohonan   di   bawah   Pensijilan   Halal   Malaysia   (Domestik) 
hendaklah  dikenakan  bayaran fi  sebanyak Ringgit  Malaysia  Dua  Puluh  
(RM20.00) sahaja; dan 
 
(2) Tanpa   terikat   dengan   Prosedur   7   (1)   Manual   Prosedur   ini,   setiap   
permohonan yang melibatkan syarikat dan/ atau pemohon yang berdaftar di 
luar   negara   dan   menjalankan   pengilangan   produk   di   dalam   negara   
hendaklah  dikenakan  bayaran  fi  sebanyak  Ringgit  Malaysia  Dua  Ratus  
(RM200.00) sahaja. 
 
 
8. PENSIJILAN PRODUK DAN PERKHIDMATAN 
 
(1) Setiap  permohonan  baharu dan pembaharuan  produk  bagi  skim Pensijilan 
Halal  Malaysia  (Domestik)  hendaklah  dikenakan bayaran fi  seperti Jadual  1 
di bawah: 
 
PERMOHONAN KATEGORI 
FI (RM)/ 
TAHUN 
Produk dan 
Perkhidmatan 
 
(1) Makanan        dan        
Minuman 
(2) Kosmetik  
(3) Farmaseutikal 
(4) Barang Gunaan 
(5) Logistik 
(6) Pengilangan 
Kontrak/ OEM 
(7) Peranti 
Perubatan 
(8) Dapur Berpusat  
INDUSTRI CIRI-CIRI 
Mikro 
Nilai  perolehan  tahunan  
kurang              daripada 
RM300,000.00 
100 
Kecil 
Nilai  perolehan  tahunan  
daripada RM300,000.00 
hingga 
RM14,999,999.99  
400 
Sederhana 
Nilai  perolehan  tahunan  
daripada RM15     Juta     
hingga RM50 Juta 
700 
Besar 
Nilai  perolehan  tahunan  
melebihi RM50 Juta 
1,000 
Jadual 1 : Kadar Fi Pensijilan Produk dan Perkhidmatan Mengikut Kategori 
Industri 
 
(2) Tanpa   terikat   dengan   Prosedur 8   (1)   Manual   Prosedur   ini,   setiap   
permohonan yang melibatkan syarikat dan/ atau pemohon yang berdaftar di 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
14 
 
luar   negara   dan   menjalankan   pengilangan   produk   di   dalam   negara   
hendaklah dikenakan bayaran fi seperti Jadual 2 di bawah: 
 
PENGILANGAN PRODUK SECARA KONTRAK 
(SYARIKAT LUAR NEGARA)  
FI (RM)/ 
PERMOHONAN 
PERMOHONAN PRODUK KATEGORI PEMOHON 
(1) Makanan                 dan                 
Minuman 
(2) Kosmetik  
(3) Farmaseutikal 
(4) Barang Gunaan 
(5) Peranti Perubatan 
Negara-negara ASEAN 2,500 
Lain-lain Negara 10,000 
Jadual 2 : Kadar Fi Pensijilan Pengilangan Produk Secara Kontrak 
(Syarikat Luar Negara) Mengikut Kategori Pemohon 
 
 
9. PENSIJILAN PREMIS MAKANAN 
 
Setiap  permohonan  baharu dan  pembaharuan bagi  skim  Premis  Makanan 
hendaklah dikenakan bayaran fi seperti Jadual 3, 4 dan 5 di bawah: 
 
PERMOHONAN PREMIS MAKANAN 
FI (RM) SETIAP PREMIS/ 
TAHUN 
(1) Restoran atau kafe 
(2) Kantin 
(3) Kedai bakeri  
(4) Premis makanan berangkai 
(5) Premis bergerak  
(6) Kafeteria di medan selera  
(7) Kiosk 
100 
 
Jadual 3 : Kadar Fi Pensijilan Premis Makanan 
 
SKIM PREMIS MAKANAN (HOTEL) 
KATEGORI 
FI (RM) SETIAP DAPUR ATAU 
RESTORAN/ TAHUN 
4 Bintang dan ke atas 500 
3 Bintang dan ke bawah 200 
Jadual 4 : Kadar Fi Pensijilan Premis Makanan (Hotel) 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
15 
 
SKIM PREMIS MAKANAN 
(KATERING/ KHIDMAT PENYAJIAN MAKANAN/  
DAPUR PUSAT KONVENSYEN) 
JENIS 
INDUSTRI 
CIRI-CIRI 
FI (RM)/ 
TAHUN 
Kecil 
Nilai perolehan tahunan kurang daripada 
RM500,000.00 
100 
Sederhana 
Nilai perolehan tahunan daripada 
RM500,000.00 hingga RM5 Juta 
400 
Besar Nilai perolehan tahunan melebihi RM5 Juta 700 
Jadual 5 : Kadar Fi Pensijilan Premis Makanan 
(Katering/ Khidmat Penyajian Makanan/ Dapur Pusat Konvensyen) 
 
 
10. PENAMBAHAN MENU 
 
Setiap  permohonan  penambahan  menu  termasuklah  menu  promosi  bagi 
pemegang  SPHM  di  bawah  skim  premis  makanan  hendaklah  dikenakan  
bayaran  fi  sebanyak  Ringgit  Malaysia  Dua  Ratus  (RM200.00)  sahaja  bagi  
tempoh dua (2) tahun. 
 
 
11. CETAKAN POSTER LOGO HALAL 
 
Cetakan  poster  logo  halal  bagi  pemegang  SPHM  skim  premis  makanan  
hendaklah  dikenakan  bayaran  fi  sebanyak  Ringgit  Malaysia  Lima  Puluh  
(RM50.00) sahaja bagi setiap keping poster. 
 
 
12. PENSIJILAN RUMAH SEMBELIHAN 
 
Setiap   permohonan   baharu dan pembaharuan di   bawah   skim   rumah   
sembelihan hendaklah dikenakan bayaran fi seperti Jadual 5 di bawah: 
 
SKIM RUMAH SEMBELIHAN 
JENIS 
INDUSTRI 
JENIS HAIWAN 
JUMLAH 
PENGELUARAN 
HARIAN 
FI (RM)/ 
TAHUN 
Kecil 
Ayam atau poltri lain 
atau arnab 
1 – 2,999 ekor 
100 
Kambing, biri-biri atau 
rusa 
1 – 499 ekor 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
16 
 
Lembu, kerbau atau 
unta 
1 – 49 ekor 
Sederhana 
Ayam atau poltri lain 
atau arnab 
3,000 – 10,000 ekor 
400 
Kambing, biri-biri atau 
rusa 
500 – 700 ekor 
Lembu, kerbau atau 
unta 
50 – 100 ekor 
Besar 
Ayam atau poltri lain 
atau arnab 
Melebihi 10,000 ekor 
700 
Kambing, biri-biri atau 
rusa 
Melebihi 700 ekor 
Lembu, kerbau atau 
unta 
Melebihi 100 ekor 
Jadual 6 : Kadar Fi Pensijilan Rumah Sembelihan 
 
 
13. CETAKAN SEMULA SIJIL 
 
(1) Setiap  permohonan  untuk  mencetak  semula  SPHM  hendaklah  dikenakan 
bayaran fi  sebanyak  Ringgit  Malaysia  Lima  Puluh  (RM50.00) sahaja  bagi  
setiap keping sijil; dan 
 
(2) Tanpa   terikat   dengan   Prosedur   13 (1)   Manual   Prosedur   ini,   setiap   
permohonan  untuk  mencetak  semula  SPHM  yang  melibatkan  syarikat  dan/  
atau  pemohon  yang  berdaftar  di  luar  negara  dan  menjalankan  pengilangan  
produk  di  dalam  negara  hendaklah  dikenakan  bayaran fi  sebanyak  Ringgit 
Malaysia Satu Ribu (RM1000.00) sahaja. 
 
 
14. NOTA KONSAINAN 
 
Setiap   permohonan
 pengeluaran nota   konsainan   hendaklah   dikenakan 
bayaran fi sebanyak Ringgit Malaysia Satu Ratus (RM100.00) sahaja bagi 
setiap penerima konsainan (consignee). 
  
 
15. PEMBAYARAN 
 
(1) Syarikat dan/ atau pemohon hendaklah membuat bayaran dalam tempoh 14 
hari bekerja setelah menerima surat caj melalui sistem MYeHALAL; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
17 
 
(2) Kaedah   pembayaran   fi   hendaklah   merujuk   kepada   pihak   berkuasa   
berwibawa yang menguruskan permohonan tersebut secara: 
 
(a) Wang pos (postal order);  
 
(b) Kiriman wang (money order);  
 
(c) Draf bank (bank draft);  
 
(d) Bayaran dalam talian (online payment);  
 
(e) Cek; atau 
 
(f) Tunai. 
 
(3) Pembayaran  fi  hendaklah  dibuat  atas  nama  Ketua  Pengarah  JAKIM  atau  
MAIN atau JAIN atau Kerajaan Negeri (yang mana berkaitan); 
 
(4) Pembayaran  fi  cetakan  semula  SPHM,  nota  konsainan  dan  cetakan  poster  
logo halal hendaklah dibuat atas nama Ketua Pengarah JAKIM; 
 
(5) Setiap  pembayaran  fi  yang  telah  dijelaskan  hendaklah  dikeluarkan  resit  
bayaran;  
 
(6) Salinan  resit  pembayaran  hendaklah  dikemukakan  kepada  pihak  berkuasa  
berwibawa  (Bahagian  Pengurusan  Halal)  yang  menguruskan  permohonan  
tersebut (jika berkaitan);  
 
(7) Fi  yang  telah  dibayar  hendaklah tidak  akan  dikembalikan  dan  hendaklah 
tidak boleh dipindahkan ke permohonan lain; dan 
 
(8) Pihak  berkuasa  berwibawa hendaklah berkuasa  mengenakan  fi  tambahan  
sekiranya maklumat  penentuan  kadar  fi  yang  dikemukakan  oleh  syarikat  
dan/ atau pemohon adalah tidak tepat. 
 
 
16. PENGECUALIAN 
 
Pihak  berkuasa  berwibawa hendaklah berkuasa  mengecualikan bayaran fi 
bagi mana-mana permohonan yang diuruskan   sepenuhnya   oleh   pihak   
Kerajaan. 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
18 
 
BAHAGIAN IV 
KEPERLUAN PENSIJILAN 
 
 
17. KEPERLUAN UMUM 
 
Syarikat  dan/  atau  pemohon SPHM hendaklah mematuhi  keperluan  umum  
dalam Pensijilan Halal Malaysia (Domestik) yang berikut: 
 
(1) Bahan Mentah 
 
(a) Setiap  bahan  mentah  hendaklah  dipastikan  halal,  selamat  dan  tidak 
tercemar; 
 
(b) Bahan mentah yang  bersumberkan  haiwan  dan/  atau  berasaskan  
hasilan haiwan hendaklah dipersijilkan halal yang masih sah daripada 
pihak berkuasa berwibawa atau badan pensijilan halal yang diiktiraf; 
 
(c) Bahan mentah  yang  bersumberkan  haiwan  dan/  atau berasaskan 
hasilan haiwan  yang  diimport  (seperti  daging  lembu,  daging  ayam, 
gelatin dan lain-lain) hendaklah diperolehi daripada rumah sembelihan 
atau loji pemprosesan yang diluluskan JPV;  
 
(d) Bahan mentah yang  tidak  dipersijilkan  halal  atau dipersijilkan  halal 
oleh badan    pensijilan    yang    tidak    diiktiraf    JAKIM hendaklah 
mempunyai    dokumen sokongan yang    lengkap    (mengandungi    
komposisi bahan, carta alir dan sumber bahan mentah);  
 
(e) Setiap  bahan  mentah  hendaklah  dapat  dikenal  pasti  pengeluar  asal  
bahan mentah tersebut; 
 
(f) Bahan mentah yang telah menjalani proses   tambahan   (seperti 
pemotongan, pra   campuran, pembungkusan semula) oleh   pihak 
ketiga   termasuklah pembekal   atau   perantara hendaklah memiliki 
pensijilan halal yang sah; 
 
(g) Semua    bahan    mentah    hendaklah    diisytiharkan   dalam   borang   
permohonan  MYeHALAL secara  terperinci sama  seperti  label  pada 
bahan mentah tersebut; 
 
(h) Bahan  mentah  hendaklah mempunyai label yang jelas,  terang, boleh 
difahami serta tertera nama dan pengeluar bahan mentah; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
19 
 
(i)   Bahan   mentah   yang   digunakan   hendaklah   mematuhi   keperluan   
perundangan dan peraturan yang berkuat kuasa; dan 
 
(j)   Laporan  analisis  bagi  penentuan  kualiti  air  hendaklah  dikemukakan  
sekiranya  sumber  air  diperolehi  selain  daripada Jabatan  Bekalan  Air 
(jika berkaitan). 
 
(2) Produk, Menu dan Perkhidmatan 
 
(a) Produk yang dihasilkan hendaklah tidak menyerupai sebarang bentuk 
haiwan  yang  dikategorikan  sebagai  najis  mughallazah,  berunsurkan 
keagamaan  dan  memberi  implikasi  negatif  kepada  Pensijilan  Halal  
Malaysia; 
 
(b) Semua produk atau menu yang masih dihasilkan hendaklah dimohon 
SPHM; 
 
(c) Nama    produk    atau    menu    yang    diisytiharkan    dalam    borang    
permohonan  MYeHALAL  hendaklah  sama  sepertimana label  produk 
atau paparan menu; 
 
(d) Produk,  menu  dan perkhidmatan yang  dimohon  SPHM  hendaklah 
dihasil  atau  dikendalikan secara  konsisten  serta  mempunyai  rekod  
pemprosesan dan/ atau pengendalian yang dikemas kini;  
 
(e) Produk,  menu  dan  perkhidmatan  boleh digugurkan  daripada  senarai 
permohonan SPHM  sekiranya tidak  diproses  atau  tiada  sebarang  
pengendalian   perkhidmatan   sepanjang   tempoh   sah   laku   SPHM 
terdahulu;  
 
(f) Sukatan    dan    timbangan    produk    hendaklah    memenuhi    kadar    
kandungan atau kuantiti sepertimana dinyatakan pada label produk; 
 
(g) Produk,  menu  dan  perkhidmatan yang  diproses  atau  dikendalikan 
hendaklah  mematuhi  keperluan  perundangan  dan peraturan yang 
berkuat kuasa; dan 
 
(h) Produk   atau   menu   yang   masih   di   peringkat   penyelidikan   dan   
pembangunan    (R&D)    tetapi    telah    sedia    untuk dikomersialkan 
hendaklah memenuhi kriteria-kriteria yang berikut: 
 
(i)   Bahan  mentah  telah  tersedia  dan  dapat  disemak  semasa  
pengauditan atau pemantauan Pensijilan Halal Malaysia; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
20 
 
(ii)  Tiada   perubahan   pada   bahan   mentah   atau   ramuan   dan   
pelabelan; 
 
(iii) Telah  dijalankan  ujian  percubaan  (trial  run  atau pilot  run)  di  
aliran pengeluaran (production line); dan 
 
(iv) Diluluskan oleh pihak pengurusan syarikat. 
 
(3) Pemprosesan 
 
(a) Segala   aktiviti   berkaitan   penyediaan   dan   pemprosesan   bahan 
mentah,   produk,   menu   atau   perkhidmatan   hendaklah   memenuhi   
keperluan Hukum  Syarak,  perundangan dan peraturan yang berkuat 
kuasa; 
 
(b) Kawasan  pemprosesan hendaklah  bebas  daripada  sebarang  bahan 
mentah atau produk tidak halal atau diragui status halal; 
 
(c) Kawasan  pemprosesan  hendaklah  tidak  digunakan  untuk  tujuan  lain  
selain   daripada   pemprosesan   dan   pengendalian   produk   yang   
dipersijilkan halal melainkan mekanisme kawalan halal dilaksanakan; 
 
(d) Kawasan  pemprosesan hendaklah  bebas  daripada  sebarang  aktiviti  
penghasilan produk untuk tujuan keagamaan yang memberi implikasi 
negatif  kepada  Pensijilan  Halal  Malaysia seperti penghasilan minyak 
sembahyang; 
  
(e) Pemprosesan   dan   pengendalian   hendaklah memenuhi   keperluan   
amalan kebersihan   yang   baik   seperti   GHP   dan/ atau amalan 
pengilangan yang baik seperti GMP; 
 
(f) Kawasan pemprosesan hendaklah berada dalam keadaan bersih dan 
teratur pada setiap masa; dan  
 
(g) Bahan  kimia  beracun  atau  berbahaya, bahan  pencuci,  peralatan dan 
barangan yang  tidak  berkaitan hendaklah  tidak  diletak atau disimpan 
bersama  bahan  mentah  dan  produk  di  kawasan  pemprosesan tanpa 
kawalan.  
 
(4) Penyimpanan 
 
(a) Penyimpanan   hendaklah dikhususkan   untuk   bahan mentah dan 
produk halal sahaja termasuklah produk dagangan (trading product); 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
21 
 
(b) Penyimpanan  bahan  mentah,  produk  siap,  bahan  atau  produk  R&D,  
reject  item  dan  lain-lain  bahan  seperti  peralatan  dan  bahan  kimia  
bukan makanan hendaklah diasing dan dilabelkan; 
 
(c) Peralatan,    bahan    dan    produk    yang    tidak    berkaitan    dengan 
pemprosesan  atau  penghasilan  produk  hendaklah  tidak  disimpan 
bersama-sama bahan mentah dan produk siap; 
 
(d) Semua  bahan  dan  produk  hendaklah disimpan mengikut  keperluan  
sifat bahan dan produk (nature of product) tersebut; 
 
(e) Kawasan penyimpanan hendaklah berada dalam keadaan bersih dan 
teratur pada setiap masa; 
 
(f) Kawasan  penyimpanan  hendaklah mempunyai  prosedur  dan  rekod  
yang lengkap serta mempunyai penandaan yang jelas; 
  
(g) Semua  bahan  dan  produk  hendaklah  disusun  atur  dan  dikawal  selia  
dengan  baik  bagi  memudahkan  aktiviti  pembersihan.  Penggunaan  
alas seperti pallet perlulah bersesuaian;  
 
(h) Kontrak atau perjanjian bertulis atau persetujuan bersama hendaklah 
diperolehi   sekiranya penyimpanan diuruskan   oleh   pihak   ketiga. 
Keutamaan   hendaklah   diberikan   kepada   penyedia   perkhidmatan   
penggudangan yang memiliki SPHM;  
 
(i)   Sebarang aktiviti penyimpanan bahan mentah atau produk hendaklah 
mematuhi keperluan perundangan dan peraturan yang berkuat kuasa; 
dan 
 
(j)   Proses  sertu  hendaklah dijalankan  sekiranya  kawasan  penyimpanan 
tercemar dengan najis mughallazah. 
 
(5) Peralatan dan Perkakasan 
 
(a) Peralatan  dan  perkakasan  hendaklah  digunakan  untuk  pemprosesan 
dan  pengendalian  bahan mentah,  produk  dan perkhidmatan halal 
sahaja; 
 
(b) Peralatan  dan  perkakasan  yang  boleh  memberikan  implikasi  negatif  
terhadap Pensijilan Halal Malaysia seperti penggunaan peralatan dan 
perkakasan berlabelkan produk arak hendaklah tidak digunakan;  
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
22 
 
(c) Peralatan  dan  perkakasan  daripada  sumber  haiwan  hendaklah  tidak  
digunakan  kecuali  yang dikenal  pasti  status  halal  seperti  penapis air, 
berus bulu, pinggan mangkuk dan lain-lain; 
 
(d) Peralatan  dan  perkakasan  hendaklah  sentiasa  dalam  keadaan  baik, 
bersih,   bebas   daripada   najis,   tidak   mempunyai   sebarang   bahan   
mudarat   (seperti   toksik   dan   karat)   dan   tidak   memberi   kesan   
sampingan negatif terhadap produk serta pengendali; 
 
(e) Peralatan     dan     perkakasan     hendaklah mempunyai     prosedur     
pembersihan dan  penyelenggaraan secara  berkala dan  berjadual 
supaya  sentiasa  berkeadaan  baik  terutamanya  alat  timbang  dan  
sukat; 
 
(f) Peralatan   dan   perkakasan   yang   rosak   atau   tidak   digunakan 
hendaklah dikenal pasti, dikeluar atau diasingkan;  
 
(g) Peralatan  dan  perkakasan  yang  digunakan  hendaklah  bersesuaian  
serta  mematuhi  keperluan  perundangan  dan  peraturan  yang  berkuat 
kuasa; dan 
 
(h) Proses    sertu    hendaklah dijalankan sekiranya peralatan    dan    
perkakasan  tercemar dengan najis mughallazah.  
 
(6) Pembungkusan, Pelabelan dan Pengiklanan 
 
(a) Bahan  pembungkusan  dan  pelabelan  hendaklah dipastikan  halal,  
tidak mencemarkan produk dan selamat untuk kegunaan manusia; 
 
(b) Pembungkusan,    pelabelan    dan    pengiklanan hendaklah    tidak 
melanggar  prinsip-prinsip  Hukum  Syarak,  tidak  menonjolkan  unsur-
unsur  tidak  sopan  yang  bertentangan  moral  dan memberi  implikasi  
negatif kepada Pensijilan Halal Malaysia; 
 
(c) Pelabelan  serta  pengiklanan  produk  dan  perkhidmatan hendaklah 
tidak  menggunakan  pernyataan,  lambang,  istilah  atau  nama  yang  
berunsurkan  keagamaan  dan  ketuhanan seperti nama-nama Allah, 
makanan sunnah, dewa dan seumpamanya;   
 
(d) Sebarang   bentuk   rajah   atau   iIustrasi   haiwan   yang   dikategorikan   
sebagai  najis  mughallazah,  berunsurkan  keagamaan dan  memberi  
implikasi  negatif  kepada  Pensijilan  Halal  Malaysia hendaklah  tidak  
digunakan; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
23 
 
(e) Pelabelan  produk  hendaklah  sama  sepertimana  nama  produk  yang  
diisytiharkan dalam borang permohonan MYeHALAL; 
  
(f) Label  pembungkusan  hendaklah  dicetak  dengan  terang  dan  jelas  
serta tidak mudah dipadamkan;  
 
(g) Sebarang    tuntutan    pada    label    produk    hendaklah    mematuhi    
perundangan    dan    peraturan    yang    dikuatkuasakan    oleh    pihak    
berkuasa yang berkaitan; 
 
(h) Pembungkusan,   pelabelan   dan   pengiklanan   hendaklah   mematuhi 
piawaian, perundangan dan  peraturan  yang  dikuatkuasakan  oleh  
pihak berkuasa yang berkaitan; 
 
(i)   Pelabelan   produk   yang   diproses   dan   dibungkus   dalam   negara   
hendaklah menggunakan Bahasa   Melayu dan   boleh   termasuk   
terjemahannya dalam mana-mana bahasa lain; dan 
 
(j)   Maklumat-maklumat yang berikut  hendaklah  dipamerkan  pada  label  
produk: 
 
(i)   Nama produk; 
 
(ii)  Nama dan alamat pemegang SPHM; dan 
 
(iii) Logo Halal Malaysia berserta nombor MS dan nombor rujukan 
fail (10 angka terakhir)  
 
Contoh: 
 
 
 
 
 
 
 
       
      MS 1500 
      1 059-02/2008 
 
(7) Pengangkutan dan Pengedaran 
 
(a) Pengangkutan  dan  pengedaran  hendaklah  untuk  kegunaan bahan 
mentah dan produk halal sahaja; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
24 
 
 
(b) Pengangkutan   yang   bersesuaian   hendaklah digunakan mengikut 
keperluan sifat bahan mentah dan produk (nature of product); 
 
(c) Pengangkutan hendaklah dipastikan berada dalam  keadaan  bersih  
dan terkawal pada setiap masa; 
 
(d) Kontrak atau perjanjian bertulis atau persetujuan bersama hendaklah 
diperolehi  sekiranya  pengangkutan  dan  pengedaran  diuruskan  oleh  
pihak   ketiga.   Keutamaan   hendaklah diberikan   kepada   penyedia 
perkhidmatan pengangkutan yang memiliki SPHM;  
 
(e) Sebarang  aktiviti  pengangkutan  dan  pengedaran bahan  mentah  atau  
produk  hendaklah  mematuhi  keperluan  perundangan  dan  peraturan 
yang berkuat kuasa; dan 
 
(f) Proses sertu hendaklah dijalankan sekiranya pengangkutan tercemar 
dengan najis mughallazah.  
 
(8) Premis 
 
(a) Kawasan  premis  termasuklah  di  pejabat, kantin dan  tempat  tinggal  
pekerja hendaklah dipastikan  bebas  daripada  bahan  mentah dan 
produk tidak halal seperti arak dan daging babi;  
 
(b) Sistem pengawalan   yang   berkesan   hendaklah diwujudkan untuk 
mengelakkan  pencemaran dari premis  pemprosesan  produk  tidak 
halal, loji kumbahan najis, pusat penternakan haiwan dan lain-lain; 
 
(c) Premis hendaklah berpagar atau mempunyai mekanisme pengawalan 
bagi  mencegah haiwan  peliharaan  atau  liar,  serangga  dan  haiwan  
perosak  daripada  memasuki  atau  berada  di  dalam  kawasan  premis 
tersebut; 
 
(d) Premis hendaklah dalam keadaan baik, bersih dan kemas pada setiap 
masa; 
 
(e) Lantai, dinding,  siling,  kipas,  penghawa  dingin,  tingkap  dan  pintu 
hendaklah berkeadaan   bersih   dan   tidak   menyumbang   kepada   
pencemaran; 
 
(f) Alas bersesuaian seperti pallet  hendaklah  digunakan  di  kawasan  
pemprosesan    untuk    mengelakkan    bahan    mentah    dan    produk    
diletakkan secara terus di atas lantai; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
25 
 
 
(g) Pengudaraan     dan     pencahayaan hendaklah     mencukupi     dan     
bersesuaian; 
 
(h) Lampu  yang  digunakan  hendaklah  dalam  keadaaan  baik,  bersih  dan  
berpenutup (jika berkaitan) di kawasan pemprosesan; 
 
(i)   Premis  hendaklah  memenuhi  keperluan  amalan  pengilangan  yang  
baik seperti VHM dan GMP; 
 
(j)   Pelan susun atur premis hendaklah disediakan. Susun atur hendaklah 
mengelakkan   pencemaran   silang,   memudah   aktiviti   pembersihan, 
memudahkan  proses  pengeluaran  atau  pengendalian  bahan  mentah  
dan  produk  serta  mematuhi  kehendak  keselamatan  dan  kesihatan  
pekerja; 
 
(k) Tempat  tinggal  pekerja  hendaklah  tidak  berada  di  dalam  kawasan  
premis. Namun sekiranya perlu, hendaklah mematuhi keperluan yang 
berikut: 
 
(i)   Tinggal di  bangunan  berasingan dari  kawasan  pemprosesan; 
atau 
 
(ii)  Jika  di  bangunan  yang  sama,  hendaklah  mempunyai  laluan  
masuk yang berasingan ke kawasan pemprosesan; 
 
(iii) Tiada  laluan  terus  dari  tempat  tinggal  pekerja  ke  kawasan  
pemprosesan; dan 
 
(iv) Mempunyai   mekanisme   pengawalan   keluar   masuk   pekerja 
yang berkesan. 
 
(l)   Sistem  saliran dan  perparitan hendaklah  berada  dalam  keadaan  
bersih dan diselenggara dengan sempurna; 
 
(m) Premis  pemprosesan  dan  pengendalian  produk  yang  dipersijilkan  
halal  hendaklah  mematuhi  keperluan  perundangan  dan peraturan 
yang berkuat kuasa; dan 
 
(n) Proses  sertu  hendaklah  dijalankan  sekiranya berlaku  pencemaran 
dengan najis mughallazah.  
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
26 
 
(9) Pekerja 
 
(a) Jumlah  pekerja  Muslim  hendaklah mencukupi  mengikut  keperluan 
kategori permohonan; 
 
(b) Kebersihan diri hendaklah sentiasa berada pada tahap yang baik; 
 
(c) Pakaian pekerja hendaklah bersih, sopan dan bersesuaian; 
 
(d) Barangan  peribadi,  makanan  dan  minuman  pekerja  hendaklah  tidak  
dibawa masuk ke kawasan pemprosesan; 
 
(e) Kelengkapan  pelindungan  peribadi  (personal  protective  equipment) 
yang   bersesuaian   dengan   kehendak   pekerjaan   seperti   penutup 
kepala, sarung tangan, pelindung muka, kaca mata keselamatan dan 
lain-lain hendaklah dibekalkan kepada setiap pekerja; 
 
(f) Pekerja hendaklah tidak melakukan apa-apa perbuatan, kelakuan dan 
tindakan yang boleh menyebabkan pencemaran terhadap bahan dan 
produk seperti merokok atau meludah;  
 
(g) Pelantikan  dan  pengambilan  pekerja  hendaklah  mematuhi  keperluan  
perundangan dan peraturan yang berkuat kuasa; dan 
 
(h) Hendaklah  mengamalkan  kod  etika  pekerja  dan  Amalan  Kebersihan  
Yang  Baik  (GHP)  sepertimana  yang ditetapkan  di  bawah  peraturan 
pihak berkuasa yang berkaitan. 
 
(10) Sanitasi 
 
(a) Pembersihan di  kawasan  pemprosesan  hendaklah  dilakukan  secara 
berjadual; 
 
(b) Persekitaran   premis   hendaklah   berkeadaan   bersih   dan   terhindar   
daripada faktor yang boleh mencemarkan premis; 
 
(c) Kawalan makhluk  perosak  (pest  control)  hendaklah  dilaksanakan  
secara berkala  menggunakan  kontraktor  luar  atau  secara  dalaman 
serta perlu direkodkan; 
 
(d) Kemudahan  mencuci  tangan  hendaklah  disediakan dan  berfungsi 
dengan baik  serta  mempunyai  alatan  sanitasi  yang  bersesuaian  
seperti sabun dan tisu;   
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
27 
 
(e) Tong  sampah  yang  disediakan hendaklah mencukupi,  berkeadaan  
baik   dan   berpenutup.   Digalakkan   menggunakan   tong   sampah   
daripada jenis bebas tangan (hands free atau foot pedal); 
 
(f) Tandas  hendaklah  mempunyai  prosedur  pembersihan,  berkeadaan 
bersih,  tidak  berbau,  tidak  rosak  dan  tidak  terbuka  secara  langsung  
kepada kawasan pemprosesan; dan 
 
(g) Prosedur    pembuangan    bahan    dan    pelupusan    sisa    buangan 
hendaklah    diuruskan    dengan    baik, teratur serta mematuhi 
perundangan dan peraturan pihak berkuasa berkaitan. 
 
(11) Kemudahan dan Kebajikan Pekerja 
 
(a) Bilik atau ruang solat kepada pekerja Muslim hendaklah disediakan di 
lokasi yang munasabah, mempunyai keluasan yang bersesuaian dan 
diselenggara dengan baik; 
 
(b) Pekerja  Muslim  hendaklah diberikan  pelepasan  dan  diperuntukkan 
masa  yang  sewajarnya  untuk  menunaikan  solat  fardhu  termasuklah  
solat Jumaat;  
 
(c) Bilik   atau   ruang   persalinan   untuk   pekerja   hendaklah disediakan 
sewajarnya; 
 
(d) Ruang  makan  atau  rehat  untuk  pekerja  perlulah  disediakan  dengan  
sewajarnya; dan 
 
(e) Kemudahan    penyimpanan    barang    peribadi    pekerja    hendaklah 
disediakan. 
 
(12) Latihan 
 
(a) Latihan    kesedaran    halal    kepada    pekerja    baharu    hendaklah    
dilaksanakan dalam tempoh tiga (3) bulan dari tarikh lantikan; 
  
(b) Latihan kesedaran halal hendaklah dilaksanakan sekurang-kurangnya 
tiga  (3)  tahun  sekali  kepada  semua  pekerja  yang  terlibat  dengan  
aktiviti pemprosesan dan/ atau perkhidmatan;  
 
(c) Latihan kesedaran halal   hendaklah   merangkumi   skop   berkaitan   
konsep    halal    dan    prosedur    Pensijilan    Halal    Malaysia,    dan 
dikendalikan  oleh  organisasi  atau  individu  yang  berdaftar  di  bawah  
HPB JAKIM;  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
28 
 
 
(d) Latihan  kesedaran  halal  boleh  dipanjangkan  kepada  pihak  ketiga  
yang    berkaitan    seperti    pemilik    jenama,    pembekal,    penyedia    
pengangkutan dan lain-lain yang difikirkan perlu;  
 
(e) Latihan    kompetensi    halal    hendaklah    dilaksanakan    sekurang-
kurangnya  tiga  (3)  tahun  sekali  kepada  semua  ahli  Jawatankuasa  
Halal  Dalaman  yang  dilantik  secara  rasmi  oleh  pihak  pengurusan  
tertinggi syarikat; 
 
(f) Latihan   kompetensi   halal   hendaklah   dikendalikan   oleh   Penyedia 
Latihan   Halal   yang   berdaftar   di   bawah   HPB   JAKIM   atau   pihak   
berkuasa berwibawa yang merangkumi skop berikut: 
 
(i)   Pemahaman Syariah dan fatwa;  
 
(ii)  Malaysian Standard (MS); 
 
(iii) Manual Prosedur Pensijilan Halal Malaysia; 
 
(iv) Sistem Pengurusan Halal Malaysia (MHMS); 
 
(v) Perundangan berkaitan halal; dan 
 
(vi) Ramuan kritikal (jika berkaitan). 
 
(g) Pengurusan  syarikat  hendaklah  menyediakan  dana  kewangan  dan 
prasarana yang mencukupi bagi tujuan pelaksanaan latihan; dan 
 
(h) Rekod  latihan  kesedaran  halal  dan latihan  kompetensi  hendaklah 
disimpan dengan baik, dikemas kini dan mudah untuk dirujuk semasa 
pengauditan atau pemantauan Pensijilan Halal Malaysia. 
 
(13) Sistem Pengurusan Halal Malaysia (MHMS) 
 
(a) Pembangunan,    pelaksanaan    dan    pengekalan kawalan halal 
berdasarkan Manual MHMS 2020; dan 
  
(b) Penyeliaan dan    pemantauan berterusan terhadap    keperluan    
Pensijilan  Halal  Malaysia  hendaklah dilaksanakan  untuk  memastikan 
kelangsungan kawalan halal dalaman syarikat. 
    
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
29 
 
(14) Dokumentasi dan Rekod 
 
(a) Dokumen   dan   rekod   hendaklah   sentiasa   disimpan   dengan baik, 
dikemas  kini  dan  mudah untuk  dirujuk  semasa  pengauditan  atau  
pemantauan Pensijilan Halal Malaysia; 
 
(b) Dokumen  dan  rekod  berkaitan  halal  hendaklah disediakan semasa 
pengauditan  atau  pemantauan Pensijilan  Halal  Malaysia  dan  tidak  
terhad kepada senarai yang berikut: 
 
(i)   Fail permohonan halal; 
 
(ii)  Fail MHMS; 
 
(iii) Salinan sijil halal syarikat (jika berkaitan); 
 
(iv) Rekod pekerja; 
 
(v) Rekod latihan halal; 
 
(vi) Rekod pembelian bahan mentah; 
 
(vii) Rekod kawalan makhluk perosak; 
 
(viii) Rekod pemprosesan produk; 
 
(ix) Rekod pengauditan atau pemantauan Pensijilan Halal Malaysia 
terdahulu; dan 
 
(x) Lain-lain   dokumen   dan   rekod   yang   berkaitan   keperluan 
Pensijilan Halal Malaysia. 
 
(c) Dokumen  dan  rekod  hendaklah  disimpan  sekurang-kurangnya bagi 
tempoh tiga (3) tahun; dan 
 
(d) Permohonan  baharu  SPHM  hendaklah  memiliki  sekurang-kurangnya 
tiga (3) bulan dokumen dan rekod untuk tujuan pengauditan Pensijilan 
Halal Malaysia. 
 
(15) Alat dan Unsur Penyembahan 
 
Sebarang  alat  dan  unsur  penyembahan  hendaklah  tidak  berada  di  
dalam kawasan pemprosesan. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
30 
 
(16) Pematuhan Undang-undang dan Peraturan 
 
(a) Operasi  perniagaan  hendaklah  mematuhi  semua  perundangan dan 
peraturan yang berkuat kuasa; 
 
(b) Manual   MHMS   2020,   MS,   fatwa, prosedur   dan   pekeliling   yang   
dikuatkuasakan  oleh  pihak  berkuasa  berwibawa  hendaklah dipatuhi; 
dan 
 
(c) Pihak     berkuasa     berwibawa berkuasa menolak     mana-mana 
permohonan  atau  mengambil  apa-apa tindakan yang  difikirkan  perlu  
ke   atas   syarikat   dan/   atau   pemohon   yang   didapati   menyalahi   
perundangan dan peraturan yang berkuat kuasa. 
 
(17) Pengilangan Kontrak/ OEM  
 
(a) Pihak   yang   menjalankan   pengilangan   kontrak/   OEM   hendaklah   
membuat   permohonan   dan   memperolehi   SPHM   di   bawah   skim   
pengilangan kontrak/ OEM sebelum layak menawarkan perkhidmatan 
pengilangan produk kepada syarikat lain; dan 
 
(b) Mana-mana syarikat    dan/    atau    pemohon SPHM    hendaklah    
memastikan   pihak   yang   dilantik   untuk   menjalankan   pengilangan   
produk secara  kontrak  memiliki  SPHM  di  bawah  skim  pengilangan  
kontrak/ OEM terlebih dahulu.  
 
 
18. KEPERLUAN KHUSUS 
 
Syarikat  dan/  atau  pemohon  SPHM  hendaklah  mematuhi  keperluan  khusus  
dalam Pensijilan Halal Malaysia (Domestik) yang berikut: 
 
(1) Skim Produk Makanan dan Minuman 
 
(a) Setiap   premis   hendaklah   memiliki   Perakuan   Pendaftaran   Premis   
Makanan yang masih sah daripada BKKM; 
  
(b) Setiap    pengendali    makanan    hendaklah    memiliki Sijil Latihan 
Pengendali Makanan dari  pada institusi yang diiktiraf oleh KKM; 
 
(c) Setiap    pengendali    makanan hendaklah mendapatkan    suntikan    
vaksinasi  anti  tifoid yang  masih  sah daripada pengamal  perubatan  
berdaftar; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
31 
 
(d) Setiap produk yang mengandungi gabungan ubat dan makanan (food-
drug   interphase)   hendaklah   mengemukakan   surat   pengkelasan   
produk daripada NPRA (jika berkaitan); 
 
(e) Keperluan MS  1500:2019 Halal  Food-General  Requirements (Third 
Revision),   Akta   Makanan   1983   (Akta   281),   Peraturan-Peraturan 
Makanan 1985, Peraturan-Peraturan Kebersihan Makanan 2009 serta 
lain-lain perundangan dan peraturan terkini yang dikuatkuasakan oleh 
pihak berkuasa berkaitan hendaklah dipatuhi; dan 
 
(f) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan secara berkesan dengan   memenuhi   elemen   yang 
berikut: 
 
(i)   Industri Besar dan Sederhana  
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana berdasarkan 
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan 
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
32 
 
(2) Skim Produk Kosmetik 
 
(a) Setiap  produk  kosmetik  hendaklah  bernotifikasi atau mendapat  surat 
kebenaran  mengilang  produk  kosmetik  tidak  bernotifikasi  bagi  tujuan 
eksport (for export only) dari  pada NPRA; 
 
(b) Premis   yang   memproses   dan   menghasilkan   produk   kosmetik   
hendaklah memenuhi keperluan yang dinyatakan dalam Annex I, Part 
10:  Guideline  for  Cosmetic  GMP, Guidelines  for  Control  of  Cosmetic  
Products in Malaysia; 
 
(c) Keperluan MS 2634:2019 Halal  Cosmetics-General Requirements 
(First  Revision),  Control  of  Drugs  and  Cosmetics  Regulations  1984, 
Guidelines  For  Control  of  Cosmetic  Products  In  Malaysia 2017 serta 
lain-lain perundangan dan peraturan terkini yang dikuatkuasakan oleh 
pihak berkuasa berkaitan hendaklah dipatuhi;  
 
(d) Dokumen Notification     Detail(s) daripada NPRA hendaklah 
dikemukakan bagi  setiap  produk  kosmetik  yang  dipohon  pensijilan 
halal;  
 
(e) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan secara   berkesan   dengan   memenuhi   elemen   yang 
berikut: 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana berdasarkan 
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
33 
 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(3) Skim Produk Farmaseutikal 
 
(a) Setiap produk farmaseutikal hendaklah berdaftar dengan PBKD; 
 
(b) Premis  yang  memproses  dan  menghasilkan  produk  farmaseutikal  
hendaklah memiliki Lesen Pengilang daripada NPRA serta memenuhi 
keperluan GMP; 
  
(c) Produk  farmaseutikal  yang layak dipersijilkan  halal  adalah di  bawah  
kategori yang berikut: 
 
(i)   Produk racun berjadual;  
 
(ii)  Produk bukan racun berjadual (over-the-counter);  
 
(iii) Produk suplemen kesihatan; atau 
 
(iv) Produk       semulajadi       (Ubat-ubatan       tradisional       dan       
komplementari). 
  
(d) Keperluan MS      2424:2019 Halal Pharmaceuticals-  General 
Requirements (First  Revision),  Sale  of  Drugs  Act  1952,  Control  of  
Drugs  and  Cosmetics  Regulations  1984,  Drug  Registration  Guidance  
Document  (DRGD) serta  lain-lain  perundangan  dan  peraturan  terkini 
yang   dikuatkuasakan   oleh pihak   berkuasa   berkaitan hendaklah 
dipatuhi; dan 
 
(e) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen   yang 
berikut: 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
34 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara 
Malaysia, berjawatan   tetap   hendaklah   dilantik   dan 
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan 
bagi    premis    dan    setiap    cawangan    premis    yang 
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana berdasarkan 
Manual MHMS 2020; 
 
(ii)  Industri Kecil  
a. Minimum   seorang (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(4) Skim Premis Makanan  
 
(a) Memiliki  Perakuan  Pendaftaran  Premis  Makanan  yang  masih  sah  
daripada BKKM; 
 
(b) Setiap    pengendali    makanan    hendaklah    memiliki    Sijil    Latihan    
Pengendali Makanan daripada institusi yang diiktiraf oleh KKM; 
 
(c) Setiap    pengendali    makanan    hendaklah    mendapatkan    suntikan    
vaksinasi  anti  tifoid  yang  masih  sah  daripada  pengamal  perubatan  
berdaftar; 
 
(d) Keperluan  MS  1500:2019 Halal  Food-General  Requirements (Third 
Revision),   Akta   Makanan   1983   (Akta   281),   Peraturan-Peraturan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
35 
 
Makanan 1985, Peraturan-Peraturan Kebersihan Makanan 2009 serta 
lain-lain perundangan dan peraturan terkini yang dikuatkuasakan oleh 
pihak berkuasa berkaitan hendaklah dipatuhi;  
 
(e) Premis   makanan   yang   mempunyai   dapur   berpusat   hendaklah   
memiliki  SPHM  terlebih  dahulu  di  bawah  skim  produk  makanan dan 
minuman; 
 
(f) Premis  makanan  berangkai yang  menggunakan  jenama  yang  sama  
hendaklah membuat   permohonan   SPHM bagi   setiap   rangkaian   
premis dan permohonan hendaklah diuruskan secara berpusat; 
 
(g) Menu   yang   diisytiharkan   pada   borang   permohonan MYeHALAL 
hendaklah sama sepertimana dinyatakan pada paparan menu;  
 
(h) Memohon   SPHM   bagi semua   menu   yang   disediakan   di   premis   
makanan.    Menu    yang    tidak    diisytiharkan    hendaklah    dibuat    
permohonan penambahan menu;  
 
(i)   MHMS   hendaklah   dibangun   dan   dilaksanakan   secara   berkesan 
dengan merujuk kepada Manual MHMS 2020; dan 
 
(j)   Premis  makanan  hendaklah  memenuhi  keperluan tambahan yang 
berikut: 
 
(i)   Hotel (Dapur dan/ atau Restoran) 
a. Minimum dua (2) orang pekerja Muslim berjawatan tetap 
hendaklah dilantik bagi   setiap   dapur   dan   bertugas   
sepanjang tempoh operasi atau syif; 
b. Eksekutif Halal hendaklah dilantik bagi setiap cawangan 
hotel; 
c. Jawatankuasa   Halal   Dalaman hendaklah ditubuhkan 
bagi setiap cawangan hotel; 
d. HAS  hendaklah  dibangun  dan  dilaksana berdasarkan 
Manual MHMS 2020; 
e. Senarai    semua    dapur    dan/    atau    restoran    yang    
beroperasi di hotel hendaklah dikemukakan;  
f. Penentuan  bilangan  dapur  hotel  yang  dimohon SPHM 
hendaklah berdasarkan kawasan atau ruang dapur yang 
memiliki laluan   keluar   masuk   (entry   access)   yang   
khusus atau spesifik; (Rujuk LAMPIRAN B) 
g. Dapur  yang  dipersijilkan  halal  hendaklah  mempunyai  
pengasingan   yang   jelas   dengan   dapur   yang   tidak   

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
36 
 
dipersijilkan halal serta mempunyai mekanisme kawalan 
halal yang berkesan; 
h. Makanan  dan  minuman yang  dibekalkan untuk  peserta  
program dan penginap hotel hendaklah dari dapur yang 
memiliki SPHM; 
i. Hidangan  dari  dapur  yang  dipersijilkan  halal  hendaklah  
tidak bercampur dengan hidangan dari dapur yang tidak 
dipersijilkan halal; dan 
j. Makanan  dan  minuman  yang  dibekalkan  ke  restoran  
yang   dipersijilkan   halal   hendaklah   dari   dapur   yang   
memiliki   SPHM   termasuklah   dapur   terbuka   (open 
kitchen).  
 
(ii)  Restoran atau Kafe, Kantin dan Kedai Bakeri 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia berjawatan tetap hendaklah dilantik bagi setiap 
premis   makanan dan   bertugas   sepanjang   tempoh   
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis makanan; 
c. IHCS  hendaklah  dibangun  dan  dilaksana berdasarkan 
Manual MHMS 2020; 
d. Makanan  dan  minuman  hendaklah  disediakan  di  dapur  
yang dipersijilkan halal; dan 
e. Syarikat dan/ atau pemohon yang mempunyai minimum 
tiga  (3)  restoran  atau  kafe,  kantin  dan  kedai  bakeri 
menggunakan jenama   sama   hendaklah   memenuhi   
keperluan  premis  makanan  berangkai  [klausa  18  (4)  (j) 
(iii)].  
 
(iii) Premis Makanan Berangkai  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia berjawatan tetap hendaklah dilantik bagi setiap 
premis makanan dan   bertugas   sepanjang   tempoh   
operasi atau syif; 
b. Eksekutif    Halal    hendaklah    dilantik    di    peringkat    
pengurusan syarikat atau dapur berpusat; 
c. Jawatankuasa  Halal  Dalaman  hendaklah  ditubuhkan di 
peringkat pengurusan syarikat atau dapur berpusat; dan 
d. HAS   hendaklah   dibangun   di   peringkat   pengurusan   
syarikat dan   dilaksana di   setiap   premis   makanan 
berdasarkan Manual MHMS 2020. 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
37 
 
(iv) Katering dan/ atau Khidmat Penyajian Makanan dan Dapur 
Pusat Konvensyen  
 
a. Industri Besar dan Sederhana 
i. Minimum dua    (2)    orang    pekerja    Muslim    
berjawatan  tetap  hendaklah  dilantik  bagi  setiap  
dapur  atau  penyediaan  makanan  dan  minuman 
sepanjang tempoh operasi atau syif; 
ii. Eksekutif   Halal   hendaklah   dilantik   di setiap 
premis makanan; 
iii. Jawatankuasa      Halal      Dalaman      hendaklah      
ditubuhkan bagi   premis   makanan   dan   setiap   
cawangan   premis   makanan yang   mempunyai   
pengurusan operasi berbeza;  
iv.  HAS     hendaklah     dibangun     dan     dilaksana 
berdasarkan Manual MHMS 2020; 
v. Makanan  dan  minuman  hendaklah  disediakan  di  
dapur yang dipersijilkan halal; dan 
vi.    Permohonan hendaklah merangkumi keseluruhan 
dapur premis.  
 
b.  Industri Kecil  
i. Minimum seorang (1) pekerja      Muslim 
warganegara      Malaysia berjawatan      tetap      
hendaklah  dilantik  bagi  setiap  premis  makanan  
dan  bertugas  sepanjang  tempoh  operasi  atau  
syif; 
ii. Penyelia   Halal   hendaklah   dilantik   di   premis   
makanan; 
iii. IHCS     hendaklah     dibangun     dan     dilaksana 
berdasarkan Manual MHMS 2020;  
iv.  Makanan  dan  minuman  hendaklah  disediakan  di  
dapur yang dipersijilkan halal; dan 
v. Permohonan hendaklah merangkumi keseluruhan 
dapur premis. 
 
(v) Premis Bergerak 
a. Syarikat     dan/     atau pemohon yang     membuat     
permohonan SPHM hendaklah menjalankan penyediaan 
dan   pemprosesan   sepenuhnya   di   premis   bergerak   
berkenaan atau memiliki dapur berpusat; 
b. Minimum   seorang   (1)   pekerja Muslim   warganegara 
Malaysia   berjawatan   tetap   hendaklah   dilantik   dan   

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
38 
 
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020; 
d. Premis   hendaklah   beroperasi   mengikut   lokasi   yang   
ditetapkan oleh pihak berkuasa berkaitan;  
e. Makanan  dan  minuman  hendaklah  disediakan  di  dapur  
yang dipersijilkan halal;  
f. Tempat simpanan khusus (seperti stor simpanan) untuk 
bahan ramuan dan peralatan hendaklah disediakan bagi 
premis   bergerak   yang   menjalankan penyediaan   dan   
pemprosesan  sepenuhnya  di  premis  bergerak  tersebut; 
dan 
g. Syarikat dan/ atau pemohon yang mempunyai minimum 
tiga   (3)   premis   bergerak   jenama   sama   hendaklah   
memenuhi keperluan premis makanan berangkai [klausa 
18 (4) (j) (iii)].  
 
(vi) Kafeteria di Medan Selera (Pengurusan Secara Berpusat) 
a. Permohonan  SPHM  hendaklah  diuruskan  oleh  pihak  
pengurusan medan selera; 
b. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh 
operasi atau syif; 
c. Eksekutif    Halal hendaklah    dilantik    di    peringkat    
pengurusan; 
d. Jawatankuasa  Halal  Dalaman hendaklah  ditubuhkan. 
Wakil  penyewa  medan  selera  hendaklah  menjadi  salah  
seorang ahli Jawatankuasa Halal Dalaman; 
e. HAS  hendaklah  dibangun  di  peringkat  pengurusan  dan 
dilaksana di   setiap   premis   makanan berdasarkan 
Manual MHMS 2020; dan 
f.  Makanan dan minuman hendaklah disediakan di dapur 
 yang dipersijilkan halal.  
 
(vii) Kiosk 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia berjawatan tetap hendaklah dilantik bagi setiap 
premis   makanan   dan   bertugas   sepanjang   tempoh   
operasi atau syif; 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
39 
 
c. Makanan  dan  minuman  hendaklah  disediakan  di  dapur  
yang dipersijilkan halal; dan 
d. Syarikat dan/ atau pemohon yang mempunyai minimum 
tiga  (3)  kiosk menggunakan  jenama  sama  hendaklah  
memenuhi keperluan premis makanan berangkai [klausa 
18 (4) (j) (iii)]. 
 
(5) Skim Produk Barang Gunaan 
 
(a) Syarikat  dan/  atau  pemohon  hendaklah  memastikan produk yang 
dimohon SPHM  terdiri  daripada  produk  siap  dan/  atau  separa  siap  
yang  boleh  memberi  manfaat  kepada  pengguna  selain  daripada  
produk  makanan  dan  minuman,  kosmetik,  farmaseutikal  dan  peranti  
perubatan atau produk yang tidak mempunyai skim pensijilan khusus 
yang menepati kriteria di bawah:  
 
(i)   Wujud keraguan pada sumber bahan pembuatan atau ramuan 
yang  berkemungkinan  daripada sumber  halal  atau  tidak  halal,  
seperti barangan kulit, bahan pencuci dan penapis air; atau 
 
(ii)  Digunakan  sebagai  bahan  bantuan  pemprosesan  (processing 
aids)  dalam  proses  pengilangan  atau  pembuatan  produk  di  
bawah skim Pensijilan Halal Malaysia, seperti bleaching earth, 
tawas dan gas; dan  
 
(iii) Tidak menimbulkan kekeliruan sekiranya dipersijilkan halal;  
 
(iv) Tertakluk kepada kelulusan pihak berkuasa berwibawa. 
 
(b) Keperluan MS  2200-2:2013 Islamic  Consumer  Goods-Part  2:  Usage  
of  Animal  Bone,  Skin  and  Hair-General Guidelines,  MS  2565:2014 
Halal Packaging-General Guidelines, MS 2594:2015 Halal  Chemicals 
For Use In Potable Water Treatment-General Guidelines (yang mana 
berkaitan)  serta  lain-lain  perundangan  dan  peraturan  terkini yang 
dikuatkuasakan  oleh  pihak  berkuasa  berkaitan  hendaklah  dipatuhi; 
dan 
 
(c) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen   yang 
berikut: 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
40 
 
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
  
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(6) Skim Perkhidmatan Logistik 
 
(a) Syarikat   dan/   atau   pemohon   hendaklah   terdiri   daripada   logistik 
pengangkutan,  penggudangan  dan  peruncitan  sahaja;  termasuklah 
perkhidmatan  logistik  bersepadu  (integrated  logistics  services)  dan 
fasiliti rantaian sejuk (cold chain facilities);  
 
(b) Syarikat dan/ atau pemohon yang menyimpan barang-barang berduti 
hendaklah memiliki  lesen  penggudangan  yang  berkaitan  daripada 
Jabatan Kastam Diraja Malaysia (jika berkaitan); 
 
(c) Pengangkutan container  bulk, bulk  liquid  dan  pengangkutan  umum  
kenderaan  komersial yang digunakan dalam pengangkutan container 
bulk, bulk liquid dan pengangkutan am (general haulage and freight), 
hendaklah didaftarkan dengan Jabatan Pengangkutan Jalan Malaysia 
dan mendapatkan   permit   pengangkutan   barang   daripada agensi 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
41 
 
berkaitan   di   bawah   Kementerian   Pengangkutan   Malaysia   (jika 
berkaitan); 
 
(d) Syarikat ejen pengiriman barang (freight forwarding) atau ejen kastam 
dan ejen  perkapalan hendaklah mendapatkan  lesen  yang  berkaitan  
daripada Jabatan Kastam Diraja Malaysia (jika berkaitan); 
 
(e) Syarikat  dan/  atau  pemohon  yang  menjalankan  penyimpanan  produk  
daging dan hasilan daging hendaklah memiliki permit import daripada 
JPV (jika berkaitan); 
 
(f) Syarikat  dan/  atau  pemohon  kategori  peruncitan  hendaklah  terdiri  
daripada  syarikat  yang  menjalankan  pengedaran  atau  perdagangan 
produk dan  peruncit  makanan  seperti  kedai  runcit,  kedai  serbaneka  
dan pasar raya; 
  
(g) Maklumat    pengangkutan,    penggudangan    dan    peruncitan    yang 
dimohon  SPHM  hendaklah  diisytiharkan  secara  terperinci  di  dalam  
borang permohonan MYeHALAL; 
 
(h) Keperluan MS 2400-1:2019 Halal Supply Chain Management System-
Part  1:  Transportation-General  Requirements (First  Revison),    MS  
2400-2:2019 Halal   Supply   Chain   Management   System-Part   2: 
Warehousing-General Requirements (First Revison), MS 2400-3:2019 
Halal  Supply  Chain  Management  System-Part  3: Retailing-General 
Requirements (First   Revison)   serta   lain-lain   perundangan   dan   
peraturan terkini yang  dikuatkuasakan  oleh  pihak  berkuasa  berkaitan 
hendaklah dipatuhi; dan 
 
(i)   Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen yang 
berikut: 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  perkhidmatan logistik  sepanjang 
tempoh operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
42 
 
d. HAS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  perkhidmatan  logistik  sepanjang 
tempoh operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
  
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  perkhidmatan  logistik  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(j)   Permohonan bagi kategori PENGANGKUTAN  hendaklah  memenuhi  
keperluan khusus tambahan yang berikut: 
 
(i)   Keseluruhan     rangkaian     pengangkutan     hendaklah     tidak     
mengangkut  dan  mengendalikan  sebarang  bahan  dan/  atau  
produk yang dikategorikan sebagai najis mughallazah; 
 
(ii)  Pengangkutan  yang  dipersijilkan  halal  hendaklah  mengangkut  
dan mengendalikan produk halal sahaja;  
 
(iii) Sistem   pengesanan   kenderaan hendaklah   dibangun   dan   
dilaksanakan secara efektif;  
 
(iv) Pengangkutan  yang  dipersijilkan  halal  hendaklah  dikenal  pasti 
dan ditandakan dengan jelas; 
 
(v) Keseluruhan   rangkaian   pengangkutan   bagi   perkhidmatan 
penghantaran makanan hendaklah dipersijilkan halal; dan 
 
(vi) Pekerja   termasuklah   pemandu   hendaklah tidak   membawa 
makanan dan/ atau minuman, haiwan dan apa-apa bahan tidak 
halal ketika bertugas. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
43 
 
(k) Permohonan bagi kategori PENGGUDANGAN hendaklah  memenuhi  
keperluan khusus tambahan yang berikut: 
 
(i)   Keseluruhan   kawasan   premis   hendaklah   tidak   menyimpan   
sebarang  bahan  dan/  atau  produk  yang  dikategorikan  sebagai  
najis mughallazah; 
 
(ii)  Lot   yang   dipersijilkan   halal   hendaklah   menyimpan   dan   
mengendalikan produk halal sahaja; 
 
(iii) Sistem  pengurusan  penggudangan  hendaklah  dibangun  dan  
dilaksanakan secara efektif; 
 
(iv) Lot   yang   dipersijilkan   halal   hendaklah   dikenal   pasti dan 
diasingkan secara fizikal; dan 
 
(v) Penyimpanan  bagi  bahan  dan/  atau  produk  yang  dipersijilkan  
halal  dan  produk  halal  yang  tidak  dipersijilkan  (di  lot  yang  
dipersijilkan  halal)  hendaklah  diwujudkan  pengasingan  dan  
pelabelan yang jelas. 
 
(l)   Permohonan bagi kategori PERUNCITAN hendaklah   memenuhi   
keperluan khusus tambahan yang berikut: 
 
(i)   Keseluruhan  kawasan  premis  hendaklah  tidak  mengendali, 
mempamer  dan  menjual  sebarang  bahan  dan/  atau  produk  
yang dikategorikan sebagai najis mughallazah; 
 
(ii)  Permohonan  peruncitan  bagi  kategori  pengedar  (distributor) 
dan  pedagang  (trader)  hendaklah mengendali dan  menjual  
bahan dan/ atau produk halal sahaja;  
 
(iii) Permohonan   peruncitan   bagi   kategori   peruncit   makanan  
hendaklah  mengendali,  mempamer  dan  menjual  bahan  dan/  
atau produk halal sahaja di seksyen yang dipersijilkan halal; 
 
(iv) Peruncit  makanan yang  mengendali,  mempamer  dan  menjual  
bahan dan/ atau produk tidak halal (kecuali najis mughallazah), 
seksyen tidak halal tersebut hendaklah mempunyai mekanisme 
kawalan yang berkesan meliputi: 
a. kawasan berasingan dan ditandakan dengan jelas; 
b. penyimpanan berasingan dan ditandakan dengan jelas; 
c. troli dan/ atau bakul khusus di seksyen tersebut;  
d. kaunter pembayaran khusus di seksyen tersebut; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
44 
 
e. dikendalikan oleh orang bukan Islam sahaja. 
 
(v) Sistem   pengurusan   peruncitan hendaklah   dibangun   dan   
dilaksanakan secara efektif; dan 
 
(vi) Susun  atur  barangan  hendaklah  mengikut  kategori  yang  telah  
ditetapkan    seperti    bahan    mentah    basah,    kering    dan    
sebagainya. 
 
(7) Skim Rumah Sembelihan 
 
(a) Syarikat   dan/   atau   pemohon   hendaklah   terdiri   daripada rumah 
sembelihan  haiwan  halal bagi  tujuan  komersial  di  bawah kategori 
poltri  (seperti  ayam,  itik,  puyuh,  angsa,  ayam  belanda,  burung  unta  
dan burung  merpati)  dan  ruminan (seperti kambing,  biri-bir  i,  rusa, 
lembu, kerbau dan unta); juga termasuklah arnab dan landak; 
 
(b) Rumah sembelihan hendaklah memiliki Skim Pensijilan Veterinar atau 
surat  perakuan  atau  surat  sokongan  yang  masih  sah  daripada  JPV  
(yang mana berkaitan); 
 
(c) Setiap    pengendali    makanan    hendaklah    memiliki    Sijil    Latihan    
Pengendali Makanan daripada institusi yang diiktiraf oleh KKM; 
 
(d) Setiap    pengendali    makanan    hendaklah    mendapatkan    suntikan    
vaksinasi  anti  tifoid  yang  masih  sah  daripada  pengamal  perubatan  
berdaftar; 
 
(e) Keperluan    MS    1500:2009 Halal    Food-Production,    Preparation,    
Handling  and  Storage-General  Guidelines  (Second  Revision),  MS  
1500:2019 Halal Food-General Requirements (Third Revison), Animal 
Rules  1962,  Akta  Binatang  1953  (Semakan  2006),  Akta  Rumah  
Penyembelihan       (Penswastaan)       1993,       Ordinance       Sabah       
Slaughterhouse Rules 2004 (Sabah), Akta Makanan 1983 (Akta 281), 
Peraturan-Peraturan Makanan 1985, Peraturan-Peraturan Kebersihan 
Makanan 2009 serta lain-lain perundangan dan peraturan terkini yang 
dikuatkuasakan oleh pihak berkuasa berkaitan hendaklah dipatuhi; 
 
(f) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS  hendaklah  
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen   yang 
berikut:  
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
45 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  penyembelih  dan  seorang  (1) 
pemeriksa  halal,  berjawatan tetap  hendaklah  dilantik  
dan bertugas sepanjang tempoh operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum  seorang  (1)  penyembelih  dan  seorang  (1) 
pemeriksa  halal,  berjawatan  tetap  hendaklah  dilantik  
dan bertugas sepanjang tempoh operasi atau syif; 
b. Penyelia  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020 
 
(g) Keperluan khusus tambahan yang berikut hendaklah dipatuhi: 
  
(i)   Premis 
a. Rumah sembelihan hendaklah dikhususkan untuk aktiviti 
penyembelihan   haiwan   halal   dan   sembelihan   halal   
sahaja; 
b. Rumah sembelihan hendaklah mempunyai kelengkapan 
untuk        menjalankan        penyembelihan        haiwan,        
pemprosesan dan penyimpanan produk sebelum diedar 
atau dijual; dan  
c. Rumah sembelihan hendaklah direka bentuk dan dibina 
bagi  memudahkan  pembersihan  dan  penyahjangkitan  
serta   mempunyai   kemudahan   dari   segi   ruang   yang   
mencukupi seperti yang berikut: 
i. tempat    pemunggahan    atau penurunan    dan    
penyimpanan sementara; 
ii. tempat penyembelihan; 
iii. tempat pemprosesan; 
iv.  tempat     penyimpanan     sementara     sebelum     
diagihkan; 
v. tempat     pengurusan     sisa     pepejal,     sistem     
pengolahan efluen (SPE) dan sistem pengurusan 
enapcemar daripada SPE; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
46 
 
vi.    stor penyimpanan peralatan dan pakaian. 
  
(ii)  Haiwan 
a. Haiwan hendaklah terdiri daripada haiwan halal sahaja; 
b. Haiwan    hendaklah berkeadaan    sihat    dan    telah    
diluluskan    oleh    pihak    berkuasa    bertauliah    yang    
berkenaan (JPV); 
c. Haiwan  hendaklah  dipastikan  masih  bernyawa  (hayah 
al-mustaqirrah) ketika penyembelihan dilakukan; dan 
d. Haiwan   hendaklah   dikendalikan dengan   baik dan 
memastikan kebajikan haiwan terpelihara.  
 
(iii) Penyembelih 
a. Penyembelih   hendaklah seorang (1) Muslim   yang 
waras, baligh,  mengamalkan  ajaran  Islam,  mempunyai  
pemahaman dan pengetahuan mengenai peraturan dan 
syarat asas berkaitan penyembelihan dalam Islam; 
b. Penyembelih  hendaklah  memiliki  Tauliah  Penyembelih 
yang masih sah daripada MAIN/ JAIN; 
c. Penyembelih   hendaklah   memastikan   haiwan   masih 
bernyawa  (hayah  al-mustaqirrah)  ketika  penyembelihan  
dilakukan;  
d. Bilangan penyembelih   hendaklah   mencukupi   untuk   
memastikan   sembelihan   dapat   dilaksanakan   dengan   
sempurna ke atas haiwan; 
e. Penyembelih boleh   bergilir   atau bertukar tugasan 
dengan    pemeriksa    halal yang    memiliki    Tauliah    
Penyembelih yang masih sah; dan 
f. Pertukaran  penyembelih hendaklah dilakukan  setelah  
sembelihan  mencapai  maksimum  3000 ekor bagi poltri 
dan maksimum 50 ekor bagi ruminan. 
 
(iv) Pemeriksa Halal 
a. Pemeriksa  hendaklah  seorang  (1) Muslim  yang  waras,  
baligh,     mengamalkan     ajaran     Islam,     mempunyai     
pemahaman dan pengetahuan mengenai peraturan dan 
syarat asas berkaitan penyembelihan dalam Islam; 
b. Pemeriksa   hendaklah   memiliki   Tauliah   Penyembelih   
yang  masih  sah  daripada  MAIN/  JAIN  sekiranya  turut  
terlibat menjalankan penyembelihan; 
c. Bilangan  pemeriksa  hendaklah  mencukupi  dan  berada  
di  tempat  (checkpoint)  yang  bersesuaian  di  sepanjang  
proses  penyembelihan  bagi  memastikan  pemeriksaan  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
47 
 
dan penelitian dapat dilaksanakan dengan sempurna ke 
atas haiwan seperti hal yang berikut: 
i. Haiwan  masih  bernyawa  (hayah  al-mustaqirrah) 
ketika sembelihan dilakukan; 
ii. Saluran    pernafasan    (halkum)    putus    dengan    
sempurna; 
iii. Saluran makanan     (merih)     putus     dengan     
sempurna; 
iv.  Kedua-dua carotid    artery    dan jugular    vein 
(wadajain) putus dengan sempurna; 
v. Haiwan  dikenal  pasti  telah  mati  sebelum  aktiviti  
pemprosesan selanjutnya; dan 
vi.    Pelalian (stunning)  tidak  menyebabkan  kematian  
dan/   atau   keretakan   pada   tengkorak   haiwan   
sembelihan. 
d. Haiwan   yang   tidak   sempurna   disembelih   dan   tidak   
mematuhi     syarat     pelalian (stunning) hendaklah 
diasingkan serta dilabelkan sebagai tidak halal; dan 
e. Pemeriksa  boleh  bergilir  atau  bertukar  tugasan  dengan  
penyembelih  sekiranya  memiliki  Tauliah  Penyembelih  
yang masih sah. 
 
(v) Alat Sembelihan 
a. Alat   sembelihan   hendaklah   tidak   diperbuat   daripada   
tulang, kuku dan gigi; 
b. Alat sembelihan     hendaklah     dikhususkan     untuk     
menjalankan penyembelihan haiwan halal sahaja;  
c. Pisau yang  digunakan  hendaklah tajam,  bersesuaian 
dan mencukupi dengan kapasiti penyembelihan; dan 
d. Pisau atau mata pisau hendaklah bersih daripada darah 
dan   kotoran   lain dengan   menggunakan   air   yang   
menggalir. 
 
(vi) Pengendalian 
a. Haiwan hendaklah dikendalikan   dengan   baik   bagi 
memastikan  kebajikan  haiwan terpelihara sebelum  dan  
semasa dibawa ke tempat sembelihan; 
b. Penyembelihan hendaklah dilakukan dengan niat kerana 
Allah dan bukan untuk tujuan selain daripada Allah; 
c. Tasmiyah  hendaklah dilafazkan ketika penyembelihan 
dilakukan; 
d. Penyembelihan digalakkan mengadap kiblat; 
e. Penyembelihan hendaklah       dilaksana dengan 
memutuskan   saluran   pernafasan   (halkum), saluran 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
48 
 
makanan   (merih)   dan   kedua-dua carotid   artery   dan 
jugular vein (wadajain); 
f. Penyembelihan hendaklah dilakukan dengan memotong 
pada  bahagian  leher  di  bawah  biji  halkum  bagi  haiwan  
berleher  pendek  dan  selepas  biji  halkum  bagi  haiwan  
berleher panjang; 
g. Penyembelihan hendaklah dijalankan dengan   sekali 
sembelihan  sahaja.  Pergerakan  pisau  yang  berulang-
ulang  adalah  dibenarkan  selagi  pisau  tersebut  tidak  
diangkat; 
h. Pendarahan haiwan hendaklah berlaku secara  spontan  
dan sempurna; 
i. Proses   susulan   bagi   haiwan   yang   telah   disembelih   
hendaklah dilakukan   selepas   haiwan   tersebut telah 
dipastikan mati. Minor procedure berkaitan keselamatan 
makanan yang    dibenarkan    oleh    pihak    berkuasa    
berkaitan     seperti     oesophageal     clipping adalah 
dibolehkan; 
j. Tempoh    pendarahan hendaklah mencukupi    bagi    
memastikan haiwan mati dengan sempurna; 
k. Haiwan yang telah disembelih hendaklah tidak dilonggok 
dan    dibiarkan  bertindihan  bagi  mengelakkan haiwan 
tersebut mati kelemasan; 
l. Prosedur penyembelihan  haiwan  yang  tidak  mematuhi  
keperluan     Pensijilan     Halal     Malaysia     hendaklah     
dibangunkan  dan  pelaksanaannya  adalah  tidak  terhad  
kepada kaedah yang berikut: 
i. dikeluarkan dari aliran pemprosesan halal; atau 
ii. dilupuskan; atau 
iii. diproses di premis lain; 
m. Haiwan   sembelihan   yang   tidak   mematuhi   keperluan 
Pensijilan   Halal   Malaysia hendaklah   dikenal   pasti, 
diasing, ditanda  dengan  jelas  dan dilabel sebagai  tidak  
halal; 
n. Proses   penceluran   bagi   poltri   hendaklah dilakukan 
selepas haiwan mati dengan sempurna; dan 
o. Aktiviti   yang   terlibat   dalam   penyembelihan seperti 
mencelur, melapah,    memotong    dan membungkus 
hendaklah dijalankan di premis yang sama. 
  
(vii) Pelalian (Stunning) 
a. Pelaksanaan pelalian (stunning) ke  atas  haiwan  adalah 
tidak digalakkan; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
49 
 
b. Syarat-syarat   yang   ditetapkan   oleh   pihak   berkuasa   
berwibawa    hendaklah    dipatuhi    sekiranya    pelalian 
(stunning) dijalankan; 
c. Alat pelalian (stunning)  hendaklah sentiasa  di  bawah  
penyeliaan  pekerja  Muslim  yang  terlatih  dan  dipantau  
secara berkala oleh pihak berkuasa berwibawa; 
d. Panel kawalan pelalian (stunning) hendaklah sentiasa di 
bawah  kawalan  pihak  yang  diberi  kuasa  termasuklah  
perlu  dikunci,  tidak  mudah  diakses  oleh  lain-lain  pihak  
dan tidak mudah ubah laras tanpa kawalan; 
e. Haiwan hendaklah dipastikan  masih  bernyawa (hayah 
al-mustaqirrah) sebelum menjalani pelalian (stunning); 
f. Pelalian (stunning) hendaklah tidak    menyebabkan    
haiwan  mati  atau  mengalami  kecederaan  fizikal  yang  
kekal; 
g. Alat pelalian (stunning) hendaklah dikhususkan  untuk  
kegunaan   haiwan   halal   dan   tidak   digunakan   untuk   
haiwan yang berada dalam kategori najis mughallazah;  
h. Pelalian (stunning)  hendaklah dilakukan  sekali  sahaja  
bagi setiap haiwan pada satu-satu masa; 
i. Kaedah pelalian (stunning)  yang  dibenarkan  hendaklah 
tertakluk  kepada  kelulusan  pihak  berkuasa  berwibawa; 
(Rujuk LAMPIRAN C) 
j. Pelalian (stunning) jenis    elektrik    dan    pneumatic 
percussive adalah dibenarkan; 
k. Pelalian (stunning) jenis elektrik hendaklah digunakan di 
bahagian  kepala  sahaja  di  mana  kedua-dua  elektrod  
diletakkan pada    bahagian    kepala    haiwan    seperti    
kambing dan biri-biri; 
l. Alat pelalian (stunning)  jenis  elektrik  bagi  poltri  (seperti  
ayam  dan  itik)  yang  dibenarkan  adalah  jenis  takungan  
air (waterbath) sahaja; 
m. Kekuatan   arus   elektrik   yang   digunakan   hendaklah 
diawasi oleh pekerja Muslim yang terlatih serta dipantau 
oleh pihak berkuasa berwibawa; 
n. Alat pelalian (stunning) pneumatic percussive hendaklah 
digunakan untuk haiwan besar seperti lembu dan kerbau 
sahaja; 
o. Tekanan   udara   yang   digunakan   pada alat pelalian 
(stunning) pneumatic    percussive hendaklah tidak 
melebihi  225  psi  dan  hendaklah  diselaraskan  kepada  
kuasa minimum   yang   diperlukan   semasa   pelalian 
(stunning); 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
50 
 
p. Kepala  alat  pelalian (stunning) pneumatic  percussive 
hendaklah rata atau cembung, dilindungi kolar pelindung 
supaya kepala alat tersebut tidak keluar melebihi 3 mm; 
q. Kepala   haiwan   hendaklah   dipastikan   tidak   bergerak   
sebelum  alat  pelalian (stunning) pneumatic  percussive 
dikenakan dan dihala tepat pada tulang dahi; dan 
r. Alat pelalian (stunning) hendaklah   dikalibrasi   dan 
diselenggara secara berkala serta direkodkan.  
 
(viii) Rekod Sembelihan 
a. Rekod sembelihan harian hendaklah disediakan dengan 
tepat,  lengkap,  dikemas  kini  dan  mudah  untuk  dirujuk  
semasa pemeriksaaan Pensijilan Halal Malaysia; dan 
b. Rekod  sembelihan  hendaklah  mengandungi  maklumat  
dan tidak terhad kepada yang berikut: 
i. rekod penerimaan haiwan hidup; 
ii. rekod bilangan haiwan disembelih;  
iii. rekod sembelihan salah; 
iv.  rekod     haiwan     mati     disebabkan     pelalian 
(stunning); dan 
v. rekod haiwan dibuang (rejected atau condemned) 
   
(8) Skim Pengilangan Kontrak/ OEM 
 
(a) Syarikat  dan/  atau  pemohon  yang  menjalankan  pengilangan  kontrak/  
OEM  hendaklah  memperolehi  SPHM  di  bawah  skim  pengilangan  
kontrak/ OEM sebelum layak menawarkan perkhidmatan pengilangan 
produk kepada syarikat lain; 
 
(b) Skim ini tidak boleh digunakan sebagai perakuan halal ke atas produk 
yang dikilangkan dan setiap produk yang ingin mengunakan logo halal 
hendaklah   membuat   permohonan   SPHM   mengikut   skim   yang   
berkaitan; 
 
(c) Syarikat  dan/  atau  pemohon  SPHM  di  bawah  skim  ini  hendaklah  
mengeluar  atau  mengendali  atau  menguruskan  produk  halal  sahaja  
berdasarkan skim Pensijilan Halal Malaysia yang berikut: 
 
(i)   Skim produk makanan dan minuman; 
 
(ii)  Skim produk kosmetik; 
 
(iii) Skim produk farmaseutikal; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
51 
 
(iv) Skim produk barang gunaan; 
 
(v) Skim rumah sembelihan; dan 
 
(vi) Skim produk peranti perubatan. 
 
(d) Premis  hendaklah  memiliki  Perakuan  Pendaftaran  Premis  Makanan  
yang masih sah daripada BKKM (jika berkaitan); 
 
(e) Rumah sembelihan hendaklah memiliki Skim Pensijilan Veterinar atau 
surat  perakuan  atau  surat  sokongan  yang  masih  sah  daripada  JPV  
(jika berkaitan); 
 
(f) Premis hendaklah memiliki Lesen Pengilang yang masih sah daripada 
NPRA (jika berkaitan); 
 
(g) Premis   hendaklah   memiliki Lesen   Establismen   yang   masih   sah   
daripada MDA (jika berkaitan); 
 
(h) Kontrak  atau  perjanjian  bertulis atau  persetujuan  bersama  untuk  
mengilang atau menghasilkan produk di antara syarikat pengilang dan 
syarikat  pelanggan  atau  pemilik  jenama  (brand  owner)  hendaklah 
disediakan; 
 
(i)   Syarikat  dan/  atau  pemohon SPHM  hendaklah  memastikan  pihak  
yang  dilantik  untuk  menjalankan  pengilangan  produk  secara  kontrak  
memiliki SPHM terlebih dahulu; 
 
(j)   Syarikat dan/     atau     pemohon     hendaklah     menggemukakan 
permohonan  yang  berasingan  bagi  setiap  perkhidmatan  pengilangan  
kontrak/   OEM;   Contohnya   pengilangan   kontrak/   OEM   produk   
makanan   dan   produk   farmaseutikal   hendak   dibuat   permohonan 
secara berasingan;  
 
(k) Keperluan MS   yang   berkaitan serta   lain-lain   perundangan   dan   
peraturan terkini yang  dikuatkuasakan  oleh  pihak  berkuasa  berkaitan 
hendaklah dipatuhi; dan 
 
(l)   Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS hendaklah 
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen yang 
berikut: 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
52 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh 
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 
d. HAS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(9) Skim Produk Peranti Perubatan 
 
(a) Setiap produk peranti perubatan hendaklah memiliki Sijil Pendaftaran 
Peranti Perubatan yang masih sah daripada MDA atau memiliki surat 
pengecualian keperluan pendaftaran   peranti   perubatan   daripada 
MDA; 
 
(b) Premis yang memproses dan menghasilkan produk peranti perubatan 
hendaklah memiliki  Lesen  Establismen  yang  masih  sah  daripada 
MDA; 
 
(c) Produk peranti perubatan yang dipersijilkan halal hendaklah menepati 
kriteria di bawah: 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
53 
 
(i)   Wujud keraguan pada sumber bahan pembuatan atau ramuan 
yang  berkemungkinan  daripada sumber  halal  atau  tidak  halal 
khususnya berkaitan   haiwan   dan   alkohol   seperti suture, 
humidifier dan dental floss; atau 
 
(ii)  Lain-lain  produk  untuk  tujuan  yang  sama  (similar  intended  
purpose) seperti yang disenaraikan di bawah tetapi tidak terhad 
kepada;  
a. Produk     dalam     bentuk     cecair     seperti dialysis/ 
hemodialysis solution,    saline    solution balance    salt    
solution,   mouth   wash,   urethral   lubricant,   personal   
lubricant,  disinfecting  solution,  wound  irrigation  solution, 
contact lens solution dan eye solution/ lubricant.  
b. Produk  jenis  grafting  seperti skin  graft/  surgical  mesh, 
bone graft, vascular graft dan coronary stent graft. 
c. Produk jenis implants seperti heart valve, stent, cochlear 
implant dan intraocular lens. 
d. Produk prosthetic   seperti prosthetic   leg,   prosthetic   
knees,   prosthetic   limb,   prosthetic   heart   valve dan 
prosthetic ankle joint; dan 
 
(iii) Tertakluk kepada kelulusan pihak berkuasa berwibawa. 
 
(d) Keperluan MS 2636:2019 Halal      Medical      Device-General 
Requirements,  Akta  Peranti  Perubatan  2012   (Akta  737),  Peraturan-
Peraturan  Peranti  Perubatan  2012 serta  lain-lain  perundangan  dan  
peraturan terkini  yang  dikuatkuasakan  oleh  pihak  berkuasa  berkaitan 
hendaklah dipatuhi; dan 
 
(e) Keperluan  pekerja  Muslim  hendaklah  dipatuhi  dan  MHMS hendaklah 
dilaksanakan   secara   berkesan   dengan   memenuhi   elemen   yang 
berikut: 
 
(i)   Industri Besar dan Sederhana 
a. Minimum  dua  (2)  orang  pekerja  Muslim  warganegara  
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Eksekutif  Halal  hendaklah  dilantik  di  setiap  cawangan  
premis; 
c. Jawatankuasa   Halal   Dalaman   hendaklah   ditubuhkan   
bagi    premis    dan    setiap    cawangan    premis    yang    
mempunyai pengurusan operasi berbeza; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
54 
 
d. HAS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(ii)  Industri Kecil  
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara 
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; 
b. Penyelia Halal hendaklah dilantik di premis; dan 
c. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
 
(iii) Industri Mikro 
a. Minimum   seorang   (1)   pekerja   Muslim   warganegara   
Malaysia,   berjawatan   tetap   hendaklah   dilantik   dan   
bertugas  di  kawasan  pemprosesan  sepanjang  tempoh  
operasi atau syif; dan 
b. IHCS  hendaklah  dibangun  dan  dilaksana  berdasarkan  
Manual MHMS 2020. 
  
 
19. SISTEM KAWALAN HALAL DALAMAN (IHCS)   
 
(1) Syarikat  dan/  atau  pemohon  SPHM  di  bawah  kategori  kecil  dan  mikro  
hendaklah membangun dan melaksanakan IHCS bagi memenuhi keperluan 
khusus dalam Pensijilan Halal Malaysia; 
 
(2) Pembangunan  dan  pelaksanaan  IHCS  hendaklah  memenuhi  elemen yang 
berikut: 
 
(a) Polisi halal; 
 
Difahami dan disebarkan kepada semua pihak yang berkaitan. 
 
(b) Prosedur kawalan bahan mentah atau pelanggan; dan 
 
(i)   Mampu   menerangkan   proses   penentuan   bahan   mentah,   
pembekal atau pelanggan; 
 
(ii)  Menjelaskan   proses   kerja   secara   tepat   sepertimana   yang   
diamalkan di lapangan; dan 
 
(iii) Direkod,    didokumenkan serta    boleh    disemak    semasa    
pengauditan atau pemantauan Pensijilan Halal Malaysia. 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
55 
 
 
(c) Prosedur kebolehkesanan.  
 
(i)   Mampu   menerangkan   proses   pengesanan   semula   bahan   
mentah, pembekal, pelanggan dan produk siap; 
 
(ii)  Menjelaskan   proses   kerja   secara   tepat   sepertimana   yang   
diamalkan di lapangan; dan 
 
(iii) Direkod,    didokumenkan    serta    boleh    disemak    semasa    
pengauditan atau pemantauan Pensijilan Halal Malaysia. 
 
(3) Manual    MHMS    2020 hendaklah dirujuk bagi    memenuhi    keperluan    
pembangunan  dan  pelaksanaan  berdasarkan  elemen-elemen  IHCS  yang 
ditetapkan.  
 
 
20.    SISTEM JAMINAN HALAL (HAS) 
 
(1) Syarikat dan/ atau pemohon SPHM di bawah kategori besar dan sederhana 
hendaklah  membangun  dan  melaksanakan  HAS  bagi  memenuhi  keperluan  
khusus dalam Pensijilan Halal Malaysia; 
 
(2) Eksekutif Halal hendaklah dilantik bagi setiap cawangan premis; 
 
(3) Jawatankuasa  Halal  Dalaman hendaklah  ditubuhkan  bagi  setiap  syarikat  
dan/  atau  setiap  cawangan  yang  mempunyai  pengurusan  operasi  yang  
berbeza; 
 
(4) Jawatankuasa    Halal    Dalaman    hendaklah    terdiri    daripada    sekurang-
kurangnya empat (4) orang ahli seperti yang berikut: 
 
(a) Pengerusi; 
 
(b) Eksekutif Halal; 
 
(c) Wakil bahagian perolehan atau pembelian; dan 
 
(d) Wakil bahagian pemprosesan atau operasi. 
 
(5) Manual    MHMS    2020 hendaklah    dirujuk    bagi    memenuhi    keperluan    
pembangunan  dan  pelaksanaan berdasarkan  elemen-elemen  HAS  yang 
ditetapkan.  
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
56 
 
BAHAGIAN V 
PROSEDUR PERMOHONAN 
 
 
21. BAHARU 
 
(1) Syarikat   dan/   atau   pemohon   hendaklah   memenuhi   syarat   dan   kriteria   
permohonan  sebagaimana  yang  dinyatakan  di  bawah Prosedur  5,  Manual 
Prosedur ini; 
 
(2) Syarikat  dan/  atau pemohon  hendaklah  mendaftar  akaun  pengguna  sistem  
MYeHALAL  di  www.halal.gov.my
  sebelum  membuat  permohonan  SPHM. 
Kelayakan    pendaftaran    akaun    pengguna    sistem    MYeHALAL    adalah    
berdasarkan nombor   pendaftaran Suruhanjaya   Syarikat   Malaysia   atau 
Suruhanjaya  Koperasi  Malaysia  atau  Dokumen  Penubuhan  di  bawah  Akta  
Parlimen  atau  Kementerian  masing-masing  dan  lain-lain  agensi  Kerajaan 
(yang mana berkaitan); (Rujuk LAMPIRAN D) 
 
(3) Pendaftaran  akaun pengguna sistem  MYeHALAL  akan disahkan oleh pihak 
berkuasa berwibawa dalam tempoh 24 jam hari bekerja; 
 
(4) Permohonan   SPHM   hendaklah dilakukan   secara   dalam   talian   (online) 
melalui sistem MYeHALAL setelah akaun pengguna disahkan; 
 
(5) Borang   permohonan   MYeHALAL   hendaklah   diisi   dengan   lengkap   dan   
menepati keperluan yang berikut: 
 
(a) Skim dan kategori permohonan hendaklah dipilih dengan betul; 
 
(b) Semua   maklumat   hendaklah   diisi   dengan   tepat,   terperinci   dan 
menyeluruh   merangkumi   maklumat   syarikat   dan/   atau   pemohon, 
bahan mentah atau  ramuan, pengeluar, produk, menu, perkhidmatan 
dan lain-lain yang berkaitan; 
 
(c) Bahan  mentah  atau ramuan dan produk  yang  menggunakan  kod  
hendaklah disertakan nama sebenar (bukan hanya trade name); 
 
(d) Setiap permohonan hendaklah tidak melebihi 100 produk bagi semua 
skim  Pensijilan  Halal  Malaysia  kecuali  skim  premis  makanan,  skim  
perkhidmatan logistik dan skim pengilangan kontrak/ OEM; 
 
(e) Nama  produk  atau  menu  yang  didaftarkan hendaklah  sama  seperti 
yang tertera pada label pembungkusan dan/ atau paparan menu; dan 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
57 
 
(f) Nama    produk    atau    menu    dalam    bahasa    asing    hendaklah    
diterjemahkan ke Bahasa Melayu dan/ atau Bahasa Inggeris.  
 
(6) Dokumen  sokongan  yang  lengkap  hendaklah  diserahkan  kepada  pihak  
berkuasa  berwibawa (seperti yang  dinyatakan  di  dalam  sistem  MYeHALAL  
pemohon)  dalam  tempoh  lima  (5)  hari  bekerja setelah  borang  permohonan  
MYeHALAL dihantar secara dalam talian (online); (Rujuk LAMPIRAN E) 
 
(7) Pihak  berkuasa  berwibawa  hendaklah  menolak  permohonan dan  dokumen 
sokongan   yang   tidak   lengkap   serta   tidak   mengikut   skim   dan   kategori 
Pensijilan Halal Malaysia yang betul;  
 
(8) Permohonan hendaklah diuruskan    oleh    pihak    berkuasa    berwibawa 
berdasarkan  skim  Pensijilan  Halal  Malaysia  dan  alamat  pengilang.  Syarikat 
dan/  atau  pemohon boleh  mengetahui  pihak  berkuasa  berwibawa  yang 
menguruskan  permohonan  berdasarkan  maklumat  yang  tertera  di  akaun  
pengguna sistem MYeHALAL; 
 
(9) Syarikat   dan/   atau   pemohon hendaklah tidak   dibenarkan   membuat 
permohonan   pertukaran   pihak   berkuasa   berwibawa   yang   menguruskan   
permohonan SPHM; 
 
(10) Permohonan  bagi  dapur  berpusat  di  bawah  skim  produk  makanan  dan  
minuman  serta  skim  premis  makanan  kategori  premis  makanan berangkai 
hendaklah diuruskan oleh JAKIM; 
 
(11) Permohonan  bagi  dua  (2)  atau  lebih  premis  makanan  yang  menggunakan  
jenama  yang  sama  dan  beroperasi  di  negeri  yang  berlainan  hendaklah  
diuruskan oleh JAKIM; 
 
(12) Pihak   berkuasa   berwibawa hendaklah   berurusan   secara   terus   dengan   
syarikat  dan/  atau  pemohon  tanpa  melalui  pihak  ketiga  atau  orang  tengah  
seperti konsultan; 
 
(13) Semakan   permohonan   hendaklah dijalankan   setelah   semua   dokumen   
sokongan  diterima  oleh  pihak  berkuasa  berwibawa  dan tempoh  semakan  
bergantung kepada jumlah produk atau menu dan premis yang dimohon; 
 
(14) Bayaran  fi  hendaklah  dijelaskan  dalam  tempoh  14  hari  bekerja  atau  suatu  
tempoh  yang  ditetapkan  oleh  pihak  berkuasa  berwibawa  setelah  menerima  
surat bayaran fi; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
58 
 
(15) Pembayaran  fi  yang  lewat  diterima  oleh  pihak  berkuasa  berwibawa  akan 
menyebabkan permohonan tersebut ditolak dan syarikat dan/ atau pemohon 
hendaklah mengemukakan semula permohonan baharu; 
 
(16) Sebarang  penambahan  produk,  menu, premis  makanan  dan  perkhidmatan 
serta  perubahan  pendaftaran  syarikat  hendaklah tidak  dibenarkan  setelah 
surat bayaran fi dikeluarkan oleh pihak berkuasa berwibawa; 
 
(17) Syarikat   dan/   atau   pemohon   hendaklah   mendaftar   akaun   pengguna   
MYeHALAL  dan  mengemukakan  permohonan  baharu  sekiranya  berlaku  
perubahan pada pendaftaran syarikat; 
 
(18) Pengauditan lapangan hendaklah dijalankan setelah bayaran fi diterima oleh 
pihak berkuasa berwibawa; dan 
 
(19) Syarikat  dan/  atau  pemohon  yang  layak  berdasarkan  setiap  skim  Pensijilan  
Halal Malaysia yang ditawarkan adalah seperti yang berikut: 
 
(a) Skim produk makanan dan minuman  
 
(i)   Pengusaha atau pengeluar; 
 
(ii)  Pengusaha pembungkusan semula;  
 
(iii) Pengusaha dapur berpusat; dan 
 
(iv) Pemilik jenama. 
 
(b) Skim produk kosmetik 
 
(i)   Pengusaha atau pengeluar; 
 
(ii)  Pengusaha pembungkusan semula; dan 
 
(iii) Pemilik jenama. 
 
(c) Skim produk farmaseutikal 
 
(i)   Pengusaha atau pengeluar; 
 
(ii)  Pengusaha pembungkusan semula; dan 
 
(iii) Pemilik jenama. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
59 
 
(d) Skim premis makanan 
 
(i)   Pengusaha hotel (dapur dan/ atau restoran); 
 
(ii)  Pengusaha restoran atau kafe; 
 
(iii) Pengusaha kantin; 
 
(iv) Pengusaha kedai bakeri; 
 
(v) Pengusaha premis makanan berangkai;  
 
(vi) Pengusaha katering dan/ atau khidmat penyajian makanan;  
 
(vii) Pengusaha dapur pusat konvensyen;  
 
(viii) Pengusaha premis bergerak; 
 
(ix) Pengusaha kafeteria di medan selera; dan 
 
(x) Pengusaha kiosk. 
 
(e) Skim produk barang gunaan 
 
(i)   Pengusaha atau pengeluar; 
 
(ii)  Pengusaha pembungkusan semula; dan 
 
(iii) Pemilik jenama. 
 
(f) Skim perkhidmatan logistik 
 
(i)   Pengusaha pengangkutan (darat, laut dan udara); 
 
(ii)  Pengusaha penggudangan; dan 
 
(iii) Pengusaha peruncitan. 
 
(g) Skim rumah sembelihan 
 
(i)   Pengusaha  rumah  sembelihan ayam  atau  lain-lain  poltri  atau  
arnab;   
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
60 
 
(ii)  Pengusaha  rumah  sembelihan kambing,  biri-biri,  rusa,  lembu,  
kerbau atau unta; dan 
 
(iii) Pengusaha  rumah  sembelihan  lain-lain  haiwan halal  (tertakluk 
kepada kelulusan pihak berkuasa berwibawa). 
 
(h) Skim pengilangan kontrak/ OEM 
 
(i)   Pengilang;  dan/  atau pengusaha  pembungkusan  semula  bagi 
skim yang berikut:  
a. Skim produk makanan dan minuman; 
b. Skim produk kosmetik; 
c. Skim produk farmaseutikal; 
d. Skim produk barang gunaan; 
e. Skim rumah sembelihan; dan 
f. Skim produk peranti perubatan. 
 
(i)   Skim produk peranti perubatan 
 
(i)   Pengusaha atau pengeluar; 
 
(ii)  Pengusaha pembungkusan semula; dan 
 
(iii) Pemilik jenama. 
 
 
22. PEMBAHARUAN 
 
(1) Permohonan SPHM   hendaklah   dilakukan   secara   dalam   talian   (online) 
melalui sistem MYeHALAL di www.halal.gov.my
; 
 
(2) Permohonan pembaharuan SPHM hendaklah dikemukakan seawal enam (6) 
bulan dan selewat-lewatnya tiga (3) bulan sebelum tamat tempoh SPHM; 
 
(3) Permohonan  pembaharuan  SPHM yang  telah  tamat  tempoh  hendaklah 
dikategorikan sebagai permohonan baharu; 
 
(4) Syarikat  dan/  atau  pemohon  hendaklah  merujuk  Prosedur  21  (5),  Manual 
Prosedur    ini    berkenaan    keperluan    pengisian    borang    permohonan 
MYeHALAL dan keperluan yang berikut; 
 
(a) Sebarang  penambahan  produk,  premis  makanan dan  menu baharu 
hendaklah tidak dibenarkan; dan 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
61 
 
(b) Sebarang pengemaskinian maklumat berkaitan nama produk, jenama 
dan menu hendaklah mengemukakan makluman rasmi kepada pihak 
berkuasa berwibawa. 
 
(5) Ringkasan   bahan   mentah   atau   ramuan   hendaklah   dikemukakan   untuk 
memudahkan pengenalpastian perubahan dalam permohonan pembaharuan 
dan permohonan terdahulu; (Rujuk LAMPIRAN F) 
 
(6) Permohonan  yang  tidak  lengkap  serta  tidak  mengikut  skim  dan  kategori 
Pensijilan  Halal  Malaysia  yang betul  hendaklah ditolak  oleh  pihak  berkuasa  
berwibawa;  
 
(7) Permohonan hendaklah diuruskan    oleh    pihak    berkuasa    berwibawa 
berdasarkan  skim  Pensijilan  Halal  Malaysia  dan  alamat  pengilang.  Syarikat 
dan/ atau pemohon    boleh    mengetahui    pihak    yang    menguruskan    
permohonan berdasarkan maklumat yang tertera di akaun pengguna sistem 
MYeHALAL; 
 
(8) Syarikat   dan/   atau   pemohon hendaklah tidak   dibenarkan   membuat   
permohonan   pertukaran   pihak   berkuasa   berwibawa   yang   menguruskan   
permohonan SPHM;  
 
(9) Permohonan  bagi  dapur  berpusat  di  bawah  skim  produk  makanan  dan  
minuman  serta  skim  premis  makanan  kategori  premis  makanan  berangkai 
hendaklah diuruskan oleh JAKIM; 
 
(10) Permohonan  bagi  dua  (2)  atau  lebih  premis  makanan  yang  menggunakan  
jenama  yang  sama  dan  beroperasi  di  negeri  yang  berlainan  hendaklah  
diuruskan oleh JAKIM; 
 
(11) Dokumen  sokongan  yang  lengkap  hendaklah  diserahkan  kepada  pihak  
berkuasa  berwibawa  (seperti  yang  dinyatakan  di  dalam  sistem  MYeHALAL  
pemohon)  dalam  tempoh  lima  (5)  hari  bekerja  setelah  borang  permohonan  
MYeHALAL dihantar secara dalam talian (online); 
 
(12) Bayaran  fi  hendaklah  dijelaskan  dalam  14  hari  bekerja  atau  suatu  tempoh  
yang  ditetapkan oleh  pihak  berkuasa  berwibawa  setelah  menerima  surat  
bayaran fi; dan 
 
(13) Pengauditan lapangan hendaklah dijalankan setelah bayaran fi diterima oleh 
pihak berkuasa berwibawa. 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
62 
 
23. PENAMBAHAN 
 
(1) Permohonan  penambahan  hendaklah terbuka kepada  syarikat  dan/  atau  
pemohon  di  bawah  skim  premis  makanan  bagi penambahan  menu  atau  
menu promosi sahaja;  
 
(2) Syarikat   dan/   atau   pemohon   hendaklah   mengemukakan   permohonan 
penambahan menu  atau  menu  promosi  bagi  premis  makanan  yang  masih  
sah dan berkenaan sahaja; 
 
(3) Permohonan SPHM   hendaklah   dilakukan   secara   dalam   talian   (online) 
melalui sistem MYeHALAL di www.halal.gov.my
; 
 
(4) Borang   permohonan MYeHALAL   hendaklah   diisi   dengan   lengkap   dan   
hendaklah menepati keperluan yang berikut: 
 
(a) Semua    maklumat    hendaklah    diisi    dengan    tepat,    terperinci,    
menyeluruh  dan  betul.  Ini  merangkumi  maklumat  syarikat,  bahan  
mentah,  pembekal,  produk,  menu,  perkhidmatan  dan  lain-lain  yang  
berkaitan; 
 
(b) Produk   dan   bahan   mentah   yang   menggunakan   kod   hendaklah   
disertakan nama sebenar (bukan hanya trade name); 
 
(c) Nama  produk  dan  menu  yang  dimohon  hendaklah  diisi  sama  seperti  
label pembungkusan atau senarai menu; dan 
 
(d) Nama produk atau menu dalam bahasa asing hendaklah 
diterjemahkan ke Bahasa Melayu dan/ atau Bahasa Inggeris.  
 
(5) Permohonan  yang  tidak  lengkap  dan  tidak  mengikut  skim  Pensijilan  Halal  
Malaysia yang betul hendaklah ditolak oleh pihak berkuasa berwibawa; 
 
(6) Permohonan hendaklah diuruskan    oleh    pihak    berkuasa    berwibawa 
berdasarkan  skim  Pensijilan  Halal  Malaysia  dan  alamat  pengilang.  Syarikat  
dan/    atau    pemohon    boleh    mengetahui    pihak    yang    menguruskan    
permohonan    berdasarkan    maklumat    yang    tertera    di    akaun    sistem    
MYeHALAL; 
 
(7) Syarikat   dan/   atau   pemohon   hendaklah tidak   dibenarkan   membuat   
permohonan   pertukaran   pihak   berkuasa   berwibawa   yang   menguruskan   
permohonan SPHM; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
63 
 
(8) Dokumen  sokongan  yang  lengkap  hendaklah  diserahkan  kepada  pihak 
berkuasa berwibawa dalam tempoh lima (5) hari bekerja atau suatu tempoh 
yang  telah  ditetapkan  setelah  borang  permohonan MYeHALAL  dihantar 
secara dalam talian (online);  
 
(9) Bayaran  fi  hendaklah  dijelaskan  dalam  14  hari  bekerja  atau  suatu  tempoh  
yang  ditetapkan  oleh  pihak  berkuasa  berwibawa  setelah  menerima  surat  
bayaran fi; 
 
(10) Pengauditan lapangan hendaklah dijalankan setelah bayaran fi diterima oleh 
pihak berkuasa berwibawa; dan 
 
(11) Penggunaan   senarai   menu   tambahan   atau   menu   promosi   yang   telah   
diluluskan hendaklah tertakluk  kepada  SPHM  premis  makanan  yang  masih  
sah.  
 
  
24. PENGGABUNGAN 
 
(1) Mana-mana permohonan  penggabungan  SPHM  hendaklah diklasifikasikan 
sebagai permohonan baharu;  
 
(2) Permohonan  penggabungan  SPHM yang  masih  sah  atau  baharu  (jika  
berkaitan) hendaklah dibenarkan   bagi   kesemua   skim   Pensijilan   Halal   
Malaysia  kecuali  skim  pengilangan  kontrak/  OEM  dan  skim  perkhidmatan 
logistik; 
 
(3) Permohonan  penggabungan  SPHM  hendaklah dikemukakan dalam  tempoh 
enam (6) bulan sebelum tamat tarikh pensijilan; 
 
(4) Penggabungan  SPHM  hendaklah  melibatkan  kesemua  produk  atau  menu 
pada SPHM yang masih sah; 
 
(5) Permohonan  penggabungan  SPHM  hendaklah  disertakan  bersama  surat  
iringan yang jelas menyatakan butiran permohonan terdahulu; 
 
(6) Prosedur   dan   proses   permohonan   penggabungan   SPHM   hendaklah 
sebagaimana dinyatakan di bawah Prosedur 21, Manual Prosedur ini; 
   
(7) SPHM    yang    masih    sah    hendaklah terbatal    sekiranya permohonan 
penggabungan berkenaan diluluskan oleh pihak berkuasa berwibawa; dan 
 
(8) SPHM  yang  telah  dibatalkan  hendaklah  diserahkan  kepada  pihak  berkuasa  
berwibawa. 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
64 
 
BAHAGIAN VI 
PENGAUDITAN 
 
 
25. PEMAKLUMAN  
 
(1) Pihak berkuasa berwibawa hendaklah mengeluarkan suatu pemakluman dan 
pemberitahuan  kepada  syarikat  dan/  atau pemohon  berkenaan  tempoh  
tarikh pengauditan lapangan yang akan dijalankan; 
 
(2) Pemakluman dan pemberitahuan hendaklah dilaksanakan  mengikut  kaedah  
yang bersesuaian; sama ada melalui e-mel, surat, telefon dan lain-lain; 
 
(3) Pihak  syarikat  dan/  atau  pemohon  tidak  dibenarkan  untuk  meminda  tarikh  
pengauditan lapangan; sekiranya terdapat keperluan yang munasabah pihak 
syarikat dan/ atau pemohon hendaklah memaklumkan secara rasmi kepada 
pihak   berkuasa   berwibawa dengan   kadar   segera   setelah   menerima   
pemakluman tempoh tarikh pengauditan lapangan; dan 
 
(4) Pihak   berkuasa   berwibawa   hendaklah berkuasa   mempertimbang   dan   
memutuskan tempoh tarikh pengauditan lapangan yang dimuktamadkan.  
 
 
26. SKOP 
 
(1) Pengauditan hendaklah merangkumi semua skop yang berikut:  
 
(a) Profil syarikat dan/ atau pemohon; 
 
(b) Dokumentasi dan rekod; 
 
(c) Bahan mentah atau ramuan; 
 
(d) Produk, menu dan perkhidmatan (yang mana berkaitan); 
 
(e) Pemprosesan; 
 
(f) Penyimpanan; 
 
(g) Peralatan dan perkakasan; 
 
(h) Pembungkusan, pelabelan dan pengiklanan; 
 
(i)   Pengangkutan dan pengedaran; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
65 
 
 
(j)   Premis; 
 
(k) Pekerja; 
 
(l)   Sanitasi; 
 
(m) Kemudahan dan kebajikan pekerja;  
 
(n) Latihan; dan 
 
(o) MHMS 
 
(2) Pihak   berkuasa   berwibawa   berkuasa menetapkan   skop   pengauditan   
berkaitan   sesuatu   permohonan   SPHM   sama   ada   perlu diperluas   atau   
dikurangkan mengikut keperluan yang difikirkan wajar.  
 
 
27. PENGAUDITAN KECUKUPAN  
 
(1) Semua  permohonan  SPHM  hendaklah  dijalankan  pengauditan kecukupan 
untuk   menyemak   dan   menilai   borang   permohonan   MYeHALAL serta 
dokumen  sokongan  yang  diterima  daripada  syarikat  dan/  atau  pemohon  
adalah menepati keperluan prosedur Pensijilan Halal Malaysia; 
 
(2) Pegawai  pemeriksa  yang  menjalankan  pengauditan  kecukupan hendaklah 
berhak  mendapatkan  lain-lain  maklumat  berkaitan  permohonan  daripada 
syarikat dan/ atau pemohon sekiranya difikirkan perlu; 
 
(3) Pegawai  pemeriksa  yang  menjalankan  pengauditan  kecukupan hendaklah 
berhak    menangguhkan    proses    permohonan    SPHM    atau    menolak    
permohonan SPHM sekiranya maklumat berkaitan permohonan SPHM tidak 
mencukupi; 
 
(4) Tempoh  masa  pengauditan  kecukupan  hendaklah tertakluk kepada piagam 
pelanggan yang ditetapkan oleh pihak berkuasa berwibawa; 
 
(5) Pegawai  pemeriksa  yang  menjalankan  pengauditan  kecukupan hendaklah 
menyediakan  laporan  semakan  dokumen  berkaitan  permohonan  SPHM  
melalui sistem MYeHALAL; 
 
(6) Pengauditan kecukupan boleh  dilakukan  oleh  sekurang-kurangnya  seorang  
(1) pegawai pemeriksa yang dilantik oleh pihak berkuasa berwibawa;  
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
66 
 
(7) Pihak   berkuasa   berwibawa   hendaklah berkuasa menentukan   pegawai   
pemeriksa   bagi   menjalankan pengauditan   kecukupan dan   pengauditan 
lapangan adalah pegawai yang sama atau sebaliknya; dan 
 
(8) Syarikat  dan/  atau  pemohon  hendaklah  memberikan  sepenuh  kerjasama 
kepada pegawai pemeriksa dalam proses pengauditan kecukupan. 
 
 
28. PENGAUDITAN LAPANGAN  
 
(1) Pengauditan lapangan hendaklah merangkumi perkara yang berikut: 
 
(a) Mesyuarat pembukaan; 
 
(b) Semakan dokumen; 
 
(c) Pemeriksaan lapangan; 
 
(d) Penyediaan laporan; dan 
 
(e) Mesyuarat penutup. 
 
(2) Pengauditan lapangan  hendaklah  dikendalikan  oleh  minimum dua (2) orang 
pegawai pemeriksa yang berkelayakan dalam: 
 
(a) Bidang hal   ehwal Islam; dan/ atau 
 
(b) Bidang teknikal yang berkaitan. 
 
(3) Pihak   berkuasa   berwibawa hendaklah berkuasa menetapkan bidang 
kelayakan pegawai  pemeriksa  yang  ditugaskan  menjalankan pengauditan 
lapangan tanpa terikat kepada keperluan Prosedur 28 (2), Manual Prosedur 
ini; 
 
(4) Pihak  berkuasa  berwibawa  hendaklah berkuasa melibatkan  pihak  ketiga  
seperti  badan  akreditasi  dan  pihak  berkuasa  lain  semasa  pengauditan  
lapangan dijalankan;  
 
(5) Syarikat dan/  atau  pemohon  hendaklah  bersedia  pada  setiap  masa  untuk  
diaudit, menyediakan   suatu   bentuk   pembentangan   ringkas   berkaitan   
permohonan SPHM serta menyediakan dokumen dan rekod yang diperlukan 
semasa pengauditan lapangan dijalankan; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
67 
 
(6) Pegawai  pemeriksa  hendaklah berhak  menamatkan  pengauditan  lapangan  
sekiranya  syarikat  dan/  atau  pemohon  tidak  memberikan  kerjasama  atau  
tidak bersedia untuk diaudit; 
 
(7) Pegawai  pemeriksa hendaklah berhak  diberi  akses  kepada  keseluruhan  
premis termasuklah: 
 
(a) Diberi hak menemuramah mana-mana pihak yang berkaitan; dan 
 
(b) Diberi  hak  mengambil gambar,  salinan  dokumen,  sampel  bagi  tujuan  
pembuktian. 
 
(8) Pegawai pemeriksa hendaklah mengemukakan salinan laporan pengauditan 
lapangan dan diserahkan   kepada   syarikat   dan/   atau   pemohon   untuk   
simpanan dan tindakan lanjut; 
 
(9) Pegawai  pemeriksa  yang  menjalankan  pengauditan  lapangan hendaklah 
menyediakan  laporan pengauditan  lapangan  berkaitan  permohonan  SPHM  
melalui sistem MYeHALAL;  
 
(10) Kegagalan  syarikat  dan/  atau  pemohon  mematuhi prosedur  pengauditan 
lapangan yang ditetapkan boleh menjejaskan permohonan SPHM; dan 
 
(11) Pegawai    pemeriksa    hendaklah berhak    mengesyorkan    pembatalan    
permohonan sekiranya: 
 
(a) Syarikat   dan/   atau   pemohon   tidak   berminat   untuk   meneruskan   
permohonan SPHM; 
 
(b) Permohonan  yang  tidak  menepati skim  atau  kategori  permohonan  
Pensijilan Halal Malaysia; 
 
(c) Perubahan alamat lokasi premis; 
 
(d) Syarikat  dan/  atau  pemohon  sudah  tidak  beroperasi  di  lokasi  premis  
yang dinyatakan di dalam borang permohonan MYeHALAL; 
 
(e) Syarikat  dan/  atau  pemohon  gagal  memberikan  kerjasama  semasa  
pengauditan lapangan; dan    
 
(f) Lain-lain situasi yang difikirkan wajar oleh pegawai pemeriksa. 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
68 
 
29. PENGAUDITAN SUSULAN 
 
(1) Pihak  berkuasa  berwibawa hendaklah berkuasa menetapkan  pengauditan  
susulan atau  semula  bagi  tujuan  verifikasi  ke  atas  syarikat  dan/  atau  
pemohon selepas tindakan pembetulan dilaksanakan; 
 
(2) Pihak  berkuasa  berwibawa hendaklah berkuasa mengarahkan  pengauditan 
susulan atau semula dijalankan ke atas mana-mana permohonan SPHM;  
 
(3) Pihak   berkuasa   berwibawa   hendaklah berkuasa menentukan pegawai 
pemeriksa  bagi  menjalankan  pengauditan  lapangan  susulan  atau  semula  
adalah pegawai yang sama atau sebaliknya; 
 
(4) Prosedur pengauditan lapangan di bawah Prosedur 28, Manual Prosedur ini 
hendaklah terpakai bagi tujuan pengauditan susulan atau semula; 
 
(5) Pengauditan susulan  atau  semula hendaklah dijalankan  sekali  sahaja bagi 
mana-mana permohonan SPHM; dan 
 
(6) Pegawai  pemeriksa  yang  menjalankan  pengauditan  lapangan  hendaklah  
menyediakan laporan pengauditan lapangan susulan atau semula berkaitan 
permohonan SPHM melalui sistem MYeHALAL. 
 
 
30. KETIDAKAKURAN 
 
(1) Syarikat  dan/  atau  pemohon hendaklah mengemukakan  maklum  balas  dan 
jawapan  NCR  kepada  pegawai  pemeriksa mengikut  tempoh  masa  yang  
telah ditetapkan; 
 
(2) Maklum  balas  dan  jawapan  NCR  hendaklah  dikemukakan  secara  rasmi  
dengan memenuhi perkara-perkara yang berikut:  
 
(a) Didokumenkan secara bertulis; 
 
(b) Mengemukakan   maklum   balas   secara   terus,   spesifik dan jelas 
berkaitan tindakan pembetulan yang telah dilaksanakan; dan 
 
(c) Mengemukakan  dokumen  sokongan (seperti  jadual,  resit,  sijil  halal,  
invois dan lain-lain) dan bukti bergambar serta hendaklah ditandakan 
dengan teratur dan sistematik. 
 
(3) Pegawai  pemeriksa  hendaklah  menyediakan  laporan berkaitan  status  NCR  
permohonan SPHM melalui sistem MYeHALAL; dan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
69 
 
 
(4) Pegawai   pemeriksa   hendaklah berhak mengesyorkan kepada   Panel   
Pengesahan  Halal  Malaysia untuk menolak  permohonan sekiranya  pihak  
syarikat dan/ atau pemohon: 
 
(a) Gagal   memberikan   maklum   balas   dan   jawapan   NCR   mengikut   
tempoh masa yang ditetapkan; atau 
 
(b) Memberikan  maklum  balas  dan  jawapan  NCR  palsu  serta  tidak 
memenuhi keperluan prosedur Pensijilan Halal Malaysia. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
70 
 
BAHAGIAN VII 
PEMANTAUAN 
 
 
31. JENIS PEMANTAUAN  
 
(1) Pihak  berkuasa  berwibawa  hendaklah berkuasa menjalankan  pemantauan 
ke atas semua pemegang SPHM mengikut kategori yang berikut: 
 
(a) Pemantauan berkala  
Pemeriksaan   secara   terancang   dan   berterusan   dari   semasa   ke   
semasa  ke  atas  pemegang SPHM  bagi  menilai  kepatuhan  terhadap  
prosedur  Pensijilan  Halal  Malaysia  serta  perundangan  dan  peraturan  
berkaitan; dan 
 
(b) Pemantauan susulan  
Pemeriksaan   ke   atas   pemegang   SPHM   yang tidak   mematuhi 
prosedur    Pensijilan    Halal    Malaysia    berdasarkan    pemantauan 
terdahulu. 
 
(2) Pemantauan  hendaklah  dijalankan  oleh  sekurang-kurangnya  dua  (2)  orang  
pegawai pemeriksa yang dilantik dan berkelayakan; 
 
(3) Pihak  berkuasa  berwibawa  hendaklah berkuasa melibatkan  pihak  ketiga  
seperti  badan  akreditasi  dan  pihak  berkuasa  lain  bagi  menjalankan  tugas  
berdasarkan bidang kuasa yang ada semasa pemantauan dijalankan;  
 
(4) Prosedur pemantauan  yang  dijalankan  oleh  pegawai  pemeriksa hendaklah 
meliputi keseluruhan keperluan yang terkandung di dalam Manual Prosedur 
ini   dan   tidaklah   hanya   terhad   kepada   prosedur   dan   keperluan yang 
diperuntukan di bawah Bahagian VII Manual Prosedur ini;  
 
(5) Pegawai   pemeriksa   hendaklah berhak   menjalankan pemantauan tanpa 
pemakluman awal kepada pihak pemegang SPHM; 
 
(6) Pegawai  pemeriksa hendaklah berhak  diberi  akses  kepada  keseluruhan  
premis, dokumen dan termasuklah: 
 
(a) Diberi hak menemuramah mana-mana pihak yang berkaitan; dan 
 
(b) Diberi  hak  mengambil gambar,  salinan  dokumen,  sampel  bagi  tujuan  
pembuktian. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
71 
 
(7) Pemegang  SPHM  hendaklah  sentiasa  bersedia  dan  memberi  kerjasama  
sepenuhnya kepada pegawai pemeriksa ketika pemantauan dijalankan; 
 
(8) Pegawai      pemeriksa      yang      menjalankan      pemantauan hendaklah 
mengemukakan  salinan  Notis  Pemantauan  Pensijilan  Halal  Malaysia  atau  
Notis  ketidakakuran  Pensijilan  Halal  Malaysia  atau  Notis  Penggantungan/  
Penarikan  Sijil  Pengesahan  Halal  Malaysia  (yang  mana  berkaitan)  kepada  
pemegang SPHM untuk simpanan dan/ atau tindakan lanjut;  
 
(9) Pegawai pemeriksa yang menjalankan pemantauan hendaklah menyediakan 
laporan pemantauan melalui sistem MYeHALAL; dan 
 
(10) Pegawai   pemeriksa   hendaklah berhak mengesyorkan   kepada   Panel   
Pengesahan  Halal  Malaysia  JAKIM  atau  MAIN/  JAIN  untuk  menarik  balik  
SPHM sekiranya pemegang SPHM:  
 
(a) Gagal   memberikan   maklum   balas   dan   jawapan   NCR mengikut 
tempoh masa yang ditetapkan; 
 
(b) Memberikan  maklum  balas  dan  jawapan  NCR  yang  tidak  memenuhi  
keperluan prosedur Pensijilan Halal Malaysia; dan 
 
(c) Didapati melakukan ketidakakuran SERIUS berkaitan Syariah. 
 
 
32. KATEGORI KETIDAKAKURAN 
 
(1) Ketidakakuran KECIL 
 
Pemegang  SPHM  yang  didapati  melakukan  ketidakakuran teknikal  seperti  
yang berikut adalah merupakan suatu ketidakakuran KECIL: 
 
(a) Penukaran   atau   penambahan   pengeluar    atau    pengilang    atau 
pembekal bahan mentah sedia ada yang memiliki sijil halal yang sah 
tanpa    memaklumkan    secara    bertulis    kepada    pihak    berkuasa    
berwibawa; 
 
(b) Penambahan  bahan  mentah  bagi  produk  atau  menu  sedia  ada  yang  
berlainan  dari  senarai  bahan  mentah  atau  menu  yang  didaftarkan 
dalam sistem MYeHALAL; 
 
(c) Ketidakakuran    berkaitan    dokumen    dan    rekod.    (Contoh:    resit 
pembelian bahan   mentah   dan   rekod   pengeluaran   produk   gagal 
dikemukakan); 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
72 
 
 
(d) Ketidakakuran  berkaitan  kesihatan, kebersihan dan  sanitasi  pekerja 
dan  pelawat.  (Contoh:  gagal  mendapatkan  suntikan  vaksinasi  anti  
tifoid,   tiada   rekod kursus   pengendalian   makanan,   menyimpan   
barangan peribadi  di  kawasan  pemprosesan  dan merokok di  tempat  
larangan); 
 
(e) Ketidakakuran berkaitan GMP  ke  atas  premis, persekitaran,  sanitasi  
dan peralatan yang mendatangkan risiko rendah kepada keselamatan 
produk.  (Contoh: bahan  mentah  atau  produk  siap  diletakkan  secara  
terus di lantai tanpa alas seperti pallet dan penggunaan tong sampah 
tidak bebas tangan); 
 
(f) Ketidakakuran    berkaitan    latihan    halal.    (Contoh:    pekerja    tidak    
mengikuti latihan halal); 
 
(g) Ketidakakuran berkaitan kemudahan dan kebajikan pekerja. (Contoh: 
kemudahan ruang solat tidak disediakan);  
 
(h) Ketidakakuran berkaitan pertambahan premis yang telah dipersijilkan 
tanpa   makluman   kepada   pihak   berkuasa   berwibawa.   (Contoh: 
pertambahan lot yang melibatkan aliran pengeluaran (production line), 
gudang penyimpanan); 
 
(i)   Ketidakakuran    berkaitan    nama    produk,    menu,    dan    maklumat    
pembungkusan,  pelabelan  dan  pengiklanan  yang  tidak  sama  seperti 
maklumat pada SPHM;  
 
(j)   Ketidakakuran    berkaitan    pemegang    SPHM    di    bawah    skim    
perkhidmatan logistik  meliputi  perubahan  dan/  atau  penambahan  
perkhidmatan  atau  aktiviti  atau  barangan,  kontrak  perjanjian  bertulis,  
sistem pengesanan dan penandaan yang jelas; 
 
(k) Ketidakakuran    berkaitan    kontrak    atau    perjanjian bertulis    atau    
persetujuan  bersama.  (Contoh:  kontrak  antara  pemilik  jenama  dan  
pengilang kontrak gagal dikemukakan); 
 
(l)   Ketidakakuran  berkaitan  premis,  produk,  menu  dan  perkhidmatan  
yang  dimohon  termasuk  keperluan  memohon  semua  produk  dan  
menu mengikut skim Pensijilan  Halal  Malaysia  dan  dihasilkan  secara  
konsisten. (Contoh: menu promosi tidak mendapat pengesahan halal 
dan produk yang dipersijilkan halal tidak pernah dihasilkan sepanjang 
tempoh sah laku SPHM); dan 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
73 
 
(m) Ketidakakuran    berkaitan    kegagalan mematuhi MS, prosedur, 
peraturan   dan   pekeliling   berkaitan yang hanya   memberi   kesan   
minimum kepada Pensijilan Halal Malaysia.  
 
(2) Ketidakakuran BESAR 
 
Pemegang  SPHM  yang  didapati  melakukan  ketidakakuran  teknikal  seperti  
yang berikut adalah merupakan suatu ketidakakuran BESAR: 
 
(a) Ketidakakuran berkaitan bahan  mentah  atau  ramuan  yang  selain  
daripada ketidakakuran  KECIL  dan  ketidakakuran SERIUS.  (Contoh:  
penambahan  pembekal  bahan  mentah  atau  ramuan  yang  diragui 
status halal); 
  
(b) Ketidakakuran  berkaitan  penggunaan  atau  penyalahgunaan  SPHM  
dan/  atau  logo  Halal  Malaysia.  (Contoh:  mempamerkan  SPHM  yang  
telah tamat tempoh); 
 
(c) Ketidakakuran  berkaitan  GMP  ke  atas  premis,  persekitaran,  sanitasi  
dan  peralatan  yang  mendatangkan  risiko  tinggi  kepada  keselamatan  
produk. (Contoh: bahan mentah atau produk dicemari najis tikus); 
 
(d) Ketidakakuran  berkaitan  alat  dan  unsur  penyembahan  di  kawasan  
pemprosesan.   (Contoh:   tokong   berhala   ditempatkan   di   kawasan   
dapur hotel); 
 
(e) Ketidakakuran   berkaitan   peralatan   dan   perkakasan   yang   boleh   
memberi  implikasi  negatif kepada Pensijilan Halal Malaysia. (Contoh: 
penggunaan gelas minuman yang berlabel jenama minuman keras); 
 
(f) Ketidakakuran  berkaitan  Sistem  Pengurusan  Halal  Malaysia  (MHMS) 
yang   tidak   berkesan   dan   tidak   memuaskan;   (Contoh:   prosedur   
kawalan bahan mentah tidak dipatuhi); 
 
(g) Ketidakakuran berkaitan melanggar perundangan dan peraturan pihak 
berkuasa  yang  berkaitan.  (Contoh:  premis  tidak  memiliki  lesen  yang  
sah daripada PBT); 
 
(h) Ketidakakuran  berkaitan  Eksekutif  Halal,  Penyelia  Halal  dan  pekerja 
Muslim   termasuklah   penyembelih dan   pemeriksa   halal.   (Contoh:   
bilangan pekerja  Muslim  tidak  memenuhi  keperluan  Pensijilan  Halal  
Malaysia);  
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
74 
 
(i)   Ketidakakuran  berkaitan  penggunaan  nama  syarikat,  produk,  menu,  
jenama,  label  yang  merujuk  kepada  produk  tidak  halal  atau  sinonim 
atau menyerupai produk tidak halal atau apa-apa istilah mengelirukan 
dan  menyebabkan  kebarangkalian  berlaku  penyelewengan  akidah,  
khurafat  dan  penipuan.  (Contoh:  penggunaan  nama  produk  bak  kut 
teh dan produk air jampi); 
 
(j)   Ketidakakuran  berkaitan  pelabelan  termasuklah  perkataan,  lambang,  
ilustrasi,  istilah  atau  nama  yang  menyalahi  Hukum  Syarak  pada  
pembungkusan atau pelabelan; 
 
(k) Ketidakakuran  berkaitan  mekanisme  kawalan  bagi  tempat  tinggal  
pekerja,  makanan  dan  minuman  pekerja dan  lain-lain unsur yang 
boleh  menyebabkan  pencemaran  kepada  produk  yang  dipersijilkan  
halal; 
 
(l)   Ketidakakuran  berkaitan  rekod  operasi  sembelihan.  (Contoh:  syarikat  
gagal menyediakan rekod sembelihan tidak sempurna); 
 
(m) Ketidakakuran berulang  melebihi  dua  (2)  kali  daripada  mana-mana 
pemeriksaan  Pensijilan  Halal  Malaysia.  (Contoh:  syarikat  melakukan  
ketidakakuran KECIL berturut-turut dan berulang kali); 
 
(n) Ketidakakuran   berkaitan   kegagalan   mematuhi   arahan   tindakan   
pembetulan    ketidakakuran    KECIL    yang    diarahkan    oleh    pihak    
berkuasa berwibawa; 
 
(o) Ketidakakuran     berkaitan     kerjasama     pihak     syarikat     semasa      
pengauditan  atau  pemantauan  Pensijilan  Halal  Malaysia.  (Contoh:  
menghalang    pegawai    pemeriksa    daripada    memasuki    kawasan 
pemprosesan); dan 
 
(p) Ketidakakuran    berkaitan    kegagalan    mematuhi    MS,    prosedur, 
peraturan   dan   pekeliling   berkaitan   yang   memberi   kesan   ketara 
kepada Pensijilan Halal Malaysia. 
 
(3) Ketidakakuran SERIUS 
 
Pemegang SPHM yang didapati melakukan ketidakakuran berbentuk syariah 
dan teknikal  seperti  yang berikut  adalah  merupakan  suatu  ketidakakuran  
SERIUS: 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
75 
 
(a) Ketidakakuran berkaitan Syariah: 
 
(i)   Ketidakakuran    berkaitan    pengesahan    status    tidak    halal 
terhadap  sesuatu  bahan  mentah  atau  ramuan,  produk,  menu, 
perkhidmatan, peralatan dan lain-lain yang berkaitan oleh pihak 
berkuasa  berwibawa dan/  atau  badan  pensijilan  halal  luar  
negara yang diiktiraf; 
 
(ii)  Ketidakakuran       berkaitan       penggunaan,       pengendalian, 
penyimpanan,  dan  percampuran  bahan  tidak  halal  meliputi  
bahan mentah, produk, menu, perkhidmatan, premis, peralatan 
dan  perkakasan,  produk  dagangan  (trading  product)  dan  lain-
lain; 
 
(iii) Ketidakakuran   berkaitan membawa   masuk   makanan   dan   
minuman termasuklah bahan mentah, produk dan lain-lain yang 
tidak halal ke premis yang dipersijilkan halal; 
 
(iv) Ketidakakuran     berkaitan     pengendalian     proses     pelalian 
(stunning)    yang  menyebabkan  kematian  kepada  haiwan  atau  
hilangnya hayah al-mustaqirrah; dan 
 
(v) Ketidakakuran    berkaitan    memproses    haiwan    yang    tidak    
sempurna   sembelihan   atau   tidak   mati   dengan   sempurna   
sebagai produk yang dipersijilkan halal. 
 
(b) Ketidakakuran berkaitan teknikal: 
 
(i)   Ketidakakuran  berkaitan  perubahan  pengurusan  dan  nama  
syarikat tanpa makluman kepada pihak berkuasa berwibawa; 
 
(ii)  Ketidakakuran    berkaitan    memproses    haiwan    yang    tidak    
sempurna   sembelihan   atau   tidak   mati   dengan   sempurna   
sebagai produk yang dipersijilkan halal; 
 
(iii) Ketidakakuran  berkaitan  pemalsuan  atau  penyelewengan  atau  
mengubahsuai maklumat yang terdapat pada SPHM dan/ atau 
logo Halal Malaysia; 
 
(iv) Ketidakakuran  berkaitan  alat  pelalian (stunning) diselia  oleh 
pekerja bukan Muslim; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
76 
 
(v) Ketidakakuran  berkaitan  penyembelih   dan/   atau  pemeriksa  
halal  tidak  mempunyai  Tauliah  Penyembelih  yang  sah  atau  
tamat tempoh; 
 
(vi) Ketidakakuran  berkaitan  menggunakan  bahan  terlarang  atau 
menyalahi   mana-mana   perundangan   dan   peraturan   yang 
berkuatkuasa; dan 
 
(vii) Ketidakakuran berkaitan kegagalan mematuhi arahan tindakan 
pembetulan ketidakakuran BESAR. 
 
 
33. TINDAKAN 
 
(1) Pihak  berkuasa  berwibawa  hendaklah berkuasa menetapkan  tindakan  ke  
atas  pemegang  SPHM  yang  didapati  gagal  mematuhi  prosedur  Pensijilan  
Halal Malaysia; 
  
(2) Tindakan yang berikut boleh dikenakan ke atas pemegang SPHM: 
 
(a) Pengeluaran Notis Ketidakakuran Pensijilan Halal Malaysia; 
 
(b) Penggantungan SPHM; 
 
(c) Penarikan balik SPHM; 
 
(d) Pembekuan akaun MYeHALAL; atau 
 
(e) Makluman status syarikat kepada umum. 
 
(3) Mana-mana    syarikat    pemegang    SPHM    yang    didapati    melakukan 
ketidakakuran KECIL, hendaklah dikenakan tindakan seperti yang berikut: 
 
(a) Dikeluarkan    Notis    Pemantauan    Pensijilan    Halal    dan    Notis    
ketidakakuran Pensijilan Halal Malaysia; 
 
(b) Diberikan  amaran  untuk  pembetulan  dibuat  serta  merta atau  dalam  
tempoh 14 hari atau mana-mana tempoh lain yang difikirkan wajar; 
 
(c) Dijalankan pemantauan susulan atau  semula selepas  tamat  tempoh  
yang ditetapkan (jika perlu); 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
77 
 
(d) Dikeluarkan  Notis  Penggantungan/  Penarikan  Sijil  Pengesahan  Halal  
Malaysia  sekiranya  gagal  melaksanakan  tindakan  pembetulan  dalam  
tempoh yang diarahkan; 
 
(e) SPHM akan digantung serta merta;  
 
(f) Status SPHM  milik  syarikat  akan  ditentukan  oleh  Panel  Pengesahan  
Halal; dan 
 
(g) Pihak   berkuasa   berwibawa   boleh   menyenaraikan   syarikat   yang   
digantung  atau  ditarik  balik  SPHM  di  dalam  Portal  Rasmi  Halal  
Malaysia   dan/   atau   membekukan   akaun   syarikat   untuk   tempoh   
sekurang-kurangnya tiga (3) bulan melalui sistem MYeHALAL. 
 
(4) Mana-mana    syarikat    pemegang    SPHM    yang    didapati    melakukan    
ketidakakuran BESAR, hendaklah dikenakan tindakan seperti yang berikut: 
 
(a) Dikeluarkan   Notis   Pemantauan   Pensijilan   Halal   Malaysia,   Notis   
Ketidakakuran  Pensijilan  Halal  Malaysia  dan  Notis  Penggantungan/  
Penarikan Sijil Pengesahan Halal Malaysia; 
 
(b) SPHM digantung serta merta; 
 
(c) Diberikan  amaran  untuk  pembetulan  dibuat  serta merta  atau  dalam  
tempoh 14 hari atau mana-mana tempoh lain yang difikirkan wajar; 
 
(d) Laporan    penggantungan    SPHM    dikemukakan    kepada    Panel    
Pengesahan Halal untuk keputusan muktamad sama ada: 
 
(i)   Perlu dibuat pemantauan susulan atau semula;  
 
(ii)  SPHM dikembalikan semula; atau 
 
(iii) SPHM ditarik balik. 
 
(e) Pihak   berkuasa   berwibawa boleh   menyenaraikan   syarikat   yang   
digantung  atau  ditarik  balik  SPHM  di  dalam  Portal  Rasmi  Halal  
Malaysia   dan/   atau   membekukan   akaun   syarikat   untuk   tempoh   
sekurang-kurangnya tiga (3) bulan melalui sistem MYeHALAL. 
 
(5) Mana-mana    syarikat    pemegang    SPHM    yang    didapati    melakukan    
ketidakakuran SERIUS, hendaklah dikenakan tindakan seperti yang berikut: 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
78 
 
(a) Dikeluarkan Notis Pemantauan dan Notis Penarikan Sijil Pengesahan 
Halal Malaysia; 
 
(b) SPHM ditarik balik serta merta; 
 
(c) Laporan    penarikan    balik SPHM dikemukakan    kepada    Panel    
Pengesahan Halal untuk keputusan muktamad; 
 
(d) Pihak berkuasa berwibawa boleh menyenaraikan syarikat yang ditarik 
balik   SPHM   di   dalam   Portal   Rasmi   Halal   Malaysia   dan/   atau   
membekukan  akaun  syarikat  untuk  tempoh  sekurang-kurangnya  tiga  
(3) bulan melalui sistem MYeHALAL; dan 
 
(e) Mana-mana dapur berpusat yang ditarik balik SPHM disebabkan oleh 
ketidakakuran SERIUS, maka semua premis makanan yang berkaitan 
hendaklah ditarik balik SPHM. 
 
(6) Pemegang  SPHM  yang  dikenakan  tindakan  penggantungan  atau  penarikan 
balik  SPHM hendaklah  DILARANG  menggunakan  logo  Halal  Malaysia  dan  
sebarang ungkapan atau label halal; dan 
 
(7) Pihak  berkuasa  berwibawa  boleh meneruskan  sebarang  bentuk  tindakan  
mengikut  perundangan  dan  peraturan  yang  dikuatkuasakan  oleh  pihak  
berkuasa yang berkaitan sekiranya difikirkan perlu. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
79 
 
BAHAGIAN VIII 
SIJIL PENGESAHAN HALAL MALAYSIA 
 
 
34. PENGELUARAN SIJIL 
 
(1) JAKIM   hendaklah   berkuasa mengeluarkan   SPHM   berdasarkan   senarai   
kelulusan  yang  diputuskan  secara  rasmi  oleh  Panel  Pengesahan  Halal  
Malaysia; (Rujuk LAMPIRAN G) 
 
(2) Senarai    syarikat    dan/    atau    pemohon    yang    berjaya    dalam    proses    
permohonan SPHM hendaklah dikeluarkan SPHM dalam tempoh masa lima 
(5)  hari  bekerja  atau  suatu  tempoh  yang  ditetapkan  oleh  pihak  berkuasa  
berwibawa setelah Panel Pengesahan Halal Malaysia membuat keputusan; 
 
(3) SPHM  hendaklah  dikeluarkan  berdasarkan  maklumat  permohonan  yang  
dinyatakan melalui sistem MYeHALAL dan perlulah direkodkan; 
 
(4) Pihak   berkuasa   berwibawa   hendaklah berkuasa menentukan kaedah 
pengeluaran SPHM sama ada secara cetakan manual atau digital; 
 
(5) Pengeluaran   SPHM   hendaklah   mematuhi   prosedur,   memenuhi ciri-ciri 
keselamatan dan kerahsiaan pada sijil tersebut; dan 
 
(6) SPHM hendaklah diserahkan  kepada  syarikat  dan/  atau  pemohon melalui 
serahan tangan atau pos berdaftar. 
 
 
35. TEMPOH SAH LAKU 
 
(1) Pihak  berkuasa  berwibawa hendaklah berkuasa menentukan  tempoh  sah  
laku   SPHM   yang   dikeluarkan   kepada   syarikat   dan/   atau   pemohon 
berdasarkan skim Pensijilan Halal Malaysia yang ditawarkan; 
 
(2) Syarikat  dan/  atau  pemohon yang  lulus  permohonan  SPHM  hendaklah  
dikeluarkan SPHM untuk tempoh yang berikut: 
 
(a) Satu (1) tahun bagi permohonan di bawah skim rumah sembelihan; 
 
(b) Dua (2) tahun bagi permohonan di bawah skim produk makanan dan 
minuman dan skim premis makanan;  
 
(c) Tiga (3) tahun bagi permohonan di bawah skim produk kosmetik, skim 
produk     farmaseutikal,     skim     produk     barang     gunaan,     skim     

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
80 
 
perkhidmatan  logistik,  skim  pengilangan  kontrak/  OEM  dan skim 
produk peranti perubatan; dan 
 
(d) Dua  (2)  tahun  bagi  permohonan  syarikat  dan/  atau  pemohon  yang  
berdaftar di luar negara dan menjalankan perusahaan, pengeluaran di 
dalam negara.  
 
(3) Tanpa  terikat  dengan  Prosedur  35  (2)  Manual  Prosedur  ini,  pihak  berkuasa  
berwibawa hendaklah berkuasa menetapkan tempoh sah laku lima (5) tahun 
bagi permohonan syarikat dan/ atau pemohon yang memenuhi syarat-syarat 
yang ditetapkan yang berikut: 
 
(a) Pemegang SPHM sekurang-kurangnya lima (5) tahun; 
 
(b) Komited  dalam  mematuhi  prosedur  dan  peraturan  Pensijilan  Halal  
Malaysia; 
 
(c) Tiada  ketidakakuran  dikesan  (termasuklah  dalam  aspek  kebersihan)  
semasa pengauditan dan pemantauan; 
 
(d) Tidak  pernah  dikenakan  tindakan  berkaitan  dengan  kawalan  halal;  
dan 
 
(e) MHMS dilaksanakan dengan berkesan.  
 
(4) Syarikat dan/ atau pemohon berhak menolak tawaran tempoh sah laku lima 
(5) tahun SPHM.  
 
 
36. SYARAT PENGGUNAAN 
 
(1) Penggunaan SPHM hendaklah tertakluk  kepada  syarat-syarat  yang  telah  
ditetapkan pada SPHM; 
 
(2) Syarikat  pemegang  SPHM  hendaklah  bertanggungjawab  ke  atas  apa-apa 
penyalahgunaan    atau    penyelewengan    SPHM    dan    tertakluk    kepada    
perundangan dan peraturan yang berkuat kuasa; 
 
(3) Pihak berkuasa berwibawa hendaklah berkuasa menggantung atau menarik 
balik atau menamatkan tempoh sah laku SPHM atau lain-lain tindakan yang 
difikirkan  perlu  pada  bila-bila  masa  sekiranya didapati syarikat pemegang 
SPHM menyalahi prosedur Pensijilan   Halal   Malaysia   atau   dikenakan   
tindakan  di  bawah  mana-mana perundangan dan  peraturan  yang  berkuat 
kuasa; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
81 
 
 
(4) SPHM  hendaklah tidak  boleh  diniaga,  diberi  pinjam,  ditukar  milik,  dipalsu,  
disalahguna, atau dipinda isi kandungannya dengan apa cara sekalipun; dan 
 
(5) SPHM  asal  dan  masih  sah  hendaklah  dipamerkan  pada  setiap  masa  di  
alamat seperti yang dinyatakan pada sijil. 
 
 
37. PINDAAN MAKLUMAT 
 
(1) Syarikat  pemegang  SPHM  hendaklah membuat permohonan  bagi  pindaan 
maklumat  pada  SPHM  sekiranya  berlaku  kesilapan  dan  kesalahan  pada  
cetakan SPHM; 
 
(2) Permohonan   pindaan   maklumat   pada   SPHM   hendaklah   dikemukakan   
secara  rasmi  melalui  urus  setia Panel  Pengesahan  Halal  Malaysia  yang 
memutuskan kelulusan permohonan SPHM tersebut; 
 
(3) Pindaan nama  syarikat  pada  SPHM  hendaklah dibenarkan  sekiranya  tidak 
melibatkan pertukaran nombor pendaftaran syarikat dan alamat premis; 
 
(4) Pindaan maklumat produk,  menu,  premis  makanan  dan  perkhidmatan pada 
SPHM hendaklah tidak  dibenarkan; syarikat  dan/  atau  pemohon  hendaklah 
mengemukakan permohonan baharu; 
 
(5) JAKIM hendaklah berkuasa mengenakan  bayaran  fi  cetakan  semula  SPHM  
sekiranya  kesilapan  yang  dinyatakan  tersebut  disebabkan  oleh  kecuaian  
pihak syarikat dan/ atau pemohon; dan 
 
(6) SPHM  yang  asal  hendaklah  diserahkan  semula  kepada  pihak  berkuasa 
berwibawa sebelum dikeluarkan SPHM baharu. 
 
 
38. HILANG ATAU ROSAK 
 
(1) SPHM  yang  hilang  atau  rosak  hendaklah  dilaporkan  dengan  kadar  segera  
kepada  pihak  berkuasa  berwibawa  dengan  mengemukakan  surat  rasmi  
berkaitannya; 
 
(2) Syarikat  pemegang  SPHM  hendaklah  mengemukakan  salinan  laporan  polis  
berkaitan kehilangan atau kerosakan SPHM; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
82 
 
(3) Urus setia Panel   Pengesahan   Halal   Malaysia hendaklah   meneliti   dan   
menyemak sebab kehilangan atau kerosakan SPHM sebelum mengeluarkan 
dan/ atau mengemukakan cetakan SPHM baharu; 
 
(4) JAKIM hendaklah berkuasa mengenakan  bayaran  fi  cetakan  semula  SPHM  
sekiranya   kehilangan   atau   kerosakan   SPHM   adalah   disebabkan   oleh   
kecuaian pihak syarikat; 
 
(5) Syarikat   pemegang   SPHM   hendaklah berhak   dikecualikan   bayaran   fi   
cetakan  semula  SPHM  sekiranya  kehilangan  atau  kerosakan  SPHM  adalah 
disebabkan  faktor  luar  jangka  seperti  bencana  dan  sebagainya  tertakluk 
kepada pertimbangan pihak berkuasa berwibawa; dan 
 
(6) SPHM baharu hendaklah  dikeluarkan  berdasarkan  maklumat  permohonan  
yang dinyatakan melalui sistem MYeHALAL dan perlulah direkodkan. 
 
 
39. PEMBATALAN 
 
(1) Pihak  berkuasa  berwibawa  hendaklah berkuasa membuat  pembatalan  ke  
atas SPHM sekiranya: 
 
(a) Permohonan   pembatalan   SPHM   (keseluruhan   atau   sebahagian) 
secara sukarela oleh pihak syarikat; 
 
(b) Syarikat  pemegang  SPHM  telah  tidak  beroperasi  di  lokasi  yang  
dinyatakan dalam SPHM; 
 
(c) Pertukaran syarikat pengilangan kontrak; 
 
(d) Produk  dan/  atau  perkhidmatan  telah  ditamatkan  penghasilan  atau  
operasi; 
 
(e) Pengantian SPHM baharu seperti pembetulan maklumat SPHM; atau 
 
(f) Lain-lain situasi yang difikirkan wajar oleh pihak berkuasa berwibawa. 
  
(2) SPHM  yang  telah  dibatalkan  hendaklah  diserahkan  semula  kepada  pihak  
berkuasa berwibawa; dan 
  
(3) Pihak   berkuasa   berwibawa   hendaklah   merekodkan   pembatalan   SPHM   
melalui sistem MYeHALAL. 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
83 
 
BAHAGIAN IX 
LOGO HALAL MALAYSIA 
 
 
40. BENTUK DAN CIRI-CIRI 
 
(1) Logo  Halal  Malaysia  hendaklah  dicetak,  dipamer  mengikut  bentuk  dan  ciri-
ciri yang berikut:  
 
 
 
(2) Pemegang   SPHM   hendaklah dibenarkan   mencetak   warna   logo   Halal 
Malaysia mengikut kesesuaian selagi mana tidak mengubah spesifikasi logo 
Halal Malaysia.  
 
 
41. SYARAT PENGGUNAAN 
 
(1) Logo  Halal  Malaysia  hendaklah digunakan  oleh  pemegang  SPHM  yang  
masih  sah  tempoh dan  mendapatkan  kebenaran  daripada  pihak  berkuasa  
berwibawa; 
 
(2) Logo Halal  Malaysia  hendaklah  tidak  digunakan  pada  produk  atau  menu  
yang mempunyai  lambang  berunsur  penyembahan  dan  keagamaan  yang 
memberi implikasi negatif kepada Pensijilan Halal Malaysia; 
 
(3) Premis  makanan  hendaklah mempamerkan  logo  Halal  Malaysia  di  tempat  
yang bersesuaian dan/ atau pada paparan menu; 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
84 
 
(4) Dapur  hotel  hendaklah mempamerkan  logo  Halal  Malaysia  di  bahagian  
dapur  sahaja  dan  tidak  dibenarkan  dipamer  di  pintu  masuk  dapur,  kaunter  
pendaftaran hotel dan sebagainya; 
 
(5) Hotel  yang  dipersijilkan  halal  bagi  restoran  boleh  mempamerkan  logo  Halal 
Malaysia di restoran tersebut; 
 
(6) Pemegang SPHM di bawah skim pengilangan kontrak/ OEM hendaklah tidak 
mengguna, mencetak, melekat dan mempamerkan logo Halal Malaysia pada 
produk  yang  diproses  atau  dikilangkan  melainkan  produk  tersebut  memiliki  
SPHM  di  bawah  skim  produk  seperti  skim  produk  makanan  dan  minuman, 
dan skim produk kosmetik; 
 
(7) Perkhidmatan   pengangkutan,   penggudangan   dan   peruncitan   hendaklah 
menggunakan   logo   halal   pada   premis   atau   seksyen   atau   lot   atau 
pengangkutan yang telah dipersijilkan halal oleh pihak berkuasa berwibawa; 
 
(8) Logo Halal   Malaysia   hendaklah tidak boleh   digunakan   bagi   tujuan   
pengiklanan kecuali    disertakan    bersama-sama    produk    dan/    atau 
perkhidmatan  yang  dipersijilkan  halal  dan  hendaklah  diletak  dan  dipamer  di  
tempat yang bersesuaian; 
 
(9) Logo  Halal  Malaysia  atau  ungkapan  halal  di  dalam  iklan  hendaklah  tidak 
digunakan dengan tuj   uan dan/ atau boleh mengelirukan pengguna;  
 
(10) Logo  halal  boleh  dicetak  pada  resit  dan  kepala  surat  (letter  head)  syarikat  
pemegang  SPHM  yang  masih  sah  dan  penggunaan  logo halal  pada  kad  
nama  (name  card)  atau  kad  perniagaan  (business card)  hendaklah tidak 
dibenarkan;  
 
(11) Penggunaan  logo  Halal  Malaysia  hendaklah  tertakluk  kepada  syarat-syarat 
yang  telah  ditetapkan  oleh  pihak  berkuasa  berwibawa  dan  lain-lain  agensi  
yang berkaitan;  
 
(12) Pihak    berkuasa    berwibawa    berkuasa melarang dan    menghalang    
penggunaan  logo  Halal  Malaysia  sekiranya  didapati  syarikat  menyalahi  
prosedur Pensijilan Halal Malaysia atau dikenakan tindakan di bawah mana-
mana perundangan dan peraturan yang berkuat kuasa;  
 
(13) Pemegang    SPHM    yang    dikenakan    tindakan    penggantungan    SPHM    
hendaklah  tidak  menggunakan logo Halal  Malaysia  pada  produk  yang  
dihasilkan dalam tempoh penggantungan berkuatkuasa; dan 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
85 
 
(14) Premis   makanan dan penyedia perkhidmatan yang   dipersijilkan   halal   
hendaklah   tidak   mempamerkan   logo   Halal   Malaysia   dalam   tempoh 
penggantungan berkuatkuasa. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
86 
 
BAHAGIAN X 
PEGAWAI PEMERIKSA 
 
 
42. PELANTIKAN 
 
(1) Pihak berkuasa berwibawa hendaklah berkuasa melantik mana-mana orang 
yang   berkelayakan   untuk   menjadi   pegawai   pemeriksa   bagi   maksud   
menjalankan  pengauditan  atau pemantauan  Pensijilan  Halal  Malaysia di 
bawah Manual Prosedur ini; 
 
(2) Pegawai  pemeriksa  yang dilantik  hendaklah  bebas  dan  tidak  mempunyai,  
memperoleh  atau  memegang  apa-apa  kepentingan  secara  langsung  dan  
tidak langsung dengan mana-mana  syarikat dan/ atau pemohon; 
 
(3) Pelantikan  pegawai  pemeriksa  hendaklah  dibuat  secara  bertulis  oleh  pihak 
berkuasa berwibawa; 
 
(4) Pihak berkuasa berwibawa hendaklah berkuasa menamat dan menarik balik 
pelantikan sebagai pegawai pemeriksa sekiranya didapati tidak menjalankan 
tanggungjawabnya dengan sebab-sebab yang munasabah; dan 
 
(5) Pihak berkuasa berwibawa hendaklah berkuasa bekerjasama dengan mana-
mana  agensi  lain  yang  berkaitan  dengan  pelaksanaan  pengauditan  atau 
pemantauan Pensijilan Halal Malaysia. 
 
 
43. BIDANG KUASA 
 
(1) Pegawai pemeriksa yang  diberi  kuasa  hendaklah dengan sewajarnya  boleh  
pada   setiap   masa   yang   munasabah,   memasuki   mana-mana   premis, 
kawasan, ruang, bilik dalam kawasan pihak syarikat dan/ atau pemohon bagi 
maksud  menjalankan  pengauditan  atau  pemantauan serta  menjalankan 
tugasan yang berkaitan dengan skop Pensijilan Halal Malaysia; 
 
(2) Pegawai  pemeriksa  hendaklah berhak  membuat  laporan  kepada  Panel  
Pengesahan  Halal  Malaysia  berkaitan syarikat  dan/  atau  pemohon  yang  
enggan memberi kuasa akses, menghalang, melengah dan enggan memberi 
maklumat dan kerjasama kepada pegawai pemeriksa;  
 
(3) Pegawai  pemeriksa  hendaklah berhak  mengambil  sebarang  sampel  bahan  
mentah  atau  ramuan,  pembungkusan,  label,  produk  atau  lain-lain  yang 
difikirkan  perlu  bagi  maksud  menjalankan  tugasan yang  berkaitan  dengan 
skop Pensijilan Halal Malaysia; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
87 
 
 
(4) Pegawai   pemeriksa   hendaklah   diberikan   kebenaran   untuk   mengambil   
gambar dan mendapatkan salinan dokumen dan rekod yang difikirkan perlu 
bagi tujuan pengauditan atau pemantauan Pensijilan Halal Malaysia; 
 
(5) Pegawai  pemeriksa  hendaklah berhak  mengarahkan pihak syarikat  dan/  
atau pemohon  untuk  hadir  di  hadapannya  sekiranya difikirkan  perlu  bagi  
mendapatkan   maklumat   lanjut   berkaitan   permohonan   Pensijilan   Halal   
Malaysia; dan 
 
(6) Pegawai   pemeriksa   hendaklah   berhak   membuat   apa-apa   syor   yang 
difikirkan   wajar   berkenaan   permohonan   Pensijilan   Halal   Malaysia   atau   
syarikat pemegang SPHM kepada Panel Pengesahan Halal Malaysia. 
 
 
44. NILAI DAN ETIKA 
 
Pegawai  pemeriksa  hendaklah  sentiasa mematuhi nilai  dan  etika  sebagai  
penjawat   awam   sama   ada   daripada sudut berpakaian,   perwatakan, 
penampilan dan profesionalisme semasa menjalankan tugas. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
88 
 
BAHAGIAN XI 
PANEL PENGESAHAN HALAL MALAYSIA 
 
 
45. PELANTIKAN 
 
(1) Pihak berkuasa berwibawa hendaklah berkuasa melantik mana-mana orang 
yang berkelayakan untuk menjadi ahli panel bagi maksud membuat penilaian 
ke  atas  hasil  pengauditan  dan  pemantauan  Pensijilan  Halal  Malaysia  di  
bawah Manual Prosedur ini; 
 
(2) Ahli panel yang dilantik hendaklah bebas dan tidak mempunyai, memperoleh 
atau memegang  apa-apa  kepentingan  secara  langsung  dan  tidak  langsung  
dengan mana-mana  syarikat dan/ atau pemohon; 
 
(3) Pelantikan  ahli  panel  hendaklah  dibuat  secara  bertulis  oleh  pihak  berkuasa  
berwibawa; 
 
(4) Tempoh  pelantikan  ahli  panel hendaklah berkuat  kuasa selama  dua  (2)  
tahun  atau  mana-mana  tempoh  yang  difikirkan  wajar  oleh  pihak  berkuasa  
berwibawa;  
 
(5) Ahli panel yang dilantik boleh dibayar sejumlah elaun menghadiri mesyuarat 
Panel  Pengesahan  Halal  Malaysia yang  ditentukan  oleh  pihak  berkuasa  
berwibawa; dan 
 
(6) Pelantikan  semula  mana-mana ahli  panel  hendaklah  dilaksanakan  oleh 
pihak berkuasa berwibawa sebelum tamatnya tempoh keahlian panel. 
 
 
46. KEAHLIAN 
 
(1) Panel  Pengesahan  Halal  Malaysia  hendaklah  terdiri  daripada  ahli-ahli  yang 
berikut: 
 
(a) Seorang (1) pengerusi; 
 
(b) Seorang (1) setiausaha; 
 
(c) Seorang (1) pakar dalam bidang Syariah atau lulusan bidang Syariah; 
dan 
 
(d) Seorang (1) pakar dalam bidang teknikal atau lulusan bidang teknikal. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
89 
 
 
(2) Pengarah Bahagian Pengurusan Halal, JAKIM hendaklah menjadi pengerusi 
Panel Pengesahan Halal Malaysia peringkat JAKIM dan hendaklah melantik 
penggantinya mengikut kekananan pangkat apabila ketidakhadirannya; 
 
(3) Pengarah  JAIN  atau lain-lain  jawatan  yang  dilantik  oleh  MAIN  hendaklah 
menjadi pengerusi Panel Pengesahan Halal Malaysia peringkat MAIN/ JAIN 
dan hendaklah melantik penggantinya mengikut kekananan pangkat apabila 
ketidakhadirannya; dan 
 
(4) Wakil Bahagian Pengurusan Halal, JAKIM hendaklah menjadi salah seorang 
daripada ahli Panel Pengesahan Halal Malaysia peringkat MAIN/ JAIN. 
 
 
47. KUORUM 
 
Bagi   mana-mana mesyuarat   Panel   Pengesahan   Halal   Malaysia   yang 
ditubuhkan  di  bawah  Bahagian  XI,  Manual  Prosedur  ini,  tiga (3)  orang ahli 
mesyuarat,  termasuk  ahli  yang  mempengerusikan  mesyuarat  hendaklah  
membentuk kuorum mesyuarat. 
 
 
48. BIDANG KUASA  
 
(1) Panel Pengesahan Halal Malaysia hendaklah berkuasa menimbang, menilai, 
mengkaji  dan  membuat  keputusan  pengauditan Pensijilan  Halal  Malaysia 
berdasarkan ketetapan yang berikut: 
 
(a) Lulus; 
 
(b) Lulus bersyarat; 
 
(c) Tidak berjaya; 
 
(d) Audit susulan/ semula; 
 
(e) Batal; atau 
 
(f) Simpan dalam perhatian (KIV)  
 
 
(2) Panel Pengesahan Halal Malaysia hendaklah berkuasa menimbang, menilai, 
mengkaji  dan  membuat  keputusan  pemantauan  Pensijilan  Halal  Malaysia  
berdasarkan ketetapan yang berikut: 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
90 
 
 
(a) Penarikan balik SPHM; atau 
 
(b) Penyerahan semula SPHM 
 
(3) Panel Pengesahan Halal Malaysia hendaklah berkuasa menimbang, menilai, 
mengkaji dan membuat apa-apa keputusan terhadap isu-isu yang berbangkit 
berkaitan Pensijilan   Halal   Malaysia   termasuklah   membekukan   akaun   
permohonan syarikat dan/ atau pemohon; 
 
(4) Panel Pengesahan  Halal  Malaysia  hendaklah bertanggungjawab mengawal 
dan   menyelaras   Pensijilan   Halal   Malaysia   mengikut   perundangan   dan 
peraturan, standard dan prosedur yang telah ditetapkan; 
 
(5) Panel Pengesahan   Halal   Malaysia   hendaklah berkuasa menubuhkan 
jawatankuasa kecil bagi membantu dan melancarkan urusan Pensijilan Halal 
Malaysia (jika perlu); 
 
(6) Panel Pengesahan  Halal  Malaysia  hendaklah berkuasa  mengesah atau 
menolak syor dan keputusan yang telah ditetapkan oleh jawatankuasa kecil;  
 
(7) Panel  Pengesahan  Halal  Malaysia  peringkat  JAKIM  hendaklah  berkuasa 
menimbang,   menilai,   mengkaji   dan   membuat   keputusan   ke   atas   hasil   
pengauditan dan pemantauan oleh MAIN/ JAIN (jika perlu); dan 
 
(8) Panel Pengesahan   Halal   Malaysia   hendaklah bertanggungjawab tidak 
menzahirkan  apa-apa maklumat  yang  diperolehi  semasa  mesyuarat  Panel  
Pengesahan Halal Malaysia melainkan setelah diputuskan secara rasmi. 
 
 
49. PENAMATAN 
 
(1) Pihak berkuasa berwibawa hendaklah berkuasa menamat dan/ atau menarik 
balik  pelantikan  sebagai  ahli  panel  sekiranya  didapati  tidak  menjalankan  
tanggungjawabnya dengan sebab-sebab yang munasabah; dan 
 
(2) Keahlian  panel  hendaklah  tamat  secara  automatik  apabila ahli panel  tidak  
lagi berkhidmat atau tidak menjawat jawatan yang dikhususkan tersebut. 
 
 
50. JAWATANKUASA KECIL 
 
(1) Panel   Pengesahan Halal   Malaysia   hendaklah berkuasa mengarahkan 
penubuhan  jawatankuasa  kecil  untuk  membantu membuat  penilaian  dan  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
91 
 
menimbang permohonan syarikat dan/ atau pemohon berkaitan pengauditan 
dan pemantauan Pensijilan Halal Malaysia; 
 
(2) Keahlian jawatankuasa kecil hendaklah terdiri daripada sekurang-kurangnya 
dua   (2)   orang   ahli   dan   dilantik   secara   bertulis   oleh   pengerusi Panel 
Pengesahan Halal Malaysia; 
 
(3) Panel Pengesahan Halal Malaysia hendaklah memastikan fungsi dan bidang 
kuasa jawatankuasa kecil  adalah jelas dan bersesuaian; dan 
  
(4) Jawatankuasa    kecil    hendaklah    merekodkan setiap    keputusan    yang    
ditetapkan dan  dilaporkan  di  dalam  mesyuarat  Panel  Pengesahan  Halal  
Malaysia. 
 
 
51. PANEL RAYUAN 
 
(1) Panel  Rayuan  Pengesahan  Halal  Malaysia  hendaklah  terdiri  daripada  ahli 
yang berikut: 
 
(a) Seorang (1) pengerusi; 
 
(b) Seorang   (1) setiausaha (Pengarah   Bahagian   Pengurusan Halal, 
JAKIM  atau  Pengarah  JAIN  atau  lain-lain  jawatan  yang  dilantik  oleh  
MAIN); 
 
(c) Seorang (1) ahli mewakili Pejabat Penasihat Undang-Undang; dan 
 
(d) Sekurang-kurangnya seorang (1) ahli yang dilantik. 
 
(2) Ketua   Pengarah   JAKIM   hendaklah   menjadi   pengerusi Panel Rayuan 
Pengesahan Halal   Malaysia   peringkat   JAKIM   dan   hendaklah   melantik   
penggantinya mengikut kekananan pangkat apabila ketidakhadirannya;  
 
(3) Yang  Di  Pertua  MAIN  atau  lain-lain  jawatan  yang  dilantik  oleh  MAIN 
hendaklah  menjadi  pengerusi Panel  Rayuan Pengesahan  Halal  Malaysia  
peringkat   MAIN/   JAIN   dan   hendaklah   melantik   penggantinya   mengikut   
kekananan pangkat apabila ketidakhadirannya; 
 
(4) Pengarah  Bahagian  Pengurusan Halal,  JAKIM  atau wakilnya boleh menjadi 
salah  seorang  daripada  ahli  Panel  Rayuan  Pengesahan  Halal  Malaysia 
peringkat MAIN/ JAIN;  
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
92 
 
(5) Panel  Rayuan  Pengesahan  Halal  Malaysia  peringkat  JAKIM  hendaklah 
berkuasa menimbang,  menilai,  mengkaji  dan  membuat  keputusan  ke  atas  
permohonan rayuan yang diterima oleh MAIN/ JAIN (jika perlu); dan 
 
(6) Tiga   (3)   orang   ahli   mesyuarat,   termasuk   ahli   yang   mempengerusikan   
mesyuarat   hendaklah   membentuk   kuorum   mesyuarat   Panel   Rayuan   
Pengesahan Halal Malaysia. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
93 
 
BAHAGIAN XII 
PENSAMPELAN 
 
 
52. JENIS SAMPEL 
 
(1) Pegawai  pemeriksa  hendaklah berhak meminta,  memilih,  mengambil  atau 
mendapatkan sampel  bahan  mentah,  produk,  peralatan dan  lain-lain  yang  
diragui status halal untuk tujuan analisis makmal; 
 
(2) Sampel  yang  diambil  untuk  analisis  makmal  hendaklah  berkaitan  dengan  
skop yang berikut: 
 
(a) Alkohol; 
 
(b) Deoxyribonucleic Acid (DNA); 
 
(c) Fizikal (kulit dan bulu); 
 
(d) Protein (profiling dan penentuan sumber); 
 
(e) Lemak dan minyak (profiling dan penentuan sumber); dan 
 
(f) Lain-lain   skop   analisis   yang   ditentukan   oleh   pihak   berkuasa   
berwibawa 
 
(3) Pegawai  pemeriksa  juga hendaklah berhak meminta,  memilih,  mengambil  
atau  mendapatkan  sampel  bahan  mentah,  produk,  bahan  pembungkusan,  
label  dan  lain-lain  yang  difikirkan  perlu untuk  penelitian  Panel  Pengesahan  
Halal Malaysia.   
 
 
53. PROSEDUR  
 
(1) Pegawai   pemeriksa   hendaklah   menjalankan   pensampelan   untuk   tujuan   
analisis  makmal  mengikut  Manual  Prosedur  Pensampelan  Pensijilan  Halal  
Malaysia yang dikeluarkan oleh JAKIM; dan 
 
(2) Sampel  yang  diambil  untuk  penelitian  Panel  Pengesahan  Halal  Malaysia  
hendaklah   mendapat   persetujuan   daripada pihak syarikat   dan/   atau   
pemohon terlebih dahulu. 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
94 
 
54. KOS 
 
Syarikat dan/ atau pemohon hendaklah menanggung keseluruhan kos yang 
terlibat dalam pensampelan. 
 
 
55. MAKMAL ANALISIS 
 
(1) Sampel   bagi   tujuan   pengauditan Pensijilan   Halal   Malaysia   hendaklah   
dihantar untuk analisis   ke makmal-makmal yang berikut: 
 
(a) Malaysia Halal Analysis Centre (MyHAC);  
 
(b) Jabatan Kimia Malaysia; atau 
 
(c) Makmal-makmal Panel Halal yang dilantik. 
 
(2) Sampel   bagi   tujuan   pemantauan   Pensijilan   Halal   Malaysia   hendaklah 
dihantar ke Jabatan Kimia Malaysia untuk analisis. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
95 
 
BAHAGIAN XIII 
TANGGUNGJAWAB PEMEGANG SIJIL 
 
 
56. PEMATUHAN UNDANG-UNDANG DAN PERATURAN 
 
(1) Setiap syarikat dan/ atau pemohon yang berjaya dalam permohonan SPHM 
hendaklah bersetuju  menandatangani  dan  mematuhi  Perjanjian  Pensijilan  
Halal Malaysia; dan 
 
(2) Semua bahan  mentah  atau  ramuan,  produk, menu, perkhidmatan,  premis 
dan aktiviti hendaklah mematuhi Manual Prosedur ini, Manual  MHMS 2020, 
MS,   prosedur,   fatwa, pekeliling, perundangan   dan   peraturan terkini 
termasuklah  lain-lain keperluan  relevan  yang  sedang  berkuat  kuasa di 
Malaysia dan/ atau negara pengeluar. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
96 
 
BAHAGIAN XIV 
PELBAGAI 
 
 
57. INISIATIF SEGERA PENSIJILAN HALAL MALAYSIA (ISPHM) 
 
(1) Pihak   berkuasa berwibawa   hendaklah   berkuasa   menjalankan   prosedur   
ISPHM    terhadap    permohonan    syarikat    dan/    atau    pemohon    yang    
dikategorikan senarai putih (whitelist) dan/ atau tidak kritikal tertakluk kepada 
syarat-syarat yang ditentukan oleh pihak berkuasa berwibawa sahaja; 
 
(2) Syarikat senarai putih (whitelist) hendaklah memenuhi kriteria yang berikut: 
 
(a) Pemegang SPHM bagi tempoh minimum lima (5) tahun; 
 
(b) Membangun,  mengamal  dan  mengekalkan  MHMS  dengan  baik  dan  
berkesan; 
 
(c) Rekod   Pensijilan   Halal   Malaysia   yang   baik   dan   tiada   rekod 
ketidakakuran  BESAR  atau  SERIUS  dalam  tempoh  lima  (5)  tahun  
pensijilan semasa; 
 
(d) Mematuhi  aktiviti  pemantauan  dan  penguatkuasaan  pihak  berkuasa  
berwibawa dalam tempoh enam (6) bulan yang terkini; dan 
 
(e) Lain-lain kriteria yang ditetapkan oleh pihak berkuasa berwibawa. 
 
(3) Pihak berkuasa berwibawa hendaklah berkuasa menarik balik penyenaraian 
syarikat  senarai  putih  (whitelist)  pada  bila-bila  masa  sekiranya  didapati  
pemegang SPHM melanggar kriteria senarai putih (whitelist); 
 
(4) Permohonan   dikategorikan   sebagai   tidak kritikal KECUALI   melibatkan 
permohonan yang berikut: 
 
(a) Permohonan baharu; 
 
(b) Permohonan skim rumah sembelihan; 
 
(c) Permohonan  skim  premis  makanan  kategori  hotel  (dapur  dan/  atau  
restoran); dan 
 
(d) Lain-lain    permohonan    yang    ditetapkan    oleh    pihak    berkuasa    
berwibawa. 
  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
97 
 
(5) Pelaksanaan ISPHM hendaklah terbahagi kepada: 
 
(a) Fast track tanpa audit lapangan;  
 Kelulusan  segera  terhadap  permohonan  dalam  kategori  tidak  kritikal  
dan   syarikat   senarai   putih   (whitelist)   selepas   pihak   berkuasa   
berwibawa menerima bayaran fi. 
 
(b) Fast track tanpa NCR; dan 
 Kelulusan  segera  terhadap  permohonan  yang  telah  dijalankan  audit  
lapangan tanpa sebarang NCR. 
 
(c) Fast track NCR telah ditutup. 
 Kelulusan  segera  terhadap  permohonan  yang  telah  dijalankan  audit  
lapangan  dan  telah  melakukan  tindakan  pembetulan  selaras  dengan  
prosedur Pensijilan Halal Malaysia.  
 
(6) Pelaksanaan   ISPHM   hendaklah   menjadi   kuasa   mutlak   pihak   berkuasa   
berwibawa. Pihak syarikat dan/ atau pemohon hendaklah tidak berhak untuk 
memohon pelaksanaan ISPHM ke atas mana-mana permohonannya kepada 
pihak berkuasa berwibawa; 
 
(7) Pihak   berkuasa   berwibawa   hendaklah   berkuasa   menawar,   melaksana,   
meminda prosedur pelaksanaan ISPHM berdasarkan keperluan semasa;  
 
(8) Permohonan  SPHM  syarikat  dan/  atau  pemohon  hendaklah  tidak  layak  
melalui  prosedur  ISPHM  sekiranya  tiada  rekod  pemantauan  dan/  atau  
pengauditan dalam tempoh sah laku SPHM; dan 
 
(9) Permohonan  yang  mendapat  kelulusan  secara  ISPHM  hendaklah    tertakluk  
kepada   prosedur   pemantauan   oleh   pihak   berkuasa   berwibawa   setelah   
memperolehi SPHM. 
 
 
58. SERTU 
 
(1) Syarikat   dan/   atau   pemohon   hendaklah   melaksanakan   sertu   sekiranya   
berlaku pencemaran dengan najis mughallazah; 
 
(2) Pelaksanaan  sertu  hendaklah  merujuk  kepada  Garis  Panduan  Sertu  Dari  
Perspektif  Islam  keluaran  JAKIM  bagi  memenuhi  keperluan  Pensjilan  Halal  
Malaysia; 
 
(3) Mana-mana tempat, bahagian, ruang, anggota tubuh badan, pakaian, bekas, 
peralatan,   kelengkapan   termasuklah   pengangkutan   yang   terkena   dan   

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
98 
 
tercemar dengan najis mughallazah hendaklah dibasuh tujuh (7) kali di mana 
salah satunya dengan air yang bercampur tanah. Basuhan air yang pertama 
hendaklah  dicampur  dengan  tanah,  kemudian  diikuti  dengan  enam  (6)  kali  
basuhan menggunakan air mutlak atau bersih;  
 
(4) Syarikat  dan/  atau  pemohon  boleh menjalankan  sertu  secara  dalaman  atau  
kendiri  sekiranya  mempunyai  prosedur  lengkap  pelaksanaan  sertu  yang  
telah disahkan oleh pihak berkuasa berwibawa;  
 
(5) Pihak berkuasa berwibawa hendaklah berkuasa mengarahkan syarikat dan/ 
atau pemohon menjalankan sertu dan pelaksanaan sertu tersebut hendaklah 
dikawal  selia  serta  disahkan  oleh  pihak  berkuasa  berwibawa  atau  lain-lain 
pihak yang dibenarkan sahaja; dan 
 
(6) Rekod  dan  laporan  pelaksanaan  sertu  hendaklah  disimpan  dengan  baik  
serta  boleh  dirujuk  semasa  pengauditan  atau  pemantauan Pensijilan  Halal  
Malaysia. 
 
 
59. TAULIAH PENYEMBELIH 
 
(1) Mana-mana  individu  yang  menjalankan  tugas  sebagai  penyembelih  dan/  
atau pemeriksa halal di rumah sembelihan yang dipersijilkan halal hendaklah 
memiliki Tauliah Penyembelih yang sah; 
 
(2) Pihak   berkuasa   berwibawa   hendaklah   berkuasa   mengeluarkan   Tauliah   
Penyembelih dengan mematuhi Prosedur Pengeluaran Tauliah Penyembelih 
Jabatan Agama Islam Negeri Seluruh Malaysia yang dikeluarkan oleh JAKIM 
dan/ atau lain-lain prosedur berkaitan yang ditentukan oleh MAIN/ JAIN; 
 
(3) Permohonan  dan  pengeluaran  Tauliah  Penyembelih  hendaklah  diuruskan  
oleh MAIN/ JAIN seluruh negeri; 
 
(4) Tauliah Penyembelih hendaklah dipamer atau ditunjukkan sekiranya diminta 
oleh pihak berkuasa berwibawa; 
 
(5) Tauliah  Penyembelih  hendaklah  tidak  diubahsuai,  dipinda,  dipindah  milik,  
disalah   guna   atau   membenarkan   pihak   lain   menyalahgunakan   Tauliah   
Penyembelih tersebut; dan 
 
(6) Tauliah  Penyembelih  hendaklah  tidak  sah  digunakan  sebagai  dokumen  
untuk  menjual  atau  mengedar  atau  mempromosi  sembelihan  halal  dari  
premis berkaitan. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
99 
 
60. PENGEMASKINIAN MAKLUMAT MYeHALAL 
 
(1) Pemegang  SPHM  boleh mengemaskini  maklumat  berkaitan pengeluar  atau  
pembekal bahan   mentah   dengan   mengemukakan   permohonan   rasmi   
kepada   urus   setia   Panel   Halal   Malaysia   yang   memutuskan   kelulusan   
permohonan SPHM tersebut; 
 
(2) Pengemaskinian  maklumat  berkaitan  pertukaran  atau  penambahan  atau  
pengguguran  pembekal  hendaklah  hanya  dibenarkan  bagi  bahan  mentah  
atau ramuan sedia ada; dan 
 
(3) Penambahan   maklumat   bahan   mentah   atau   ramuan   hendaklah   hanya   
dibenarkan  bagi  pemegang  SPHM  di  bawah  skim  premis  makanan  dan  
terhad kepada 10 bahan mentah atau ramuan sahaja.  
 
 
61. NOTA KONSAINAN 
 
(1) Mana-mana  pihak  yang  berhasrat  mendapatkan  nota  konsainan  hendaklah  
mengemukakan  permohonan  melalui  e-mel  dan  menyerahkannya  kembali  
kepada JAKIM; (Rujuk LAMPIRAN H) dan 
 
(2) Nota  konsainan  hendaklah  diserahkan  kepada  pemohon  secara  serahan  
tangan  atau  pos  berdaftar  setelah  bayaran  fi  nota  konsainan  diterima  oleh  
JAKIM. 
 
 
62. KUASA MEMBUAT PROSEDUR 
 
(1) Pihak berkuasa berwibawa hendaklah berkuasa menambah, mengubah dan 
membatalkan    apa-apa    peraturan,    syarat,    keperluan    dan    prosedur    
sebagaimana  yang  sesuai  manfaat  atau  perlu  bagi  menjalankan  Manual 
Prosedur ini dengan lebih baik;  
 
(2) Sebarang  perkara  berkaitan  Prosedur  62  (1)  hendaklah  dirujuk  terlebih  
dahulu kepada JAKIM bagi tujuan kesahan dan/ atau penyelarasan; dan 
 
(3) Sebarang   peraturan,   syarat,   keperluan   dan   prosedur   terkini   hendaklah      
dikuatkuasa  dan  dimaklumkan  melalui  Pekeliling  Pensijilan  Halal  Malaysia  
dan/ atau hebahan melalui portal rasmi pihak berkuasa berwibawa sebelum 
ia dikuatkuasakan. 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
100 
 
63. KEWANGAN ISLAM 
 
Syarikat  dan/  atau  pemohon  SPHM  disaran menggunakan  produk  dan  
perkhidmatan  kewangan  Islam  dalam  urusan  perbankan,  takaful,  pasaran  
modal,  pelaburan  dan  lain-lain  yang  berkaitannya  daripada  mana-mana 
institusi kewangan Islam. (Rujuk LAMPIRAN I) 
 
 
64. KERAHSIAAN 
 
(1) Segala  dokumen,  rekod,  maklumat  yang  berkaitan  permohonan  dan  aktiviti  
Pensijilan    Halal    Malaysia    adalah    SULIT    dan    hendaklah    menjadi    
tanggungjawab pihak syarikat dan/ atau pemohon, pegawai atau kakitangan 
pihak  berkuasa  berwibawa  untuk  menjaga  kerahsiaan  dan  tertakluk  kepada  
perundangan berkaitan; 
 
(2) Maklumat  mengenai  syarikat  dan/  atau  pemohon  yang  diperolehi  daripada  
sumber  pihak  ketiga  (contohnya  pengadu  atau  pihak  berkuasa)  hendaklah  
dikategorikan sebagai SULIT; dan 
 
(3) Pihak berkuasa berwibawa boleh mendedahkan maklumat berkaitan syarikat 
dan/  atau  pemohon  sekadar  yang  wajar  bagi  tujuan  perundangan  dan  
capaian umum. 
 
 
65. BERKECUALI 
 
(1) Pihak berkuasa berwibawa hendaklah bertanggungjawab untuk memastikan 
kesaksamaan dalam segala urusan Pensijilan Halal Malaysia dan tidak akan 
membenarkan  sebarang  bentuk  tekanan  komersial,  kewangan,  politik  atau  
lain-lain tekanan untuk berkompromi; 
 
(2) Pegawai atau kakitangan pihak berkuasa berwibawa dan jawatankuasa yang 
boleh  mempengaruhi  aktiviti  Pensijilan  Halal  Malaysia  hendaklah  bertindak  
secara berkecuali; dan 
 
(3) Keputusan  Pensijilan  Halal  Malaysia  hendaklah  berdasarkan  kepada  bukti  
objektif   pematuhan   dan   ketidakakuran yang   diperolehi   daripada   aktiviti   
Pensijilan   Halal   Malaysia   dan   keputusannya   tidak   dipengaruhi   oleh   
kepentingan lain atau oleh pihak lain. 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
101 
 
66. ADUAN 
 
(1) Pihak berkuasa berwibawa hendaklah menyedia dan melaksanakan tatacara 
yang direkod  dan  didokumentasi  bagi  aduan  dan  masalah  yang  dilaporkan 
berkaitan  dengan  permohonan Pensijilan  Halal  Malaysia,  pemalsuan  logo  
halal,  keraguan  status  halal  dan  haram,  pelanggaran  prosedur  Pensijilan 
Halal Malaysia dan seumpamanya; 
 
(2) Pihak-pihak   yang   berkenaan   hendaklah membuat   aduan   secara   rasmi   
kepada pihak berkuasa berwibawa melalui surat, telefon, e-mel, dalam talian 
(online),  borang  aduan dan  lain-lain  kaedah  yang  disediakan  oleh  pihak  
berkuasa berwibawa; dan   
 
(3) Pihak    berkuasa    berwibawa boleh    memaklumkan    kepada pengadu 
berkenaan keputusan atau tindakan yang telah diambil terhadap aduan yang 
diterima.   
 
 
67. BANTAHAN 
 
(1) Syarikat  dan/  atau  pemohon boleh  mengemukakan  bantahan berkaitan 
Pensijilan   Halal   Malaysia   bermula   dari   proses   permohonan   sehingga   
sebelum keputusan Panel Pengesahan Halal Malaysia dikeluarkan; 
 
(2) Bantahan  yang  dikemukakan  boleh  mempengaruhi  tempoh  masa proses 
permohonan; dan 
 
(3) Keputusan terhadap bantahan adalah muktamad. 
 
 
68. RAYUAN 
 
(1) Syarikat  dan/  atau  pemohon yang  tidak  berpuas  hati  dengan  keputusan  
Panel  Pengesahan  Halal  Malaysia  boleh  merayu  kepada  pihak  berkuasa  
berwibawa mengikut prosedur dan dalam tempoh masa yang ditetapkan; 
 
(2) Rayuan   yang   dikemukakan   hendaklah berkaitan   prosedur   serta   aktiviti   
Pensijilan  Halal  Malaysia  dan  tidak  melibatkan  isu  berkaitan  kesalahan  
undang-undang serta piawaian halal; 
 
(3) Rayuan  hendaklah  dibuat  secara  bertulis  dalam  tempoh  dua  (2)  minggu  
selepas keputusan Panel Pengesahan Halal Malaysia dikeluarkan. Sebarang 
rayuan  yang  dikemukakan  selepas  tempoh  tersebut  hendaklah tidak  akan  
dilayan; 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
102 
 
 
(4) Syarikat  dan/  atau  pemohon hendaklah  mengemukakan  rayuan  melalui 
setiausaha Panel Rayuan Pengesahan  Halal  Malaysia  untuk  semakan dan 
saringan. Hanya  permohonan rayuan yang  memenuhi  kriteria,  layak untuk 
dibawa ke Panel Rayuan Halal Malaysia; 
 
(5) Keputusan Panel Rayuan Halal  Malaysia  hendaklah dimaklumkan  dalam  
tempoh tujuh (7) hari bekerja selepas keputusan dibuat; dan 
 
(6) Keputusan Panel  Rayuan  Halal  Malaysia adalah muktamad  dan  sebarang  
rayuan semula hendaklah tidak dilayan. 
 
 
69. PENGECUALIAN 
 
(1) Walau  apapun  peruntukan  dalam  Manual  Prosedur  ini,  pihak  berkuasa  
berwibawa   hendaklah   berkuasa   mengecualikan   mana-mana   peruntukan   
dalam Manual Prosedur ini jika difikirkan perlu dan munasabah; dan  
 
(2) Sebarang  perkara  berkaitan  sub  prosedur  69 (1)  hendaklah  dirujuk  terlebih  
dahulu kepada JAKIM bagi tujuan kesahan dan/ atau penyelarasan. 
 
 
70. NASKHAH SAHIH 
 
Sekiranya terdapat  kekeliruan  dan/  atau  percanggahan  maksud  Manual 
Prosedur  ini,  maka  Manual  Prosedur  dalam  Bahasa  Melayu  hendaklah  
menjadi rujukan sahih dan muktamad. 
 
 
71. PEMBATALAN 
 
Apabila Manual   Prosedur   ini   mula   berkuat   kuasa,   Manual   Prosedur   
Pensijilan Halal Malaysia (Semakan Ketiga) 2014 hendaklah terbatal. 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
103 
 
BAHAGIAN XV 
LAMPIRAN 
 
LAMPIRAN  A  -  NAMA  DAN  JENAMA  TIDAK  HALAL  ATAU  SINONIM  PRODUK  
TIDAK HALAL ATAU MENGELIRUKAN  
 
(1) Nama syarikat, produk, menu (termasuk keterangan) dan jenama hendaklah 
tidak merujuk kepada perbahasaan tidak halal dan sinonim atau menyerupai 
dengan produk tidak halal atau apa-apa istilah mengelirukan seperti jadual di 
bawah.  
 
A 
 Absinthe 
 Aguardiente 
 Akvavit/ aquavit 
 Ale 
 Amontillado 
 Amaretto 
 Angostura 
 Anisette 
 Aperitif 
 Aperol 
 Applejack 
 Appletini 
 Armagnac 
 Arrack 
 Awamori 
 
B 
 Baa/ B'a 
 Baijiu 
 Bak Kut Teh  
 Bakon/ Bacon 
 Bahar 
 Barenfang/ 
Barenjager 
 Bellini  
 Benedictine  
 Bilibili 
 Bir/ Beer (Root 
Beer)  
 Bitters 
 Bloody Mary  
 Boukha 
 Boulervardier  
 Borovička 
 Brandi/ Brandy  
 Branntwein 
 Brennivín 
 Brem 
 Burbon/ Bourbon 
 Burgundy 
 Burukutu 
 
C 
 Cabernet 
Sauvignon 
 Cachaca 
 Calvados  
 Campari  
 Cauim 
 Cava DO 
 Cedratine 
 Chacolí 
 Chambord 
 Champagne 
 Char Siew/ Char 
Siu/ Chasu/ Cha 
Sio/ Chashao 
 Chartreuse 
 Chee Cheong Fun 
 Chica 
 Chimichurri 
 Chipolata 
 Chorizo  
 Choujiu 
 Claret 
 Cognac 
 Cointreau 
 Coney Dog  
 Creme de menthe  
 Cynar 
 
D 
 Daiquiri  
 Dunkel/ Dunkles 
 Dutch Gin 
 
E 
 Erguotou  
 Eau-de-vie 
 
F 
 Feni  
 Fino  
 Framboise  
 Frangelico 
 
G 
 Galliano 
 Gaoliang 
 Genever 
 Gimlet  
 Gin  
 Ginebra 
 Ginjinha 
 Glayva 
 Gouqi jiu 
 Grand Marnier  
 Grappa  
 Guaro 
 
H 
 Ham 
 Helles/ Hell  
 Himbeergeist 
 Horilka 
 Hot Dog 
 Huangjiu 
 
J 
 Jägermeister 
 Jenever 
 Jiuqu  
 
K 
 Kahlua 
 Kaoliang  
 Kinomol 
 Kirsch/ 
Kirchwasser 
 Korn 
 
L 
 Lady in Red 
 Lager 
 Lakka/ Lakkalikööri 
 Lambrusco  
 Lihing 
 Likuor/ Liquor 
 Lillet 
 Loh Bak 
 Lyoner 
 
M 
 Mai Tai  
 Makgeolli/ Makkoli 
 Malaga 
 Malvasia/ Malvazia 
 Maraschino  
 Margarita 
 Martini 
 Marc 
 Mastika 
 Mead 
 Merlot  
 Merisa/ Merissa 
 Meschkinnes 
 Metaxa 
 Mezcal 
 Mirin  
 Mojito 
 Moonshine 
 Muscadet/ 
Muscatel 
N 
 Nasih                               
 Negroni 
 
O 
 Okolehao 
 Old Pal 
 Oloroso 
 Orujo  
 Ouzo 
 
P 
 Palinka 
 Pastis  
 Patxaran 
 Peket 
 Pina Colada  
 Pinga 
 Pinot Noir  
 Pinyin 
 Pito 
 Pisco  
 Pommeau 
 Prosecco  
 Pulque 
 
R 
 Raki/ Rakia  
 Rakomelo 
 Retsina 
 Ron Miel 
 Rou Gu Cha/ Ro 
Ku Cha 
 Rum  
 
 
S 
 Sake 
 Sambuca 
 Samppanja 
 Sangria  
 Sassolino 
 Sazerac  
 Schnapps/ 
Schnaps  
 Scotch 
 Seco Herrerano 
 Shandi/ syandy 
 Shaojiu 
 Shochu 
 Siew Bao  
 Singani 
 šljivovica 
 Soju  
 Sonti 
 Sotol 
 Spirit 
 Spritz 
Veneziano  
 Stout  
 Syeri/ Sherry 
 Southern 
Comfort 
 
T 
 Tentura/ 
Tintura 
 Tequila  
 Tesguino 
 Thwon 
 Todi/ Toddy 
 Tokaji  
 Tongba 
 Törkölypálinka 
 Triple Sec  
 Tsikoudia/ 
Tsipouro 
 Tsipouro 
 Tuak  
 Txakoli 
 
U 
 Umeshu  
 
V 
 Vermouth  
 Vin doux 
naturel 
 Vinho verde 
 Vinsanto 
 Vodka  
 
W 
 Whiskey 
 Wine  
 
X 
 Xifengji 
 Xa Xiu                
 
Z 
 Zivania/ 
zivana 
 
  Nota: Termasuklah lain-lain nama yang tidak halal atau sinonim atau menyerupai dengan 
   produk tidak halal atau apa-apa istilah mengelirukan.
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
104 
 
(2) Pihak berkuasa berwibawa boleh membenarkan penggunaan nama syarikat, 
produk,  menu  (termasuk  keterangan)  dan  jenama  sekiranya  disertakan 
dengan pernyataan tambahan atau iringan seperti jadual di bawah. 
    
B 
Bologna/ Boloney/ Bratwurst 
 
G 
Gyoza/ Jiaozi 
 
K 
Koktel/ Cocktail 
 
L 
Luncheon  
M 
Madeira Red/ Mortadella 
 
P 
Polony 
 
R 
Ramen/ Rye 
 
S 
Shogayaki 
Sider/ Cider 
Sorghum  
Streaky 
 
Nota: Termasuklah lain-lain nama yang tidak halal atau sinonim atau menyerupai dengan 
 produk tidak halal atau apa-apa istilah mengelirukan.
 
 
Contoh penggunaan nama dan jenama:   
  
DILARANG DIBENARKAN 
Ramen Carbonara Ramen 
Luncheon meat Chicken Luncheon Meat 
Cocktail Beef Sausage Cocktail 
Polony Chicken Chilli Polony 
Shogayaki Beef Shogayaki 
Gyoza Chicken Gyoza 
Mortadella Beef Mortadella 
 
(3) Pihak   syarikat   dan/   atau   pemohon   hendaklah   merujuk   kepada   pihak   
berkuasa   berwibawa   untuk   mendapatkan   ketetapan penggunaan   nama   
syarikat,  produk,  menu  dan  jenama  jika ia  berkaitan  dengan  sebarang  
perbahasaan tidak halal dan  sinonim  atau  menyerupai  dengan  produk  tidak  
halal atau apa-apa istilah mengelirukan.  
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
105 
 
LAMPIRAN B - CIRI-CIRI PENENTUAN DAPUR HOTEL 
 
 
 
 
 
 
 
 
 
 
Jadual B1:  Dapur hotel yang mengandungi beberapa dapur kecil di dalam dapur 
utama,  berkongsi  fasiliti  di  dalam  dapur  tersebut  dan  menggunakan  
laluan  keluar  masuk  (entry  access)  yang  sama.  Dikira  sebagai  satu  
(1) dapur hotel.  
 
 
 
 
 
 
 
 
 
 
Jadual B2:  Dapur hotel yang mengandungi beberapa dapur kecil di dalam dapur 
utama,  berkongsi  fasiliti  di  dalam  dapur  tersebut  dan  turut  memiliki  
dapur  lain  yang  menggunakan  laluan  keluar  masuk  (entry  access) 
yang khusus. Dikira sebagai dua (2) dapur hotel.  
Dapur Melayu
 
Dapur Cina
 
Dapur Pastri
 
Dapur Melayu
 
Dapur Cina
 
 
 
Dapur Pastri 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
106 
 
LAMPIRAN C - GARIS PANDUAN PARAMETER PELALIAN (STUNNING)   
 
Jenis Haiwan Arus Elektrik (Ampere) Jangka Masa (saat) 
Anak biri-biri 0.50 - 0.90 2 - 3 
Kambing 0.70 - 1.00 2 - 3 
Biri-biri 0.70 - 1.20 2 - 3 
Anak lembu (calf) 
0.50 - 1.50 3 
Anak lembu (steer) 
1.50 - 2.50 2 - 3 
Lembu betina 2.00 - 3.00 2.5 - 3.5 
Kerbau 2.50 - 3.50  3 - 4 
Burung unta 0.75 10 
Nota:  Nilai  arus  elektrik  dan  jangka  masa  ditentukan  dan  disahkan  oleh  organisasi/  
syarikat dengan mengambil kira jenis dan berat haiwan serta pelbagai faktor lain. 
Jadual C1: Garis Panduan Parameter Pelalian (Stunning) Jenis Elektrik  
 
Jenis 
Haiwan 
Berat (kilogram) 
Arus Elektrik 
(Ampere) 
Voltan 
Jangka Masa 
(saat) 
Ayam 2.40 - 2.70 0.20 - 0.60 2.50 - 10.50 3 - 5 
Lembu 
jantan 
300 - 400 
2.50 - 3.50 
300 - 310 
3 - 5 
Nota: Nilai arus elektrik, voltan dan jangka masa ditentukan dan disahkan oleh organisasi/   
syarikat dengan mengambil kira jenis dan berat haiwan serta pelbagai faktor lain. 
Jadual C2: Garis Panduan Parameter Pelalian (Stunning) Jenis Elektrik Bagi  Ayam 
dan Lembu  Jantan 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
107 
 
LAMPIRAN D - CARTA ALIR PENSIJILAN HALAL MALAYSIA 
 
            
             
 
 
        
        
          
 
 
 
 
 
 
 
 
 
 
 
 
                                                             
           
 
 
          
 
    
  
   
 
 
 
 
         
 
 
 
 
   
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
        
    
 
 
 
 
 
MULA 
TAMAT 
Pendaftaran     akaun     pengguna     sistem     
MYeHALAL 
 
 
 
Lengkap
 
Tidak Lengkap 
Tindakan 
Pembetulan 
Pengesahan akaun     pengguna     sistem     
MYeHALAL (24 jam hari bekerja) 
Penyerahan  dokumen  sokongan  berkaitan  
permohonan dalam tempoh 5 hari bekerja 
Permohonan      SPHM      melalui sistem 
MYeHALAL 
Semakan   permohonan   dan   pengauditan 
kecukupan  
 
 
 
 
 
Pengeluaran   surat   bayaran   fi   Pensijilan   
Halal Malaysia  
Pembayaran   fi   Pensijilan   Halal   Malaysia   
dalam tempoh 14 hari bekerja  
Penerimaan   bayaran   fi   Pensijilan   Halal   
Malaysia dan pengeluaran resit bayaran  
Penjadualan dan pengauditan lapangan  
 
Laporan Ketidakakuran 
Tindakan 
Pembetulan 
 
Pensampelan 
Analisis 
makmal 
Laporan pengauditan lapangan 
Mesyuarat      Panel      Pengesahan      Halal      
Malaysia  
GAGAL 
Surat 
makluman 
 
 
LULUS 
Pengeluaran 
SPHM 
Pemantauan 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
108 
 
LAMPIRAN E - ALAMAT PERHUBUNGAN PIHAK BERKUASA BERWIBAWA 
 
 JAKIM DAN JAIN SELURUH MALAYSIA 
1 
Bahagian Pengurusan Halal, 
Jabatan Kemajuan Islam Malaysia, 
Aras   6   &   7,   Blok   D,   Kompleks   Islam   
Putrajaya,  No.3,  Jalan  Tun  Abdul  Razak,  
Presint 3, 62100 Putrajaya. 
Tel.    : 03 8892 5000 
Faks. : 03 8892 5005 
E-mel : pr_halal@islam.gov.my 
Portal : http://www.halal.gov.my 
2 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Pahang,  
Jalan Masjid, 26600 Pekan, Pahang. 
Tel.    : 09 425 2162 
Faks. : 09 425 2194 
E-mel : pemantauan.halal@pahang.gov.my 
Portal : http://jaip.pahang.gov.my 
3 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Negeri Perak, 
No. 2A, Jalan Labrooy, Taman Pari,  
30100 Ipoh, Perak. 
Tel.    : 05 506 0450 
Faks. : 05 506 0109 
E-mel : halaljaipk@gmail.com 
Portal : http://jaipk.perak.gov.my 
4 
Bahagian Pengurusan Halal, 
Jabatan Hal Ehwal Agama Terengganu, 
Kompleks   Seri   Iman, Pusat   Pentadbiran   
Islam Negeri, Jalan Sultan Mohamad,  
20676 Kuala Terengganu, Terengganu. 
Tel.    : 09 623 5268/ 5273/ 5603 
Faks. : 09 632 5265 
E-mel : halalmaidam@gmail.com 
Portal : jheatweb.terengganu.gov.my 
5 
Bahagian Pengurusan Halal, 
Jabatan   Hal   Ehwal   Agama   Islam   Perlis,   
Kompleks    Islam    Perlis,    Persiaran    Jubli    
Emas, 01000 Kangar, Perlis. 
Tel.    : 04 979 4419/ 4420 
Faks. : 04 976 1344 
E-mel : jaips@perlis.gov.my 
Portal : https://www.perlis.gov.my/jaips 
6 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Selangor,  
Tingkat 5, Menara Utara,  
Bangunan Sultan Idris Shah, 
No.2, Persiaran Masjid,  
40676 Shah Alam, Selangor. 
Tel.    : 03 5514 3696 
Faks. : 03 5519 6351 
E-mel : halal@jais.gov.my 
Portal : http://www.jais.gov.my 
7 
Bahagian Pengurusan Halal, 
Jabatan   Hal   Ehwal   Agama   Islam   Negeri   
Sembilan,  
Tingkat 3, Jalan    Yam    Tuan, 70990 
Seremban, Negeri Sembilan. 
Tel.    : 06 766 4221 
Faks. : 06 766 4220 
E-mel : halalnegeri9@ns.gov.my 
Portal : http://jheains.ns.gov.my 
8 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Negeri Johor, 
Aras  1, Blok  A, Pusat Islam Iskandar Johor, 
Jalan Masjid Abu Bakar, 80990 Johor Bharu, 
Johor. 
Tel.    : 07 228 2943/ 07 228 2901 
Faks. : 07 227 6041 
E-mel : pengurusanhalaljohor@gmail.com 
Portal : http://jainj.johor.gov.my 
9 
Bahagian Pengurusan Halal, 
Jabatan Hal Ehwal Agama Islam Kelantan, 
Kompleks   Islam   Darulnaim,   Jalan   Sultan   
Yahya Petra, 15200 Kota Bharu, Kelantan. 
Tel.    : 09 747 5565 
Faks. : 09 747 1079 
E-mel : jaheaik@kelantan.gov.my 
Portal : http://www.jaheaik.gov.my 
10 
Bahagian Pengurusan Halal, 
Jabatan Hal Ehwal Agama Islam Negeri 
Kedah, 
Bangunan Wan Mat Seman, Jalan Raja,  
05676 Alor Setar, Kedah. 
Tel.    : 04 774 5515/ 5525 
Faks. : 04 733 8333 
E-mel : halalkedah@gmail.com 
Portal : http://www.jaik.gov.my/ 
11 
Bahagian Pengurusan Halal,  
Jabatan Hal   Ehwal   Agama   Islam   Negeri 
Pulau Pinang,  
Tel.    : 04 250 5451 
Faks. : 04 250 5452 
E-mel : ehalal@penang.gov.my 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
109 
 
Tingkat    44,    Menara KOMTAR,    Jalan    
Penang, 10000 Pulau Pinang. 
Portal : http://jaipp.penang.gov.my 
12 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Melaka, 
No. 53-1, 55 Jalan KPAA 2,  
Kompleks Perniagaan Al-Azim,  
75150 Jalan Bukit Baru, Melaka  
Tel.    : 06 333 3333 
Faks. : 06 288 2353 
E-mel : halalmelaka@yahoo.com 
Portal : http://www.jaim.gov.my 
13 
Urusetia Makanan Gunaan Islam, 
Bahagian     Penyelidikan     dan     Informasi,     
Jabatan   Hal   Ehwal   Agama   Islam   Negeri 
Sabah, 
Tingkat 9, Blok B, Wisma MUIS,  
Jalan Sembulan, Peti Surat 11666,  
88818 Kota Kinabalu, Sabah. 
Tel.    : 088 262 073 
Faks. : 088 239 415 
E-mel : mgisabah@gmail.gov.my 
Portal : http://www.jheains.sabah.gov.my 
14 
Bahagian Pengurusan Halal, 
Jabatan Agama Islam Sarawak, 
Aras   14,   Majma’   Tuanku   Abdul   Halim   
Mu’adzam Shah, Lorong P.Ramlee Off Jalan 
P.Ramlee, 93400 Kuching, Sarawak. 
Tel.    : 082 507 077/707 
Faks. : 082 507 241 
E-mel : halaljais.sijil@sarawak.gov.my 
Portal : https://jais.sarawak.gov.my 
15 
Cawangan Pengurusan Halal, 
Bahagian Penyelidikan, 
Jabatan Agama Islam Wilayah Persekutuan, 
Kompleks   Pusat   Islam,   Jalan   Perdana,   
50676 Kuala Lumpur. 
Tel.    : 03 2274 9333 
Faks. : 03 2273 1575 
E-mel : 
Portal : http://www.jawi.gov.my 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
110 
 
LAMPIRAN F - RINGKASAN BAHAN MENTAH ATAU RAMUAN 
 
BIL. RAMUAN 
NAMA 
PENGELUAR 
SIJIL HALAL 
& 
TARIKH 
LUPUT 
STATUS RAMUAN 
1. 
Pure 
Sesame Oil 
Syarikat ABC 
JAKIM 
 
22/6/2018 
RAMUAN SEDIA ADA (nyatakan 
nombor      permohonan      yang      
masih        sah        sijil        yang        
menggunakan     ramuan     yang     
sama) 
*Jika      ramuan      yang      sama      
digunakan    dalam    permohonan    
terdahulu       atau       mana-mana 
permohonan sedia ada yang telah 
dapat sijil halal. 
2. 
Glucose 
Syrup 
Syarikat DEF 
JAHEAT 
 
22/6/2018 
RAMUAN BAHARU 
*Jika  ramuan  ini  tidak  digunakan  
dalam     permohonan     terdahulu     
atau    mana-mana    permohonan    
sedia  ada  yang  masih  sah  sijil  
halal. 
3. 
Asam Jawa 
Syarikat GHI 
JAIS 
22/6/2018 
TUKAR PENGELUAR 
*Jika  pengeluar  terdahulu  ditukar  
dengan pengeluar baharu. 
5. 
Gula Putih 
Bertapis 
Syarikat JKL 
JAIP 
22/6/2018 
TAMBAH PENGELUAR 
*Jika  pengeluar  baharu  ditambah  
bagi ramuan yang sama. 
Jadual F: Ringkasan Bahan Mentah atau Ramuan 
 
Nota:  
(1) Pemohon   dikehendaki   menyediakan   ringkasan   ramuan   seperti   contoh   
Jadual   1   di   atas   untuk   kesemua   bahan   mentah   atau   ramuan   yang   
digunakan.  Bandingkan  setiap  bahan  mentah  atau  ramuan  dengan  senarai  
bahan  mentah  atau  ramuan  yang  telah  diisytiharkan  pada  permohonan  
terdahulu (sertakan nombor permohonan). 
 
(2) Nyatakan  status  bagi  setiap  bahan  mentah  atau  ramuan  mengikut  status  
bahan mentah atau ramuan seperti yang berikut: 
(a) RAMUAN SEDIA ADA; 
(b) RAMUAN BAHARU;  
(c) TUKAR PENGELUAR; atau 
(d) TAMBAH PENGELUAR. 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
111 
 
LAMPIRAN G - SIJIL PENGESAHAN HALAL MALAYSIA 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
112 
 
LAMPIRAN H - TEMPLAT NOTA KONSAINAN 
 
 
     Ref       :  
    Date   :  
 
LETTER OF HALAL CERTIFICATION FOR EXPORT 
 
It is hereby verified that the product described below were manufactured in accordance with the 
Islamic  rites  and  have  been  approved  HALAL  by  the  Department  of  Islamic  Development  
Malaysia  (JAKIM)  and _____________________ (the  manufacturer)  has  obtained  Malaysia  
Halal Certificate.  
 
2. Statement of products :  
 
Consignor Name:                    
 
                
Address: 
 
 
Manufacturer : 
 
 
Country of Origin: 
 
Consignee Name          
 
                                   
Address: 
 
Invoice No.: 
Date : 
 
Order No.: 
 
Shipment : 
Vessel/Transport No: 
 
Source of Raw Material /Abattoir : 
 
 
Establishment No.: 
Slaughter Date : 
Slaughtering Period/Expiry Date: 
 
 
 
 
 
 
Ref. No. of Halal Certificate    :  
Serial No. of Halal Certificate : 
 
 
Container No: 
Seal No.: 
Shipping Exit: 
 
Description of Product: 
Net 
Weight 
Gross 
Weight 
Production 
Date 
Expiry 
Date 
No. of 
Cartons 
1.    
  
 
2.  
    
 
3.  
    
 
4.  
    
 
 
        Signature   :  
        Name :   
 
 
 
 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
113 
 
LAMPIRAN I – PRODUK DAN PERKHIDMATAN KEWANGAN ISLAM 
 
SOLUSI KEWANGAN ISLAM 
 
MANFAAT YANG DIPEROLEH 
 
 
 
 
 
 
PENYELESAIAN PERBANKAN ISLAM DIHASILKAN UNTUK MEMENUHI SEMUA  
KEPERLUAN BISNES ANDA
 
 
 
 
 
 
 
 
 
 
 
 
 
PERLINDUNGAN TAKAFUL YANG KOMPREHENSIF UNTUK PERNIAGAAN 
DENGAN PERSIJILAN HALAL
 
 
 
 
 
 
 
1. Takaful untuk harta benda 
Melindungi      kehilangan      dan      kerosakan      harta,      
kelengkapan  dan  alatan  perniagaan  dan  stok  dalam  
dagangan (termasuk transit dan semasa dibangunkan) 
 
2. Perlindungan    kehilangan    atau    kekurangan    
keuntungan  disebabkan  gangguan  di  dalam  
urusan        perniagaan        (akibat        daripada                
kemusnahan/          kerosakan          disebabkan          
kebakaran atau kerosakkan jentera) 
 
3. Perlindungan   kehilangan   wang   perniagaan   
(dalam   bangunan   perniagaan   dan   semasa   
transit bank) 
 
4. Perlindungan      kerosakan      atau      kerugian      
disebabkan ketidakjujuran pekerja 
 
5. Perlindungan    harta    benda    semasa    dalam    
transit (termasuk eksport dan import) 
6. Takaful Key Man : Perlindungan individu 
penting dalam perniagaan 
 
7. Perlindungan perniagaan daripada liabiliti 
akibat kecuaian yang menyebabkan 
kehilangan/kerosakan harta benda atau 
kecederaan fizikal kepada: 
-   Pihak ketiga dalam dan luar urusan perniagaan  
-   Pengguna semasa menggunakan produk yang 
dikeluarkan. 
-   Pekerja semasa menjalankan tugas. 
 
8. Manfaat pekerjaan untuk pekerja 
-   Takaful Perlindungan Diri (Berkelompok) 
-   Takaful Rawatan Hospital dan manfaat kesihatan lain 
-   Perlindungan Term Takaful  
 
9. Takaful Motor 
MENARIK PELABUR 
TAMBAHAN 
Pelabur yang 
mementingkan etika dan 
kepatuhan Syariah 
MENGUKUHKAN JENAMA SYARIKAT 
Menunjukkan pennggunaan konsep halalan-toyyiban* 
Patuh Syariah pada seluruh rantaian perniagaan 
(termasuk kewangan) 
MENINGKATKAN 
JUALAN  
Tarikan kepada 
pelanggan yang lebih 
luas 
(contoh: pelanggan yang 
mementingkan etika) 
PENGURUSAN KEWANGAN YANG LEBIH BAIK 
Tiada kejutan kewangan seperti kadar faedah 
berkompaun 
  
• Nasihat Kewangan 
•  Pengurusan Tunai termasuk  
produk deposit, pindah wang 
• Modal Kerja 
•  Pembiayaan Alatan 
•  Pembiayaan Aset Tetap 
•  Pengurusan Tunai 
Pembiayaan Rantaian Bekal  
dan banyak lagi 
• Penyelesaian Lindung Nilai 
•  Skim Jaminan 
•  Skim Kerajaan* 
•  Perlindungan Takaful 
• Modal Kerja  
•  Kemudahan Perdagangan 
•  Pengurusan Tunai 
•  Pembiayaan Alatan 
•  Pembiayaan Rantaian Bekal  
dan banyak lagi 
AHLI-AHLI BANK AIBIM 
www.aibim.com  | +603-2026 8002/8003 
www.malaysiantakaful.com.my | +603-2031 8160 
AHLI SYARIKAT PENGENDALI TAKAFUL 
PERMULAAN 
PERNIAGAAN 
PERKEMBANGAN 
PERNIAGAAN 
(DOMESTIK) 
PENGURUSAN 
RISIKO 
PERKEMBANGAN 
PERNIAGAAN 
(ANTARABANGSA) 
*bergantung kepada skim yang tersedia  

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
114 
 
Jawatankuasa Kerja Pembangunan  
Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
Penaung: 
Dato’ Paimuzi b. Yahya  
(Ketua Pengarah JAKIM) 
 
Penasihat:  
Hajah Hakimah bt. Mohd Yusoff (Timbalan Ketua Pengarah JAKIM) 
Dato’ Dr. Sirajuddin b. Suhaimee (Pengarah Kanan Bahagian Penyelidikan JAKIM) 
Bukhari b. Md Akhir (Pengarah Bahagian Pengurusan Halal JAKIM) 
 
 Ahli Jawatankuasa: 
Nama Organisasi 
Muhammad Hawari b. Hassan (Pengerusi) 
Jabatan Kemajuan Islam Malaysia 
Muhamad   Hannan   Syafiq   b.   Jamaludin   
(Setiausaha) 
Mohamad Syukry b. Sulaiman 
Mek Som @ Rashidah bt. Che Wil 
Zuraiza bt. Husin 
Mohd Nasir b. Sulaiman 
Mohamed Reza b. Hussain 
Muhamad Samir b. Sulaiman 
Johari b. Ab. Latiff 
Roshayati bt. Mat Zin 
Siti Ayisah bt. Surif 
Mahfudzah bt. Mohamad 
Vivi Saliza bt. Sunaini 
Asiah bt. Alkharib Shah 
Noorasikin bt. Yaacob 
Hasmuna bt. Osman 
Mohamad Zukrillah b. Ismail 
Farah Azura b. Khalil 
Mohd Asyraf b. Ibrahim 
Khairunnisa bt. Che Omar 
Khairul Anuar b. Selamat 
Nik Mohamad Zawawi b. Ibrahim  Jabatan Hal Ehwal Agama Islam Kelantan 
Yang Zulhilmi b. Mohamad 
Jabatan Jabatan Hal Ehwal Agama Islam 
Negeri Sembilan 
Badiuzzaman Akmal b. Ramly 
Nor Hidayah bt. Ali Khan 
Wan Najmiah bt. Wan Mohd Ali 
 
 
Jabatan Agama Islam Selangor 
Ahmad Solihin b. Maryakon 
Abdul Hadi b. Abdullah 

Manual Prosedur Pensijilan Halal Malaysia (Domestik) 2020 
 
115 
 
Norakmal b. Mohamad  
Mohd Hata b. Ahmad 
Shazlina  b. Abd. Rashid 
Jabatan Hal Ehwal Agama Islam Negeri 
Sabah 
Zulhisyam b. Zainol 
Jabatan Hal Ehwal Agama Islam Negeri 
Kedah 
Mojtahidin b. Isa 
Kementerian Perdagangan Dalam Negeri 
dan Hal Ehwal Pengguna 
Sahzul Hisam b. Samsuri 
Mohd Zulkifli b. Saidi 
Muhammad Muhayudeen b. Musa 
Bahagian Keselamatan dan Kualiti 
Makanan, KKM 
Kamal b. Karim 
Mohd Faris Helmi b. Ab Rahim 
Dr. Mohammad Razli b. Abdul Razak Jabatan Perkhidmatan Veterinar 
Wan Othman bi. Wan Ismail 
Bahagian Regulatori Farmasi Negara, KKM 
Mohd Nasrul b. Mohamad Noor 
Fakheezah bt. Borhan Jabatan Standard Malaysia 
Salbiah bt. Yaakop Pihak Berkuasa Peranti Perubatan, KKM 
Ahmad Syukry b. Ibrahim Persatuan Pengilang-Pengilang Malaysia 
Lilywati bt. Arshad 
The Cosmetic, Toiletries And Fragrance 
Association 
Nur Liyana bt. Ithnin 
Syahira Ahmad bt. Tharmitzi Nippon Express Malaysia Sdn. Bhd. 
Rosedalina bt. Ibrahim Gerbang Alaf Restaurants Sdn. Bhd. 
Muhammad Hafif b. Hanaffi Pharmaniaga Sdn. Bhd. 
Ir. Mohd. Azmi b. Ali Dewan Perniagaan Melayu Malaysia 
Aslinda bt. Rifin 
Persatuan Hotel Malaysia 
Yusirah bt. Abu Bakar 
 `,
  },
  {
    source: "lhdn",
    doc_title: "E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6)",
    approx_pages: 132,
    text: `

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
1 
 
fi 
 
 
 
E-INVOICE SPECIFIC GUIDELINE 
INLAND REVENUE BOARD OF MALAYSIA 
This guideline is issued under section 134A of the Income Tax Act 1967 
 
(DATE OF PUBLICATION: 5 JANUARY 2026) 
 
TABLE OF CONTENTS 
LIST OF FIGURES ..................................................................................................... 3 
LIST OF TABLES ....................................................................................................... 4 
SUMMARY OF CHANGES ........................................................................................ 6 
1. INTRODUCTION ................................................................................................ 7 
2. OBJECTIVE ....................................................................................................... 7 
3. TRANSACTIONS WITH BUYERS ..................................................................... 9 
4. STATEMENTS OR BILLS ON A PERIODIC BASIS ........................................ 42 
5. DISBURSEMENT OR REIMBURSEMENT ...................................................... 53 
6. EMPLOYMENT PERQUISITES AND BENEFITS ............................................ 59 
7. CERTAIN  EXPENSES  INCURRED  BY  EMPLOYEE  ON  BEHALF  OF  THE 
EMPLOYER ..................................................................................................... 61 
8. SELF-BILLED E-INVOICE ............................................................................... 63 
9. TRANSACTIONS WHICH  INVOLVE  PAYMENTS  (WHETHER  IN  MONETARY 
FORM OR OTHERWISE) TO AGENTS, DEALERS OR DISTRIBUTORS ...... 76 
10. CROSS BORDER TRANSACTIONS ............................................................... 83 
11. PROFIT DISTRIBUTION (E.G., DIVIDEND DISTRIBUTION) .......................... 95 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
2 
 
12. FOREIGN INCOME........................................................................................ 102 
13. CURRENCY EXCHANGE RATE ................................................................... 105 
14. E-COMMERCE TRANSACTIONS ................................................................. 106 
15. CYBERSECURITY ......................................................................................... 120 
16. E-INVOICE TREATMENT DURING INTERIM RELAXATION PERIOD ......... 121 
APPENDIX 1 – LIST OF GENERAL TIN ................................................................ 123 
APPENDIX 2 – BUYER’S DETAILS IN CONSOLIDATED  E-INVOICE ................. 125 
APPENDIX 3 – PARTIES OF SELF-BILLED E-INVOICE ...................................... 127 
APPENDIX 4 – BUYER’S DETAILS FOR TRANSACTION WITH INDIVIDUALS .. 129 
APPENDIX  5 – GENERAL  AND  INDUSTRY-SPECIFIC  FREQUENTLY  ASKED 
QUESTIONS (FAQ) ....................................................................................... 131 
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
3 
 
LIST OF FIGURES 
Figure 3.1 –  Overview of invoicing process ............................................................ 9 
Figure 3.2 –  Example of visual representation of e-Invoice in PDF format (Buyer’s 
TIN not provided) .............................................................................. 17 
Figure 3.3 –  Example of visual representation of validated consolidated e-Invoice in 
PDF format (Kuala Lumpur branch) .................................................. 23 
Figure 3.4 –  Examples of receipts to Buyers ........................................................ 28 
Figure 3.5 –  Example of consolidated e-Invoice in XML format ............................ 29 
Figure 3.6 –  Example of consolidated e-Invoice in JSON format .......................... 29 
Figure 3.7 –  Example of visual representation of validated consolidated e-Invoice in 
PDF format ....................................................................................... 30 
Figure 3.8 –  Overview of methods for Suppliers to issue e-Invoice to Buyers ...... 35 
Figure 3.9 –  Issuance  process  of  e-Invoice  through  online  platform  (Retailer Web 
Portal / Mobile App) .......................................................................... 37 
Figure 3.10 –  Issuance process of e-Invoice through Retailer’s POS system ........ 38 
Figure 3.11 –  Issuance process of e-Invoice for transactions through MyInvois Mobile 
App ................................................................................................... 39 
Figure 3.12 –  Issuance process of e-Invoice through Retailers’ Web Portal / Mobile 
App ................................................................................................... 40 
Figure 4.1 –  Example of visual presentation of validated e-Invoice in statement form 
(in PDF format) ................................................................................. 48 
Figure 5.1 –  Scenario where Supplier 1 issues e-Invoice to Buyer ....................... 53 
Figure 5.2 –  Scenario where Supplier 1 issues e-Invoice to Supplier 2 ................ 56 
Figure 9.1 –  General  overview  of  a  business  involving  agent,  dealer  or  distributor
 ......................................................................................................... 76 
Figure 9.2 –  Issuance of self-billed e-Invoice by business to its agent ................. 82 
Figure 10.1 –  Current   transaction   flow   between   Foreign   Seller   (Supplier)   and 
Malaysian Purchaser (Buyer) ........................................................... 83 
Figure 10.2 –  Example  of  validated  self-billed  e-Invoice  for  transaction  with  foreign 
supplier in PDF format ...................................................................... 90 
Figure 10.3 –  Current  transaction  flow  between  Malaysian  Seller  (Supplier)  and 
Foreign Purchaser (Buyer) ............................................................... 90 
Figure 14.1 –  General overview of an e-commerce transaction ........................... 106 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
4 
 
LIST OF TABLES 
Table 3.1 –  Individual Buyer's details to be provided to Supplier ......................... 13 
Table 3.2 –  Individual Shipping Recipient’s details to be provided to Supplier .... 15 
Table 3.3 –  Details  of  TIN  and  identification  number  /  passport  number  to  be 
included  by  Supplier  for  issuance  of  e-Invoice  to  individual  Buyer  / 
individual Shipping Recipient ............................................................ 16 
Table 3.4 –  Details required to be input by Buyer for issuance of consolidated self-
billed  e-Invoice ................................................................................. 22 
Table 3.5 –  Details  to  be  included  by  Supplier  for issuance  of  consolidated  e-
Invoice .............................................................................................. 27 
Table 3.6 –  Activities that require e-Invoice to be issued for each transaction and 
consolidated e-Invoice would not be allowed .................................... 34 
Table 4.1 –  Details  to  be  input  by  Supplier  for  issuance  of  e-Invoice  to  Buyer 
(translate into statement / bill format for visual presentation) ............ 47 
Table 4.2 –  Details to be input by Supplier for issuance of consolidated e-Invoice 
(aggregation of statements / bills) ..................................................... 52 
Table 8.1 –  Parties involved in self-billed e-Invoice ............................................. 70 
Table 8.2 –  Details  of  TIN  and  identification  number  /  passport  number  to  be 
included  by  Buyer  for  issuance  of  self-billed  e-Invoice  to  individual 
Supplier ............................................................................................ 71 
Table 8.3 –  Details  required  to  be  input by  Buyer  for  issuance  of  self-billed  e-
Invoice .............................................................................................. 75 
Table 9.1 –  Details to be input by Seller (i.e., Buyer) for issuance of self-billed e-
Invoice to agent / dealer / distributor ................................................. 81 
Table 10.1 –  Details to be input by Malaysian Purchaser (Buyer) for issuance of self-
billed  e-Invoice to Foreign Seller (Supplier) ..................................... 88 
Table 10.2 –  Details  to  be  input  by  Malaysian  Seller  (Supplier)  for  issuance  of  e-
Invoice to Foreign Purchaser (Buyer) ............................................... 94 
Table 11.1 –  Details required to be input by the taxpayer that makes the distribution 
(Buyer) for issuance of self-billed e-Invoice to recipient (Supplier) . 100 
Table 12.1 –  Details required to be input by Income Recipient for issuance of an e-
Invoice ............................................................................................ 104 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
5 
 
Table 14.1 –  Details to be input by e-commerce platform provider for issuance of e-
Invoice to Purchaser ....................................................................... 110 
Table 14.2 –  Details  required  to  be  input  by  e-commerce  platform  provider  for 
issuance of self-billed e-Invoice ...................................................... 116 
Table 14.3 –  Details  required  to  be  input  by  e-commerce  platform  provider  for 
issuance of an e-Invoice ................................................................. 120 
Table 16.1 –  Interim relaxation period for each implementation phase ............... 121 
Appendix Table 1 – List of general TIN .................................................................. 124 
Appendix Table 2 – Buyer’s details in consolidated e-Invoice ................................ 126 
Appendix Table 3 – Parties of self-billed e-Invoice ................................................. 128 
Appendix Table 4 – Buyer’s details for transaction with individuals ....................... 130 
Appendix Table 5 – General and Industry-Specific FAQ ........................................ 132 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
6 
 
SUMMARY OF CHANGES  
This  e-Invoice  Specific  Guideline  (Version 4.6)  replaces  the  e-Invoice  Specific 
Guideline (Version 4.5) issued on 7 December 2025. The key changes made to this 
Guideline are summarised in the table below: 
Paragraph in  
e-Invoice 
Specific 
Guideline  
(Version 4.5) 
Changes In This Specific Guideline (Version 4.6) 
Paragraph Item Reference 
Table 3.6 Table 3.6 Removal Clarification 
Table 16.1 Table 16.1 Amendment Clarification 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
7 
 
1. INTRODUCTION 
1.1 Inland  Revenue  Board  of  Malaysia  (IRBM)  has  issued  the e-Invoice 
Guideline on 21 July 2023. 
1.2 The e-Invoice Guideline   addresses the   scope  of   implementation   of   
e-Invoice, covering the concept of e-Invoice and step-by-step guidance on 
the e-Invoice workflow.  
1.3 The IRBM has issued e-Invoice Specific Guideline in response to the need 
for further guidance on specific areas of e-Invoice, aiming to aid taxpayers 
in gaining  a  better understanding of certain e-Invoice treatment  and 
ultimately, to successfully implement e-Invoice. 
1.4 The  appendices  to  this  document  form  part  and  parcel  of  this  e-Invoice 
Specific  Guideline.  The  information  provided  in  the  appendices provide 
additional guidance to taxpayers on how to complete the requirements for 
issuance of e-Invoice as well as to enhance taxpayers’ understanding on  
e-Invoice implementation using general and industry-specific examples.   
 
2. OBJECTIVE 
This Specific Guideline is to  provide  further  guidance  on  the  issuance  of  
e-Invoice relating to the following areas:  
i. Transactions with Buyers  
ii. Statements / Bills on a periodic basis 
iii. Disbursement and reimbursement 
iv. Employment perquisites and benefits 
v. Certain expenses incurred by employee on behalf of the employer 
vi. Self-billed e-Invoice  
vii. Transactions which involve payments (whether in monetary form or otherwise) 
to agents, dealers or distributors 
viii. Cross-border transactions 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
8 
 
ix. Profit distribution (e.g., dividend distribution) 
x. Foreign income 
xi. Currency exchange rate  
xii. E-commerce transactions 
xiii. e-Invoice treatment during interim relaxation period 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
9 
 
3. TRANSACTIONS WITH BUYERS 
3.1 Currently, businesses (Suppliers) will  issue  a  receipt / bill / invoice  in 
hardcopy and/or softcopy (e.g., via e-mail) to customers (Buyers) to record 
a transaction (e.g., sale of products or provision of services to Buyers for 
personal consumption).  
3.2 Upon implementation   of e-Invoice, Suppliers are   required   to   issue  
e-Invoice for  all  of  its  transactions.  However, certain Buyers,  particularly 
customers and certain businesses, may not require an e-Invoice as proof 
of expense.   
3.3 To  assist  the Suppliers  in  complying  with e-Invoice requirements  and  to 
reduce  the  burden  to  both Suppliers and Buyers,  the  IRBM  allows  the 
Suppliers to consolidate the transactions with Buyers (who do not require 
an e-Invoice) into a consolidated e-Invoice on a monthly basis. 
3.4 Figure 3.1 provides an overview of invoicing process.  
 
Figure 3.1 – Overview of invoicing process 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
10 
 
3.5 Scenario 1: Where the Buyer requires an e-Invoice  
3.5.1 In relation  to  a  particular  transaction, Buyer that  requires  an  
e-Invoice would need to make a request by informing the Supplier 
accordingly.  
3.5.2 Upon receiving the request from the Buyer for an e-Invoice, Supplier 
obtains the Buyer’s details (refer Table 3.1 of this e-Invoice Specific 
Guideline for further details) required for the issuance of e-Invoice.  
3.5.3 In summary, the steps involved for issuance of an e-Invoice to Buyer 
are as follows:  
Step 1:  Supplier  seek  confirmation  from Buyer if  an e-Invoice is 
required.  
Step 2:  If   the Buyer confirmed that he / she   requires   an  
e-Invoice,  the Buyer is  required  to  furnish  the Supplier 
with the required information to facilitate the issuance of 
e-Invoice (refer Table 3.1 of   this e-Invoice Specific 
Guideline for further details). 
Step 3: The Supplier  is  required  to  complete  the  remaining 
required  fields  as  outlined  in  Appendices 1 and  2 of  
e-Invoice Guideline and proceed to issue an e-Invoice.  
 The process of issuing an e-Invoice is  similar  to  the  
e-Invoice workflow as discussed in Section 2.3 (e-Invoice 
model  via  MyInvois  Portal)  and  Section  2.4  (e-Invoice 
model via API) of the e-Invoice Guideline. 
Step 4: The validated e-Invoice can be used as the Buyer’s proof 
of expense, to substantiate a particular transaction for tax 
purposes. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
11 
 
3.5.4 In facilitating a more efficient e-Invoice issuance process as well as 
to ease the burden of individuals in providing their Tax Identification 
Number (TIN) and identification number details, IRBM provides the 
following concession to individuals:  
(a) For Malaysian individuals to provide either:  
i. TIN;  
ii. MyKad / MyTentera identification number; or 
iii. Both TIN and MyKad / MyTentera identification number. 
(b) For non-Malaysian individuals to provide either:  
i. TIN; or 
ii. Both   TIN   and   passport   number /   MyPR /   MyKAS 
identification number. 
For  clarity,  (b)(i)  refers  to  the TIN  assigned  by  IRBM.  In  the 
event  that  the  non-Malaysian  individual  does not  have a  TIN, 
Supplier may use the general TIN (as listed in Appendix 1 of this 
e-Invoice Specific Guideline), along with the passport number / 
MyPR / MyKAS identification number of the said individual.  
3.5.5 In summary, the details to be provided by the individual Buyers for 
the issuance of e-Invoice are as follows: 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
12 
 
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
1 Buyer’s Name Name of individual 
Buyer  
For Malaysian individuals: Full 
name as per MyKad / MyTentera 
For non-Malaysian individuals: 
Full name as per passport / MyPR 
/ MyKAS  
2 Buyer’s TIN TIN of individual 
Buyer  
For Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only   
iii. Option 3: Both TIN and MyKad 
/ MyTentera identification 
number 
For non-Malaysian individuals  
i. Option 1: TIN only  
ii. Option 2: Both TIN and 
passport number / MyPR / 
MyKAS identification number 
For  clarity, (i)  refers  to  the  TIN 
assigned  by  IRBM.  In  the  event 
that  the  non-Malaysian  individual 
does not have a TIN, Supplier may 
use  the  general  TIN  (as  listed  in 
Appendix    1    of    this    e-Invoice 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of 
registration / 
identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
13 
 
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
   Specific Guideline), along with the 
passport /    MyPR /    MyKAS 
identification  number of  the  said 
individual. 
4 Buyer’s Address Address of 
individual Buyer  
Individual   Buyer   is   required   to 
provide residential address  
5 Buyer’s Contact 
Number  
Telephone number 
of individual Buyer 
Individual   Buyer   is   required   to 
provide a contact number  
6 Buyer’s SST 
Registration 
Number 
 
SST registration 
number of 
individual Buyer 
Where applicable, individual Buyer 
to provide SST registration number  
If individual Buyer is not registered 
for SST, Supplier to input “NA” 
Table 3.1 – Individual Buyer's details to be provided to Supplier 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
14 
 
3.5.6 The details to be provided by the individual Shipping Recipient for 
the issuance of Annexure to the e-Invoice are as follows: 
No Data field Details to be 
included by 
Supplier in 
Annexure to the 
e-Invoice 
Additional Remarks 
1 Shipping 
Recipient’s 
Name 
Name of individual 
Shipping Recipient 
For Malaysian individuals 
Full name as per MyKad / 
MyTentera 
 
For non-Malaysian individuals 
Full name as per passport / MyPR 
/ MyKAS 
2 Shipping 
Recipient’s 
Address 
Address of 
individual Shipping 
Recipient  
Individual Shipping Recipient is 
required to provide residential 
address 
3 Shipping 
Recipient’s TIN 
TIN of individual 
Shipping Recipient 
For Malaysian individuals 
i. Option 1: TIN only 
ii. Option 2: MyKad / MyTentera 
identification number only 
iii. Option 3: Both TIN and MyKad / 
MyTentera identification number 
For non-Malaysian individuals 
i. Option 1: TIN only 
ii. Option 2: Both TIN and passport 
number / MyPR / MyKAS 
identification number 
For  clarity,  (i)  refers  to  the  TIN 
4 Shipping 
Recipient’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of 
registration / 
identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
15 
 
No Data field Details to be 
included by 
Supplier in 
Annexure to the 
e-Invoice 
Additional Remarks 
   assigned  by  IRBM.  In  the  event 
that  the non-Malaysian  individual 
does not have a TIN, Supplier may 
use  the  general  TIN  (as  listed  in 
Appendix    1    of    this    e-Invoice 
Specific Guideline), along with the 
passport    /    MyPR    /    MyKAS 
identification  number  of  the  said 
individual. 
Table 3.2 – Individual Shipping Recipient’s details to be provided to Supplier 
 
3.5.7 In   the   event   the individual Buyer and/or individual   Shipping 
Recipient  (where  applicable) provides  either  TIN  or MyKad / 
MyTentera identification  number  (instead  of  both),  the Supplier 
should input the following details for e-Invoice purposes:  
No Option Data field Details to be included by 
Supplier in e-Invoice 
1 Option 1 (for 
Malaysian and 
non-Malaysian 
individuals), 
where the 
Buyer’s / Shipping 
Recipient’s TIN 
Supplier to input the TIN as 
provided   by   individual   Buyer   / 
individual Shipping Recipient 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
16 
 
No Option Data field Details to be included by 
Supplier in e-Invoice 
individual Buyer / 
individual 
Shipping 
Recipient only 
provides TIN 
Buyer’s / Shipping 
Recipient's 
Registration / 
Identification 
Number / Passport 
Number 
Supplier  to input “000000000000” 
in the e-Invoice 
2 Option 2 (for 
Malaysian 
individuals), 
where the 
individual Buyer / 
individual 
Shipping 
Recipient only 
provides MyKad 
/ MyTentera 
identification 
number 
Buyer’s / Shipping 
Recipient's TIN 
Supplier to input “EI00000000010” 
in the e-Invoice 
Buyer’s / Shipping 
Recipient's 
Registration / 
Identification 
Number / Passport 
Number 
Supplier to input MyKad/ 
MyTentera identification   number 
provided  by  the individual Buyer / 
individual Shipping Recipient 
Table 3.3 – Details of TIN and identification number / passport number to be included by 
Supplier for issuance of e-Invoice to individual Buyer / individual Shipping Recipient 
 
Example 1 
Mr. Soo (Buyer) spent RM2,500 to buy a smartphone from Global 
Telco Sdn Bhd (Supplier) and has requested for an e-Invoice to be 
issued. 
Global Telco Sdn Bhd has requested for Mr. Soo’s personal details 
to proceed with the issuance of e-Invoice. Mr. Soo has provided all 
the  details  required  (including  his MyKad identification  number), 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
17 
 
except  his  TIN.  Global Telco  Sdn  Bhd  is  still  able  to  issue  an  
e-Invoice to Mr. Soo despite Mr. Soo’s TIN has not been provided.  
Upon receiving the validated e-Invoice, Mr. Soo will be able to use 
the validated e-Invoice as a proof of expense to substantiate for tax 
purposes.  
Figure 3.2 illustrates   an   example   of visual   representation   of 
validated e-Invoice issued by Global Telco Sdn Bhd to Mr. Soo.  
 
Figure 3.2 – Example of visual representation of e-Invoice in PDF format (Buyer’s TIN not 
provided) 
Note: The above example is for illustration purposes only and are subject to changes. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
18 
 
3.6 Scenario 2: Where the Buyer does not require an e-Invoice  
3.6.1 Where  the Buyer does  not  require  an e-Invoice,  the Supplier  will 
issue  a  normal receipt to  the Buyer (same  as  current  business 
practice).  However, such receipt would not  be  required  to  be 
submitted for IRBM’s validation as this document is not e-Invoice. 
3.6.2 Supplier will be allowed to aggregate transactions with Buyers who 
do  not  require  an e-Invoice on  a  monthly  basis  and  submit  a 
consolidated e-Invoice to IRBM, within seven (7) calendar days after 
the month end. 
3.6.3 For consolidated e-Invoices, the IRBM allows the Suppliers to adopt 
one (or a combination) of the following methods:   
(a) The  summary  of  each  receipt is  presented  as  separate  line 
items in the consolidated e-Invoice (refer Figure 3.7 of Example 
4) 
(b) The list of receipts (in a continuous receipt number) is presented 
as line items (i.e., where there is a break of the receipt number 
chain, the next chain shall be included as a new line item) (refer 
to Figure 3.3 of Example 2). 
(c) Branch(es) or  location(s) to  submit consolidated  e-Invoice, 
adopting  either  (a)  or (b)  above for  the  receipts  issued by  the 
branch(es) or location(s). 
3.6.4 In  order  to  improve  the  performance  of  the  MyInvois  System,  the 
following limitations have been put in place: 
(a) maximum size of 5MB per submission;  
(b) maximum of 100 e-Invoices per submission; and 
(c) maximum size of 300KB per e-Invoice. 
As such, Suppliers are allowed to split the receipts into several 
consolidated e-Invoices to meet the above requirements. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
19 
 
3.6.5 Kindly note that consolidation does not apply to self-billed e-Invoice, 
except for the following self-billed circumstances: 
(a) transactions   with individuals (who   are   not   conducting   a 
business)  
(b) interest  payment  to  public  at  large (regardless  businesses  or 
individuals) 
(c) claim,  compensation  or  benefit  payments  from  the  insurance 
business of an insurer to individuals (who are not conducting a 
business), government, government authority, state 
government or state authority 
(d) self-billed  circumstances  involving  taxpayers’  overseas 
branches or offices. 
3.6.6 The timing of issuance of consolidated self-billed e-Invoice is similar 
to  the  timing  of  issuance  of  consolidated  e-Invoice  as  mentioned 
under Section 3.6.2 of this e-Invoice Specific Guideline (i.e., submit 
consolidated self-billed e-Invoice to IRBM on a monthly basis, within 
seven (7) calendar days after the month end). 
3.6.7 In relation to the consolidated self-billed e-Invoice, Buyer (assuming 
the role of the Supplier) will be required to complete the Supplier’s 
details and certain transaction details using the following information: 
No Data field Details to be 
included by Buyer 
in consolidated 
self-billed e-Invoice 
Additional Remarks 
1 Supplier’s Name  Name of Supplier Buyer to input “General 
Public” in the consolidated 
self-billed e-Invoice 
2 Supplier’s TIN TIN of Supplier Buyer to input 
“EI00000000010” in the 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
20 
 
No Data field Details to be 
included by Buyer 
in consolidated 
self-billed e-Invoice 
Additional Remarks 
consolidated self-billed 
e-Invoice  
3 Supplier’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of registration 
/ identification 
number / passport 
number 
Buyer to input “NA” 
4 Supplier’s 
Address  
Address of Supplier Buyer to input “NA” 
5 Supplier’s 
Contact Number  
Telephone number of 
Supplier 
Buyer to input “NA” 
6 Supplier’s SST 
Registration 
Number 
SST registration 
number of Supplier 
Buyer to input “NA” 
7 Supplier’s 
Malaysia 
Standard 
Industrial 
Classification 
(MSIC code) 
MSIC code of 
Supplier (where 
applicable) 
Buyer to input “00000”  
8 Supplier’s 
Business Activity 
Description 
Description of the 
Supplier’s business 
activity 
Buyer to input “NA”  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
21 
 
No Data field Details to be 
included by Buyer 
in consolidated 
self-billed e-Invoice 
Additional Remarks 
9 Classification  Classification of 
product or services 
Buyer  to  input  a  3-digit  integer 
(e.g., “004”), in accordance with 
the catalogue set by IRBM 
10 Description of 
Product / 
Services 
Details of products or 
services being billed 
for a transaction with 
Supplier 
IRBM   allows   the Buyers to 
adopt one (or a combination) of 
the  following  methods for  the 
consolidated self-billed  
e-Invoice:  
(a) Summary of each receipt is 
presented  as  separate  line 
items 
(b) List    of    receipts    (in    a 
continuous  receipt  number) 
is  presented  as  line  items 
(i.e., where there is a break 
of the receipt number chain, 
the   next   chain   shall   be 
included as a new line item)  
(c) Branch(es)   or   location(s) 
will    submit    consolidated  
self-billed e-Invoice, 
adopting  either  (a)  or  (b) 
above    for    the    receipts 
issued by the said 
branch(es) or location(s) 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
22 
 
No Data field Details to be 
included by Buyer 
in consolidated 
self-billed e-Invoice 
Additional Remarks 
Note    that   for    any    method 
adopted   by   businesses,   the 
receipt reference number for 
each transaction are required 
to be included under this field 
in  the  consolidated self-billed  
e-Invoice 
Table 3.4 – Details required to be input by Buyer for issuance of consolidated self-billed  
e-Invoice 
Example 2 
Hibiscus Mart Sdn Bhd (Hibiscus Mart) is a small retail business that 
offers a wide range of food products and beverages via its two (2) 
branches  located  in  Penang  and  Kuala  Lumpur.  The  following 
represents the number of transactions with normal receipts issued 
alongside  with  the total sales  made  by  each  branch (with  no  
e-Invoice issued) in October: 
(a) Penang branch: 500 transactions amounting to RM25,000 
(b) Kuala   Lumpur branch: 2,000   transactions amounting   to 
RM65,000 
Within seven calendar (7) days after the end of October (i.e., by 7 
November),  Hibiscus  Mart  issues two  (2)  separate consolidated  
e-Invoice after aggregating the total sales from each branch i.e., one 
e-Invoice for  Penang  branch  and  another e-Invoice for  Kuala 
Lumpur  branch and  its corresponding  sales  for  each  branch. 
Hibiscus  Mart consolidated  the  sales by  presenting  each receipt 
number chain  as separate line  item. Note  that Hibiscus  Mart  is 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
23 
 
required to include all the receipt reference numbers that made up 
to the total sales in “Description” field for the relevant branch. 
   
Figure 3.3 – Example of visual representation of validated consolidated e-Invoice in PDF 
format (Kuala Lumpur branch) 
 
Meanwhile, Cer-Mart Sdn Bhd, a competitor of Hibiscus Mart, who 
has four (4) branches located at the same area as Hibiscus Mart as 
well as in Malacca and Ipoh, has issued a consolidated e-Invoice to 
record  its  sales  for  the  month  of  October. Sales  made  by  each 
branch  of  Cer-Mart  in  October (with  no e-Invoices issued) are 
outlined as follows: 
(a) Penang branch: 2,500 transactions amounting to RM75,000 
(b) Kuala   Lumpur   branch: 5,800   transactions   amounting   to 
RM125,000 
(c) Malacca branch: 1,300 transactions amounting to RM22,000 
(d) Ipoh branch: 1,850 transactions amounting to RM25,300 
Unlike Hibiscus Mart, Cer-Mart Sdn Bhd decides to consolidate its 
sales revenue of each branch in separate consolidated e-Invoices 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
24 
 
by presenting each receipt as a single line item. Note that Cer-Mart 
is  required  to  include all  the  receipt  reference  numbers that made 
up to the total sales in “Description” field. 
3.6.8 In any event, if Buyers require an e-Invoice after receiving a receipt 
from the Supplier, the Buyer can request for an e-Invoice from the 
Supplier  within  the  month  of  the  transaction.  The aforementioned 
timeframe allows the Supplier to have a cut-off for the receipt to be 
aggregated for into the consolidated e-Invoice.  
3.6.9 Buyers  are encouraged to  request  for  an e-Invoice as  soon  as 
possible after receiving the receipt to ensure that the request will be 
processed by Supplier in  a  timely  manner.  Conversely, Suppliers 
are  advised  to  ensure that  they will be  able  to create  and  submit  
e-Invoice to IRBM for validation as soon as possible to ensure that 
the Buyers’ request for e-Invoice can be fulfilled promptly.  
3.6.10 In summary, where a Buyer does not require for an e-Invoice to be 
issued, the steps involved for issuance of consolidated e-Invoice are 
as follows:  
Step 1:  Supplier     to     seek     confirmation    from Buyers if  
e-Invoice is required.  
Step 2:  If Buyers confirmed that no e-Invoice is required, Supplier 
would  continue  to  issue  receipt to  the Buyers  (same  as 
current business practice). 
Step 3:  Within  seven  (7)  calendar  days  after  end  of  the  month, 
Supplier  will  retrieve  the  details  of all the receipts that 
were   issued   for   the previous month   and   issue   a 
consolidated e-Invoice as proof of Supplier’s income.  
Step 4:   The Supplier will issue the consolidated e-Invoice as per 
the  required fields  as outlined in  Appendices 1 and  2 of 
e-Invoice Guideline.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
25 
 
 The process of issuing a consolidated e-Invoice is similar 
to  the e-Invoice workflow  as  discussed  in  Section  2.3  
(e-Invoice model  via  MyInvois  Portal)  and  Section  2.4  
(e-Invoice model via API), with the following exceptions:  
• Once the consolidated e-Invoice has been validated, 
IRBM will send notification to the Supplier only (i.e., 
no  notification will be  sent  to Buyer  as  this  is  an  
e-Invoice issued  to  general  public). Consequently, 
there  would  not  be  any  request  for  rejection  from 
Buyer.  
• The  validated e-Invoice will  serve  as the  Supplier’s 
proof of income. Hence, the validated e-Invoice is not 
required to be shared with Buyer.  
3.6.11 In relation to the consolidated e-Invoice, Supplier will be required to 
complete  the  required fields  as  outlined in  Appendices 1 and  2 of 
the e-Invoice Guideline and complete the Buyer’s details and certain 
transaction details using the following information: 
No Data field Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Buyer Supplier to input “General 
Public” in the consolidated  
e-Invoice 
2 Buyer’s TIN TIN of Buyer Supplier to input 
“EI00000000010” in the 
consolidated e-Invoice  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
26 
 
No Data field Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of registration 
/ identification 
number / passport 
number 
Supplier to input “NA” 
4 Buyer’s Address  Address of Buyer Supplier to input “NA” 
5 Buyer’s Contact 
Number  
Telephone number of 
Buyer 
Supplier to input “NA” 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Buyer  
Supplier to input “NA” 
7 Description of 
Product/ Services 
Details of products or 
services being billed 
for a transaction with 
Buyer 
IRBM  allows  the  Suppliers  to 
adopt one (or a combination) of 
the following methods:  
(a) Summary of each receipt is 
presented  as  separate  line 
items 
(b) List of    receipts (in    a 
continuous  receipt  number) 
is  presented  as  line  items 
(i.e., where there is a break 
of the receipt number chain, 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
27 
 
No Data field Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
the   next   chain   shall   be 
included as a new line item)  
(c) Branch(es) or   location(s) 
will    submit    consolidated  
e-Invoice,   adopting   either 
(a)   or   (b)   above   for   the 
receipts  issued  by  the  said 
branch(es) or location(s) 
Note    that   for    any    method 
adopted   by   businesses, the 
receipt reference number for 
each transaction are required 
to be included under this field 
in the consolidated e-Invoice 
Table 3.5 – Details to be included by Supplier for issuance of consolidated e-Invoice 
Example 3 
Wani, Lilian and Muthu (Buyers) dined at Restaurant XYZ (Supplier) 
on 8 July, 17 July and 21 July respectively. They did not request for 
an e-Invoice. As such, Restoran XYZ issued receipts to them. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
28 
 
 
Figure 3.4 – Examples of receipts to Buyers 
 
On 1 August  2025 (i.e.,  within  seven  (7)  calendar  days  after  the 
month end), Restoran XYZ aggregates all receipts for the month of 
July  and  issues a  consolidated e-Invoice and  transmits  it to IRBM 
for validation. 
Restoran  XYZ  is  not required  to  share  the  validated  consolidated 
e-Invoice with its Buyers as the consolidated e-Invoice is issued to 
General Public instead of specific Buyer. This is a proof of income 
for  Restoran  XYZ  and  its  Buyers  have  not  requested  for  any 
e-Invoice  to  be issued.  Below  is  an  example  of  the  consolidated  
e-Invoice in XML or JSON format issued by Restoran XYZ via API. 
Please note that the formats below are for illustration purposes only 
and  the  actual  formats  are  provided  in  the  Software  Development 
Kit (SDK). 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
29 
 
 
Figure 3.5 – Example of consolidated e-Invoice in XML format 
 
 
Figure 3.6 – Example of consolidated e-Invoice in JSON format 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
30 
 
Below  is an  example of  the visual  representation  of consolidated  
e-Invoice issued by Restoran XYZ (in PDF format) upon aggregating 
all receipts issued, which have been submitted to and validated by 
IRBM: 
 
Figure 3.7 – Example of visual representation of validated consolidated e-Invoice in PDF 
format 
Note: The above example is for illustration purposes only and are subject to changes. 
Example 4 
Same  facts  as  in  Example 3.  On  28  July  2025,  Muthu (Buyer) 
decided  to  request  for  an e-Invoice for  his  meal  (receipt  number: 
12442) on 21 July 2025.  
Muthu contacted Restoran  XYZ (Supplier) to  enquire on  how  to 
convert his receipt to an e-Invoice. As Restoran XYZ has provided 
a web portal / mobile application for this purpose, Muthu visited the 
web  portal /  mobile  application (refer Section  3.8 of  this e-Invoice 
Specific  Guideline for  more  details) and provided his personal 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
31 
 
details (refer Table 3.1 of this e-Invoice Specific Guideline) to obtain 
the e-Invoice.  
The request on the issuance of e-Invoice should be made by Muthu 
latest by 31 July 2025 (i.e., within the month of the transaction).  
 
Example 5 
Wendy (Buyer) purchased badminton rackets and shuttlecocks from 
Hari-Hari  Sukan  Sdn  Bhd (Supplier) on  30  September  2025.  She 
has  not  requested  for  an e-Invoice upon  check-out  as  she  was 
running late for her class.  
As  Wendy  was  swarmed  with  errands  and  coursework,  Wendy 
forgot to request for an e-Invoice from Hari-Hari Sukan Sdn Bhd’s 
web portal on the same day of her purchase. She only requested for 
an e-Invoice on 1 October 2025.  
In  view  that  Wendy  has  not  requested  for  an e-Invoice within  the 
month of the transaction (i.e., latest by end of 30 September 2025), 
Hari-Hari Sukan Sdn Bhd may deny Wendy’s request for issuance 
of e-Invoice for  her  purchase,  based  on  the  abovementioned 
guidance. 
Since  Hari-Hari  Sukan  Sdn  Bhd  has  issued  the  consolidated  
e-Invoice for  receipts  issued  in  the  month  of  September  2025,  
Hari-Hari Sukan Sdn Bhd rejected Wendy’s request accordingly.  
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
32 
 
3.7 Certain   activities that require e-Invoice to   be   issued for   each 
transaction (i.e., consolidation of e-Invoice is not allowed) 
3.7.1 For   the   purposes of e-Invoice,   taxpayers   undertaking   certain 
activities  or  transactions  are  required  to  issue e-Invoice for  each 
transaction with Buyers (refer to Table 3.6 of this e-Invoice Specific 
Guideline  for  exceptions).  In  other  words, such taxpayers will  be 
required  to  obtain  the  Buyer’s  details for   the   issuance of  
e-Invoice and will not be allowed to issue consolidated e-Invoice.  
3.7.2 Currently,   the activities   or   transactions   of   industries   where 
e-Invoice is required to be issued for each transaction are as follows:  
No Industry / Activity Types of activities / transactions where 
consolidated 
e-Invoice is not allowed 
1 Automotive  
 
Sale of any motor vehicle  
Note  that  motor  vehicle  refers  to  a  vehicle  of  any 
description,   propelled   by   means   of   mechanism 
contained  within  itself  and  constructed  or  adapted  to 
be  capable  of  being  used  on  roads,  and  includes  a 
trailer 
2 Aviation 
• Sale of flight ticket 
• Private charter 
3 Luxury  goods  and 
jewellery   
Details will be released in due course  
Note that this is currently being put on hold until such 
time when the details are made available. Taxpayers 
are  allowed  to  issue  consolidated  e-Invoice (in  the 
event  the  buyers  do  not  request  for  e-Invoice)  until 
further notice  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
33 
 
No Industry / Activity Types of activities / transactions where 
consolidated 
e-Invoice is not allowed 
4 Construction Construction    contractor    undertaking    construction 
contract,  as  defined  in  the  Income  Tax  (Construction 
Contracts) Regulations 2007  
5 Licensed betting 
and gaming  
Pay-out to winners for all betting and gaming activities 
Note  that  however  pay-out  to  winners  in  relation  to 
betting  and  gaming  (i)  in  casino and  (ii)  from  gaming 
machines  are  exempted  from e-Invoice until  further 
notice.  
6 Payment to agents 
/ dealers / 
distributors    
Payments made to agents, dealers or distributors  
Pursuant  to  Section  83A(4)  of  the  Income  Tax  Act 
1967,    “agent,  dealer  or  distributor”  refers  to  any 
person who  is  authorised  by  a  company  to act  as  its 
agent, dealer or distributor, and who receives payment 
(whether  in  monetary  form  or  otherwise)  from  the 
company arising from sales, transactions or schemes 
carried out by him as an agent, dealer or distributor 
7 All industries Any   single   transaction   with   a   value   exceeding 
RM10,000. 
Note that this will be effective starting 1 January 2026.   
8 Electricity Distribution, supply or sale of electricity  
Note that this will be effective starting 1 January 2026, 
and is only applicable to electricity service provider  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
34 
 
No Industry / Activity Types of activities / transactions where 
consolidated 
e-Invoice is not allowed 
9 Telecommunication Telecommunication  services  in  relation  to  postpaid 
plan  and  internet  subscription,  and  sale  of  electronic 
devices  
Note that this will be effective starting 1 January 2026.  
Table 3.6 – Activities that require e-Invoice to be issued for each transaction and 
consolidated e-Invoice would not be allowed 
 
3.7.3 IRBM recognises the potential challenges in getting e-Invoice to be 
issued to individual Buyers for the types of activities / transactions 
listed  in  Table  3.6. In  this  regard, concession to  individual  Buyers 
has  been  provided  by IRBM. Please  refer  to  Section  3.5.4  of  this  
e-Invoice Specific Guideline for further details.  
3.7.4 Notwithstanding the above, in relation to transactions with persons 
in Section 1.6.1 (a) of the e-Invoice Guideline, Suppliers are allowed 
to replace the Buyer’s details with the information stated in Table 
3.5 of this e-Invoice Specific Guideline. 
3.7.5 Suppliers are   required   to   maintain   supporting   documents   to 
substantiate that the said e-Invoice is related to persons mentioned 
in Section 1.6.1 of the e-Invoice Guideline.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
35 
 
3.8 Illustration of suppliers’ options for e-Invoice issuance to Buyers 
3.8.1 In facilitating the issuance of e-Invoice, there are various options for 
Suppliers  to  allow Buyers  to  request  for e-Invoice at Buyer’s 
convenience.  The examples provided below allow Suppliers  to 
accommodate Buyers’ request for an e-Invoice immediately after the 
transaction or at a later date, subject to Buyers’ preferences. 
3.8.2 Note that the examples described below are suggestions provided 
for Suppliers’ consideration. Suppliers are allowed to adopt and 
implement  any  method  that  are  not  mentioned  in  this  section  to 
comply  with  e-Invoice requirements and improve their customers’ 
experience. 
3.8.3 Figure 3.8 provides  an  overview  of some  of the methods for 
Suppliers  to  issue e-Invoice to Buyers,  be  it on  the  spot  or  post-
transaction.  
 
Figure 3.8 – Overview of methods for Suppliers to issue e-Invoice to Buyers 
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
36 
 
3.8.4 There are four (4) key scenarios to demonstrate the application of 
e-Invoice:   
1. Online  platform  (Retailer Web  Portal / Mobile  App):  The 
Retailer Web  Portal / Mobile  App  can  be  integrated  with  the 
IRBM MyInvois System to generate and validate the e-Invoice 
upon request.   
2. Retailers’ Point-of-sale  (POS)  system: The Retailer’s POS 
system  can  be  integrated  with  the  IRBM  MyInvois  System  to 
generate e-Invoice in real-time. Buyers are required to provide 
their  details  (refer  to Table 3.1 of  this e-Invoice Specific 
Guideline) to the Retailer (Supplier) at the point of purchase to 
generate the e-Invoice upon request. 
3. MyInvois Mobile App: Retailers without a Retailer App or POS 
system  can  utilise  the  MyInvois Mobile  App to  issue  the  
e-Invoice to Buyers upon  request.  Retailers (Suppliers) will 
have to input the details required to issue an e-Invoice. 
4. Post-Transaction  Request  via Online  Platform (Retailer 
Web Portal / Mobile App): Buyers who did not request for an 
e-Invoice at  the  point  of  purchase  can  still  request  for  one 
through  the  Web  Portal  or  Mobile  App  developed  by  the 
Retailers (Suppliers).  
3.8.5 The  following summarises the Buyer’s journey  based  on  the 
examples described.  
1. Online Platform (Retailer Web Portal / Mobile App) 
Figure 3.9 illustrates an  example  of  the issuance  process  of  
e-Invoice through  an  online  platform  (Retailer Web  Portal / 
Mobile App).  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
37 
 
 
Figure 3.9 – Issuance process of e-Invoice through online platform (Retailer Web Portal / 
Mobile App) 
 
Example Scenario:  
The Buyer drives to a nearby petrol station to refuel their vehicle. 
At  the  station,  the Buyer uses  the  Retailer  Mobile  App  to 
conveniently pay for the desired amount of petrol and request 
for e-Invoice. The Retailer Mobile App allows Buyer to choose 
either Personal or Corporate profile, which contains the required 
Buyer’s details for e-Invoice purposes (refer to Table 3.1 of this 
e-Invoice Specific Guideline). Upon confirmation of the details, 
the Retailer Mobile App sends a request to the MyInvois System 
to  generate e-Invoice.  In  less  than  two  (2)  seconds,  the  API 
validates  the e-Invoice and  promptly  responds  to  the  Retailer 
Mobile App with a validated e-Invoice. 
Once  the  validated e-Invoice is  received  from  IRBM,  the 
Retailer  Mobile  App  sends  a  push notification  to  alert  the app 
user to view the e-Invoice within the app.   
Simultaneously,  IRBM  notifies  the Buyer as  soon  as  the  
e-Invoice is validated.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
38 
 
This   seamless   process   ensures   a   smooth and   efficient 
experience for online platform users. 
 
2. Retailers’ Point-of-Sale (POS) System 
Figure 3.10 illustrates an  example  of the  issuance  process  of  
e-Invoice through Retailer’s POS system.  
 
Figure 3.10 – Issuance process of e-Invoice through Retailer’s POS system 
 
Example Scenario:  
The Buyer purchases groceries at a store and requests for an 
e-Invoice.  The  cashier scans the  purchases using the  POS 
System, as a business-as-usual-practice, and requests for the 
Buyer's details  (refer  to Table 3.1 of  this e-Invoice Specific 
Guideline). The interaction duration of this process may take up 
to sixty (60) seconds. The POS system will then send a request 
to the MyInvois System with the Buyer’s details to generate an 
e-Invoice. Once the e-Invoice is validated, the API responds to 
the POS with a validated e-Invoice in less than two (2) seconds. 
Simultaneously,  IRBM  notifies  the Buyer as  soon  as the  
e-Invoice is validated.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
39 
 
The POS system displays the validated e-Invoice to the cashier 
to  prove  successful  validation.  Finally,  the  cashier  shares  the 
printed validated  e-Invoice  with  the Buyer,  completing  the 
transaction process. 
  
3. MyInvois Mobile App  
Figure 3.11 illustrates an  example  of the  issuance  process  of  
e-Invoice through MyInvois Mobile App. 
 
Figure 3.11 – Issuance process of e-Invoice for transactions through MyInvois Mobile App 
 
Example Scenario:  
The Buyer purchases  food  from  a  stall  and  requests  for  an  
e-Invoice from  the  stall  owner.  The  stall  owner  inputs  the 
purchase  details  into  the  MyInvois Mobile App to draft the  
e-Invoice. Thereafter, stall  owner  requests the Buyer to  insert 
their details via the MyInvois Mobile App whilst the stall owner 
packs  the  food  requested  by Buyer.  Once  the Buyer has 
completed their details, the stall owner submits the e-Invoice to 
IRBM  for  validation. Once  the e-Invoice is  validated,  the 
MyInvois System responds to the MyInvois Mobile App with a 
validated e-Invoice, taking less than two (2) seconds.    

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
40 
 
Simultaneously,  IRBM  notifies  the Buyer as  soon  as the  
e-Invoice is validated.  
The MyInvois mobile app then displays the validated e-Invoice 
to the cashier as a proof of a successful validation. Finally, the 
stall  owner  shares  the  validated e-Invoice to  the Buyer via  
e-mail or mobile app, in which the Buyer may use the validated 
e-Invoice as proof of expense for tax purposes. 
 
4. Retailers’ Self-serve Web Portal / Mobile App (for e-Invoice 
that is not generated at the point of purchase / point of sale) 
Figure  3.12 illustrates  an  example  of  the  issuance  process  of  
e-Invoice that was not generated at the point of purchase / point 
of sale for transactions through Retailers’ Web Portal / mobile 
app. 
 
Figure 3.12 – Issuance process of e-Invoice through Retailers’ Web Portal / Mobile App 
 
Example Scenario:  
The Buyer purchased sports  equipment from  a  shop for 
personal consumption and a normal receipt has been issued by 
the  shop,  given  that  the Buyer has  not  requested  for  an  
e-Invoice during  check-out. The Buyer later visits  the  Web 
Portal or Mobile App created by the retailer. The Buyer inputs 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
41 
 
the receipt number as well as Buyer’s details (refer to Table 3.1 
of  this e-Invoice Specific  Guideline) into  the  Retailer’s Web 
Portal or Mobile App. Upon input, the Retailer’s Web Portal or 
Mobile  App  sends  a  request  to  the  MyInvois  System  with  the 
Buyer’s details to  generate  the e-Invoice for  validation.  The 
MyInvois  System responds  to  the  Retailer’s Web  Portal  or 
Mobile  App  with  the  validated e-Invoice in  less  than  two  (2) 
seconds.  
Simultaneously,  IRBM  notifies  the Buyer as  soon  as  the  
e-Invoice is validated.  
The  Retailer’s Web  Portal  or  Mobile  App  allows  the Buyer to 
download  or e-mail  the e-Invoice to  their  own inbox,  which 
allows  the Buyer to  use the  validated e-Invoice as  proof  of 
expense for tax purposes.  
 
 
 
 
 
 
 
 
 
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
42 
 
4. STATEMENTS OR BILLS ON A PERIODIC BASIS 
4.1 Currently, certain businesses / industries / sectors practice the issuance of 
statements  or  bills  to  record  multiple  transactions  between  Supplier  and 
Buyer  (e.g.,  businesses, customers,  etc.)  over  a  set  period of  time  (e.g., 
monthly, bi-monthly, quarterly, bi-annually, annually), instead of issuance 
of  individual  invoices  for  each  transaction.  These  industries /  sectors 
include but not limited to: 
(a) Digital / Electronic payment 
(b) Financial services, including banking and financial institutions 
(c) Healthcare  
(d) Insurance 
(e) Stockbroking  
(f) Telecommunications  
4.2 Issuance of e-Invoice to Buyer   
4.2.1 Currently, businesses  (Supplier) who issue  statements  /  bills  to 
customers (Buyer) would have included the amount owed by Buyers 
to  the  Supplier  (e.g.,  transaction  charges).  The  statements /  bills 
may also include adjustments to prior period’s statements / bills and 
payments / credit to Buyers (e.g., rebate).  
4.2.2 Upon  the  implementation  of  e-Invoice,  Suppliers  are  required  to 
issue e-Invoice as proof of income and/or proof of expense for items 
that are shown in the statement / bill. In other words, Suppliers are 
allowed to include the amount owing by Buyers to the Supplier as 
well as payment / credit to Buyers in the same e-Invoice. 
4.2.3 To minimise business disruption, IRBM allows Suppliers that issue 
statement / bill on a periodic basis to issue e-Invoice in the format of 
XML  or  JSON  for  IRBM’s  validation  and  convert  the  validated  
e-Invoice into visual presentation in the form of statements / bills, to 
be sent to Buyers. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
43 
 
4.2.4 For the purpose of transmitting e-Invoice in XML / JSON file to IRBM, 
the e-Invoice would  only  be  limited  to  the  income  and  expense  of 
the Supplier.  
4.2.5 Supplier  is  allowed  to  create  and  submit e-Invoice for  IRBM’s 
validation  in  accordance  with  their  respective  issuance  frequency 
(e.g., monthly, bi-monthly, quarterly, bi-annually, annually). 
4.2.6 The  steps  involved  for  issuance  of  an e-Invoice to  Buyer  are  as 
follows:  
Step 1:  Supplier     seek     confirmation     from     Buyer     if     an  
e-Invoice is required.  
Step 2:  If  the  Buyer  confirmed  that  an e-Invoice is  required,  the 
Buyer  is  then  required  to  furnish  the  Supplier  with  the 
required    information    to    facilitate    the    issuance    of  
e-Invoice (refer Table 3.1 of   this   e-Invoice   Specific 
Guideline for further details).   
Step 3:  The  Supplier  is  required  to  complete  the  remaining 
required  fields  as  outlined  in  Appendices  1  and  2  of  
e-Invoice Guideline.   
 The  process  of  issuing  an e-Invoice is  similar  to  the  
e-Invoice workflow    as    discussed    in    Section    2.3  
(e-Invoice model  via  MyInvois  Portal)  and  Section  2.4 
(e-Invoice model via API) of the e-Invoice Guideline. 
Step 4:  The  validated e-Invoice can be used as the Supplier’s 
proof  of  income and/or  expense while  the  validated  
e-Invoice that  is  being  visually  presented  in  the  form  of 
statements / bills to Buyer can be used as Buyer’s proof 
of  expense and/or  income,  to  substantiate  a  particular 
transaction for tax purposes.   

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
44 
 
4.2.7 In facilitating a more efficient e-Invoice issuance process as well as 
to ease the burden of individuals in providing TIN and identification 
number details, IRBM provides a concession to individuals. Please 
refer  to Section  3.5.4 to  Section  3.5.7 of  this  e-Invoice  Specific 
Guideline for further details. 
4.2.8 The information required to be included in the e-Invoice are as per 
the  required  data  fields  outlined  in  Appendices  1  and  2  of  the 
e-Invoice Guideline. The following details would assist the Supplier 
in issuing the e-Invoice:   
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
1 Buyer’s Name Name of Buyer  For business: Name of business  
For Malaysian individual: Full 
name as per MyKad / MyTentera 
For non-Malaysian individual: 
Full name as per passport / MyPR 
/ MyKAS  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
45 
 
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
2 Buyer’s TIN TIN of Buyer  For Malaysian Businesses 
Supplier to input Buyer’s TIN and 
business registration number 
For Foreign Businesses 
Where available, Supplier to input 
Buyer’s TIN and business 
registration number 
Where TIN is not available or not 
provided, Supplier to input 
“EI00000000020” for Buyer 
Where business registration 
number is not available or not 
provided, Supplier to input “NA” 
For Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only  
iii. Option 3: Both TIN and MyKad 
/ MyTentera identification 
number  
For non-Malaysian individuals  
i. Option 1: TIN only 
ii. Option 2: Both TIN and 
passport number / MyPR / 
MyKAS identification number 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration 
/ identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
46 
 
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
For  clarity,  (i)  refers  to  the  TIN 
assigned by IRBM. In the event that 
the  non-Malaysian  individual  does 
not  have  a  TIN,  Supplier  may  use 
the   general   TIN   (as   listed   in 
Appendix    1    of    this    e-Invoice 
Specific  Guideline),  along  with  the 
passport number / MyPR / MyKAS 
identification  number of  the  said 
individual 
4 Buyer’s 
Address 
Address of Buyer  Supplier to input business 
address (for business) / 
residential address (for 
individual) of Buyer  
5 Buyer’s 
Contact 
Number  
Telephone number of 
Buyer 
Supplier to input contact number 
of Buyer 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Buyer 
Where applicable, Supplier to input 
Buyer’s SST registration number  
Supplier to input “NA” if such 
information is not applicable, not 
available or not provided 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
47 
 
No Data field  Details to be 
included by 
Supplier in  
e-Invoice 
Additional Remarks 
7 e-Invoice 
Code / 
Number  
Reference number of 
the statement issued 
by Supplier to Buyer 
(e.g., business / 
individual) 
Supplier to input the reference 
number of the statement / bill 
issued to Buyer (e.g., business / 
individual) 
Table 4.1 – Details to be input by Supplier for issuance of e-Invoice to Buyer 
(translate into statement / bill format for visual presentation) 
 
Example 6 
Jenny  has  been  a  loyal  subscriber  of  Delca  Telco  Sdn  Bhd’s 
postpaid plan for years. In appreciation of the Jenny’s loyalty, Delca 
Telco Sdn Bhd has decided to provide a RM10 monthly rebate for a 
period of 24 months.  
Delca Telco Sdn Bhd is required to include the RM10 monthly rebate 
in the e-Invoice, where it will be visually represented in the format of 
statement  /  bill, issued  to  Jenny,  along  with  the  monthly  plan 
commitment fee payable by Jenny. 
 
Example 7 
Envisage Telco Sdn Bhd (ETSB) issues a monthly statement to their 
customers  to  bill  them  for  telecommunication  charges  incurred  for 
the  previous  month.  Rajesh,  one  of  ETSB’s  customers  has 
requested for an e-Invoice as a proof of expense for tax purposes. 
ETSB has created and submitted e-Invoice to IRBM for validation. 
Once  validated,  ETSB  has  converted  the e-Invoice into  visual 
presentation  form  of  statement  before  sharing  the e-Invoice with 
Rajesh.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
48 
 
Figure 4.1 provides   an   example   of   a   visual   presentation   of  
e-Invoice in the form of statement. 
 
Figure 4.1 – Example of visual presentation of validated e-Invoice in statement form 
(in PDF format) 
Note: The  above  examples  are  for illustration  purposes  only  and  are  subject  to 
changes. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
49 
 
4.3 Issuance  of  consolidated e-Invoice for  Buyers  who  do  not  require  
e-Invoice  
4.3.1 In the case where a Buyer does not require an e-Invoice, Supplier 
will  issue  a  normal  statement /  bill  to  Buyer  (same  as current 
business practice, in which such information included in statement / 
bill will not be required to submit for IRBM’s validation).  
4.3.2 Supplier  is  allowed  to  aggregate  statements /  bills  in  accordance 
with  the  current  issuance period for  statements /  bills  for  the 
respective businesses.  
4.3.3 Upon aggregation of statements / bills, Supplier is required to create 
and  submit  a  consolidated e-Invoice to  IRBM  for  validation,  within 
seven (7) calendar days after the end of the billing month.  
4.3.4 In summary, where a Buyer does not require for an e-Invoice to be 
issued,   the   steps   involved   for   issuance   of   a   consolidated  
e-Invoice are as follows:  
Step 1:  Supplier     seek     confirmation     from     Buyer     if     an  
e-Invoice is required.  
Step 2:  If  the  Buyer  confirmed  that  no e-Invoice is  required, 
Supplier  would  continue  to  issue  statement /  bill  to  the 
Buyer (same as current business practice).  
 Step 3:  Within  seven  (7)  calendar  days  after  end  of  the billing 
month, Supplier will retrieve all the statements / bills that 
were issued  for  the  previous  billing month and  issue  a 
consolidated e-Invoice as proof of Supplier’s income and 
expense.  
Step 4:  The Supplier will issue the consolidated e-Invoice as per 
the  required fields  as outlined  in  Appendices  1 and  2  of 
e-Invoice Guideline.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
50 
 
 The process of issuing a consolidated e-Invoice is similar 
to  the e-Invoice workflow  as  discussed  in  Section  2.3 
(e-Invoice model  via  MyInvois  Portal)  and  Section  2.4 
(e-Invoice model via API) with the following exception:  
• Once the consolidated e-Invoice has been validated, 
IRBM will send notification to the Supplier only (i.e., 
no  notification  will  be  sent  to  Buyer  as  this  is  an 
e-Invoice issued  to  general  public).  Consequently, 
there  would  not  be  any  request  for  rejection  from 
Buyer.  
4.3.5 The validated e-Invoice will serve as the Supplier’s proof of income 
and  expense.  Hence, the  validated e-Invoice is  not  required  to be 
shared with Buyer.  
4.3.6 The   information   required   to   be   included   in   the   consolidated  
e-Invoice are as per the required data fields outlined in Appendices 
1 and 2 of the e-Invoice Guideline. The following details would assist 
the Supplier in issuing the consolidated e-Invoice:  
No Data field  Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Buyer Supplier to input “General 
Public” in the consolidated  
e-Invoice 
2 Buyer’s TIN TIN of Buyer Supplier to input 
“EI00000000010” in the 
consolidated e-Invoice  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
51 
 
No Data field  Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of 
registration / 
identification 
number / passport 
number  
Supplier to input “NA” 
4 Buyer’s Address  Address of Buyer Supplier to input “NA” 
5 Buyer’s Contact 
Number  
Telephone number 
of Buyer 
Supplier to input “NA” 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Buyer  
Supplier to input “NA” 
7 Description of 
Product / 
Services 
Details of products 
or services being 
billed for as a result 
of commercial 
transaction with 
Buyers 
IRBM   allows   the   Suppliers   to 
adopt  one  (or  a combination)  of 
the following methods:  
(a) Summary of each statement / 
bill is  presented  as  separate 
line items 
(b) List of statements / bills (in a 
continuous  statements /  bills 
reference number) is 
presented  as  line  items  (i.e., 
where  there  is  a  break  of 
statements /  billed  reference 
number chain, the next chain 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
52 
 
No Data field  Details to be 
included by 
Supplier in  
consolidated  
e-Invoice 
Additional Remarks 
shall  be included  as  a  new 
line item)  
(c) Branch(es) or  location(s) will 
submit consolidated  
e-Invoice,  adopting  either  (a) 
or (b) above for the 
statements /  bills issued  by 
the     said     branch(es) or 
location(s) 
Note that for any method adopted 
by  businesses,  the statement / 
bill reference number for each 
transaction  are  required  to  be 
included under this field in the 
consolidated e-Invoice  
Table 4.2 – Details to be input by Supplier for issuance of consolidated e-Invoice 
(aggregation of statements / bills) 
 
4.3.7 Note  that  regulated  industries  e.g.,  financial  institutions,  payment 
systems and other relevant entities are not required to disclose the 
statement / bill reference number in the consolidated e-Invoice. 
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
53 
 
5. DISBURSEMENT OR REIMBURSEMENT 
5.1 Reimbursements refers to out-of-pocket expenses incurred by the payee 
in the course of rendering services or sale of goods to the payer (i.e., Buyer), 
which are subsequently reimbursed by the payer. Such expenses include 
the cost of airfare, travelling, accommodation, telephone and photocopying 
charges.  
5.2 Disbursements  are  out-of-pocket  expenses  incurred  by  the  payer  (i.e., 
buyer)  and  paid  to a  third  party (on  behalf  of  the payer)  by  the  payee in 
connection  with  services  rendered or  sale  of  goods by  the  payee  to  the 
payer.  
5.3 Currently, Suppliers would include the reimbursement and disbursement in 
their invoices to the buyers.  
5.4 The following terminologies have been adopted to ease the understanding 
of the scenario discussion in Section 5.5 and 5.6.  
(a) ‘Supplier 1’ represents the first supplier; and 
(b) ‘Supplier 2’ represents the third party / intermediary.  
5.5 Scenario 1: Supplier 1 issues e-Invoice to Buyer 
 
Figure 5.1 – Scenario where Supplier 1 issues e-Invoice to Buyer 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
54 
 
5.5.1 Supplier 1 issues an e-Invoice directly to Buyer for the goods sold 
or  services  rendered  to Buyer. Subsequently, Supplier  2 made 
payment to Supplier 1 to settle the said e-Invoice issued to Buyer, 
in accordance with the arrangement agreed between Supplier 2 and 
Buyer.  
5.5.2 Accordingly, Supplier 2 will issue an e-Invoice to Buyer for the goods 
sold or service rendered by Supplier 2.  
5.5.3 As Supplier 1 has issued an e-Invoice to Buyer, the same should not 
be included in the e-Invoice issued by Supplier 2 to Buyer. 
5.5.4 The  steps  involved  for the issuance  of e-Invoice for the  scenario 
above are as follows:  
Step 1:  Supplier  2 entered  into  an  agreement  with Buyer for 
supply of goods  or provision  of services.  As  part  of  the 
arrangement, Supplier 2 will make payment on behalf of 
Buyer to settle any expenses incurred during the contract 
period.   
Step 2:  Upon concluding  a  sale  or  transaction, Supplier  1  will 
issue an e-Invoice directly to the Buyer as per the required 
fields    as    outlined in    Appendices 1 and    2 of  
e-Invoice Guideline and submit it to IRBM for validation.  
 The  process  of  issuing  an e-Invoice is  similar  to  the  
e-Invoice workflow    as    discussed    in    Section    2.3  
(e-Invoice model  via  MyInvois  Portal)  and  Section  2.4  
(e-Invoice model via API) of e-Invoice Guideline. 
Step 3:  Supplier  2  will  make  payment  on  behalf of Buyer  to 
Supplier 1 to settle the outstanding amount. Supplier 1 will 
issue payment proof to Supplier 2 for the settlement.  
Step 4:   Supplier  2  will  issue  an e-Invoice to  the Buyer for  the 
goods  supplied  or  services  rendered by  Supplier  2 to 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
55 
 
Buyer (the process of issuing e-Invoice is similar to Step 
2 above). Supplier 2 should neither include the payment 
made on  behalf  of Buyer in Supplier 2’s e-Invoice nor 
issue an additional e-Invoice for it.  
 Supplier 2 provides payment proof to the Buyer to recover 
the payment made to Supplier 1 on behalf of the Buyer. 
 
Example 8  
Perniagaan Adibah appointed an event planner to launch their latest 
product on 9 October 2024. On 1 October 2024, the event planner 
sourced  for  flowers  from a florist for decoration.  The  florist has 
issued  an e-Invoice directly to  Perniagaan  Adibah for  the  flowers 
supplied on 7 October 2024.  
As agreed in the service contract, event planner will make payment 
on  behalf of  Perniagaan  Adibah  to  settle  any  outstanding  amount 
incurred  and recover  the  same from  Perniagaan  Adibah  at a  later 
date. On  8  October  2024, the  event  planner  paid  RM4,000  to  the 
florist on behalf of Perniagaan Adibah for the flowers purchased.  
On 12  October  2024,  the  event  planner  issues  an e-Invoice to 
Perniagaan Adibah for services rendered. The event planner should 
only include the service fee in the e-Invoice to Perniagaan Adibah, 
along with the other charges. However, the RM4,000 paid on behalf 
should not be included in the event planner’s e-Invoice.  
For  the  purposes  of  recovering  the RM4,000 paid  on  behalf  of 
Perniagaan Adibah to the florist, the event planner provides a copy 
of the payment proof to Perniagaan Adibah.   
 
 
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
56 
 
Example 9 
DEF Company Sdn Bhd (DEF) is a subsidiary of ABC Company Sdn 
Bhd (ABC). On 1 September 2024, HR Hiring Sdn Bhd has provided 
recruitment  services  to  DEF amounting  to RM10,000 and an 
e-Invoice has been issued by HR Hiring Sdn Bhd to DEF.   
As  DEF  is  tied  on  cashflow, ABC  has  paid,  on  behalf  of  DEF, 
RM10,000 to HR Hiring Sdn Bhd and records an amount owing from 
DEF  in  its  accounting books. Subsequently,  DEF  has  repaid the 
amount owing to ABC (i.e., RM10,000) on 31 December 2024.  
There is no requirement for an e-Invoice to be issued by:  
(a) HR Hiring Sdn Bhd to ABC; and 
(b) ABC to DEF,  
as there is no sale or transaction being concluded between the said 
parties.  
In  any  event  if  ABC  charges certain intercompany fee  to  DEF  for 
payment made on behalf arrangement, an e-Invoice is required to 
be issued by ABC to DEF for proof of income (for ABC) and proof of 
expense (for DEF).  
5.6 Scenario 2: Supplier 1 issues e-Invoice to Supplier 2 
 
Figure 5.2 – Scenario where Supplier 1 issues e-Invoice to Supplier 2 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
57 
 
5.6.1 Supplier 1  issues an e-Invoice to Supplier  2 for  the  goods  sold  or 
services rendered intended for Buyer. Supplier 2 makes payment to 
Supplier 1, according to the arrangement agreed between Supplier 
2 and Buyer.  
5.6.2 Accordingly, Supplier 2 will issue a separate e-Invoice to Buyer to 
record  the  amount  incurred  on  behalf  of Buyer  alongside  with  the 
goods sold or service rendered by Supplier 2, in which these will be 
presented as separate line items in the e-Invoice (i.e., one line for 
service   fee   charges   and   another   line   for disbursement / 
reimbursement).  
5.6.3 The steps involved for issuance of e-Invoice for the scenario above 
are as follows:  
Step 1:  Supplier  2  entered  into  an  agreement  with Buyer  for 
supply  of  goods  or  provision  of  services.  As  part  of  the 
arrangement, Supplier 2 will make payment on behalf of 
Buyer to settle any expenses incurred during the contract 
period.  
Step 2:  Upon  concluding  a  sale  or  transaction, Supplier  1  will 
issue an e-Invoice to Supplier 2 as per the required fields 
as outlined in Appendices 1 and 2 of e-Invoice Guideline 
and submit it to IRBM for validation.  
 The process of issuing  an e-Invoice is  similar  to  the  
e-Invoice workflow as discussed in Section 2.3 (e-Invoice 
model  via  MyInvois  Portal)  and  Section  2.4  (e-Invoice 
model via API) of e-Invoice Guideline. 
Step 3:  Supplier 2 will make payment to Supplier 1. Supplier 1 will 
issue payment proof to Supplier 2 for the settlement.  
Step 4:  Supplier 2 will issue an e-Invoice to the Buyer (similar as 
per Step 2 above) to record the amount incurred on behalf 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
58 
 
of Buyer (e.g., disbursement / reimbursement) alongside 
with  the  goods  sold  or  service  rendered by Supplier 2, 
which  will  be  presented  as  separate  line  items  in  the 
e-Invoice.  
   
Example 10 
Same facts as in Example 8, except that now the event planner has 
incurred  RM30,000 to  rent  a hotel  banquet  hall for the product 
launch event. An e-Invoice has been issued by the hotel to the event 
planner. 
The  event planner will  issue  an e-Invoice to  charge  Perniagaan 
Adibah for the service provided as well as to recover the rental of 
hotel  banquet  hall. Separate  line  items  will  be  presented  in  the 
e-Invoice issued by the event planner for the service fee and hotel 
banquet hall rental.  
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
59 
 
6. EMPLOYMENT PERQUISITES AND BENEFITS  
6.1 An  individual  under  a  contract  of  service  (i.e.,  employment)  may  be 
provided with employee benefits by his / her employer. Employee benefits 
may include benefits in cash or in kind that are received by an employee 
from  the  employer  or  third  parties  in  respect  of  having  or  exercising  the 
employment, such as:  
(a) Employees’ pecuniary liabilities (e.g., utility bills, parking fees, and car 
maintenance charges) 
(b) Club membership 
(c) Gym membership 
(d) Professional subscriptions  
(e) Allowances  (e.g.,  travelling  allowance,  petrol allowance  or  toll  rate, 
parking rate / allowance, meal allowance) 
6.2 Currently, employees are required to submit their expense claims to their 
employers.  
6.3 Where employees  are  allowed  to  claim  such  expenses  from  his /  her 
employer, employees are  required  to  prove  the  authenticity  of  such 
expense   with supporting   documents   (e.g., bills, receipts, invoices, 
statements,  payment  slips,  etc.).  As  such,  the expenses claimed by 
employees would be recorded as the employer’s expense and reported for 
tax purposes.  
6.4 Upon implementation of e-Invoice, when a sale or transaction is concluded, 
employees are required to request for the e-Invoices to be issued to their 
employer for proof of expense, to the extent possible.  
6.5 IRBM recognises the potential challenges in getting e-Invoice to be issued 
in the name of the employer (as Buyer). In this regard, the IRBM provides 
the following concession: 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
60 
 
(a) Businesses will be allowed to proceed with the use of e-Invoice issued 
in the name of the employee or existing supporting documentation to 
support the  particular transactions  as  proof  of  expense for  tax 
purposes. 
(b) In  the  event  where  payment  in  relation  to  perquisite  and  benefit  is 
made  to  foreign  suppliers, both employer and  employee  are not 
required  to  issue a self-billed e-Invoice. As  such,  IRBM  will  accept 
foreign  supplier’s receipts / bills / invoices or existing  supporting 
documentation as a proof of expense.   
This exception  will  only  be  applicable  if  the  perquisites  and  benefits  are 
clearly stated in the employer’s policy. 
6.6 The steps involved for the scenario above are as follows:  
Step 1:  For  any  expense  claim  to  be  made  by  employees, employees 
should first seek   confirmation   with   the Supplier if   the  
e-Invoice can be issued in the name of the employer (as Buyer).   
Step 2:  Where an e-Invoice can   be   issued   to   the   employer,   the 
employees should provide the details of the employer in order for 
the e-Invoice to be issued to the employer.  
 Where Step 1 is not possible, the employees should provide their 
personal details to the Supplier for issuance of e-Invoice to the 
employee (as Buyer). 
Step 3:  Payment  will  be  made  by  the  employees upon  receiving  the  
validated e-Invoice from the Supplier.  
Step 4:  Employees submit their expense   claim   by   submitting   the 
validated e-Invoice (be it issued in the name of the employer or 
employee) as supporting document to the employer.  
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
61 
 
7. CERTAIN EXPENSES INCURRED BY EMPLOYEE ON 
BEHALF OF THE EMPLOYER 
7.1 An  individual  under  a  contract  of  service  (i.e.,  employment)  may  incur 
certain expenses on behalf of the employer. Such expenses include, but 
not  limited  to, accommodation, toll,  mileage,  parking,  telecommunication 
expenses, expenses incurred in a foreign country.  
7.2 Currently, employees are required to submit their expense claims to their 
employers  by  proving the  authenticity of  such  expense  with  supporting 
documents (e.g., bills, receipts, invoices, statements, payment slips, etc.). 
7.3 Upon implementation of e-Invoice, when a sale or transaction is concluded, 
employees are required to request for the e-Invoices to be issued to their 
employer for proof of expense, to the extent possible.  
7.4 However, IRBM acknowledges that there may be difficulties in getting the 
e-Invoice to be issued in the name of the employer (as Buyer) for certain 
expenses. In this regard, the IRBM provides the following concession: 
(a) Businesses will be allowed to proceed with the use of e-Invoice issued 
in the name of the employee or existing supporting documentation to 
support  the  particular  transactions  as  proof  of  expense  for  tax 
purposes. 
(b) In the  event  where employees paid for expenses incurred overseas, 
both  employer  and  employee  are  not  required  to  issue  a  self-billed  
e-Invoice.  As  such,  IRBM  will  accept the  foreign bills /  receipts / 
invoices or existing supporting documentation as a proof of expense.  
7.5 Note  that  this exception  will  only  be  applicable  if  the  employer  is  able  to 
prove that the employee is acting on the employer’s behalf in incurring the 
expenses. 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
62 
 
7.6 The steps involved for the scenario above are as follows:  
Step 1:  For  any  expense  claim  to  be  made  by  employees,  employees 
should   first   seek   confirmation   with   the Supplier   if   the  
e-Invoice can be issued in the name of the employer (as Buyer).   
Step 2:  Where   an e-Invoice can   be   issued   to   the   employer,   the 
employees should provide the details of the employer in order for 
the e-Invoice to be issued to the employer.  
 Where Step 1 is not possible, the employees should provide their 
individual details to the Supplier for issuance of e-Invoice to the 
employee (as Buyer). 
Step 3:  Payment  will  be  made  by  the  employees  upon  receiving  the  
validated e-Invoice from the Supplier.  
Step 4: Employees submit   their   expense   claim   by   submitting   the 
validated e-Invoice (be it issued in the name of the employer or 
employee) as supporting document to the employer.  
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
63 
 
8. SELF-BILLED E-INVOICE 
8.1 When a sale or transaction is concluded, an e-Invoice is issued by Supplier 
to recognise income of the Supplier (proof of income) and as a record for 
purchases made / spending by Buyer (proof of expense).  
8.2 However, there are certain circumstances where another party (other than 
the Supplier) will be required to issue a self-billed e-Invoice. 
8.3 For e-Invoice purposes, Buyer  shall  issue self-billed e-Invoices for  the 
following transactions:  
(a) Payment to agents, dealers, distributors, etc. (refer to Section 9 of this 
e-Invoice Specific Guideline for further details) 
(b) Goods sold or services rendered by foreign suppliers (refer to Section 
10.4 of this e-Invoice Specific Guideline for further details)  
(c) Profit distribution (e.g., dividend distribution) (refer to Section 11 of this 
e-Invoice Specific Guideline for further details)  
(d) Electronic commerce (“e-commerce”) transactions (refer to Section 14 
of this e-Invoice Specific Guideline for further details) 
(e) Pay-out to all betting and gaming winners
1 
 
(f) Transactions  with individuals (who  are  not  conducting  a  business) 
(applicable only if the other self-billed circumstances are not applicable) 
(g) Interest payment, except: 
i. Businesses (e.g., financial institutions, etc.) that charge interest to 
public  at  large  (regardless of  whether  they  are businesses  or 
individuals); 
ii. Interest payment made by employee to employer; 
                                                           
1
 Pay-outs to winners in relation to betting and gaming (i) in casino and (ii) from gaming 
machines (refer to Table 3.6 of this e-Invoice Specific Guideline) are exempted from 
self-billed e-Invoice until further notice.  
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
64 
 
iii. Interest payment made by foreign payor to Malaysian taxpayers;  
iv. Interest  payment to  a  related  company  (as  defined  in  the  Income 
Tax  Act  1967)  incorporated  in  Malaysia  who  provides  centralised 
treasury services to its related companies
2
; and 
v. Late payment interest or charges imposed by Malaysian taxpayers. 
Note  that  the  Supplier  is  required  to  issue  e-Invoice for  exceptions 
mentioned above.  
(h) Claim, compensation or benefit payments from the insurance business 
of an insurer 
(i) Payment   in   relation   to   capital   reduction,   share   /   capital   /   unit 
redemption, share buyback, return of capital or liquidation proceeds. 
Note  that  the  Buyer  is  required  to  issue  self-billed  e-Invoice  in 
accordance with the following timing of issuance
3
: 
If  there  is  a  written 
agreement 
• If   no   approval   is   required   from   the 
government or state government, the date 
of   issuance   will   be   the   date   of   the 
agreement 
• If     approval     is     required     from     the 
government or state government, the date 
of   issuance   will   be   the   date   of   such 
approval, or  if  the approval  is  conditional, 
the  date  of  issuance  will  be  the date  in 
which the last condition is satisfied 
If there is no written 
agreement 
• Date of completion 
  
                                                           
2
 Considering that taxpayers may require additional time to configure their systems, 
taxpayers are allowed to implement this requirement latest by 1 July 2025.   
3
 
 Please note that the timing of issuance is only applicable for the transaction stated 
under Section 8.3 (i) of this e-Invoice Specific Guideline. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
65 
 
Example 11 
Ahmad is a full-time employee of Syarikat ABC. On 1 November 2024, 
he decided to sell his gaming console to IT Computer Sdn Bhd.  
As Ahmad  is an  individual  who  is  not  conducting  a  business, IT 
Computer Sdn Bhd is required to assume the role of Supplier and issue 
self-billed e-Invoice for the purchase of gaming console from Ahmad.  
 
Example 12 
Saloma, a primary school teacher, has inherited a vacant land from her 
grandparents. Since then, she receives income from renting the vacant 
land   to   XYZ   Enterprise. Note   that   Saloma   does   not   provide 
maintenance or support services for the land rented to XYZ Enterprise.  
As  Saloma is  an  individual  who  is  not  conducting  a  business,  XYZ 
Enterprise  is  required  to  assume  the  role  of Supplier  and  issue  a  
self-billed e-Invoice to Saloma.  
 
Example 13 
Farhan  is  an  employee  of  Perniagaan  Nusa  Kasih  where  he  is 
generally responsible to arrange for client meetings.  
On 29 May 2025, Farhan has purchased cupcakes from Mak Cik Rosa, 
who runs a small roadside stall nearby Perniagaan Nusa Kasih, as tea-
time  refreshment  for  a  client  meeting.  Mak  Cik  Rosa  has  provided 
Farhan a handwritten receipt as she has yet to be mandated to issue 
e-Invoice. 
Perniagaan Nusa Kasih is not required and not allowed to issue self-
billed  e-Invoice  for  the  said  expense  and  may  continue  to  use  the 
handwritten receipt provided by Mak Cik Rosa to substantiate for tax 
purposes.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
66 
 
Upon  full  implementation  of  e-Invoice,  Mak  Cik  Rosa  is  required  to 
issue  e-Invoice  for  all  of  her  sales  (either  individual  or  consolidated 
e-Invoice) and submit for IRBM’s validation.  
 
Example 14 
Best Mesra Sdn Bhd has rented a new office space which is owned by 
three (3) individuals, namely Kamal, Cheng and Sunita.  
From  Best  Mesra  Sdn  Bhd’s  discussions  with  the  landlords,  Best 
Mesra Sdn Bhd understands that the landlords are individuals who do 
not conduct business.  
As  such,  Best  Mesra  Sdn  Bhd  is required  to  assume  the  role  of 
Supplier  and  issue  separate  self-billed  e-Invoices  to  each  individual 
property owners based on their agreed proportion. 
 
Example 15 
Adi  has  secured  a  mortgage  loan  from  Bank  Primaras,  where  he  is 
subjected  to  a  fixed  annual  interest  rate  of  3.75%.  Adi  will  make  an 
instalment  payment  to  Bank  Primaras  on  a  monthly  basis.  This 
instalment is made up of two components: interest and principal.  
In  view  that  Adi  is  an  individual  making  interest  payment  on  loan  to 
bank,  Bank  Primaras is  required  to  issue  e-Invoice  to  Adi  for  the 
instalment  in  relation  to  mortgage  loan,  in  accordance  with  the 
exception  provided  under  Section  8.3(g)(i)  of  this  e-Invoice  Specific 
Guideline. 
Bank Primaras is required to issue the e-Invoice in XML / JSON format 
for the purposes of IRBM validation. Thereafter, Bank Primaras may 
generate a visual representation of the validated e-Invoice (in the form 
of statements / bills) for the purpose of sharing the e-Invoice with Adi.  
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
67 
 
Example 16 
Cee  Sdn  Bhd  has  obtained  RM10  million  loan  for  business  purpose 
from  its  holding  company,  Beeny  Sdn  Bhd. Beeny  Sdn  Bhd  charges 
an arm’s length interest  to  Cee  Sdn  Bhd.  Beeny  Sdn  Bhd  is  not  an 
entity providing centralised treasury services to its group of companies. 
In line with Section 8.3(g) of this e-Invoice Specific Guideline, as Beeny 
Sdn Bhd is not an entity providing centralised treasury services to its 
group, Cee  Sdn  Bhd  is  required  to  assume  the  role  of  Supplier  and 
issue self-billed e-Invoice for the interest paid to Beeny Sdn Bhd. 
 
Example 17  
Same facts as in Example 16, except that now Cee Sdn Bhd has now 
obtained  the  loan  from  Yee  Sdn  Bhd,  a  related  company  that  offers 
centralised treasury services to Beeny group of companies. 
As  Yee  Sdn  Bhd  is  a  Malaysian  company  providing  centralised 
treasury  services  to  its  group,  Yee  Sdn  Bhd  is  required  to  issue  an  
e-Invoice to Cee Sdn Bhd for the interest charged on the loan, in line 
with the exception provided under Section 8.3(g)(iv) of this e-Invoice 
Specific Guideline. 
 
Example 18 
Kayan Jaya Sdn Bhd, a timber manufacturing company, provides a 30-
day credit term to its customers. In the event where the customer fails 
to  make  payment  within  this  credit  period,  a  late  payment  charge  of 
three percent (3%) will be imposed on the outstanding amount.  
In view that Kayan Jaya Sdn Bhd imposes late payment charges to its 
customers  for  payment  received  after  the  30-day  credit  term  period, 
Kayan Jaya Sdn Bhd is required to issue an e-Invoice to the buyer for 
the  late  interest  payment  charged,  in  accordance  with  the  exception 
provided under Section 8.3(g)(v) of this e-Invoice Specific Guideline.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
68 
 
Example 19 
Kelip  Karat Berhad, a  department store, provides  a  low  interest-
bearing  loan  to  its  employees, as  part  of the company’s employee 
benefits. An annual interest rate of three percent (3%) is charged on 
the outstanding loan balance.  
Since  this  transaction  involves  interest  payment  from  employees  on 
staff  loan  provided  by  Kelip  Karat  Berhad,  Kelip  Karat  Berhad  is 
required to issue an e-Invoice for the interest received, in line with the 
exception  provided  under  Section  8.3(g)(ii)  of  this  e-Invoice  Specific 
Guideline.  
 
Example 20 
Mark serves as the estate administrator for John, who was a money 
lender. After John’s death, Mark has been administering the estate of 
John as well as John’s money lending business. Syarikat Deepak, one 
of John’s customers, will make monthly instalment payment to Mark, 
which consists of interest and principal. 
As Mark is only an estate administrator, Syarikat Deepak is required to 
issue self-billed e-Invoice on the interest paid to Mark, in accordance 
with Section 8.3(g) of this e-Invoice Specific Guideline. 
 
8.4 Where a Buyer  is  required  to  issue  a  self-billed e-Invoice, the Buyer  will 
assume the role of the Supplier to be the issuer of e-Invoice and submits it 
to  IRBM  for  validation. Upon  validation, Buyer  would  be  able  to use  the 
validated e-Invoice as a proof of expense for tax purposes. As such, the 
other party is no longer required to issue an e-Invoice where a self-billed  
e-Invoice has been issued for the particular transaction.  
8.5 As the Buyer is required to assume the role of Supplier and issue self-billed 
e-Invoice, the Buyer is obliged to share validated self-billed e-Invoice with 
the Supplier upon validation.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
69 
 
Where the Buyer submits the self-billed e-Invoice for IRBM’s validation via 
MyInvois  Portal,  the  visual  representation  of  the  self-billed  e-Invoice 
generated from the MyInvois Portal will include a QR code, which can be 
used to validate the existence and status of the e-Invoice via the MyInvois 
Portal.  
Where the Buyer submits the self-billed e-Invoice for IRBM’s validation via 
API transmission, in the event the Buyer shares the visual representation 
of the self-billed e-Invoice to the Supplier, the Buyer is required to ensure 
that  the  QR  code  is  embedded  accordingly  prior  to  sharing  it  with  the 
Supplier. 
However, the IRBM acknowledges that there may be practical challenges 
in  sharing  the  validated self-billed e-Invoice with  the Supplier. Therefore, 
until further notice, the IRBM provides a concession allowing the Buyer to 
share either the validated self-billed e-Invoice or a visual representation of 
the validated self-billed e-Invoice with the Supplier.  
8.6 For the purposes of self-billed e-Invoice, the parties of the e-Invoice are as 
follows: 
No Transaction Supplier Buyer  
(assumes the role of 
Supplier to issue  
self-billed e-Invoice) 
1 Payment to agents, 
dealers, distributors, etc 
Agents, dealers, 
distributors, etc. 
Taxpayer that makes the 
payment  
2 Goods sold or services 
rendered by foreign 
suppliers 
Foreign Seller Malaysian Purchaser 
3 Profit distribution (e.g., 
dividend distribution) 
Recipient of the 
distribution 
Taxpayer that makes the 
distribution 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
70 
 
No Transaction Supplier Buyer  
(assumes the role of 
Supplier to issue  
self-billed e-Invoice) 
4 e-Commerce  Merchant, service 
providers  
(e.g., driver, rider) 
e-Commerce / 
Intermediary platform 
5 Pay-out to all betting and 
gaming winners 
Recipient of the  
pay-out  
Licensed betting and 
gaming provider 
6 Transactions with 
individuals who are not 
conducting a business 
Individual not 
conducting a 
business  
Person transacting with 
the individual not 
conducting a business 
7 Interest payment  Recipient of interest 
payment 
Taxpayer that makes the 
interest payment 
8 Claim, compensation or 
benefit payments from 
the insurance business 
of an insurer 
Policyholder / 
Beneficiary 
Insurer 
9 Payment in relation to 
capital reduction, share / 
capital / unit redemption, 
share buyback, return of 
capital or liquidation 
proceeds 
Investor Investee 
Table 8.1 – Parties involved in self-billed e-Invoice 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
71 
 
8.7 In facilitating a more efficient e-Invoice issuance process as well as to ease 
the  burden  of  individual  Suppliers  in  providing  TIN  and  identification 
number  details,  IRBM  provides  a  concession  to  individual  Suppliers. 
Please refer to Section 3.5.4 of this e-Invoice Specific Guideline for further 
details. 
8.8 In  the  event  the  individual  Supplier  provides  either  TIN  or  MyKad  / 
MyTentera identification number (instead of both), the Buyer should input 
the following details for self-billed e-Invoice purposes. 
No Option Details field Details to be included by Buyer 
in self-billed e-Invoice 
1 Option 1 (for 
Malaysian and 
non-Malaysian 
individuals), where 
the individual 
Supplier only 
provides TIN 
Supplier’s TIN Buyer to input the TIN as provided 
by individual Supplier 
Supplier’s 
Registration / 
Identification 
Number / 
Passport Number 
Buyer to input “000000000000” in 
the e-Invoice 
2 Option 2 (for 
Malaysian 
individuals), where 
the individual 
Supplier only 
provides MyKad / 
MyTentera 
identification 
number 
Supplier’s TIN Buyer to input “EI00000000010” in 
the e-Invoice 
Supplier’s 
Registration / 
Identification 
Number / 
Passport Number 
Buyer to input MyKad / MyTentera 
identification number provided by 
the individual Supplier 
Table 8.2 – Details of TIN and identification number / passport number to be included by 
Buyer for issuance of self-billed e-Invoice to individual Supplier 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
72 
 
8.9 The information required to be included in the self-billed e-Invoice are as 
per the required data fields outlined in Appendices 1 and 2 of the e-Invoice 
Guideline.  The  following  details  would  assist  the  Buyer  in  issuing  the 
self-billed e-Invoice: 
No Data field Details to be 
included by 
Buyer in a self-
billed e-Invoice 
Additional Remarks 
1 Supplier’s Name  Name of Supplier For Business: Name of business  
For Malaysian individuals: Full 
name as per MyKad / MyTentera 
For non-Malaysian individuals: 
Full name as per passport / MyPR / 
MyKAS 
2 Supplier’s TIN TIN of Supplier  For Malaysian Businesses 
Buyer to input the Supplier’s TIN 
and business registration number. 
For Foreign Businesses 
Where available, Buyer to input 
foreign Supplier’s business 
registration number and TIN. 
Where TIN is not available or not 
provided, Buyer to input 
“EI00000000030” for foreign 
supplier. 
Where business registration 
number is not available or not 
provided, Buyer to input “NA” 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
73 
 
No Data field Details to be 
included by 
Buyer in a self-
billed e-Invoice 
Additional Remarks 
3 Supplier’s 
Registration / 
Identification 
Number / Passport 
Number 
Details of 
registration / 
identification 
number / passport 
number 
For Malaysian Individuals  
i. Option 1: TIN only 
ii. Option 2: MyKad / MyTentera 
identification number only 
iii. Option 3: Both TIN and MyKad / 
MyTentera identification number 
For non-Malaysian Individuals 
i. Option 1: TIN only 
ii. Option 2: Both TIN and passport 
number / MyPR / MyKAS 
identification number 
For   clarity,   (i)   refers   to   the   TIN 
assigned by IRBM. In the event that 
the  non-Malaysian  individual  does 
not have a TIN, Buyer may use the 
general TIN (as listed in Appendix 1 
of this e-Invoice Specific Guideline), 
along  with  the  passport  number  / 
MyPR     /     MyKAS     identification 
number of the said individual. 
4 Supplier’s Address  Address of 
Supplier 
Buyer to input the business address 
(for business) / residential 
address (for individual) of 
Supplier 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
74 
 
No Data field Details to be 
included by 
Buyer in a self-
billed e-Invoice 
Additional Remarks 
5 Supplier’s Contact 
Number  
Telephone 
number of 
Supplier 
Buyer to input the contact number 
of Supplier 
6 Supplier’s SST 
Registration 
Number 
SST registration 
number of 
Supplier 
Where applicable, Buyer to input 
Supplier’s SST registration number 
Where Supplier is not registered for 
SST, Buyer to input “NA” 
7 Supplier’s 
Malaysia Standard 
Industrial 
Classification 
(MSIC code) 
MSIC code of 
Supplier (where 
applicable) 
Where applicable, Buyer to input 
Supplier’s MSIC code 
Buyer to input “00000” if such 
information is not available or not 
provided 
8 Supplier’s 
Business Activity 
Description 
Description of the 
Supplier’s 
business activity 
Where applicable, Buyer to input 
Supplier’s Business Activity 
Description 
Buyer to input “NA” if such 
information is not available or not 
provided 
9 Classification Classification of 
products or 
services  
Buyer to input a 3-digit integer (e.g., 
“000” to “999”), in accordance with 
the catalogue set by IRBM 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
75 
 
No Data field Details to be 
included by 
Buyer in a self-
billed e-Invoice 
Additional Remarks 
10 e-Invoice Code / 
Number  
 
Document 
reference number 
used by Supplier 
for internal 
tracking purposes 
Reference number of the invoice / 
bill / receipt issued by the Supplier 
(if applicable) 
Table 8.3 – Details required to be input by Buyer for issuance of self-billed e-Invoice 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
76 
 
9. TRANSACTIONS WHICH INVOLVE PAYMENTS 
(WHETHER IN  MONETARY  FORM OR  OTHERWISE) TO 
AGENTS, DEALERS OR DISTRIBUTORS 
9.1 The use of an agent, dealer or distributor are commonly seen in a business 
supply chain. An agent, dealer or distributor (i.e., a third party / intermediary) 
will earn  commission  on  the  sale  of  products  or  provision  of  services  to 
customers. 
9.2 Figure 9.1 provides  a general overview  of payment  to agent,  dealer  or 
distributor.  
 
Figure 9.1 – General overview of a business involving agent, dealer or distributor 
 
9.3 Issuance of e-Invoice from Seller to Purchaser 
9.3.1 When  a Purchaser acquires  goods  or  services  from  the Seller 
through an Agent / Dealer / Distributor, Seller is required to issue an 
e-Invoice to the Purchaser to record the transaction.  
9.3.2 For the  purposes of e-Invoice issuance, the  roles  of  both  parties 
would be as follows:  
(a) Supplier: Seller  
(b) Buyer: Purchaser 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
77 
 
9.3.3 Where the Purchaser does not request for an e-Invoice to be issued, 
Seller will  issue  a  normal  receipt  to  the Purchaser. Subsequently, 
Seller is required to issue a consolidated e-Invoice, aggregating all 
receipts issued for the prior month, for proof of income within seven 
(7) calendar days after the month-end. 
9.3.4 The  process  of  issuing  an e-Invoice to Purchaser is  similar  to  the 
issuance  of e-Invoice under Section  3.5 of  this e-Invoice Specific 
Guideline (for Purchaser who requires an e-Invoice) and Section 3.6 
of  this e-Invoice Specific  Guideline (for Purchaser who  does not 
require an e-Invoice) above.  
9.4 Issuance of  self-billed e-Invoice from Seller to Agent / Dealer / 
Distributor 
9.4.1 Upon  concluding a sale  or  transaction,  the Agent / Dealer / 
Distributor is eligible  to receive a  payment or  any  other  incentive 
(whether in monetary form or  otherwise) from the Seller (e.g., 
commission). The Seller is required to issue self-billed e-Invoice for 
the payment or  any  other  incentive (whether  in  monetary  form  or 
otherwise), pursuant  to  Section  83A  of  the  Income  Tax  Act  1967, 
made to Agent / Dealer / Distributor.  
9.4.2 For the purpose of self-billed e-Invoice issuance, the roles of both 
parties would be as follows:  
(a) Supplier: Agent / Dealer / Distributor 
(b) Buyer: Seller (assumes the role of Supplier to issue a self-billed 
e-Invoice for proof of expense) 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
78 
 
9.4.3 The process of issuing a self-billed e-Invoice is similar to the detailed 
e-Invoice workflow as provided under Section 2.3 and Section 2.4 of 
the e-Invoice Guideline. 
9.4.4 In facilitating a more efficient e-Invoice issuance process as well as 
to  ease  the  burden  of  individual  Suppliers  in  providing  TIN  and 
identification   number   details,   IRBM   provides   a   concession   to 
individual Suppliers. Please refer to Section 3.5.4 and Section 8.8 of 
this e-Invoice Specific Guideline for further details.  
9.4.5 The information  required to  be  included  in  the  self-billed e-Invoice 
are as per the required data fields outlined in Appendices 1 and 2 of 
the e-Invoice Guideline. The following details would assist the Seller 
in issuing the self-billed e-Invoice: 
No Data field Details to be 
included by Seller 
in a self-billed  
e-Invoice 
Additional Remarks 
1 Supplier’s Name  Name of Agent / 
Dealer / Distributor  
For Business: Name of 
business  
For Malaysian individual: Full 
name as per MyKad / MyTentera 
For non-Malaysian individual: 
Full name as per passport / 
MyPR / MyKAS 
2 Supplier’s TIN TIN of Agent / Dealer 
/ Distributor  
For Malaysian Businesses 
Seller to input Agent / Dealer / 
Distributor’s TIN and business 
registration number. Note that it 
is mandatory for Malaysian Agent 
/ Dealer / Distributor to provide 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
79 
 
No Data field Details to be 
included by Seller 
in a self-billed  
e-Invoice 
Additional Remarks 
3 Supplier’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration 
/ identification 
number / passport 
number 
TIN and business registration 
number. 
For Foreign Businesses 
Where available, Seller to input 
Agent / Dealer / Distributor’s TIN 
and business registration number  
Where TIN is not available or not 
provided, Seller to input 
“EI00000000030” for Foreign 
Agent / Dealer / Distributor  
Where business registration 
number is not available or not 
provided, Seller to input “NA”  
For Malaysian Individuals 
i. Option 1: TIN only 
ii. Option 2: MyKad / MyTentera 
identification number only 
iii. Option 3: Both TIN and 
MyKad / MyTentera 
identification number 
For non-Malaysian individuals 
i. Option 1: TIN only 
ii. Option 2: Both TIN and 
passport number / MyPR / 
MyKAS identification number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
80 
 
No Data field Details to be 
included by Seller 
in a self-billed  
e-Invoice 
Additional Remarks 
For  clarity,  (i)  refers  to  the  TIN 
assigned  by  IRBM.  In  the  event 
that  the  non-Malaysian  individual 
does not have a TIN, Supplier may 
use  the  general  TIN  (as  listed  in 
Appendix   1   of   this   e-Invoice 
Specific Guideline), along with the 
passport number / MyPR / MyKAS 
identification  number of  the  said 
individual 
4 Supplier’s 
Address  
Address of Agent / 
Dealer / Distributor  
Seller to input the business 
address (for business) / 
residential address (for 
individual) of Agent / Dealer / 
Distributor  
5 Supplier’s 
Contact Number  
Telephone number of 
the Agent / Dealer / 
Distributor  
Seller to input the contact 
number of Agent / Dealer / 
Distributor  
6 Supplier’s SST 
Registration 
Number 
SST registration 
number of the Agent 
/ Dealer / Distributor  
Where applicable, Seller to input 
Agent / Dealer / Distributor’s SST 
registration number 
Seller to input “NA” if such 
information is not applicable, not 
available or not provided  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
81 
 
No Data field Details to be 
included by Seller 
in a self-billed  
e-Invoice 
Additional Remarks 
7 Supplier’s 
Malaysia 
Standard 
Industrial 
Classification 
(MSIC code) 
MSIC code of the 
Agent / Dealer / 
Distributor  
Where applicable, Seller to input 
Agent / Dealer / Distributor’s 
MSIC code 
Seller to input “00000” if such 
information is not available or not 
provided 
8 Supplier’s 
Business 
Activity 
Description 
Description of the 
Agent / Dealer / 
Distributor’s business 
activity 
Where applicable, Seller to input 
Agent / Dealer / Distributor’s 
Business Activity Description 
Seller to input “NA” if such 
information is not available or not 
provided 
9 Classification Classification of 
products or services  
Seller to input a 3-digit integer 
(e.g., “000” to “999”), in 
accordance with the catalogue 
set by IRBM  
10 e-Invoice Code / 
Number  
Document reference 
number used by 
Seller for internal 
tracking purposes 
Reference number of the receipt 
issued by the Seller 
Table 9.1 – Details to be input by Seller (i.e., Buyer) for issuance of self-billed e-Invoice to 
agent / dealer / distributor 
 
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
82 
 
Example 21 
Ali works as a sales agent of Chère Automotive Sdn Bhd (CASB). 
On  22  June  2025,  Ali sold a  car (Schnell  model) at a  price  of 
RM600,000 and earns a 20% commission on the sales he made.  
CASB issues  a self-billed e-Invoice to Ali,  recording  the  20% 
commission earned by Ali as proof of income and proof of expense 
for  CASB. Below  is an  example of a visual  representation  of self-
billed e-Invoice issued by CASB to Ali:  
 
Figure 9.2 – Issuance of visual representation of self-billed e-Invoice by business to its agent 
 
Note: The above example is for illustration purposes only and are subject to changes. 
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
83 
 
10. CROSS BORDER TRANSACTIONS  
10.1 Cross-border  transaction  involves  a  transaction  between  a  Malaysian 
buyer and a foreign supplier and vice versa. 
10.2 Foreign supplier refers to any supplier operating outside of Malaysia / not 
established  in  Malaysia, including non-Malaysian individual.  Conversely, 
foreign buyer  refers  to  any foreign  person whom acquires  goods  and/or 
services from Malaysia. 
10.3 Cross-border transactions consists of the following:  
(a) Goods  sold  or  services  rendered  by  Foreign Seller (Supplier) to 
Malaysian Purchaser (Buyer); and  
(b) Goods  sold  or  services  rendered  by  Malaysian Seller (Supplier) to 
Foreign Purchaser (Buyer). 
10.4 Goods  sold  or  services  rendered  by Foreign Seller to  Malaysian 
Purchaser 
 
Figure 10.1 – Current transaction flow between Foreign Seller (Supplier) and Malaysian 
Purchaser (Buyer) 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
84 
 
10.4.1 Currently, Foreign Seller would issue an invoice / bill / receipt to 
the  Malaysian Purchaser to  record  the  transaction  e.g., sale  of 
goods or provision of services.  
10.4.2 The invoice / bill / receipt would be issued in accordance with the 
Foreign Seller local   invoicing   requirements as   part   of   their 
business practices.  
10.4.3 Given  that  the Foreign  Seller is not mandated  to  implement 
Malaysia’s e-Invoice, the Malaysian Purchaser is required to issue 
a self-billed e-Invoice to document the said expense. A self-billed 
e-Invoice is  required  to  support  the  said  transaction  for  tax 
purposes.  
10.4.4 For the purpose of self-billed e-Invoice issuance, the roles of both 
parties would be as follows:  
(a) Supplier: Foreign Seller 
(b) Buyer: Malaysian Purchaser (assumed the role of Supplier to 
issue a self-billed e-Invoice for proof of expense)  
10.4.5 The steps  involved  for  issuance  of  self-billed e-Invoice by  the 
Malaysian Purchaser are as follows:   
Step 1:   When a sale or transaction is concluded, Foreign Seller 
will issue  an invoice /  receipt /  bill to  the  Malaysian 
Purchaser to record its income generated from sale of 
goods or services rendered.  
Step 2:  The Malaysian Purchaser is required to assume the role 
of Supplier and issue a self-billed e-Invoice to document 
the  expense for tax  purposes,  in  accordance with the 
timing of issuance as mentioned in Section 10.4.8 and 
10.4.9 respectively. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
85 
 
In   issuing   the   self-billed e-Invoice,   the   Malaysian 
Purchaser will complete the required fields as outlined 
in Appendices 1 and 2 of e-Invoice Guideline.  
The Malaysian Purchaser may extract the details of the 
Foreign Seller from the invoice / receipt / bill issued by 
the Foreign Seller or  request  the  relevant  details from 
the Foreign Seller.   
Where certain required details are not available due to: 
i. The details are not applicable to the Foreign Seller; 
or 
ii. The details are not provided by Foreign Seller;  
the   Malaysian Purchaser to input “NA” in   the  
self-billed e-Invoice.  
Step 3:  The  process  of  issuing  a  self-billed e-Invoice by  the 
Malaysian Purchaser shall follow the detailed e-Invoice 
workflow as discussed in Section 2.3 (e-Invoice model 
via  MyInvois  Portal)  and  Section  2.4  (e-Invoice model 
via API) of the e-Invoice Guideline.  
Once the self-billed e-Invoice has been validated, IRBM 
will  send  notification  to  the  Malaysian Purchaser only 
(i.e., no notification to be sent to Foreign Seller). 
10.4.6 The validated self-billed e-Invoice will serve as proof of expense 
for Malaysian Purchaser. The Malaysian Purchaser is not obliged 
to share the self-billed e-Invoice with the Foreign Seller.  
10.4.7 Kindly  note  that  for  the  purposes  of  self-billed  e-Invoice,  where 
service tax on imported taxable service is applicable in accordance 
with  the  relevant  SST legislation,  taxpayer  is  required  to  include 
the service tax amount in the said self-billed e-Invoice.  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
86 
 
10.4.8 In  relation  to  importation  of  goods,  the  Malaysian  Purchaser 
should issue a self-billed e-Invoice latest by the end of the second 
month following the month of customs clearance is obtained.  
10.4.9 Meanwhile,   in   relation   to   importation   of   services,   self-billed  
e-Invoice should be issued latest by the end of the month following 
the month upon (1) payment made by the Malaysian Purchaser; 
or  (2)  receipt  of  invoice  from  foreign  supplier,  whichever  earlier. 
The   determination   of   the   aforementioned   (1)   and   (2)   is   in 
accordance  with  the  prevailing  rules  applicable  for  imported 
taxable service.  
10.4.10 The information required to be included in the self-billed e-Invoice 
are as per the required data fields outlined in Appendices 1 and 2 
of the e-Invoice Guideline. The following details would assist the 
Malaysian Purchaser in issuing the self-billed e-Invoice: 
No Data field Details to be 
included by 
Malaysian 
Purchaser in a  
self-billed e-Invoice 
Additional Remarks 
1 Supplier’s Name  Name of Foreign 
Seller 
For Business: Name of business 
For non-Malaysian individual: Full 
name as per passport / MyPR / 
MyKAS 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
87 
 
No Data field Details to be 
included by 
Malaysian 
Purchaser in a  
self-billed e-Invoice 
Additional Remarks 
2 Supplier’s TIN TIN of Foreign Seller Malaysian Purchaser to input the 
Foreign Seller’s TIN, where 
available 
Where TIN is not available or not 
provided, Malaysian Purchaser to 
input “EI00000000030” for Foreign 
Seller 
3 Supplier’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration 
/ identification 
number / passport 
number 
Malaysian Purchaser to input 
business registration / passport 
number / MyPR / MyKAS 
identification number of Foreign 
Seller  
Malaysian Purchaser to input “NA” 
if business registration number is 
not available or not provided  
4 Supplier’s 
Address  
Address of Foreign 
Seller 
Malaysian Purchaser to input 
business address (for business) / 
residential address (for 
individual) of the Foreign Seller 
5 Supplier’s 
Contact Number  
Telephone number of 
Foreign Seller 
Malaysian Purchaser to input the 
contact number of Foreign Seller 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
88 
 
No Data field Details to be 
included by 
Malaysian 
Purchaser in a  
self-billed e-Invoice 
Additional Remarks 
6 Supplier’s SST 
Registration 
Number 
SST registration 
number of the 
Foreign Seller  
Where applicable, Malaysian 
Purchaser to input Foreign Seller’s 
SST registration number  
Malaysian Purchaser to input “NA” if 
such information is not applicable, 
not available or not provided 
7 Supplier’s 
Malaysia 
Standard 
Industrial 
Classification 
(MSIC code) 
MSIC code of 
Foreign Seller 
Where applicable, Malaysian 
Purchaser to input Foreign Seller’s 
MSIC code 
Malaysian Purchaser to input 
“00000” if such information is not 
applicable, not available or not 
provided 
8 Supplier’s 
Business 
Activity 
Description 
Description of the 
Foreign Seller’s 
business activity 
Where applicable, Malaysian 
Purchaser to input Foreign Seller’s 
Business Activity Description 
Malaysian Purchaser to input “NA” 
if such information is not applicable, 
not available or not provided 
9 Classification Classification of 
products or services  
Malaysian Purchaser to input a 3-
digit integer (e.g., “000” to “999”), in 
accordance with the catalogue set 
by IRBM 
Table 10.1 – Details to be input by Malaysian Purchaser (Buyer) for issuance of self-billed  
e-Invoice to Foreign Seller (Supplier) 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
89 
 
Example 22 
Food Eatery Sdn Bhd (Buyer) has entered into an agreement with 
ABC Advisory Ltd (Supplier), a legal advisory service provider based 
in  the  United  Kingdom.  ABC  Advisory  Ltd  has  issued  an invoice 
amounting to RM200,000 for providing professional legal advice to 
Food  Eatery  Sdn  Bhd. The  legal  advice relates  to  matters  in 
Malaysia and thus, imported taxable service would be applicable on 
the provision of the services. Food Eatery Sdn Bhd has paid for the 
services on 31 July 2025. 
In order to substantiate the expense for tax purposes, Food Eatery 
Sdn  Bhd  is  required  to  issue  a  self-billed e-Invoice.  In  completing 
the self-billed e-Invoice, Food Eatery Sdn Bhd is required to input all 
the  required  fields  as  outlined  in  Appendices 1  and  2  of  the  
e-Invoice Guideline, including supplier’s details as per the invoice, 
with  the  exception  for  supplier’s TIN (i.e., buyer to input general 
supplier TIN as mentioned in Table 10.1).  
Figure 10.2 provides an example of the visual representation of the 
self-billed e-Invoice issued by Food Eatery Sdn Bhd:  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
90 
 
 
Figure 10.2 – Example of visual representation of validated self-billed e-Invoice for 
transaction with foreign supplier in PDF format 
Note: The above example is for illustration purposes only and are subject to changes. 
 
10.5 Goods sold  or  services  rendered by  Malaysian Seller to Foreign 
Purchaser 
 
Figure 10.3 – Current transaction flow between Malaysian Seller (Supplier) and Foreign 
Purchaser (Buyer) 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
91 
 
10.5.1 Currently, Malaysian Seller would issue an invoice / bill / receipt to 
the Foreign Purchaser to record the transaction e.g., sale of goods 
or provision of services.  
10.5.2 Upon the implementation of e-Invoice, Malaysian Seller is required 
to issue an e-Invoice to the Foreign Purchaser to record the said 
income.  
10.5.3 The  steps  involved  for  issuance  of e-Invoice by  the  Malaysian 
Seller are as follows:   
Step 1:   Upon   a   sale   or   transaction   being   concluded,   the 
Malaysian Seller will  issue  an e-Invoice to Foreign 
Purchaser to record the transaction e.g., sale of goods 
or provision of services.  
For the purpose of e-Invoice issuance, the roles of both 
parties would be as follows:  
i. Supplier: Malaysian Seller 
ii. Buyer: Foreign Purchaser 
Step 2:   The  Malaysian Seller will  be  required  to  complete  the 
required fields as outlined in Appendices 1 and 2 of the  
e-Invoice Guideline.  
Where certain required details are not available due to: 
i. The   details   are   not   applicable   to   the   Foreign 
Purchaser; or 
ii. The details are not provided by Foreign Purchaser 
the Malaysian Seller to input “NA” in the e-Invoice.  
Step 3:   The process of issuing the e-Invoice by Malaysian Seller 
shall follow the detailed e-Invoice workflow as discussed 
in Section 2.3 (e-Invoice model via MyInvois Portal) and 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
92 
 
Section  2.4  (e-Invoice model  via  API)  of  the e-Invoice 
Guideline, with the following exceptions:  
i. Once  the e-Invoice has  been  validated,  IRBM  will 
send notification to the Malaysian Seller only (i.e., no 
notification to be sent to Foreign Purchaser as they 
are not using MyInvois System). 
ii. The validated e-Invoice will serve as proof of income 
for  Malaysian Seller. The  Malaysian Seller may 
share  a  copy  of  the visual  representation  of  the 
validated e-Invoice to  the  Foreign Purchaser as  a 
business-as-usual practice for record purposes.  
iii. As Foreign Purchaser is not part of MyInvois System, 
there  would  not  be  any  request  for  rejection  from 
Foreign Purchaser. Should there be any error on the 
validated e-Invoice, any adjustment should be made 
by issuance of credit note / debit note / refund note  
e-Invoice by the Malaysian Seller.  
10.5.4 The information required to be included in the e-Invoice are as per 
the  required  data  fields  outlined  in  Appendices  1  and  2  of  the  
e-Invoice Guideline.   The following   details would   assist   the 
Malaysian Seller in issuing the e-Invoice:  
No Data field Details to be input by 
Malaysian Seller in an 
e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Foreign 
Purchaser  
For business: Name of 
business  
For non-Malaysian 
individual: Full name as per 
passport / MyPR / MyKAS 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
93 
 
No Data field Details to be input by 
Malaysian Seller in an 
e-Invoice 
Additional Remarks 
2 Buyer’s TIN TIN of Foreign 
Purchaser  
Malaysian Seller to input the 
Foreign Purchaser’s TIN, 
where available 
Where TIN is not available or 
not provided, Malaysian Seller 
to input “EI00000000020” for 
Foreign Purchaser 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration / 
identification number / 
passport number 
Where available, Malaysian 
Seller to input the business 
registration / passport number 
/ MyPR / MyKAS identification 
number of Foreign Purchaser   
Malaysian Seller to input “NA” 
if business registration 
number is not available or not 
provided  
4 Buyer’s Address  Address of Foreign 
Purchaser 
Malaysian Seller to input the 
business address (for 
business) / residential 
address (for individual) of 
Foreign Purchaser  
5 Buyer’s Contact 
Number  
Telephone number of 
Foreign Purchaser  
Malaysian Seller to input the 
contact number of Foreign 
Purchaser 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
94 
 
No Data field Details to be input by 
Malaysian Seller in an 
e-Invoice 
Additional Remarks 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of the Foreign 
Purchaser  
Where applicable, Malaysian 
Seller to input Foreign 
Purchaser’s SST registration 
number  
Malaysian Seller to input “NA” 
if such information is not 
applicable, not available or 
not provided  
Table 10.2 – Details to be input by Malaysian Seller (Supplier) for issuance of e-Invoice to 
Foreign Purchaser (Buyer) 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
95 
 
11. PROFIT DISTRIBUTION (E.G., DIVIDEND DISTRIBUTION) 
11.1 Domestic Distribution  
11.1.1 Currently, companies  distributing profits to  its  shareholders 
issues dividend    vouchers    or    dividend    warrants    to    its 
shareholders. Taxpayers in other forms of legal entity (e.g., trusts, 
unit trusts, etc.) adopt similar practice.  
11.1.2 Upon implementation of e-Invoice in Malaysia, taxpayers that are 
not entitled to deduct tax under Section 108 of the Income Tax 
Act 1967 as well as taxpayers who are listed on Bursa Malaysia 
will  be  exempted  from issuing self-billed e-Invoice on dividend 
distribution. Correspondingly, their shareholders are not required 
to issue an e-Invoice for proof of income. This exemption will be 
reviewed and updated from time to time. 
11.1.3 In other words, taxpayers enjoying the exemption under Section 
11.1.2  above can  continue  with  their existing  processes  in 
relation to profit distributions (e.g., issuance of dividend vouchers 
or warrants).  
11.1.4 However, taxpayers  other  than those mentioned  in  Section 
11.1.2 are required to issue self-billed e-Invoice to document the 
expense. Similarly, the self-billed e-Invoice will serve as a proof 
of income for the Supplier (i.e., recipients of the profit distribution). 
11.1.5 For  the  purpose  of  self-billed e-Invoice issuance,  the  roles  of 
both parties would be as follows:  
(a) Supplier: Recipient of the distribution 
(b) Buyer: Taxpayer that makes the distribution  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
96 
 
11.1.6 Where a self-billed e-Invoice is required to be issued, the steps 
involved for issuance are as follows: 
Step 1: When profit (e.g., dividend) is being paid or credited, 
the  taxpayer  that  makes  the  distribution will  issue  a 
dividend voucher to the recipient.  
Step 2:  The taxpayer that makes the distribution is required to 
assume  the  role  of Supplier and issue  a  self-billed  
e-Invoice to the recipient of the distribution.  
Step 3:  In  issuing  the  self-billed e-Invoice,  the taxpayer  that 
makes the distribution will complete the required fields 
as  outlined  in  Appendices 1  and  2  of  the e-Invoice 
Guideline.  
The  process  of issuing a self-billed e-Invoice by  the 
taxpayer  that  makes  the  distribution shall  follow  the 
detailed e-Invoice workflow  as  discussed  in  Section 
2.3 (e-Invoice model via MyInvois Portal) and Section 
2.4 (e-Invoice model   via   API)   of   the e-Invoice 
Guideline.  
11.1.7 The   information   required   to   be   included   in   the   self-billed  
e-Invoice are   as   per   the required   data   fields   outlined   in 
Appendices  1  and  2  of  the e-Invoice Guideline.  The  following 
details  would  assist  the taxpayer  that  makes  the  distribution in 
issuing the self-billed e-Invoice:  
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
97 
 
No Data field Details to be 
included by 
taxpayer that 
makes the 
distribution in  
self-billed e-Invoice 
Additional Remarks 
1 Supplier’s Name  Name of Recipient For business: Name of 
business  
For Malaysian individuals: Full 
name as per MyKad / MyTentera 
For non-Malaysian 
individuals: Full name as per 
passport / MyPR / MyKAS  
2 Supplier’s TIN TIN of Recipient 
 
For Malaysian Businesses 
Taxpayer that makes the 
distribution to input Recipient’s 
TIN and business registration 
number. Note that it is 
mandatory for Malaysian 
Businesses to provide TIN and 
business registration number.  
For Foreign Businesses 
Taxpayer that makes the 
distribution to input Recipient’s 
TIN and business registration 
number, where available  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
98 
 
No Data field Details to be 
included by 
taxpayer that 
makes the 
distribution in  
self-billed e-Invoice 
Additional Remarks 
3 Supplier’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of registration 
/ identification 
number / passport 
number 
Where TIN is not available or not 
provided, taxpayer that makes 
the distribution to input 
“EI00000000030” for Foreign 
Recipient 
Where business registration 
number is not available or not 
provided, taxpayer that makes 
the distribution to input “NA” for 
Foreign Recipient 
For Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only  
iii. Option 3: Both TIN and 
MyKad / MyTentera 
identification number 
For non-Malaysian individuals  
i. Option 1: TIN only 
ii. Option 2: Both TIN and 
passport number / MyPR / 
MyKAS identification number 
For  clarity,  (i)  refers  to  the  TIN 
assigned  by  IRBM.  In  the  event 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
99 
 
No Data field Details to be 
included by 
taxpayer that 
makes the 
distribution in  
self-billed e-Invoice 
Additional Remarks 
   that the non-Malaysian individual 
does  not  have  a  TIN,  Supplier 
may  use  the  general  TIN  (as 
listed  in  Appendix  1  of  this  e-
Invoice Specific Guideline), 
along with the passport number / 
MyPR   /   MyKAS   identification 
number of the said individual 
4 Supplier’s 
Address  
Address of Recipient Taxpayer that makes the 
distribution to input business 
address (for business) / 
residential address (for 
individual) of the Recipient  
5 Supplier’s 
Contact Number  
Telephone number of 
Recipient 
Taxpayer that makes the 
distribution to input the contact 
number of Recipient 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
100 
 
No Data field Details to be 
included by 
taxpayer that 
makes the 
distribution in  
self-billed e-Invoice 
Additional Remarks 
6 Supplier’s SST 
Registration 
Number 
SST registration 
number of Recipient 
Where applicable, taxpayer that 
makes the distribution to input 
Recipient’s SST registration 
number  
Taxpayer that makes the 
distribution to input “NA” if such 
information is not applicable, not 
available or not provided 
7 Classification Classification of 
products or services  
Taxpayer that makes the 
distribution to input a 3-digit 
integer (e.g., “000” to “999”), in 
accordance with the catalogue 
set by IRBM 
8 e-Invoice Code / 
Number  
Document reference 
number used by the 
taxpayer that makes 
the distribution for 
internal tracking 
purposes 
Reference number of the 
dividend voucher issued by the 
taxpayer that makes the 
distribution 
Table 11.1 – Details required to be input by the taxpayer that makes the distribution (Buyer) 
for issuance of self-billed e-Invoice to recipient (Supplier) 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
101 
 
11.2 Foreign Profits / Dividend   
11.2.1 For  any  foreign profits / dividend  received in  Malaysia,  the 
recipient is required to issue an e-Invoice to document as a proof 
of income for tax purposes.  
11.2.2 For the purposes of e-Invoice issuance, the roles of both parties 
would be as follows:  
(a) Supplier: Profit / Dividend Recipient  
(b) Buyer: Foreign Distributor 
11.2.3 The process  of  issuing  an e-Invoice by  the Profit /  Dividend 
Recipient shall   follow   the   detailed e-Invoice workflow   as 
discussed  in  Section  2.3  (e-Invoice model  via  MyInvois  Portal) 
and  Section  2.4  (e-Invoice model  via  API)  of  the e-Invoice 
Guideline.  
11.2.4 Please refer to Section 12 of this e-Invoice Specific Guideline for 
more details.  
 
 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
102 
 
12. FOREIGN INCOME  
12.1 An e-Invoice would be required for all foreign income received in Malaysia 
from outside Malaysia as a proof of income for tax purposes.  
12.2 For the purposes of e-Invoice issuance, the roles of both parties would be 
as follows:  
(a) Supplier: Recipient  of  the foreign Income (referred  to  as  “Income 
Recipient” for ease of understanding in this section) 
(b) Buyer: Person who makes payment to Income Recipient (referred to 
as “Payor” for ease of understanding in this section)  
12.3 The  process  of  issuing e-Invoice for  foreign  income  is  similar  to  the 
issuance  of e-Invoice involving  Malaysian  Supplier  and  Foreign  Buyer 
which  has  been  discussed  in  Section 10.5 of this e-Invoice Specific 
Guideline. 
12.4 The Income Recipient should issue the e-Invoice latest by the end of the 
month following the month of receipt of the said foreign income.  
12.5 The information  required  to  be  included  in  the e-Invoice are  as  per  the 
required  data  fields  outlined  in  Appendices  1  and  2  of  the e-Invoice 
Guideline.  The  following  details  would  assist the Income  Recipient in 
issuing the e-Invoice:  
No Data field Details to be included 
by Income Recipient 
in an e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Payor For Business: Name of 
business  
For non-Malaysian 
individuals: Name as per 
passport / MyPR / MyKAS  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
103 
 
No Data field Details to be included 
by Income Recipient 
in an e-Invoice 
Additional Remarks 
2 Buyer’s TIN TIN of Payor Income Recipient to input the 
Payor’s TIN, where available 
Where TIN is not available or 
not provided, Income Recipient 
to input “EI00000000020” for 
Payor 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration / 
identification number / 
passport number 
Where available, Income 
Recipient to input the 
registration / passport number / 
MyPR / MyKAS identification 
number of Payor  
Income Recipient to input “NA” 
if business registration number 
is not available or not provided 
4 Buyer’s Address  Address of Payor Income Recipient to input the 
business address (for 
business) / residential 
address (for individual) of 
Payor 
5 Buyer’s Contact 
Number  
Telephone number of 
Payor 
Income Recipient to input the 
contact number of Payor  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
104 
 
No Data field Details to be included 
by Income Recipient 
in an e-Invoice 
Additional Remarks 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Payor 
Where applicable, Income 
Recipient to input Payor’s SST 
registration number  
Income Recipient to input “NA” 
if such information is not 
applicable, not available or not 
provided 
Table 12.1 – Details required to be input by Income Recipient for issuance of an e-Invoice 
  
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
105 
 
13. CURRENCY EXCHANGE RATE 
13.1 The  currency  exchange  rate in  the e-Invoice data  field can  be  used for 
transactions  conducted  in  foreign  currencies [i.e.,  currency  other  than 
Ringgit Malaysia (RM)].  
13.2 If required, the currency exchange rate shall be determined based on the 
following order: 
1. Supplier  shall comply  with  the legal or  tax requirements on  currency 
exchange   rate as imposed   by   relevant   authorities (e.g., Royal 
Malaysian   Customs   Department (RMCD), IRBM,   etc.),   where 
applicable.  
2. Where (1) above is not applicable (i.e., no legal or tax requirement on 
the  currency  exchange  rate is  applicable),  Supplier  may follow  the 
currency exchange rate per their internal policy.  
13.3 Supplier is required to provide currency exchange rate in the e-Invoice if 
the said e-Invoice is required to be converted into RM-equivalent. 
13.4 For  the  purposes  of  self-billed  e-Invoice  for  importation  of  goods,  the 
Malaysian taxpayers may use their internal currency exchange rate. 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
106 
 
14. E-COMMERCE TRANSACTIONS 
14.1 E-commerce transaction means any sale or purchase of goods or services, 
conducted  over  any  networks  by  methods  specifically designed  for  the 
purpose  of  receiving  or  placing  of  orders.  The  goods  or  services  are 
ordered by those methods, but the payment and the ultimate delivery of the 
goods or services do not have to be conducted online.  
14.2 An  e-commerce  transaction  can  be  between various  parties,  such  as 
enterprises,  households,  individuals,  governments,  and  other  public  or 
private organisations. 
14.3 Figure 14.1 provides an overview of e-commerce transaction.  
 
Figure 14.1 – General overview of an e-commerce transaction 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
107 
 
14.4 Issuance   of   e-Invoice   from   e-commerce   platform   provider   to 
Purchaser 
14.4.1 Currently, e-commerce platform provider would issue an invoice / 
bill / receipt to the Purchaser to record the transaction concluded 
on  the  e-commerce  platform  e.g.,  sale  of  goods  or  provision  of 
services. 
14.4.2 Upon implementation of e-Invoice, e-commerce platform providers 
are  responsible to  assume  the  role  of  Supplier  in  facilitating  the 
issuance of:  
i. e-Invoice (upon Purchaser’s request); or  
ii. receipt (if no e-Invoice is requested by the Purchaser)  
to the Purchaser for the transaction. Kindly note that the issuance 
of  e-Invoice  is  for  the  purposes  of  complying  with  relevant  tax 
legislation (e.g., Income Tax Act 1967, Labuan Business Activity 
Tax Act 1990, Petroleum (Income Tax) Act 1967) only and does 
not  change  the  nature  of  transaction  nor  the  commercial  liability 
associated with the transaction. 
14.4.3 Where the   Purchaser   does   not   require   an   e-Invoice,   the  
e-commerce    platform    provider    is    allowed    to    aggregate 
transactions  with  Purchasers  who  do  not  require  an  e-Invoice 
(except certain activities / transactions as mentioned in Table 3.4 
of this e-Invoice Specific Guideline where consolidated e-Invoice 
is  not  allowed) on  a  monthly  basis  and  submit  a  consolidated  
e-Invoice to IRBM, within seven (7) calendar days after the month 
end. 
14.4.4 For the purposes of e-Invoice issuance to Purchaser, the roles of 
both parties would be as follows:  
(a) Supplier: e-commerce platform provider 
(b) Buyer: Purchaser  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
108 
 
14.4.5 In  other  words,  the  merchants  and/or service  providers  are  not 
required  to  issue  e-Invoice  or  receipt  to  the  Purchaser  for  the 
goods sold or services performed. 
14.4.6 The information required to be included in the e-Invoice are as per 
the  required  data  fields  outlined  in  Appendices  1  and  2  of  the  
e-Invoice   Guideline.   The   following   details   would   assist   the  
e-commerce platform provider in issuing the e-Invoice: 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional remarks  
1 Buyer’s Name Name of  
Purchaser  
For business: Name of business  
For Malaysian individuals: Full 
name as per MyKad / MyTentera 
For non-Malaysian individuals: 
Full name as per passport / MyPR / 
MyKAS  
2 Buyer’s TIN TIN of  
Purchaser 
For Malaysian Businesses 
e-commerce platform provider to 
input Purchaser’s TIN and business 
registration number.  
For Foreign Businesses 
e-commerce platform provider to 
input Purchaser’s TIN and business 
registration number, where 
available 
Where TIN is not available or not 
provided, e-commerce platform 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
109 
 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional remarks  
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport Number  
Details of  
registration / 
identification 
number / passport 
number  
provider to input “EI00000000020” 
for Foreign Businesses 
Where business registration 
number is not available or not 
provided, e-commerce platform 
provider to input “NA” 
 
For Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only  
iii. Option 3: Both TIN and MyKad / 
MyTentera identification number 
For non-Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: Both TIN and passport 
number / MyPR / MyKAS 
identification number 
For   clarity,   (i)   refers   to the   TIN 
assigned by IRBM. In the event that 
the  non-Malaysian  individual  does 
not  have  a  TIN,  Supplier  may  use 
the    general    TIN    (as    listed    in 
Appendix 1 of this e-Invoice Specific 
Guideline), along with the passport / 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
110 
 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional remarks  
MyPR /     MyKAS     identification 
number of the said individual. 
4 Buyer’s Address Address of  
Purchaser 
e-commerce platform provider to 
input business address (for 
business) / residential address 
(for individual) of the Purchaser 
5 Buyer’s Contact 
Number  
Telephone number 
of Purchaser 
e-commerce platform provider to 
input contact number of the 
Purchaser 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of  
Purchaser  
Where applicable, e-commerce 
platform provider to input 
Purchaser’s SST registration 
number  
E-commerce platform provider to 
input “NA” if such information is not 
applicable, not available or not 
provided  
7 Classification Classification of 
products or 
services  
e-commerce platform provider to 
input a 3-digit integer (e.g., “000” to 
“999”), in accordance with the 
catalogue set by IRBM 
Table 14.1 – Details to be input by e-commerce platform provider for issuance of e-Invoice to 
Purchaser 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
111 
 
14.4.7 In  relation  to  the  consolidated  e-Invoice,  e-commerce  platform 
provider will be required to complete the required fields as outlined 
in Appendices 1 and 2 of the e-Invoice Guideline and complete the 
Purchaser’s  details  and  certain  transaction  details  using  the 
information   provided  in  Table   3.5 of   this   e-Invoice   Specific 
Guideline. 
14.4.8 The process of issuing an e-Invoice to the Purchaser is similar to 
the  issuance  of  e-Invoice  under  Section  3.5  of  this  e-Invoice 
Specific Guideline (for Purchaser who requires an e-Invoice) and 
Section 3.6 of this e-Invoice Specific Guideline (for Purchaser who 
does not require an e-Invoice). 
14.5 Issuance of self-billed e-Invoice by the e-commerce platform provider 
to Merchant and/or Service Provider 
14.5.1 Upon concluding a sale or transaction on the e-commerce platform, 
the   Merchant   and/or   Service   Provider   is   eligible   to   receive 
payment from the e-commerce platform provider in respect of the 
goods sold and/or services performed. 
14.5.2 Upon implementation of e-Invoice, e-commerce platform provider 
is required to issue self-billed e-Invoice to Merchant and/or Service 
Provider for   all   transactions   concluded   on   the   e-commerce 
platform. 
Kindly  note  that the  issuance  of  self-billed  e-Invoice  is  for  the 
purposes of complying with relevant tax legislation (e.g., Income 
Tax Act 1967, Labuan Business Activity Tax Act 1990, Petroleum 
(Income Tax) Act 1967) only and does not change the nature of 
transaction   nor the   commercial   liability   associated   with   the 
transaction.   

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
112 
 
14.5.3 For the purposes of self-billed e-Invoice issuance, the roles of both 
parties would be as follows: 
(a) Supplier: Merchant and/or Service Provider  
(b) Buyer:  E-commerce  platform  provider  (assumes  the  role of 
Supplier to issue a self-billed e-Invoice)   
14.5.4 The  process  of  issuing  a  self-billed  e-Invoice  is  similar  to  the 
detailed  e-Invoice  workflow  as  provided  under  Section  2.3  and 
Section 2.4 of the e-Invoice Guideline. 
14.5.5 E-commerce  platform  provider  is  allowed  to  create  and  submit  
self-billed  e-Invoice for IRBM’s validation in accordance with the 
current  issuance  frequency of  issuing  statements (e.g.,  daily, 
weekly, monthly, bi-monthly) to Merchant and/or Service Provider. 
14.5.6 The information required to be included in the self-billed e-Invoice 
are as per the required data fields outlined in Appendices 1 and 2 
of the e-Invoice Guideline. The following details would assist the  
e-commerce platform provider in issuing the self-billed e-Invoice:  
No. Data field Details to be 
included by  
e-commerce 
platform provider 
in a self-billed  
e-Invoice 
Additional remarks  
1 Supplier’s Name Name of Merchant 
and/or Service 
Provider 
For Business: Name of business 
For Malaysian individuals: Full 
name as per MyKad / MyTentera 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
113 
 
No. Data field Details to be 
included by  
e-commerce 
platform provider 
in a self-billed  
e-Invoice 
Additional remarks  
For non-Malaysian individuals: 
Full name as per passport / MyPR / 
MyKAS 
2 Supplier’s TIN TIN of Merchant 
and/or Service 
Provider 
For Malaysian Business 
e-commerce platform provider to 
input Merchant and/or Service 
Provider’s TIN and business 
registration number 
For Foreign Business 
Where available, e-commerce 
platform provider to input Merchant 
and/or Service Provider’s TIN and 
business registration number 
Where TIN is not available or not 
provided, e-commerce platform 
provider to input “EI00000000030” 
for Merchant and/or Service 
Provider 
Where business registration 
number is not available or not 
provided, e-commerce platform 
provider to input “NA” 
 
3 Supplier’s 
Registration / 
Identification 
Number / 
Passport Number 
Details of 
registration / 
identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
114 
 
No. Data field Details to be 
included by  
e-commerce 
platform provider 
in a self-billed  
e-Invoice 
Additional remarks  
For Malaysian Individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only  
iii. Option 3: Both TIN and MyKad / 
MyTentera identification number 
For non-Malaysian individuals  
i. Option 1: TIN only 
ii. Option 2: Both TIN and passport 
number / MyPR / MyKAS 
identification number 
For   clarity,   (i)   refers   to the   TIN 
assigned by IRBM. In the event that 
the  non-Malaysian  individual  does 
not  have  a  TIN,  Supplier  may  use 
the    general    TIN    (as    listed    in 
Appendix 1 of this e-Invoice Specific 
Guideline), along with the passport / 
MyPR /     MyKAS     identification 
number of the said individual. 
4 Supplier’s 
Address 
Address of 
Merchant and/or 
Service Provider 
e-commerce platform provider to 
input the business address (for 
business) / residential address 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
115 
 
No. Data field Details to be 
included by  
e-commerce 
platform provider 
in a self-billed  
e-Invoice 
Additional remarks  
(for individual) of Merchant and/or 
Service Provider 
5 Supplier’s 
Contact Number 
Telephone number 
of Merchant and/or 
Service Provider 
e-commerce platform provider to 
input the contact number of 
Merchant and/or Service Provider 
6 Supplier’s SST 
Registration 
Number  
SST registration 
number of 
Merchant and/or 
Service Provider 
Where applicable, e-commerce 
platform provider to input Merchant 
and/or Service Provider’s SST 
registration number 
Where Merchant and/or Service 
Provider is not registered for SST, 
e-commerce platform provider to 
input “NA”  
7 Supplier’s 
Malaysia 
Standard 
Industrial 
Classification 
(MSIC code) 
MSIC code of 
Merchant and/or 
Service Provider 
Where applicable, e-commerce 
platform provider to input Merchant 
and/or Service Provider’s MSIC 
code 
e-commerce platform provider to 
input “00000” if such information is 
not applicable, not available or not 
provided 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
116 
 
No. Data field Details to be 
included by  
e-commerce 
platform provider 
in a self-billed  
e-Invoice 
Additional remarks  
8 Classification  Classification of 
products or 
services 
e-commerce platform provider to 
input a 3-digit integer (e.g., “000” to 
“999”), in accordance with the 
catalogue set by IRBM  
Table 14.2 – Details required to be input by e-commerce platform provider for issuance of 
self-billed e-Invoice 
 
14.6 Issuance of e-Invoice from e-commerce platform provider to Merchant 
and/or Service Provider 
14.6.1 Generally,  e-commerce  platform  provider  will  impose  charges  to 
Merchant and/or Service Provider for the use of platform. 
14.6.2 Upon  implementation of  e-Invoice,  the  e-commerce  platform 
provider  is  responsible  to  issue  an  e-Invoice  for  the  charges 
imposed  to  Merchant  and/or  Service  Provider  for  the  use  of 
platform. 
14.6.3 For  the  purposes  of  e-Invoice  issuance,  the  roles  of  the  parties 
would be as follows: 
(a) Supplier: e-commerce platform provider 
(b) Buyer: Merchant and/or Service Provider 
14.6.4 The process of issuing the e-Invoice by the e-commerce platform 
provider shall follow the detailed e-Invoice workflow as discussed 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
117 
 
in Section 2.3 (e-Invoice model via MyInvois Portal) and Section 
2.4 (e-Invoice model via API) of the e-Invoice Guideline.  
14.6.5 The information required to be included in the e-Invoice are as per 
the  required  data  fields  outlined  in  Appendices  1  and  2  of  the  
e-Invoice   Guideline.   The   following   details   would   assist   the  
e-commerce platform provider in issuing the e-Invoice:  
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Merchant 
and/or Service 
Provider 
For Business: Name of business  
For Malaysian individuals: Full 
name as per MyKad / MyTentera 
For non-Malaysian individuals: Full 
name as per passport / MyPR / 
MyKAS  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
118 
 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional Remarks 
2 Buyer’s TIN TIN of Merchant 
and/or Service 
Provider 
For Malaysian Business 
e-commerce platform provider to 
input Merchant and/or Service 
Provider’s TIN 
For Foreign Business 
Where available, e-commerce 
platform provider to input Merchant 
and/or Service Provider’s TIN 
Where TIN is not available or not 
provided, e-commerce platform 
provider to input “EI00000000020” for 
Foreign Merchant and/or Service 
Provider 
For Malaysian Individuals 
i. Option 1: TIN only 
ii. Option 2: MyKad / MyTentera 
identification number only 
iii. Option 3: Both TIN and MyKad 
/ MyTentera identification 
number 
For non-Malaysian individuals 
i. Option 1: TIN only 
ii. Option 2: Both TIN and 
passport number / MyPR / 
MyKAS identification number 
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of 
registration / 
identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
119 
 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional Remarks 
For   clarity,   (i)   refers   to   the   TIN 
assigned  by  IRBM.  In  the  event  that 
the non-Malaysian individual does not 
have  a  TIN, Supplier  may  use  the 
general TIN (as listed in Appendix 1 of 
this e-Invoice   Specific   Guideline), 
along  with  the  passport /  MyPR / 
MyKAS  identification  number of  the 
said individual 
4 Buyer’s 
Address  
Address of 
Merchant and/or 
Service Provider 
E-commerce platform provider to 
input the business address (for 
business) / residential address (for 
individual) of Merchant and/or 
Service Provider 
5 Buyer’s 
Contact 
Number  
Telephone number 
of Merchant and/or 
Service Provider 
E-commerce platform provider to 
input the contact number of 
Merchant and/or Service Provider 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Merchant 
and/or Service 
Provider  
Where applicable, e-commerce 
platform provider to input Merchant 
and/or Service Provider’s SST 
registration number 
Where Merchant and/or Service 
Provider is not registered for SST,  
e-commerce platform provider to 
input “NA” 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
120 
 
No Data field Details to be 
included by  
e-commerce 
platform provider 
in an e-Invoice 
Additional Remarks 
7 Classification Classification of 
products or services  
e-commerce platform provider to 
input a 3-digit integer (e.g., “000” to 
“999”), in accordance with the 
catalogue set by IRBM 
Table 14.3 – Details required to be input by e-commerce platform provider for issuance of an 
e-Invoice 
 
15. CYBERSECURITY 
LHDNM  will  ensure  that  MyInvois  System complies and  certified  with  ISO/IEC 
27001   Information   Security   Management   System   (ISMS)   and   ISO   22301 
Business Continuity Management System BCMS Audit Certification. 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
121 
 
16. E-INVOICE TREATMENT DURING INTERIM    
RELAXATION PERIOD  
16.1 To  ensure  the  smooth  transitioning  and implementation  of  e-Invoice, the 
Government of Malaysia has agreed to provide taxpayers a six (6)-month 
interim  relaxation period  from  the  date  of  mandatory  implementation  of 
each implementation phase, as follows: 
No. Targeted Taxpayers  
Interim Relaxation 
Period  
1.  
Taxpayers with an annual turnover or revenue 
of more than RM100 million 
1 August 2024 to  
31 January 2025 
2.  
Taxpayers with an annual turnover or revenue 
of more than RM25 million and up to RM100 
million 
1 January 2025 to  
30 June 2025 
3.  
Taxpayers with an annual turnover or revenue 
of more than RM5 million and up to RM25 
million 
1 July 2025 to  
31 December 2025 
4.  
Taxpayers with an annual turnover or revenue 
of up to RM5 million 
i) 1 January 2026 implementation date 
ii) 1 July 2026 implementation date 
Until  
31 December 2026 
Table 16.1 – Interim relaxation period for each implementation phase 
 
16.2 During the interim relaxation period, Government of Malaysia has agreed 
to allow taxpayers to adopt the following: 
(a) issue consolidated e-Invoice for all activities and transactions, including 
the industries  or  activities  listed under Section  3.7  of  this  e-Invoice 
Specific Guideline. 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
122 
 
(b) issue consolidated self-billed e-Invoice for all self-billed circumstances 
outlined under Section 8.3 of this e-Invoice Specific Guideline. 
(c) input any information / details in the “Description of Product or Service” 
field in the consolidated e-Invoice or consolidated self-billed e-Invoice. 
In  other  words,  taxpayers  are  not  restricted  to  input  the  receipt  / 
statement / bill reference numbers as required under Section 3 and 4 of 
this e-Invoice Specific Guideline. 
(d) not to issue individual e-Invoice or individual self-billed e-Invoice, even 
if the buyer (in the case of e-Invoice) / supplier (in the case of self-billed 
e-Invoice) has made a request for an individual e-Invoice or individual 
self-billed  e-Invoice  to  be  issued,  provided  that  the  taxpayers  comply 
with item (a) or (b) above, as the case may be.  
16.3 Additionally, the  IRBM  will  not  undertake  any prosecution  action  under 
Section 120 of the Income Tax Act 1967 during the interim relaxation period 
on non-compliance of the e-Invoice requirements, provided that taxpayers 
comply with the requirements mentioned under Section 16.2 (a) and (b) of 
this e-Invoice Specific Guideline.  
 
 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
123 
 
APPENDIX 1 – LIST OF GENERAL TIN 
No General TIN Applicable to the following transaction 
1 “EI00000000010” as 
General Public’s TIN 
 
i. Individual’s (i.e., Supplier, Buyer, Shipping 
Recipient) TIN in the e-Invoice for Malaysian 
individual where the individual only provides 
MyKad / MyTentera identification number 
ii. Buyer’s TIN in the consolidated e-Invoice  
iii. Supplier’s TIN in the consolidated self-billed  
e-Invoice 
2 “EI00000000020” as 
Foreign Buyer’s / 
Foreign Shipping 
Recipient’s TIN 
i. Buyer’s TIN in the e-Invoice for non-Malaysian 
individual where the individual buyer only 
provides passport number / MyPR / MyKAS 
identification number 
ii. Buyer’s TIN for export transactions where foreign 
buyer’s TIN is not available or not provided   
iii. Shipping Recipient’s TIN for where foreign 
shipping recipient’s TIN is not available or not 
provided 
3 “EI00000000030” as 
Foreign Supplier’s TIN 
i. Supplier’s TIN in the e-Invoice for  
non-Malaysian individual where the individual 
supplier only provides passport number/ MyPR/ 
MyKAS identification number (applicable for  
self-billed e-Invoice) 
ii. Supplier’s TIN for import transactions where 
foreign supplier’s TIN is not available or not 
provided (applicable for self-billed e-Invoice) 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
124 
 
No General TIN Applicable to the following transaction 
4 “EI00000000040” as 
Buyer’s TIN  
Buyer’s TIN for transactions involving the following 
persons: 
• Government 
• State government and state authority 
• Government authority 
• Local authority 
• Statutory authority and statutory body 
• Exempt institutions that are not assigned with TIN  
Appendix Table 1 – List of general TIN 
  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
125 
 
APPENDIX 2 – BUYER’S DETAILS IN CONSOLIDATED  
E-INVOICE 
No Data field Details to be input 
by Supplier in  
e-Invoice 
Additional Remarks 
1 Buyer’s Name  Name of Buyer Supplier to input “General 
Public” in the e-Invoice 
2 Buyer’s TIN TIN of Buyer Supplier to input 
“EI00000000010” in the  
e-Invoice  
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of registration / 
identification number / 
passport number 
Supplier to input “NA” 
4 Buyer’s Address  Address of Buyer Supplier to input “NA” 
5 Buyer’s Contact 
Number  
Telephone number of 
Buyer 
Supplier to input “NA” 
6 Buyer’s SST 
Registration 
Number 
SST registration 
number of Buyer  
Supplier to input “NA” 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
126 
 
No Data field Details to be input 
by Supplier in  
e-Invoice 
Additional Remarks 
7 Description of 
Product / 
Services 
Details of products or 
services being billed 
for a transaction with 
customers 
IRBM   allows   the   Suppliers   to 
adopt one  (or  a  combination)  of 
the following methods:  
(a) Summary  of  each  receipt  is 
presented   as   separate   line 
items 
(b) List of receipts (in a 
continuous receipt number) is 
presented  as  line  items  (i.e., 
where  there  is  a  break  of the 
receipt number chain, the next 
chain  shall  be included  as  a 
new line item)  
(c) Branch(es) or  location(s) will 
submit consolidated e-Invoice, 
adopting   either   (a)   or   (b) 
above  for  the  receipts  issued 
by   the   said   branch(es) or 
location(s) 
Note that for any method adopted 
by     businesses,     the receipt 
reference    number    for    each 
transaction  are  required  to  be 
included under  this  field in  the 
consolidated e-Invoice 
Appendix Table 2 – Buyer’s details in consolidated e-Invoice 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
127 
 
APPENDIX 3 – PARTIES OF SELF-BILLED E-INVOICE 
For the purposes of self-billed e-Invoice, the parties of the e-Invoice are as follows:   
No Transaction Supplier Buyer 
(assumes the role of 
Supplier and issue  
self-billed e-Invoice) 
1 Payment to agents, 
dealers, distributors, etc. 
Agents, dealers, 
distributors, etc. 
Taxpayer that makes 
the payment 
2 Goods sold or services 
rendered by foreign 
suppliers 
Foreign Seller Malaysian Purchaser 
3 Profit distribution (e.g., 
dividend distribution)  
Recipient of the 
distribution 
Taxpayer that makes 
the distribution  
4 e-Commerce  Merchant, service 
providers  
(e.g., driver, rider) 
e-Commerce / 
Intermediary platform 
 
5 Pay-out to all betting and 
gaming winners 
Recipient of the pay-
out 
Licensed betting and 
gaming provider 
6 Transactions with 
individuals who are not 
conducting a business 
Individual not 
conducting a business 
Person transacting with 
the individual not 
conducting a business 
7 Interest payment  Recipient of interest 
payment 
Taxpayer that makes 
the interest payment 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
128 
 
No Transaction Supplier Buyer 
(assumes the role of 
Supplier and issue  
self-billed e-Invoice) 
8 Claim, compensation or 
benefit payments from 
the insurance business 
of an insurer 
Policyholder / 
Beneficiary 
Insurer 
9 Payment in relation to 
capital reduction, share / 
capital / unit redemption, 
share buyback, return of 
capital or liquidation 
proceeds 
Investor Investee 
Appendix Table 3 – Parties of self-billed e-Invoice 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
129 
 
APPENDIX 4 – BUYER’S DETAILS FOR TRANSACTION 
WITH INDIVIDUALS 
No Data field Details to be input 
by Supplier in  
e-Invoice 
Additional Remarks 
1 Buyer’s 
Name 
Name of individual 
Buyer  
For Malaysian individuals: Full name 
as per MyKad / MyTentera 
For non-Malaysian individuals: Full 
name as per passport / MyPR / MyKAS  
2 Buyer’s TIN TIN of individual 
Buyer  
For Malaysian individuals 
i. Option 1: TIN only  
ii. Option 2: MyKad / MyTentera 
identification number only   
iii. Option 3: Both TIN and MyKad / 
MyTentera identification number 
For non-Malaysian individuals  
i. Option 1: TIN only  
ii. Option 2: Both TIN and passport 
number / MyPR / MyKAS 
identification number 
For clarity, (i) refers to the TIN assigned 
by  IRBM.  In  the  event  that  the  non-
Malaysian  individual  does  not  have  a 
TIN, Supplier may use the general TIN 
(as listed in Appendix 1 of this e-Invoice 
Specific   Guideline),   along   with   the 
passport  number /  MyPR /  MyKAS 
identification    number of    the    said 
individual.  
3 Buyer’s 
Registration / 
Identification 
Number / 
Passport 
Number 
Details of 
registration / 
identification 
number / passport 
number 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
130 
 
No Data field Details to be input 
by Supplier in  
e-Invoice 
Additional Remarks 
4 Buyer’s 
Address 
Address of 
individual Buyer  
Individual Buyer is required to provide 
residential address  
5 Buyer’s 
Contact 
Number  
Telephone number 
of individual Buyer 
Individual Buyer is required to provide 
a contact number  
6 Buyer’s SST 
Registration 
Number 
 
SST registration 
number of 
individual Buyer  
Where applicable, Supplier to input 
SST registration number  
If individual Buyer is not registered for 
SST, Supplier to input “NA” 
Appendix Table 4 – Buyer’s details for transaction with individuals 

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
131 
 
APPENDIX 5 – GENERAL AND INDUSTRY-SPECIFIC 
FREQUENTLY ASKED QUESTIONS (FAQ) 
The   FAQ   documents   provided   below,   both   general   and   industry-specific,   are 
organised  in  a  question-and-answer  format  to  facilitate  taxpayers'  understanding  of  
e-Invoice. Note that these FAQs may be reviewed and updated from time to time and 
taxpayers should refer to IRBM e-Invoice microsite for the latest guidance. 
No. Area / Industry Link to FAQ 
1.  General  https://www.hasil.gov.my/media/0xqitc2t/lhdnm-e-
invoice-general-faqs.pdf  
2.  Healthcare https://www.hasil.gov.my/media/atse5ojz/lhdnm_he
althcare_faqs.pdf  
3.  Construction https://www.hasil.gov.my/media/vjrp4mt3/lhdnm_co
nstruction-industry_specific-faqs.pdf  
4.  Telecommunication https://www.hasil.gov.my/media/q0okpo0o/lhdnm_in
dustry-specific-
faqs_telecommunication_microsite_bi.pdf  
5.  e-Commerce https://www.hasil.gov.my/media/1xwaitfw/lhdnm_ind
ustry-specific-faqs_e-commerce_microsite_bi.pdf  
6.  Petroleum 
Operations 
https://www.hasil.gov.my/media/wwjb5sof/lhdnm_in
dustry-specific-faqs_petroleum-
operations_bi_v2.pdf  
7.  Insurance and 
Takaful  
https://www.hasil.gov.my/media/qpsncvwd/specific-
faq-insurance-and-takaful.pdf  
8.  Aviation https://www.hasil.gov.my/media/rl4b3h13/lhdnm_avi
ation-faqs.pdf  

E-INVOICE SPECIFIC GUIDELINE (VERSION 4.6) 
132 
 
9.  Tourism https://www.hasil.gov.my/media/w2cbhy3e/lhdnm_t
ourism_faqs.pdf  
10.  Financial Services, 
Stockbroking, Unit 
Trust and Money 
Changing Services 
https://www.hasil.gov.my/media/acil1u20/specific-
faq-financial-services-stockbroking-and-unit-
trust.pdf  
11.  Donations or 
Contributions 
https://www.hasil.gov.my/media/sfmnjwgg/specific-
faq-donations-or-contributions.pdf  
Appendix Table 5 – General and Industry-Specific FAQ `,
  },
] as const;

async function main(): Promise<void> {
  const summary: IngestionSummaryRow[] = [];

  for (const doc of DOCUMENTS) {
    const cleaned = cleanText(doc.text);
    const chunks = chunkText(cleaned, doc.source, doc.doc_title);
    const embedded = await embedInBatches(chunks);
    await insertToSupabase(embedded);

    summary.push({
      source: doc.source,
      chunks: embedded.length,
      documentTitle: doc.doc_title,
    });
  }

  printSummary(summary);
}

main().catch((error) => {
  console.error("ingest-from-text failed", error);
  process.exit(1);
});
