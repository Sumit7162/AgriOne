
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

  const marketsData = t('mandi_prices.markets', { returnObjects: true }) as Record<string, { value: string; label: string }[]>;
  const commoditiesData = t('mandi_prices.commodities', { returnObjects: true });
  
  const commodities = Array.isArray(commoditiesData) ? commoditiesData : Object.keys(commoditiesData);
  const states = Array.isArray(marketsData) ? [] : Object.keys(marketsData);

  const availableMarkets = useMemo(() => {
    if (!selectedState || !marketsData || typeof marketsData !== 'object' || Array.isArray(marketsData)) {
      return [];
    }
    const markets = marketsData[selectedState as keyof typeof marketsData];
    return Array.isArray(markets) ? markets : [];
  }, [selectedState, marketsData]);


  const filteredAndSortedCommodities = useMemo(() => {
    let filteredItems = [...(state.data?.commodities || [])];

    if (selectedCommodity && selectedCommodity !== 'all') {
      const translatedCommodity = Object.entries(commoditiesData).find(([key, value]) => value === selectedCommodity)?.[0] || selectedCommodity;
      filteredItems = filteredItems.filter(item => item.commodity.toLowerCase() === translatedCommodity.toLowerCase());
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
  }, [state.data?.commodities, sortConfig, selectedCommodity, commoditiesData]);

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

  const getTranslatedCommodityName = (commodity: string) => {
    if (Array.isArray(commoditiesData) || !commoditiesData) {
      return commodity;
    }
    return (commoditiesData as Record<string, string>)[commodity] || commodity;
  }


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
                            <SelectItem key={commodity} value={getTranslatedCommodityName(commodity)}>
                            {getTranslatedCommodityName(commodity)}
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
            <CardTitle className="font-headline">{t('mandi_prices.results_title', { market: availableMarkets?.find(m => m.value === state.market!)?.label || state.market! })}</CardTitle>
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
                                <TableCell className="font-medium">{getTranslatedCommodityName(item.commodity)}</TableCell>
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
