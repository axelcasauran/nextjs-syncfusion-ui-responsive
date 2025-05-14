'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { Button } from '@reui/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@reui/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@reui/ui/form';
import { Input } from '@reui/ui/input';
import { Spinner } from '@reui/ui/spinners';
import { ConfirmDismissDialog } from '@components/common/confirm-dismiss-dialog';
import { KidSchema, KidSchemaType } from '../forms/kid';
import { Kid } from '@/src/business-layer/church-management/models/kid';

import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@reui/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@reui/ui/popover';
// import { DateRange } from 'react-day-picker';
import {
  // endOfMonth,
  // endOfYear,
  format,
  // isEqual,
  // startOfDay,
  // startOfMonth,
  // startOfYear,
  // subDays,
  // subMonths,
  // subYears,
} from 'date-fns';
// import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reui/ui/select';

const genderList = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  }
];

const KidEditDialog = ({
  open,
  closeDialog,
  kid,
}: {
  open: boolean;
  closeDialog: () => void;
  kid?: Kid | null;
}) => {
  const queryClient = useQueryClient();

  // State to manage the confirm dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form initialization
  const _year = '01/01/2015';
  const form = useForm<KidSchemaType>({
    resolver: zodResolver(KidSchema),
    defaultValues: { firstName: '', middleName: '', lastName: '', birthDate: new Date(_year).toString(), gender: '' },
    mode: 'onSubmit',
  });

  // Reset form values when dialog is opened
  useEffect(() => {
    if (open) {
      form.reset({
        firstName: kid?.firstName || '',
        middleName: kid?.middleName || '',
        lastName: kid?.lastName ?? '',
        birthDate: kid?.birthDate ?? new Date(_year).toString(),
        gender: kid?.gender ?? ''
      });
    }
  }, [open, kid, form]);


  // Date picker
  const [date, setDate] = React.useState<Date>(new Date(_year));
  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    setDate(new Date(_year));
    e.preventDefault();
  };

  React.useEffect(() => {
    form.setValue('birthDate', date ? date.toLocaleDateString() : '', { shouldDirty: true});
  }, [date, form]);

  // ++++++++++++++++++++++++++++++++++++

  // const today = new Date();
  // // Define preset ranges in an array
  // const presets = [
  //   { label: 'Today', range: { from: today, to: today } },
  //   {
  //     label: 'Yesterday',
  //     range: { from: subDays(today, 1), to: subDays(today, 1) },
  //   },
  //   { label: 'Last 7 days', range: { from: subDays(today, 6), to: today } },
  //   { label: 'Last 30 days', range: { from: subDays(today, 29), to: today } },
  //   { label: 'Month to date', range: { from: startOfMonth(today), to: today } },
  //   {
  //     label: 'Last month',
  //     range: {
  //       from: startOfMonth(subMonths(today, 1)),
  //       to: endOfMonth(subMonths(today, 1)),
  //     },
  //   },
  //   { label: 'Year to date', range: { from: startOfYear(today), to: today } },
  //   {
  //     label: 'Last year',
  //     range: {
  //       from: startOfYear(subYears(today, 1)),
  //       to: endOfYear(subYears(today, 1)),
  //     },
  //   },
  // ];
  // const [month, setMonth] = useState(today);
  // const defaultPreset = presets[2];
  // const [date, setDate] = useState<DateRange | undefined>(defaultPreset.range); // Default: Last 7 days
  // const [selectedPreset, setSelectedPreset] = useState<string | null>(
  //   defaultPreset.label,
  // );
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // const handleApply = () => {
  //   if (date) {
  //     setDate(date);
  //   }
  //   setIsPopoverOpen(false);
  // };
  // const handleReset = () => {
  //   setDate(defaultPreset.range);
  //   setSelectedPreset(defaultPreset.label);
  //   setIsPopoverOpen(false);
  // };
  // const handleSelect = (selected: DateRange | undefined) => {
  //   setDate({
  //     from: selected?.from || undefined,
  //     to: selected?.to || undefined,
  //   });
  //   setSelectedPreset(null); // Clear preset when manually selecting a range
  // };
  // // Update `selectedPreset` whenever `date` changes
  // useEffect(() => {
  //   const matchedPreset = presets.find(
  //     (preset) =>
  //       isEqual(
  //         startOfDay(preset.range.from),
  //         startOfDay(date?.from || new Date(0)),
  //       ) &&
  //       isEqual(
  //         startOfDay(preset.range.to),
  //         startOfDay(date?.to || new Date(0)),
  //       ),
  //   );
  //   setSelectedPreset(matchedPreset?.label || null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [date]);


  // React.useEffect(() => {
  //   form.setValue('birthDate', date ? date.toLocaleDateString() : '', { shouldDirty: true});
  // }, [date]);



  // ++++++++++++++

  // Mutation for creating/updating kid
  const mutation = useMutation({
    mutationFn: async (values: KidSchemaType) => {
      const isEdit = !!kid?.id;
      const url = isEdit ? `/api/parents/kids/${kid.id}` : '/api/parents/kids';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: () => {
      const message = kid
        ? 'Kid updated successfully'
        : 'Kid added successfully';

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ));

      queryClient.invalidateQueries({ queryKey: ['kids'] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Alert variant="mono" icon="destructive">
          <AlertIcon>
            <RiErrorWarningFill />
          </AlertIcon>
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      ));
    },
  });

  // Derive the loading state from the mutation status
  const isLoading = mutation.status === 'pending';

  // Handle form submission
  const handleSubmit = (values: KidSchemaType) => {
    mutation.mutate(values);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      closeDialog();
    }
  };

  // Handle confirmation to discard changes
  const handleConfirmDiscard = () => {
    form.reset();
    setShowConfirmDialog(false);
    closeDialog();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent close={false}>
          <DialogHeader>
            <DialogTitle>
              {kid ? 'Edit Kid' : 'Add Kid'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {genderList?.map((gender) => (
                              <SelectItem key={gender.value} value={gender.value}>
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>

                    {/* <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          mode="input"
                          placeholder={!date?.from && !date?.to}
                          className="w-[250px]"
                        >
                          <CalendarIcon />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(date.from, 'LLL dd, y')
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <div className="flex max-sm:flex-col">
                          <div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-32">
                            <div className="h-full border-border sm:border-e py-2">
                              <div className="flex flex-col px-2 gap-[2px]">
                                {presets.map((preset, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                      'h-8 w-full justify-start',
                                      selectedPreset === preset.label && 'bg-accent',
                                    )}
                                    onClick={() => {
                                      setDate(preset.range);
                                      // Update the calendar to show the starting month of the selected range
                                      setMonth(preset.range.from || today);
                                      setSelectedPreset(preset.label); // Explicitly set the active preset
                                    }}
                                  >
                                    {preset.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Calendar
                            autoFocus
                            mode="range"
                            month={month}
                            onMonthChange={setMonth}
                            showOutsideDays={false}
                            selected={date}
                            onSelect={handleSelect}
                            numberOfMonths={2}
                          />
                        </div>
                        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                          <Button variant="outline" size="sm" onClick={handleReset}>
                            Reset
                          </Button>
                          <Button size="sm" onClick={handleApply}>
                            Apply
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover> */}




                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative w-[250px]">
                            <Button
                              variant="outline"
                              mode="input"
                              placeholder={!field}
                              className="w-full"                              
                              type='button'
                            >
                              <CalendarIcon />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                            {date && (
                              <Button
                                variant="dim"
                                size="xs"
                                className="absolute top-1/2 -end-0 -translate-y-1/2"
                                onClick={handleReset}                                
                                type='button'
                              >
                                <X />
                              </Button>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar required mode="single" selected={new Date(_year)} onSelect={setDate} autoFocus />
                        </PopoverContent>
                      </Popover>                      



                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                >
                  {isLoading && <Spinner className="animate-spin" />}
                  {kid ? 'Update Kid' : 'Add Kid'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmDismissDialog
        open={showConfirmDialog}
        onOpenChange={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
};

export default KidEditDialog;
