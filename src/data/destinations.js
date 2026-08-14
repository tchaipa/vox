export const destinations = [
  {
    id: "victoria-falls",
    name: "Victoria Falls",
    country: "Zimbabwe",
    region: "local",
    image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1000&q=80",
    blurb: "Mosi-oa-Tunya, 'the smoke that thunders' — our most-requested departure point and the gateway to the Zambezi.",
  },
  {
    id: "hwange",
    name: "Hwange National Park",
    country: "Zimbabwe",
    region: "local",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&q=80",
    blurb: "Zimbabwe's largest park, with one of the continent's densest elephant populations around its pumped waterholes.",
  },
  {
    id: "mana-pools",
    name: "Mana Pools",
    country: "Zimbabwe",
    region: "local",
    image: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?w=1000&q=80",
    blurb: "A UNESCO World Heritage floodplain on the Zambezi, best explored on foot or by canoe rather than from a vehicle.",
  },
  {
    id: "eastern-highlands",
    name: "Eastern Highlands",
    country: "Zimbabwe",
    region: "local",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000&q=80",
    blurb: "Nyanga, Chimanimani and Vumba — misty peaks, tea estates and trout streams along the Mozambican border.",
  },
  {
    id: "great-zimbabwe",
    name: "Great Zimbabwe",
    country: "Zimbabwe",
    region: "local",
    image: "https://images.unsplash.com/photo-1591634616938-1dfa03bda31c?w=1000&q=80",
    blurb: "The dry-stone ruins that gave the country its name, near Masvingo and Lake Mutirikwi.",
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "international",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1000&q=80",
    blurb: "Table Mountain, the Winelands and the Atlantic seaboard — our most popular international short-hop.",
  },
  {
    id: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    region: "international",
    image: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=1000&q=80",
    blurb: "Endless plains and the annual wildebeest migration, run as mobile-camp itineraries timed to the herds.",
  },
  {
    id: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    region: "international",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000&q=80",
    blurb: "Stone Town's spice-trade history paired with the northeast coast's reef and sandbanks.",
  },
];

export function getDestinationById(id) {
  return destinations.find((d) => d.id === id);
}
