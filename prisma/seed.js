/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const rolesData = require('./data/roles');
const permissionsData = require('./data/permissions');

const prisma = new PrismaClient();

async function main() {
  console.log('Running database seeding...');

  await prisma.$transaction(
    async (tx) => {
      // Ensure the admin role exists
      const adminRole = await tx.userRole.upsert({
        where: { slug: 'admin' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          slug: 'admin',
          name: 'Administrator',
          description: 'Administrator with full access to manage the system',
          isProtected: true,
          isDefault: false, // Optional: set to false if it's not the default role
        },
      });

      // Create the admin user
      const hashedPassword = await bcrypt.hash('12345', 10);
      const demoPassword = await bcrypt.hash('1234567', 10);

      await tx.user.upsert({
        where: { email: 'aze@kidschurch.com' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          email: 'aze@kidschurch.com',
          name: 'Aze Gedalanga',
          password: demoPassword,
          roleId: adminRole.id,
          avatar: null, // Optional: Add avatar URL if available
          emailVerifiedAt: new Date(), // Optional: Mark email as verified
          status: 'ACTIVE',
        },
      });

      // const adminUser = await tx.user.upsert({
      //   where: { email: 'parent@gmail.com' },
      //   update: {}, // No updates needed, ensures idempotency
      //   create: {
      //     email: 'parent@gmail.com',
      //     name: 'Mary Thess',
      //     password: hashedPassword,
      //     roleId: adminRole.id,
      //     avatar: null, // Optional: Add avatar URL if available
      //     emailVerifiedAt: new Date(), // Optional: Mark email as verified
      //     status: 'ACTIVE',
      //   },
      // });

      // Seed UserRoles
      await tx.userRole.upsert({
        where: { slug: 'member' },
        update: {}, // No updates needed, ensures idempotency
        create: {
          slug: 'member',
          name: 'Member',
          description: 'Default member role',
          isDefault: true,
          isProtected: true,
          createdAt: new Date(),
        },
      });

      // Seed Roles
      for (const role of rolesData) {
        await tx.userRole.upsert({
          where: { slug: role.slug },
          update: {},
          create: {
            slug: role.slug,
            name: role.name,
            description: role.description,
            isDefault: role.isDefault || false,
            isProtected: role.isProtected || false,
            createdAt: new Date(),
            createdByUserId: adminUser.id,
          },
        });
      }
      console.log('Roles seeded.');

      // Seed Permissions
      for (const permission of permissionsData) {
        await tx.userPermission.upsert({
          where: { slug: permission.slug },
          update: {},
          create: {
            slug: permission.slug,
            name: permission.name,
            description: permission.description,
            createdAt: new Date(),
            createdByUserId: adminUser.id,
          },
        });
      }
      console.log('Permissions seeded.');

      // Seed Role Permissions
      const seededRoles = await tx.userRole.findMany();
      const seededPermissions = await tx.userPermission.findMany();

      const userRolePermissionPromises = seededRoles.flatMap((role) => {
        // Generate a random number between 3 and 12 (inclusive)
        const numberOfPermissions =
          Math.floor(Math.random() * (12 - 3 + 1)) + 3;

        // Randomly shuffle the permissions array and select the required number
        const randomizedPermissions = seededPermissions
          .sort(() => Math.random() - 0.5)
          .slice(0, numberOfPermissions);

        // Create promises for each selected permission
        return randomizedPermissions.map((permission) =>
          tx.userRolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id,
              assignedAt: new Date(),
            },
          }),
        );
      });

      await Promise.all(userRolePermissionPromises);
      console.log('UserRolePermissions seeded.');

      // Seed Notifications
      // Define arrays of subjects and messages
      const subjects = [
        'New user signed up',
        'Product added to the catalog',
        'Order processed successfully',
        'System maintenance scheduled',
        'Inventory updated',
        'Payment received',
        'User permissions updated',
        'Order canceled',
        'New feature released',
        'System alert: Action required',
      ];

      const messages = [
        'A new user has registered on the platform.',
        'A product was successfully added to the inventory.',
        'An order has been processed and is now complete.',
        'System maintenance has been scheduled for this weekend.',
        'The inventory for a product has been updated.',
        'A payment was received and recorded successfully.',
        'Permissions for a user have been updated.',
        'An order was canceled and needs review.',
        'A new feature is now available for all users.',
        'A system alert requires your immediate attention.',
      ];

      // Seed Notifications
      const notificationPromises = Array.from({ length: 50 }).map(() => {
        const entity = faker.helpers.arrayElement([
          { type: 'user', id: faker.helpers.arrayElement(users).id },
          { type: 'product', id: faker.helpers.arrayElement(products).id },
          { type: 'category', id: faker.helpers.arrayElement(categories).id },
          { type: 'order', id: faker.helpers.arrayElement(orders).id },
        ]);

        return tx.systemNotification.create({
          data: {
            userId: faker.helpers.arrayElement(users).id,
            type: faker.helpers.arrayElement(['SYSTEM', 'ACTION', 'INFO']),
            subject: faker.helpers.arrayElement(subjects),
            message: faker.helpers.arrayElement(messages),
            entityId: entity.id,
            entityType: entity.type,
            createdAt: new Date(),
          },
        });
      });
      await Promise.all(notificationPromises);

      // Seed AuditLogs
      const meaningfulVerbs = [
        'created',
        'updated',
        'deleted',
        'requested',
        'reset',
        'terminated',
        'fetched',
        'reviewed',
      ];

      const systemLogPromises = Array.from({ length: 50 }).map(() => {
        const entity = faker.helpers.arrayElement([
          { type: 'user', id: faker.helpers.arrayElement(users).id },
          { type: 'product', id: faker.helpers.arrayElement(products).id },
          { type: 'category', id: faker.helpers.arrayElement(categories).id },
          { type: 'order', id: faker.helpers.arrayElement(orders).id },
        ]);

        const event = faker.helpers.arrayElement([
          'CREATE',
          'UPDATE',
          'DELETE',
          'FETCH',
        ]);

        // Map meaningful verbs based on the event type
        const verbMap = {
          CREATE: ['created', 'added', 'initialized', 'generated'],
          UPDATE: ['updated', 'modified', 'changed', 'edited'],
          DELETE: ['deleted', 'removed', 'cleared', 'erased'],
          FETCH: ['fetched', 'retrieved', 'requested', 'accessed'],
        };

        const descriptionVerb = faker.helpers.arrayElement(
          verbMap[event] || meaningfulVerbs, // Fallback to the generic meaningfulVerbs
        );

        return tx.systemLog.create({
          data: {
            event,
            userId: faker.helpers.arrayElement(users).id,
            entityId: entity.id,
            entityType: entity.type,
            description: `${entity.type} was ${descriptionVerb}`,
            createdAt: new Date(),
            ipAddress: faker.internet.ipv4(),
          },
        });
      });

      await Promise.all(systemLogPromises);

      // Seed Settings
      await tx.systemSetting.create({
        data: {
          name: 'Kids Church',
        },
      });
      console.log('Settings seeded.');

      console.log('Database seeding completed!');
    },
    {
      timeout: 520000,
      maxWait: 520000,
    },
  );
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
