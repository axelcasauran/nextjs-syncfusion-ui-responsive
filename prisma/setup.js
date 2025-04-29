const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
const departmentData = require('./data/departments');
const rolesData = require('./data/roles');
const usersData = require('./data/users');

async function main() {
  console.log('Setting up database...');

  await prisma.$transaction(
    async (tx) => {

      // Create system department
      const systemDepartment = await tx.department.upsert({
        where: { slug: 'system' },
        update: {},
        create: {
          slug: 'system',
          name: 'System',
          description: 'System Department of Kids Church',
          isDefault: false,
          isProtected: true
        },
      });
      
      // Create super admin role
      const adminRole = await tx.userRole.upsert({
        where: { slug: 'super' },
        update: {},
        create: {
          slug: 'super',
          name: 'Super Admin',
          description: 'Super Administrator with full access to manage the system',
          isProtected: true,
          isDefault: false,
        },
      });

      // Create super admin user
      const usersPassword = await bcrypt.hash('1234567', 10);
      const adminPassword = await bcrypt.hash('admin1234', 10);

      const adminUser = await tx.user.upsert({
        where: { email: 'axel@kidschurch.com' },
        update: {},
        create: {
          email: 'axel@kidschurch.com',
          firstName: 'Axel',
          middleName: 'Agad',
          lastName: 'Casauran',
          password: adminPassword,
          roleId: adminRole.id,
          avatar: null,
          emailVerifiedAt: new Date(),
          status: 'ACTIVE',
          gender: 'Male',
          mobilenumber: '09173003787',
          qrCode: 'axel@kidschurch.com',
          departmentId: systemDepartment.id
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

      // Seed Departments
      for (const dep of departmentData) {
        await tx.department.upsert({
          where: { slug: dep.slug },
          update: {},
          create: {
            slug: dep.slug,
            name: dep.name,
            description: dep.description,
            isDefault: dep.isDefault || false,
            isProtected: dep.isProtected || false
          },
        });
      }
      console.log('Departments seeded.');

      // Seed Users
      for (const user of usersData) {
        const role = await tx.userRole.findFirst({
          where: { slug: user.roleSlug },
        });
        const department = await tx.department.findFirst({
          where: { isDefault: true },
        });
        await tx.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            gender: user.gender,
            mobilenumber: user.mobilenumber,
            qrCode: user.qrCode,
            password: usersPassword,
            departmentId: department.id,
            avatar: user.avatar ? '/media/avatars/' + user.avatar : null,
            roleId: role.id,
            emailVerifiedAt: new Date(),
            status: 'ACTIVE',
            createdAt: new Date(),
          },
        });
      }
      console.log('Users seeded.');

      // Settings
      tx.systemSetting.create({
        data: {
          name: 'Kids Church',
        },
      });
      console.log('Settings seeded.');

      console.log('Database setup completed!');
    },
    {
      timeout: 120000,
      maxWait: 120000,
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
