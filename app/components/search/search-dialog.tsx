'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentLoader } from '../common/content-loader';
import { useSearch } from './search-context';
import SearchCustomers from './search-customers';
import SearchEmpty from './search-empty';
import SearchOrders from './search-orders';
import SearchProducts from './search-products';

export const SearchDialog = ({ trigger }: { trigger: ReactNode }) => {
  const { query, setQuery, resetQuery, isLoading, data } = useSearch();
  const [activeTab, setActiveTab] = useState<string>('');

  const tabs = [
    {
      value: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      component: <SearchOrders />,
      dataKey: 'orders',
    },
    {
      value: 'products',
      label: 'Products',
      icon: Package,
      component: <SearchProducts />,
      dataKey: 'products',
    },
    {
      value: 'customers',
      label: 'Customers',
      icon: Users,
      component: <SearchCustomers />,
      dataKey: 'customers',
    },
  ];

  const availableTabs = tabs
    .map((tab) => {
      const tabData = data?.[tab.dataKey as keyof typeof data] || [];
      return { ...tab, count: tabData.length };
    })
    .filter((tab) => tab.count > 0);

  // Update active tab when data changes
  useEffect(() => {
    if (availableTabs.length > 0) {
      // Only set the active tab if it's not already set to a valid tab
      if (!activeTab || !availableTabs.some((tab) => tab.value === activeTab)) {
        setActiveTab(availableTabs[0].value);
      }
    } else {
      setActiveTab('');
    }
  }, [availableTabs, activeTab]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleResetSearch = () => {
    resetQuery();
  };

  const handleOpenModal = () => {
    resetQuery(); // Fetch predefined data on modal open
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      // Clear everything when closing
      resetQuery();
      setActiveTab('');
    } else {
      // Existing open behavior
      handleOpenModal();
    }
  };

  return (
    <Dialog onOpenChange={handleModalChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        close={false}
        className="gap-0 p-0 space-y-0 sm:max-w-[650px]"
      >
        <DialogHeader className="border-b border-border space-y-0 mb-2">
          <DialogTitle className="flex items-center justify-between px-3.5">
            <Search className={cn('shrink-0 ms-1 size-4 opacity-50')} />
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="Search records..."
              className="font-medium text-sm h-14 ps-2.5 pe-5 focus-visible:ring-0 shadow-none border-0"
            />
            {query.length > 0 && (
              <Button variant="dim" size="xs" onClick={handleResetSearch}>
                <X className="size-3.5!" /> Reset
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search Dialog
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[400px] pb-0">
          {isLoading ? (
            <ContentLoader className="mt-[150px]" />
          ) : availableTabs.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="">
              <TabsList
                variant="line"
                className="justify-start w-full px-5 gap-6"
              >
                {availableTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="pt-2.5 pb-3 flex items-center gap-2"
                  >
                    <tab.icon className="size-4 opacity-60" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollArea className="h-[355px]">
                {availableTabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="py-2.5 px-5 focus-visible:outline-none"
                  >
                    {tab.component}
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          ) : (
            <SearchEmpty />
          )}
        </div>

        <div className="flex items-center justify-between gap-2.5 px-5 py-3 bg-muted/20 rounded-b-md border-t border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <Kbd size="sm">
                <ArrowUp className="size-3" />
              </Kbd>
              <Kbd size="sm">
                <ArrowDown className="size-3" />
              </Kbd>
            </div>
            <span className="text-muted-foreground text-xs">Navigate</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-muted-foreground text-xs">Exit</span>
            <Kbd size="sm">esc</Kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
