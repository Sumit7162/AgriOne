'use client';

import { useActionState, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCommodityPrices, type MandiPriceState } from './actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Search, ArrowUpDown } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Commodity } from '@/ai/flows/get-fasal-price';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const markets = {
  'Andaman and Nicobar': [{ value: 'AN_Port Blair', label: 'Port Blair' }],
  'Andhra Pradesh': [
    { value: 'AP_Adoni', label: 'Adoni' },
    { value: 'AP_Guntur', label: 'Guntur' },
    { value: 'AP_Kurnool', label: 'Kurnool' },
    { value: 'AP_Anantapur', label: 'Anantapur' },
    { value: 'AP_Chittoor', label: 'Chittoor' },
    { value: 'AP_Cuddapah', label: 'Cuddapah' },
    { value: 'AP_Eluru', label: 'Eluru' },
    { value: 'AP_Kakinada', label: 'Kakinada' },
    { value: 'AP_Nellore', label: 'Nellore' },
    { value: 'AP_Ongole', label: 'Ongole' },
    { value: 'AP_Rajahmundry', label: 'Rajahmundry' },
    { value: 'AP_Tirupati', label: 'Tirupati' },
    { value: 'AP_Vijayawada', label: 'Vijayawada' },
    { value: 'AP_Visakhapatnam', label: 'Visakhapatnam' },
  ],
  'Arunachal Pradesh': [
    { value: 'AR_Itanagar', label: 'Itanagar' },
    { value: 'AR_Naharlagun', label: 'Naharlagun' },
  ],
  'Assam': [
    { value: 'AS_Guwahati', label: 'Guwahati' },
    { value: 'AS_Dispur', label: 'Dispur' },
    { value: 'AS_Dibrugarh', label: 'Dibrugarh' },
    { value: 'AS_Jorhat', label: 'Jorhat' },
    { value: 'AS_Silchar', label: 'Silchar' },
  ],
  'Bihar': [
    { value: 'BR_Patna', label: 'Patna' },
    { value: 'BR_Gaya', label: 'Gaya' },
    { value: 'BR_Bhagalpur', label: 'Bhagalpur' },
    { value: 'BR_Muzaffarpur', label: 'Muzaffarpur' },
    { value: 'BR_Purnia', label: 'Purnia' },
  ],
  'Chandigarh': [{ value: 'CH_Chandigarh', label: 'Chandigarh' }],
  'Chhattisgarh': [
    { value: 'CT_Raipur', label: 'Raipur' },
    { value: 'CT_Bhilai', label: 'Bhilai' },
    { value: 'CT_Bilaspur', label: 'Bilaspur' },
    { value: 'CT_Durg', label: 'Durg' },
    { value: 'CT_Jagdalpur', label: 'Jagdalpur' },
  ],
  'Dadra and Nagar Haveli': [{ value: 'DN_Silvassa', label: 'Silvassa' }],
  'Daman and Diu': [{ value: 'DD_Daman', label: 'Daman' }],
  'Delhi': [{ value: 'DL_Delhi', label: 'Azadpur, Delhi' }],
  'Goa': [
    { value: 'GA_Panaji', label: 'Panaji' },
    { value: 'GA_Margao', label: 'Margao' },
  ],
  'Gujarat': [
    { value: 'GJ_Ahmedabad', label: 'Ahmedabad' },
    { value: 'GJ_Surat', label: 'Surat' },
    { value: 'GJ_Vadodara', label: 'Vadodara' },
    { value: 'GJ_Rajkot', label: 'Rajkot' },
    { value: 'GJ_Anand', label: 'Anand' },
    { value: 'GJ_Bhavnagar', label: 'Bhavnagar' },
    { value: 'GJ_Gondal', label: 'Gondal' },
    { value: 'GJ_Jamnagar', label: 'Jamnagar' },
    { value: 'GJ_Mehsana', label: 'Mehsana' },
    { value: 'GJ_Unjha', label: 'Unjha' },
  ],
  'Haryana': [
    { value: 'HR_Faridabad', label: 'Faridabad' },
    { value: 'HR_Gurgaon', label: 'Gurgaon' },
    { value: 'HR_Ambala', label: 'Ambala' },
    { value: 'HR_Hisar', label: 'Hisar' },
    { value: 'HR_Karnal', label: 'Karnal' },
    { value: 'HR_Panipat', label: 'Panipat' },
    { value: 'HR_Rohtak', label: 'Rohtak' },
    { value: 'HR_Sirsa', label: 'Sirsa' },
  ],
  'Himachal Pradesh': [
    { value: 'HP_Shimla', label: 'Shimla' },
    { value: 'HP_Mandi', label: 'Mandi' },
    { value: 'HP_Solan', label: 'Solan' },
    { value: 'HP_Kullu', label: 'Kullu' },
  ],
  'Jammu and Kashmir': [
    { value: 'JK_Srinagar', label: 'Srinagar' },
    { value: 'JK_Jammu', label: 'Jammu' },
    { value: 'JK_Anantnag', label: 'Anantnag' },
  ],
  'Jharkhand': [
    { value: 'JH_Ranchi', label: 'Ranchi' },
    { value: 'JH_Jamshedpur', label: 'Jamshedpur' },
    { value: 'JH_Dhanbad', label: 'Dhanbad' },
  ],
  'Karnataka': [
    { value: 'KA_Bangalore', label: 'Bangalore' },
    { value: 'KA_Hubli', label: 'Hubli' },
    { value: 'KA_Mysore', label: 'Mysore' },
    { value: 'KA_Belgaum', label: 'Belgaum' },
    { value: 'KA_Davanagere', label: 'Davanagere' },
    { value: 'KA_Gulbarga', label: 'Gulbarga' },
    { value: 'KA_Shimoga', label: 'Shimoga' },
    { value: 'KA_Tumkur', label: 'Tumkur' },
  ],
  'Kerala': [
    { value: 'KL_Kochi', label: 'Kochi' },
    { value: 'KL_Thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'KL_Kozhikode', label: 'Kozhikode' },
    { value: 'KL_Thrissur', label: 'Thrissur' },
  ],
  'Lakshadweep': [{ value: 'LD_Kavaratti', label: 'Kavaratti' }],
  'Madhya Pradesh': [
    { value: 'MP_Bhopal', label: 'Bhopal' },
    { value: 'MP_Indore', label: 'Indore' },
    { value: 'MP_Jabalpur', label: 'Jabalpur' },
    { value: 'MP_Gwalior', label: 'Gwalior' },
    { value: 'MP_Ujjain', label: 'Ujjain' },
    { value: 'MP_Neemuch', label: 'Neemuch' },
    { value: 'MP_Mandsaur', label: 'Mandsaur' },
  ],
  'Maharashtra': [
    { value: 'MH_Mumbai', label: 'Mumbai' },
    { value: 'MH_Pune', label: 'Pune' },
    { value: 'MH_Nagpur', label: 'Nagpur' },
    { value: 'MH_Nashik', label: 'Nashik' },
    { value: 'MH_Kolhapur', label: 'Kolhapur' },
    { value: 'MH_Lasalgaon', label: 'Lasalgaon' },
    { value: 'MH_Sangli', label: 'Sangli' },
    { value: 'MH_Solapur', label: 'Solapur' },
  ],
  'Manipur': [{ value: 'MN_Imphal', label: 'Imphal' }],
  'Meghalaya': [{ value: 'ML_Shillong', label: 'Shillong' }],
  'Mizoram': [{ value: 'MZ_Aizawl', label: 'Aizawl' }],
  'Nagaland': [{ value: 'NL_Kohima', label: 'Kohima' }],
  'Odisha': [
    { value: 'OR_Bhubaneswar', label: 'Bhubaneswar' },
    { value: 'OR_Cuttack', label: 'Cuttack' },
    { value: 'OR_Rourkela', label: 'Rourkela' },
    { value: 'OR_Sambalpur', label: 'Sambalpur' },
  ],
  'Puducherry': [{ value: 'PY_Puducherry', label: 'Puducherry' }],
  'Punjab': [
    { value: 'PB_Ludhiana', label: 'Ludhiana' },
    { value: 'PB_Amritsar', label: 'Amritsar' },
    { value: 'PB_Jalandhar', label: 'Jalandhar' },
    { value: 'PB_Patiala', label: 'Patiala' },
    { value: 'PB_Khanna', label: 'Khanna' },
  ],
  'Rajasthan': [
    { value: 'RJ_Jaipur', label: 'Jaipur' },
    { value: 'RJ_Jodhpur', label: 'Jodhpur' },
    { value: 'RJ_Kota', label: 'Kota' },
    { value: 'RJ_Bikaner', label: 'Bikaner' },
    { value: 'RJ_Udaipur', label: 'Udaipur' },
  ],
  'Sikkim': [{ value: 'SK_Gangtok', label: 'Gangtok' }],
  'Tamil Nadu': [
    { value: 'TN_Chennai', label: 'Chennai' },
    { value: 'TN_Coimbatore', label: 'Coimbatore' },
    { value: 'TN_Madurai', label: 'Madurai' },
    { value: 'TN_Dindigul', label: 'Dindigul' },
    { value: 'TN_Erode', label: 'Erode' },
    { value: 'TN_Salem', label: 'Salem' },
  ],
  'Telangana': [
    { value: 'TS_Hyderabad', label: 'Hyderabad' },
    { value: 'TS_Warangal', label: 'Warangal' },
    { value: 'TS_Nizamabad', label: 'Nizamabad' },
    { value: 'TS_Karimnagar', label: 'Karimnagar' },
  ],
  'Tripura': [{ value: 'TR_Agartala', label: 'Agartala' }],
  'Uttar Pradesh': [
    { value: 'UP_Lucknow', label: 'Lucknow' },
    { value: 'UP_Kanpur', label: 'Kanpur' },
    { value: 'UP_Varanasi', label: 'Varanasi' },
    { value: 'UP_Agra', label: 'Agra' },
    { value: 'UP_Allahabad', label: 'Allahabad' },
    { value: 'UP_Meerut', label: 'Meerut' },
    { value: 'UP_Hapur', label: 'Hapur' },
  ],
  'Uttarakhand': [
    { value: 'UT_Dehradun', label: 'Dehradun' },
    { value: 'UT_Haridwar', label: 'Haridwar' },
    { value: 'UT_Haldwani', label: 'Haldwani' },
  ],
  'West Bengal': [
    { value: 'WB_Kolkata', label: 'Kolkata' },
    { value: 'WB_Asansol', label: 'Asansol' },
    { value: 'WB_Siliguri', label: 'Siliguri' },
  ],
};
const states = Object.keys(markets);
const commodities = [
  "Apple", "Banana", "Barley (Jau)", "Brinjal", "Cabbage", "Carrot", "Cauliflower", 
  "Chilli", "Coriander", "Cotton", "Garlic", "Ginger", "Grapes", "Gram (Chana)", 
  "Groundnut", "Guar Seed", "Jowar (Sorghum)", "Lemon", "Lentil (Masur)", 
  "Maize", "Mango", "Mustard", "Okra (Lady's Finger)", "Onion", "Orange", 
  "Paddy (Dhan)", "Peas", "Pigeon Pea (Arhar/Tur)", "Pineapple", "Potato", "Pumpkin", 
  "Radish", "Rice", "Safflower", "Sesame (Til)", "Soyabean", "Sugarcane", 
  "Sunflower", "Tomato", "Turmeric", "Urad Dal (Black Gram)", "Wheat"
];

const initialState: MandiPriceState = {};

type SortKey = keyof Commodity;
type SortDirection = 'asc' | 'desc';

export function MandiPricesForm() {
  const [state, formAction] = useActionState(getCommodityPrices, initialState);
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'commodity', direction: 'asc' });
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');

  const availableMarkets = selectedState ? markets[selectedState as keyof typeof markets] : [];

  const filteredAndSortedCommodities = useMemo(() => {
    let filteredItems = [...(state.data?.commodities || [])];

    if (selectedCommodity && selectedCommodity !== 'all') {
      filteredItems = filteredItems.filter(item => item.commodity.toLowerCase() === selectedCommodity.toLowerCase());
    }

    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredItems;
  }, [state.data?.commodities, sortConfig, selectedCommodity]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedMarket('');
  }

  const SortableHeader = ({ sortKey, label }: { sortKey: SortKey; label: string }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => requestSort(sortKey)}>
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );


  return (
    <div className="grid gap-8">
      <Card className="max-w-4xl mx-auto w-full">
        <form action={formAction}>
           <input type="hidden" name="market" value={selectedMarket} />
          <CardHeader>
            <CardTitle className="font-headline">{t('mandi_prices.form_title')}</CardTitle>
            <CardDescription>{t('mandi_prices.form_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">{t('mandi_prices.state_label')}</Label>
                  <Select onValueChange={handleStateChange} value={selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('mandi_prices.state_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="market">{t('mandi_prices.market_label')}</Label>
                  <Select onValueChange={setSelectedMarket} value={selectedMarket} disabled={!selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('mandi_prices.market_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMarkets.map((market) => (
                        <SelectItem key={market.value} value={market.value}>
                          {market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commodity">{t('mandi_prices.commodity_label')}</Label>
                  <Select onValueChange={setSelectedCommodity} value={selectedCommodity}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('mandi_prices.commodity_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('mandi_prices.all_commodities')}</SelectItem>
                        {commodities.map((commodity) => (
                            <SelectItem key={commodity} value={commodity}>
                            {commodity}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertTitle>{t('common.error')}</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full" disabled={!selectedMarket}>
              <Search />
              {t('mandi_prices.submit_button')}
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      {state.data && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('mandi_prices.results_title', { market: markets[selectedState as keyof typeof markets]?.find(m => m.value === state.market!)?.label || state.market! })}</CardTitle>
            <CardDescription>{t('mandi_prices.results_description')}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader sortKey="commodity" label={t('mandi_prices.table_commodity')} />
                        <SortableHeader sortKey="min_price" label={t('mandi_prices.table_min_price')} />
                        <SortableHeader sortKey="max_price" label={t('mandi_prices.table_max_price')} />
                        <SortableHeader sortKey="modal_price" label={t('mandi_prices.table_modal_price')} />
                        <TableHead>{t('mandi_prices.table_unit')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedCommodities.length > 0 ? (
                        filteredAndSortedCommodities.map((item) => (
                            <TableRow key={item.commodity}>
                                <TableCell className="font-medium">{item.commodity}</TableCell>
                                <TableCell>₹{item.min_price.toLocaleString()}</TableCell>
                                <TableCell>₹{item.max_price.toLocaleString()}</TableCell>
                                <TableCell className="font-bold text-primary">₹{item.modal_price.toLocaleString()}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                               {t('mandi_prices.no_data')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
