'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getInitials } from '@lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@reui/ui/avatar';
import { Button } from '@reui/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@reui/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@reui/ui/form';
import { Input } from '@reui/ui/input';
import { Spinner } from '@reui/ui/spinners';
import {
  AccountProfileSchema,
  AccountProfileSchemaType,
} from '../forms/account-profile-schema';
import { useAccount } from './account-context';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@reui/ui/select';

export default function AccountDetails() {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const { user } = useAccount();

  const [avatarExistingPreview, setAvatarExistingPreview] = useState<
    string | null
  >(null);
  const [avatarAttachedPreview, setAvatarAttachedPreview] = useState<
    string | null
  >(null);
  const avatarFileRef = useRef<HTMLInputElement | null>(null);

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

  // Ensure all fields have default values
  const transformedProfile: AccountProfileSchemaType = {
    ...user,
    avatarFile: null,
    avatarAction: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || ''
  };

  useEffect(() => {
    if (user?.avatar) {
      setAvatarExistingPreview(user.avatar);
      setAvatarAttachedPreview(null);
    }
  }, [user]);

  const form = useForm<AccountProfileSchemaType>({
    resolver: zodResolver(AccountProfileSchema),
    defaultValues: transformedProfile,
    mode: 'onSubmit',
  });

  const mutation = useMutation({
    mutationFn: async (values: AccountProfileSchemaType) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === 'avatarFile' && values.avatarFile instanceof File) {
          formData.append('avatarFile', values.avatarFile);
        } else if (key !== 'avatarFile') {
          formData.append(
            key,
            values[key as keyof AccountProfileSchemaType] as string,
          );
        }
      });

      const response = await fetch('/api/account/profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['account-profile'] });

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>Account updated successfully</AlertTitle>
        </Alert>
      ));

      setTimeout(() => {
        // Update user session and reload app
        if (session) {
          updateSession({
            user: updatedUser,
          });
        }
      }, 1000);
    },
    onError: (error: Error) => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
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

  const handleRemoveAvatar = () => {
    setAvatarExistingPreview(null);
    form.trigger('avatarFile');
    form.setValue('avatarFile', null);
    form.setValue('avatarAction', 'remove', { shouldDirty: true });
  };

  const handleCancelAvatar = () => {
    setAvatarAttachedPreview(null);
    if (user.avatar) {
      setAvatarExistingPreview(user.avatar);
    }
    form.setValue('avatarFile', null);
    form.setValue('avatarAction', '', { shouldDirty: true });
  };

  const handleChangeAvatar = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<AccountProfileSchemaType, 'avatarFile'>,
  ) => {
    const file = e.target.files?.[0] || null;
    field.onChange(file);
    form.trigger('avatarFile');
    form.setValue('avatarFile', file);
    form.setValue('avatarAction', 'save', { shouldDirty: true });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarAttachedPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarAttachedPreview(null);
    }
  };

  const handleFormReset = () => {
    form.reset(transformedProfile);
  };

  const handleSubmit = (values: AccountProfileSchemaType) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage profile information</CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent className="py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 lg:w-[500px] mx-auto"
          >
            {/* Avatar */}
            <FormField
              control={form.control}
              name="avatarFile"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <Avatar className="size-24">
                      <AvatarImage
                        src={
                          avatarAttachedPreview ||
                          avatarExistingPreview ||
                          undefined
                        }
                        alt={user.firstName || ''}
                      />
                      <AvatarFallback className="text-2xl">
                        {getInitials(user.firstName || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <FormLabel>Profile Avatar</FormLabel>
                      <FormControl className="my-1.5">
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => avatarFileRef.current?.click()}
                            >
                              Attach Image
                            </Button>

                            {avatarAttachedPreview ||
                            (!avatarAttachedPreview &&
                              !avatarExistingPreview &&
                              user.avatar) ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelAvatar}
                              >
                                Cancel
                              </Button>
                            ) : null}

                            {user.avatar &&
                            avatarExistingPreview &&
                            !avatarAttachedPreview ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveAvatar}
                              >
                                Remove
                              </Button>
                            ) : null}
                          </div>
                          <input
                            ref={avatarFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleChangeAvatar(e, field)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        We support PNGs, JPEGs, and GIFs under 1MB.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={handleFormReset}>
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isProcessing}
              >
                {isProcessing && <Spinner className="animate-spin" />}
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
