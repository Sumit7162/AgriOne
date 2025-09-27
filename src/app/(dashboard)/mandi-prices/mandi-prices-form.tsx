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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCommodityPrices, type MandiPriceState } from './actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Landmark, Search, ArrowUpDown } from 'lucide-react';
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
  ],
  'Arunachal Pradesh': [{ value: 'AR_Itanagar', label: 'Itanagar' }],
  'Assam': [
    { value: 'AS_Guwahati', label: 'Guwahati' },
    { value: 'AS_Dispur', label: 'Dispur' },
  ],
  'Bihar': [
    { value: 'BR_Patna', label: 'Patna' },
    { value: 'BR_Gaya', label: 'Gaya' },
  ],
  'Chandigarh': [{ value: 'CH_Chandigarh', label: 'Chandigarh' }],
  'Chhattisgarh': [
    { value: 'CT_Raipur', label: 'Raipur' },
    { value: 'CT_Bhilai', label: 'Bhilai' },
  ],
  'Dadra and Nagar Haveli': [{ value: 'DN_Silvassa', label: 'Silvassa' }],
  'Daman and Diu': [{ value: 'DD_Daman', label: 'Daman' }],
  'Delhi': [{ value: 'DL_Delhi', label: 'Delhi' }],
  'Goa': [{ value: 'GA_Panaji', label: 'Panaji' }],
  'Gujarat': [
    { value: 'GJ_Ahmedabad', label: 'Ahmedabad' },
    { value: 'GJ_Surat', label: 'Surat' },
    { value: 'GJ_Vadodara', label: 'Vadodara' },
    { value: 'GJ_Rajkot', label: 'Rajkot' },
  ],
  'Haryana': [
    { value: 'HR_Faridabad', label: 'Faridabad' },
    { value: 'HR_Gurgaon', label: 'Gurgaon' },
  ],
  'Himachal Pradesh': [
    { value: 'HP_Shimla', label: 'Shimla' },
    { value: 'HP_Mandi', label: 'Mandi' },
  ],
  'Jammu and Kashmir': [
    { value: 'JK_Srinagar', label: 'Srinagar' },
    { value: 'JK_Jammu', label: 'Jammu' },
  ],
  'Jharkhand': [
    { value: 'JH_Ranchi', label: 'Ranchi' },
    { value: 'JH_Jamshedpur', label: 'Jamshedpur' },
  ],
  'Karnataka': [
    { value: 'KA_Bangalore', label: 'Bangalore' },
    { value: 'KA_Hubli', label: 'Hubli' },
    { value: 'KA_Mysore', label: 'Mysore' },
  ],
  'Kerala': [
    { value: 'KL_Kochi', label: 'Kochi' },
    { value: 'KL_Thiruvananthapuram', label: 'Thiruvananthapuram' },
  ],
  'Lakshadweep': [{ value: 'LD_Kavaratti', label: 'Kavaratti' }],
  'Madhya Pradesh': [
    { value: 'MP_Bhopal', label: 'Bhopal' },
    { value: 'MP_Indore', label: 'Indore' },
    { value: 'MP_Jabalpur', label: 'Jabalpur' },
  ],
  'Maharashtra': [
    { value: 'MH_Mumbai', label: 'Mumbai' },
    { value: 'MH_Pune', label: 'Pune' },
    { value: 'MH_Nagpur', label: 'Nagpur' },
  ],
  'Manipur': [{ value: 'MN_Imphal', label: 'Imphal' }],
  'Meghalaya': [{ value: 'ML_Shillong', label: 'Shillong' }],
  'Mizoram': [{ value: 'MZ_Aizawl', label: 'Aizawl' }],
  'Nagaland': [{ value: 'NL_Kohima', label: 'Kohima' }],
  'Odisha': [
    { value: 'OR_Bhubaneswar', label: 'Bhubaneswar' },
    { value: 'OR_Cuttack', label: 'Cuttack' },
  ],
  'Puducherry': [{ value: 'PY_Puducherry', label: 'Puducherry' }],
  'Punjab': [
    { value: 'PB_Ludhiana', label: 'Ludhiana' },
    { value: 'PB_Amritsar', label: 'Amritsar' },
  ],
  'Rajasthan': [
    { value: 'RJ_Jaipur', label: 'Jaipur' },
    { value: 'RJ_Jodhpur', label: 'Jodhpur' },
    { value: 'RJ_Kota', label: 'Kota' },
  ],
  'Sikkim': [{ value: 'SK_Gangtok', label: 'Gangtok' }],
  'Tamil Nadu': [
    { value: 'TN_Chennai', label: 'Chennai' },
    { value: 'TN_Coimbatore', label: 'Coimbatore' },
    { value: 'TN_Madurai', label: 'Madurai' },
  ],
  'Telangana': [
    { value: 'TS_Hyderabad', label: 'Hyderabad' },
    { value: 'TS_Warangal', label: 'Warangal' },
  ],
  'Tripura': [{ value: 'TR_Agartala', label: 'Agartala' }],
  'Uttar Pradesh': [
    { value: 'UP_Lucknow', label: 'Lucknow' },
    { value: 'UP_Kanpur', label: 'Kanpur' },
    { value: 'UP_Varanasi', label: 'Varanasi' },
  ],
  'Uttarakhand': [
    { value: 'UT_Dehradun', label: 'Dehradun' },
    { value: 'UT_Haridwar', label: 'Haridwar' },
  ],
  'West Bengal': [
    { value: 'WB_Kolkata', label: 'Kolkata' },
    { value: 'WB_Asansol', label: 'Asansol' },
  ],
};

const states = Object.keys(markets);

const initialState: MandiPriceState = {};

type SortKey = keyof Commodity;
type SortDirection = 'asc' | 'desc';

export function MandiPricesForm() {
  const [state, formAction] = useActionState(getCommodityPrices, initialState);
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'commodity', direction: 'asc' });
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<string>('');

  const availableMarkets = selectedState ? markets[selectedState as keyof typeof markets] : [];

  const sortedCommodities = useMemo(() => {
    let sortableItems = [...(state.data?.commodities || [])];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [state.data?.commodities, sortConfig]);

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
      <Card className="max-w-2xl mx-auto w-full">
        <form action={formAction}>
           <input type="hidden" name="market" value={selectedMarket} />
          <CardHeader>
            <CardTitle className="font-headline">{t('mandi_prices.form_title')}</CardTitle>
            <CardDescription>{t('mandi_prices.form_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={handleStateChange} value={selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
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
                  <Label htmlFor="market">Market</Label>
                  <Select onValueChange={setSelectedMarket} value={selectedMarket} disabled={!selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a market" />
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
            <CardTitle className="font-headline">{t('mandi_prices.results_title', { market: state.market! })}</CardTitle>
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
                    {sortedCommodities.length > 0 ? (
                        sortedCommodities.map((item) => (
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
