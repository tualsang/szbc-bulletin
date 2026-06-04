export const CHURCH_INFO = {
  name: 'SHALOM ZOMI BAPTIST CHURCH',
  verse: '"Kei hong um mi peuhmah a sih hangin nungta ding hi." Johan 11:25',
  address: '9801 Arlington Church Rd, Mint Hill, NC 28227 @ 2:00 P.M. - 4:00 P.M.',
  zelle: {
    main: 'szbc2022@gmail.com',
    building: 'szbc2015@gmail.com',
  },
  contacts: [
    { role: 'Pastor', name: 'Revd. Lian Za Sum', phone: '+1 (980) 298-8794' },
    { role: 'Pastor', name: 'Revd. Ning Ngaih Muang', phone: '+1 (704) 891-4803' },
    { role: 'Pastor', name: 'Pastor Thang Tawn Mung', phone: '+1 (704) 890-8733' },
    { role: 'President', name: 'Upa Pau Gin Tung', phone: '+1 (704) 906-4365' },
    { role: 'Secretary', name: 'Upa Dongh Lam Cin', phone: '+1 (704) 705-9228' },
  ],
} as const;

// Verify both rosters with the pastor before launch.
export const COMMUNION_GROUPS: Record<1 | 2, string[]> = {
  1: [
    'Upa Pau Gin Tung',
    'Upa Leeng Kap Emanuel',
    'Upa Kham Lam Mang',
    'Upa Ngin Ngo Kap',
    'Upa Zam Cin Kam',
    'Upa Khan Cin Thang',
  ],
  2: [
    'Upa Dongh Lam Cin',
    'Upa Nang Biak Lian',
    'Upa Thang Cin Khup',
    'Upa Huat Deih Piang',
    'Upa Ngin Tuan Pau',
    'Upa Cin En Piang',
  ],
};
