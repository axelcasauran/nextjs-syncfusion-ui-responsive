'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinners';
import { VolunteerSchema, VolunteerSchemaType } from '../forms/volunteer-schema';
import { User } from '@/app/models/user';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department } from '@/app/models/department';
import { useDepartmentSelectQuery } from '../../departments/hooks/use-department-select-query';

const VolunteerEditDialog = ({
  open,
  closeDialog,
  user,
}: {
  open: boolean;
  closeDialog: () => void;
  user?: User | null;
}) => {
  const queryClient = useQueryClient();

  // Fetch available department
  const { data: departmentList } = useDepartmentSelectQuery();  

  const form = useForm<VolunteerSchemaType>({
    resolver: zodResolver(VolunteerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      departmentId: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        departmentId: user?.department?.id || '',
      });
    }
  }, [open, user, form]);

  const mutation = useMutation({
    mutationFn: async (values: VolunteerSchemaType) => {
      const response = await fetch('/api/user-management/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: () => {
      const message = 'Volunteer added successfully';
      toast.custom(
        () => (
          <Alert variant="mono" icon="success" close={false}>
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );

      queryClient.invalidateQueries({ queryKey: ['user-users'] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive" close={false}>
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>{error.message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
    },
  });

  const isProcessing = mutation.status === 'pending';

  const handleSubmit = (values: VolunteerSchemaType) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Volunteer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogBody className="pt-2.5 space-y-6">
              <FormField
                control={form.control}
                name="firstName"                
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="Enter user email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {departmentList?.map((department: Department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
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
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isProcessing}
              >
                {isProcessing && <Spinner className="animate-spin" />}
                Edit Volunteer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerEditDialog;
