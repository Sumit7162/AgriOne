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

const initialState: MandiPriceState = {};

type SortKey = keyof Commodity;
type SortDirection = 'asc' | 'desc';

export function MandiPricesForm() {
  const [state, formAction] = useActionState(getCommodityPrices, initialState);
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'commodity', direction: 'asc' });

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
          <CardHeader>
            <CardTitle className="font-headline">{t('mandi_prices.form_title')}</CardTitle>
            <CardDescription>{t('mandi_prices.form_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="market">{t('mandi_prices.market_label')}</Label>
              <Input
                id="market"
                name="market"
                placeholder={t('mandi_prices.market_placeholder')}
                defaultValue="MP_Bhopal"
              />
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertTitle>{t('common.error')}</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">
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
